const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const subscriptionController = require('../../controllers/subscription/subscriptionController');
const auth = require('../../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/subscription/plans
// @desc    Get available subscription plans
// @access  Private
router.get('/plans', subscriptionController.getSubscriptionPlans);

// @route   GET /api/subscription/plans/:planId
// @desc    Get subscription plan details
// @access  Private
router.get('/plans/:planId', subscriptionController.getPlanDetails);

// @route   POST /api/subscription/checkout
// @desc    Create subscription checkout session
// @access  Private
router.post('/checkout', [
  check('planId', 'Plan ID is required').not().isEmpty(),
  check('vendorId', 'Vendor ID is required').not().isEmpty(),
  check('billingCycle', 'Billing cycle is required').isIn(['monthly', 'quarterly', 'yearly']),
  check('successUrl', 'Success URL is required').isURL(),
  check('cancelUrl', 'Cancel URL is required').isURL(),
  check('couponCode', 'Coupon code is optional').optional()
], subscriptionController.createCheckoutSession);

// @route   POST /api/subscription/upgrade-checkout
// @desc    Create upgrade checkout session
// @access  Private
router.post('/upgrade-checkout', [
  check('subscriptionId', 'Subscription ID is required').not().isEmpty(),
  check('newPlanId', 'New plan ID is required').not().isEmpty(),
  check('successUrl', 'Success URL is required').isURL(),
  check('cancelUrl', 'Cancel URL is required').isURL()
], subscriptionController.createUpgradeCheckoutSession);

// @route   GET /api/subscription/payment-methods
// @desc    Get saved payment methods
// @access  Private
router.get('/payment-methods', subscriptionController.getPaymentMethods);

// @route   POST /api/subscription/payment-methods
// @desc    Add payment method
// @access  Private
router.post('/payment-methods', [
  check('type', 'Payment method type is required').isIn(['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet']),
  check('details', 'Payment details are required').isObject()
], subscriptionController.addPaymentMethod);

// @route   PUT /api/subscription/payment-methods/:methodId
// @desc    Update payment method
// @access  Private
router.put('/payment-methods/:methodId', subscriptionController.updatePaymentMethod);

// @route   DELETE /api/subscription/payment-methods/:methodId
// @desc    Remove payment method
// @access  Private
router.delete('/payment-methods/:methodId', subscriptionController.removePaymentMethod);

// @route   POST /api/subscription/payment-methods/:methodId/default
// @desc    Set default payment method
// @access  Private
router.post('/payment-methods/:methodId/default', subscriptionController.setDefaultPaymentMethod);

// @route   GET /api/subscription/coupons
// @desc    Get available coupons
// @access  Private
router.get('/coupons', subscriptionController.getAvailableCoupons);

// @route   POST /api/subscription/coupons/validate
// @desc    Validate coupon
// @access  Private
router.post('/coupons/validate', [
  check('couponCode', 'Coupon code is required').not().isEmpty(),
  check('planId', 'Plan ID is required').not().isEmpty(),
  check('vendorId', 'Vendor ID is required').not().isEmpty()
], subscriptionController.validateCoupon);

// @route   GET /api/subscription/invoices
// @desc    Get subscription invoices
// @access  Private
router.get('/invoices', subscriptionController.getInvoices);

// @route   GET /api/subscription/invoices/:invoiceId
// @desc    Get invoice details
// @access  Private
router.get('/invoices/:invoiceId', subscriptionController.getInvoiceDetails);

// @route   POST /api/subscription/invoices/:invoiceId/pay
// @desc    Pay invoice
// @access  Private
router.post('/invoices/:invoiceId/pay', [
  check('paymentMethodId', 'Payment method ID is required').optional(),
  check('paymentMethodType', 'Payment method type is required if no ID provided').optional().isIn(['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet'])
], subscriptionController.payInvoice);

// @route   POST /api/subscription/invoices/:invoiceId/retry
// @desc    Retry failed payment
// @access  Private
router.post('/invoices/:invoiceId/retry', subscriptionController.retryPayment);

// @route   GET /api/subscription/usage
// @desc    Get subscription usage
// @access  Private
router.get('/usage', subscriptionController.getUsage);

// @route   GET /api/subscription/usage/:subscriptionId
// @desc    Get specific subscription usage
// @access  Private
router.get('/usage/:subscriptionId', subscriptionController.getSubscriptionUsage);

// @route   GET /api/subscription/limits
// @desc    Get subscription limits
// @access  Private
router.get('/limits', subscriptionController.getSubscriptionLimits);

// @route   POST /api/subscription/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/cancel', [
  check('subscriptionId', 'Subscription ID is required').not().isEmpty(),
  check('reason', 'Cancellation reason is optional').optional()
], subscriptionController.cancelSubscription);

// @route   POST /api/subscription/reactivate
// @desc    Reactivate cancelled subscription
// @access  Private
router.post('/reactivate', [
  check('subscriptionId', 'Subscription ID is required').not().isEmpty()
], subscriptionController.reactivateSubscription);

// @route   POST /api/subscription/pause
// @desc    Pause subscription
// @access  Private
router.post('/pause', [
  check('subscriptionId', 'Subscription ID is required').not().isEmpty(),
  check('resumeDate', 'Resume date is required').isISO8601()
], subscriptionController.pauseSubscription);

// @route   POST /api/subscription/resume
// @desc    Resume paused subscription
// @access  Private
router.post('/resume', [
  check('subscriptionId', 'Subscription ID is required').not().isEmpty()
], subscriptionController.resumeSubscription);

// @route   GET /api/subscription/billing-history
// @desc    Get billing history
// @access  Private
router.get('/billing-history', subscriptionController.getBillingHistory);

// @route   PUT /api/subscription/billing-info
// @desc    Update billing information
// @access  Private
router.put('/billing-info', [
  check('billingEmail', 'Billing email is required').isEmail(),
  check('taxId', 'Tax ID is optional').optional(),
  check('companyName', 'Company name is optional').optional(),
  check('address', 'Address should be an object').optional().isObject()
], subscriptionController.updateBillingInfo);

// @route   GET /api/subscription/receipts
// @desc    Get payment receipts
// @access  Private
router.get('/receipts', subscriptionController.getReceipts);

// @route   GET /api/subscription/receipts/:receiptId
// @desc    Get receipt details
// @access  Private
router.get('/receipts/:receiptId', subscriptionController.getReceiptDetails);

// @route   POST /api/subscription/receipts/:receiptId/download
// @desc    Download receipt
// @access  Private
router.post('/receipts/:receiptId/download', subscriptionController.downloadReceipt);

// @route   GET /api/subscription/analytics
// @desc    Get subscription analytics
// @access  Private
router.get('/analytics', subscriptionController.getSubscriptionAnalytics);

// @route   POST /api/subscription/webhook/stripe
// @desc    Stripe webhook handler
// @access  Public
router.post('/webhook/stripe', subscriptionController.handleStripeWebhook);

// @route   POST /api/subscription/webhook/razorpay
// @desc    Razorpay webhook handler
// @access  Public
router.post('/webhook/razorpay', subscriptionController.handleRazorpayWebhook);

// @route   GET /api/subscription/trial
// @desc    Get trial information
// @access  Private
router.get('/trial', subscriptionController.getTrialInfo);

// @route   POST /api/subscription/trial/extend
// @desc    Request trial extension
// @access  Private
router.post('/trial/extend', [
  check('reason', 'Extension reason is required').not().isEmpty(),
  check('requestedDays', 'Requested days should be a number').isInt({ min: 1, max: 30 })
], subscriptionController.requestTrialExtension);

module.exports = router;