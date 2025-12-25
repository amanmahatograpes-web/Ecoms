const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const analyticsController = require('../../controllers/analytics/analyticsController');
const auth = require('../../middleware/auth');
const vendorAuth = require('../../middleware/vendorAuth');

// Apply auth and vendor middleware to all routes
router.use(auth, vendorAuth);

// @route   GET /api/analytics/dashboard
// @desc    Get analytics dashboard data
// @access  Private (Vendor)
router.get('/dashboard', analyticsController.getDashboardAnalytics);

// @route   GET /api/analytics/overview
// @desc    Get analytics overview
// @access  Private (Vendor)
router.get('/overview', analyticsController.getAnalyticsOverview);

// @route   GET /api/analytics/shares
// @desc    Get share analytics
// @access  Private (Vendor)
router.get('/shares', analyticsController.getShareAnalytics);

// @route   GET /api/analytics/shares/:planId
// @desc    Get plan share analytics
// @access  Private (Vendor)
router.get('/shares/:planId', analyticsController.getPlanShareAnalytics);

// @route   GET /api/analytics/conversions
// @desc    Get conversion analytics
// @access  Private (Vendor)
router.get('/conversions', analyticsController.getConversionAnalytics);

// @route   GET /api/analytics/revenue
// @desc    Get revenue analytics
// @access  Private (Vendor)
router.get('/revenue', analyticsController.getRevenueAnalytics);

// @route   GET /api/analytics/visitors
// @desc    Get visitor analytics
// @access  Private (Vendor)
router.get('/visitors', analyticsController.getVisitorAnalytics);

// @route   GET /api/analytics/engagement
// @desc    Get engagement analytics
// @access  Private (Vendor)
router.get('/engagement', analyticsController.getEngagementAnalytics);

// @route   GET /api/analytics/geographic
// @desc    Get geographic analytics
// @access  Private (Vendor)
router.get('/geographic', analyticsController.getGeographicAnalytics);

// @route   GET /api/analytics/devices
// @desc    Get device analytics
// @access  Private (Vendor)
router.get('/devices', analyticsController.getDeviceAnalytics);

// @route   GET /api/analytics/referrers
// @desc    Get referral analytics
// @access  Private (Vendor)
router.get('/referrers', analyticsController.getReferralAnalytics);

// @route   GET /api/analytics/campaigns
// @desc    Get campaign analytics
// @access  Private (Vendor)
router.get('/campaigns', analyticsController.getCampaignAnalytics);

// @route   GET /api/analytics/utm
// @desc    Get UTM analytics
// @access  Private (Vendor)
router.get('/utm', analyticsController.getUTMAnalytics);

// @route   GET /api/analytics/price-history
// @desc    Get price history analytics
// @access  Private (Vendor)
router.get('/price-history', analyticsController.getPriceHistoryAnalytics);

// @route   GET /api/analytics/price-impact
// @desc    Get price impact analysis
// @access  Private (Vendor)
router.get('/price-impact', analyticsController.getPriceImpactAnalysis);

// @route   GET /api/analytics/competitor
// @desc    Get competitor analytics
// @access  Private (Vendor)
router.get('/competitor', analyticsController.getCompetitorAnalytics);

// @route   GET /api/analytics/market-trends
// @desc    Get market trends analytics
// @access  Private (Vendor)
router.get('/market-trends', analyticsController.getMarketTrendsAnalytics);

// @route   GET /api/analytics/customer-segments
// @desc    Get customer segmentation analytics
// @access  Private (Vendor)
router.get('/customer-segments', analyticsController.getCustomerSegmentation);

// @route   GET /api/analytics/behavior
// @desc    Get customer behavior analytics
// @access  Private (Vendor)
router.get('/behavior', analyticsController.getBehaviorAnalytics);

// @route   GET /api/analytics/retention
// @desc    Get customer retention analytics
// @access  Private (Vendor)
router.get('/retention', analyticsController.getRetentionAnalytics);

// @route   GET /api/analytics/churn
// @desc    Get churn analytics
// @access  Private (Vendor)
router.get('/churn', analyticsController.getChurnAnalytics);

// @route   GET /api/analytics/lifetime-value
// @desc    Get customer lifetime value analytics
// @access  Private (Vendor)
router.get('/lifetime-value', analyticsController.getLifetimeValueAnalytics);

// @route   GET /api/analytics/forecast
// @desc    Get revenue forecast
// @access  Private (Vendor)
router.get('/forecast', analyticsController.getRevenueForecast);

// @route   GET /api/analytics/kpis
// @desc    Get KPI dashboard
// @access  Private (Vendor)
router.get('/kpis', analyticsController.getKPIDashboard);

// @route   GET /api/analytics/reports
// @desc    Get analytics reports
// @access  Private (Vendor)
router.get('/reports', analyticsController.getAnalyticsReports);

// @route   POST /api/analytics/reports
// @desc    Create custom analytics report
// @access  Private (Vendor)
router.post('/reports', [
  check('name', 'Report name is required').not().isEmpty(),
  check('metrics', 'Metrics should be an array').isArray(),
  check('filters', 'Filters should be an object').optional().isObject(),
  check('period', 'Period is required').isIn(['today', 'yesterday', 'last_7_days', 'last_30_days', 'this_month', 'last_month', 'this_quarter', 'last_quarter', 'this_year', 'last_year', 'custom'])
], analyticsController.createCustomReport);

// @route   GET /api/analytics/reports/:reportId
// @desc    Get custom report
// @access  Private (Vendor)
router.get('/reports/:reportId', analyticsController.getCustomReport);

// @route   PUT /api/analytics/reports/:reportId
// @desc    Update custom report
// @access  Private (Vendor)
router.put('/reports/:reportId', analyticsController.updateCustomReport);

// @route   DELETE /api/analytics/reports/:reportId
// @desc    Delete custom report
// @access  Private (Vendor)
router.delete('/reports/:reportId', analyticsController.deleteCustomReport);

// @route   GET /api/analytics/export/:format
// @desc    Export analytics data
// @access  Private (Vendor)
router.get('/export/:format', [
  check('format', 'Export format is required').isIn(['csv', 'excel', 'pdf', 'json'])
], analyticsController.exportAnalyticsData);

// @route   GET /api/analytics/real-time
// @desc    Get real-time analytics
// @access  Private (Vendor)
router.get('/real-time', analyticsController.getRealTimeAnalytics);

// @route   GET /api/analytics/notifications
// @desc    Get analytics notifications
// @access  Private (Vendor)
router.get('/notifications', analyticsController.getAnalyticsNotifications);

// @route   POST /api/analytics/notifications
// @desc    Create analytics notification rule
// @access  Private (Vendor)
router.post('/notifications', [
  check('metric', 'Metric is required').not().isEmpty(),
  check('condition', 'Condition is required').isIn(['greater_than', 'less_than', 'equals', 'changes_by']),
  check('value', 'Value is required').not().isEmpty(),
  check('notificationType', 'Notification type is required').isIn(['email', 'sms', 'push', 'in_app']),
  check('recipients', 'Recipients should be an array').optional().isArray()
], analyticsController.createNotificationRule);

// @route   PUT /api/analytics/notifications/:ruleId
// @desc    Update analytics notification rule
// @access  Private (Vendor)
router.put('/notifications/:ruleId', analyticsController.updateNotificationRule);

// @route   DELETE /api/analytics/notifications/:ruleId
// @desc    Delete analytics notification rule
// @access  Private (Vendor)
router.delete('/notifications/:ruleId', analyticsController.deleteNotificationRule);

// @route   GET /api/analytics/api-usage
// @desc    Get API usage analytics
// @access  Private (Vendor)
router.get('/api-usage', analyticsController.getAPIUsageAnalytics);

// @route   GET /api/analytics/system
// @desc    Get system performance analytics
// @access  Private (Vendor)
router.get('/system', analyticsController.getSystemPerformanceAnalytics);

module.exports = router;