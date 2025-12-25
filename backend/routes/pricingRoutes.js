const express = require('express');
const router = express.Router();
const pricingController = require('../controller/pricingController');
const { authenticate, authorize } = require('../middleware/auth');
const { validatePricingPlan, validateCoupon } = require('../middleware/validation');

// Public routes
router.get('/plans', pricingController.getPlans);
router.get('/plans/:id', pricingController.getPlan);
router.get('/categories', pricingController.getCategories);
router.get('/market-conditions', pricingController.getMarketConditions);
router.post('/coupons/validate', pricingController.validateCoupon);

// Protected routes
router.use(authenticate);

// Plan management
router.post('/plans', authorize('admin', 'manager'), validatePricingPlan, pricingController.createPlan);
router.put('/plans/:id', authorize('admin', 'manager'), pricingController.updatePlan);
router.delete('/plans/:id', authorize('admin'), pricingController.deletePlan);

// Price calculations
router.post('/plans/:id/calculate', authorize('analyst', 'admin', 'manager'), pricingController.calculatePrice);
router.post('/plans/:id/adjust', authorize('admin', 'manager'), pricingController.adjustPrice);
router.post('/plans/:id/apply-coupon', validateCoupon, pricingController.applyCoupon);

// History & analytics
router.get('/plans/:id/history', authorize('analyst', 'admin', 'manager'), pricingController.getPriceHistory);
router.get('/stats', authorize('analyst', 'admin', 'manager'), pricingController.getPricingStats);

// Batch operations
router.post('/batch-update', authorize('admin', 'manager'), pricingController.batchUpdate);
router.post('/sync-competitors', authorize('admin'), pricingController.syncCompetitors);

// Coupon management
router.get('/coupons', pricingController.getCoupons);

module.exports = router;