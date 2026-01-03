import mongoose from 'mongoose';
import constants from '../config/constants.js';

const shareAnalyticsSchema = new mongoose.Schema({
  // Plan Information
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
    required: true
  },
  price: {
    type: Number,
    min: 0
  },

  // Platform & Share Information
  platform: {
    type: String,
    required: true,
    enum: Object.values(constants?.SOCIAL_PLATFORMS || {
      WHATSAPP: 'whatsapp',
      FACEBOOK: 'facebook',
      TWITTER: 'twitter',
      INSTAGRAM: 'instagram',
      LINKEDIN: 'linkedin',
      EMAIL: 'email',
      COPY: 'copy',
      QR: 'qr',
      TELEGRAM: 'telegram'
    }),
    index: true
  },
  shareType: {
    type: String,
    enum: Object.values(constants?.SHARE_TYPES || {
      DIRECT: 'direct',
      PUBLIC: 'public',
      GROUP: 'group',
      CHANNEL: 'channel',
      STORY: 'story',
      REEL: 'reel'
    }),
    default: 'direct',
    index: true
  },

  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  userName: String,
  userEmail: String,

  // Recipient Information
  recipient: {
    type: {
      type: String,
      enum: ['email', 'phone', 'user_id', 'anonymous']
    },
    value: String,
    name: String,
    platformUserId: String
  },

  // Share Content
  shareContent: {
    message: String,
    url: String,
    shortenedUrl: String,
    qrCodeUrl: String,
    mediaUrls: [String],
    hashtags: [String],
    mentions: [String],
    customMessage: Boolean,
    characterCount: Number
  },

  // Location & Device Information
  location: {
    country: String,
    city: String,
    state: String,
    region: String,
    ipAddress: String,
    latitude: Number,
    longitude: Number,
    timezone: String
  },
  
  deviceInfo: {
    userAgent: String,
    browser: String,
    os: String,
    device: String,
    isMobile: Boolean,
    isTablet: Boolean,
    isDesktop: Boolean
  },

  // Tracking Information
  referralSource: String,
  utmParameters: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  },

  // Platform-Specific Data
  platformData: {
    // WhatsApp
    whatsapp: {
      messageId: String,
      conversationId: String,
      recipientPhone: String,
      templateUsed: String,
      isBusinessMessage: Boolean
    },
    
    // Facebook
    facebook: {
      postId: String,
      pageId: String,
      groupId: String,
      isPublished: Boolean,
      privacy: String,
      tags: [String]
    },
    
    // Twitter
    twitter: {
      tweetId: String,
      replyToTweetId: String,
      quotedTweetId: String,
      hashtags: [String],
      mentions: [String],
      mediaIds: [String]
    },
    
    // Instagram
    instagram: {
      mediaId: String,
      caption: String,
      locationId: String,
      isStory: Boolean,
      isReel: Boolean,
      hashtags: [String],
      mentions: [String]
    },
    
    // LinkedIn
    linkedin: {
      postId: String,
      companyId: String,
      visibility: String,
      isSponsored: Boolean
    },
    
    // Email
    email: {
      messageId: String,
      subject: String,
      recipientCount: Number,
      openRate: Number,
      clickRate: Number
    },
    
    // Telegram
    telegram: {
      messageId: String,
      chatId: String,
      isChannel: Boolean,
      isGroup: Boolean
    },

    // Copy to clipboard
    copy: {
      copiedAt: Date,
      clipboardType: String
    },

    // QR Code
    qr: {
      scannedAt: Date,
      scannerApp: String
    }
  },

  // Engagement Metrics
  engagement: {
    clicks: {
      type: Number,
      default: 0
    },
    uniqueClicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    reactions: {
      type: Number,
      default: 0
    },
    saves: {
      type: Number,
      default: 0
    },
    impressions: {
      type: Number,
      default: 0
    },
    reach: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    
    // Platform-specific engagements
    whatsapp: {
      delivered: Boolean,
      deliveredAt: Date,
      read: Boolean,
      readAt: Date,
      replied: Boolean,
      forwarded: Number
    },
    
    email: {
      opened: Boolean,
      openedAt: Date,
      clickedLinks: [String],
      clickedAt: Date,
      bounced: Boolean,
      spamReported: Boolean
    }
  },

  // Conversion Tracking
  conversions: [{
    type: {
      type: String,
      enum: ['signup', 'trial', 'purchase', 'contact', 'download', 'lead']
    },
    value: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    conversionId: mongoose.Schema.Types.ObjectId,
    convertedAt: Date,
    attributionModel: String,
    attributionWeight: {
      type: Number,
      min: 0,
      max: 1,
      default: 1.0
    },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Cost & Revenue
  cost: {
    adSpend: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    cpc: Number,
    cpm: Number,
    ctr: Number
  },

  revenue: {
    attributedRevenue: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    roi: Number,
    ltv: Number
  },

  // Status & Timing
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'converted', 'failed', 'cancelled', 'scheduled'],
    default: 'pending',
    index: true
  },
  sentAt: Date,
  deliveredAt: Date,
  openedAt: Date,
  clickedAt: Date,
  convertedAt: Date,
  failedAt: Date,
  failureReason: String,
  scheduledFor: Date,
  
  // Expiry for pending shares
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    index: true
  },

  // Performance Metrics
  performance: {
    clickThroughRate: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    engagementRate: {
      type: Number,
      default: 0
    },
    shareRate: {
      type: Number,
      default: 0
    },
    roi: {
      type: Number,
      default: 0
    },
    costPerConversion: {
      type: Number,
      default: 0
    },
    revenuePerClick: {
      type: Number,
      default: 0
    },
    performanceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },

  // A/B Testing
  abTest: {
    variant: String,
    testId: String,
    controlGroup: Boolean,
    winningVariant: Boolean
  },

  // Metadata
  metadata: {
    campaignId: String,
    campaignName: String,
    adSetId: String,
    creativeId: String,
    trackingId: String,
    sessionId: String,
    browserSessionId: String,
    additionalData: mongoose.Schema.Types.Mixed
  },

  // Privacy & Compliance
  privacy: {
    gdprCompliant: {
      type: Boolean,
      default: true
    },
    consentGiven: Boolean,
    dataRetentionDays: {
      type: Number,
      default: 365
    },
    anonymized: Boolean,
    dataProcessingLocation: String
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

// ========================
// VIRTUALS
// ========================

shareAnalyticsSchema.virtual('engagementRate').get(function() {
  if (!this.engagement?.impressions || this.engagement.impressions === 0) return 0;
  const totalEngagement = (this.engagement.likes || 0) + 
                         (this.engagement.comments || 0) + 
                         (this.engagement.shares || 0) + 
                         (this.engagement.reactions || 0);
  return (totalEngagement / this.engagement.impressions) * 100;
});

shareAnalyticsSchema.virtual('conversionRate').get(function() {
  if (!this.engagement?.clicks || this.engagement.clicks === 0) return 0;
  return ((this.engagement.conversions || 0) / this.engagement.clicks) * 100;
});

shareAnalyticsSchema.virtual('clickThroughRate').get(function() {
  if (!this.engagement?.impressions || this.engagement.impressions === 0) return 0;
  return ((this.engagement.clicks || 0) / this.engagement.impressions) * 100;
});

shareAnalyticsSchema.virtual('roiValue').get(function() {
  const revenue = this.revenue?.attributedRevenue || 0;
  const cost = this.cost?.adSpend || 0;
  
  if (cost === 0) {
    return revenue > 0 ? Infinity : 0;
  }
  
  return ((revenue - cost) / cost) * 100;
});

shareAnalyticsSchema.virtual('isSuccessful').get(function() {
  return ['sent', 'delivered', 'opened', 'clicked', 'converted'].includes(this.status);
});

shareAnalyticsSchema.virtual('isActive').get(function() {
  return ['pending', 'scheduled', 'sent'].includes(this.status);
});

shareAnalyticsSchema.virtual('timeToConversion').get(function() {
  if (!this.convertedAt || !this.sentAt) return null;
  return this.convertedAt - this.sentAt;
});

shareAnalyticsSchema.virtual('timeToClick').get(function() {
  if (!this.clickedAt || !this.sentAt) return null;
  return this.clickedAt - this.sentAt;
});

shareAnalyticsSchema.virtual('timeToOpen').get(function() {
  if (!this.openedAt || !this.sentAt) return null;
  return this.openedAt - this.sentAt;
});

// ========================
// INDEXES
// ========================

shareAnalyticsSchema.index({ platform: 1, createdAt: -1 });
shareAnalyticsSchema.index({ planId: 1, createdAt: -1 });
shareAnalyticsSchema.index({ userId: 1, createdAt: -1 });
shareAnalyticsSchema.index({ status: 1, createdAt: -1 });
shareAnalyticsSchema.index({ 'location.country': 1, createdAt: -1 });
shareAnalyticsSchema.index({ 'engagement.clicks': -1 });
shareAnalyticsSchema.index({ 'performance.performanceScore': -1 });
shareAnalytics.index({ planId: 1, platform: 1, createdAt: -1 });
shareAnalyticsSchema.index({ 'recipient.value': 1 });
shareAnalyticsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// ========================
// PRE-SAVE MIDDLEWARE
// ========================

shareAnalyticsSchema.pre('save', function(next) {
  // Calculate performance metrics
  if (this.engagement) {
    this.performance = {
      clickThroughRate: this.clickThroughRate,
      conversionRate: this.conversionRate,
      engagementRate: this.engagementRate,
      shareRate: this.engagement.shares > 0 ? 
        ((this.engagement.clicks || 0) / this.engagement.shares) * 100 : 0,
      roi: this.roiValue,
      costPerConversion: this.cost?.adSpend && (this.engagement.conversions || 0) > 0 ?
        this.cost.adSpend / this.engagement.conversions : 0,
      revenuePerClick: this.revenue?.attributedRevenue && (this.engagement.clicks || 0) > 0 ?
        this.revenue.attributedRevenue / this.engagement.clicks : 0,
      performanceScore: this.getPerformanceScore()
    };
  }

  // Update status timestamps
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'sent':
        if (!this.sentAt) this.sentAt = now;
        break;
      case 'delivered':
        if (!this.deliveredAt) this.deliveredAt = now;
        break;
      case 'opened':
        if (!this.openedAt) this.openedAt = now;
        break;
      case 'clicked':
        if (!this.clickedAt) this.clickedAt = now;
        break;
      case 'converted':
        if (!this.convertedAt) this.convertedAt = now;
        break;
      case 'failed':
        if (!this.failedAt) this.failedAt = now;
        break;
    }
  }

  // Set default revenue currency if not set
  if (this.revenue && !this.revenue.currency) {
    this.revenue.currency = 'INR';
  }

  // Set default cost currency if not set
  if (this.cost && !this.cost.currency) {
    this.cost.currency = 'INR';
  }

  next();
});

// ========================
// INSTANCE METHODS
// ========================

shareAnalyticsSchema.methods.trackClick = function(clickData = {}) {
  this.engagement.clicks = (this.engagement.clicks || 0) + 1;
  
  if (clickData.isUnique) {
    this.engagement.uniqueClicks = (this.engagement.uniqueClicks || 0) + 1;
  }
  
  if (clickData.referrer) {
    this.referralSource = clickData.referrer;
  }
  
  if (!this.clickedAt) {
    this.clickedAt = new Date();
  }
  
  this.status = 'clicked';
  this.markModified('engagement');
};

shareAnalyticsSchema.methods.trackConversion = function(conversionData) {
  const conversion = {
    type: conversionData.type || 'purchase',
    value: conversionData.value || 0,
    currency: conversionData.currency || 'INR',
    conversionId: conversionData.conversionId,
    convertedAt: new Date(),
    attributionModel: conversionData.attributionModel || 'last_click',
    attributionWeight: conversionData.attributionWeight || 1.0,
    metadata: conversionData.metadata || {}
  };
  
  this.conversions.push(conversion);
  this.engagement.conversions = (this.engagement.conversions || 0) + 1;
  
  // Update revenue
  if (conversion.value > 0) {
    this.revenue.attributedRevenue = (this.revenue.attributedRevenue || 0) + conversion.value;
    this.revenue.currency = conversion.currency;
  }
  
  if (!this.convertedAt) {
    this.convertedAt = new Date();
  }
  
  this.status = 'converted';
  this.markModified('conversions');
  this.markModified('engagement');
  this.markModified('revenue');
};

shareAnalyticsSchema.methods.trackEngagement = function(engagementType, count = 1) {
  const engagementMap = {
    'like': 'likes',
    'comment': 'comments',
    'share': 'shares',
    'reaction': 'reactions',
    'save': 'saves',
    'impression': 'impressions',
    'view': 'views',
    'reach': 'reach'
  };
  
  const field = engagementMap[engagementType];
  if (field && this.engagement[field] !== undefined) {
    this.engagement[field] = (this.engagement[field] || 0) + count;
    this.markModified('engagement');
  }
};

shareAnalyticsSchema.methods.updatePlatformData = function(platform, data) {
  if (!this.platformData) {
    this.platformData = {};
  }
  
  if (!this.platformData[platform]) {
    this.platformData[platform] = {};
  }
  
  this.platformData[platform] = {
    ...this.platformData[platform],
    ...data
  };
  
  this.markModified('platformData');
};

shareAnalyticsSchema.methods.getPerformanceScore = function() {
  let score = 0;
  
  // Click score (max 25)
  const ctr = this.clickThroughRate || 0;
  score += Math.min(ctr * 0.5, 25);
  
  // Engagement score (max 25)
  const engagementRate = this.engagementRate || 0;
  score += Math.min(engagementRate * 2, 25);
  
  // Conversion score (max 25)
  const conversionRate = this.conversionRate || 0;
  score += Math.min(conversionRate * 10, 25);
  
  // ROI score (max 25)
  const roi = this.roiValue || 0;
  if (roi > 0) {
    score += Math.min(roi * 0.1, 25);
  }
  
  // Bonus for quick conversions
  const timeToConversion = this.timeToConversion;
  if (timeToConversion && timeToConversion < 3600000) { // Within 1 hour
    score += 5;
  }
  
  return Math.min(Math.round(score), 100);
};

shareAnalyticsSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.failureReason = reason;
};

shareAnalyticsSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
};

shareAnalyticsSchema.methods.markAsOpened = function() {
  this.status = 'opened';
  this.openedAt = new Date();
};

// ========================
// STATIC METHODS
// ========================

shareAnalyticsSchema.statics.findByPlan = function(planId, options = {}) {
  const {
    platform = null,
    startDate = null,
    endDate = null,
    limit = 50,
    page = 1,
    status = null
  } = options;
  
  const query = { planId };
  
  if (platform) query.platform = platform;
  if (status) query.status = status;
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  
  const skip = (page - 1) * limit;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'name email')
    .populate('planId', 'name slug currentPrice')
    .lean();
};

shareAnalyticsSchema.statics.getPlatformStats = async function(options = {}) {
  // ... [Keep the same aggregation as in your second schema, but with ES6 export]
};

shareAnalyticsSchema.statics.getTopPerformers = async function(limit = 10, timeframe = '7d') {
  // ... [Keep the same aggregation as in your second schema]
};

shareAnalyticsSchema.statics.getUserShareStats = async function(userId) {
  // ... [Keep the same aggregation as in your second schema]
};

shareAnalyticsSchema.statics.getRecentShares = async function(limit = 20) {
  return this.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email avatar')
    .populate('planId', 'name slug')
    .lean();
};

shareAnalyticsSchema.statics.getSummaryStats = async function() {
  const [
    totalShares,
    successfulShares,
    totalClicks,
    totalConversions,
    totalRevenue,
    byPlatform
  ] = await Promise.all([
    this.countDocuments(),
    this.countDocuments({ status: { $in: ['sent', 'delivered', 'opened', 'clicked', 'converted'] } }),
    this.aggregate([{ $group: { _id: null, total: { $sum: '$engagement.clicks' } } }]),
    this.aggregate([{ $group: { _id: null, total: { $sum: '$engagement.conversions' } } }]),
    this.aggregate([{ $group: { _id: null, total: { $sum: '$revenue.attributedRevenue' } } }]),
    this.aggregate([
      { $group: {
        _id: '$platform',
        count: { $sum: 1 },
        clicks: { $sum: '$engagement.clicks' },
        conversions: { $sum: '$engagement.conversions' },
        revenue: { $sum: '$revenue.attributedRevenue' }
      }},
      { $sort: { count: -1 } }
    ])
  ]);

  return {
    totalShares: totalShares || 0,
    successfulShares: successfulShares || 0,
    successRate: totalShares > 0 ? (successfulShares / totalShares) * 100 : 0,
    totalClicks: totalClicks[0]?.total || 0,
    totalConversions: totalConversions[0]?.total || 0,
    conversionRate: totalClicks[0]?.total > 0 ? 
      (totalConversions[0]?.total / totalClicks[0]?.total) * 100 : 0,
    totalRevenue: totalRevenue[0]?.total || 0,
    byPlatform: byPlatform || []
  };
};

// ========================
// QUERY HELPERS
// ========================

shareAnalyticsSchema.query.successful = function() {
  return this.where({ 
    status: { $in: ['sent', 'delivered', 'opened', 'clicked', 'converted'] } 
  });
};

shareAnalyticsSchema.query.failed = function() {
  return this.where({ status: 'failed' });
};

shareAnalyticsSchema.query.pending = function() {
  return this.where({ status: 'pending' });
};

shareAnalyticsSchema.query.byPlatform = function(platform) {
  return this.where({ platform });
};

shareAnalyticsSchema.query.byPlan = function(planId) {
  return this.where({ planId });
};

shareAnalyticsSchema.query.byUser = function(userId) {
  return this.where({ userId });
};

shareAnalyticsSchema.query.recent = function(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return this.where({ createdAt: { $gte: date } });
};

// ========================
// MODEL EXPORT
// ========================

const ShareAnalytics = mongoose.model('ShareAnalytics', shareAnalyticsSchema);
export default ShareAnalytics;