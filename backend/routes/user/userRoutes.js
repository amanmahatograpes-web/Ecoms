const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../../controllers/user/userController');
const auth = require('../../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', userController.getProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  check('firstName', 'First name is required').optional().not().isEmpty(),
  check('lastName', 'Last name is optional').optional(),
  check('phone', 'Please enter a valid Indian phone number').optional().matches(/^[6-9]\d{9}$/),
  check('organization.name', 'Organization name is optional').optional(),
  check('organization.position', 'Position is optional').optional(),
  check('organization.department', 'Department is optional').optional()
], userController.updateProfile);

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', userController.updatePreferences);

// @route   GET /api/user/subscriptions
// @desc    Get user subscriptions
// @access  Private
router.get('/subscriptions', userController.getSubscriptions);

// @route   GET /api/user/subscriptions/:subscriptionId
// @desc    Get subscription details
// @access  Private
router.get('/subscriptions/:subscriptionId', userController.getSubscriptionDetails);

// @route   POST /api/user/subscriptions
// @desc    Create new subscription
// @access  Private
router.post('/subscriptions', [
  check('planId', 'Plan ID is required').not().isEmpty(),
  check('vendorId', 'Vendor ID is required').not().isEmpty(),
  check('billingCycle', 'Billing cycle is required').isIn(['monthly', 'quarterly', 'yearly']),
  check('paymentMethod', 'Payment method is required').isIn(['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet']),
  check('couponCode', 'Coupon code is optional').optional()
], userController.createSubscription);

// @route   PUT /api/user/subscriptions/:subscriptionId/cancel
// @desc    Cancel subscription
// @access  Private
router.put('/subscriptions/:subscriptionId/cancel', [
  check('reason', 'Cancellation reason is required').optional().not().isEmpty()
], userController.cancelSubscription);

// @route   PUT /api/user/subscriptions/:subscriptionId/upgrade
// @desc    Upgrade subscription
// @access  Private
router.put('/subscriptions/:subscriptionId/upgrade', [
  check('newPlanId', 'New plan ID is required').not().isEmpty(),
  check('prorate', 'Prorate should be boolean').optional().isBoolean()
], userController.upgradeSubscription);

// @route   PUT /api/user/subscriptions/:subscriptionId/downgrade
// @desc    Downgrade subscription
// @access  Private
router.put('/subscriptions/:subscriptionId/downgrade', [
  check('newPlanId', 'New plan ID is required').not().isEmpty(),
  check('effectiveDate', 'Effective date should be a valid date').optional().isISO8601()
], userController.downgradeSubscription);

// @route   GET /api/user/invoices
// @desc    Get user invoices
// @access  Private
router.get('/invoices', userController.getInvoices);

// @route   GET /api/user/invoices/:invoiceId
// @desc    Get invoice details
// @access  Private
router.get('/invoices/:invoiceId', userController.getInvoiceDetails);

// @route   POST /api/user/invoices/:invoiceId/download
// @desc    Download invoice
// @access  Private
router.post('/invoices/:invoiceId/download', userController.downloadInvoice);

// @route   POST /api/user/invoices/:invoiceId/pay
// @desc    Pay invoice
// @access  Private
router.post('/invoices/:invoiceId/pay', [
  check('paymentMethod', 'Payment method is required').isIn(['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet'])
], userController.payInvoice);

// @route   GET /api/user/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', userController.getNotifications);

// @route   PUT /api/user/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private
router.put('/notifications/:notificationId/read', userController.markNotificationAsRead);

// @route   PUT /api/user/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/notifications/read-all', userController.markAllNotificationsAsRead);

// @route   GET /api/user/vendors
// @desc    Get subscribed vendors
// @access  Private
router.get('/vendors', userController.getSubscribedVendors);

// @route   POST /api/user/vendors/:vendorId/subscribe
// @desc    Subscribe to vendor
// @access  Private
router.post('/vendors/:vendorId/subscribe', [
  check('receiveNotifications', 'Receive notifications should be boolean').optional().isBoolean()
], userController.subscribeToVendor);

// @route   DELETE /api/user/vendors/:vendorId/unsubscribe
// @desc    Unsubscribe from vendor
// @access  Private
router.delete('/vendors/:vendorId/unsubscribe', userController.unsubscribeFromVendor);

// @route   GET /api/user/plans
// @desc    Get saved plans
// @access  Private
router.get('/plans', userController.getSavedPlans);

// @route   POST /api/user/plans/:planId/save
// @desc    Save plan
// @access  Private
router.post('/plans/:planId/save', [
  check('notes', 'Notes are optional').optional()
], userController.savePlan);

// @route   DELETE /api/user/plans/:planId/unsave
// @desc    Remove saved plan
// @access  Private
router.delete('/plans/:planId/unsave', userController.removeSavedPlan);

// @route   GET /api/user/activity
// @desc    Get user activity log
// @access  Private
router.get('/activity', userController.getActivityLog);

// @route   POST /api/user/feedback
// @desc    Submit feedback
// @access  Private
router.post('/feedback', [
  check('type', 'Feedback type is required').isIn(['bug', 'feature_request', 'general', 'compliment']),
  check('message', 'Message is required').not().isEmpty(),
  check('rating', 'Rating should be between 1 and 5').optional().isInt({ min: 1, max: 5 })
], userController.submitFeedback);

// @route   POST /api/user/support-ticket
// @desc    Create support ticket
// @access  Private
router.post('/support-ticket', [
  check('subject', 'Subject is required').not().isEmpty(),
  check('message', 'Message is required').not().isEmpty(),
  check('priority', 'Priority should be low, medium, or high').optional().isIn(['low', 'medium', 'high']),
  check('vendorId', 'Vendor ID is optional').optional()
], userController.createSupportTicket);

// @route   GET /api/user/support-tickets
// @desc    Get support tickets
// @access  Private
router.get('/support-tickets', userController.getSupportTickets);

// @route   GET /api/user/referral
// @desc    Get referral information
// @access  Private
router.get('/referral', userController.getReferralInfo);

// @route   POST /api/user/referral/generate
// @desc    Generate referral code
// @access  Private
router.post('/referral/generate', userController.generateReferralCode);

// @route   GET /api/user/referral/stats
// @desc    Get referral statistics
// @access  Private
router.get('/referral/stats', userController.getReferralStats);

// @route   DELETE /api/user/account
// @desc    Delete user account
// @access  Private
router.delete('/account', [
  check('password', 'Password is required for account deletion').not().isEmpty()
], userController.deleteAccount);

// @route   GET /api/user/export-data
// @desc    Export user data
// @access  Private
router.get('/export-data', userController.exportUserData);

// Public routes for user actions (no auth required for some)
router.get('/public/vendors', userController.getPublicVendors);
router.get('/public/vendor/:vendorId/plans', userController.getPublicVendorPlans);
router.post('/public/contact', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('message', 'Message is required').not().isEmpty()
], userController.contactVendor);

module.exports = router;