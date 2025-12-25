const PricingPlan = require('../models/PricingPlan');
const PriceHistory = require('../models/PriceHistory');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const axios = require('axios');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const constants = require('../config/constants');
const { sendEmail } = require('./notificationService');

class PricingService {
  constructor() {
    this.updateQueue = new Map(); // For batching updates
    this.competitorSources = {
      'competitor1': 'https://api.competitor1.com/prices',
      'competitor2': 'https://api.competitor2.com/pricing',
      'competitor3': 'https://api.competitor3.com/plans'
    };
  }

  /**
   * Calculate automated price for a plan
   */
  async calculateAutomatedPrice(planId, marketData = {}) {
    try {
      const plan = await PricingPlan.findById(planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      if (!plan.automationSettings.enabled) {
        return {
          success: true,
          currentPrice: plan.currentPrice,
          automatedPrice: plan.currentPrice,
          noChange: true,
          message: 'Automation is disabled for this plan'
        };
      }

      // Get cached price if available
      const cacheKey = `price:${planId}:${JSON.stringify(marketData)}`;
      const cachedPrice = await redis.get(cacheKey);
      
      if (cachedPrice) {
        return {
          success: true,
          currentPrice: plan.currentPrice,
          automatedPrice: cachedPrice,
          fromCache: true
        };
      }

      // Calculate new price
      const automatedPrice = plan.getAutomatedPrice(marketData);

      // Apply boundaries
      let finalPrice = automatedPrice;
      
      if (plan.automationSettings.minPrice) {
        finalPrice = Math.max(finalPrice, plan.automationSettings.minPrice);
      }
      
      if (plan.automationSettings.maxPrice) {
        finalPrice = Math.min(finalPrice, plan.automationSettings.maxPrice);
      }

      // Round to appropriate increment
      finalPrice = this.roundToIncrement(finalPrice, plan.currency);

      // Check if price actually changed
      const priceChanged = Math.abs(finalPrice - plan.currentPrice) > 0.01;

      // Cache the calculated price for 5 minutes
      await redis.set(cacheKey, finalPrice, 300);

      return {
        success: true,
        currentPrice: plan.currentPrice,
        automatedPrice: finalPrice,
        priceChanged,
        changeAmount: finalPrice - plan.currentPrice,
        changePercentage: ((finalPrice - plan.currentPrice) / plan.currentPrice) * 100
      };

    } catch (error) {
      logger.error(`Price calculation error for plan ${planId}:`, error);
      throw error;
    }
  }

  /**
   * Update plan price with automation
   */
  async updatePlanPrice(planId, userId = null, forceUpdate = false) {
    try {
      const plan = await PricingPlan.findById(planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Get current market conditions
      const marketConditions = await this.getMarketConditions();
      
      // Calculate new price
      const calculation = await this.calculateAutomatedPrice(planId, {
        ...plan.marketConditions,
        ...marketConditions
      });

      if (!calculation.priceChanged && !forceUpdate) {
        return {
          success: true,
          noChange: true,
          message: 'Price unchanged',
          data: plan
        };
      }

      const oldPrice = plan.currentPrice;
      const newPrice = calculation.automatedPrice;

      // Update plan price
      plan.currentPrice = newPrice;
      plan.marketConditions = {
        ...plan.marketConditions,
        ...marketConditions,
        lastUpdated: new Date()
      };

      await plan.save();

      // Log price change
      await this.logPriceChange({
        planId: plan._id,
        planName: plan.name,
        planSlug: plan.slug,
        oldPrice,
        newPrice,
        currency: plan.currency,
        reason: 'automation',
        automationFactors: {
          demandFactor: plan.automationSettings.demandFactor,
          seasonalAdjustment: plan.automationSettings.seasonalAdjustment,
          profitMargin: plan.automationSettings.profitMargin,
          competitorPrice: plan.marketConditions.competitorPrice,
          marketConditions
        },
        createdBy: userId
      });

      // Clear relevant cache
      await this.clearPriceCache(planId);

      // Notify subscribers if price changed significantly
      if (Math.abs(calculation.changePercentage) > 5) {
        await this.notifyPriceChange(plan, oldPrice, newPrice, calculation.changePercentage);
      }

      // Emit real-time update
      this.emitPriceUpdate(plan, oldPrice, newPrice);

      return {
        success: true,
        message: 'Price updated successfully',
        data: plan,
        change: {
          oldPrice,
          newPrice,
          changeAmount: calculation.changeAmount,
          changePercentage: calculation.changePercentage
        }
      };

    } catch (error) {
      logger.error(`Price update error for plan ${planId}:`, error);
      throw error;
    }
  }

  /**
   * Apply coupon to a plan
   */
  async applyCoupon(planId, couponCode, userId = null) {
    try {
      const plan = await PricingPlan.findById(planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Check coupon validity
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase(),
        isActive: true 
      });

      if (!coupon) {
        throw new Error('Invalid coupon code');
      }

      // Get user for validation
      let user = null;
      if (userId) {
        user = await User.findById(userId);
      }

      // Validate coupon applicability
      const validation = coupon.canBeApplied(user, plan, plan.currentPrice);
      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      // Calculate discount
      const discountResult = coupon.calculateDiscount(plan.currentPrice);

      // Record coupon usage
      coupon.recordUsage(userId);
      coupon.performance.totalDiscountGiven += discountResult.discountAmount;
      coupon.performance.totalOrders += 1;
      await coupon.save();

      // Log price change with coupon details
      await this.logPriceChange({
        planId: plan._id,
        planName: plan.name,
        planSlug: plan.slug,
        oldPrice: plan.currentPrice,
        newPrice: discountResult.finalAmount,
        currency: plan.currency,
        reason: 'coupon_applied',
        couponDetails: {
          code: coupon.code,
          discount: coupon.discountValue,
          discountType: coupon.discountType,
          appliedBy: userId
        },
        createdBy: userId
      });

      return {
        success: true,
        message: 'Coupon applied successfully',
        originalPrice: plan.currentPrice,
        discountedPrice: discountResult.finalAmount,
        discountAmount: discountResult.discountAmount,
        discountPercentage: discountResult.discountPercentage,
        coupon: {
          code: coupon.code,
          name: coupon.name,
          type: coupon.discountType
        }
      };

    } catch (error) {
      logger.error(`Coupon application error:`, error);
      throw error;
    }
  }

  /**
   * Sync competitor prices
   */
  async syncCompetitorPrices() {
    try {
      logger.info('Starting competitor price sync...');

      const updates = [];
      const errors = [];

      // Fetch from multiple competitor sources
      for (const [sourceName, apiUrl] of Object.entries(this.competitorSources)) {
        try {
          const response = await axios.get(apiUrl, {
            timeout: 10000,
            headers: {
              'User-Agent': 'PricingAutomation/1.0'
            }
          });

          const competitorData = this.parseCompetitorData(sourceName, response.data);

          for (const data of competitorData) {
            try {
              // Find matching plan
              const plan = await PricingPlan.findOne({
                name: { $regex: new RegExp(data.planName, 'i') },
                category: data.category,
                isActive: true
              });

              if (plan && plan.automationSettings.competitorTracking) {
                // Update competitor price
                plan.marketConditions.competitorPrice = data.price;
                plan.marketConditions.competitorData = plan.marketConditions.competitorData || [];
                
                // Add or update competitor entry
                const existingIndex = plan.marketConditions.competitorData.findIndex(
                  c => c.name === sourceName
                );
                
                if (existingIndex >= 0) {
                  plan.marketConditions.competitorData[existingIndex] = {
                    name: sourceName,
                    price: data.price,
                    currency: data.currency,
                    url: data.url,
                    lastUpdated: new Date()
                  };
                } else {
                  plan.marketConditions.competitorData.push({
                    name: sourceName,
                    price: data.price,
                    currency: data.currency,
                    url: data.url,
                    lastUpdated: new Date()
                  });
                }

                await plan.save();
                updates.push({
                  plan: plan.name,
                  competitor: sourceName,
                  price: data.price,
                  currency: data.currency
                });

                logger.info(`Updated competitor price for ${plan.name} from ${sourceName}: ${data.price} ${data.currency}`);
              }
            } catch (planError) {
              errors.push({
                source: sourceName,
                plan: data.planName,
                error: planError.message
              });
            }
          }
        } catch (apiError) {
          errors.push({
            source: sourceName,
            error: apiError.message
          });
          logger.error(`Failed to fetch from ${sourceName}:`, apiError.message);
        }
      }

      // Update cache
      await redis.set('competitor:lastSynced', new Date().toISOString(), 3600);

      return {
        success: true,
        updates,
        errors,
        totalUpdates: updates.length,
        totalErrors: errors.length
      };

    } catch (error) {
      logger.error('Competitor sync failed:', error);
      throw error;
    }
  }

  /**
   * Get price history for a plan
   */
  async getPriceHistory(planId, options = {}) {
    try {
      const {
        limit = 50,
        page = 1,
        startDate = null,
        endDate = null,
        reason = null,
        changeType = null
      } = options;

      const cacheKey = `history:${planId}:${JSON.stringify(options)}`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      const query = { planId };

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      if (reason) {
        query.reason = reason;
      }

      if (changeType) {
        query.changeType = changeType;
      }

      const skip = (page - 1) * limit;
      const total = await PriceHistory.countDocuments(query);

      const history = await PriceHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .populate('manualAdjustment.userId', 'name email')
        .lean();

      const result = {
        success: true,
        data: history,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };

      // Cache for 5 minutes
      await redis.set(cacheKey, JSON.stringify(result), 300);

      return result;

    } catch (error) {
      logger.error(`Error fetching price history for plan ${planId}:`, error);
      throw error;
    }
  }

  /**
   * Get pricing statistics
   */
  async getPricingStats(timeframe = '30d') {
    try {
      const cacheKey = `stats:pricing:${timeframe}`;
      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

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
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      // Get plan statistics
      const planStats = await PricingPlan.aggregate([
        {
          $match: {
            isActive: true,
            isPublished: true
          }
        },
        {
          $group: {
            _id: null,
            totalPlans: { $sum: 1 },
            avgPrice: { $avg: '$currentPrice' },
            minPrice: { $min: '$currentPrice' },
            maxPrice: { $max: '$currentPrice' },
            totalAutomated: {
              $sum: { $cond: [{ $eq: ['$automationSettings.enabled', true] }, 1, 0] }
            },
            byCategory: {
              $push: {
                category: '$category',
                count: 1,
                avgPrice: '$currentPrice'
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalPlans: 1,
            avgPrice: { $round: ['$avgPrice', 2] },
            minPrice: 1,
            maxPrice: 1,
            totalAutomated: 1,
            automationRate: {
              $cond: [
                { $gt: ['$totalPlans', 0] },
                { $multiply: [{ $divide: ['$totalAutomated', '$totalPlans'] }, 100] },
                0
              ]
            },
            categoryBreakdown: {
              $arrayToObject: {
                $map: {
                  input: '$byCategory',
                  as: 'item',
                  in: {
                    k: '$$item.category',
                    v: {
                      count: { $sum: '$$item.count' },
                      avgPrice: { $avg: '$$item.avgPrice' }
                    }
                  }
                }
              }
            }
          }
        }
      ]);

      // Get price change statistics
      const priceStats = await PriceHistory.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            changeType: { $ne: 'no_change' }
          }
        },
        {
          $group: {
            _id: null,
            totalChanges: { $sum: 1 },
            avgChange: { $avg: '$changePercentage' },
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
            byReason: {
              $push: {
                reason: '$reason',
                count: 1
              }
            },
            byPlan: {
              $push: {
                planId: '$planId',
                planName: '$planName',
                changes: 1,
                avgChange: '$changePercentage'
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalChanges: 1,
            avgChange: { $round: ['$avgChange', 2] },
            maxIncrease: { $round: ['$maxIncrease', 2] },
            maxDecrease: { $round: ['$maxDecrease', 2] },
            reasonBreakdown: {
              $arrayToObject: {
                $map: {
                  input: '$byReason',
                  as: 'item',
                  in: {
                    k: '$$item.reason',
                    v: { $sum: '$$item.count' }
                  }
                }
              }
            },
            topChangingPlans: {
              $slice: [
                {
                  $map: {
                    input: '$byPlan',
                    as: 'item',
                    in: {
                      planId: '$$item.planId',
                      planName: '$$item.planName',
                      changes: { $sum: '$$item.changes' },
                      avgChange: { $avg: '$$item.avgChange' }
                    }
                  }
                },
                5
              ]
            }
          }
        }
      ]);

      // Get competitor statistics
      const competitorStats = await PricingPlan.aggregate([
        {
          $match: {
            'automationSettings.competitorTracking': true,
            'marketConditions.competitorPrice': { $gt: 0 }
          }
        },
        {
          $group: {
            _id: null,
            avgCompetitorPrice: { $avg: '$marketConditions.competitorPrice' },
            avgOurPrice: { $avg: '$currentPrice' },
            totalTracked: { $sum: 1 },
            priceDiffs: {
              $push: {
                diff: { $subtract: ['$currentPrice', '$marketConditions.competitorPrice'] },
                percentage: {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: ['$currentPrice', '$marketConditions.competitorPrice'] },
                        '$marketConditions.competitorPrice'
                      ]
                    },
                    100
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            avgCompetitorPrice: { $round: ['$avgCompetitorPrice', 2] },
            avgOurPrice: { $round: ['$avgOurPrice', 2] },
            totalTracked: 1,
            avgPriceDifference: {
              $round: [
                {
                  $avg: {
                    $map: {
                      input: '$priceDiffs',
                      as: 'diff',
                      in: '$$diff.diff'
                    }
                  }
                },
                2
              ]
            },
            avgPercentageDifference: {
              $round: [
                {
                  $avg: {
                    $map: {
                      input: '$priceDiffs',
                      as: 'diff',
                      in: '$$diff.percentage'
                    }
                  }
                },
                2
              ]
            }
          }
        }
      ]);

      const result = {
        success: true,
        timeframe,
        planStats: planStats[0] || {},
        priceStats: priceStats[0] || {},
        competitorStats: competitorStats[0] || {},
        timestamp: new Date().toISOString()
      };

      // Cache for 10 minutes
      await redis.set(cacheKey, JSON.stringify(result), 600);

      return result;

    } catch (error) {
      logger.error('Error getting pricing stats:', error);
      throw error;
    }
  }

  /**
   * Batch update multiple plans
   */
  async batchUpdatePlans(planIds, userId = null) {
    try {
      const results = [];
      const errors = [];

      for (const planId of planIds) {
        try {
          const result = await this.updatePlanPrice(planId, userId);
          results.push({
            planId,
            success: true,
            data: result
          });
        } catch (error) {
          errors.push({
            planId,
            success: false,
            error: error.message
          });
          logger.error(`Batch update failed for plan ${planId}:`, error);
        }
      }

      return {
        success: true,
        total: planIds.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors
      };

    } catch (error) {
      logger.error('Batch update failed:', error);
      throw error;
    }
  }

  /**
   * Manual price adjustment
   */
  async manualPriceAdjustment(planId, newPrice, userId, notes = '') {
    try {
      const plan = await PricingPlan.findById(planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      const oldPrice = plan.currentPrice;
      plan.currentPrice = newPrice;

      // Disable automation temporarily
      plan.automationSettings.enabled = false;
      plan.automationSettings.manualOverride = true;
      plan.automationSettings.manualOverrideExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await plan.save();

      // Log price change
      await this.logPriceChange({
        planId: plan._id,
        planName: plan.name,
        planSlug: plan.slug,
        oldPrice,
        newPrice,
        currency: plan.currency,
        reason: 'manual_adjustment',
        manualAdjustment: {
          userId,
          notes,
          approvalRequired: false // Would be true in production with approval workflow
        },
        createdBy: userId
      });

      // Clear cache
      await this.clearPriceCache(planId);

      // Notify team about manual adjustment
      await this.notifyManualAdjustment(plan, oldPrice, newPrice, userId, notes);

      return {
        success: true,
        message: 'Price manually adjusted',
        data: plan,
        change: {
          oldPrice,
          newPrice,
          changeAmount: newPrice - oldPrice,
          changePercentage: ((newPrice - oldPrice) / oldPrice) * 100
        }
      };

    } catch (error) {
      logger.error(`Manual price adjustment failed for plan ${planId}:`, error);
      throw error;
    }
  }

  /**
   * Helper Methods
   */

  async logPriceChange(data) {
    try {
      const history = new PriceHistory(data);
      await history.save();
      
      // Update plan's price history count
      await PricingPlan.findByIdAndUpdate(data.planId, {
        $inc: { 'analytics.priceChanges': 1 }
      });

      return history;
    } catch (error) {
      logger.error('Error logging price change:', error);
      // Don't throw error for logging failures
    }
  }

  async getMarketConditions() {
    try {
      // In production, this would fetch from various APIs:
      // - Economic indicators
      // - Seasonal data
      // - Competitor prices
      // - Demand forecasts
      
      // For now, return mock data
      return {
        demand: this.getRandomDemandLevel(),
        season: this.getCurrentSeason(),
        economicIndex: 1.0,
        inflationRate: 0.02,
        marketVolatility: 0.1
      };
    } catch (error) {
      logger.error('Error getting market conditions:', error);
      return {
        demand: 'NORMAL',
        season: 'REGULAR',
        economicIndex: 1.0
      };
    }
  }

  getRandomDemandLevel() {
    const levels = ['LOW', 'NORMAL', 'HIGH', 'VERY_HIGH'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 10 || month <= 1) return 'HOLIDAY'; // Nov-Feb
    if (month >= 2 && month <= 5) return 'REGULAR'; // Mar-Jun
    if (month >= 6 && month <= 9) return 'OFF_PEAK'; // Jul-Oct
    return 'REGULAR';
  }

  parseCompetitorData(source, data) {
    // Parse different competitor API responses
    // This would be customized for each competitor
    switch (source) {
      case 'competitor1':
        return data.plans.map(plan => ({
          planName: plan.name,
          price: plan.price,
          currency: plan.currency || 'INR',
          category: this.mapCategory(plan.category),
          url: plan.url
        }));
      case 'competitor2':
        return data.pricing.map(item => ({
          planName: item.plan_name,
          price: item.monthly_price,
          currency: item.currency,
          category: this.mapCategory(item.type),
          url: item.details_url
        }));
      default:
        return [];
    }
  }

  mapCategory(competitorCategory) {
    const mapping = {
      'starter': 'STARTER',
      'basic': 'STARTER',
      'growth': 'GROWTH',
      'business': 'GROWTH',
      'enterprise': 'ENTERPRISE',
      'premium': 'ENTERPRISE'
    };
    return mapping[competitorCategory.toLowerCase()] || 'STARTER';
  }

  roundToIncrement(price, currency) {
    const increments = {
      'INR': 10,
      'USD': 1,
      'EUR': 1,
      'GBP': 1
    };
    
    const increment = increments[currency] || 1;
    return Math.round(price / increment) * increment;
  }

  async clearPriceCache(planId) {
    const keys = [
      `price:${planId}:*`,
      `history:${planId}:*`,
      'stats:pricing:*'
    ];
    
    for (const pattern of keys) {
      try {
        const matchingKeys = await redis.getClient().keys(pattern);
        if (matchingKeys.length > 0) {
          await redis.getClient().del(...matchingKeys);
        }
      } catch (error) {
        logger.error(`Error clearing cache for pattern ${pattern}:`, error);
      }
    }
  }

  async notifyPriceChange(plan, oldPrice, newPrice, changePercentage) {
    try {
      // Get subscribers
      const subscribers = await User.find({
        'preferences.notifications.email.priceChanges': true,
        'subscription.planId': plan._id
      });

      for (const user of subscribers) {
        await sendEmail({
          to: user.email,
          subject: `Price Update: ${plan.name}`,
          template: 'price-change',
          data: {
            userName: user.name,
            planName: plan.name,
            oldPrice: this.formatPrice(oldPrice, plan.currency),
            newPrice: this.formatPrice(newPrice, plan.currency),
            changePercentage: changePercentage.toFixed(1),
            changeType: changePercentage > 0 ? 'increased' : 'decreased',
            planUrl: `${process.env.CLIENT_URL}/plans/${plan.slug}`
          }
        });
      }

      logger.info(`Notified ${subscribers.length} users about price change for ${plan.name}`);
    } catch (error) {
      logger.error('Error notifying price change:', error);
    }
  }

  async notifyManualAdjustment(plan, oldPrice, newPrice, userId, notes) {
    try {
      // Notify admins/managers
      const admins = await User.find({
        role: { $in: ['admin', 'manager'] },
        'preferences.notifications.email.security': true
      });

      const user = await User.findById(userId);

      for (const admin of admins) {
        await sendEmail({
          to: admin.email,
          subject: `Manual Price Adjustment: ${plan.name}`,
          template: 'manual-adjustment',
          data: {
            adminName: admin.name,
            planName: plan.name,
            adjustedBy: user ? user.name : 'Unknown',
            userEmail: user ? user.email : 'Unknown',
            oldPrice: this.formatPrice(oldPrice, plan.currency),
            newPrice: this.formatPrice(newPrice, plan.currency),
            changePercentage: (((newPrice - oldPrice) / oldPrice) * 100).toFixed(1),
            notes: notes || 'No notes provided',
            adjustmentUrl: `${process.env.ADMIN_URL}/pricing/history/${plan._id}`
          }
        });
      }

      logger.info(`Notified ${admins.length} admins about manual price adjustment`);
    } catch (error) {
      logger.error('Error notifying manual adjustment:', error);
    }
  }

  formatPrice(price, currency) {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(price);
  }

  emitPriceUpdate(plan, oldPrice, newPrice) {
    // This would emit to Socket.IO in production
    const io = require('../app').getIO();
    if (io) {
      io.emit('price:updated', {
        planId: plan._id,
        planName: plan.name,
        oldPrice,
        newPrice,
        changePercentage: ((newPrice - oldPrice) / oldPrice) * 100,
        timestamp: new Date()
      });
    }
  }
}

module.exports = new PricingService();