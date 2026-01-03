import mongoose from 'mongoose';

const pricingDataSchema = new mongoose.Schema({
  // Reference to inventory/product
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  // Basic pricing info
  sku: {
    type: String,
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true
  },

  // Price fields
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  listPrice: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  recommendedPrice: {
    type: Number,
    min: 0
  },

  // Profit calculations
  profitMargin: {
    type: Number,
    default: 0
  },
  profitAmount: {
    type: Number,
    default: 0
  },
  roi: {
    type: Number,
    default: 0
  },

  // FBA fees and costs
  fbaFees: {
    referralFee: { type: Number, default: 0 },
    fulfillmentFee: { type: Number, default: 0 },
    storageFee: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 }
  },

  // Competitor data
  competitorCount: {
    type: Number,
    default: 0
  },
  lowestCompetitorPrice: {
    type: Number,
    min: 0
  },
  averageCompetitorPrice: {
    type: Number,
    min: 0
  },
  highestCompetitorPrice: {
    type: Number,
    min: 0
  },
  priceDifference: {
    type: Number,
    default: 0
  },
  isBuyBoxWinner: {
    type: Boolean,
    default: false
  },

  // Pricing status
  pricingStatus: {
    type: String,
    enum: ['competitive', 'high', 'low', 'no_competition'],
    default: 'no_competition'
  },

  // Auto-pricing settings
  autoPricingEnabled: {
    type: Boolean,
    default: false
  },
  autoPricingRules: {
    minMargin: { type: Number, default: 10 },
    maxMargin: { type: Number, default: 50 },
    targetPosition: { type: String, enum: ['lowest', 'average', 'buybox'], default: 'buybox' },
    undercutAmount: { type: Number, default: 0.01 },
    maxPriceIncrease: { type: Number, default: 10 }
  },

  // Category and metadata
  category: {
    type: String,
    index: true
  },
  brand: String,

  // Analytics
  salesVolume: {
    type: Number,
    default: 0
  },
  salesTrend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable'
  },

  // Last updated
  lastCompetitorUpdate: {
    type: Date,
    default: Date.now
  },
  lastPriceUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
pricingDataSchema.index({ sku: 1 });
pricingDataSchema.index({ pricingStatus: 1 });
pricingDataSchema.index({ autoPricingEnabled: 1 });
pricingDataSchema.index({ category: 1 });
pricingDataSchema.index({ profitMargin: 1 });
pricingDataSchema.index({ updatedAt: -1 });

// Virtual for competitiveness percentage
pricingDataSchema.virtual('competitiveness').get(function() {
  if (!this.lowestCompetitorPrice || this.lowestCompetitorPrice === 0) return 0;
  return ((this.listPrice - this.lowestCompetitorPrice) / this.lowestCompetitorPrice) * 100;
});

// Pre-save middleware to calculate profit metrics
pricingDataSchema.pre('save', function(next) {
  // Calculate profit margin
  if (this.listPrice > 0 && this.costPrice > 0) {
    this.profitAmount = this.listPrice - this.costPrice - this.fbaFees.totalFees;
    this.profitMargin = (this.profitAmount / this.listPrice) * 100;
    this.roi = this.costPrice > 0 ? (this.profitAmount / this.costPrice) * 100 : 0;
  }

  // Calculate price difference
  if (this.lowestCompetitorPrice > 0) {
    this.priceDifference = ((this.listPrice - this.lowestCompetitorPrice) / this.lowestCompetitorPrice) * 100;
  }

  // Determine pricing status
  if (this.competitorCount === 0) {
    this.pricingStatus = 'no_competition';
  } else if (this.priceDifference <= 5) {
    this.pricingStatus = 'competitive';
  } else if (this.priceDifference > 10) {
    this.pricingStatus = 'high';
  } else {
    this.pricingStatus = 'low';
  }

  next();
});

export default mongoose.model('PricingData', pricingDataSchema);