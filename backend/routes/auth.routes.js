const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');

// Middleware
const { 
  validateRegistration, 
  validateLogin, 
  validateProfileUpdate,
  validatePasswordChange,
  validateEmail
} = require('../middleware/validation/authValidation');
const { authenticate, authorize } = require('../middleware/auth');

// Utility functions
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

const sendVerificationEmail = async (user, token) => {
  // In production, integrate with email service like SendGrid, AWS SES, etc.
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  console.log(`Verification email for ${user.email}: ${verificationUrl}`);
  // Implement actual email sending logic here
};

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  console.log(`Password reset email for ${user.email}: ${resetUrl}`);
  // Implement actual email sending logic here
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: role || 'customer',
      isEmailVerified: false,
      emailVerificationToken: crypto.randomBytes(32).toString('hex'),
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;
    delete userResponse.emailVerificationExpires;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to database
    await Token.create({
      userId: user._id,
      token: refreshToken,
      type: 'refresh',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Send verification email
    await sendVerificationEmail(user, user.emailVerificationToken);

    // Set cookies if using cookies for auth
    if (process.env.USE_COOKIES === 'true') {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: userResponse,
        tokens: process.env.USE_COOKIES === 'true' ? undefined : {
          accessToken,
          refreshToken,
          expiresIn: 15 * 60 // 15 minutes in seconds
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or phone number'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+password +isActive +loginAttempts +lockedUntil');

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      return res.status(423).json({
        success: false,
        message: `Account is locked until ${new Date(user.lockedUntil).toLocaleString()}`,
        lockedUntil: user.lockedUntil
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock account after 5 failed attempts for 30 minutes
      if (user.loginAttempts >= 5) {
        user.lockedUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
        user.loginAttempts = 0;
      }
      
      await user.save();
      
      const attemptsLeft = 5 - user.loginAttempts;
      
      return res.status(401).json({
        success: false,
        message: `Invalid credentials. ${attemptsLeft > 0 ? `${attemptsLeft} attempts remaining` : 'Account locked for 30 minutes'}`
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockedUntil = null;
    user.lastLogin = Date.now();
    await user.save();

    // Check if email is verified
    if (!user.isEmailVerified && process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;
    delete userResponse.emailVerificationExpires;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;
    delete userResponse.loginAttempts;
    delete userResponse.lockedUntil;

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to database
    const refreshTokenExpires = rememberMe ? 
      Date.now() + 30 * 24 * 60 * 60 * 1000 : // 30 days
      Date.now() + 7 * 24 * 60 * 60 * 1000;   // 7 days
    
    await Token.create({
      userId: user._id,
      token: refreshToken,
      type: 'refresh',
      expiresAt: new Date(refreshTokenExpires)
    });

    // Set cookies if using cookies for auth
    if (process.env.USE_COOKIES === 'true') {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        tokens: process.env.USE_COOKIES === 'true' ? undefined : {
          accessToken,
          refreshToken,
          expiresIn: 15 * 60 // 15 minutes in seconds
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public (requires refresh token)
router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = process.env.USE_COOKIES === 'true' 
      ? req.cookies.refreshToken 
      : req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Check if token exists in database
    const tokenDoc = await Token.findOne({
      token: refreshToken,
      type: 'refresh',
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      return res.status(403).json({
        success: false,
        message: 'Refresh token not found or revoked'
      });
    }

    // Get user
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account is inactive'
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );

    // Set cookie if using cookies
    if (process.env.USE_COOKIES === 'true') {
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
    }

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: process.env.USE_COOKIES === 'true' ? undefined : {
        accessToken,
        expiresIn: 15 * 60
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -emailVerificationToken -resetPasswordToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticate, validateProfileUpdate, async (req, res) => {
  try {
    const { name, email, phone, address, dateOfBirth } = req.body;
    const userId = req.user.userId;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use by another account'
        });
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      updateData.email = email.toLowerCase();
      updateData.isEmailVerified = false; // Require re-verification if email changed
      updateData.emailVerificationToken = crypto.randomBytes(32).toString('hex');
      updateData.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    }
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -emailVerificationToken -resetPasswordToken');

    // Send verification email if email was changed
    if (email) {
      await sendVerificationEmail(user, user.emailVerificationToken);
    }

    res.json({
      success: true,
      message: email ? 
        'Profile updated. Please verify your new email address.' : 
        'Profile updated successfully',
      data: { user }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email or phone number already in use'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', authenticate, validatePasswordChange, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Get user with password
    const user = await User.findById(userId).select('+password');

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    // Revoke all refresh tokens (optional security measure)
    await Token.updateMany(
      { userId, type: 'refresh' },
      { $set: { isRevoked: true } }
    );

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save reset token to user
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing password reset request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
router.put('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Hash the token from request
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.passwordChangedAt = Date.now();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Revoke all refresh tokens
    await Token.updateMany(
      { userId: user._id, type: 'refresh' },
      { $set: { isRevoked: true } }
    );

    res.json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with valid verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
router.post('/resend-verification', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: false 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found or already verified'
      });
    }

    // Generate new verification token
    user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send verification email
    await sendVerificationEmail(user, user.emailVerificationToken);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending verification email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const refreshToken = process.env.USE_COOKIES === 'true' 
      ? req.cookies.refreshToken 
      : req.body.refreshToken;

    // Revoke the specific refresh token
    if (refreshToken) {
      await Token.findOneAndUpdate(
        { token: refreshToken, userId, type: 'refresh' },
        { $set: { isRevoked: true } }
      );
    }

    // Clear cookies if using cookies
    if (process.env.USE_COOKIES === 'true') {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
router.post('/logout-all', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Revoke all refresh tokens for this user
    await Token.updateMany(
      { userId, type: 'refresh' },
      { $set: { isRevoked: true } }
    );

    // Clear cookies if using cookies
    if (process.env.USE_COOKIES === 'true') {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
    }

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out from all devices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Soft delete (mark as inactive)
    user.isActive = false;
    user.deactivatedAt = Date.now();
    await user.save();

    // Revoke all tokens
    await Token.updateMany(
      { userId },
      { $set: { isRevoked: true } }
    );

    // Clear cookies if using cookies
    if (process.env.USE_COOKIES === 'true') {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
    }

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Check authentication status
// @route   GET /api/auth/check
// @access  Public
router.get('/check', async (req, res) => {
  try {
    const accessToken = process.env.USE_COOKIES === 'true' 
      ? req.cookies.accessToken 
      : req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      return res.json({
        success: false,
        isAuthenticated: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      
      // Check if user exists and is active
      const user = await User.findById(decoded.userId)
        .select('-password')
        .lean();

      if (!user || !user.isActive) {
        return res.json({
          success: false,
          isAuthenticated: false,
          message: 'User not found or inactive'
        });
      }

      res.json({
        success: true,
        isAuthenticated: true,
        data: { user }
      });

    } catch (error) {
      res.json({
        success: false,
        isAuthenticated: false,
        message: 'Invalid or expired token'
      });
    }

  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      success: false,
      isAuthenticated: false,
      message: 'Error checking authentication status'
    });
  }
});

// @desc    Health check endpoint
// @route   GET /api/auth/health
// @access  Public
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// @desc    Get API info
// @route   GET /api/auth
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication API v1.0',
    endpoints: [
      'POST /register - Register new user',
      'POST /login - User login',
      'POST /refresh-token - Refresh access token',
      'GET /me - Get current user',
      'PUT /profile - Update profile',
      'PUT /change-password - Change password',
      'POST /forgot-password - Request password reset',
      'PUT /reset-password - Reset password',
      'GET /verify-email - Verify email',
      'POST /resend-verification - Resend verification email',
      'POST /logout - Logout user',
      'POST /logout-all - Logout from all devices',
      'DELETE /account - Delete account',
      'GET /check - Check authentication status',
      'GET /health - Health check'
    ],
    version: '1.0.0',
    documentation: '/api-docs/auth'
  });
});

module.exports = router;