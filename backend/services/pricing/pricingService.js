const Plan = require('../models/Plan.model');
const PriceHistory = require('../models/PriceHistory.model');
const Coupon = require('../models/Coupon.model');
const MarketCondition = require('../models/MarketCondition.model');
const AutomationRule = require('../models/AutomationRule.model');
const logger = require('../utils/logger');

class PricingService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all active plans with current pricing
   */
  async getActivePlans(options = {}) {
    try {
      const cacheKey = `active-plans-${JSON.stringify(options)}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }
      
      const query = { active: true };
      
      // Apply filters
      if (options.category) {
        query.category = options.category;
      }
      
      if (options.featured) {
        query.popular = true;
      }
      
      const plans = await Plan.find(query)
        .sort({ 'metadata.order': 1, basePrice: 1 })
        .lean();
      
      // Calculate current prices with market conditions
      const plansWithPricing = await Promise.all(
        plans.map(plan => this.calculatePlanPrice(plan, options))
      );
      
      const result = {
        plans: plansWithPricing,
        currency: 'INR',
        timestamp: new Date()
      };
      
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
      
    } catch (error) {
      logger.error('Error getting active plans:', error);
      throw error;
    }
  }

  /**
   * Calculate plan price with all factors
   */
  async calculatePlanPrice(plan, options = {}) {
    try {
      let currentPrice = plan.currentPrice || plan.basePrice;
      
      // Apply market conditions
      const marketMultiplier = await MarketCondition.calculateMarketMultiplier(plan, options.location);
      currentPrice *= marketMultiplier.multiplier;
      
      // Apply automation rules if enabled
      if (options.applyAutomation !== false) {
        const automationResult = await this.applyAutomationRules(plan, {
          currentPrice,
          location: options.location,
          userData: options.userData
        });
        
        if (automationResult.success) {
          currentPrice = automationResult.newPrice;
        }
      }
      
      // Apply coupons if provided
      let discountAmount = 0;
      let appliedCoupons = [];
      
      if (options.couponCodes && options.couponCodes.length > 0) {
        const couponResult = await this.applyCoupons(
          plan,
          options.couponCodes,
          currentPrice,
          options.userId
        );
        
        if (couponResult.success) {
          currentPrice = couponResult.finalPrice;
          discountAmount = couponResult.totalDiscount;
          appliedCoupons = couponResult.appliedCoupons;
        }
      }
      
      // Calculate tax
      const taxAmount = (currentPrice * plan.taxPercentage) / 100;
      const totalWithTax = currentPrice + taxAmount;
      
      // Calculate annual price with discount
      const annualDiscount = options.annualDiscount || 20;
      const annualPrice = currentPrice * 12 * (1 - annualDiscount / 100);
      const annualTax = (annualPrice * plan.taxPercentage) / 100;
      const annualTotal = annualPrice + annualTax;
      
      return {
        ...plan,
        currentPrice: Math.round(currentPrice),
        priceWithTax: Math.round(totalWithTax),
        taxAmount: Math.round(taxAmount),
        discountAmount: Math.round(discountAmount),
        appliedCoupons,
        
        // Annual pricing
        annualPrice: Math.round(annualPrice),
        annualTax: Math.round(annualTax),
        annualTotal: Math.round(annualTotal),
        annualDiscount,
        
        // Market data
        marketConditions: marketMultiplier.conditions,
        basePrice: plan.basePrice,
        priceAdjustment: ((currentPrice - plan.basePrice) / plan.basePrice) * 100,
        
        // Metadata
        calculatedAt: new Date(),
        currency: plan.currency || 'INR'
      };
      
    } catch (error) {
      logger.error('Error calculating plan price:', error);
      throw error;
    }
  }

  /**
   * Apply automation rules to plan
   */
  async applyAutomationRules(plan, context) {
    try {
      const rules = await AutomationRule.find({ 
        enabled: true,
        'conditions.planCategories': { $in: [plan.category] }
      }).sort({ priority: -1 });
      
      let currentPrice = context.currentPrice || plan.currentPrice || plan.basePrice;
      let appliedRules = [];
      
      for (const rule of rules) {
        const conditionsMet = await rule.evaluateConditions({
          ...context,
          plan,
          currentPrice
        });
        
        if (conditionsMet) {
          const newPrice = rule.applyAction(currentPrice);
          
          if (newPrice !== currentPrice) {
            // Log the change
            await PriceHistory.create({
              plan: plan._id,
              planName: plan.name,
              oldPrice: currentPrice,
              newPrice,
              changePercentage: ((newPrice - currentPrice) / currentPrice) * 100,
              currency: plan.currency,
              changeType: 'automation',
              factors: {
                ruleId: rule._id,
                ruleName: rule.name,
                ...context
              },
              triggeredBy: 'system'
            });
            
            currentPrice = newPrice;
            appliedRules.push({
              ruleId: rule._id,
              ruleName: rule.name,
              oldPrice: currentPrice,
              newPrice
            });
            
            // Update rule stats
            rule.stats.totalExecutions += 1;
            rule.stats.successfulExecutions += 1;
            rule.stats.lastExecution = new Date();
            await rule.save();
            
            // If rule is exclusive, break
            if (rule.metadata.tags?.includes('exclusive')) {
              break;
            }
          }
        }
      }
      
      // Update plan's current price
      if (appliedRules.length > 0) {
        plan.currentPrice = currentPrice;
        plan.lastPriceUpdate = new Date();
        plan.priceUpdateCount += 1;
        await plan.save();
      }
      
      return {
        success: appliedRules.length > 0,
        newPrice: currentPrice,
        appliedRules,
        planId: plan._id
      };
      
    } catch (error) {
      logger.error('Error applying automation rules:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Apply coupons to plan price
   */
  async applyCoupons(plan, couponCodes, currentPrice, userId = null) {
    try {
      const appliedCoupons = [];
      let totalDiscount = 0;
      let finalPrice = currentPrice;
      
      for (const code of couponCodes) {
        const couponResult = await Coupon.validateAndApply(
          code,
          userId,
          plan,
          finalPrice
        );
        
        if (couponResult.success) {
          const { coupon, discountAmount } = couponResult;
          
          // Check if coupon is stackable
          if (appliedCoupons.length > 0 && !coupon.stackable) {
            continue; // Skip non-stackable coupon if others already applied
          }
          
          finalPrice -= discountAmount;
          totalDiscount += discountAmount;
          
          appliedCoupons.push({
            code: coupon.code,
            name: coupon.name,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount,
            stackable: coupon.stackable
          });
          
          // Increment coupon usage
          await Coupon.findByIdAndUpdate(coupon.id, {
            $inc: { currentUses: 1 },
            $push: {
              userUses: {
                userId,
                count: 1,
                lastUsed: new Date()
              }
            }
          });
        }
      }
      
      // Ensure price doesn't go below 0
      if (finalPrice < 0) finalPrice = 0;
      
      return {
        success: appliedCoupons.length > 0,
        finalPrice: Math.round(finalPrice),
        totalDiscount: Math.round(totalDiscount),
        appliedCoupons,
        originalPrice: currentPrice
      };
      
    } catch (error) {
      logger.error('Error applying coupons:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update plan price manually
   */
  async updatePlanPrice(planId, newPrice, reason = 'manual', userId = null, context = {}) {
    try {
      const plan = await Plan.findById(planId);
      if (!plan) {
        throw new Error('Plan not found');
      }
      
      const oldPrice = plan.currentPrice || plan.basePrice;
      
      // Validate price constraints
      if (plan.automationSettings.minPrice && newPrice < plan.automationSettings.minPrice) {
        throw new Error(`Price cannot be below ${plan.automationSettings.minPrice}`);
      }
      
      if (plan.automationSettings.maxPrice && newPrice > plan.automationSettings.maxPrice) {
        throw new Error(`Price cannot exceed ${plan.automationSettings.maxPrice}`);
      }
      
      // Update plan
      plan.currentPrice = newPrice;
      plan.lastPriceUpdate = new Date();
      plan.priceUpdateCount += 1;
      plan.updatedBy = userId;
      await plan.save();
      
      // Log price history
      await PriceHistory.create({
        plan: plan._id,
        planName: plan.name,
        oldPrice,
        newPrice,
        changePercentage: ((newPrice - oldPrice) / oldPrice) * 100,
        currency: plan.currency,
        changeType: reason,
        factors: {
          ...context,
          userId
        },
        triggeredBy: userId ? 'admin' : 'system',
        userId,
        timestamp: new Date()
      });
      
      // Clear cache for this plan
      this.clearPlanCache(planId);
      
      return {
        success: true,
        plan: {
          id: plan._id,
          name: plan.name,
          oldPrice,
          newPrice,
          changePercentage: ((newPrice - oldPrice) / oldPrice) * 100,
          currency: plan.currency
        }
      };
      
    } catch (error) {
      logger.error('Error updating plan price:', error);
      throw error;
    }
  }

  /**
   * Get price history for a plan
   */
  async getPriceHistory(planId, options = {}) {
    try {
      const {
        startDate,
        endDate,
        limit = 50,
        offset = 0,
        changeType
      } = options;
      
      const query = { plan: planId };
      
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
      }
      
      if (changeType) {
        query.changeType = changeType;
      }
      
      const history = await PriceHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(offset)
        .limit(limit)
        .lean();
      
      const total = await PriceHistory.countDocuments(query);
      
      // Calculate statistics
      const stats = await PriceHistory.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            avgChange: { $avg: "$changePercentage" },
            maxIncrease: { $max: "$changePercentage" },
            maxDecrease: { $min: "$changePercentage" },
            totalChanges: { $sum: 1 }
          }
        }
      ]);
      
      return {
        history,
        pagination: {
          total,
          limit,
          offset,
          hasMore: total > offset + limit
        },
        statistics: stats[0] || {}
      };
      
    } catch (error) {
      logger.error('Error getting price history:', error);
      throw error;
    }
  }

  /**
   * Get pricing analytics
   */
  async getPricingAnalytics(options = {}) {
    try {
      const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        endDate = new Date()
      } = options;
      
      // Get all price changes in period
      const priceChanges = await PriceHistory.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              planId: "$plan",
              planName: "$planName"
            },
            totalChanges: { $sum: 1 },
            avgChange: { $avg: "$changePercentage" },
            priceRange: {
              $push: "$newPrice"
            },
            changesByType: {
              $push: {
                type: "$changeType",
                percentage: "$changePercentage"
              }
            }
          }
        },
        {
          $project: {
            planId: "$_id.planId",
            planName: "$_id.planName",
            totalChanges: 1,
            avgChange: 1,
            minPrice: { $min: "$priceRange" },
            maxPrice: { $max: "$priceRange" },
            priceVolatility: {
              $stdDevPop: "$priceRange"
            },
            changesByType: 1
          }
        }
      ]);
      
      // Get current plan prices
      const plans = await Plan.find({ active: true }).lean();
      
      // Calculate market conditions impact
      const marketImpact = await MarketCondition.aggregate([
        {
          $match: {
            active: true,
            $or: [
              { startDate: { $lte: endDate } },
              { startDate: null }
            ],
            $or: [
              { endDate: { $gte: startDate } },
              { endDate: null }
            ]
          }
        },
        {
          $group: {
            _id: "$type",
            totalConditions: { $sum: 1 },
            avgMultiplier: { $avg: "$multiplier" }
          }
        }
      ]);
      
      return {
        period: { startDate, endDate },
        plans: plans.map(plan => ({
          id: plan._id,
          name: plan.name,
          basePrice: plan.basePrice,
          currentPrice: plan.currentPrice || plan.basePrice,
          changeFromBase: plan.currentPrice ? 
            ((plan.currentPrice - plan.basePrice) / plan.basePrice) * 100 : 0,
          category: plan.category
        })),
        priceChanges,
        marketImpact,
        summary: {
          totalPlans: plans.length,
          totalPriceChanges: priceChanges.reduce((sum, pc) => sum + pc.totalChanges, 0),
          avgPriceChange: priceChanges.length > 0 ? 
            priceChanges.reduce((sum, pc) => sum + pc.avgChange, 0) / priceChanges.length : 0,
          marketConditions: marketImpact.length
        }
      };
      
    } catch (error) {
      logger.error('Error getting pricing analytics:', error);
      throw error;
    }
  }

  /**
   * Clear cache for a specific plan
   */
  clearPlanCache(planId) {
    const keysToDelete = [];
    for (const [key] of this.cache) {
      if (key.includes(planId) || key.includes('active-plans')) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all pricing cache
   */
  clearAllCache() {
    this.cache.clear();
  }
}

module.exports = new PricingService();