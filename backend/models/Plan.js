import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  // ====================
  // BASIC INFORMATION
  // ====================
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    minlength: [2, 'Plan name must be at least 2 characters'],
    maxlength: [100, 'Plan name cannot exceed 100 characters'],
    unique: true
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
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  tagline: {
    type: String,
    maxlength: [200, 'Tagline cannot exceed 200 characters']
  },
  
  shortDescription: {
    type: String,
    maxlength: [150, 'Short description cannot exceed 150 characters']
  },
  
  // ====================
  // PRICING INFORMATION
  // ====================
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  
  period: {
    type: String,
    enum: ['month', 'year', 'quarter', 'week', 'lifetime'],
    default: 'month'
  },
  
  billingCycles: [{
    type: String,
    enum: ['month', 'year', 'quarter', 'week']
  }],
  
  defaultBillingCycle: {
    type: String,
    enum: ['month', 'year', 'quarter', 'week'],
    default: 'month'
  },
  
  discount: {
    annualDiscount: {
      type: Number,
      default: 20,
      min: 0,
      max: 100
    },
    maxDiscount: {
      type: Number,
      min: 0,
      max: 100
    },
    minPurchase: Number
  },
  
  billingCycleDiscounts: {
    year: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
    quarter: { 
      type: Number, 
      min: 0, 
      max: 100 
    },
    week: { 
      type: Number, 
      min: 0, 
      max: 100 
    }
  },
  
  setupFee: {
    type: Number,
    default: 0,
    min: [0, 'Setup fee cannot be negative']
  },
  
  // ====================
  // FEATURES & SPECIFICATIONS
  // ====================
  features: [{
    name: {
      type: String,
      required: true
    },
    included: {
      type: Boolean,
      default: true
    },
    description: String,
    value: String,
    icon: String,
    sortOrder: Number
  }],
  
  featureList: [{
    type: String
  }],
  
  category: {
    type: String,
    enum: ['starter', 'growth', 'professional', 'enterprise', 'custom', 'legacy', 'free'],
    default: 'starter'
  },
  
  tier: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  
  // ====================
  // PLAN STATUS FLAGS
  // ====================
  isPopular: {
    type: Boolean,
    default: false
  },
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isArchived: {
    type: Boolean,
    default: false
  },
  
  isTrialAvailable: {
    type: Boolean,
    default: false
  },
  
  displayOrder: {
    type: Number,
    default: 0,
    min: 0
  },
  
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // ====================
  // USAGE LIMITS & RESTRICTIONS
  // ====================
  limitations: {
    maxUsers: {
      type: Number,
      min: [1, 'Maximum users must be at least 1']
    },
    maxProjects: {
      type: Number,
      min: 1
    },
    storage: {
      type: String,
      default: '100GB'
    },
    storageBytes: {
      type: Number,
      default: 100 * 1024 * 1024 * 1024 // 100GB in bytes
    },
    apiCalls: {
      type: String,
      default: 'Unlimited'
    },
    apiCallsPerMonth: {
      type: Number
    },
    supportLevel: {
      type: String,
      enum: ['basic', 'priority', '24/7', 'dedicated', 'enterprise'],
      default: 'basic'
    }
  },
  
  maxUsers: {
    type: Number,
    min: [1, 'Maximum users must be at least 1']
  },
  
  storage: {
    type: String,
    default: '100GB'
  },
  
  supportType: {
    type: String,
    enum: ['email', 'priority', '24/7', 'dedicated', 'community'],
    default: 'email'
  },
  
  // ====================
  // TRIAL INFORMATION
  // ====================
  trialDays: {
    type: Number,
    default: 0,
    min: [0, 'Trial days cannot be negative'],
    max: [365, 'Trial cannot exceed 365 days']
  },
  
  trialFeatures: [{
    type: String
  }],
  
  // ====================
  // FINANCIAL
  // ====================
  taxPercentage: {
    type: Number,
    default: 18,
    min: [0, 'Tax percentage cannot be negative'],
    max: [100, 'Tax percentage cannot exceed 100']
  },
  
  // ====================
  // AUTOMATION & DYNAMIC PRICING
  // ====================
  automationSettings: {
    demandFactor: {
      type: Number,
      default: 1.0,
      min: [0.5, 'Demand factor cannot be below 0.5'],
      max: [2.0, 'Demand factor cannot exceed 2.0']
    },
    seasonalAdjustment: {
      type: Number,
      default: 0,
      min: [0, 'Seasonal adjustment cannot be negative'],
      max: [50, 'Seasonal adjustment cannot exceed 50%']
    },
    dynamicPricing: {
      type: Boolean,
      default: false
    },
    priceUpdateFrequency: {
      type: String,
      enum: ['manual', 'weekly', 'monthly', 'quarterly', 'real-time'],
      default: 'manual'
    },
    minPrice: Number,
    maxPrice: Number,
    demandMultiplier: Number,
    seasonalMultiplier: Number,
    competitorTracking: Boolean
  },
  
  // ====================
  // ADDONS & CUSTOMIZATION
  // ====================
  availableAddons: [{
    addonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Addon',
      required: true
    },
    name: String,
    description: String,
    price: Number,
    currency: String,
    billingCycle: String,
    isRequired: Boolean,
    isRecommended: Boolean,
    sortOrder: Number
  }],
  
  customizableFeatures: [{
    featureId: String,
    name: String,
    description: String,
    tiers: [{
      id: String,
      name: String,
      description: String,
      price: Number,
      isDefault: Boolean
    }]
  }],
  
  // ====================
  // POLICIES & TERMS
  // ====================
  limitationsList: [{
    type: String
  }],
  
  slaGuarantee: {
    type: Number,
    min: [90, 'SLA cannot be below 90%'],
    max: [100, 'SLA cannot exceed 100%']
  },
  
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict', 'none'],
    default: 'flexible'
  },
  
  contractTerm: {
    type: String,
    enum: ['month-to-month', 'annual', 'quarterly', 'custom', 'lifetime'],
    default: 'month-to-month'
  },
  
  refundPolicy: {
    type: String,
    enum: ['full_refund', 'partial_refund', 'no_refund', 'prorated'],
    default: 'prorated'
  },
  
  // ====================
  // HISTORY & TRACKING
  // ====================
  priceHistory: [{
    oldPrice: Number,
    newPrice: Number,
    currency: String,
    changedAt: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    effectiveFrom: Date,
    automationTriggered: Boolean
  }],
  
  featureHistory: [{
    operation: {
      type: String,
      enum: ['added', 'removed', 'modified']
    },
    features: [String],
    changedAt: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    previousFeatures: [String],
    notes: String
  }],
  
  statusHistory: [{
    from: Boolean,
    to: Boolean,
    changedAt: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String
  }],
  
  // ====================
  // USAGE STATISTICS
  // ====================
  subscriptionCount: {
    type: Number,
    default: 0
  },
  
  activeSubscriptionCount: {
    type: Number,
    default: 0
  },
  
  totalRevenue: {
    type: Number,
    default: 0
  },
  
  monthlyRecurringRevenue: {
    type: Number,
    default: 0
  },
  
  conversionRate: {
    type: Number,
    default: 0
  },
  
  // ====================
  // SUPPORT & DOCUMENTATION
  // ====================
  faqs: [{
    question: String,
    answer: String,
    category: String
  }],
  
  documentationUrl: String,
  
  supportEmail: String,
  
  supportPhone: String,
  
  // ====================
  // METADATA & AUDIT
  // ====================
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  archivedAt: Date,
  
  metadata: {
    version: {
      type: String,
      default: '1.0.0'
    },
    createdVia: {
      type: String,
      enum: ['manual', 'import', 'api', 'migration'],
      default: 'manual'
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastUpdatedAt: Date,
    priceUpdateReason: String,
    initialConfiguration: Object,
    notes: String,
    tags: [String],
    integrations: [String]
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.metadata;
      return ret;
    }
  },
  toObject: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// ====================
// INDEXES
// ====================
planSchema.index({ slug: 1 }, { unique: true });
planSchema.index({ name: 1 });
planSchema.index({ category: 1, tier: 1 });
planSchema.index({ isActive: 1, isArchived: 1 });
planSchema.index({ isPopular: -1 });
planSchema.index({ isFeatured: -1 });
planSchema.index({ currentPrice: 1 });
planSchema.index({ createdBy: 1 });
planSchema.index({ createdAt: -1 });
planSchema.index({ displayOrder: 1 });
planSchema.index({ priority: -1 });
planSchema.index({ 'automationSettings.dynamicPricing': 1 });

// ====================
// VIRTUALS
// ====================
planSchema.virtual('hasActiveSubscriptions').get(function() {
  return this.activeSubscriptionCount > 0;
});

planSchema.virtual('monthlyEquivalent').get(function() {
  if (this.period === 'month') return this.currentPrice;
  if (this.period === 'year') return this.currentPrice / 12;
  if (this.period === 'quarter') return this.currentPrice / 3;
  if (this.period === 'week') return this.currentPrice * 4.33;
  if (this.period === 'lifetime') return this.currentPrice / 60; // Assuming 5 years lifetime
  return this.currentPrice;
});

planSchema.virtual('yearlyEquivalent').get(function() {
  if (this.period === 'month') return this.currentPrice * 12;
  if (this.period === 'year') return this.currentPrice;
  if (this.period === 'quarter') return this.currentPrice * 4;
  if (this.period === 'week') return this.currentPrice * 52;
  if (this.period === 'lifetime') return this.currentPrice / 5; // Assuming 5 years lifetime
  return this.currentPrice;
});

planSchema.virtual('yearlySavings').get(function() {
  if (this.period === 'year') {
    const monthlyEquivalent = this.basePrice * 12;
    return monthlyEquivalent - this.currentPrice;
  }
  return 0;
});

planSchema.virtual('savingsPercentage').get(function() {
  if (this.period === 'year') {
    const monthlyEquivalent = this.basePrice * 12;
    if (monthlyEquivalent === 0) return 0;
    return ((monthlyEquivalent - this.currentPrice) / monthlyEquivalent * 100).toFixed(1);
  }
  return 0;
});

planSchema.virtual('displayPrice').get(function() {
  if (this.period === 'month') return `${this.currency} ${this.currentPrice}/month`;
  if (this.period === 'year') return `${this.currency} ${this.currentPrice}/year`;
  if (this.period === 'quarter') return `${this.currency} ${this.currentPrice}/quarter`;
  if (this.period === 'week') return `${this.currency} ${this.currentPrice}/week`;
  if (this.period === 'lifetime') return `${this.currency} ${this.currentPrice} (One-time)`;
  return `${this.currency} ${this.currentPrice}`;
});

planSchema.virtual('trialAvailable').get(function() {
  return this.trialDays > 0;
});

planSchema.virtual('pricePerUserPerMonth').get(function() {
  const monthlyPrice = this.monthlyEquivalent;
  const maxUsers = this.limitations?.maxUsers || this.maxUsers || 1;
  return maxUsers > 0 ? monthlyPrice / maxUsers : monthlyPrice;
});

// ====================
// METHODS
// ====================
planSchema.methods.incrementSubscriptionCount = async function() {
  this.subscriptionCount += 1;
  this.activeSubscriptionCount += 1;
  await this.save();
};

planSchema.methods.decrementSubscriptionCount = async function() {
  if (this.activeSubscriptionCount > 0) {
    this.activeSubscriptionCount -= 1;
    await this.save();
  }
};

planSchema.methods.addRevenue = async function(amount) {
  this.totalRevenue += amount;
  this.monthlyRecurringRevenue = this.monthlyEquivalent * this.activeSubscriptionCount;
  await this.save();
};

planSchema.methods.updateConversionRate = async function(totalVisits) {
  if (totalVisits > 0) {
    this.conversionRate = (this.subscriptionCount / totalVisits) * 100;
    await this.save();
  }
};

planSchema.methods.addToPriceHistory = async function(oldPrice, newPrice, changedBy, reason = '') {
  this.priceHistory.push({
    oldPrice,
    newPrice,
    currency: this.currency,
    changedAt: new Date(),
    changedBy,
    reason,
    effectiveFrom: new Date()
  });
  
  // Keep only last 10 price changes
  if (this.priceHistory.length > 10) {
    this.priceHistory = this.priceHistory.slice(-10);
  }
  
  await this.save();
};

planSchema.methods.archive = async function(archivedBy, reason = '') {
  this.isActive = false;
  this.isArchived = true;
  this.archivedBy = archivedBy;
  this.archivedAt = new Date();
  
  this.statusHistory.push({
    from: true,
    to: false,
    changedAt: new Date(),
    changedBy: archivedBy,
    reason
  });
  
  await this.save();
};

planSchema.methods.activate = async function(activatedBy, reason = '') {
  this.isActive = true;
  this.isArchived = false;
  this.updatedBy = activatedBy;
  
  this.statusHistory.push({
    from: false,
    to: true,
    changedAt: new Date(),
    changedBy: activatedBy,
    reason
  });
  
  await this.save();
};

// ====================
// STATIC METHODS
// ====================
planSchema.statics.getActivePlans = function() {
  return this.find({ 
    isActive: true, 
    isArchived: false 
  })
    .sort({ displayOrder: 1, category: 1, tier: 1 })
    .select('name slug description currentPrice period category isPopular isFeatured trialDays')
    .lean();
};

planSchema.statics.getPopularPlans = function(limit = 3) {
  return this.find({ 
    isActive: true, 
    isArchived: false,
    isPopular: true 
  })
    .sort({ displayOrder: 1, priority: -1 })
    .limit(limit)
    .select('name slug tagline currentPrice period category features')
    .lean();
};

planSchema.statics.getByCategory = function(category) {
  return this.find({ 
    category, 
    isActive: true, 
    isArchived: false 
  })
    .sort({ tier: 1, displayOrder: 1 })
    .populate('createdBy', 'name email')
    .lean();
};

planSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug })
    .populate('createdBy', 'name email')
    .populate('availableAddons.addonId', 'name description price')
    .lean();
};

planSchema.statics.getPriceStats = async function() {
  const stats = await this.aggregate([
    {
      $match: {
        isActive: true,
        isArchived: false
      }
    },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$currentPrice' },
        maxPrice: { $max: '$currentPrice' },
        avgPrice: { $avg: '$currentPrice' },
        totalPlans: { $sum: 1 },
        totalRevenue: { $sum: '$totalRevenue' },
        totalSubscriptions: { $sum: '$subscriptionCount' }
      }
    }
  ]);
  
  return stats[0] || {
    minPrice: 0,
    maxPrice: 0,
    avgPrice: 0,
    totalPlans: 0,
    totalRevenue: 0,
    totalSubscriptions: 0
  };
};

// ====================
// PRE-SAVE MIDDLEWARE
// ====================
planSchema.pre('save', function(next) {
  // Ensure current price is not less than base price
  if (this.currentPrice < this.basePrice) {
    this.currentPrice = this.basePrice;
  }
  
  // Ensure slug is generated from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Set default billing cycles if not provided
  if (!this.billingCycles || this.billingCycles.length === 0) {
    this.billingCycles = [this.period];
  }
  
  // Set default billing cycle if not provided
  if (!this.defaultBillingCycle) {
    this.defaultBillingCycle = this.period;
  }
  
  // Calculate monthly recurring revenue
  if (this.isModified('currentPrice') || this.isModified('activeSubscriptionCount')) {
    this.monthlyRecurringRevenue = this.monthlyEquivalent * this.activeSubscriptionCount;
  }
  
  // Set trial availability flag
  if (this.trialDays > 0) {
    this.isTrialAvailable = true;
  }
  
  // Auto-update updatedAt in metadata
  if (this.isModified()) {
    this.metadata.lastUpdatedAt = new Date();
  }
  
  next();
});

planSchema.pre('find', function() {
  this.where({ isArchived: false });
});

// ====================
// QUERY HELPERS
// ====================
planSchema.query.active = function() {
  return this.where({ 
    isActive: true, 
    isArchived: false 
  });
};

planSchema.query.popular = function() {
  return this.where({ 
    isPopular: true,
    isActive: true 
  });
};

planSchema.query.featured = function() {
  return this.where({ 
    isFeatured: true,
    isActive: true 
  });
};

planSchema.query.affordable = function(maxPrice) {
  return this.where({ 
    currentPrice: { $lte: maxPrice },
    isActive: true 
  });
};

planSchema.query.byCategory = function(category) {
  return this.where({ 
    category,
    isActive: true 
  });
};

planSchema.query.withTrial = function() {
  return this.where({ 
    trialDays: { $gt: 0 },
    isActive: true 
  });
};

// ====================
// MODEL EXPORT
// ====================
const Plan = mongoose.model('Plan', planSchema);
export default Plan;