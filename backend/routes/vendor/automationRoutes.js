const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const automationController = require('../../controllers/automation/automationController');
const auth = require('../../middleware/auth');
const vendorAuth = require('../../middleware/vendorAuth');

// Apply auth and vendor middleware to all routes
router.use(auth, vendorAuth);

// @route   GET /api/automation/rules
// @desc    Get all automation rules for vendor
// @access  Private (Vendor)
router.get('/rules', automationController.getRules);

// @route   POST /api/automation/rules
// @desc    Create a new automation rule
// @access  Private (Vendor)
router.post('/rules', [
  check('name', 'Rule name is required').not().isEmpty(),
  check('ruleType', 'Rule type is required').isIn(['demand_based', 'seasonal', 'competitor', 'time_based', 'custom', 'ai_pricing']),
  check('scope', 'Scope is required').isIn(['all_plans', 'specific_plans', 'plan_category', 'price_range']),
  check('conditions.rules', 'Conditions should be an array').optional().isArray(),
  check('actions', 'Actions should be an array').isArray(),
  check('schedule.type', 'Schedule type is required').isIn(['immediate', 'scheduled', 'recurring', 'event_based']),
  check('notifications.onExecution.enabled', 'On execution notification enabled must be a boolean').optional().isBoolean(),
  check('execution.status', 'Execution status is required').isIn(['active', 'paused', 'disabled', 'draft'])
], automationController.createRule);

// @route   GET /api/automation/rules/:ruleId
// @desc    Get automation rule by ID
// @access  Private (Vendor)
router.get('/rules/:ruleId', automationController.getRuleById);

// @route   PUT /api/automation/rules/:ruleId
// @desc    Update automation rule
// @access  Private (Vendor)
router.put('/rules/:ruleId', automationController.updateRule);

// @route   DELETE /api/automation/rules/:ruleId
// @desc    Delete automation rule
// @access  Private (Vendor)
router.delete('/rules/:ruleId', automationController.deleteRule);

// @route   PUT /api/automation/rules/:ruleId/toggle
// @desc    Toggle automation rule status
// @access  Private (Vendor)
router.put('/rules/:ruleId/toggle', automationController.toggleRule);

// @route   POST /api/automation/rules/:ruleId/test
// @desc    Test automation rule
// @access  Private (Vendor)
router.post('/rules/:ruleId/test', automationController.testRule);

// @route   POST /api/automation/rules/:ruleId/execute
// @desc    Execute automation rule manually
// @access  Private (Vendor)
router.post('/rules/:ruleId/execute', automationController.executeRule);

// @route   GET /api/automation/rules/:ruleId/logs
// @desc    Get automation rule execution logs
// @access  Private (Vendor)
router.get('/rules/:ruleId/logs', automationController.getRuleLogs);

// @route   GET /api/automation/rules/:ruleId/statistics
// @desc    Get automation rule statistics
// @access  Private (Vendor)
router.get('/rules/:ruleId/statistics', automationController.getRuleStatistics);

// @route   POST /api/automation/rules/:ruleId/duplicate
// @desc    Duplicate automation rule
// @access  Private (Vendor)
router.post('/rules/:ruleId/duplicate', automationController.duplicateRule);

// @route   GET /api/automation/market/conditions
// @desc    Get current market conditions
// @access  Private (Vendor)
router.get('/market/conditions', automationController.getMarketConditions);

// @route   GET /api/automation/market/competitors
// @desc    Get competitor data
// @access  Private (Vendor)
router.get('/market/competitors', automationController.getCompetitorData);

// @route   POST /api/automation/market/competitors
// @desc    Add competitor
// @access  Private (Vendor)
router.post('/market/competitors', [
  check('name', 'Competitor name is required').not().isEmpty(),
  check('website', 'Competitor website is required').not().isEmpty(),
  check('priceSelector', 'Price selector is required for web scraping').optional().not().isEmpty()
], automationController.addCompetitor);

// @route   PUT /api/automation/market/competitors/:competitorId
// @desc    Update competitor
// @access  Private (Vendor)
router.put('/market/competitors/:competitorId', automationController.updateCompetitor);

// @route   DELETE /api/automation/market/competitors/:competitorId
// @desc    Remove competitor
// @access  Private (Vendor)
router.delete('/market/competitors/:competitorId', automationController.removeCompetitor);

// @route   GET /api/automation/market/trends
// @desc    Get market trends
// @access  Private (Vendor)
router.get('/market/trends', automationController.getMarketTrends);

// @route   GET /api/automation/market/demand
// @desc    Get demand data
// @access  Private (Vendor)
router.get('/market/demand', automationController.getDemandData);

// @route   POST /api/automation/market/demand
// @desc    Update demand data manually
// @access  Private (Vendor)
router.post('/market/demand', [
  check('demandLevel', 'Demand level is required').isIn(['low', 'normal', 'high', 'very_high']),
  check('source', 'Source is required').not().isEmpty(),
  check('confidence', 'Confidence must be between 0 and 100').optional().isFloat({ min: 0, max: 100 })
], automationController.updateDemandData);

// @route   GET /api/automation/market/seasonal
// @desc    Get seasonal data
// @access  Private (Vendor)
router.get('/market/seasonal', automationController.getSeasonalData);

// @route   POST /api/automation/market/seasonal
// @desc    Add seasonal adjustment
// @access  Private (Vendor)
router.post('/market/seasonal', [
  check('name', 'Season name is required').not().isEmpty(),
  check('startMonth', 'Start month is required (1-12)').isInt({ min: 1, max: 12 }),
  check('endMonth', 'End month is required (1-12)').isInt({ min: 1, max: 12 }),
  check('multiplier', 'Multiplier is required').isFloat({ min: 0.5, max: 2.0 })
], automationController.addSeasonalAdjustment);

// @route   GET /api/automation/ai/models
// @desc    Get available AI models
// @access  Private (Vendor)
router.get('/ai/models', automationController.getAIModels);

// @route   POST /api/automation/ai/train
// @desc    Train AI model
// @access  Private (Vendor)
router.post('/ai/train', [
  check('model', 'Model type is required').isIn(['linear_regression', 'decision_tree', 'random_forest', 'neural_network', 'custom']),
  check('trainingData.source', 'Training data source is required').isIn(['historical_prices', 'market_data', 'competitor_prices', 'combined']),
  check('trainingData.lookbackPeriod', 'Lookback period is required (in days)').isInt({ min: 7, max: 365 })
], automationController.trainAIModel);

// @route   GET /api/automation/ai/predictions
// @desc    Get AI predictions
// @access  Private (Vendor)
router.get('/ai/predictions', automationController.getAIPredictions);

// @route   POST /api/automation/ai/predict
// @desc    Get price prediction for plan
// @access  Private (Vendor)
router.post('/ai/predict', [
  check('planId', 'Plan ID is required').not().isEmpty(),
  check('marketConditions', 'Market conditions are required').optional().isObject()
], automationController.getPricePrediction);

// @route   GET /api/automation/templates
// @desc    Get automation rule templates
// @access  Private (Vendor)
router.get('/templates', automationController.getTemplates);

// @route   POST /api/automation/templates
// @desc    Create automation rule template
// @access  Private (Vendor)
router.post('/templates', [
  check('name', 'Template name is required').not().isEmpty(),
  check('description', 'Template description is required').not().isEmpty(),
  check('ruleType', 'Rule type is required').isIn(['demand_based', 'seasonal', 'competitor', 'time_based', 'custom']),
  check('category', 'Category is required').isIn(['basic', 'advanced', 'enterprise'])
], automationController.createTemplate);

// @route   POST /api/automation/templates/:templateId/apply
// @desc    Apply template to create new rule
// @access  Private (Vendor)
router.post('/templates/:templateId/apply', automationController.applyTemplate);

// @route   GET /api/automation/insights
// @desc    Get automation insights
// @access  Private (Vendor)
router.get('/insights', automationController.getInsights);

// @route   GET /api/automation/performance
// @desc    Get automation performance metrics
// @access  Private (Vendor)
router.get('/performance', automationController.getPerformanceMetrics);

// @route   GET /api/automation/alerts
// @desc    Get automation alerts
// @access  Private (Vendor)
router.get('/alerts', automationController.getAlerts);

// @route   PUT /api/automation/alerts/:alertId/read
// @desc    Mark alert as read
// @access  Private (Vendor)
router.put('/alerts/:alertId/read', automationController.markAlertAsRead);

// @route   PUT /api/automation/alerts/read-all
// @desc    Mark all alerts as read
// @access  Private (Vendor)
router.put('/alerts/read-all', automationController.markAllAlertsAsRead);

// @route   GET /api/automation/export
// @desc    Export automation rules
// @access  Private (Vendor)
router.get('/export', automationController.exportRules);

// @route   POST /api/automation/import
// @desc    Import automation rules
// @access  Private (Vendor)
router.post('/import', automationController.importRules);

module.exports = router;