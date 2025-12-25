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