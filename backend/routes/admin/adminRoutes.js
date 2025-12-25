const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const adminController = require('../../controllers/admin/adminController');
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');

// Apply auth and admin middleware to all routes
router.use(auth, adminAuth);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard
// @access  Private (Admin)
router.get('/dashboard', adminController.getDashboard);

// @route   GET /api/admin/vendors
// @desc    Get all vendors
// @access  Private (Admin)
router.get('/vendors', adminController.getVendors);

// @route   GET /api/admin/vendors/:vendorId
// @desc    Get vendor details
// @access  Private (Admin)
router.get('/vendors/:vendorId', adminController.getVendorDetails);

// @route   PUT /api/admin/vendors/:vendorId
// @desc    Update vendor
// @access  Private (Admin)
router.put('/vendors/:vendorId', adminController.updateVendor);

// @route   DELETE /api/admin/vendors/:vendorId
// @desc    Delete vendor
// @access  Private (Admin)
router.delete('/vendors/:vendorId', adminController.deleteVendor);

// @route   POST /api/admin/vendors/:vendorId/verify
// @desc    Verify vendor
// @access  Private (Admin)
router.post('/vendors/:vendorId/verify', adminController.verifyVendor);

// @route   POST /api/admin/vendors/:vendorId/suspend
// @desc    Suspend vendor
// @access  Private (Admin)
router.post('/vendors/:vendorId/suspend', [
  check('reason', 'Suspension reason is required').not().isEmpty(),
  check('durationDays', 'Duration should be a number of days').optional().isInt({ min: 1 })
], adminController.suspendVendor);

// @route   POST /api/admin/vendors/:vendorId/unsuspend
// @desc    Unsuspend vendor
// @access  Private (Admin)
router.post('/vendors/:vendorId/unsuspend', adminController.unsuspendVendor);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', adminController.getUsers);

// @route   GET /api/admin/users/:userId
// @desc    Get user details
// @access  Private (Admin)
router.get('/users/:userId', adminController.getUserDetails);

// @route   PUT /api/admin/users/:userId
// @desc    Update user
// @access  Private (Admin)
router.put('/users/:userId', adminController.updateUser);

// @route   DELETE /api/admin/users/:userId
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:userId', adminController.deleteUser);

// @route   POST /api/admin/users/:userId/suspend
// @desc    Suspend user
// @access  Private (Admin)
router.post('/users/:userId/suspend', [
  check('reason', 'Suspension reason is required').not().isEmpty(),
  check('durationDays', 'Duration should be a number of days').optional().isInt({ min: 1 })
], adminController.suspendUser);

// @route   POST /api/admin/users/:userId/unsuspend
// @desc    Unsuspend user
// @access  Private (Admin)
router.post('/users/:userId/unsuspend', adminController.unsuspendUser);

// @route   GET /api/admin/subscriptions
// @desc    Get all subscriptions
// @access  Private (Admin)
router.get('/subscriptions', adminController.getSubscriptions);

// @route   GET /api/admin/subscriptions/:subscriptionId
// @desc    Get subscription details
// @access  Private (Admin)
router.get('/subscriptions/:subscriptionId', adminController.getSubscriptionDetails);

// @route   PUT /api/admin/subscriptions/:subscriptionId
// @desc    Update subscription
// @access  Private (Admin)
router.put('/subscriptions/:subscriptionId', adminController.updateSubscription);

// @route   DELETE /api/admin/subscriptions/:subscriptionId
// @desc    Delete subscription
// @access  Private (Admin)
router.delete('/subscriptions/:subscriptionId', adminController.deleteSubscription);

// @route   GET /api/admin/transactions
// @desc    Get all transactions
// @access  Private (Admin)
router.get('/transactions', adminController.getTransactions);

// @route   GET /api/admin/transactions/:transactionId
// @desc    Get transaction details
// @access  Private (Admin)
router.get('/transactions/:transactionId', adminController.getTransactionDetails);

// @route   POST /api/admin/transactions/:transactionId/refund
// @desc    Refund transaction
// @access  Private (Admin)
router.post('/transactions/:transactionId/refund', [
  check('amount', 'Refund amount is required').isNumeric(),
  check('reason', 'Refund reason is required').not().isEmpty()
], adminController.refundTransaction);

// @route   GET /api/admin/plans
// @desc    Get all pricing plans
// @access  Private (Admin)
router.get('/plans', adminController.getPlans);

// @route   GET /api/admin/plans/:planId
// @desc    Get plan details
// @access  Private (Admin)
router.get('/plans/:planId', adminController.getPlanDetails);

// @route   PUT /api/admin/plans/:planId
// @desc    Update plan
// @access  Private (Admin)
router.put('/plans/:planId', adminController.updatePlan);

// @route   DELETE /api/admin/plans/:planId
// @desc    Delete plan
// @access  Private (Admin)
router.delete('/plans/:planId', adminController.deletePlan);

// @route   GET /api/admin/automation-rules
// @desc    Get all automation rules
// @access  Private (Admin)
router.get('/automation-rules', adminController.getAutomationRules);

// @route   GET /api/admin/automation-rules/:ruleId
// @desc    Get automation rule details
// @access  Private (Admin)
router.get('/automation-rules/:ruleId', adminController.getAutomationRuleDetails);

// @route   PUT /api/admin/automation-rules/:ruleId
// @desc    Update automation rule
// @access  Private (Admin)
router.put('/automation-rules/:ruleId', adminController.updateAutomationRule);

// @route   DELETE /api/admin/automation-rules/:ruleId
// @desc    Delete automation rule
// @access  Private (Admin)
router.delete('/automation-rules/:ruleId', adminController.deleteAutomationRule);

// @route   GET /api/admin/coupons
// @desc    Get all coupons
// @access  Private (Admin)
router.get('/coupons', adminController.getCoupons);

// @route   POST /api/admin/coupons
// @desc    Create coupon
// @access  Private (Admin)
router.post('/coupons', [
  check('code', 'Coupon code is required').not().isEmpty(),
  check('discountType', 'Discount type is required').isIn(['percentage', 'fixed_amount', 'free_trial']),
  check('discountValue', 'Discount value is required').isNumeric(),
  check('validFrom', 'Valid from date is required').isISO8601(),
  check('validUntil', 'Valid until date is required').isISO8601(),
  check('maxUses', 'Max uses should be a number').optional().isInt({ min: 1 }),
  check('vendorId', 'Vendor ID is optional').optional()
], adminController.createCoupon);

// @route   PUT /api/admin/coupons/:couponId
// @desc    Update coupon
// @access  Private (Admin)
router.put('/coupons/:couponId', adminController.updateCoupon);

// @route   DELETE /api/admin/coupons/:couponId
// @desc    Delete coupon
// @access  Private (Admin)
router.delete('/coupons/:couponId', adminController.deleteCoupon);

// @route   GET /api/admin/analytics
// @desc    Get system analytics
// @access  Private (Admin)
router.get('/analytics', adminController.getSystemAnalytics);

// @route   GET /api/admin/reports
// @desc    Get system reports
// @access  Private (Admin)
router.get('/reports', adminController.getSystemReports);

// @route   POST /api/admin/reports/generate
// @desc    Generate custom report
// @access  Private (Admin)
router.post('/reports/generate', [
  check('type', 'Report type is required').isIn(['vendors', 'users', 'subscriptions', 'transactions', 'plans', 'automation', 'system']),
  check('format', 'Report format is required').isIn(['csv', 'excel', 'pdf', 'json']),
  check('startDate', 'Start date is required').isISO8601(),
  check('endDate', 'End date is required').isISO8601()
], adminController.generateReport);

// @route   GET /api/admin/logs
// @desc    Get system logs
// @access  Private (Admin)
router.get('/logs', adminController.getSystemLogs);

// @route   GET /api/admin/logs/:logId
// @desc    Get log details
// @access  Private (Admin)
router.get('/logs/:logId', adminController.getLogDetails);

// @route   GET /api/admin/audit-trail
// @desc    Get audit trail
// @access  Private (Admin)
router.get('/audit-trail', adminController.getAuditTrail);

// @route   GET /api/admin/system-health
// @desc    Get system health status
// @access  Private (Admin)
router.get('/system-health', adminController.getSystemHealth);

// @route   GET /api/admin/backups
// @desc    Get system backups
// @access  Private (Admin)
router.get('/backups', adminController.getBackups);

// @route   POST /api/admin/backups/create
// @desc    Create system backup
// @access  Private (Admin)
router.post('/backups/create', adminController.createBackup);

// @route   POST /api/admin/backups/:backupId/restore
// @desc    Restore from backup
// @access  Private (Admin)
router.post('/backups/:backupId/restore', adminController.restoreBackup);

// @route   DELETE /api/admin/backups/:backupId
// @desc    Delete backup
// @access  Private (Admin)
router.delete('/backups/:backupId', adminController.deleteBackup);

// @route   GET /api/admin/settings
// @desc    Get system settings
// @access  Private (Admin)
router.get('/settings', adminController.getSystemSettings);

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Private (Admin)
router.put('/settings', adminController.updateSystemSettings);

// @route   GET /api/admin/email-templates
// @desc    Get email templates
// @access  Private (Admin)
router.get('/email-templates', adminController.getEmailTemplates);

// @route   PUT /api/admin/email-templates/:templateId
// @desc    Update email template
// @access  Private (Admin)
router.put('/email-templates/:templateId', adminController.updateEmailTemplate);

// @route   GET /api/admin/support-tickets
// @desc    Get all support tickets
// @access  Private (Admin)
router.get('/support-tickets', adminController.getSupportTickets);

// @route   GET /api/admin/support-tickets/:ticketId
// @desc    Get support ticket details
// @access  Private (Admin)
router.get('/support-tickets/:ticketId', adminController.getSupportTicketDetails);

// @route   PUT /api/admin/support-tickets/:ticketId
// @desc    Update support ticket
// @access  Private (Admin)
router.put('/support-tickets/:ticketId', adminController.updateSupportTicket);

// @route   POST /api/admin/support-tickets/:ticketId/assign
// @desc    Assign support ticket
// @access  Private (Admin)
router.post('/support-tickets/:ticketId/assign', [
  check('adminId', 'Admin ID is required').not().isEmpty()
], adminController.assignSupportTicket);

// @route   POST /api/admin/support-tickets/:ticketId/close
// @desc    Close support ticket
// @access  Private (Admin)
router.post('/support-tickets/:ticketId/close', [
  check('resolution', 'Resolution notes are required').not().isEmpty()
], adminController.closeSupportTicket);

// @route   GET /api/admin/feedback
// @desc    Get user feedback
// @access  Private (Admin)
router.get('/feedback', adminController.getFeedback);

// @route   GET /api/admin/notifications
// @desc    Get system notifications
// @access  Private (Admin)
router.get('/notifications', adminController.getSystemNotifications);

// @route   POST /api/admin/notifications
// @desc    Send system notification
// @access  Private (Admin)
router.post('/notifications', [
  check('title', 'Notification title is required').not().isEmpty(),
  check('message', 'Notification message is required').not().isEmpty(),
  check('type', 'Notification type is required').isIn(['info', 'warning', 'success', 'error']),
  check('recipients', 'Recipients should be an array').isArray(),
  check('channels', 'Channels should be an array').isArray()
], adminController.sendSystemNotification);

// @route   GET /api/admin/api-keys
// @desc    Get API keys
// @access  Private (Admin)
router.get('/api-keys', adminController.getAPIKeys);

// @route   POST /api/admin/api-keys
// @desc    Create API key
// @access  Private (Admin)
router.post('/api-keys', [
  check('name', 'API key name is required').not().isEmpty(),
  check('permissions', 'Permissions should be an array').isArray(),
  check('expiresAt', 'Expiration date is optional').optional().isISO8601()
], adminController.createAPIKey);

// @route   DELETE /api/admin/api-keys/:keyId
// @desc    Revoke API key
// @access  Private (Admin)
router.delete('/api-keys/:keyId', adminController.revokeAPIKey);

module.exports = router;