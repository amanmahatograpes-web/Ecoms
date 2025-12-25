const mongoose = require('mongoose');
const constants = require('../config/constants');

const shareAnalyticsSchema = new mongoose.Schema({
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
    required: true
  },
  
  // Platform Information
  platform: {
    type: String,
    required: true,
    enum: Object.values(constants.SOCIAL_PLATFORMS),
    index: true
  },
  shareType: {
    type: String,
    enum: Object.values(constants.SHARE_TYPES),
    default: 'direct',
    index: true
  },
  
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  userEmail: String,
  userName: String,
  
  // Recipient Information (for direct shares)
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
  
  // User Context
  userContext: {
    ipAddress: String,
    userAgent: String,
    device: {
      type: String,
      os: String,
      browser: String,
      isMobile: Boolean,
      isTablet: Boolean,
      isDesktop: Boolean
    },
    location: {
      country: String,
      region: String,
      city: String,
      latitude: Number,
      longitude: Number,
      timezone: String
    },
    referrer: String,
    utmParameters: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    }
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
    
    // Platform-specific engagements
    whatsapp: {
      delivered: Boolean,
      read: Boolean,
      replied: Boolean,
      forwarded: Number
    },
    
    email: {
      opened: Boolean,
      openedAt: Date,
      clickedLinks: [String],
      bounced: Boolean,
      spamReported: Boolean
    }
  },
  
  // Conversion Tracking
  conversions: [{
    type: {
      type: String,
      enum: ['signup', 'trial', 'purchase', 'contact', 'download']
    },
    value: Number,
    currency: String,
    conversionId: mongoose.Schema.Types.ObjectId,
    convertedAt: Date,
    attributionModel: String,
    attributionWeight: Number
  }],
  
  // Cost & Revenue
  cost: {
    adSpend: Number,
    currency: String,
    cpc: Number,
    cpm: Number,
    ctr: Number
  },
  
  revenue: {
    attributedRevenue: Number,
    currency: String,
    roi: Number,
    ltv: Number
  },
  
  // Status & Timing
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'cancelled', 'scheduled'],
    default: 'pending',
    index: true
  },
  sentAt: Date,
  deliveredAt: Date,
  failedAt: Date,
  failureReason: String,
  scheduledFor: Date,
  
  // Performance Metrics
  performance: {
    clickThroughRate: Number,
    conversionRate: Number,
    engagementRate: Number,
    shareRate: Number,
    roi: Number,
    costPerConversion: Number,
    revenuePerClick: Number
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
    browserSessionId: String
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
    anonymized: Boolean
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
shareAnalyticsSchema.virtual('engagementRate').get(function() {
  if (this.engagement.impressions === 0) return 0;
  const totalEngagement = this.engagement.likes + this.engagement.comments + this.engagement.shares;
  return (totalEngagement / this.engagement.impressions) * 100;
});

shareAnalyticsSchema.virtual('conversionRate').get(function() {
  if (this.engagement.clicks === 0) return 0;
  return (this.engagement.conversions / this.engagement.clicks) * 100;
});

shareAnalyticsSchema.virtual('clickThroughRate').get(function() {
  if (this.engagement.impressions === 0) return 0;
  return (this.engagement.clicks / this.engagement.impressions) * 100;
});

shareAnalyticsSchema.virtual('roi').get(function() {
  if (!this.cost.adSpend || this.cost.adSpend === 0) return 0;
  if (!this.revenue.attributedRevenue) return 0;
  return ((this.revenue.attributedRevenue - this.cost.adSpend) / this.cost.adSpend) * 100;
});

shareAnalyticsSchema.virtual('isSuccessful').get(function() {
  return this.status === 'sent' || this.status === 'delivered';
});

shareAnalyticsSchema.virtual('timeToConversion').get(function() {
  if (!this.conversions || this.conversions.length === 0) return null;
  
  const firstConversion = this.conversions.sort((a, b) => 
    new Date(a.convertedAt) - new Date(b.convertedAt)
  )[0];
  
  if (!firstConversion || !this.sentAt) return null;
  
  return new Date(firstConversion.convertedAt) - new Date(this.sentAt);
});

// Indexes
shareAnalyticsSchema.index({ planId: 1, platform: 1, createdAt: -1 });
shareAnalyticsSchema.index({ userId: 1, createdAt: -1 });
shareAnalyticsSchema.index({ platform: 1, status: 1 });
shareAnalyticsSchema.index({ 'userContext.location.country': 1 });
shareAnalyticsSchema.index({ 'engagement.conversions': 1 });
shareAnalyticsSchema.index({ createdAt: -1 });
shareAnalyticsSchema.index({ 'metadata.campaignId': 1 });
shareAnalyticsSchema.index({ 'recipient.value': 1 });
shareAnalyticsSchema.index({ 'platformData.whatsapp.messageId': 1 });
shareAnalyticsSchema.index({ 'platformData.facebook.postId': 1 });
shareAnalyticsSchema.index({ 'platformData.twitter.tweetId': 1 });

// Middleware
shareAnalyticsSchema.pre('save', function(next) {
  // Calculate performance metrics
  if (this.engagement) {
    this.performance = {
      clickThroughRate: this.clickThroughRate,
      conversionRate: this.conversionRate,
      engagementRate: this.engagementRate,
      shareRate: this.engagement.shares > 0 ? 
        (this.engagement.clicks / this.engagement.shares) * 100 : 0,
      roi: this.roi,
      costPerConversion: this.cost.adSpend && this.engagement.conversions > 0 ?
        this.cost.adSpend / this.engagement.conversions : 0,
      revenuePerClick: this.revenue.attributedRevenue && this.engagement.clicks > 0 ?
        this.revenue.attributedRevenue / this.engagement.clicks : 0
    };
  }
  
  // Update status timestamps
  if (this.isModified('status')) {
    const now = new Date();
    
    if (this.status === 'sent' && !this.sentAt) {
      this.sentAt = now;
    } else if (this.status === 'delivered' && !this.deliveredAt) {
      this.deliveredAt = now;
    } else if (this.status === 'failed' && !this.failedAt) {
      this.failedAt = now;
    }
  }
  
  next();
});

// Methods
shareAnalyticsSchema.methods.trackClick = function(clickData = {}) {
  this.engagement.clicks += 1;
  
  if (clickData.isUnique) {
    this.engagement.uniqueClicks += 1;
  }
  
  if (clickData.referrer) {
    this.userContext.referrer = clickData.referrer;
  }
  
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
    attributionWeight: conversionData.attributionWeight || 1.0
  };
  
  this.conversions.push(conversion);
  this.engagement.conversions += 1;
  
  // Update revenue
  if (conversion.value > 0) {
    this.revenue.attributedRevenue = (this.revenue.attributedRevenue || 0) + conversion.value;
    this.revenue.currency = conversion.currency;
  }
  
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
    'impression': 'impressions'
  };
  
  const field = engagementMap[engagementType];
  if (field && this.engagement[field] !== undefined) {
    this.engagement[field] += count;
    this.markModified('engagement');
  }
};

shareAnalyticsSchema.methods.updatePlatformData = function(platform, data) {
  if (this.platformData[platform]) {
    this.platformData[platform] = {
      ...this.platformData[platform],
      ...data
    };
    this.markModified('platformData');
  }
};

shareAnalyticsSchema.methods.getPerformanceScore = function() {
  let score = 0;
  
  // Click score
  if (this.performance.clickThroughRate > 0) {
    score += Math.min(this.performance.clickThroughRate * 0.5, 25);
  }
  
  // Engagement score
  if (this.performance.engagementRate > 0) {
    score += Math.min(this.performance.engagementRate * 2, 25);
  }
  
  // Conversion score
  if (this.performance.conversionRate > 0) {
    score += Math.min(this.performance.conversionRate * 10, 25);
  }
  
  // ROI score
  if (this.performance.roi > 0) {
    score += Math.min(this.performance.roi * 0.1, 25);
  }
  
  return Math.round(score);
};

// Static methods
shareAnalyticsSchema.statics.findByPlan = function(planId, options = {}) {
  const {
    platform = null,
    startDate = null,
    endDate = null,
    limit = 50,
    page = 1
  } = options;
  
  const query = { planId };
  
  if (platform) {
    query.platform = platform;
  }
  
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
  const {
    planId = null,
    startDate = null,
    endDate = null
  } = options;
  
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
        _id: '$platform',
        totalShares: { $sum: 1 },
        successfulShares: {
          $sum: { $cond: [{ $in: ['$status', ['sent', 'delivered']] }, 1, 0] }
        },
        totalClicks: { $sum: '$engagement.clicks' },
        totalConversions: { $sum: '$engagement.conversions' },
        totalRevenue: { $sum: '$revenue.attributedRevenue' },
        totalCost: { $sum: '$cost.adSpend' },
        avgClickThroughRate: { $avg: '$performance.clickThroughRate' },
        avgConversionRate: { $avg: '$performance.conversionRate' },
        avgEngagementRate: { $avg: '$performance.engagementRate' },
        sharesByType: {
          $push: {
            type: '$shareType',
            count: 1
          }
        },
        byDay: {
          $push: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            shares: 1,
            clicks: '$engagement.clicks',
            conversions: '$engagement.conversions'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        platform: '$_id',
        totalShares: 1,
        successfulShares: 1,
        successRate: {
          $cond: [
            { $gt: ['$totalShares', 0] },
            { $multiply: [{ $divide: ['$successfulShares', '$totalShares'] }, 100] },
            0
          ]
        },
        totalClicks: 1,
        totalConversions: 1,
        totalRevenue: 1,
        totalCost: 1,
        totalProfit: { $subtract: ['$totalRevenue', '$totalCost'] },
        roi: {
          $cond: [
            { $gt: ['$totalCost', 0] },
            { $multiply: [{ $divide: [{ $subtract: ['$totalRevenue', '$totalCost'] }, '$totalCost'] }, 100] },
            0
          ]
        },
        avgClickThroughRate: { $round: ['$avgClickThroughRate', 2] },
        avgConversionRate: { $round: ['$avgConversionRate', 2] },
        avgEngagementRate: { $round: ['$avgEngagementRate', 2] },
        shareTypeBreakdown: {
          $arrayToObject: {
            $map: {
              input: '$sharesByType',
              as: 'item',
              in: {
                k: '$$item.type',
                v: { $sum: '$$item.count' }
              }
            }
          }
        },
        dailyTrend: {
          $arrayToObject: {
            $map: {
              input: '$byDay',
              as: 'item',
              in: {
                k: '$$item.day',
                v: {
                  shares: { $sum: '$$item.shares' },
                  clicks: { $sum: '$$item.clicks' },
                  conversions: { $sum: '$$item.conversions' }
                }
              }
            }
          }
        }
      }
    },
    {
      $sort: { totalShares: -1 }
    }
  ]);
  
  // Calculate overall totals
  const overall = {
    totalShares: 0,
    successfulShares: 0,
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    totalCost: 0
  };
  
  stats.forEach(stat => {
    overall.totalShares += stat.totalShares;
    overall.successfulShares += stat.successfulShares;
    overall.totalClicks += stat.totalClicks;
    overall.totalConversions += stat.totalConversions;
    overall.totalRevenue += stat.totalRevenue || 0;
    overall.totalCost += stat.totalCost || 0;
  });
  
  overall.successRate = overall.totalShares > 0 ? 
    (overall.successfulShares / overall.totalShares) * 100 : 0;
  overall.totalProfit = overall.totalRevenue - overall.totalCost;
  overall.roi = overall.totalCost > 0 ? 
    (overall.totalProfit / overall.totalCost) * 100 : 0;
  
  return {
    platforms: stats,
    overall,
    timeframe: {
      startDate: startDate || 'all time',
      endDate: endDate || 'present'
    }
  };
};

shareAnalyticsSchema.statics.getTopPerformers = async function(limit = 10, timeframe = '7d') {
  let startDate;
  const now = new Date();
  
  switch (timeframe) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = null;
  }
  
  const match = {};
  if (startDate) {
    match.createdAt = { $gte: startDate };
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          planId: '$planId',
          platform: '$platform'
        },
        planName: { $first: '$planName' },
        totalShares: { $sum: 1 },
        totalClicks: { $sum: '$engagement.clicks' },
        totalConversions: { $sum: '$engagement.conversions' },
        totalRevenue: { $sum: '$revenue.attributedRevenue' },
        avgPerformanceScore: { $avg: { $toDouble: '$performanceScore' } }
      }
    },
    {
      $project: {
        _id: 0,
        planId: '$_id.planId',
        planName: 1,
        platform: '$_id.platform',
        totalShares: 1,
        totalClicks: 1,
        totalConversions: 1,
        totalRevenue: 1,
        clickThroughRate: {
          $cond: [
            { $gt: ['$totalShares', 0] },
            { $multiply: [{ $divide: ['$totalClicks', '$totalShares'] }, 100] },
            0
          ]
        },
        conversionRate: {
          $cond: [
            { $gt: ['$totalClicks', 0] },
            { $multiply: [{ $divide: ['$totalConversions', '$totalClicks'] }, 100] },
            0
          ]
        },
        avgPerformanceScore: { $round: ['$avgPerformanceScore', 2] }
      }
    },
    {
      $sort: { totalConversions: -1, totalClicks: -1 }
    },
    { $limit: limit }
  ]);
};

shareAnalyticsSchema.statics.getUserShareStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalShares: { $sum: 1 },
        sharesByPlatform: {
          $push: {
            platform: '$platform',
            count: 1
          }
        },
        sharesByPlan: {
          $push: {
            planId: '$planId',
            planName: '$planName',
            count: 1
          }
        },
        totalClicks: { $sum: '$engagement.clicks' },
        totalConversions: { $sum: '$engagement.conversions' },
        totalRevenue: { $sum: '$revenue.attributedRevenue' },
        bestPerformingShare: {
          $max: {
            performanceScore: { 
              $cond: [
                { $ifNull: ['$performanceScore', false] },
                '$performanceScore',
                0
              ]
            },
            shareId: '$_id',
            planName: '$planName',
            platform: '$platform'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalShares: 1,
        platformBreakdown: {
          $arrayToObject: {
            $map: {
              input: '$sharesByPlatform',
              as: 'item',
              in: {
                k: '$$item.platform',
                v: { $sum: '$$item.count' }
              }
            }
          }
        },
        planBreakdown: {
          $arrayToObject: {
            $map: {
              input: '$sharesByPlan',
              as: 'item',
              in: {
                k: '$$item.planName',
                v: {
                  planId: '$$item.planId',
                  shares: { $sum: '$$item.count' }
                }
              }
            }
          }
        },
        totalClicks: 1,
        totalConversions: 1,
        totalRevenue: 1,
        conversionRate: {
          $cond: [
            { $gt: ['$totalClicks', 0] },
            { $multiply: [{ $divide: ['$totalConversions', '$totalClicks'] }, 100] },
            0
          ]
        },
        bestPerformingShare: 1,
        estimatedCommission: {
          $multiply: ['$totalRevenue', 0.1] // 10% commission rate
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalShares: 0,
    platformBreakdown: {},
    planBreakdown: {},
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    conversionRate: 0,
    estimatedCommission: 0
  };
};

module.exports = mongoose.model('ShareAnalytics', shareAnalyticsSchema);