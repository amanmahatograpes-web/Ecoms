const pricingService = require('../services/pricingService');
const PricingPlan = require('../models/PricingPlan');
const Coupon = require('../models/Coupon');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');
const constants = require('../config/constants');

class PricingController {
  /**
   * Get all pricing plans
   */
  async getPlans(req, res) {
    try {
      const {
        category = null,
        featured = null,
        popular = null,
        limit = 20,
        page = 1,
        sort = 'displayOrder',
        order = 'asc'
      } = req.query;

      // Build query
      const query = {
        isActive: true,
        isPublished: true
      };

      if (category) {
        query.category = category.toUpperCase();
      }

      if (featured !== null) {
        query.featured = featured === 'true';
      }

      if (popular !== null) {
        query.popular = popular === 'true';
      }

      // Build sort
      const sortOrder = order === 'desc' ? -1 : 1;
      const sortObj = {};
      sortObj[sort] = sortOrder;

      // Pagination
      const skip = (page - 1) * limit;

      // Execute query
      const [plans, total] = await Promise.all([
        PricingPlan.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .select('-__v -updatedAt')
          .lean(),
        PricingPlan.countDocuments(query)
      ]);

      // Format response
      const formattedPlans = plans.map(plan => ({
        ...plan,
        priceWithTax: plan.currentPrice + (plan.currentPrice * plan.taxPercentage / 100),
        annualPrice: plan.currentPrice * 12 * (1 - plan.discounts.annualDiscount / 100)
      }));

      res.json({
        success: true,
        data: formattedPlans,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        },
        meta: {
          currency: 'INR',
          taxPercentage: 18,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Get plans error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pricing plans',
        message: error.message
      });
    }
  }

  /**
   * Get single plan by ID or slug
   */
  async getPlan(req, res) {
    try {
      const { id } = req.params;
      
      // Check if ID is a valid ObjectId or a slug
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      
      let plan;
      if (isObjectId) {
        plan = await PricingPlan.findOne({
          _id: id,
          isActive: true,
          isPublished: true
        }).select('-__v -updatedAt').lean();
      } else {
        plan = await PricingPlan.findOne({
          slug: id,
          isActive: true,
          isPublished: true
        }).select('-__v -updatedAt').lean();
      }

      if (!plan) {
        return res.status(404).json({
          success: false,
          error: 'Pricing plan not found'
        });
      }

      // Add calculated fields
      plan.priceWithTax = plan.currentPrice + (plan.currentPrice * plan.taxPercentage / 100);
      plan.annualPrice = plan.currentPrice * 12 * (1 - plan.discounts.annualDiscount / 100);
      plan.quarterlyPrice = plan.currentPrice * 3 * (1 - plan.discounts.quarterlyDiscount / 100);

      res.json({
        success: true,
        data: plan,
        meta: {
          currency: plan.currency,
          taxInclusive: plan.taxInclusive,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Get plan error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pricing plan',
        message: error.message
      });
    }
  }

  /**
   * Create new pricing plan
   */
  async createPlan(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const planData = {
        ...req.body,
        createdBy: req.user.userId,
        currentPrice: req.body.basePrice // Set current price to base price initially
      };

      const plan = new PricingPlan(planData);
      await plan.save();

      // Log price history for initial creation
      await pricingService.logPriceChange({
        planId: plan._id,
        planName: plan.name,
        planSlug: plan.slug,
        oldPrice: 0,
        newPrice: plan.basePrice,
        currency: plan.currency,
        reason: 'initial_creation',
        createdBy: req.user.userId
      });

      res.status(201).json({
        success: true,
        message: 'Pricing plan created successfully',
        data: plan
      });

    } catch (error) {
      logger.error('Create plan error:', error);
      
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          error: 'Plan with this name or slug already exists'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create pricing plan',
        message: error.message
      });
    }
  }

  /**
   * Update pricing plan
   */
  async updatePlan(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const plan = await PricingPlan.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          error: 'Pricing plan not found'
        });
      }

      // Track price change if price is being updated
      if (updates.currentPrice && updates.currentPrice !== plan.currentPrice) {
        await pricingService.logPriceChange({
          planId: plan._id,
          planName: plan.name,
          planSlug: plan.slug,
          oldPrice: plan.currentPrice,
          newPrice: updates.currentPrice,
          currency: plan.currency,
          reason: 'manual_update',
          manualAdjustment: {
            userId: req.user.userId,
            notes: updates.changeNotes || 'Manual update via API'
          },
          createdBy: req.user.userId
        });
      }

      // Apply updates
      Object.keys(updates).forEach(key => {
        if (key !== '_id' && key !== '__v') {
          plan[key] = updates[key];
        }
      });

      plan.updatedBy = req.user.userId;
      await plan.save();

      // Clear cache
      await pricingService.clearPriceCache(plan._id);

      res.json({
        success: true,
        message: 'Pricing plan updated successfully',
        data: plan
      });

    } catch (error) {
      logger.error('Update plan error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update pricing plan',
        message: error.message
      });
    }
  }

  /**
   * Delete pricing plan (soft delete)
   */
  async deletePlan(req, res) {
    try {
      const { id } = req.params;

      const plan = await PricingPlan.findById(id);
      if (!plan) {
        return res.status(404).json({
          success: false,
          error: 'Pricing plan not found'
        });
      }

      // Soft delete
      plan.isActive = false;
      plan.isPublished = false;
      plan.updatedBy = req.user.userId;
      await plan.save();

      res.json({
        success: true,
        message: 'Pricing plan deleted successfully'
      });

    } catch (error) {
      logger.error('Delete plan error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete pricing plan',
        message: error.message
      });
    }
  }

  /**
   * Calculate automated price for a plan
   */
  async calculatePrice(req, res) {
    try {
      const { id } = req.params;
      const marketData = req.body;

      const result = await pricingService.calculateAutomatedPrice(id, marketData);

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Calculate price error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate price',
        message: error.message
      });
    }
  }

  /**
   * Apply coupon to plan
   */
  async applyCoupon(req, res) {
    try {
      const { id } = req.params;
      const { couponCode } = req.body;

      if (!couponCode) {
        return res.status(400).json({
          success: false,
          error: 'Coupon code is required'
        });
      }

      const result = await pricingService.applyCoupon(
        id, 
        couponCode, 
        req.user?.userId
      );

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Apply coupon error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to apply coupon'
      });
    }
  }

  /**
   * Get price history for a plan
   */
  async getPriceHistory(req, res) {
    try {
      const { id } = req.params;
      const options = {
        limit: parseInt(req.query.limit) || 50,
        page: parseInt(req.query.page) || 1,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        reason: req.query.reason,
        changeType: req.query.changeType
      };

      const result = await pricingService.getPriceHistory(id, options);

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Get price history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch price history',
        message: error.message
      });
    }
  }

  /**
   * Get pricing statistics
   */
  async getPricingStats(req, res) {
    try {
      const { timeframe = '30d' } = req.query;

      const stats = await pricingService.getPricingStats(timeframe);

      res.json({
        success: true,
        ...stats
      });

    } catch (error) {
      logger.error('Get pricing stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pricing statistics',
        message: error.message
      });
    }
  }

  /**
   * Sync competitor prices
   */
  async syncCompetitors(req, res) {
    try {
      const result = await pricingService.syncCompetitorPrices();

      res.json({
        success: true,
        message: 'Competitor prices synced successfully',
        ...result
      });

    } catch (error) {
      logger.error('Sync competitors error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync competitor prices',
        message: error.message
      });
    }
  }

  /**
   * Manual price adjustment
   */
  async adjustPrice(req, res) {
    try {
      const { id } = req.params;
      const { newPrice, notes } = req.body;

      if (!newPrice || newPrice <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid new price is required'
        });
      }

      const result = await pricingService.manualPriceAdjustment(
        id,
        newPrice,
        req.user.userId,
        notes
      );

      res.json({
        success: true,
        ...result
      });

    } catch (error) {
      logger.error('Adjust price error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to adjust price',
        message: error.message
      });
    }
  }

  /**
   * Batch update plans
   */
  async batchUpdate(req, res) {
    try {
      const { planIds, forceUpdate = false } = req.body;

      if (!planIds || !Array.isArray(planIds) || planIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Array of plan IDs is required'
        });
      }

      const result = await pricingService.batchUpdatePlans(
        planIds,
        req.user?.userId,
        forceUpdate
      );

      res.json({
        success: true,
        message: 'Batch update completed',
        ...result
      });

    } catch (error) {
      logger.error('Batch update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to batch update plans',
        message: error.message
      });
    }
  }

  /**
   * Get active coupons
   */
  async getCoupons(req, res) {
    try {
      const coupons = await Coupon.getActiveCoupons();

      res.json({
        success: true,
        data: coupons,
        count: coupons.length
      });

    } catch (error) {
      logger.error('Get coupons error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch coupons',
        message: error.message
      });
    }
  }

  /**
   * Validate coupon
   */
  async validateCoupon(req, res) {
    try {
      const { couponCode, planId, cartAmount = 0 } = req.body;

      if (!couponCode) {
        return res.status(400).json({
          success: false,
          error: 'Coupon code is required'
        });
      }

      const user = req.user ? {
        _id: req.user.userId,
        email: req.user.email,
        name: req.user.name
      } : null;

      const plan = planId ? await PricingPlan.findById(planId).lean() : null;

      const validation = await Coupon.validateCoupon(
        couponCode,
        user,
        plan,
        cartAmount
      );

      if (!validation.valid) {
        return res.json({
          success: false,
          valid: false,
          reason: validation.reason
        });
      }

      // Get coupon details
      const coupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase() 
      }).lean();

      res.json({
        success: true,
        valid: true,
        coupon: {
          code: coupon.code,
          name: coupon.name,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          description: coupon.description
        }
      });

    } catch (error) {
      logger.error('Validate coupon error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to validate coupon',
        message: error.message
      });
    }
  }

  /**
   * Get plan categories
   */
  async getCategories(req, res) {
    try {
      const categories = Object.values(constants.PLAN_CATEGORIES).map(category => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        description: this.getCategoryDescription(category)
      }));

      res.json({
        success: true,
        data: categories
      });

    } catch (error) {
      logger.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch categories',
        message: error.message
      });
    }
  }

  /**
   * Get market conditions options
   */
  async getMarketConditions(req, res) {
    try {
      const demandLevels = Object.values(constants.MARKET_CONDITIONS.DEMAND_LEVELS);
      const seasons = Object.values(constants.MARKET_CONDITIONS.SEASONS);

      res.json({
        success: true,
        data: {
          demandLevels: demandLevels.map(level => ({
            value: level.value,
            label: level.label,
            multiplier: level.multiplier
          })),
          seasons: seasons.map(season => ({
            value: season.value,
            label: season.label,
            multiplier: season.multiplier
          }))
        }
      });

    } catch (error) {
      logger.error('Get market conditions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch market conditions',
        message: error.message
      });
    }
  }

  /**
   * Helper Methods
   */
  getCategoryDescription(category) {
    const descriptions = {
      'starter': 'Perfect for small teams and startups just getting started',
      'growth': 'For growing businesses that need more features and scalability',
      'enterprise': 'For large organizations with advanced requirements and support needs',
      'custom': 'Tailored solutions for unique business requirements'
    };
    return descriptions[category] || 'Business pricing plan';
  }
}

module.exports = new PricingController();