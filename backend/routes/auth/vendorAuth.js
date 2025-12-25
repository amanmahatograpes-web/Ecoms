const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const vendorAuthController = require('../../controllers/auth/vendorAuthController');
const auth = require('../../middleware/auth');
const rateLimiter = require('../../middleware/rateLimiter');

// Rate limiting for auth routes
router.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes'
}));

// @route   POST /api/auth/vendor/register
// @desc    Register a new vendor
// @access  Public
router.post('/register', [
  check('companyName', 'Company name is required').not().isEmpty(),
  check('businessEmail', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
  check('phone', 'Please enter a valid Indian phone number').matches(/^[6-9]\d{9}$/),
  check('gstNumber', 'Please enter a valid GST number').matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
  check('panNumber', 'Please enter a valid PAN number').matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/),
  check('industry', 'Industry is required').not().isEmpty(),
  check('address.street', 'Street address is required').not().isEmpty(),
  check('address.city', 'City is required').not().isEmpty(),
  check('address.state', 'State is required').not().isEmpty(),
  check('address.pincode', 'Valid pincode is required').matches(/^[1-9][0-9]{5}$/)
], vendorAuthController.register);

// @route   POST /api/auth/vendor/login
// @desc    Authenticate vendor & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], vendorAuthController.login);

// @route   POST /api/auth/vendor/refresh
// @desc    Refresh access token
// @access  Private
router.post('/refresh', auth, vendorAuthController.refreshToken);

// @route   POST /api/auth/vendor/logout
// @desc    Logout vendor
// @access  Private
router.post('/logout', auth, vendorAuthController.logout);

// @route   GET /api/auth/vendor/me
// @desc    Get current vendor
// @access  Private
router.get('/me', auth, vendorAuthController.getCurrentVendor);

// @route   POST /api/auth/vendor/verify-email/:token
// @desc    Verify email address
// @access  Public
router.post('/verify-email/:token', vendorAuthController.verifyEmail);

// @route   POST /api/auth/vendor/resend-verification
// @desc    Resend verification email
// @access  Private
router.post('/resend-verification', auth, vendorAuthController.resendVerification);

// @route   POST /api/auth/vendor/forgot-password
// @desc    Forgot password - send reset email
// @access  Public
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], vendorAuthController.forgotPassword);

// @route   POST /api/auth/vendor/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', [
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
], vendorAuthController.resetPassword);

// @route   POST /api/auth/vendor/verify-phone
// @desc    Verify phone number
// @access  Private
router.post('/verify-phone', auth, [
  check('phone', 'Please enter a valid Indian phone number').matches(/^[6-9]\d{9}$/)
], vendorAuthController.sendPhoneVerification);

// @route   POST /api/auth/vendor/verify-phone-code
// @desc    Verify phone verification code
// @access  Private
router.post('/verify-phone-code', auth, [
  check('code', 'Verification code is required').isLength({ min: 6, max: 6 }),
  check('phone', 'Phone number is required').not().isEmpty()
], vendorAuthController.verifyPhoneCode);

// @route   PUT /api/auth/vendor/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', auth, [
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
], vendorAuthController.changePassword);

// @route   POST /api/auth/vendor/setup-2fa
// @desc    Setup two-factor authentication
// @access  Private
router.post('/setup-2fa', auth, vendorAuthController.setupTwoFactorAuth);

// @route   POST /api/auth/vendor/verify-2fa
// @desc    Verify two-factor authentication
// @access  Private
router.post('/verify-2fa', auth, [
  check('token', '2FA token is required').not().isEmpty()
], vendorAuthController.verifyTwoFactorAuth);

// @route   DELETE /api/auth/vendor/disable-2fa
// @desc    Disable two-factor authentication
// @access  Private
router.delete('/disable-2fa', auth, vendorAuthController.disableTwoFactorAuth);

module.exports = router;