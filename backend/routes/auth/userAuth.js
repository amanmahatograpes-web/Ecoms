const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userAuthController = require('../../controllers/auth/userAuthController');
const auth = require('../../middleware/auth');
const rateLimiter = require('../../middleware/rateLimiter');

// Rate limiting for auth routes
router.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes'
}));

// @route   POST /api/auth/user/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  check('firstName', 'First name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
], userAuthController.register);

// @route   POST /api/auth/user/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], userAuthController.login);

// @route   POST /api/auth/user/refresh
// @desc    Refresh access token
// @access  Private
router.post('/refresh', auth, userAuthController.refreshToken);

// @route   POST /api/auth/user/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, userAuthController.logout);

// @route   GET /api/auth/user/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, userAuthController.getCurrentUser);

// @route   POST /api/auth/user/verify-email/:token
// @desc    Verify email address
// @access  Public
router.post('/verify-email/:token', userAuthController.verifyEmail);

// @route   POST /api/auth/user/forgot-password
// @desc    Forgot password - send reset email
// @access  Public
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], userAuthController.forgotPassword);

// @route   POST /api/auth/user/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', [
  check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
], userAuthController.resetPassword);

// @route   PUT /api/auth/user/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', auth, [
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
], userAuthController.changePassword);

// @route   POST /api/auth/user/google
// @desc    Google OAuth authentication
// @access  Public
router.post('/google', [
  check('idToken', 'Google ID token is required').not().isEmpty()
], userAuthController.googleAuth);

// @route   POST /api/auth/user/facebook
// @desc    Facebook OAuth authentication
// @access  Public
router.post('/facebook', [
  check('accessToken', 'Facebook access token is required').not().isEmpty()
], userAuthController.facebookAuth);

// @route   POST /api/auth/user/linkedin
// @desc    LinkedIn OAuth authentication
// @access  Public
router.post('/linkedin', [
  check('code', 'LinkedIn authorization code is required').not().isEmpty()
], userAuthController.linkedinAuth);

module.exports = router;