import express from 'express';
import pricingDashboardController from '../controller/pricingDashboardController.js';
import { authenticate } from '../middleware/auth_new.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Dashboard routes
router.get('/dashboard', authenticate, pricingDashboardController.getDashboard);
router.get('/analytics', authenticate, pricingDashboardController.getAnalytics);
router.put('/bulk-update', authenticate, pricingDashboardController.bulkUpdatePrices);
router.post('/sync-competitors', authenticate, pricingDashboardController.syncCompetitors);

// Error handling middleware
router.use((error, req, res, next) => {
  logger.error('Pricing routes error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

export default router;