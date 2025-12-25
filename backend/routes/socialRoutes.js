const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { authenticate } = require('../middleware/auth');
const { validateShare } = require('../middleware/validation');

// All social routes require authentication
router.use(authenticate);

// Core sharing endpoints
router.post('/generate', validateShare, socialController.generateShare);
router.post('/share', validateShare, socialController.share);
router.post('/bulk-share', socialController.bulkShare);

// Analytics & tracking
router.get('/analytics', socialController.getAnalytics);
router.get('/analytics/platform-stats', socialController.getPlatformStats);
router.get('/analytics/top-shares', socialController.getTopShares);
router.get('/analytics/user-stats', socialController.getUserStats);
router.post('/analytics/report', socialController.generateReport);

// Tracking endpoints (can be called without auth for webhooks)
router.post('/track/click/:shareId', socialController.trackClick);
router.post('/track/conversion/:shareId', socialController.trackConversion);

// QR code generation
router.post('/qr-code', socialController.generateQRCode);

// Platform-specific endpoints
router.post('/whatsapp', socialController.shareToWhatsApp);
router.post('/facebook', socialController.shareToFacebook);
router.post('/twitter', socialController.shareToTwitter);
router.post('/email', socialController.shareToEmail);

module.exports = router;