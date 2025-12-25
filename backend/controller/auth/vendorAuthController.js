const Vendor = require('../../models/Vendor');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../../services/emailService');
const { sendSMS } = require('../../services/smsService');
const logger = require('../../utils/logger');

// Generate JWT Token
const generateToken = (vendorId) => {
  return jwt.sign(
    { id: vendorId, type: 'vendor' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Generate Refresh Token
const generateRefreshToken = (vendorId) => {
  return jwt.sign(
    { id: vendorId, type: 'vendor', refresh: true },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
};

// @desc    Register vendor
// @route   POST /api/auth/vendor/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      companyName,
      businessEmail,
      password,
      phone,
      businessType,
      industry,
      description,
      website,
      gstNumber,
      panNumber,
      address,
      metadata
    } = req.body;

    // Check if vendor already exists
    let vendor = await Vendor.findOne({ 
      $or: [
        { businessEmail: businessEmail.toLowerCase() },
        { gstNumber: gstNumber.toUpperCase() },
        { panNumber: panNumber.toUpperCase() },
        { phone }
      ]
    });

    if (vendor) {
      let field = '';
      if (vendor.businessEmail === businessEmail.toLowerCase()) field = 'email';
      else if (vendor.gstNumber === gstNumber.toUpperCase()) field = 'GST number';
      else if (vendor.panNumber === panNumber.toUpperCase()) field = 'PAN number';
      else field = 'phone number';

      return res.status(400).json({
        success: false,
        message: `Vendor with this ${field} already exists`
      });
    }

    // Create vendor
    vendor = new Vendor({
      companyName,
      businessEmail: businessEmail.toLowerCase(),
      password,
      phone,
      businessType: businessType || 'company',
      industry,
      description,
      website,
      gstNumber: gstNumber.toUpperCase(),
      panNumber: panNumber.toUpperCase(),
      address,
      metadata: {
        ...metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        signupSource: req.get('Referer') || 'direct'
      }
    });

    // Generate email verification token
    const verificationToken = vendor.generateEmailVerificationToken();
    await vendor.save();

    // Generate tokens
    const token = generateToken(vendor._id);
    const refreshToken = generateRefreshToken(vendor._id);

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Verify Your Email - Pricing Automation',
      template: 'email-verification',
      context: {
        companyName: vendor.companyName,
        verificationUrl,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });

    // Send welcome email
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Welcome to Pricing Automation!',
      template: 'welcome-vendor',
      context: {
        companyName: vendor.companyName,
        dashboardUrl: `${process.env.FRONTEND_URL}/vendor/dashboard`,
        supportEmail: process.env.SUPPORT_EMAIL,
        trialDaysLeft: vendor.trialDaysLeft
      }
    });

    logger.info('Vendor registered successfully', { vendorId: vendor._id, companyName });

    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully. Please check your email for verification.',
      data: {
        token,
        vendor: {
          id: vendor._id,
          companyName: vendor.companyName,
          businessEmail: vendor.businessEmail,
          phone: vendor.phone,
          businessType: vendor.businessType,
          industry: vendor.industry,
          isEmailVerified: vendor.isEmailVerified,
          isVerified: vendor.isVerified,
          status: vendor.status,
          subscription: vendor.subscription,
          trialDaysLeft: vendor.trialDaysLeft,
          createdAt: vendor.createdAt
        }
      }
    });

  } catch (error) {
    logger.error('Vendor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login vendor
// @route   POST /api/auth/vendor/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find vendor by email
    const vendor = await Vendor.findOne({ 
      businessEmail: email.toLowerCase() 
    }).select('+password +loginAttempts +lockUntil');

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (vendor.isAccountLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to too many failed login attempts. Please try again later or reset your password.'
      });
    }

    // Check password
    const isPasswordValid = await vendor.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await vendor.incrementLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        remainingAttempts: 5 - (vendor.loginAttempts + 1)
      });
    }

    // Reset login attempts on successful login
    await vendor.resetLoginAttempts();

    // Check if vendor is active
    if (!vendor.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if vendor is verified
    if (!vendor.isVerified && vendor.status === 'pending_verification') {
      return res.status(403).json({
        success: false,
        message: 'Account is pending verification. Please check your email or contact support.'
      });
    }

    // Update last login
    vendor.lastLoginAt = new Date();
    vendor.lastActivityAt = new Date();
    await vendor.save();

    // Generate tokens
    const token = generateToken(vendor._id);
    const refreshToken = generateRefreshToken(vendor._id);

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    logger.info('Vendor logged in successfully', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        vendor: {
          id: vendor._id,
          companyName: vendor.companyName,
          businessEmail: vendor.businessEmail,
          phone: vendor.phone,
          businessType: vendor.businessType,
          industry: vendor.industry,
          isEmailVerified: vendor.isEmailVerified,
          isVerified: vendor.isVerified,
          status: vendor.status,
          subscription: vendor.subscription,
          trialDaysLeft: vendor.trialDaysLeft,
          logo: vendor.logo,
          settings: vendor.settings,
          statistics: vendor.statistics,
          createdAt: vendor.createdAt
        }
      }
    });

  } catch (error) {
    logger.error('Vendor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/vendor/refresh
// @access  Private
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded.refresh || decoded.type !== 'vendor') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if vendor exists and is active
    const vendor = await Vendor.findById(decoded.id);
    
    if (!vendor || !vendor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Vendor not found or inactive'
      });
    }

    // Generate new access token
    const newToken = generateToken(vendor._id);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        vendor: {
          id: vendor._id,
          companyName: vendor.companyName,
          businessEmail: vendor.businessEmail,
          isVerified: vendor.isVerified,
          status: vendor.status
        }
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired'
      });
    }

    logger.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout vendor
// @route   POST /api/auth/vendor/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    logger.info('Vendor logged out', { vendorId: req.vendor.id });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current vendor
// @route   GET /api/auth/vendor/me
// @access  Private
exports.getCurrentVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id)
      .select('-password -verificationToken -resetPasswordToken -emailVerificationToken -phoneVerificationCode');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vendor
    });

  } catch (error) {
    logger.error('Get current vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/vendor/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find vendor with this token and valid expiration
    const vendor = await Vendor.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update vendor
    vendor.isEmailVerified = true;
    vendor.emailVerificationToken = undefined;
    vendor.emailVerificationExpires = undefined;
    
    // If both email and phone are verified, mark as verified
    if (vendor.isEmailVerified && vendor.isPhoneVerified) {
      vendor.isVerified = true;
      vendor.status = 'verified';
    }

    await vendor.save();

    logger.info('Email verified successfully', { vendorId: vendor._id });

    // Send welcome email
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Email Verified Successfully!',
      template: 'email-verified',
      context: {
        companyName: vendor.companyName,
        dashboardUrl: `${process.env.FRONTEND_URL}/vendor/dashboard`,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/vendor/resend-verification
// @access  Private
exports.resendVerification = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (vendor.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = vendor.generateEmailVerificationToken();
    await vendor.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Verify Your Email - Pricing Automation',
      template: 'email-verification',
      context: {
        companyName: vendor.companyName,
        verificationUrl,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });

    logger.info('Verification email resent', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/vendor/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Find vendor by email
    const vendor = await Vendor.findOne({ businessEmail: email.toLowerCase() });

    if (!vendor) {
      // Don't reveal that vendor doesn't exist for security
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link'
      });
    }

    // Generate reset token
    const resetToken = vendor.generateResetPasswordToken();
    await vendor.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Reset Your Password - Pricing Automation',
      template: 'password-reset',
      context: {
        companyName: vendor.companyName,
        resetUrl,
        expiryTime: '1 hour',
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });

    logger.info('Password reset email sent', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/vendor/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    // Hash the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find vendor with this token and valid expiration
    const vendor = await Vendor.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!vendor) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    vendor.password = password;
    vendor.resetPasswordToken = undefined;
    vendor.resetPasswordExpires = undefined;
    await vendor.save();

    // Send confirmation email
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Password Reset Successful - Pricing Automation',
      template: 'password-reset-success',
      context: {
        companyName: vendor.companyName,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });

    logger.info('Password reset successful', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Send phone verification code
// @route   POST /api/auth/vendor/verify-phone
// @access  Private
exports.sendPhoneVerification = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { phone } = req.body;
    const vendor = await Vendor.findById(req.vendor.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (vendor.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified'
      });
    }

    // Generate verification code
    const verificationCode = vendor.generatePhoneVerificationCode();
    await vendor.save();

    // Send SMS with verification code
    await sendSMS({
      to: phone,
      body: `Your Pricing Automation verification code is: ${verificationCode}. Valid for 10 minutes.`
    });

    logger.info('Phone verification code sent', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Verification code sent successfully'
    });

  } catch (error) {
    logger.error('Send phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify phone code
// @route   POST /api/auth/vendor/verify-phone-code
// @access  Private
exports.verifyPhoneCode = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { code, phone } = req.body;
    const vendor = await Vendor.findById(req.vendor.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (vendor.isPhoneVerified) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already verified'
      });
    }

    // Hash the code
    const hashedCode = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    // Verify code
    if (vendor.phoneVerificationCode !== hashedCode || 
        vendor.phoneVerificationExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Update vendor
    vendor.isPhoneVerified = true;
    vendor.phoneVerificationCode = undefined;
    vendor.phoneVerificationExpires = undefined;
    
    // If both email and phone are verified, mark as verified
    if (vendor.isEmailVerified && vendor.isPhoneVerified) {
      vendor.isVerified = true;
      vendor.status = 'verified';
    }

    // Update phone if different
    if (phone && phone !== vendor.phone) {
      vendor.phone = phone;
    }

    await vendor.save();

    logger.info('Phone verified successfully', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully'
    });

  } catch (error) {
    logger.error('Verify phone code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/vendor/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const vendor = await Vendor.findById(req.vendor.id).select('+password');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Verify current password
    const isPasswordValid = await vendor.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    vendor.password = newPassword;
    await vendor.save();

    // Send confirmation email
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Password Changed - Pricing Automation',
      template: 'password-changed',
      context: {
        companyName: vendor.companyName,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });

    logger.info('Password changed successfully', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Setup two-factor authentication
// @route   POST /api/auth/vendor/setup-2fa
// @access  Private
exports.setupTwoFactorAuth = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (vendor.settings.security.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is already enabled'
      });
    }

    // Generate secret key for 2FA
    // In production, use a library like speakeasy or otplib
    const secret = crypto.randomBytes(20).toString('hex');
    
    // Generate QR code URL for Google Authenticator
    const otpAuthUrl = `otpauth://totp/Pricing%20Automation:${vendor.businessEmail}?secret=${secret}&issuer=Pricing%20Automation`;
    
    // Store secret temporarily (you would store this encrypted in production)
    vendor.settings.security.twoFactorSecret = secret;
    await vendor.save();

    logger.info('2FA setup initiated', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication setup initiated',
      data: {
        secret,
        otpAuthUrl,
        // In production, generate actual QR code or use a library
        qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUrl)}`
      }
    });

  } catch (error) {
    logger.error('2FA setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify two-factor authentication
// @route   POST /api/auth/vendor/verify-2fa
// @access  Private
exports.verifyTwoFactorAuth = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { token } = req.body;
    const vendor = await Vendor.findById(req.vendor.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (!vendor.settings.security.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication not set up'
      });
    }

    // Verify token
    // In production, use a library like speakeasy or otplib
    // This is a simplified example
    const isValid = true; // Replace with actual verification

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Enable 2FA
    vendor.settings.security.twoFactorEnabled = true;
    // Clear the secret from settings (store it encrypted elsewhere in production)
    vendor.settings.security.twoFactorSecret = undefined;
    await vendor.save();

    // Send confirmation email
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Two-Factor Authentication Enabled - Pricing Automation',
      template: '2fa-enabled',
      context: {
        companyName: vendor.companyName,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });

    logger.info('2FA enabled successfully', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication enabled successfully'
    });

  } catch (error) {
    logger.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Disable two-factor authentication
// @route   DELETE /api/auth/vendor/disable-2fa
// @access  Private
exports.disableTwoFactorAuth = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (!vendor.settings.security.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Two-factor authentication is not enabled'
      });
    }

    // Disable 2FA
    vendor.settings.security.twoFactorEnabled = false;
    await vendor.save();

    // Send confirmation email
    await sendEmail({
      to: vendor.businessEmail,
      subject: 'Two-Factor Authentication Disabled - Pricing Automation',
      template: '2fa-disabled',
      context: {
        companyName: vendor.companyName,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });

    logger.info('2FA disabled successfully', { vendorId: vendor._id });

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication disabled successfully'
    });

  } catch (error) {
    logger.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};