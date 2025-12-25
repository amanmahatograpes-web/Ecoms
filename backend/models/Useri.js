const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    minlength: 8,
    select: false
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || validator.isMobilePhone(v, 'any');
      },
      message: 'Please provide a valid phone number'
    }
  },
  avatar: {
    type: String,
    default: null
  },

  // Authentication
  authProvider: {
    type: String,
    enum: ['local', 'google', 'facebook', 'twitter', 'linkedin'],
    default: 'local'
  },
  googleId: String,
  facebookId: String,
  twitterId: String,
  linkedinId: String,
  
  // Social Profiles
  socialProfiles: {
    facebook: {
      id: String,
      accessToken: String,
      profileUrl: String,
      connectedAt: Date
    },
    twitter: {
      id: String,
      accessToken: String,
      accessSecret: String,
      profileUrl: String,
      connectedAt: Date
    },
    linkedin: {
      id: String,
      accessToken: String,
      profileUrl: String,
      connectedAt: Date
    }
  },

  // Email Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Password Reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Security
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  lastPasswordChange: Date,
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLockedUntil: Date,
  
  // Tokens
  refreshToken: String,
  refreshTokenExpires: Date,
  accessTokens: [{
    token: String,
    expiresAt: Date,
    deviceInfo: Object,
    ipAddress: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Preferences
  preferences: {
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'es', 'fr', 'de']
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    notifications: {
      email: {
        priceChanges: { type: Boolean, default: true },
        promotions: { type: Boolean, default: true },
        security: { type: Boolean, default: true }
      },
      push: {
        priceChanges: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false }
      },
      sms: {
        importantUpdates: { type: Boolean, default: false }
      }
    },
    theme: {
      type: String,
      default: 'light',
      enum: ['light', 'dark', 'auto']
    }
  },

  // Role & Permissions
  role: {
    type: String,
    enum: ['admin', 'manager', 'analyst', 'customer', 'guest'],
    default: 'customer'
  },
  permissions: [{
    resource: String,
    actions: [String]
  }],

  // Subscription
  subscription: {
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PricingPlan'
    },
    planName: String,
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired', 'pending'],
      default: 'pending'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: true
    },
    paymentMethod: String,
    lastPaymentDate: Date,
    nextPaymentDate: Date
  },

  // Billing Information
  billingAddress: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    },
    postalCode: String,
    gstin: String
  },

  // Activity Tracking
  lastLogin: Date,
  lastActivity: Date,
  loginHistory: [{
    date: Date,
    ipAddress: String,
    userAgent: String,
    location: Object,
    device: String
  }],

  // Stats
  totalShares: {
    type: Number,
    default: 0
  },
  totalConversions: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },

  // Metadata
  metadata: {
    signupSource: String,
    campaign: String,
    referrer: String,
    utmParameters: Object
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
userSchema.virtual('fullName').get(function() {
  return this.name;
});

userSchema.virtual('isPremium').get(function() {
  return this.subscription.status === 'active' && 
         this.subscription.planName !== 'Basic';
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 });
userSchema.index({ facebookId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActivity: -1 });
userSchema.index({ 'socialProfiles.facebook.id': 1 });
userSchema.index({ 'socialProfiles.twitter.id': 1 });

// Middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordChange = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.isEmailVerified = false;
  }
  next();
});

// Methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      userId: this._id,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE,
      issuer: 'pricing-automation-api',
      audience: 'pricing-automation-client'
    }
  );
};

userSchema.methods.generateRefreshToken = function() {
  const jwt = require('jsonwebtoken');
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
  );
  
  this.refreshToken = refreshToken;
  this.refreshTokenExpires = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  );
  
  return refreshToken;
};

userSchema.methods.addLoginRecord = function(ip, userAgent, location, device) {
  this.loginHistory.push({
    date: new Date(),
    ipAddress: ip,
    userAgent: userAgent,
    location: location,
    device: device
  });
  
  // Keep only last 10 logins
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(-10);
  }
  
  this.lastLogin = new Date();
  this.lastActivity = new Date();
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = null;
};

userSchema.methods.incrementFailedLogin = function() {
  this.failedLoginAttempts += 1;
  
  if (this.failedLoginAttempts >= 5) {
    this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }
};

userSchema.methods.resetFailedLogins = function() {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = null;
};

userSchema.methods.isAccountLocked = function() {
  return this.accountLockedUntil && this.accountLockedUntil > new Date();
};

userSchema.methods.getPermissions = function() {
  const rolePermissions = {
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_plans', 'view_analytics'],
    manager: ['read', 'write', 'view_analytics'],
    analyst: ['read', 'view_analytics'],
    customer: ['read'],
    guest: ['read_public']
  };
  
  return rolePermissions[this.role] || ['read_public'];
};

userSchema.methods.can = function(action, resource = null) {
  const permissions = this.getPermissions();
  
  // Admin can do everything
  if (this.role === 'admin') return true;
  
  // Check specific permissions
  if (resource && this.permissions.length > 0) {
    const resourcePerm = this.permissions.find(p => p.resource === resource);
    if (resourcePerm && resourcePerm.actions.includes(action)) {
      return true;
    }
  }
  
  // Check role-based permissions
  return permissions.includes(action);
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findBySocialId = function(provider, socialId) {
  const query = {};
  if (provider === 'google') query.googleId = socialId;
  if (provider === 'facebook') query.facebookId = socialId;
  if (provider === 'twitter') query.twitterId = socialId;
  if (provider === 'linkedin') query.linkedinId = socialId;
  
  return this.findOne(query);
};

userSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { 
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        verifiedUsers: {
          $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] }
        },
        premiumUsers: {
          $sum: { 
            $cond: [{ 
              $and: [
                { $eq: ['$subscription.status', 'active'] },
                { $ne: ['$subscription.planName', 'Basic'] }
              ]
            }, 1, 0]
          }
        },
        byRole: {
          $push: {
            role: '$role',
            count: 1
          }
        },
        last7Days: {
          $sum: {
            $cond: [{
              $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)]
            }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        activeUsers: 1,
        verifiedUsers: 1,
        premiumUsers: 1,
        last7Days: 1,
        roleDistribution: {
          $arrayToObject: {
            $map: {
              input: '$byRole',
              as: 'item',
              in: {
                k: '$$item.role',
                v: { $sum: '$$item.count' }
              }
            }
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    premiumUsers: 0,
    last7Days: 0,
    roleDistribution: {}
  };
};

module.exports = mongoose.model('User', userSchema);