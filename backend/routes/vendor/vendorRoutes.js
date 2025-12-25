const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const vendorController = require('../../controllers/vendor/vendorController');
const auth = require('../../middleware/auth');
const vendorAuth = require('../../middleware/vendorAuth');
const upload = require('../../middleware/upload');

// Apply auth and vendor middleware to all routes
router.use(auth, vendorAuth);

// @route   GET /api/vendor/profile
// @desc    Get vendor profile
// @access  Private (Vendor)
router.get('/profile', vendorController.getProfile);

// @route   PUT /api/vendor/profile
// @desc    Update vendor profile
// @access  Private (Vendor)
router.put('/profile', [
  check('companyName', 'Company name is required').optional().not().isEmpty(),
  check('businessEmail', 'Please include a valid email').optional().isEmail(),
  check('phone', 'Please enter a valid Indian phone number').optional().matches(/^[6-9]\d{9}$/),
  check('gstNumber', 'Please enter a valid GST number').optional().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
  check('panNumber', 'Please enter a valid PAN number').optional().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  check('industry', 'Industry is required').optional().not().isEmpty(),
  check('address.street', 'Street address is required').optional().not().isEmpty(),
  check('address.city', 'City is required').optional().not().isEmpty(),
  check('address.state', 'State is required').optional().not().isEmpty(),
  check('address.pincode', 'Valid pincode is required').optional().matches(/^[1-9][0-9]{5}$/)
], vendorController.updateProfile);

// @route   PUT /api/vendor/settings
// @desc    Update vendor settings
// @access  Private (Vendor)
router.put('/settings', vendorController.updateSettings);

// @route   GET /api/vendor/dashboard/stats
// @desc    Get vendor dashboard statistics
// @access  Private (Vendor)
router.get('/dashboard/stats', vendorController.getDashboardStats);

// @route   GET /api/vendor/subscription
// @desc    Get vendor subscription info
// @access  Private (Vendor)
router.get('/subscription', vendorController.getSubscriptionInfo);

// @route   PUT /api/vendor/subscription
// @desc    Change vendor subscription
// @access  Private (Vendor)
router.put('/subscription', [
  check('planId', 'Plan ID is required').not().isEmpty(),
  check('billingCycle', 'Billing cycle is required').isIn(['monthly', 'quarterly', 'yearly'])
], vendorController.changeSubscription);

// @route   DELETE /api/vendor/account
// @desc    Delete vendor account
// @access  Private (Vendor)
router.delete('/account', [
  check('password', 'Password is required for account deletion').not().isEmpty()
], vendorController.deleteAccount);

// @route   POST /api/vendor/logo
// @desc    Upload vendor logo
// @access  Private (Vendor)
router.post('/logo', upload.single('logo'), vendorController.uploadLogo);

// @route   GET /api/vendor/team
// @desc    Get vendor team members
// @access  Private (Vendor)
router.get('/team', vendorController.getTeamMembers);

// @route   POST /api/vendor/team
// @desc    Add team member
// @access  Private (Vendor)
router.post('/team', [
  check('email', 'Please include a valid email').isEmail(),
  check('role', 'Role is required').not().isEmpty(),
  check('permissions', 'Permissions should be an array').optional().isArray()
], vendorController.addTeamMember);

// @route   PUT /api/vendor/team/:memberId
// @desc    Update team member
// @access  Private (Vendor)
router.put('/team/:memberId', vendorController.updateTeamMember);

// @route   DELETE /api/vendor/team/:memberId
// @desc    Remove team member
// @access  Private (Vendor)
router.delete('/team/:memberId', vendorController.removeTeamMember);

// @route   GET /api/vendor/notifications
// @desc    Get vendor notifications
// @access  Private (Vendor)
router.get('/notifications', vendorController.getNotifications);

// @route   PUT /api/vendor/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private (Vendor)
router.put('/notifications/:notificationId/read', vendorController.markNotificationAsRead);

// @route   PUT /api/vendor/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private (Vendor)
router.put('/notifications/read-all', vendorController.markAllNotificationsAsRead);

// @route   GET /api/vendor/activity
// @desc    Get vendor activity log
// @access  Private (Vendor)
router.get('/activity', vendorController.getActivityLog);

// @route   GET /api/vendor/invoices
// @desc    Get vendor invoices
// @access  Private (Vendor)
router.get('/invoices', vendorController.getInvoices);

// @route   GET /api/vendor/invoices/:invoiceId
// @desc    Get invoice details
// @access  Private (Vendor)
router.get('/invoices/:invoiceId', vendorController.getInvoiceDetails);

// @route   POST /api/vendor/invoices/:invoiceId/download
// @desc    Download invoice
// @access  Private (Vendor)
router.post('/invoices/:invoiceId/download', vendorController.downloadInvoice);

// @route   POST /api/vendor/support-ticket
// @desc    Create support ticket
// @access  Private (Vendor)
router.post('/support-ticket', [
  check('subject', 'Subject is required').not().isEmpty(),
  check('message', 'Message is required').not().isEmpty(),
  check('priority', 'Priority should be low, medium, or high').optional().isIn(['low', 'medium', 'high'])
], vendorController.createSupportTicket);

// @route   GET /api/vendor/support-tickets
// @desc    Get support tickets
// @access  Private (Vendor)
router.get('/support-tickets', vendorController.getSupportTickets);

module.exports = router;