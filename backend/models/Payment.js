const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Plan Information
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  
  // Payment Identification
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  transactionId: {
    type: String,
    index: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  
  finalAmount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending',
    index: true
  },
  
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash']
  },
  
  gateway: {
    type: String,
    required: true,
    enum: ['razorpay', 'stripe', 'paypal', 'instamojo', 'cashfree']
  },
  
  gatewayOrderId: {
    type: String,
    index: true
  },
  
  gatewayPaymentId: {
    type: String,
    index: true
  },
  
  // Payment Breakdown
  discountApplied: {
    type: Number,
    default: 0
  },
  
  taxAmount: {
    type: Number,
    default: 0
  },
  
  taxPercentage: {
    type: Number,
    default: 18
  },
  
  // Coupon Information
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  
  couponCode: {
    type: String
  },
  
  // Customer Information
  customerDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'IN'
    },
    pincode: String
  },
  
  // Payment Gateway Details
  paymentDetails: {
    cardLastFour: String,
    bankName: String,
    upiId: String,
    walletType: String
  },
  
  // OTP Verification (for Indian payment methods)
  otpVerified: {
    type: Boolean,
    default: false
  },
  
  otpAttempts: {
    type: Number,
    default: 0
  },
  
  // Refund Information
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed', null],
    default: null
  },
  
  refundAmount: Number,
  refundReason: String,
  refundNotes: String,
  refundedAt: Date,
  refundedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  refundTransactionId: String,
  
  // Error Information
  error: {
    code: String,
    message: String,
    gateway: String,
    gatewayResponse: Object
  },
  
  // Gateway Responses
  gatewayResponse: Object,
  refundResponse: Object,
  
  // Timestamps
  completedAt: Date,
  cancelledAt: Date,
  
  // Expiration for pending payments
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  },
  
  // Notes
  notes: String,
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    hasTrial: Boolean,
    trialDays: Number,
    failedOTPAttempts: Number,
    otp: {
      code: String,
      expiresAt: Date,
      attempts: Number
    },
    invoiceId: String,
    invoiceUrl: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ planId: 1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ gateway: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtuals
paymentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

paymentSchema.virtual('plan', {
  ref: 'Plan',
  localField: 'planId',
  foreignField: '_id',
  justOne: true
});

paymentSchema.virtual('coupon', {
  ref: 'Coupon',
  localField: 'couponId',
  foreignField: '_id',
  justOne: true
});

paymentSchema.virtual('subscription', {
  ref: 'Subscription',
  localField: '_id',
  foreignField: 'paymentId',
  justOne: true
});

// Methods
paymentSchema.methods.isRefundable = function() {
  if (this.status !== 'completed') return false;
  if (this.refundStatus) return false;
  if (!this.completedAt) return false;
  
  // Check if payment is within refund period (30 days)
  const refundDeadline = new Date(this.completedAt);
  refundDeadline.setDate(refundDeadline.getDate() + 30);
  
  return new Date() <= refundDeadline;
};

paymentSchema.methods.getRefundDeadline = function() {
  if (!this.completedAt) return null;
  
  const refundDeadline = new Date(this.completedAt);
  refundDeadline.setDate(refundDeadline.getDate() + 30);
  
  return refundDeadline;
};

// Statics
paymentSchema.statics.findByPaymentId = function(paymentId) {
  return this.findOne({ paymentId }).populate('user plan coupon');
};

paymentSchema.statics.findByTransactionId = function(transactionId) {
  return this.findOne({ transactionId }).populate('user plan coupon');
};

paymentSchema.statics.findUserPayments = function(userId, limit = 10, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('plan coupon');
};

// Pre-save middleware
paymentSchema.pre('save', function(next) {
  // Auto-calculate final amount if not provided
  if (this.isNew && !this.finalAmount) {
    this.finalAmount = this.amount - (this.discountApplied || 0) + (this.taxAmount || 0);
  }
  
  // Set timestamps based on status changes
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status === 'cancelled' && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }
  }
  
  next();
});

// Query helpers
paymentSchema.query.pending = function() {
  return this.where({ status: 'pending' });
};

paymentSchema.query.completed = function() {
  return this.where({ status: 'completed' });
};

paymentSchema.query.failed = function() {
  return this.where({ status: 'failed' });
};



app.post("/api/v1/payments/initialize", async (req, res) => {
  try {
    console.log("💰 Payment initialize called:", req.body);
    
    const { amount, currency, customer } = req.body;
    const paymentId = `pay_${Date.now()}`;
    const orderId = `order_${Date.now()}`;

    // Create payment record in MongoDB
    const payment = new Payment({
      paymentId,
      orderId,
      amount: amount || 4999,
      currency: currency || "INR",
      customer: customer || {},
      status: 'pending'
    });

    const savedPayment = await payment.save();
    console.log("✅ Payment saved to MongoDB:", savedPayment._id);

    res.json({
      success: true,
      message: "Payment initialized successfully",
      data: {
        paymentId: savedPayment.paymentId,
        amount: savedPayment.amount,
        currency: savedPayment.currency,
        orderId: savedPayment.orderId,
        timestamp: savedPayment.createdAt,
        dbId: savedPayment._id // For debugging
      },
    });
  } catch (error) {
    console.error("❌ Error saving payment:", error);
    res.status(500).json({
      success: false,
      error: "PAYMENT_SAVE_FAILED",
      message: error.message
    });
  }
});

app.post("/api/v1/payments/otp/verify", async (req, res) => {
  try {
    console.log("🔐 OTP verify called:", req.body);
    
    const { paymentId, otp } = req.body;
    
    if (!paymentId || !otp) {
      return res.status(400).json({
        success: false,
        error: "MISSING_PARAMETERS",
        message: "Payment ID and OTP are required"
      });
    }

    const otpKey = `payment_${paymentId}`;
    const verification = verifyOTP(otpKey, otp);
    
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        error: "OTP_VERIFICATION_FAILED",
        message: verification.error
      });
    }

    // OTP verified successfully - update payment in MongoDB
    const transactionId = `TXN${Date.now()}`;
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentId },
      { 
        status: 'completed',
        transactionId,
        updatedAt: new Date()
      },
      { new: true } // Return updated document
    );

    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        error: "PAYMENT_NOT_FOUND",
        message: "Payment record not found"
      });
    }

    console.log("✅ Payment updated in MongoDB:", updatedPayment._id);

    res.json({
      success: true,
      message: "Payment verified successfully",
      data: {
        transactionId: updatedPayment.transactionId,
        status: updatedPayment.status,
        amount: updatedPayment.amount,
        paymentId: updatedPayment.paymentId,
        orderId: updatedPayment.orderId,
        verifiedAt: new Date().toISOString(),
        dbRecord: {
          id: updatedPayment._id,
          createdAt: updatedPayment.createdAt
        }
      },
    });
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    res.status(500).json({
      success: false,
      error: "PAYMENT_UPDATE_FAILED",
      message: error.message
    });
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;









// import Payment from '../models/Payment.js';
// import crypto from 'crypto';

// export class PaymentService {
//   // Generate unique transaction ID
//   static generateTransactionId() {
//     const timestamp = Date.now();
//     const random = crypto.randomBytes(4).toString('hex');
//     return `TXN${timestamp}${random}`.toUpperCase();
//   }

//   // Generate unique payment ID
//   static generatePaymentId() {
//     return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }

//   // Initialize payment
//   static async initializePayment(paymentData) {
//     try {
//       const {
//         planId,
//         planName,
//         amount,
//         paymentMethod = 'upi',
//         couponCode = '',
//         customerDetails
//       } = paymentData;

//       // Validate required fields
//       if (!planId || !planName || !amount || !customerDetails?.name) {
//         throw new Error('Plan ID, Plan Name, Amount, and Customer Name are required');
//       }

//       // Calculate discount if coupon applied
//       let discountAmount = 0;
//       let finalAmount = parseFloat(amount);

//       if (couponCode) {
//         const validCoupons = {
//           'WELCOME20': 0.20,
//           'SAVE15': 0.15,
//           'INDIAN10': 0.10,
//           'STARTUP25': 0.25
//         };

//         if (validCoupons[couponCode]) {
//           discountAmount = finalAmount * validCoupons[couponCode];
//         }
//       }

//       // Calculate tax (18% GST)
//       const taxPercentage = 18;
//       const taxAmount = (finalAmount - discountAmount) * taxPercentage / 100;

//       // Create payment record
//       const payment = new Payment({
//         planId,
//         planName,
//         amount: parseFloat(amount),
//         currency: 'INR',
//         paymentMethod,
//         couponCode,
//         discountAmount,
//         taxAmount,
//         taxPercentage,
//         finalAmount: finalAmount - discountAmount + taxAmount,
//         paymentStatus: 'pending',
//         paymentId: this.generatePaymentId(),
//         transactionId: this.generateTransactionId(),
//         customerDetails: {
//           name: customerDetails.name,
//           email: customerDetails.email || '',
//           phone: customerDetails.phone || '',
//           address: customerDetails.address || '',
//           city: customerDetails.city || '',
//           state: customerDetails.state || '',
//           country: customerDetails.country || 'IN',
//           pincode: customerDetails.pincode || ''
//         },
//         metadata: {
//           ipAddress: paymentData.ipAddress,
//           userAgent: paymentData.userAgent,
//           invoiceId: `INV${Date.now()}`,
//           invoiceUrl: `/api/v1/payments/{paymentId}/invoice`
//         },
//         expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
//       });

//       // Save to MongoDB
//       await payment.save();

//       console.log('💰 Payment initialized and saved to MongoDB:', payment._id);

//       return {
//         success: true,
//         message: 'Payment initialized successfully',
//         data: {
//           paymentId: payment.paymentId,
//           transactionId: payment.transactionId,
//           amount: payment.amount,
//           finalAmount: payment.finalAmount,
//           discountAmount: payment.discountAmount,
//           taxAmount: payment.taxAmount,
//           currency: payment.currency,
//           planName: payment.planName,
//           customerName: payment.customerDetails.name,
//           status: payment.paymentStatus,
//           createdAt: payment.createdAt,
//           paymentMethod: payment.paymentMethod,
//           expiresAt: payment.expiresAt,
//           // For UPI payments
//           upiId: payment.paymentMethod === 'upi' ? 'merchant@upi' : null
//         }
//       };

//     } catch (error) {
//       console.error('❌ Payment initialization error:', error);
//       throw error;
//     }
//   }

//   // Verify OTP and complete payment
//   static async verifyOTP(paymentId, otp) {
//     try {
//       // Find payment in database
//       const payment = await Payment.findOne({ paymentId });
      
//       if (!payment) {
//         throw new Error('Payment record not found');
//       }

//       // Check if payment is already completed
//       if (payment.paymentStatus === 'completed') {
//         throw new Error('Payment is already completed');
//       }

//       // Check if payment has expired
//       if (payment.expiresAt && new Date() > payment.expiresAt) {
//         payment.paymentStatus = 'failed';
//         payment.error = {
//           code: 'PAYMENT_EXPIRED',
//           message: 'Payment session expired'
//         };
//         await payment.save();
//         throw new Error('Payment session has expired');
//       }

//       // Simulate OTP verification (in production, use real OTP service)
//       const isOTPValid = /^\d{6}$/.test(otp);

//       if (!isOTPValid) {
//         // Increment OTP attempts
//         payment.otpAttempts = (payment.otpAttempts || 0) + 1;
//         await payment.save();
        
//         throw new Error('Invalid OTP format');
//       }

//       // Update payment status to completed
//       payment.paymentStatus = 'completed';
//       payment.otpVerified = true;
//       payment.completedAt = new Date();
//       payment.metadata.otpVerifiedAt = new Date();
//       payment.metadata.verificationMethod = 'otp';
//       payment.razorpayOrderId = `order_${Date.now()}`;
//       payment.razorpayPaymentId = `pay_${Date.now()}`;

//       await payment.save();

//       console.log('✅ Payment completed and saved to MongoDB:', payment._id);

//       return {
//         success: true,
//         message: 'Payment verified successfully',
//         data: {
//           paymentId: payment.paymentId,
//           transactionId: payment.transactionId,
//           razorpayOrderId: payment.razorpayOrderId,
//           razorpayPaymentId: payment.razorpayPaymentId,
//           amount: payment.amount,
//           finalAmount: payment.finalAmount,
//           currency: payment.currency,
//           planName: payment.planName,
//           status: payment.paymentStatus,
//           completedAt: payment.completedAt,
//           customerName: payment.customerDetails.name,
//           customerEmail: payment.customerDetails.email,
//           invoiceUrl: `/api/v1/payments/${payment.paymentId}/invoice`,
//           receiptNumber: `REC${Date.now()}${payment._id.toString().slice(-6)}`
//         }
//       };

//     } catch (error) {
//       console.error('❌ OTP verification error:', error);
//       throw error;
//     }
//   }

//   // Get payment by ID
//   static async getPaymentById(paymentId) {
//     try {
//       const payment = await Payment.findOne({ paymentId });
      
//       if (!payment) {
//         throw new Error('Payment not found');
//       }

//       return {
//         success: true,
//         data: payment
//       };

//     } catch (error) {
//       console.error('❌ Get payment error:', error);
//       throw error;
//     }
//   }

//   // Get payment history
//   static async getPaymentHistory(filters) {
//     try {
//       const { email, phone, page = 1, limit = 10 } = filters;
      
//       const query = {};
      
//       if (email) {
//         query['customerDetails.email'] = email;
//       }
      
//       if (phone) {
//         query['customerDetails.phone'] = phone;
//       }

//       const skip = (parseInt(page) - 1) * parseInt(limit);
      
//       const [payments, total] = await Promise.all([
//         Payment.find(query)
//           .sort({ createdAt: -1 })
//           .skip(skip)
//           .limit(parseInt(limit)),
//         Payment.countDocuments(query)
//       ]);

//       return {
//         success: true,
//         data: {
//           payments,
//           pagination: {
//             total,
//             page: parseInt(page),
//             limit: parseInt(limit),
//             totalPages: Math.ceil(total / parseInt(limit))
//           }
//         }
//       };

//     } catch (error) {
//       console.error('❌ Get payment history error:', error);
//       throw error;
//     }
//   }

//   // Get payment statistics
//   static async getPaymentStats() {
//     try {
//       const stats = await Payment.aggregate([
//         {
//           $group: {
//             _id: null,
//             totalPayments: { $sum: 1 },
//             totalRevenue: { $sum: '$finalAmount' },
//             successfulPayments: {
//               $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
//             },
//             failedPayments: {
//               $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
//             },
//             pendingPayments: {
//               $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] }
//             },
//             averageOrderValue: { $avg: '$finalAmount' }
//           }
//         }
//       ]);

//       const statsByPlan = await Payment.aggregate([
//         {
//           $group: {
//             _id: '$planName',
//             count: { $sum: 1 },
//             totalAmount: { $sum: '$finalAmount' },
//             avgAmount: { $avg: '$finalAmount' }
//           }
//         },
//         { $sort: { count: -1 } }
//       ]);

//       return {
//         success: true,
//         data: {
//           ...(stats[0] || {
//             totalPayments: 0,
//             totalRevenue: 0,
//             successfulPayments: 0,
//             failedPayments: 0,
//             pendingPayments: 0,
//             averageOrderValue: 0
//           }),
//           statsByPlan
//         }
//       };

//     } catch (error) {
//       console.error('❌ Get payment stats error:', error);
//       throw error;
//     }
//   }
// }

// export default PaymentService;

// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   // User Information
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     index: true
//   },
  
//   // Plan Information
//   planId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Plan'
//   },
//   planName: {
//     type: String
//   },
  
//   // Payment Identification
//   paymentId: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
  
//   orderId: {  // ADD THIS FIELD - it's missing in your schema!
//     type: String,
//     index: true
//   },
  
//   transactionId: {
//     type: String,
//     index: true
//   },
  
//   // Payment Details
//   amount: {
//     type: Number,
//     required: true,
//     min: [0, 'Amount cannot be negative']
//   },
  
//   finalAmount: {
//     type: Number
//   },
  
//   currency: {
//     type: String,
//     default: 'INR',
//     enum: ['INR', 'USD', 'EUR', 'GBP']
//   },
  
//   status: {
//     type: String,
//     required: true,
//     enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
//     default: 'pending',
//     index: true
//   },
  
//   paymentMethod: {
//     type: String,
//     enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash']
//   },
  
//   gateway: {
//     type: String,
//     enum: ['razorpay', 'stripe', 'paypal', 'instamojo', 'cashfree']
//   },
  
//   gatewayOrderId: {
//     type: String,
//     index: true
//   },
  
//   gatewayPaymentId: {
//     type: String,
//     index: true
//   },
  
//   // Payment Breakdown
//   discountApplied: {
//     type: Number,
//     default: 0
//   },
  
//   taxAmount: {
//     type: Number,
//     default: 0
//   },
  
//   taxPercentage: {
//     type: Number,
//     default: 18
//   },
  
//   // Coupon Information
//   couponId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Coupon'
//   },
  
//   couponCode: {
//     type: String
//   },
  
//   // Customer Information
//   customer: {  // ADD THIS FIELD - you're using it in API!
//     type: Object,
//     default: {}
//   },
  
//   customerDetails: {
//     name: String,
//     email: String,
//     phone: String,
//     address: String,
//     city: String,
//     state: String,
//     country: {
//       type: String,
//       default: 'IN'
//     },
//     pincode: String
//   },
  
//   // Payment Gateway Details
//   paymentDetails: {
//     cardLastFour: String,
//     bankName: String,
//     upiId: String,
//     walletType: String
//   },
  
//   // OTP Verification (for Indian payment methods)
//   otpVerified: {
//     type: Boolean,
//     default: false
//   },
  
//   otpAttempts: {
//     type: Number,
//     default: 0
//   },
  
//   // Refund Information
//   refundStatus: {
//     type: String,
//     enum: ['pending', 'processed', 'failed', null],
//     default: null
//   },
  
//   refundAmount: Number,
//   refundReason: String,
//   refundNotes: String,
//   refundedAt: Date,
//   refundedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   refundTransactionId: String,
  
//   // Error Information
//   error: {
//     code: String,
//     message: String,
//     gateway: String,
//     gatewayResponse: Object
//   },
  
//   // Gateway Responses
//   gatewayResponse: Object,
//   refundResponse: Object,
  
//   // Timestamps
//   completedAt: Date,
//   cancelledAt: Date,
  
//   // Expiration for pending payments
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
//   },
  
//   // Notes
//   notes: String,
  
//   // Metadata
//   metadata: {
//     ipAddress: String,
//     userAgent: String,
//     hasTrial: Boolean,
//     trialDays: Number,
//     failedOTPAttempts: Number,
//     otp: {
//       code: String,
//       expiresAt: Date,
//       attempts: Number
//     },
//     invoiceId: String,
//     invoiceUrl: String
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes
// paymentSchema.index({ createdAt: -1 });
// paymentSchema.index({ userId: 1, createdAt: -1 });
// paymentSchema.index({ planId: 1 });
// paymentSchema.index({ paymentMethod: 1 });
// paymentSchema.index({ gateway: 1 });
// paymentSchema.index({ status: 1 });
// paymentSchema.index({ transactionId: 1 });
// paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// // Virtuals
// paymentSchema.virtual('user', {
//   ref: 'User',
//   localField: 'userId',
//   foreignField: '_id',
//   justOne: true
// });

// paymentSchema.virtual('plan', {
//   ref: 'Plan',
//   localField: 'planId',
//   foreignField: '_id',
//   justOne: true
// });

// paymentSchema.virtual('coupon', {
//   ref: 'Coupon',
//   localField: 'couponId',
//   foreignField: '_id',
//   justOne: true
// });

// paymentSchema.virtual('subscription', {
//   ref: 'Subscription',
//   localField: '_id',
//   foreignField: 'paymentId',
//   justOne: true
// });

// // Methods
// paymentSchema.methods.isRefundable = function() {
//   if (this.status !== 'completed') return false;
//   if (this.refundStatus) return false;
//   if (!this.completedAt) return false;
  
//   // Check if payment is within refund period (30 days)
//   const refundDeadline = new Date(this.completedAt);
//   refundDeadline.setDate(refundDeadline.getDate() + 30);
  
//   return new Date() <= refundDeadline;
// };

// paymentSchema.methods.getRefundDeadline = function() {
//   if (!this.completedAt) return null;
  
//   const refundDeadline = new Date(this.completedAt);
//   refundDeadline.setDate(refundDeadline.getDate() + 30);
  
//   return refundDeadline;
// };

// // Statics
// paymentSchema.statics.findByPaymentId = function(paymentId) {
//   return this.findOne({ paymentId }).populate('user plan coupon');
// };

// paymentSchema.statics.findByTransactionId = function(transactionId) {
//   return this.findOne({ transactionId }).populate('user plan coupon');
// };

// paymentSchema.statics.findUserPayments = function(userId, limit = 10, skip = 0) {
//   return this.find({ userId })
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit)
//     .populate('plan coupon');
// };

// // Pre-save middleware
// paymentSchema.pre('save', function(next) {
//   // Auto-calculate final amount if not provided
//   if (this.isNew && !this.finalAmount) {
//     this.finalAmount = this.amount - (this.discountApplied || 0) + (this.taxAmount || 0);
//   }
  
//   // Set timestamps based on status changes
//   if (this.isModified('status')) {
//     if (this.status === 'completed' && !this.completedAt) {
//       this.completedAt = new Date();
//     } else if (this.status === 'cancelled' && !this.cancelledAt) {
//       this.cancelledAt = new Date();
//     }
//   }
  
//   next();
// });

// // Query helpers
// paymentSchema.query.pending = function() {
//   return this.where({ status: 'pending' });
// };

// paymentSchema.query.completed = function() {
//   return this.where({ status: 'completed' });
// };

// paymentSchema.query.failed = function() {
//   return this.where({ status: 'failed' });
// };

// const Payment = mongoose.model('Payment', paymentSchema);

// module.exports = Payment;