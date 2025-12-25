const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  // Plan Reference
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PricingPlan',
    required: true,
    index: true
  },
  planName: {
    type: String,
    required: true
  },
  planSlug: {
    type: String,
    required: true,
    index: true
  },
  
  // Price Details
  oldPrice: {
    type: Number,
    required: true,
    min: 0
  },
  newPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  
  // Change Details
  changeAmount: {
    type: Number,
    required: true
  },
  changePercentage: {
    type: Number,
    required: true
  },
  changeType: {
    type: String,
    enum: ['increase', 'decrease', 'no_change'],
    required: true
  },
  
  // Reason for Change
  reason: {
    type: String,
    enum: [
      'automation',
      'manual_adjustment',
      'demand_change',
      'seasonal_adjustment',
      'competitor_price',
      'cost_increase',
      'promotion',
      'coupon_applied',
      'tax_change',
      'currency_adjustment',
      'region_pricing',
      'bulk_discount',
      'loyalty_program',
      'error_correction'
    ],
    required: true
  },
  reasonDescription: {
    type: String,
    maxlength: 500
  },
  
  // Automation Factors
  automationFactors: {
    demandFactor: Number,
    seasonalAdjustment: Number,
    profitMargin: Number,
    competitorPrice: Number,
    regionMultiplier: Number,
    marketConditions: {
      demand: String,
      season: String
    }
  },
  
  // Manual Adjustment Details
  manualAdjustment: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    userEmail: String,
    notes: String,
    approvalRequired: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date
  },
  
  // Coupon Details (if applicable)
  couponDetails: {
    code: String,
    discount: Number,
    discountType: String,
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Impact Analysis
  impact: {
    expectedConversions: Number,
    expectedRevenue: Number,
    customerFeedback: {
      positive: Number,
      negative: Number,
      neutral: Number
    },
    churnRisk: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Timing
  effectiveFrom: {
    type: Date,
    default: Date.now
  },
  effectiveUntil: {
    type: Date,
    default: null
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  notifiedAt: Date,
  
  // Status
  status: {
    type: String,
    enum: ['active', 'reverted', 'scheduled', 'cancelled'],
    default: 'active'
  },
  revertedAt: Date,
  revertReason: String,
  
  // Metadata
  metadata: {
    sessionId: String,
    ipAddress: String,
    userAgent: String,
    location: {
      country: String,
      region: String,
      city: String,
      timezone: String
    },
    device: {
      type: String,
      os: String,
      browser: String,
      isMobile: Boolean
    }
  },
  
  // Audit Trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
priceHistorySchema.virtual('duration').get(function() {
  if (!this.effectiveUntil) return null;
  return this.effectiveUntil - this.effectiveFrom;
});

priceHistorySchema.virtual('isActive').get(function() {
  return this.status === 'active' && 
         (!this.effectiveUntil || this.effectiveUntil > new Date());
});

priceHistorySchema.virtual('formattedOldPrice').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(this.oldPrice);
});

priceHistorySchema.virtual('formattedNewPrice').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(this.newPrice);
});

// Indexes
priceHistorySchema.index({ planId: 1, createdAt: -1 });
priceHistorySchema.index({ createdAt: -1 });
priceHistorySchema.index({ 'automationFactors.marketConditions.demand': 1 });
priceHistorySchema.index({ changeType: 1 });
priceHistorySchema.index({ reason: 1 });
priceHistorySchema.index({ status: 1, effectiveFrom: 1 });
priceHistorySchema.index({ 'metadata.location.country': 1 });
priceHistorySchema.index({ changePercentage: 1 });

// Middleware
priceHistorySchema.pre('save', function(next) {
  // Calculate change amount and percentage
  this.changeAmount = this.newPrice - this.oldPrice;
  
  if (this.oldPrice > 0) {
    this.changePercentage = (this.changeAmount / this.oldPrice) * 100;
  } else {
    this.changePercentage = this.newPrice > 0 ? 100 : 0;
  }
  
  // Determine change type
  if (this.changeAmount > 0) {
    this.changeType = 'increase';
  } else if (this.changeAmount < 0) {
    this.changeType = 'decrease';
  } else {
    this.changeType = 'no_change';
  }
  
  // Set default effective from if not set
  if (!this.effectiveFrom) {
    this.effectiveFrom = new Date();
  }
  
  next();
});

// Methods
priceHistorySchema.methods.getChangeDescription = function() {
  const changeText = Math.abs(this.changePercentage).toFixed(1);
  
  if (this.changeType === 'increase') {
    return `Increased by ${changeText}%`;
  } else if (this.changeType === 'decrease') {
    return `Decreased by ${changeText}%`;
  } else {
    return 'No change';
  }
};

priceHistorySchema.methods.revert = function(userId, reason = '') {
  this.status = 'reverted';
  this.revertedAt = new Date();
  this.revertReason = reason;
  this.updatedBy = userId;
};

priceHistorySchema.methods.schedule = function(effectiveDate) {
  this.status = 'scheduled';
  this.effectiveFrom = effectiveDate;
};

// Static methods
priceHistorySchema.statics.findByPlan = function(planId, limit = 50, page = 1) {
  const skip = (page - 1) * limit;
  
  return this.find({ planId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('createdBy', 'name email')
    .populate('manualAdjustment.userId', 'name email')
    .lean();
};

priceHistorySchema.statics.getStatistics = async function(planId = null, startDate = null, endDate = null) {
  const match = {};
  
  if (planId) {
    match.planId = planId;
  }
  
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalChanges: { $sum: 1 },
        averageChange: { $avg: '$changePercentage' },
        maxIncrease: { 
          $max: {
            $cond: [{ $eq: ['$changeType', 'increase'] }, '$changePercentage', null]
          }
        },
        maxDecrease: { 
          $max: {
            $cond: [{ $eq: ['$changeType', 'decrease'] }, { $abs: '$changePercentage' }, null]
          }
        },
        totalIncreases: { 
          $sum: { $cond: [{ $eq: ['$changeType', 'increase'] }, 1, 0] }
        },
        totalDecreases: { 
          $sum: { $cond: [{ $eq: ['$changeType', 'decrease'] }, 1, 0] }
        },
        mostCommonReason: {
          $push: {
            reason: '$reason',
            count: 1
          }
        },
        byMonth: {
          $push: {
            month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            avgChange: '$changePercentage',
            count: 1
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalChanges: 1,
        averageChange: { $round: ['$averageChange', 2] },
        maxIncrease: { $round: ['$maxIncrease', 2] },
        maxDecrease: { $round: ['$maxDecrease', 2] },
        totalIncreases: 1,
        totalDecreases: 1,
        increaseDecreaseRatio: {
          $cond: [
            { $gt: ['$totalDecreases', 0] },
            { $divide: ['$totalIncreases', '$totalDecreases'] },
            '$totalIncreases'
          ]
        },
        mostCommonReason: {
          $arrayToObject: {
            $map: {
              input: '$mostCommonReason',
              as: 'item',
              in: {
                k: '$$item.reason',
                v: { $sum: '$$item.count' }
              }
            }
          }
        },
        monthlyTrend: {
          $arrayToObject: {
            $map: {
              input: '$byMonth',
              as: 'item',
              in: {
                k: '$$item.month',
                v: {
                  avgChange: { $avg: '$$item.avgChange' },
                  count: { $sum: '$$item.count' }
                }
              }
            }
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalChanges: 0,
    averageChange: 0,
    maxIncrease: 0,
    maxDecrease: 0,
    totalIncreases: 0,
    totalDecreases: 0,
    increaseDecreaseRatio: 0,
    mostCommonReason: {},
    monthlyTrend: {}
  };
};

priceHistorySchema.statics.getRecentChanges = async function(limit = 10) {
  return this.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('planId', 'name slug category')
    .populate('createdBy', 'name email')
    .lean();
};

priceHistorySchema.statics.getPriceVolatility = async function(planId, days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const changes = await this.find({
    planId,
    createdAt: { $gte: startDate },
    changeType: { $ne: 'no_change' }
  }).sort({ createdAt: 1 });
  
  if (changes.length < 2) {
    return { volatility: 0, averageChange: 0, changeCount: changes.length };
  }
  
  const percentages = changes.map(c => Math.abs(c.changePercentage));
  const mean = percentages.reduce((a, b) => a + b, 0) / percentages.length;
  
  const squaredDiffs = percentages.map(p => Math.pow(p - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / percentages.length;
  const volatility = Math.sqrt(variance);
  
  return {
    volatility: parseFloat(volatility.toFixed(2)),
    averageChange: parseFloat(mean.toFixed(2)),
    changeCount: changes.length,
    periodDays: days
  };
};

module.exports = mongoose.model('PriceHistory', priceHistorySchema);