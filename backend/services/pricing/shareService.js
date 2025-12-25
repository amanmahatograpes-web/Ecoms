const Share = require('../models/Share.model');
const Plan = require('../models/Plan.model');
const QRCode = require('qrcode');
const logger = require('../utils/logger');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

class ShareService {
  constructor() {
    this.parser = new UAParser();
  }

  /**
   * Track a share action
   */
  async trackShare(shareData) {
    try {
      const {
        planId,
        platform,
        shareType = 'link',
        userId,
        userDetails,
        shareUrl,
        shareMessage,
        customMessage,
        metadata = {},
        sessionId,
        request
      } = shareData;

      // Get plan details
      const plan = await Plan.findById(planId).lean();
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Parse user agent
      let userAgentData = {};
      if (request && request.headers['user-agent']) {
        this.parser.setUA(request.headers['user-agent']);
        userAgentData = this.parser.getResult();
      }

      // Get location from IP
      let locationData = {};
      const ip = this.getClientIP(request);
      if (ip) {
        const geo = geoip.lookup(ip);
        if (geo) {
          locationData = {
            ipAddress: ip,
            country: geo.country,
            region: geo.region,
            city: geo.city,
            latitude: geo.ll[0],
            longitude: geo.ll[1]
          };
        }
      }

      // Parse referral data from URL
      const referralData = this.parseReferralData(shareUrl);

      // Create share record
      const share = new Share({
        plan: planId,
        planName: plan.name,
        platform,
        shareType,
        userId,
        userDetails,
        shareUrl,
        shareMessage,
        customMessage,
        metadata: {
          ...metadata,
          device: userAgentData.device?.model || 'Unknown',
          browser: userAgentData.browser?.name || 'Unknown',
          os: userAgentData.os?.name || 'Unknown',
          screenResolution: metadata.screenResolution,
          language: request?.headers['accept-language'] || 'en'
        },
        location: locationData,
        referral: referralData,
        sessionId,
        timestamp: new Date()
      });

      await share.save();

      logger.info(`Tracked share: ${platform} for plan ${plan.name}`);

      // Update plan share statistics
      await this.updatePlanShareStats(planId);

      return {
        success: true,
        shareId: share._id,
        share
      };

    } catch (error) {
      logger.error('Error tracking share:', error);
      throw error;
    }
  }

  /**
   * Generate QR code for sharing
   */
  async generateQRCode(data, options = {}) {
    try {
      const {
        size = 200,
        margin = 1,
        color = { dark: '#000000', light: '#ffffff' },
        format = 'png'
      } = options;

      const qrData = await QRCode.toDataURL(data, {
        width: size,
        margin,
        color,
        type: 'image/png'
      });

      return {
        success: true,
        qrCode: qrData,
        data,
        size,
        format: 'png'
      };

    } catch (error) {
      logger.error('Error generating QR code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get share analytics
   */
  async getShareAnalytics(options = {}) {
    try {
      const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate = new Date(),
        planId,
        platform,
        groupBy = 'day'
      } = options;

      const matchStage = {
        timestamp: { $gte: startDate, $lte: endDate }
      };

      if (planId) {
        matchStage.plan = planId;
      }

      if (platform) {
        matchStage.platform = platform;
      }

      // Group by time period
      let dateFormat;
      switch (groupBy) {
        case 'hour':
          dateFormat = '%Y-%m-%d %H:00';
          break;
        case 'day':
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          dateFormat = '%Y-%U';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default:
          dateFormat = '%Y-%m-%d';
      }

      const analytics = await Share.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              $dateToString: { format: dateFormat, date: "$timestamp" }
            },
            totalShares: { $sum: 1 },
            uniqueUsers: { $addToSet: "$userId" },
            platforms: { $addToSet: "$platform" },
            views: {
              $sum: { $cond: ["$conversion.viewed", 1, 0] }
            },
            conversions: {
              $sum: { $cond: ["$conversion.converted", 1, 0] }
            },
            totalRevenue: {
              $sum: "$conversion.revenue"
            },
            byPlatform: {
              $push: {
                platform: "$platform",
                viewed: { $cond: ["$conversion.viewed", 1, 0] },
                converted: { $cond: ["$conversion.converted", 1, 0] }
              }
            }
          }
        },
        {
          $project: {
            date: "$_id",
            totalShares: 1,
            uniqueUsers: { $size: "$uniqueUsers" },
            platformCount: { $size: "$platforms" },
            views: 1,
            conversions: 1,
            viewRate: {
              $cond: [
                { $eq: ["$totalShares", 0] },
                0,
                { $divide: ["$views", "$totalShares"] }
              ]
            },
            conversionRate: {
              $cond: [
                { $eq: ["$views", 0] },
                0,
                { $divide: ["$conversions", "$views"] }
              ]
            },
            totalRevenue: 1,
            avgRevenuePerConversion: {
              $cond: [
                { $eq: ["$conversions", 0] },
                0,
                { $divide: ["$totalRevenue", "$conversions"] }
              ]
            },
            byPlatform: {
              $reduce: {
                input: "$byPlatform",
                initialValue: [],
                in: {
                  $concatArrays: [
                    "$$value",
                    [
                      {
                        platform: "$$this.platform",
                        shares: 1,
                        views: "$$this.viewed",
                        conversions: "$$this.converted"
                      }
                    ]
                  ]
                }
              }
            },
            _id: 0
          }
        },
        { $sort: { date: 1 } }
      ]);

      // Aggregate platform data
      const platformStats = await Share.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$platform",
            totalShares: { $sum: 1 },
            uniqueUsers: { $addToSet: "$userId" },
            views: {
              $sum: { $cond: ["$conversion.viewed", 1, 0] }
            },
            conversions: {
              $sum: { $cond: ["$conversion.converted", 1, 0] }
            },
            totalRevenue: {
              $sum: "$conversion.revenue"
            }
          }
        },
        {
          $project: {
            platform: "$_id",
            totalShares: 1,
            uniqueUsers: { $size: "$uniqueUsers" },
            views: 1,
            conversions: 1,
            viewRate: {
              $cond: [
                { $eq: ["$totalShares", 0] },
                0,
                { $divide: ["$views", "$totalShares"] }
              ]
            },
            conversionRate: {
              $cond: [
                { $eq: ["$views", 0] },
                0,
                { $divide: ["$conversions", "$views"] }
              ]
            },
            totalRevenue: 1,
            avgRevenuePerConversion: {
              $cond: [
                { $eq: ["$conversions", 0] },
                0,
                { $divide: ["$totalRevenue", "$conversions"] }
              ]
            },
            _id: 0
          }
        },
        { $sort: { totalShares: -1 } }
      ]);

      // Get top performing plans
      const planStats = await Share.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$plan",
            planName: { $first: "$planName" },
            totalShares: { $sum: 1 },
            views: {
              $sum: { $cond: ["$conversion.viewed", 1, 0] }
            },
            conversions: {
              $sum: { $cond: ["$conversion.converted", 1, 0] }
            },
            totalRevenue: {
              $sum: "$conversion.revenue"
            }
          }
        },
        {
          $project: {
            planId: "$_id",
            planName: 1,
            totalShares: 1,
            views: 1,
            conversions: 1,
            viewRate: {
              $cond: [
                { $eq: ["$totalShares", 0] },
                0,
                { $divide: ["$views", "$totalShares"] }
              ]
            },
            conversionRate: {
              $cond: [
                { $eq: ["$views", 0] },
                0,
                { $divide: ["$conversions", "$views"] }
              ]
            },
            totalRevenue: 1,
            avgRevenuePerConversion: {
              $cond: [
                { $eq: ["$conversions", 0] },
                0,
                { $divide: ["$totalRevenue", "$conversions"] }
              ]
            },
            _id: 0
          }
        },
        { $sort: { totalShares: -1 } },
        { $limit: 10 }
      ]);

      // Get geographic distribution
      const geoDistribution = await Share.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$location.country",
            totalShares: { $sum: 1 },
            views: {
              $sum: { $cond: ["$conversion.viewed", 1, 0] }
            },
            conversions: {
              $sum: { $cond: ["$conversion.converted", 1, 0] }
            }
          }
        },
        {
          $project: {
            country: "$_id",
            totalShares: 1,
            views: 1,
            conversions: 1,
            viewRate: {
              $cond: [
                { $eq: ["$totalShares", 0] },
                0,
                { $divide: ["$views", "$totalShares"] }
              ]
            },
            conversionRate: {
              $cond: [
                { $eq: ["$views", 0] },
                0,
                { $divide: ["$conversions", "$views"] }
              ]
            },
            _id: 0
          }
        },
        { $sort: { totalShares: -1 } },
        { $limit: 10 }
      ]);

      // Get recent shares
      const recentShares = await Share.find(matchStage)
        .sort({ timestamp: -1 })
        .limit(20)
        .populate('plan', 'name category')
        .lean();

      return {
        period: { startDate, endDate },
        summary: {
          totalShares: analytics.reduce((sum, a) => sum + a.totalShares, 0),
          uniqueUsers: analytics.reduce((sum, a) => sum + a.uniqueUsers, 0),
          totalViews: analytics.reduce((sum, a) => sum + a.views, 0),
          totalConversions: analytics.reduce((sum, a) => sum + a.conversions, 0),
          totalRevenue: analytics.reduce((sum, a) => sum + a.totalRevenue, 0),
          overallViewRate: analytics.length > 0 ? 
            analytics.reduce((sum, a) => sum + a.views, 0) / 
            analytics.reduce((sum, a) => sum + a.totalShares, 0) : 0,
          overallConversionRate: analytics.reduce((sum, a) => sum + a.views, 0) > 0 ?
            analytics.reduce((sum, a) => sum + a.conversions, 0) / 
            analytics.reduce((sum, a) => sum + a.views, 0) : 0
        },
        timeSeries: analytics,
        platformStats,
        planStats,
        geoDistribution,
        recentShares
      };

    } catch (error) {
      logger.error('Error getting share analytics:', error);
      throw error;
    }
  }

  /**
   * Mark a shared link as viewed
   */
  async markAsViewed(shareId, request) {
    try {
      const share = await Share.findById(shareId);
      
      if (!share) {
        throw new Error('Share record not found');
      }
      
      if (!share.conversion.viewed) {
        share.conversion.viewed = true;
        share.conversion.viewedAt = new Date();
        
        // Update location if not already set
        if (!share.location.ipAddress && request) {
          const ip = this.getClientIP(request);
          if (ip) {
            const geo = geoip.lookup(ip);
            if (geo) {
              share.location = {
                ipAddress: ip,
                country: geo.country,
                region: geo.region,
                city: geo.city,
                latitude: geo.ll[0],
                longitude: geo.ll[1]
              };
            }
          }
        }
        
        await share.save();
        
        logger.info(`Marked share ${shareId} as viewed`);
      }
      
      return {
        success: true,
        shareId,
        viewed: true
      };
      
    } catch (error) {
      logger.error('Error marking share as viewed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mark a share as converted (purchase)
   */
  async markAsConverted(shareId, revenue = 0) {
    try {
      const share = await Share.findById(shareId);
      
      if (!share) {
        throw new Error('Share record not found');
      }
      
      share.conversion.converted = true;
      share.conversion.convertedAt = new Date();
      share.conversion.revenue = revenue;
      
      await share.save();
      
      logger.info(`Marked share ${shareId} as converted with revenue: ${revenue}`);
      
      // Update plan conversion statistics
      await this.updatePlanConversionStats(share.plan, revenue);
      
      return {
        success: true,
        shareId,
        converted: true,
        revenue
      };
      
    } catch (error) {
      logger.error('Error marking share as converted:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get share statistics for a specific plan
   */
  async getPlanShareStats(planId) {
    try {
      const plan = await Plan.findById(planId);
      if (!plan) {
        throw new Error('Plan not found');
      }
      
      const stats = await Share.getPlanShareStats(planId);
      
      // Get recent shares for this plan
      const recentShares = await Share.find({ plan: planId })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean();
      
      // Get conversion funnel
      const funnel = await Share.aggregate([
        { $match: { plan: planId } },
        {
          $group: {
            _id: null,
            totalShares: { $sum: 1 },
            views: {
              $sum: { $cond: ["$conversion.viewed", 1, 0] }
            },
            conversions: {
              $sum: { $cond: ["$conversion.converted", 1, 0] }
            },
            totalRevenue: {
              $sum: "$conversion.revenue"
            }
          }
        }
      ]);
      
      return {
        plan: {
          id: plan._id,
          name: plan.name,
          category: plan.category
        },
        platformStats: stats,
        funnel: funnel[0] || {
          totalShares: 0,
          views: 0,
          conversions: 0,
          totalRevenue: 0
        },
        recentShares,
        summary: {
          viewRate: funnel[0] ? (funnel[0].views / funnel[0].totalShares) * 100 : 0,
          conversionRate: funnel[0] && funnel[0].views > 0 ? 
            (funnel[0].conversions / funnel[0].views) * 100 : 0,
          avgRevenuePerConversion: funnel[0] && funnel[0].conversions > 0 ?
            funnel[0].totalRevenue / funnel[0].conversions : 0
        }
      };
      
    } catch (error) {
      logger.error('Error getting plan share stats:', error);
      throw error;
    }
  }

  /**
   * Generate share URLs for different platforms
   */
  generateShareUrls(plan, baseUrl, options = {}) {
    const {
      includeTax = true,
      annualDiscount = 20,
      couponCode = null
    } = options;
    
    const planUrl = `${baseUrl}/pricing/${plan.slug || plan._id}`;
    const price = plan.currentPrice || plan.basePrice;
    const priceWithTax = price + (price * plan.taxPercentage / 100);
    const displayPrice = includeTax ? priceWithTax : price;
    
    const message = `Check out ${plan.name} plan at ₹${Math.round(displayPrice)}/month! ${plan.description}`;
    const hashtags = ['Pricing', 'India', 'SaaS', 'Business'];
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${message} ${planUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(planUrl)}&quote=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(planUrl)}&hashtags=${hashtags.join(',')}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(planUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(`${plan.name} Pricing Plan`)}&body=${encodeURIComponent(`${message}\n\n${planUrl}`)}`,
      copy: planUrl
    };
    
    return urls;
  }

  /**
   * Update plan share statistics
   */
  async updatePlanShareStats(planId) {
    try {
      const shareCount = await Share.countDocuments({ plan: planId });
      
      await Plan.findByIdAndUpdate(planId, {
        $set: {
          'metadata.shareCount': shareCount,
          'metadata.lastShareUpdate': new Date()
        }
      });
      
    } catch (error) {
      logger.error('Error updating plan share stats:', error);
    }
  }

  /**
   * Update plan conversion statistics
   */
  async updatePlanConversionStats(planId, revenue) {
    try {
      const conversionStats = await Share.aggregate([
        { $match: { plan: planId, 'conversion.converted': true } },
        {
          $group: {
            _id: null,
            totalConversions: { $sum: 1 },
            totalRevenue: { $sum: "$conversion.revenue" },
            avgRevenue: { $avg: "$conversion.revenue" }
          }
        }
      ]);
      
      const stats = conversionStats[0] || {
        totalConversions: 0,
        totalRevenue: 0,
        avgRevenue: 0
      };
      
      await Plan.findByIdAndUpdate(planId, {
        $set: {
          'metadata.conversionStats': stats,
          'metadata.lastConversionUpdate': new Date()
        }
      });
      
    } catch (error) {
      logger.error('Error updating plan conversion stats:', error);
    }
  }

  /**
   * Get client IP from request
   */
  getClientIP(request) {
    if (!request) return null;
    
    return request.headers['x-forwarded-for']?.split(',')[0] || 
           request.connection?.remoteAddress || 
           request.socket?.remoteAddress ||
           request.connection?.socket?.remoteAddress;
  }

  /**
   * Parse referral data from URL
   */
  parseReferralData(url) {
    try {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;
      
      return {
        source: params.get('utm_source'),
        campaign: params.get('utm_campaign'),
        medium: params.get('utm_medium'),
        term: params.get('utm_term'),
        content: params.get('utm_content')
      };
    } catch (error) {
      return {};
    }
  }
}

module.exports = new ShareService();