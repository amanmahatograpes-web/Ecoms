const Coupon = require('../models/Coupon.model');
const Plan = require('../models/Plan.model');
const logger = require('../utils/logger');

class DiscountService {
  constructor() {
    this.activeCoupons = new Map();
    this.loadActiveCoupons();
  }

  /**
   * Load active coupons into memory
   */
  async loadActiveCoupons() {
    try {
      const coupons = await Coupon.find({ 
        active: true,
        $or: [
          { validUntil: { $gte: new Date() } },
          { validUntil: null }
        ]
      });
      
      this.activeCoupons.clear();
      coupons.forEach(coupon => {
        this.activeCoupons.set(coupon.code, coupon);
      });
      
      logger.info(`Loaded ${coupons.length} active coupons into memory`);
      
    } catch (error) {
      logger.error('Error loading active coupons:', error);
    }
  }

  /**
   * Validate and apply coupon
   */
  async validateCoupon(code, userId, planId, amount) {
    try {
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      
      if (!coupon) {
        return {
          valid: false,
          error: 'Invalid coupon code'
        };
      }
      
      // Get plan if planId provided
      let plan = null;
      if (planId) {
        plan = await Plan.findById(planId);
      }
      
      // Validate coupon
      const validation = coupon.isValid(userId, plan, amount);
      if (!validation.valid) {
        return {
          valid: false,
          error: validation.reason
        };
      }
      
      // Calculate discount
      const discountAmount = coupon.calculateDiscount(amount);
      const finalAmount = amount - discountAmount;
      
      return {
        valid: true,
        coupon: {
          id: coupon._id,
          code: coupon.code,
          name: coupon.name,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          maxDiscountAmount: coupon.maxDiscountAmount,
          discountAmount,
          finalAmount,
          stackable: coupon.stackable,
          forNewUsersOnly: coupon.forNewUsersOnly
        }
      };
      
    } catch (error) {
      logger.error('Error validating coupon:', error);
      return {
        valid: false,
        error: 'Error validating coupon'
      };
    }
  }

  /**
   * Apply multiple coupons
   */
  async applyCoupons(couponCodes, userId, planId, amount) {
    try {
      let finalAmount = amount;
      const appliedCoupons = [];
      const errors = [];
      
      for (const code of couponCodes) {
        const result = await this.validateCoupon(code, userId, planId, finalAmount);
        
        if (result.valid) {
          // Check if coupon is stackable with already applied coupons
          if (appliedCoupons.length > 0 && !result.coupon.stackable) {
            errors.push({
              code,
              error: 'This coupon cannot be combined with other coupons'
            });
            continue;
          }
          
          // Check if user is new (if coupon is for new users only)
          if (result.coupon.forNewUsersOnly) {
            const userHasPreviousOrders = await this.checkUserPreviousOrders(userId);
            if (userHasPreviousOrders) {
              errors.push({
                code,
                error: 'This coupon is for new users only'
              });
              continue;
            }
          }
          
          finalAmount = result.coupon.finalAmount;
          appliedCoupons.push(result.coupon);
          
        } else {
          errors.push({
            code,
            error: result.error
          });
        }
      }
      
      return {
        success: appliedCoupons.length > 0,
        originalAmount: amount,
        finalAmount,
        totalDiscount: amount - finalAmount,
        appliedCoupons,
        errors,
        allApplied: errors.length === 0
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
   * Create a new coupon
   */
  async createCoupon(couponData, userId) {
    try {
      const coupon = new Coupon({
        ...couponData,
        code: couponData.code.toUpperCase().trim(),
        'metadata.createdBy': userId
      });
      
      await coupon.save();
      
      // Update in-memory cache
      if (coupon.active) {
        this.activeCoupons.set(coupon.code, coupon);
      }
      
      logger.info(`Created coupon: ${coupon.code} (${coupon.name})`);
      
      return {
        success: true,
        coupon
      };
      
    } catch (error) {
      logger.error('Error creating coupon:', error);
      throw error;
    }
  }

  /**
   * Update coupon
   */
  async updateCoupon(couponId, updates, userId) {
    try {
      const coupon = await Coupon.findById(couponId);
      
      if (!coupon) {
        throw new Error('Coupon not found');
      }
      
      // Preserve original code if not being updated
      if (updates.code) {
        updates.code = updates.code.toUpperCase().trim();
      }
      
      Object.assign(coupon, updates);
      coupon.metadata.updatedBy = userId;
      
      await coupon.save();
      
      // Update in-memory cache
      if (coupon.active) {
        this.activeCoupons.set(coupon.code, coupon);
      } else {
        this.activeCoupons.delete(coupon.code);
      }
      
      logger.info(`Updated coupon: ${coupon.code} (${coupon.name})`);
      
      return {
        success: true,
        coupon
      };
      
    } catch (error) {
      logger.error('Error updating coupon:', error);
      throw error;
    }
  }

  /**
   * Get coupon analytics
   */
  async getCouponAnalytics(options = {}) {
    try {
      const {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate = new Date()
      } = options;
      
      const analytics = await Coupon.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              discountType: "$discountType",
              active: "$active"
            },
            count: { $sum: 1 },
            totalUses: { $sum: "$currentUses" },
            totalDiscountGiven: { $sum: "$usageStats.totalDiscountGiven" },
            totalRevenue: { $sum: "$usageStats.totalRevenue" },
            avgOrderValue: { $avg: "$usageStats.avgOrderValue" }
          }
        },
        {
          $project: {
            discountType: "$_id.discountType",
            active: "$_id.active",
            count: 1,
            totalUses: 1,
            totalDiscountGiven: 1,
            totalRevenue: 1,
            avgOrderValue: 1,
            _id: 0
          }
        },
        { $sort: { totalUses: -1 } }
      ]);
      
      // Get top performing coupons
      const topCoupons = await Coupon.find({
        currentUses: { $gt: 0 }
      })
      .sort({ currentUses: -1 })
      .limit(10)
      .lean();
      
      // Get coupon usage over time
      const usageOverTime = await Coupon.aggregate([
        {
          $unwind: "$userUses"
        },
        {
          $match: {
            "userUses.lastUsed": { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$userUses.lastUsed" }
            },
            totalUses: { $sum: "$userUses.count" },
            uniqueUsers: { $addToSet: "$userUses.userId" },
            couponsUsed: { $addToSet: "$code" }
          }
        },
        {
          $project: {
            date: "$_id",
            totalUses: 1,
            uniqueUsers: { $size: "$uniqueUsers" },
            couponsUsed: { $size: "$couponsUsed" },
            _id: 0
          }
        },
        { $sort: { date: 1 } }
      ]);
      
      return {
        period: { startDate, endDate },
        summary: {
          totalCoupons: analytics.reduce((sum, a) => sum + a.count, 0),
          activeCoupons: analytics.filter(a => a.active).reduce((sum, a) => sum + a.count, 0),
          totalUses: analytics.reduce((sum, a) => sum + a.totalUses, 0),
          totalDiscountGiven: analytics.reduce((sum, a) => sum + a.totalDiscountGiven, 0),
          totalRevenue: analytics.reduce((sum, a) => sum + a.totalRevenue, 0)
        },
        analytics,
        topCoupons,
        usageOverTime
      };
      
    } catch (error) {
      logger.error('Error getting coupon analytics:', error);
      throw error;
    }
  }

  /**
   * Check if user has previous orders
   */
  async checkUserPreviousOrders(userId) {
    // This would check your order database
    // For now, return false (assuming no previous orders)
    return false;
  }

  /**
   * Get coupon by code
   */
  async getCouponByCode(code) {
    try {
      const coupon = this.activeCoupons.get(code.toUpperCase());
      
      if (!coupon) {
        return null;
      }
      
      // Check if coupon is still valid
      if (coupon.validUntil && new Date() > coupon.validUntil) {
        this.activeCoupons.delete(code);
        return null;
      }
      
      return coupon;
      
    } catch (error) {
      logger.error('Error getting coupon by code:', error);
      return null;
    }
  }

  /**
   * Get all active coupons
   */
  async getActiveCoupons() {
    return Array.from(this.activeCoupons.values());
  }

  /**
   * Increment coupon usage
   */
  async incrementCouponUsage(couponId, userId, discountAmount, orderAmount) {
    try {
      const coupon = await Coupon.findById(couponId);
      
      if (!coupon) {
        throw new Error('Coupon not found');
      }
      
      await coupon.incrementUsage(userId, discountAmount, orderAmount);
      
      logger.info(`Incremented usage for coupon: ${coupon.code}`);
      
    } catch (error) {
      logger.error('Error incrementing coupon usage:', error);
      throw error;
    }
  }
}

module.exports = new DiscountService();