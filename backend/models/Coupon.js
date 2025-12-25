const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: [3, 'Coupon code must be at least 3 characters'],
    maxlength: [50, 'Coupon code cannot exceed 50 characters']
  },
  
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping'],
    required: [true, 'Discount type is required'],
    default: 'percentage'
  },
  
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative'],
    validate: {
      validator: function(value) {
        if (this.discountType === 'percentage') {
          return value >= 0 && value <= 100;
        }
        return value >= 0;
      },
      message: 'Percentage discount must be between 0 and 100'
    }
  },
  
  minimumPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase cannot be negative']
  },
  
  maximumDiscount: {
    type: Number,
    min: [0, 'Maximum discount cannot be negative']
  },
  
  usageLimit: {
    type: Number,
    min: [1, 'Usage limit must be at least 1'],
    default: null
  },
  
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  
  validFrom: {
    type: Date,
    default: Date.now
  },
  
  validUntil: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return value > this.validFrom;
      },
      message: 'Valid until date must be after valid from date'
    }
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isArchived: {
    type: Boolean,
    default: false
  },
  
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  singleUsePerUser: {
    type: Boolean,
    default: false
  },
  
  firstOrderOnly: {
    type: Boolean,
    default: false
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  archivedAt: Date,
  
  lastUsedAt: Date,
  lastUsedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  usageHistory: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    discount: Number,
    appliedAt: Date,
    ipAddress: String,
    userAgent: String
  }],
  
  metadata: {
    campaign: String,
    createdVia: String,
    batchId: String,
    lastUpdatedBy: mongoose.Schema.Types.ObjectId,
    lastUpdatedAt: Date,
    updateReason: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validUntil: 1 });
couponSchema.index({ discountType: 1 });
couponSchema.index({ createdBy: 1 });
couponSchema.index({ usedCount: -1 });
couponSchema.index({ createdAt: -1 });
couponSchema.index({ 'usageHistory.appliedAt': -1 });

// Virtual for remaining uses
couponSchema.virtual('remainingUses').get(function() {
  if (!this.usageLimit) return Infinity;
  return Math.max(0, this.usageLimit - this.usedCount);
});

// Virtual for validity status
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  
  if (!this.isActive) return false;
  if (this.validFrom && now < this.validFrom) return false;
  if (this.validUntil && now > this.validUntil) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  
  return true;
});

// Methods
couponSchema.methods.incrementUsage = async function(orderId, userId, amount, discount) {
  this.usedCount += 1;
  this.lastUsedAt = new Date();
  this.lastUsedBy = userId;
  
  this.usageHistory.push({
    orderId,
    userId,
    amount,
    discount,
    appliedAt: new Date()
  });
  
  await this.save();
};

module.exports = mongoose.model('Coupon', couponSchema);