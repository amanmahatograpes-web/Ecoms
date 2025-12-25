const express = require('express');
const router = express.Router();
const webhookController = require('../../controllers/webhook/webhookController');

// @route   POST /api/webhook/stripe
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/stripe', webhookController.handleStripeWebhook);

// @route   POST /api/webhook/razorpay
// @desc    Handle Razorpay webhooks
// @access  Public
router.post('/razorpay', webhookController.handleRazorpayWebhook);

// @route   POST /api/webhook/twilio
// @desc    Handle Twilio webhooks
// @access  Public
router.post('/twilio', webhookController.handleTwilioWebhook);

// @route   POST /api/webhook/sendgrid
// @desc    Handle SendGrid webhooks
// @access  Public
router.post('/sendgrid', webhookController.handleSendGridWebhook);

// @route   POST /api/webhook/facebook
// @desc    Handle Facebook webhooks
// @access  Public
router.post('/facebook', webhookController.handleFacebookWebhook);

// @route   POST /api/webhook/google
// @desc    Handle Google webhooks
// @access  Public
router.post('/google', webhookController.handleGoogleWebhook);

// @route   POST /api/webhook/linkedin
// @desc    Handle LinkedIn webhooks
// @access  Public
router.post('/linkedin', webhookController.handleLinkedInWebhook);

// @route   POST /api/webhook/twitter
// @desc    Handle Twitter webhooks
// @access  Public
router.post('/twitter', webhookController.handleTwitterWebhook);

// @route   POST /api/webhook/instagram
// @desc    Handle Instagram webhooks
// @access  Public
router.post('/instagram', webhookController.handleInstagramWebhook);

// @route   POST /api/webhook/whatsapp
// @desc    Handle WhatsApp webhooks
// @access  Public
router.post('/whatsapp', webhookController.handleWhatsAppWebhook);

// @route   POST /api/webhook/telegram
// @desc    Handle Telegram webhooks
// @access  Public
router.post('/telegram', webhookController.handleTelegramWebhook);

// @route   POST /api/webhook/slack
// @desc    Handle Slack webhooks
// @access  Public
router.post('/slack', webhookController.handleSlackWebhook);

// @route   POST /api/webhook/discord
// @desc    Handle Discord webhooks
// @access  Public
router.post('/discord', webhookController.handleDiscordWebhook);

// @route   POST /api/webhook/market-data
// @desc    Handle market data webhooks
// @access  Public
router.post('/market-data', webhookController.handleMarketDataWebhook);

// @route   POST /api/webhook/competitor
// @desc    Handle competitor data webhooks
// @access  Public
router.post('/competitor', webhookController.handleCompetitorWebhook);

// @route   POST /api/webhook/analytics
// @desc    Handle analytics webhooks
// @access  Public
router.post('/analytics', webhookController.handleAnalyticsWebhook);

// @route   POST /api/webhook/monitoring
// @desc    Handle monitoring webhooks
// @access  Public
router.post('/monitoring', webhookController.handleMonitoringWebhook);

// @route   POST /api/webhook/custom
// @desc    Handle custom webhooks
// @access  Public
router.post('/custom/:vendorId', [
  check('event', 'Event type is required').not().isEmpty(),
  check('data', 'Event data is required').isObject(),
  check('signature', 'Signature is required for verification').not().isEmpty()
], webhookController.handleCustomWebhook);

// @route   GET /api/webhook/test
// @desc    Test webhook endpoint
// @access  Public
router.get('/test', webhookController.testWebhook);

// @route   POST /api/webhook/register
// @desc    Register webhook endpoint
// @access  Private
router.post('/register', [
  check('url', 'Webhook URL is required').isURL(),
  check('events', 'Events should be an array').isArray(),
  check('secret', 'Secret is required for verification').not().isEmpty()
], webhookController.registerWebhook);

// @route   GET /api/webhook/endpoints
// @desc    Get registered webhook endpoints
// @access  Private
router.get('/endpoints', webhookController.getWebhookEndpoints);

// @route   DELETE /api/webhook/endpoints/:endpointId
// @desc    Delete webhook endpoint
// @access  Private
router.delete('/endpoints/:endpointId', webhookController.deleteWebhookEndpoint);

// @route   POST /api/webhook/endpoints/:endpointId/test
// @desc    Test webhook endpoint
// @access  Private
router.post('/endpoints/:endpointId/test', webhookController.testWebhookEndpoint);

// @route   GET /api/webhook/logs
// @desc    Get webhook logs
// @access  Private
router.get('/logs', webhookController.getWebhookLogs);

// @route   GET /api/webhook/logs/:logId
// @desc    Get webhook log details
// @access  Private
router.get('/logs/:logId', webhookController.getWebhookLogDetails);

module.exports = router;