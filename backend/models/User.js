// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Please provide a name'],
//         trim: true,
//         maxlength: [50, 'Name cannot be more than 50 characters']
//     },
//     email: {
//         type: String,
//         required: [true, 'Please provide an email'],
//         unique: true,
//         lowercase: true,
//         match: [
//             /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//             'Please provide a valid email'
//         ]
//     },
//     password: {
//         type: String,
//         required: [true, 'Please provide a password'],
//         minlength: [6, 'Password must be at least 6 characters'],
//         select: false
//     },
//     phone: {
//         type: String,
//         required: [true, 'Please provide a phone number'],
//         match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
//     },
//     role: {
//         type: String,
//         enum: ['user', 'admin', 'super_admin'],
//         default: 'user'
//     },
//     company: {
//         name: String,
//         size: String,
//         industry: String
//     },
//     location: {
//         country: {
//             type: String,
//             default: 'IN'
//         },
//         city: String,
//         state: String,
//         timezone: {
//             type: String,
//             default: 'Asia/Kolkata'
//         }
//     },
//     subscription: {
//         plan: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Plan'
//         },
//         status: {
//             type: String,
//             enum: ['active', 'inactive', 'expired', 'cancelled'],
//             default: 'inactive'
//         },
//         startDate: Date,
//         endDate: Date,
//         autoRenew: {
//             type: Boolean,
//             default: true
//         }
//     },
//     paymentMethods: [{
//         type: {
//             type: String,
//             enum: ['card', 'upi', 'net_banking']
//         },
//         details: {
//             cardLast4: String,
//             cardBrand: String,
//             upiId: String,
//             bankName: String
//         },
//         isDefault: Boolean
//     }],
//     preferences: {
//         currency: {
//             type: String,
//             default: 'INR'
//         },
//         taxInclusive: {
//             type: Boolean,
//             default: true
//         },
//         notifications: {
//             email: { type: Boolean, default: true },
//             sms: { type: Boolean, default: true },
//             push: { type: Boolean, default: true }
//         }
//     },
//     otp: {
//         code: String,
//         expiresAt: Date
//     },
//     isEmailVerified: {
//         type: Boolean,
//         default: false
//     },
//     isPhoneVerified: {
//         type: Boolean,
//         default: false
//     },
//     lastLogin: Date,
//     status: {
//         type: String,
//         enum: ['active', 'inactive', 'suspended'],
//         default: 'active'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
    
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// // Compare password method
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

// // Generate JWT token
// userSchema.methods.generateAuthToken = function() {
//     return jwt.sign(
//         { 
//             id: this._id, 
//             email: this.email, 
//             role: this.role 
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: process.env.JWT_EXPIRE || '30d' }
//     );
// };

// // Generate OTP
// userSchema.methods.generateOTP = function() {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     this.otp = {
//         code: otp,
//         expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
//     };
//     return otp;
// };

// // Verify OTP
// userSchema.methods.verifyOTP = function(code) {
//     if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
//         return false;
//     }
    
//     if (this.otp.expiresAt < new Date()) {
//         return false;
//     }
    
//     return this.otp.code === code;
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[+]?[\d\s\-()]+$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'moderator'],
    default: 'customer'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  passwordChangedAt: Date,
  loginAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  lockedUntil: {
    type: Date,
    select: false
  },
  lastLogin: Date,
  deactivatedAt: Date,
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  dateOfBirth: Date,
  profileImage: String,
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ isActive: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);