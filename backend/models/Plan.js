const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    minlength: [2, 'Plan name must be at least 2 characters'],
    maxlength: [100, 'Plan name cannot exceed 100 characters']
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
  
  // Pricing Information
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
  
  period: {
    type: String,
    enum: ['month', 'year', 'quarter', 'week'],
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
  
  billingCycleDiscounts: {
    year: { type: Number, min: 0, max: 100 },
    quarter: { type: Number, min: 0, max: 100 },
    week: { type: Number, min: 0, max: 100 }
  },
  
  // Features & Specifications
  features: [{
    type: String,
    required: true
  }],
  
  category: {
    type: String,
    enum: ['starter', 'growth', 'enterprise', 'custom', 'legacy'],
    default: 'starter'
  },
  
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
  
  // Usage Limits
  trialDays: {
    type: Number,
    default: 0,
    min: [0, 'Trial days cannot be negative'],
    max: [365, 'Trial cannot exceed 365 days']
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
    enum: ['email', 'priority', '24/7', 'dedicated'],
    default: 'email'
  },
  
  // Financial
  taxPercentage: {
    type: Number,
    default: 18,
    min: [0, 'Tax percentage cannot be negative'],
    max: [100, 'Tax percentage cannot exceed 100']
  },
  
  setupFee: {
    type: Number,
    default: 0,
    min: [0, 'Setup fee cannot be negative']
  },
  
  // Automation & Dynamic Pricing
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
      enum: ['manual', 'weekly', 'monthly', 'quarterly'],
      default: 'manual'
    }
  },
  
  // Addons & Customization
  availableAddons: [{
    addonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Addon',
      required: true
    },
    name: String,
    description: String,
    price: Number,
    isRequired: Boolean,
    isRecommended: Boolean
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
  
  // Limitations & Restrictions
  limitations: [{
    type: String,
    default: []
  }],
  
  slaGuarantee: {
    type: Number,
    min: [90, 'SLA cannot be below 90%'],
    max: [100, 'SLA cannot exceed 100%']
  },
  
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'flexible'
  },
  
  contractTerm: {
    type: String,
    enum: ['month-to-month', 'annual', 'custom'],
    default: 'month-to-month'
  },
  
  // History & Tracking
  priceHistory: [{
    oldPrice: Number,
    newPrice: Number,
    changedAt: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    effectiveFrom: Date
  }],
  
  featureHistory: [{
    operation: String,
    features: [String],
    changedAt: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    previousFeatures: [String]
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
  
  // Usage Statistics
  subscriptionCount: {
    type: Number,
    default: 0
  },
  
  totalRevenue: {
    type: Number,
    default: 0
  },
  
  // FAQs
  faqs: [{
    question: String,
    answer: String,
    category: String
  }],
  
  // Metadata
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
  
  metadata: {
    version: String,
    createdVia: String,
    lastUpdatedBy: mongoose.Schema.Types.ObjectId,
    lastUpdatedAt: Date,
    priceUpdateReason: String,
    initialConfiguration: Object,
    notes: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
planSchema.index({ slug: 1 }, { unique: true });
planSchema.index({ name: 1 });
planSchema.index({ category: 1 });
planSchema.index({ isActive: 1 });
planSchema.index({ isPopular: -1 });
planSchema.index({ isFeatured: -1 });
planSchema.index({ currentPrice: 1 });
planSchema.index({ createdBy: 1 });
planSchema.index({ createdAt: -1 });

// Virtuals
planSchema.virtual('hasActiveSubscriptions').get(function() {
  return this.subscriptionCount > 0;
});

planSchema.virtual('monthlyEquivalent').get(function() {
  if (this.period === 'month') return this.currentPrice;
  if (this.period === 'year') return this.currentPrice / 12;
  if (this.period === 'quarter') return this.currentPrice / 3;
  if (this.period === 'week') return this.currentPrice * 4.33;
  return this.currentPrice;
});

planSchema.virtual('yearlySavings').get(function() {
  if (this.period === 'year') {
    return this.basePrice * 12 - this.currentPrice;
  }
  return 0;
});

planSchema.virtual('savingsPercentage').get(function() {
  if (this.period === 'year') {
    return ((this.basePrice * 12 - this.currentPrice) / (this.basePrice * 12) * 100).toFixed(1);
  }
  return 0;
});

// Methods
planSchema.methods.incrementSubscriptionCount = async function() {
  this.subscriptionCount += 1;
  await this.save();
};

planSchema.methods.addRevenue = async function(amount) {
  this.totalRevenue += amount;
  await this.save();
};

// Pre-save middleware
planSchema.pre('save', function(next) {
  // Ensure current price is not less than base price
  if (this.currentPrice < this.basePrice) {
    this.currentPrice = this.basePrice;
  }
  
  // Ensure slug is generated from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  
  next();
});

module.exports = mongoose.model('Plan', planSchema);