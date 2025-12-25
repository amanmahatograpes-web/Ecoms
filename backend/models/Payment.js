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
  
  gatewayOrderId: String,
  gatewayPaymentId: String,
  
  // Payment Breakdown
  amountBreakdown: {
    baseAmount: Number,
    discountAmount: Number,
    taxAmount: Number,
    taxPercentage: Number,
    finalAmount: Number
  },
  
  // Coupon Information
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  
  // Billing Information
  billingAddress: {
    name: String,
    email: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
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
  
  // Notes
  notes: String,
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    hasTrial: Boolean,
    trialDays: Number,
    planName: String,
    couponCode: String,
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
paymentSchema.index({ gatewayOrderId: 1 });
paymentSchema.index({ gatewayPaymentId: 1 });
paymentSchema.index({ paymentMethod: 1 });
paymentSchema.index({ gateway: 1 });

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

module.exports = mongoose.model('Payment', paymentSchema);