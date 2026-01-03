const Payment = require('../models/Payment');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const razorpayService = require('../services/razorpay.service');
const stripeService = require('../services/stripe.service');
const emailService = require('../services/email.service');
const crypto = require('crypto');

// Initialize payment
exports.initializePayment = async (req, res, next) => {
    try {
        console.log('Initialize payment called:', req);
        const { planId, paymentMethod, couponCode, billingAddress } = req.body;
        const userId = req.user.id;

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Validate plan
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        // Calculate amount
        let amount = plan.currentPrice;
        let taxAmount = amount * (plan.taxPercentage / 100);
        let discountAmount = 0;
        let appliedCoupons = [];

        // Apply coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon) {
                const validation = coupon.validateCoupon(planId, userId, amount);
                if (validation.valid) {
                    discountAmount = validation.discount;
                    appliedCoupons.push({
                        code: coupon.code,
                        discount: coupon.discountType === 'percentage' ? coupon.discountValue : null,
                        discountAmount: validation.discount
                    });
                }
            }
        }

        const netAmount = amount - discountAmount;
        const totalAmount = netAmount + taxAmount;

        // Create payment record
        const payment = await Payment.create({
            user: userId,
            plan: planId,
            amount: totalAmount,
            taxAmount,
            discountAmount,
            couponApplied: appliedCoupons,
            paymentMethod,
            billingAddress: {
                name: billingAddress?.name || user.name,
                email: billingAddress?.email || user.email,
                phone: billingAddress?.phone || user.phone,
                address: billingAddress?.address,
                city: billingAddress?.city,
                state: billingAddress?.state,
                country: billingAddress?.country || 'IN',
                pincode: billingAddress?.pincode
            },
            status: 'pending',
            metadata: {
                planName: plan.name,
                basePrice: plan.basePrice,
                taxPercentage: plan.taxPercentage
            }
        });

        // Generate payment link based on method
        let paymentData;
        if (paymentMethod === 'upi' || paymentMethod === 'net_banking' || paymentMethod === 'wallet') {
            // Use Razorpay for Indian payments
            paymentData = await razorpayService.createOrder({
                amount: Math.round(totalAmount * 100), // Convert to paise
                currency: 'INR',
                receipt: `receipt_${payment._id}`,
                notes: {
                    paymentId: payment._id.toString(),
                    planId: planId,
                    userId: userId
                }
            });

            // Update payment with gateway details
            payment.paymentDetails.gatewayTransactionId = paymentData.id;
            payment.paymentDetails.paymentGateway = 'razorpay';
            await payment.save();

        } else if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
            // Use Stripe for international cards
            paymentData = await stripeService.createPaymentIntent({
                amount: Math.round(totalAmount * 100), // Convert to cents
                currency: 'inr',
                metadata: {
                    paymentId: payment._id.toString(),
                    planId: planId,
                    userId: userId
                }
            });

            // Update payment with gateway details
            payment.paymentDetails.gatewayTransactionId = paymentData.id;
            payment.paymentDetails.paymentGateway = 'stripe';
            await payment.save();
        }

        res.status(200).json({
            success: true,
            message: 'Payment initialized successfully',
            data: {
                paymentId: payment._id,
                amount: totalAmount,
                currency: 'INR',
                paymentData: paymentData,
                planDetails: {
                    name: plan.name,
                    description: plan.description,
                    features: plan.features
                }
            }
        });

    } catch (error) {
        console.error('Initialize payment error:', error);
        next(error);
    }
};

// Process payment callback (Razorpay)
exports.paymentCallback = async (req, res, next) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }

        // Find payment by order ID
        const payment = await Payment.findOne({
            'paymentDetails.gatewayTransactionId': razorpay_order_id
        }).populate('plan user');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Update payment status
        payment.status = 'completed';
        payment.paymentDetails.transactionId = razorpay_payment_id;
        payment.updatedAt = new Date();
        await payment.save();

        // Update user subscription
        const user = payment.user;
        user.subscription = {
            plan: payment.plan._id,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            autoRenew: true
        };
        await user.save();

        // Send confirmation email
        await emailService.sendPaymentConfirmation({
            to: user.email,
            name: user.name,
            planName: payment.plan.name,
            amount: payment.amount,
            transactionId: razorpay_payment_id,
            startDate: user.subscription.startDate,
            endDate: user.subscription.endDate
        });

        res.status(200).json({
            success: true,
            message: 'Payment successful',
            data: {
                paymentId: payment._id,
                status: payment.status,
                transactionId: razorpay_payment_id,
                subscription: user.subscription
            }
        });

    } catch (error) {
        console.error('Payment callback error:', error);
        next(error);
    }
};

// Process OTP verification
exports.verifyOTP = async (req, res, next) => {
    try {
        const { paymentId, otp } = req.body;
        const userId = req.user.id;

        // Find payment
        const payment = await Payment.findOne({
            _id: paymentId,
            user: userId
        }).populate('user plan');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Verify OTP
        const isOTPValid = payment.user.verifyOTP(otp);
        if (!isOTPValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Update payment status
        payment.status = 'completed';
        payment.updatedAt = new Date();
        await payment.save();

        // Update user subscription
        const user = payment.user;
        user.subscription = {
            plan: payment.plan._id,
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            autoRenew: true
        };
        await user.save();

        // Send confirmation email
        await emailService.sendPaymentConfirmation({
            to: user.email,
            name: user.name,
            planName: payment.plan.name,
            amount: payment.amount,
            transactionId: payment._id.toString().slice(-12),
            startDate: user.subscription.startDate,
            endDate: user.subscription.endDate
        });

        res.status(200).json({
            success: true,
            message: 'Payment verified and completed successfully',
            data: {
                paymentId: payment._id,
                status: payment.status,
                subscription: user.subscription
            }
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        next(error);
    }
};

// Get payment history
exports.getPaymentHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const query = { user: userId };
        if (status) {
            query.status = status;
        }

        const payments = await Payment.find(query)
            .populate('plan', 'name description')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Payment.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                payments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        console.error('Get payment history error:', error);
        next(error);
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const payment = await Payment.findOne({
            _id: id,
            user: userId
        }).populate('plan user');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });

    } catch (error) {
        console.error('Get payment by ID error:', error);
        next(error);
    }
};

// Generate OTP for payment
exports.generatePaymentOTP = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP via email (in production, also send via SMS)
        await emailService.sendOTP({
            to: user.email,
            name: user.name,
            otp
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: {
                otpExpiresIn: 10 // minutes
            }
        });

    } catch (error) {
        console.error('Generate OTP error:', error);
        next(error);
    }
};

// Refund payment
exports.refundPayment = async (req, res, next) => {
    try {
        const { paymentId } = req.params;
        const userId = req.user.id;

        const payment = await Payment.findOne({
            _id: paymentId,
            user: userId
        }).populate('plan user');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        if (payment.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Only completed payments can be refunded'
            });
        }

        // Check if payment is within refund period (7 days)
        const paymentDate = new Date(payment.createdAt);
        const now = new Date();
        const daysDifference = (now - paymentDate) / (1000 * 60 * 60 * 24);

        if (daysDifference > 7) {
            return res.status(400).json({
                success: false,
                message: 'Refund period has expired (7 days)'
            });
        }

        // Initiate refund based on payment gateway
        let refund;
        if (payment.paymentDetails.paymentGateway === 'razorpay') {
            refund = await razorpayService.createRefund({
                paymentId: payment.paymentDetails.transactionId,
                amount: Math.round(payment.amount * 100)
            });
        } else if (payment.paymentDetails.paymentGateway === 'stripe') {
            refund = await stripeService.createRefund({
                paymentIntentId: payment.paymentDetails.gatewayTransactionId,
                amount: Math.round(payment.amount * 100)
            });
        }

        // Update payment status
        payment.status = 'refunded';
        payment.metadata.refundId = refund.id;
        payment.metadata.refundedAt = new Date();
        await payment.save();

        // Update user subscription
        const user = payment.user;
        user.subscription.status = 'cancelled';
        await user.save();

        // Send refund confirmation
        await emailService.sendRefundConfirmation({
            to: user.email,
            name: user.name,
            amount: payment.amount,
            refundId: refund.id,
            transactionId: payment.paymentDetails.transactionId
        });

        res.status(200).json({
            success: true,
            message: 'Refund processed successfully',
            data: {
                refundId: refund.id,
                amount: payment.amount,
                status: 'refunded'
            }
        });

    } catch (error) {
        console.error('Refund payment error:', error);
        next(error);
    }
};



// import Payment from '../models/Payment.js';
// import crypto from 'crypto';

// // Generate unique transaction ID
// const generateTransactionId = () => {
//   const timestamp = Date.now();
//   const random = crypto.randomBytes(4).toString('hex');
//   return `TXN${timestamp}${random}`.toUpperCase();
// };

// // @desc    Initialize payment
// // @route   POST /api/v1/payments/initialize
// // @access  Public
// export const initializePayment = async (req, res) => {
//   try {
//     const {
//       planId,
//       planName,
//       amount,
//       paymentMethod = 'upi',
//       couponCode = '',
//       customerDetails
//     } = req.body;

//     // Validate required fields
//     if (!planId || !planName || !amount || !customerDetails?.name) {
//       return res.status(400).json({
//         success: false,
//         error: 'MISSING_REQUIRED_FIELDS',
//         message: 'Plan ID, Plan Name, Amount, and Customer Name are required'
//       });
//     }

//     // Calculate discount if coupon applied
//     let discountAmount = 0;
//     let finalAmount = parseFloat(amount);

//     if (couponCode) {
//       // In production, validate coupon code from database
//       const validCoupons = {
//         'WELCOME20': 0.20,
//         'SAVE15': 0.15,
//         'INDIAN10': 0.10,
//         'STARTUP25': 0.25
//       };

//       if (validCoupons[couponCode]) {
//         discountAmount = finalAmount * validCoupons[couponCode];
//         finalAmount = finalAmount - discountAmount;
//       }
//     }

//     // Create payment record
//     const payment = new Payment({
//       planId,
//       planName,
//       amount: parseFloat(amount),
//       currency: 'INR',
//       paymentMethod,
//       couponCode,
//       discountAmount,
//       finalAmount,
//       paymentStatus: 'pending',
//       transactionId: generateTransactionId(),
//       customerDetails: {
//         name: customerDetails.name,
//         email: customerDetails.email || '',
//         phone: customerDetails.phone || '',
//         address: customerDetails.address || '',
//         city: customerDetails.city || '',
//         state: customerDetails.state || '',
//         country: customerDetails.country || 'IN',
//         pincode: customerDetails.pincode || ''
//       },
//       metadata: {
//         ipAddress: req.ip,
//         userAgent: req.get('User-Agent'),
//         ...req.body.metadata
//       }
//     });

//     // Save to MongoDB
//     await payment.save();

//     console.log('💰 Payment initialized and saved to MongoDB:', payment._id);

//     res.status(201).json({
//       success: true,
//       message: 'Payment initialized successfully',
//       data: {
//         paymentId: payment._id,
//         transactionId: payment.transactionId,
//         amount: payment.amount,
//         finalAmount: payment.finalAmount,
//         discountAmount: payment.discountAmount,
//         currency: payment.currency,
//         planName: payment.planName,
//         customerName: payment.customerDetails.name,
//         status: payment.paymentStatus,
//         createdAt: payment.createdAt,
//         paymentMethod: payment.paymentMethod,
//         // For UPI payments
//         upiId: payment.paymentMethod === 'upi' ? 'merchant@upi' : null,
//         // For demo/testing
//         testMode: process.env.NODE_ENV !== 'production'
//       }
//     });

//   } catch (error) {
//     console.error('❌ Payment initialization error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'INTERNAL_SERVER_ERROR',
//       message: 'Failed to initialize payment',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // @desc    Verify OTP and complete payment
// // @route   POST /api/v1/payments/otp/verify
// // @access  Public
// export const verifyOTP = async (req, res) => {
//   try {
//     const { paymentId, otp, transactionId } = req.body;

//     if (!paymentId || !otp) {
//       return res.status(400).json({
//         success: false,
//         error: 'MISSING_PARAMETERS',
//         message: 'Payment ID and OTP are required'
//       });
//     }

//     // Find payment in database
//     const payment = await Payment.findById(paymentId);
    
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: 'PAYMENT_NOT_FOUND',
//         message: 'Payment record not found'
//       });
//     }

//     // Check if payment is already completed
//     if (payment.paymentStatus === 'completed') {
//       return res.status(400).json({
//         success: false,
//         error: 'PAYMENT_ALREADY_COMPLETED',
//         message: 'Payment is already completed'
//       });
//     }

//     // Simulate OTP verification (in production, use real OTP service)
//     // For demo, accept any 6-digit OTP
//     const isOTPValid = /^\d{6}$/.test(otp);

//     if (!isOTPValid) {
//       return res.status(400).json({
//         success: false,
//         error: 'INVALID_OTP',
//         message: 'Invalid OTP format'
//       });
//     }

//     // Update payment status to completed
//     payment.paymentStatus = 'completed';
//     payment.transactionId = transactionId || payment.transactionId;
//     payment.razorpayOrderId = `order_${Date.now()}`;
//     payment.razorpayPaymentId = `pay_${Date.now()}`;
//     payment.metadata.otpVerifiedAt = new Date();
//     payment.metadata.verificationMethod = 'otp';

//     await payment.save();

//     console.log('✅ Payment completed and saved to MongoDB:', payment._id);

//     res.json({
//       success: true,
//       message: 'Payment verified successfully',
//       data: {
//         paymentId: payment._id,
//         transactionId: payment.transactionId,
//         razorpayOrderId: payment.razorpayOrderId,
//         razorpayPaymentId: payment.razorpayPaymentId,
//         amount: payment.amount,
//         finalAmount: payment.finalAmount,
//         currency: payment.currency,
//         planName: payment.planName,
//         status: payment.paymentStatus,
//         completedAt: payment.completedAt,
//         customerName: payment.customerDetails.name,
//         customerEmail: payment.customerDetails.email,
//         invoiceUrl: `/api/v1/payments/${payment._id}/invoice`, // Demo invoice URL
//         receiptNumber: `REC${Date.now()}${payment._id.toString().slice(-6)}`
//       }
//     });

//   } catch (error) {
//     console.error('❌ OTP verification error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'VERIFICATION_FAILED',
//       message: 'Failed to verify payment'
//     });
//   }
// };

// // @desc    Get payment by ID
// // @route   GET /api/v1/payments/:id
// // @access  Public
// export const getPaymentById = async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id);
    
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: 'PAYMENT_NOT_FOUND',
//         message: 'Payment not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: payment
//     });

//   } catch (error) {
//     console.error('❌ Get payment error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'FETCH_FAILED',
//       message: 'Failed to fetch payment details'
//     });
//   }
// };

// // @desc    Get payment history
// // @route   POST /api/v1/payments/history
// // @access  Public
// export const getPaymentHistory = async (req, res) => {
//   try {
//     const { email, phone, page = 1, limit = 10 } = req.body;
    
//     const query = {};
    
//     if (email) {
//       query['customerDetails.email'] = email;
//     }
    
//     if (phone) {
//       query['customerDetails.phone'] = phone;
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [payments, total] = await Promise.all([
//       Payment.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Payment.countDocuments(query)
//     ]);

//     res.json({
//       success: true,
//       data: {
//         payments,
//         pagination: {
//           total,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           totalPages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get payment history error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'FETCH_FAILED',
//       message: 'Failed to fetch payment history'
//     });
//   }
// };

// // @desc    Get payment statistics
// // @route   POST /api/v1/payments/stats/overview
// // @access  Public
// export const getPaymentStats = async (req, res) => {
//   try {
//     const stats = await Payment.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalPayments: { $sum: 1 },
//           totalRevenue: { $sum: '$finalAmount' },
//           successfulPayments: {
//             $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
//           },
//           failedPayments: {
//             $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
//           },
//           pendingPayments: {
//             $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] }
//           },
//           averageOrderValue: { $avg: '$finalAmount' }
//         }
//       }
//     ]);

//     const statsByPlan = await Payment.aggregate([
//       {
//         $group: {
//           _id: '$planName',
//           count: { $sum: 1 },
//           totalAmount: { $sum: '$finalAmount' }
//         }
//       },
//       { $sort: { count: -1 } }
//     ]);

//     res.json({
//       success: true,
//       data: {
//         ...(stats[0] || {
//           totalPayments: 0,
//           totalRevenue: 0,
//           successfulPayments: 0,
//           failedPayments: 0,
//           pendingPayments: 0,
//           averageOrderValue: 0
//         }),
//         statsByPlan
//       }
//     });

//   } catch (error) {
//     console.error('❌ Get payment stats error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'STATS_FAILED',
//       message: 'Failed to fetch payment statistics'
//     });
//   }
// };

// // @desc    Generate invoice for payment
// // @route   GET /api/v1/payments/:id/invoice
// // @access  Public
// export const generateInvoice = async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id);
    
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: 'PAYMENT_NOT_FOUND'
//       });
//     }

//     // Generate invoice HTML (simplified)
//     const invoiceHTML = `
//       <html>
//         <head>
//           <title>Invoice #${payment.transactionId}</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 40px; }
//             .invoice { border: 1px solid #ddd; padding: 30px; max-width: 800px; margin: 0 auto; }
//             .header { text-align: center; margin-bottom: 30px; }
//             .details { margin: 20px 0; }
//             table { width: 100%; border-collapse: collapse; margin: 20px 0; }
//             th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
//             th { background-color: #f5f5f5; }
//             .total { font-weight: bold; font-size: 18px; }
//             .footer { margin-top: 40px; text-align: center; color: #666; }
//           </style>
//         </head>
//         <body>
//           <div class="invoice">
//             <div class="header">
//               <h1>INVOICE</h1>
//               <p>Transaction ID: ${payment.transactionId}</p>
//               <p>Date: ${new Date(payment.createdAt).toLocaleDateString()}</p>
//             </div>
            
//             <div class="details">
//               <h3>Bill To:</h3>
//               <p>${payment.customerDetails.name}</p>
//               ${payment.customerDetails.email ? `<p>${payment.customerDetails.email}</p>` : ''}
//               ${payment.customerDetails.phone ? `<p>${payment.customerDetails.phone}</p>` : ''}
//             </div>
            
//             <table>
//               <thead>
//                 <tr>
//                   <th>Description</th>
//                   <th>Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>${payment.planName} Plan</td>
//                   <td>₹${payment.amount.toFixed(2)}</td>
//                 </tr>
//                 ${payment.discountAmount > 0 ? `
//                 <tr>
//                   <td>Discount (${payment.couponCode})</td>
//                   <td>-₹${payment.discountAmount.toFixed(2)}</td>
//                 </tr>
//                 ` : ''}
//                 <tr class="total">
//                   <td>Total</td>
//                   <td>₹${payment.finalAmount.toFixed(2)}</td>
//                 </tr>
//               </tbody>
//             </table>
            
//             <div class="footer">
//               <p>Payment Status: ${payment.paymentStatus.toUpperCase()}</p>
//               <p>Thank you for your business!</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;

//     res.setHeader('Content-Type', 'text/html');
//     res.send(invoiceHTML);

//   } catch (error) {
//     console.error('❌ Generate invoice error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'INVOICE_FAILED',
//       message: 'Failed to generate invoice'
//     });
//   }
// };


// import Payment from "../models/Payment.js";
// import User from "../models/User.js";
// import Plan from "../models/Plan.js";
// import Coupon from "../models/Coupon.js";
// import crypto from "crypto";
// import emailService from "../services/email.service";
// import razorpayService from "../services/razorpay.service";
// import stripeService from "../services/stripe.service";

// // In-memory OTP storage (use Redis in production)
// const otpStorage = new Map();

// // Generate OTP function
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // Store OTP with expiration
// function storeOTP(key, otp, expiryMinutes = 5) {
//   const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
//   otpStorage.set(key, {
//     otp,
//     expiryTime,
//     attempts: 0,
//     maxAttempts: 3
//   });
// }

// // Verify OTP from storage
// function verifyOTPFromStorage(key, inputOtp) {
//   const stored = otpStorage.get(key);
//   if (!stored) {
//     return { valid: false, error: "OTP not found or expired" };
//   }

//   if (Date.now() > stored.expiryTime) {
//     otpStorage.delete(key);
//     return { valid: false, error: "OTP has expired" };
//   }

//   if (stored.attempts >= stored.maxAttempts) {
//     otpStorage.delete(key);
//     return { valid: false, error: "Too many failed attempts" };
//   }

//   stored.attempts++;

//   if (stored.otp === inputOtp) {
//     otpStorage.delete(key);
//     return { valid: true };
//   }

//   return { valid: false, error: "Invalid OTP" };
// }

// // ============ PAYMENT INITIALIZATION ============
// export const initializePayment = async (req, res) => {
//   try {
//     console.log("💰 Payment initialize called:", req.body);
    
//     // Support both authenticated users (req.user) and explicit userId
//     const userId = req.user?.id || req.body.userId;
//     const { 
//       planId, 
//       planName,
//       paymentMethod = "upi", 
//       couponCode, 
//       billingAddress,
//       mobileNumber,
//       gateway = "razorpay",
//       amount,
//       taxAmount,
//       totalAmount,
//       discountAmount
//     } = req.body;
    
//     // Validate required fields
//     if (!planId || !userId) {
//       return res.status(400).json({
//         success: false,
//         error: "MISSING_REQUIRED_FIELDS",
//         message: "Plan ID and user ID are required"
//       });
//     }

//     // Validate user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: "USER_NOT_FOUND",
//         message: "User not found"
//       });
//     }

//     let plan;
//     let calculatedAmount;
//     let calculatedTaxAmount;
//     let calculatedTotalAmount;
//     let calculatedDiscountAmount = discountAmount || 0;
//     let appliedCoupons = [];
//     let couponId = null;

//     // If planId is ObjectId, fetch plan details
//     if (mongoose.Types.ObjectId.isValid(planId)) {
//       plan = await Plan.findById(planId);
//       if (!plan) {
//         return res.status(404).json({
//           success: false,
//           error: "PLAN_NOT_FOUND",
//           message: "Plan not found"
//         });
//       }
      
//       // Calculate amounts from plan
//       calculatedAmount = amount || plan.currentPrice || plan.basePrice;
//       const taxPercentage = plan.taxPercentage || 18;
//       calculatedTaxAmount = taxAmount || (calculatedAmount * (taxPercentage / 100));
      
//       // Apply coupon if provided
//       if (couponCode) {
//         const coupon = await Coupon.findOne({ 
//           code: couponCode.toUpperCase(),
//           isActive: true
//         });
        
//         if (coupon) {
//           const validation = await coupon.validateCoupon(planId, userId, calculatedAmount);
//           if (validation.valid) {
//             calculatedDiscountAmount = validation.discount;
//             appliedCoupons.push({
//               code: coupon.code,
//               discount: coupon.discountType === "percentage" ? coupon.discountValue : null,
//               discountAmount: validation.discount
//             });
//             couponId = coupon._id;
//           }
//         }
//       }
      
//       const netAmount = calculatedAmount - calculatedDiscountAmount;
//       calculatedTotalAmount = totalAmount || (netAmount + calculatedTaxAmount);
//     } else {
//       // If planId is not ObjectId, use provided amounts
//       calculatedAmount = amount || totalAmount;
//       calculatedTaxAmount = taxAmount || 0;
//       calculatedTotalAmount = totalAmount;
//     }

//     // Generate unique IDs
//     const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//     // Create payment record
//     const payment = new Payment({
//       userId,
//       planId: plan?._id || planId,
//       planName: planName || plan?.name || "Custom Plan",
//       amount: calculatedAmount,
//       taxAmount: calculatedTaxAmount,
//       taxPercentage: plan?.taxPercentage || 18,
//       discountAmount: calculatedDiscountAmount,
//       totalAmount: calculatedTotalAmount,
//       couponId,
//       couponCode: couponCode || null,
//       paymentId,
//       orderId,
//       mobileNumber: mobileNumber || user.phone || user.mobileNumber,
//       status: "pending",
//       paymentMethod,
//       gateway,
//       currency: plan?.currency || "INR",
//       billingAddress: billingAddress || {
//         name: user.name || user.email.split("@")[0],
//         email: user.email,
//         phone: mobileNumber || user.phone || user.mobileNumber,
//         address: user.address,
//         city: user.city,
//         state: user.state,
//         country: user.country || "IN",
//         pincode: user.pincode
//       },
//       paymentDetails: {
//         cardLastFour: billingAddress?.cardLastFour,
//         upiId: billingAddress?.upiId,
//         walletType: billingAddress?.walletType
//       },
//       metadata: {
//         userAgent: req.headers["user-agent"],
//         ipAddress: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
//         hasTrial: plan?.hasTrial || false,
//         trialDays: plan?.trialDays || 0,
//         invoiceId: `INV_${Date.now()}`,
//         basePrice: plan?.basePrice,
//         currentPrice: plan?.currentPrice,
//         planDescription: plan?.description,
//         appliedCoupons
//       }
//     });

//     // Save to database
//     await payment.save();

//     console.log(`✅ Payment initialized: ${paymentId} for user ${userId}`);

//     // Generate payment data based on gateway and method
//     let paymentData = {};
//     let gatewayResponse = null;

//     if (paymentMethod === 'upi' || paymentMethod === 'netbanking' || paymentMethod === 'wallet' || paymentMethod === 'net_banking') {
//       // Use Razorpay for Indian payments
//       gatewayResponse = await razorpayService.createOrder({
//         amount: Math.round(payment.totalAmount * 100), // Convert to paise
//         currency: payment.currency,
//         receipt: `receipt_${payment._id}`,
//         notes: {
//           paymentId: payment.paymentId,
//           planId: payment.planId.toString(),
//           userId: payment.userId.toString()
//         }
//       });

//       // Update payment with gateway details
//       payment.gatewayOrderId = gatewayResponse.id;
//       payment.gateway = 'razorpay';
//       payment.paymentGatewayResponse = {
//         gateway: "razorpay",
//         orderId: gatewayResponse.id,
//         status: "created"
//       };

//     } else if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
//       // Use Stripe for international cards
//       gatewayResponse = await stripeService.createPaymentIntent({
//         amount: Math.round(payment.totalAmount * 100), // Convert to cents
//         currency: payment.currency.toLowerCase(),
//         metadata: {
//           paymentId: payment.paymentId,
//           planId: payment.planId.toString(),
//           userId: payment.userId.toString()
//         }
//       });

//       // Update payment with gateway details
//       payment.gatewayOrderId = gatewayResponse.id;
//       payment.gateway = 'stripe';
//       payment.paymentGatewayResponse = {
//         gateway: "stripe",
//         paymentIntentId: gatewayResponse.id,
//         status: "requires_payment_method"
//       };
//     }

//     await payment.save();

//     res.status(201).json({
//       success: true,
//       message: "Payment initialized successfully",
//       data: {
//         paymentId,
//         orderId,
//         amount: payment.amount,
//         taxAmount: payment.taxAmount,
//         totalAmount: payment.totalAmount,
//         currency: payment.currency,
//         status: payment.status,
//         paymentMethod: payment.paymentMethod,
//         gateway: payment.gateway,
//         paymentData: gatewayResponse,
//         timestamp: new Date().toISOString(),
//         user: {
//           id: user._id,
//           email: user.email,
//           name: user.name
//         },
//         plan: plan ? {
//           id: plan._id,
//           name: plan.name,
//           description: plan.description,
//           features: plan.features
//         } : null
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error initializing payment:", error);
//     res.status(500).json({
//       success: false,
//       error: "PAYMENT_INITIALIZATION_FAILED",
//       message: "Failed to initialize payment",
//       details: process.env.NODE_ENV === "development" ? error.message : undefined
//     });
//   }
// };

// // ============ PAYMENT CALLBACK (WEBHOOK) ============
// export const paymentCallback = async (req, res) => {
//   try {
//     const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

//     // Verify signature for Razorpay
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid signature"
//       });
//     }

//     // Find payment by order ID
//     const payment = await Payment.findOne({
//       gatewayOrderId: razorpay_order_id
//     }).populate("userId planId");

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found"
//       });
//     }

//     // Update payment status
//     payment.status = "completed";
//     payment.transactionId = razorpay_payment_id;
//     payment.gatewayPaymentId = razorpay_payment_id;
//     payment.completedAt = new Date();
//     payment.paymentGatewayResponse = {
//       ...payment.paymentGatewayResponse,
//       paymentId: razorpay_payment_id,
//       signature: razorpay_signature,
//       verified: true,
//       verifiedAt: new Date().toISOString()
//     };

//     await payment.save();

//     // Update user subscription
//     const user = payment.userId;
//     user.subscription = {
//       plan: payment.planId,
//       status: "active",
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//       autoRenew: true,
//       paymentId: payment.paymentId,
//       transactionId: razorpay_payment_id
//     };
//     await user.save();

//     // Send confirmation email
//     await emailService.sendPaymentConfirmation({
//       to: user.email,
//       name: user.name,
//       planName: payment.planName,
//       amount: payment.amount,
//       transactionId: razorpay_payment_id,
//       startDate: user.subscription.startDate,
//       endDate: user.subscription.endDate
//     });

//     res.status(200).json({
//       success: true,
//       message: "Payment successful",
//       data: {
//         paymentId: payment._id,
//         status: payment.status,
//         transactionId: razorpay_payment_id,
//         subscription: user.subscription
//       }
//     });

//   } catch (error) {
//     console.error("❌ Payment callback error:", error);
//     res.status(500).json({
//       success: false,
//       error: "PAYMENT_CALLBACK_FAILED",
//       message: "Failed to process payment callback"
//     });
//   }
// };

// // ============ GENERATE PAYMENT OTP ============
// export const generatePaymentOTP = async (req, res) => {
//   try {
//     console.log("📱 OTP generate called:", req.body);
    
//     const { paymentId, mobileNumber } = req.body;
//     const userId = req.user?.id;
    
//     if (!paymentId) {
//       return res.status(400).json({
//         success: false,
//         error: "PAYMENT_ID_REQUIRED",
//         message: "Payment ID is required"
//       });
//     }

//     // Find payment record
//     const payment = await Payment.findOne({ paymentId });
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: "PAYMENT_NOT_FOUND",
//         message: "Payment record not found"
//       });
//     }

//     // Check if user is authorized (if userId is provided)
//     if (userId && payment.userId.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         error: "UNAUTHORIZED",
//         message: "You are not authorized to generate OTP for this payment"
//       });
//     }

//     // Check payment status
//     if (payment.status !== "pending") {
//       return res.status(400).json({
//         success: false,
//         error: "PAYMENT_NOT_PENDING",
//         message: `Payment is already ${payment.status}`
//       });
//     }

//     // Generate OTP
//     const otp = generateOTP();
//     const otpKey = `payment_${paymentId}`;
    
//     // Store OTP
//     storeOTP(otpKey, otp, 5);
    
//     // Update payment with OTP expiry
//     payment.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
//     payment.otpAttempts = 0;
//     await payment.save();
    
//     console.log(`📱 Generated OTP for payment ${paymentId}: ${otp}`);
    
//     // Send OTP via email/SMS
//     await sendOTPNotification({
//       to: payment.billingAddress.email,
//       phone: mobileNumber || payment.mobileNumber,
//       otp,
//       paymentId,
//       userName: payment.billingAddress.name
//     });
    
//     res.json({
//       success: true,
//       message: "OTP sent successfully",
//       data: {
//         otpLength: 6,
//         expiresIn: 300,
//         maskedMobile: (mobileNumber || payment.mobileNumber).replace(/\d(?=\d{4})/g, "*"),
//         timestamp: new Date().toISOString(),
//         paymentId,
//         paymentStatus: payment.status
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error generating OTP:", error);
//     res.status(500).json({
//       success: false,
//       error: "OTP_GENERATION_FAILED",
//       message: "Failed to generate OTP",
//       details: process.env.NODE_ENV === "development" ? error.message : undefined
//     });
//   }
// };

// // ============ VERIFY OTP ============
// export const verifyPaymentOTP = async (req, res) => {
//   try {
//     console.log("🔐 OTP verify called:", req.body);
    
//     const { paymentId, otp } = req.body;
//     const userId = req.user?.id;
    
//     if (!paymentId || !otp) {
//       return res.status(400).json({
//         success: false,
//         error: "MISSING_PARAMETERS",
//         message: "Payment ID and OTP are required"
//       });
//     }

//     // Find payment record
//     const payment = await Payment.findOne({ paymentId });
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: "PAYMENT_NOT_FOUND",
//         message: "Payment record not found"
//       });
//     }

//     // Check if user is authorized (if userId is provided)
//     if (userId && payment.userId.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         error: "UNAUTHORIZED",
//         message: "You are not authorized to verify OTP for this payment"
//       });
//     }

//     // Check if OTP is already verified
//     if (payment.otpVerified) {
//       return res.status(400).json({
//         success: false,
//         error: "OTP_ALREADY_VERIFIED",
//         message: "OTP has already been verified"
//       });
//     }

//     // Check payment status
//     if (payment.status !== "pending") {
//       return res.status(400).json({
//         success: false,
//         error: "PAYMENT_NOT_PENDING",
//         message: `Payment is already ${payment.status}`
//       });
//     }

//     // Verify OTP from storage
//     const otpKey = `payment_${paymentId}`;
//     const verification = verifyOTPFromStorage(otpKey, otp);
    
//     if (!verification.valid) {
//       // Update OTP attempts in database
//       payment.otpAttempts += 1;
//       await payment.save();
      
//       return res.status(400).json({
//         success: false,
//         error: "OTP_VERIFICATION_FAILED",
//         message: verification.error
//       });
//     }

//     // OTP verified successfully
//     payment.otpVerified = true;
//     payment.status = "completed";
//     payment.transactionId = `TXN${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     payment.completedAt = new Date();
//     payment.paymentGatewayResponse = {
//       ...payment.paymentGatewayResponse,
//       status: "success",
//       method: "otp_verification",
//       verifiedAt: new Date().toISOString()
//     };
    
//     await payment.save();

//     // Update user's subscription or plan
//     const user = await User.findById(payment.userId);
//     if (user) {
//       user.subscription = {
//         planId: payment.planId,
//         planName: payment.planName,
//         amountPaid: payment.totalAmount,
//         paymentId: payment.paymentId,
//         transactionId: payment.transactionId,
//         startDate: new Date(),
//         endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//         status: "active"
//       };
//       await user.save();
//     }

//     console.log(`✅ Payment completed: ${paymentId}, Transaction: ${payment.transactionId}`);

//     res.json({
//       success: true,
//       message: "Payment verified successfully",
//       data: {
//         transactionId: payment.transactionId,
//         status: payment.status,
//         amount: payment.amount,
//         taxAmount: payment.taxAmount,
//         totalAmount: payment.totalAmount,
//         paymentId,
//         planName: payment.planName,
//         verifiedAt: new Date().toISOString(),
//         user: user ? {
//           id: user._id,
//           email: user.email,
//           subscription: user.subscription
//         } : null
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error verifying OTP:", error);
//     res.status(500).json({
//       success: false,
//       error: "PAYMENT_VERIFICATION_FAILED",
//       message: "Failed to verify payment",
//       details: process.env.NODE_ENV === "development" ? error.message : undefined
//     });
//   }
// };

// // ============ RESEND OTP ============
// export const resendPaymentOTP = async (req, res) => {
//   try {
//     console.log("🔄 OTP resend called:", req.body);
    
//     const { paymentId } = req.body;
//     const userId = req.user?.id;
    
//     if (!paymentId) {
//       return res.status(400).json({
//         success: false,
//         error: "PAYMENT_ID_REQUIRED",
//         message: "Payment ID is required"
//       });
//     }

//     // Find payment record
//     const payment = await Payment.findOne({ paymentId });
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: "PAYMENT_NOT_FOUND",
//         message: "Payment record not found"
//       });
//     }

//     // Check if user is authorized (if userId is provided)
//     if (userId && payment.userId.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         error: "UNAUTHORIZED",
//         message: "You are not authorized to resend OTP for this payment"
//       });
//     }

//     // Check payment status
//     if (payment.status !== "pending") {
//       return res.status(400).json({
//         success: false,
//         error: "PAYMENT_NOT_PENDING",
//         message: `Payment is already ${payment.status}`
//       });
//     }

//     const otpKey = `payment_${paymentId}`;
//     const existingOTP = otpStorage.get(otpKey);
    
//     // Rate limiting: 30 seconds between requests
//     if (existingOTP && Date.now() - (existingOTP.expiryTime - 5 * 60 * 1000) < 30000) {
//       return res.status(429).json({
//         success: false,
//         error: "TOO_FREQUENT",
//         message: "Please wait 30 seconds before requesting a new OTP"
//       });
//     }

//     // Generate new OTP
//     const otp = generateOTP();
//     storeOTP(otpKey, otp, 5);
    
//     // Update payment
//     payment.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
//     payment.otpAttempts = 0;
//     await payment.save();
    
//     console.log(`🔄 Resent OTP for payment ${paymentId}: ${otp}`);
    
//     // Send OTP notification
//     await sendOTPNotification({
//       to: payment.billingAddress.email,
//       phone: payment.mobileNumber,
//       otp,
//       paymentId,
//       userName: payment.billingAddress.name,
//       isResend: true
//     });
    
//     res.json({
//       success: true,
//       message: "OTP resent successfully",
//       data: {
//         otpLength: 6,
//         expiresIn: 300,
//         timestamp: new Date().toISOString(),
//         paymentId,
//         paymentStatus: payment.status
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error resending OTP:", error);
//     res.status(500).json({
//       success: false,
//       error: "OTP_RESEND_FAILED",
//       message: "Failed to resend OTP",
//       details: process.env.NODE_ENV === "development" ? error.message : undefined
//     });
//   }
// };

// // ============ GET PAYMENT STATUS ============
// export const getPaymentStatus = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
    
//     const payment = await Payment.findOne({ paymentId });
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: "PAYMENT_NOT_FOUND",
//         message: "Payment record not found"
//       });
//     }

//     // Remove sensitive data
//     const paymentData = payment.toObject();
//     delete paymentData.paymentGatewayResponse;
//     delete paymentData.metadata;

//     res.json({
//       success: true,
//       data: paymentData
//     });
//   } catch (error) {
//     console.error("❌ Error getting payment status:", error);
//     res.status(500).json({
//       success: false,
//       error: "PAYMENT_STATUS_FAILED",
//       message: "Failed to get payment status"
//     });
//   }
// };

// // ============ GET PAYMENT BY ID ============
// export const getPaymentById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user?.id;

//     const payment = await Payment.findOne({
//       _id: id,
//       userId
//     })
//     .populate("userId", "name email")
//     .populate("planId", "name description features")
//     .populate("couponId", "code discountType discountValue");

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: "PAYMENT_NOT_FOUND",
//         message: "Payment not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: payment
//     });
//   } catch (error) {
//     console.error("❌ Error getting payment by ID:", error);
//     res.status(500).json({
//       success: false,
//       error: "GET_PAYMENT_FAILED",
//       message: "Failed to get payment details"
//     });
//   }
// };

// // ============ GET PAYMENT HISTORY ============
// export const getPaymentHistory = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.params.userId;
//     const { page = 1, limit = 10, status, paymentMethod, gateway } = req.query;
    
//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         error: "USER_ID_REQUIRED",
//         message: "User ID is required"
//       });
//     }

//     const query = { userId };
    
//     // Apply filters
//     if (status) query.status = status;
//     if (paymentMethod) query.paymentMethod = paymentMethod;
//     if (gateway) query.gateway = gateway;

//     const payments = await Payment.find(query)
//       .populate("planId", "name description")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await Payment.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       data: {
//         payments,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error getting payment history:", error);
//     res.status(500).json({
//       success: false,
//       error: "GET_PAYMENTS_FAILED",
//       message: "Failed to get payment history"
//     });
//   }
// };

// // ============ GET USER PAYMENTS ============
// export const getUserPayments = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     const payments = await Payment.find({ userId })
//       .sort({ createdAt: -1 })
//       .select("-paymentGatewayResponse -metadata -__v");

//     res.json({
//       success: true,
//       data: {
//         payments,
//         total: payments.length,
//         totalAmount: payments.reduce((sum, payment) => sum + payment.totalAmount, 0)
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error getting user payments:", error);
//     res.status(500).json({
//       success: false,
//       error: "GET_PAYMENTS_FAILED",
//       message: "Failed to get user payments"
//     });
//   }
// };

// // ============ REFUND PAYMENT ============
// export const refundPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const userId = req.user?.id;

//     const payment = await Payment.findOne({
//       _id: paymentId,
//       userId
//     }).populate("userId planId");

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         error: "PAYMENT_NOT_FOUND",
//         message: "Payment not found"
//       });
//     }

//     if (payment.status !== 'completed') {
//       return res.status(400).json({
//         success: false,
//         error: "INVALID_STATUS",
//         message: 'Only completed payments can be refunded'
//       });
//     }

//     // Check if payment is within refund period (7 days)
//     const paymentDate = new Date(payment.createdAt);
//     const now = new Date();
//     const daysDifference = (now - paymentDate) / (1000 * 60 * 60 * 24);

//     if (daysDifference > 7) {
//       return res.status(400).json({
//         success: false,
//         error: "REFUND_PERIOD_EXPIRED",
//         message: 'Refund period has expired (7 days)'
//       });
//     }

//     // Initiate refund based on payment gateway
//     let refund;
//     if (payment.gateway === 'razorpay' && payment.gatewayPaymentId) {
//       refund = await razorpayService.createRefund({
//         paymentId: payment.gatewayPaymentId,
//         amount: Math.round(payment.amount * 100)
//       });
//     } else if (payment.gateway === 'stripe' && payment.gatewayPaymentId) {
//       refund = await stripeService.createRefund({
//         paymentIntentId: payment.gatewayPaymentId,
//         amount: Math.round(payment.amount * 100)
//       });
//     }

//     // Update payment status
//     payment.status = 'refunded';
//     payment.refundStatus = 'processed';
//     payment.refundAmount = payment.amount;
//     payment.refundedAt = new Date();
//     payment.refundTransactionId = refund?.id || `refund_${Date.now()}`;
//     payment.refundResponse = refund;
    
//     await payment.save();

//     // Update user subscription
//     const user = payment.userId;
//     if (user.subscription) {
//       user.subscription.status = 'cancelled';
//       await user.save();
//     }

//     // Send refund confirmation
//     await emailService.sendRefundConfirmation({
//       to: user.email,
//       name: user.name,
//       amount: payment.amount,
//       refundId: refund?.id || payment.refundTransactionId,
//       transactionId: payment.transactionId
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Refund processed successfully',
//       data: {
//         refundId: refund?.id || payment.refundTransactionId,
//         amount: payment.amount,
//         status: 'refunded'
//       }
//     });

//   } catch (error) {
//     console.error("❌ Error refunding payment:", error);
//     res.status(500).json({
//       success: false,
//       error: "REFUND_FAILED",
//       message: "Failed to process refund",
//       details: process.env.NODE_ENV === "development" ? error.message : undefined
//     });
//   }
// };

// // ============ HELPER FUNCTIONS ============
// async function sendOTPNotification({ to, phone, otp, paymentId, userName, isResend = false }) {
//   try {
//     // Send email
//     await emailService.sendOTP({
//       to,
//       name: userName,
//       otp,
//       paymentId,
//       isResend
//     });

//     // Send SMS (mock implementation)
//     console.log(`📱 SMS sent to ${phone}: Your OTP for payment ${paymentId} is ${otp}`);
    
//     // In production, integrate with SMS service like Twilio, MSG91, etc.
//     // await smsService.send({
//     //   to: phone,
//     //   message: `Your OTP for payment ${paymentId} is ${otp}. Valid for 5 minutes.`
//     // });
//   } catch (error) {
//     console.error("❌ Error sending OTP notification:", error);
//   }
// }

// async function activateUserSubscription(payment) {
//   try {
//     const user = await User.findById(payment.userId);
//     if (!user) return;

//     // Update user subscription
//     user.subscription = {
//       planId: payment.planId,
//       planName: payment.planName,
//       paymentId: payment.paymentId,
//       transactionId: payment.transactionId,
//       amountPaid: payment.totalAmount,
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//       status: "active",
//       autoRenew: true,
//       createdAt: new Date()
//     };
    
//     await user.save();

//     // Send confirmation email
//     await emailService.sendPaymentConfirmation({
//       to: user.email,
//       name: user.name,
//       planName: payment.planName,
//       amount: payment.totalAmount,
//       transactionId: payment.transactionId,
//       paymentId: payment.paymentId,
//       startDate: user.subscription.startDate,
//       endDate: user.subscription.endDate
//     });

//     console.log(`✅ Subscription activated for user ${user._id}`);
//   } catch (error) {
//     console.error("❌ Error activating subscription:", error);
//   }
// }

// // ============ VALIDATE COUPON ============
// export const validateCoupon = async (req, res) => {
//   try {
//     const { couponCode, planId, amount } = req.body;
//     const userId = req.user?.id;

//     if (!couponCode || !planId) {
//       return res.status(400).json({
//         success: false,
//         error: "MISSING_PARAMETERS",
//         message: "Coupon code and plan ID are required"
//       });
//     }

//     const coupon = await Coupon.findOne({ 
//       code: couponCode.toUpperCase(),
//       isActive: true
//     });

//     if (!coupon) {
//       return res.status(404).json({
//         success: false,
//         error: "COUPON_NOT_FOUND",
//         message: "Coupon not found or inactive"
//       });
//     }

//     const validation = await coupon.validateCoupon(planId, userId, amount);

//     if (!validation.valid) {
//       return res.status(400).json({
//         success: false,
//         error: "COUPON_INVALID",
//         message: validation.error
//       });
//     }

//     res.json({
//       success: true,
//       message: "Coupon is valid",
//       data: {
//         coupon: {
//           code: coupon.code,
//           discountType: coupon.discountType,
//           discountValue: coupon.discountValue,
//           maxDiscount: coupon.maxDiscount,
//           minAmount: coupon.minAmount
//         },
//         discount: validation.discount,
//         originalAmount: amount,
//         finalAmount: amount - validation.discount
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error validating coupon:", error);
//     res.status(500).json({
//       success: false,
//       error: "COUPON_VALIDATION_FAILED",
//       message: "Failed to validate coupon"
//     });
//   }
// };

// // ============ GENERATE OTP FOR PAYMENT (User method) ============
// export const generateOTPForPayment = async (req, res) => {
//   try {
//     const userId = req.user?.id;
    
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Generate OTP
//     const otp = generateOTP();
    
//     // Store OTP in user object (if using User model method)
//     if (user.generateOTP && typeof user.generateOTP === 'function') {
//       user.generateOTP();
//       await user.save();
//     }

//     // Send OTP via email (in production, also send via SMS)
//     await emailService.sendOTP({
//       to: user.email,
//       name: user.name,
//       otp
//     });

//     res.status(200).json({
//       success: true,
//       message: 'OTP sent successfully',
//       data: {
//         otpExpiresIn: 10 // minutes
//       }
//     });

//   } catch (error) {
//     console.error('❌ Generate OTP error:', error);
//     res.status(500).json({
//       success: false,
//       error: "OTP_GENERATION_FAILED",
//       message: "Failed to generate OTP"
//     });
//   }
// };

// // ============ PROCESS OTP VERIFICATION (User method) ============
// export const processOTPVerification = async (req, res) => {
//   try {
//     const { paymentId, otp } = req.body;
//     const userId = req.user?.id;

//     // Find payment
//     const payment = await Payment.findOne({
//       _id: paymentId,
//       userId
//     }).populate('userId planId');

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     // Verify OTP using user method
//     const isOTPValid = payment.userId.verifyOTP ? payment.userId.verifyOTP(otp) : false;
//     if (!isOTPValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid or expired OTP'
//       });
//     }

//     // Update payment status
//     payment.status = 'completed';
//     payment.updatedAt = new Date();
//     await payment.save();

//     // Update user subscription
//     const user = payment.userId;
//     user.subscription = {
//       plan: payment.planId,
//       status: 'active',
//       startDate: new Date(),
//       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//       autoRenew: true
//     };
//     await user.save();

//     // Send confirmation email
//     await emailService.sendPaymentConfirmation({
//       to: user.email,
//       name: user.name,
//       planName: payment.planName,
//       amount: payment.amount,
//       transactionId: payment._id.toString().slice(-12),
//       startDate: user.subscription.startDate,
//       endDate: user.subscription.endDate
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Payment verified and completed successfully',
//       data: {
//         paymentId: payment._id,
//         status: payment.status,
//         subscription: user.subscription
//       }
//     });

//   } catch (error) {
//     console.error('❌ OTP verification error:', error);
//     res.status(500).json({
//       success: false,
//       error: "PAYMENT_VERIFICATION_FAILED",
//       message: "Failed to verify payment"
//     });
//   }
// };