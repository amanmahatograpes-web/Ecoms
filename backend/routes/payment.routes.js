const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {
  authenticate,
  authorize,
  hasPermission,
  validateRequest,
  asyncHandler,
  createRateLimiter
} = require('../middleware');

// Models
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

// Validation schemas
const {
  initializePaymentSchema,
  verifyOTPSchema,
  refundPaymentSchema,
  webhookSchema
} = require('../middleware/validation/paymentValidation');

// Payment gateways
const paymentGateways = {
  razorpay: require('../integrations/razorpay'),
  stripe: require('../integrations/stripe'),
  paypal: require('../integrations/paypal')
};

// Rate limiters
const paymentLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many payment attempts, please try again later.'
});

const otpLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: 'Too many OTP attempts, please try again later.'
});

// Utility functions
const generatePaymentId = () => {
  return `pay_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};

const generateTransactionId = (gateway) => {
  return `${gateway}_txn_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
};

const calculatePaymentAmount = async (planId, quantity = 1, couponCode = null) => {
  const plan = await Plan.findById(planId).lean();
  if (!plan) {
    throw new Error('Plan not found');
  }

  let baseAmount = plan.currentPrice * quantity;
  let discountAmount = 0;
  let coupon = null;

  // Apply coupon if provided
  if (couponCode) {
    coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase(),
      isActive: true 
    });

    if (coupon && coupon.isValid) {
      if (coupon.minimumPurchase && baseAmount < coupon.minimumPurchase) {
        throw new Error(`Coupon requires minimum purchase of ${coupon.minimumPurchase}`);
      }

      if (coupon.discountType === 'percentage') {
        discountAmount = (baseAmount * coupon.discountValue) / 100;
        if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
          discountAmount = coupon.maximumDiscount;
        }
      } else if (coupon.discountType === 'fixed') {
        discountAmount = coupon.discountValue;
      }
    }
  }

  const subtotal = baseAmount - discountAmount;
  const taxAmount = plan.taxPercentage ? (subtotal * plan.taxPercentage) / 100 : 0;
  const totalAmount = subtotal + taxAmount;

  return {
    baseAmount,
    discountAmount,
    taxAmount,
    totalAmount,
    currency: 'INR',
    plan,
    coupon
  };
};

const sendPaymentNotification = async (payment, user, type) => {
  // Implement email/SMS notification logic
  console.log(`Payment ${type} notification sent to ${user.email} for payment ${payment._id}`);
};

/**
 * @desc    Get all payments (admin only)
 * @route   GET /api/v1/payments
 * @access  Private/Admin
 */
router.get(
  '/',
  authenticate,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 20,
      status,
      paymentMethod,
      gateway,
      startDate,
      endDate,
      userId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (gateway) {
      filter.gateway = gateway;
    }

    if (userId) {
      filter.userId = userId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { paymentId: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get payments with population
    const payments = await Payment.find(filter)
      .populate('userId', 'name email')
      .populate('planId', 'name description')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Payment.countDocuments(filter);

    // Calculate statistics
    const stats = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          successfulPayments: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          pendingPayments: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          failedPayments: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          total,
          page: parseInt(page),
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        },
        stats: stats[0] || {
          totalRevenue: 0,
          successfulPayments: 0,
          pendingPayments: 0,
          failedPayments: 0
        },
        filters: {
          status,
          paymentMethod,
          gateway,
          startDate,
          endDate,
          userId
        }
      }
    });
  })
);

/**
 * @desc    Get payment by ID
 * @route   GET /api/v1/payments/:id
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    const payment = await Payment.findOne({
      $or: [
        { _id: id },
        { paymentId: id },
        { transactionId: id }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('planId', 'name description features')
      .populate('couponId', 'code discountType discountValue')
      .lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'PAYMENT_NOT_FOUND',
        message: 'Payment not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && payment.userId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'ACCESS_DENIED',
        message: 'You do not have permission to view this payment'
      });
    }

    // Get related subscription if exists
    let subscription = null;
    if (payment.status === 'completed') {
      subscription = await Subscription.findOne({
        userId: payment.userId._id,
        planId: payment.planId._id,
        status: 'active'
      })
        .select('status currentPeriodStart currentPeriodEnd trialEnds')
        .lean();
    }

    // Get payment timeline
    const timeline = await getPaymentTimeline(payment._id);

    res.json({
      success: true,
      data: {
        ...payment,
        subscription,
        timeline,
        canRefund: canRefundPayment(payment),
        refundDeadline: getRefundDeadline(payment)
      }
    });
  })
);

/**
 * @desc    Initialize a new payment
 * @route   POST /api/v1/payments/initialize
 * @access  Private
 */
router.post(
  '/initialize',
  authenticate,
  paymentLimiter,
  validateRequest(initializePaymentSchema),
  asyncHandler(async (req, res) => {
    const {
      planId,
      paymentMethod,
      gateway = 'razorpay',
      couponCode,
      billingAddress,
      notes,
      metadata = {}
    } = req.body;

    const userId = req.user.userId;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    // Check if user already has an active subscription for this plan
    const existingSubscription = await Subscription.findOne({
      userId,
      planId,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        error: 'ACTIVE_SUBSCRIPTION_EXISTS',
        message: 'You already have an active subscription for this plan'
      });
    }

    // Calculate payment amount
    let amountDetails;
    try {
      amountDetails = await calculatePaymentAmount(planId, 1, couponCode);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'CALCULATION_ERROR',
        message: error.message
      });
    }

    const { totalAmount, plan, coupon } = amountDetails;

    // Check if plan is active
    if (!plan.isActive) {
      return res.status(400).json({
        success: false,
        error: 'PLAN_INACTIVE',
        message: 'This plan is no longer available'
      });
    }

    // Check if user is eligible for trial
    let hasTrial = false;
    if (plan.trialDays > 0) {
      const trialEligibility = await checkTrialEligibility(userId, plan._id);
      hasTrial = trialEligibility.isEligible;
    }

    // Create payment record
    const payment = await Payment.create({
      userId,
      planId,
      paymentId: generatePaymentId(),
      amount: totalAmount,
      currency: 'INR',
      status: 'pending',
      paymentMethod,
      gateway,
      couponId: coupon?._id,
      billingAddress: {
        ...billingAddress,
        email: user.email,
        name: user.name
      },
      notes,
      metadata: {
        ...metadata,
        hasTrial,
        trialDays: hasTrial ? plan.trialDays : 0,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        planName: plan.name,
        couponCode: coupon?.code
      },
      amountBreakdown: {
        baseAmount: amountDetails.baseAmount,
        discountAmount: amountDetails.discountAmount,
        taxAmount: amountDetails.taxAmount,
        taxPercentage: plan.taxPercentage,
        finalAmount: totalAmount
      }
    });

    // Initialize payment with gateway
    let gatewayResponse;
    try {
      const gatewayClient = paymentGateways[gateway];
      if (!gatewayClient) {
        throw new Error(`Unsupported payment gateway: ${gateway}`);
      }

      gatewayResponse = await gatewayClient.createOrder({
        amount: totalAmount * 100, // Convert to paise/pence
        currency: 'INR',
        receipt: payment.paymentId,
        notes: {
          userId: userId.toString(),
          planId: planId.toString(),
          paymentId: payment._id.toString()
        },
        customer: {
          name: user.name,
          email: user.email,
          contact: billingAddress?.phone || user.phone
        }
      });
    } catch (error) {
      // Update payment status
      await Payment.findByIdAndUpdate(payment._id, {
        status: 'failed',
        error: {
          code: 'GATEWAY_ERROR',
          message: error.message,
          gateway: gateway
        }
      });

      return res.status(500).json({
        success: false,
        error: 'PAYMENT_GATEWAY_ERROR',
        message: 'Failed to initialize payment with gateway',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    // Update payment with gateway order details
    await Payment.findByIdAndUpdate(payment._id, {
      gatewayOrderId: gatewayResponse.orderId || gatewayResponse.id,
      gatewayData: gatewayResponse
    });

    // Send payment initiated notification
    await sendPaymentNotification(payment, user, 'initiated');

    res.status(201).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        payment: {
          id: payment._id,
          paymentId: payment.paymentId,
          amount: totalAmount,
          currency: 'INR',
          status: payment.status,
          gateway,
          gatewayOrderId: gatewayResponse.orderId || gatewayResponse.id,
          gatewayData: gatewayResponse
        },
        plan: {
          id: plan._id,
          name: plan.name,
          description: plan.description,
          trialDays: hasTrial ? plan.trialDays : 0,
          hasTrial
        },
        user: {
          name: user.name,
          email: user.email
        },
        nextSteps: {
          requiresRedirect: gatewayResponse.redirectUrl ? true : false,
          redirectUrl: gatewayResponse.redirectUrl,
          requiresOTP: paymentMethod === 'credit_card' || paymentMethod === 'debit_card',
          paymentDeadline: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        }
      }
    });
  })
);

/**
 * @desc    Verify OTP for payment
 * @route   POST /api/v1/payments/otp/verify
 * @access  Private
 */
router.post(
  '/otp/verify',
  authenticate,
  otpLimiter,
  validateRequest(verifyOTPSchema),
  asyncHandler(async (req, res) => {
    const { paymentId, otp, gatewayPaymentId } = req.body;
    const userId = req.user.userId;

    // Find payment
    const payment = await Payment.findOne({
      paymentId,
      userId,
      status: 'pending'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'PAYMENT_NOT_FOUND',
        message: 'Payment not found or already processed'
      });
    }

    // Check if OTP verification is required for this payment method
    if (!['credit_card', 'debit_card'].includes(payment.paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: 'OTP_NOT_REQUIRED',
        message: 'OTP verification is not required for this payment method'
      });
    }

    // Verify OTP (in production, integrate with SMS service)
    const isValidOTP = await verifyPaymentOTP(paymentId, otp);
    
    if (!isValidOTP) {
      // Increment failed attempts
      payment.metadata.failedOTPAttempts = (payment.metadata.failedOTPAttempts || 0) + 1;
      
      if (payment.metadata.failedOTPAttempts >= 3) {
        payment.status = 'failed';
        payment.error = {
          code: 'MAX_OTP_ATTEMPTS',
          message: 'Maximum OTP attempts exceeded'
        };
        await payment.save();
        
        return res.status(400).json({
          success: false,
          error: 'MAX_OTP_ATTEMPTS',
          message: 'Maximum OTP attempts exceeded. Payment has been cancelled.'
        });
      }
      
      await payment.save();
      
      return res.status(400).json({
        success: false,
        error: 'INVALID_OTP',
        message: 'Invalid OTP. Please try again.',
        attemptsRemaining: 3 - payment.metadata.failedOTPAttempts
      });
    }

    // Process payment with gateway
    try {
      const gatewayClient = paymentGateways[payment.gateway];
      const captureResponse = await gatewayClient.capturePayment({
        paymentId: gatewayPaymentId,
        amount: payment.amount * 100,
        currency: payment.currency
      });

      // Update payment status
      payment.status = 'completed';
      payment.transactionId = captureResponse.transactionId || generateTransactionId(payment.gateway);
      payment.gatewayPaymentId = gatewayPaymentId;
      payment.completedAt = new Date();
      payment.gatewayResponse = captureResponse;
      
      // Clear OTP attempts
      payment.metadata.failedOTPAttempts = 0;
      
      await payment.save();

      // Create subscription
      const subscription = await createSubscription(payment);

      // Send success notifications
      await sendPaymentNotification(payment, req.user, 'completed');
      
      // Update coupon usage if used
      if (payment.couponId) {
        await Coupon.findByIdAndUpdate(payment.couponId, {
          $inc: { usedCount: 1 },
          lastUsedAt: new Date(),
          lastUsedBy: userId
        });
      }

      res.json({
        success: true,
        message: 'Payment completed successfully',
        data: {
          payment: {
            id: payment._id,
            paymentId: payment.paymentId,
            amount: payment.amount,
            status: payment.status,
            transactionId: payment.transactionId,
            completedAt: payment.completedAt
          },
          subscription: {
            id: subscription._id,
            plan: subscription.planId,
            status: subscription.status,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            trialEnds: subscription.trialEnds
          },
          invoice: await generateInvoice(payment)
        }
      });

    } catch (error) {
      // Update payment status
      payment.status = 'failed';
      payment.error = {
        code: 'CAPTURE_FAILED',
        message: error.message,
        gateway: payment.gateway
      };
      await payment.save();

      return res.status(500).json({
        success: false,
        error: 'PAYMENT_CAPTURE_FAILED',
        message: 'Failed to capture payment',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  })
);

/**
 * @desc    Generate OTP for payment
 * @route   POST /api/v1/payments/otp/generate
 * @access  Private
 */
router.post(
  '/otp/generate',
  authenticate,
  otpLimiter,
  asyncHandler(async (req, res) => {
    const { paymentId } = req.body;
    const userId = req.user.userId;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'PAYMENT_ID_REQUIRED',
        message: 'Payment ID is required'
      });
    }

    const payment = await Payment.findOne({
      paymentId,
      userId,
      status: 'pending'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'PAYMENT_NOT_FOUND',
        message: 'Payment not found or already processed'
      });
    }

    // Check if payment method requires OTP
    if (!['credit_card', 'debit_card'].includes(payment.paymentMethod)) {
      return res.status(400).json({
        success: false,
        error: 'OTP_NOT_SUPPORTED',
        message: 'OTP is not supported for this payment method'
      });
    }

    // Generate OTP (in production, send via SMS/email)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP (in production, use secure storage like Redis)
    payment.metadata.otp = {
      code: otp,
      expiresAt: otpExpires,
      attempts: 0
    };
    
    await payment.save();

    // In production, send OTP via SMS/email
    const user = await User.findById(userId).select('phone email').lean();
    
    console.log(`OTP for payment ${paymentId}: ${otp}`); // Remove in production

    res.json({
      success: true,
      message: 'OTP generated successfully',
      data: {
        otpExpires: otpExpires,
        otpLength: 6,
        // In production, don't send OTP in response
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        deliveryMethod: user.phone ? 'sms' : 'email',
        maskedContact: user.phone ? 
          `${user.phone.slice(0, 2)}******${user.phone.slice(-2)}` : 
          `${user.email.split('@')[0].slice(0, 2)}****@${user.email.split('@')[1]}`
      }
    });
  })
);

/**
 * @desc    Get payment history for current user
 * @route   GET /api/v1/payments/history
 * @access  Private
 */
router.get(
  '/history',
  authenticate,
  asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
      search
    } = req.query;

    const userId = req.user.userId;

    // Build filter
    const filter = { userId };

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { paymentId: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
        { 'planId.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get payments with population
    const payments = await Payment.find(filter)
      .populate('planId', 'name description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Payment.countDocuments(filter);

    // Calculate summary
    const summary = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$amount' },
          totalPayments: { $sum: 1 },
          successfulPayments: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          lastPayment: { $max: '$createdAt' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          total,
          page: parseInt(page),
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        },
        summary: summary[0] || {
          totalSpent: 0,
          totalPayments: 0,
          successfulPayments: 0,
          lastPayment: null
        }
      }
    });
  })
);

/**
 * @desc    Refund a payment
 * @route   POST /api/v1/payments/:id/refund
 * @access  Private/Admin
 */
router.post(
  '/:id/refund',
  authenticate,
  authorize('admin'),
  validateRequest(refundPaymentSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason, refundAmount, notes } = req.body;

    // Find payment
    const payment = await Payment.findById(id)
      .populate('userId', 'name email')
      .populate('planId', 'name');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'PAYMENT_NOT_FOUND',
        message: 'Payment not found'
      });
    }

    // Check if payment is eligible for refund
    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'INVALID_PAYMENT_STATUS',
        message: 'Only completed payments can be refunded'
      });
    }

    if (payment.refundStatus) {
      return res.status(400).json({
        success: false,
        error: 'REFUND_ALREADY_PROCESSED',
        message: 'A refund has already been processed for this payment'
      });
    }

    // Check refund deadline
    if (!canRefundPayment(payment)) {
      return res.status(400).json({
        success: false,
        error: 'REFUND_PERIOD_EXPIRED',
        message: 'Refund period has expired for this payment'
      });
    }

    // Calculate refund amount
    const amountToRefund = refundAmount || payment.amount;
    
    if (amountToRefund > payment.amount) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REFUND_AMOUNT',
        message: 'Refund amount cannot exceed original payment amount'
      });
    }

    // Process refund with gateway
    try {
      const gatewayClient = paymentGateways[payment.gateway];
      const refundResponse = await gatewayClient.createRefund({
        paymentId: payment.gatewayPaymentId || payment.transactionId,
        amount: amountToRefund * 100,
        notes: reason
      });

      // Update payment with refund details
      payment.refundStatus = 'processed';
      payment.refundAmount = amountToRefund;
      payment.refundReason = reason;
      payment.refundNotes = notes;
      payment.refundedAt = new Date();
      payment.refundedBy = req.user.userId;
      payment.refundTransactionId = refundResponse.refundId;
      payment.refundResponse = refundResponse;

      // If full refund, mark payment as refunded
      if (amountToRefund === payment.amount) {
        payment.status = 'refunded';
      }

      await payment.save();

      // Cancel subscription if full refund
      if (amountToRefund === payment.amount) {
        await Subscription.findOneAndUpdate(
          { userId: payment.userId, planId: payment.planId, status: 'active' },
          {
            status: 'canceled',
            canceledAt: new Date(),
            cancelReason: 'payment_refunded'
          }
        );
      }

      // Send refund notification
      await sendPaymentNotification(payment, payment.userId, 'refunded');

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          refund: {
            id: payment._id,
            paymentId: payment.paymentId,
            originalAmount: payment.amount,
            refundAmount: amountToRefund,
            status: payment.refundStatus,
            reason,
            refundTransactionId: refundResponse.refundId,
            processedAt: payment.refundedAt
          },
          payment: {
            status: payment.status,
            refundStatus: payment.refundStatus
          }
        }
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'REFUND_PROCESSING_FAILED',
        message: 'Failed to process refund',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  })
);

/**
 * @desc    Payment webhook handler (for payment gateways)
 * @route   POST /api/v1/payments/webhook/:gateway
 * @access  Public
 */
router.post(
  '/webhook/:gateway',
  asyncHandler(async (req, res) => {
    const { gateway } = req.params;
    const signature = req.headers['x-razorpay-signature'] || 
                     req.headers['stripe-signature'] || 
                     req.headers['paypal-signature'];

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(gateway, req.body, signature);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_SIGNATURE',
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body;
    console.log(`${gateway} webhook received:`, event.event || event.type);

    // Process event based on gateway
    switch (gateway) {
      case 'razorpay':
        await handleRazorpayWebhook(event);
        break;
      case 'stripe':
        await handleStripeWebhook(event);
        break;
      case 'paypal':
        await handlePaypalWebhook(event);
        break;
      default:
        console.warn(`Unsupported gateway: ${gateway}`);
    }

    // Acknowledge receipt
    res.status(200).json({ success: true, received: true });
  })
);

/**
 * @desc    Payment callback handler (for redirect-based payments)
 * @route   GET /api/v1/payments/callback/:gateway
 * @access  Public
 */
router.get(
  '/callback/:gateway',
  asyncHandler(async (req, res) => {
    const { gateway } = req.params;
    const { payment_id, order_id, status, error_code, error_description } = req.query;

    // Find payment by gateway order ID
    const payment = await Payment.findOne({
      gatewayOrderId: order_id || payment_id
    }).populate('userId', 'name email');

    if (!payment) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?error=payment_not_found`);
    }

    // Update payment status
    if (status === 'captured' || status === 'succeeded') {
      payment.status = 'completed';
      payment.gatewayPaymentId = payment_id;
      payment.transactionId = generateTransactionId(gateway);
      payment.completedAt = new Date();
      
      await payment.save();

      // Create subscription
      await createSubscription(payment);

      // Send notification
      await sendPaymentNotification(payment, payment.userId, 'completed');

      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?paymentId=${payment.paymentId}`);
    } else {
      payment.status = 'failed';
      payment.error = {
        code: error_code || 'CALLBACK_FAILED',
        message: error_description || 'Payment failed'
      };
      
      await payment.save();

      return res.redirect(`${process.env.FRONTEND_URL}/payment/failed?paymentId=${payment.paymentId}&error=${error_code}`);
    }
  })
);

/**
 * @desc    Test endpoint
 * @route   GET /api/v1/payments/test
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Payment API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: [
      'GET / - Get all payments (admin)',
      'GET /:id - Get payment by ID',
      'POST /initialize - Initialize payment',
      'POST /otp/verify - Verify OTP',
      'POST /otp/generate - Generate OTP',
      'GET /history - Get payment history',
      'POST /:id/refund - Refund payment',
      'POST /webhook/:gateway - Webhook handler',
      'GET /callback/:gateway - Callback handler'
    ],
    supportedGateways: ['razorpay', 'stripe', 'paypal'],
    environment: process.env.NODE_ENV
  });
});

// Helper functions
const checkTrialEligibility = async (userId, planId) => {
  // Check if user has used trial for any plan
  const trialUsed = await Subscription.exists({
    userId,
    isTrial: true,
    status: { $in: ['active', 'canceled'] }
  });

  // Check if user has subscribed to this plan before
  const planSubscribed = await Subscription.exists({
    userId,
    planId,
    status: { $in: ['active', 'canceled'] }
  });

  return {
    isEligible: !trialUsed && !planSubscribed,
    trialUsed,
    planSubscribed
  };
};

const verifyPaymentOTP = async (paymentId, otp) => {
  // In production, verify OTP from secure storage
  const payment = await Payment.findOne({ paymentId });
  
  if (!payment || !payment.metadata.otp) {
    return false;
  }

  const otpData = payment.metadata.otp;
  
  // Check expiration
  if (new Date() > new Date(otpData.expiresAt)) {
    return false;
  }

  // Verify OTP
  return otpData.code === otp;
};

const createSubscription = async (payment) => {
  const plan = await Plan.findById(payment.planId);
  
  // Check for trial eligibility
  const trialEligibility = await checkTrialEligibility(payment.userId, payment.planId);
  const hasTrial = trialEligibility.isEligible && plan.trialDays > 0;

  // Calculate subscription dates
  const now = new Date();
  let currentPeriodStart = now;
  let currentPeriodEnd = new Date(now);
  let trialEnds = null;

  if (hasTrial) {
    trialEnds = new Date(now);
    trialEnds.setDate(trialEnds.getDate() + plan.trialDays);
    currentPeriodEnd = new Date(trialEnds);
  } else {
    currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // Default: monthly
  }

  // Create subscription
  const subscription = await Subscription.create({
    userId: payment.userId,
    planId: payment.planId,
    paymentId: payment._id,
    status: 'active',
    currentPeriodStart,
    currentPeriodEnd,
    trialEnds,
    isTrial: hasTrial,
    billingCycle: 'month', // Could be dynamic
    unitPrice: plan.currentPrice,
    totalAmount: payment.amount,
    autoRenew: !hasTrial, // Auto-renew only if not trial
    metadata: {
      paymentMethod: payment.paymentMethod,
      gateway: payment.gateway,
      hasTrial
    }
  });

  // Update plan subscription count
  await Plan.findByIdAndUpdate(payment.planId, {
    $inc: { subscriptionCount: 1, totalRevenue: payment.amount }
  });

  return subscription;
};

const getPaymentTimeline = async (paymentId) => {
  const payment = await Payment.findById(paymentId).select('createdAt completedAt refundedAt').lean();
  
  const timeline = [];
  
  if (payment.createdAt) {
    timeline.push({
      event: 'created',
      timestamp: payment.createdAt,
      status: 'Payment initiated'
    });
  }
  
  if (payment.completedAt) {
    timeline.push({
      event: 'completed',
      timestamp: payment.completedAt,
      status: 'Payment completed'
    });
  }
  
  if (payment.refundedAt) {
    timeline.push({
      event: 'refunded',
      timestamp: payment.refundedAt,
      status: 'Payment refunded'
    });
  }
  
  return timeline;
};

const canRefundPayment = (payment) => {
  if (payment.status !== 'completed') return false;
  
  // Check if payment is within refund period (30 days)
  const refundDeadline = new Date(payment.completedAt);
  refundDeadline.setDate(refundDeadline.getDate() + 30);
  
  return new Date() <= refundDeadline;
};

const getRefundDeadline = (payment) => {
  if (!payment.completedAt) return null;
  
  const refundDeadline = new Date(payment.completedAt);
  refundDeadline.setDate(refundDeadline.getDate() + 30);
  
  return refundDeadline;
};

const generateInvoice = async (payment) => {
  // Generate invoice data
  const invoiceId = `INV-${payment.paymentId.slice(-8).toUpperCase()}`;
  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    invoiceId,
    issueDate,
    dueDate,
    from: {
      name: process.env.COMPANY_NAME || 'Your Company',
      address: process.env.COMPANY_ADDRESS || '123 Business Street, City, Country',
      taxId: process.env.COMPANY_TAX_ID || 'TAX123456'
    },
    to: {
      name: payment.billingAddress.name,
      email: payment.billingAddress.email,
      address: payment.billingAddress
    },
    items: [
      {
        description: payment.metadata.planName || 'Subscription Plan',
        quantity: 1,
        unitPrice: payment.amountBreakdown.baseAmount,
        amount: payment.amountBreakdown.baseAmount
      }
    ],
    subtotal: payment.amountBreakdown.baseAmount,
    discount: payment.amountBreakdown.discountAmount,
    tax: payment.amountBreakdown.taxAmount,
    total: payment.amount
  };
};

const verifyWebhookSignature = async (gateway, payload, signature) => {
  // Implement signature verification for each gateway
  switch (gateway) {
    case 'razorpay':
      return verifyRazorpaySignature(payload, signature);
    case 'stripe':
      return verifyStripeSignature(payload, signature);
    case 'paypal':
      return verifyPaypalSignature(payload, signature);
    default:
      return false;
  }
};

const verifyRazorpaySignature = (payload, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const body = JSON.stringify(payload);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
};

const verifyStripeSignature = (payload, signature) => {
  // Stripe signature verification
  // Implementation depends on Stripe SDK
  return true; // Placeholder
};

const verifyPaypalSignature = (payload, signature) => {
  // PayPal signature verification
  return true; // Placeholder
};

const handleRazorpayWebhook = async (event) => {
  const { event: eventType, payload } = event;
  
  switch (eventType) {
    case 'payment.captured':
      await handlePaymentCaptured(payload.payment.entity);
      break;
    case 'payment.failed':
      await handlePaymentFailed(payload.payment.entity);
      break;
    case 'refund.processed':
      await handleRefundProcessed(payload.refund.entity);
      break;
  }
};

const handleStripeWebhook = async (event) => {
  const { type, data } = event;
  
  switch (type) {
    case 'payment_intent.succeeded':
      await handlePaymentCaptured(data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(data.object);
      break;
    case 'charge.refunded':
      await handleRefundProcessed(data.object);
      break;
  }
};

const handlePaypalWebhook = async (event) => {
  const { event_type, resource } = event;
  
  switch (event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      await handlePaymentCaptured(resource);
      break;
    case 'PAYMENT.CAPTURE.FAILED':
      await handlePaymentFailed(resource);
      break;
    case 'PAYMENT.CAPTURE.REFUNDED':
      await handleRefundProcessed(resource);
      break;
  }
};

const handlePaymentCaptured = async (paymentData) => {
  const payment = await Payment.findOne({
    gatewayOrderId: paymentData.order_id || paymentData.id
  });

  if (!payment) return;

  payment.status = 'completed';
  payment.gatewayPaymentId = paymentData.id;
  payment.transactionId = generateTransactionId(payment.gateway);
  payment.completedAt = new Date();
  payment.gatewayResponse = paymentData;
  
  await payment.save();

  // Create subscription
  await createSubscription(payment);

  // Send notification
  await sendPaymentNotification(payment, payment.userId, 'completed');
};

const handlePaymentFailed = async (paymentData) => {
  const payment = await Payment.findOne({
    gatewayOrderId: paymentData.order_id || paymentData.id
  });

  if (!payment) return;

  payment.status = 'failed';
  payment.error = {
    code: paymentData.error_code || 'GATEWAY_FAILED',
    message: paymentData.error_description || 'Payment failed',
    gatewayResponse: paymentData
  };
  
  await payment.save();

  // Send notification
  await sendPaymentNotification(payment, payment.userId, 'failed');
};

const handleRefundProcessed = async (refundData) => {
  const payment = await Payment.findOne({
    gatewayPaymentId: refundData.payment_id || refundData.payment_intent
  });

  if (!payment) return;

  payment.refundStatus = 'processed';
  payment.refundAmount = refundData.amount / 100; // Convert from paise/pence
  payment.refundedAt = new Date();
  payment.refundTransactionId = refundData.id;
  payment.refundResponse = refundData;

  if (payment.refundAmount === payment.amount) {
    payment.status = 'refunded';
  }
  
  await payment.save();

  // Send notification
  await sendPaymentNotification(payment, payment.userId, 'refunded');
};

module.exports = router;