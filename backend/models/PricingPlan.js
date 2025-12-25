const mongoose = require('mongoose');
const constants = require('../config/constants');

const pricingPlanSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Plan description is required'],
    trim: true,
    maxlength: 500
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 150
  },
  
  // Pricing
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  currentPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    enum: Object.keys(constants.CURRENCY)
  },
  period: {
    type: String,
    default: 'month',
    enum: ['hour', 'day', 'week', 'month', 'quarter', 'year', 'lifetime']
  },
  
  // Features
  features: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    included: {
      type: Boolean,
      default: true
    },
    limit: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    unit: String,
    tooltip: String,
    priority: {
      type: Number,
      default: 0
    }
  }],
  
  // Categories & Tags
  category: {
    type: String,
    required: true,
    enum: Object.values(constants.PLAN_CATEGORIES),
    index: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Display Settings
  popular: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  recommended: {
    type: Boolean,
    default: false
  },
  badge: {
    text: String,
    color: {
      type: String,
      default: 'blue',
      enum: ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo']
    }
  },
  colorScheme: {
    primary: {
      type: String,
      default: '#3B82F6'
    },
    secondary: {
      type: String,
      default: '#1E40AF'
    }
  },
  
  // Tax & Compliance
  taxPercentage: {
    type: Number,
    default: 18,
    min: 0,
    max: 100
  },
  taxInclusive: {
    type: Boolean,
    default: true
  },
  gstApplicable: {
    type: Boolean,
    default: true
  },
  hsnCode: String,
  
  // Automation Settings
  automationSettings: {
    enabled: {
      type: Boolean,
      default: false
    },
    demandFactor: {
      type: Number,
      default: 1.0,
      min: constants.AUTOMATION_SETTINGS.MIN_DEMAND_FACTOR,
      max: constants.AUTOMATION_SETTINGS.MAX_DEMAND_FACTOR
    },
    seasonalAdjustment: {
      type: Number,
      default: 0,
      min: constants.AUTOMATION_SETTINGS.MIN_SEASONAL_ADJ,
      max: constants.AUTOMATION_SETTINGS.MAX_SEASONAL_ADJ
    },
    profitMargin: {
      type: Number,
      default: 30,
      min: constants.AUTOMATION_SETTINGS.MIN_PROFIT_MARGIN,
      max: constants.AUTOMATION_SETTINGS.MAX_PROFIT_MARGIN
    },
    competitorTracking: {
      type: Boolean,
      default: false
    },
    minPrice: {
      type: Number,
      min: 0
    },
    maxPrice: {
      type: Number,
      min: 0
    },
    adjustmentRules: [{
      condition: String,
      action: String,
      value: Number,
      description: String
    }],
    updateFrequency: {
      type: String,
      enum: ['realtime', 'hourly', 'daily', 'weekly'],
      default: 'hourly'
    }
  },
  
  // Discounts
  discounts: {
    annualDiscount: {
      type: Number,
      default: 20,
      min: 0,
      max: constants.DISCOUNT_LIMITS.MAX_ANNUAL_DISCOUNT
    },
    quarterlyDiscount: {
      type: Number,
      default: 10,
      min: 0,
      max: 30
    },
    coupons: [{
      code: {
        type: String,
        uppercase: true,
        trim: true
      },
      discount: {
        type: Number,
        min: 1,
        max: constants.DISCOUNT_LIMITS.MAX_COUPON_DISCOUNT
      },
      type: {
        type: String,
        enum: ['percentage', 'fixed', 'free_trial'],
        default: 'percentage'
      },
      description: String,
      validFrom: Date,
      validUntil: Date,
      usageLimit: {
        type: Number,
        default: null
      },
      usedCount: {
        type: Number,
        default: 0
      },
      applicablePlans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PricingPlan'
      }],
      minPurchaseAmount: Number,
      maxDiscountAmount: Number,
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  
  // Market Conditions
  marketConditions: {
    demand: {
      type: String,
      enum: Object.keys(constants.MARKET_CONDITIONS.DEMAND_LEVELS),
      default: 'NORMAL'
    },
    season: {
      type: String,
      enum: Object.keys(constants.MARKET_CONDITIONS.SEASONS),
      default: 'REGULAR'
    },
    competitorPrice: {
      type: Number,
      default: 0,
      min: 0
    },
    competitorData: [{
      name: String,
      price: Number,
      currency: String,
      url: String,
      lastUpdated: Date
    }],
    regionMultipliers: {
      type: Map,
      of: Number,
      default: new Map([['IN', 1.0], ['US', 1.0], ['EU', 1.0]])
    }
  },
  
  // Limits & Restrictions
  limits: {
    maxUsers: {
      type: Number,
      default: null
    },
    maxStorage: {
      type: Number,
      default: null
    },
    maxProjects: {
      type: Number,
      default: null
    },
    apiCallsPerDay: {
      type: Number,
      default: null
    },
    supportLevel: {
      type: String,
      enum: ['basic', 'priority', '24x7', 'dedicated'],
      default: 'basic'
    },
    sla: {
      type: Number,
      default: 99.5,
      min: 0,
      max: 100
    }
  },
  
  // Trial & Setup
  trialPeriod: {
    enabled: {
      type: Boolean,
      default: false
    },
    days: {
      type: Number,
      default: 14,
      min: 0,
      max: 90
    }
  },
  setupFee: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Analytics
  totalSubscriptions: {
    type: Number,
    default: 0
  },
  activeSubscriptions: {
    type: Number,
    default: 0
  },
  conversionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Social Sharing
  shareStats: {
    totalShares: {
      type: Number,
      default: 0
    },
    platformShares: {
      whatsapp: { type: Number, default: 0 },
      facebook: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 },
      instagram: { type: Number, default: 0 },
      linkedin: { type: Number, default: 0 },
      email: { type: Number, default: 0 }
    },
    lastShared: Date
  },
  
  // Metadata
  metadata: {
    displayOrder: {
      type: Number,
      default: 0
    },
    icon: String,
    imageUrl: String,
    videoUrl: String,
    documentationUrl: String,
    faqUrl: String
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  
  // Audit
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
pricingPlanSchema.virtual('priceWithTax').get(function() {
  if (this.taxInclusive) {
    return this.currentPrice;
  }
  return this.currentPrice + (this.currentPrice * this.taxPercentage / 100);
});

pricingPlanSchema.virtual('annualPrice').get(function() {
  const discount = this.discounts.annualDiscount / 100;
  return this.currentPrice * 12 * (1 - discount);
});

pricingPlanSchema.virtual('quarterlyPrice').get(function() {
  const discount = this.discounts.quarterlyDiscount / 100;
  return this.currentPrice * 3 * (1 - discount);
});

pricingPlanSchema.virtual('dailyPrice').get(function() {
  return this.currentPrice / 30; // Approximate daily price
});

pricingPlanSchema.virtual('priceHistory', {
  ref: 'PriceHistory',
  localField: '_id',
  foreignField: 'planId'
});

pricingPlanSchema.virtual('shareAnalytics', {
  ref: 'ShareAnalytics',
  localField: '_id',
  foreignField: 'planId'
});

// Indexes
pricingPlanSchema.index({ slug: 1 }, { unique: true });
pricingPlanSchema.index({ category: 1, currentPrice: 1 });
pricingPlanSchema.index({ popular: 1, featured: 1 });
pricingPlanSchema.index({ 'automationSettings.enabled': 1 });
pricingPlanSchema.index({ isActive: 1, isPublished: 1 });
pricingPlanSchema.index({ createdAt: -1 });
pricingPlanSchema.index({ currentPrice: 1 });
pricingPlanSchema.index({ tags: 1 });

// Middleware
pricingPlanSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  }
  
  if (this.isModified('currentPrice') && this.currentPrice < 0) {
    next(new Error('Price cannot be negative'));
  }
  
  next();
});

pricingPlanSchema.pre('save', function(next) {
  // Ensure current price is set initially
  if (!this.currentPrice) {
    this.currentPrice = this.basePrice;
  }
  
  // Validate automation settings
  if (this.automationSettings.enabled) {
    const { minPrice, maxPrice } = this.automationSettings;
    if (minPrice && maxPrice && minPrice > maxPrice) {
      next(new Error('Minimum price cannot be greater than maximum price'));
    }
  }
  
  next();
});

// Methods
pricingPlanSchema.methods.calculatePriceWithTax = function(price = null) {
  const priceToUse = price || this.currentPrice;
  if (this.taxInclusive) {
    return priceToUse;
  }
  return priceToUse + (priceToUse * this.taxPercentage / 100);
};

pricingPlanSchema.methods.getFormattedPrice = function(includeTax = true, period = null) {
  const currency = constants.CURRENCY[this.currency];
  const price = includeTax ? this.priceWithTax : this.currentPrice;
  
  let formattedPrice = new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces
  }).format(price);
  
  if (period) {
    formattedPrice += `/${period}`;
  }
  
  return formattedPrice;
};

pricingPlanSchema.methods.applyCoupon = function(couponCode) {
  const coupon = this.discounts.coupons.find(c => 
    c.code === couponCode.toUpperCase() && 
    c.isActive &&
    (!c.validFrom || c.validFrom <= new Date()) &&
    (!c.validUntil || c.validUntil >= new Date()) &&
    (!c.usageLimit || c.usedCount < c.usageLimit)
  );

  if (!coupon) {
    return null;
  }

  let discountAmount = 0;
  
  if (coupon.type === 'percentage') {
    discountAmount = this.currentPrice * (coupon.discount / 100);
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else if (coupon.type === 'fixed') {
    discountAmount = coupon.discount;
  }
  
  const finalPrice = this.currentPrice - discountAmount;
  
  // Apply minimum purchase amount check
  if (coupon.minPurchaseAmount && this.currentPrice < coupon.minPurchaseAmount) {
    return null;
  }
  
  return {
    coupon,
    discountAmount,
    finalPrice,
    discountPercentage: coupon.type === 'percentage' ? coupon.discount : (discountAmount / this.currentPrice) * 100
  };
};

pricingPlanSchema.methods.incrementShares = function(platform) {
  this.shareStats.totalShares += 1;
  
  if (this.shareStats.platformShares[platform] !== undefined) {
    this.shareStats.platformShares[platform] += 1;
  }
  
  this.shareStats.lastShared = new Date();
};

pricingPlanSchema.methods.getAutomatedPrice = function(marketData = {}) {
  if (!this.automationSettings.enabled) {
    return this.currentPrice;
  }

  let adjustedPrice = this.basePrice;

  // Apply demand factor
  const demandLevel = constants.MARKET_CONDITIONS.DEMAND_LEVELS[marketData.demand || 'NORMAL'];
  if (demandLevel) {
    adjustedPrice *= demandLevel.multiplier;
  }

  // Apply seasonal adjustment
  const season = constants.MARKET_CONDITIONS.SEASONS[marketData.season || 'REGULAR'];
  if (season) {
    adjustedPrice *= season.multiplier;
  }

  // Apply automation settings
  adjustedPrice *= this.automationSettings.demandFactor;
  adjustedPrice *= (1 + this.automationSettings.seasonalAdjustment / 100);

  // Competitor adjustment
  if (this.automationSettings.competitorTracking && marketData.competitorPrice) {
    const competitorDiff = marketData.competitorPrice - this.basePrice;
    if (Math.abs(competitorDiff) > 1000) {
      adjustedPrice += competitorDiff * 0.3;
    }
  }

  // Apply profit margin
  const cost = adjustedPrice / (1 + this.automationSettings.profitMargin / 100);
  adjustedPrice = cost * (1 + this.automationSettings.profitMargin / 100);

  // Apply region multiplier
  if (marketData.region && this.marketConditions.regionMultipliers.has(marketData.region)) {
    adjustedPrice *= this.marketConditions.regionMultipliers.get(marketData.region);
  }

  // Apply min/max limits
  if (this.automationSettings.minPrice) {
    adjustedPrice = Math.max(adjustedPrice, this.automationSettings.minPrice);
  }
  if (this.automationSettings.maxPrice) {
    adjustedPrice = Math.min(adjustedPrice, this.automationSettings.maxPrice);
  }

  // Round to nearest 10
  adjustedPrice = Math.round(adjustedPrice / 10) * 10;

  return adjustedPrice;
};

// Static methods
pricingPlanSchema.statics.findActivePlans = function() {
  return this.find({ isActive: true, isPublished: true })
    .sort({ 'metadata.displayOrder': 1, createdAt: 1 });
};

pricingPlanSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category: category.toUpperCase(),
    isActive: true,
    isPublished: true 
  }).sort({ currentPrice: 1 });
};

pricingPlanSchema.statics.getPriceRange = async function() {
  const result = await this.aggregate([
    { 
      $match: { 
        isActive: true,
        isPublished: true 
      } 
    },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$currentPrice' },
        maxPrice: { $max: '$currentPrice' },
        avgPrice: { $avg: '$currentPrice' },
        totalPlans: { $sum: 1 }
      }
    }
  ]);
  
  return result[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0, totalPlans: 0 };
};

pricingPlanSchema.statics.getCategoryStats = async function() {
  return this.aggregate([
    { 
      $match: { 
        isActive: true,
        isPublished: true 
      } 
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$currentPrice' },
        minPrice: { $min: '$currentPrice' },
        maxPrice: { $max: '$currentPrice' },
        totalSubscriptions: { $sum: '$totalSubscriptions' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);