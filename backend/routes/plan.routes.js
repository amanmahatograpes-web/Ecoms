const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const {
  authenticate,
  authorize,
  hasPermission,
  validateRequest,
  asyncHandler
} = require('../middleware');

// Import validation schemas
const {
  planSchema,
  updatePlanSchema,
  priceUpdateSchema,
  featureUpdateSchema
} = require('../middleware/validation/planValidation');

// Utility functions
const calculatePrice = (plan, options = {}) => {
  const {
    quantity = 1,
    billingCycle = plan.defaultBillingCycle,
    coupon = null,
    addons = [],
    customFeatures = []
  } = options;

  let basePrice = plan.currentPrice;
  
  // Apply seasonal adjustments
  if (plan.automationSettings.seasonalAdjustment) {
    const now = new Date();
    const month = now.getMonth();
    // Example: +10% during holiday season (Nov-Dec)
    if (month === 10 || month === 11) { // November (10) and December (11)
      basePrice *= (1 + plan.automationSettings.seasonalAdjustment / 100);
    }
  }

  // Apply demand factor
  if (plan.automationSettings.demandFactor > 1.0) {
    basePrice *= plan.automationSettings.demandFactor;
  }

  // Apply quantity
  let totalPrice = basePrice * quantity;

  // Apply billing cycle discount
  if (billingCycle === 'year' && plan.billingCycleDiscounts?.year) {
    totalPrice *= (1 - plan.billingCycleDiscounts.year / 100);
  } else if (billingCycle === 'quarter' && plan.billingCycleDiscounts?.quarter) {
    totalPrice *= (1 - plan.billingCycleDiscounts.quarter / 100);
  }

  // Calculate addons
  let addonsTotal = 0;
  if (addons.length > 0 && plan.availableAddons) {
    addonsTotal = addons.reduce((sum, addonId) => {
      const addon = plan.availableAddons.find(a => a.addonId === addonId);
      return sum + (addon?.price || 0);
    }, 0);
  }

  // Calculate custom features
  let customFeaturesTotal = 0;
  if (customFeatures.length > 0 && plan.customizableFeatures) {
    customFeaturesTotal = customFeatures.reduce((sum, feature) => {
      const featureConfig = plan.customizableFeatures.find(f => f.featureId === feature.featureId);
      if (featureConfig) {
        const tier = featureConfig.tiers.find(t => t.id === feature.tierId);
        return sum + (tier?.price || 0);
      }
      return sum;
    }, 0);
  }

  totalPrice += addonsTotal + customFeaturesTotal;

  // Apply coupon if provided
  let discountAmount = 0;
  let finalPrice = totalPrice;
  
  if (coupon) {
    // Coupon validation would happen here
    discountAmount = coupon.discountAmount || 0;
    finalPrice = Math.max(0, totalPrice - discountAmount);
  }

  // Calculate taxes
  let taxAmount = 0;
  if (plan.taxPercentage) {
    taxAmount = (finalPrice * plan.taxPercentage) / 100;
  }

  const grandTotal = finalPrice + taxAmount;

  return {
    basePrice,
    quantity,
    billingCycle,
    totalPrice,
    addonsTotal,
    customFeaturesTotal,
    discountAmount,
    finalPrice,
    taxAmount,
    taxPercentage: plan.taxPercentage,
    grandTotal,
    breakdown: {
      perUnit: basePrice,
      quantity,
      subtotal: totalPrice,
      discounts: discountAmount,
      taxes: taxAmount,
      total: grandTotal
    }
  };
};

const generateTrialSubscription = async (planId, userId, trialDays = 14) => {
  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + trialDays);

  return await Subscription.create({
    userId,
    planId,
    status: 'trial',
    currentPeriodStart: new Date(),
    currentPeriodEnd: trialEnds,
    trialEnds,
    isTrial: true,
    autoRenew: false,
    metadata: {
      source: 'trial_signup',
      trialDays
    }
  });
};

/**
 * @desc    Get all subscription plans
 * @route   GET /api/v1/plans
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      category,
      isActive = true,
      featured = false,
      minPrice,
      maxPrice,
      billingCycle,
      search,
      sortBy = 'currentPrice',
      sortOrder = 'asc'
    } = req.query;

    // Build filter
    const filter = { isActive };

    if (category) {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      filter.currentPrice = {};
      if (minPrice) filter.currentPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.currentPrice.$lte = parseFloat(maxPrice);
    }

    if (billingCycle) {
      filter.billingCycles = billingCycle;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    if (sortBy === 'popularity') {
      sortOptions.isPopular = -1;
      sortOptions.currentPrice = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'name') {
      sortOptions.name = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Get plans
    const plans = await Plan.find(filter)
      .select('-__v -createdAt -updatedAt')
      .sort(sortOptions)
      .lean();

    // Get pricing information for each plan
    const plansWithPricing = plans.map(plan => ({
      ...plan,
      pricing: calculatePrice(plan),
      hasTrial: plan.trialDays > 0,
      isRecommended: checkIfRecommended(plan, req.user?.id)
    }));

    // Get plan categories
    const categories = await Plan.distinct('category', { isActive: true });

    // Get plan statistics
    const stats = await Plan.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalPlans: { $sum: 1 },
          avgPrice: { $avg: '$currentPrice' },
          minPrice: { $min: '$currentPrice' },
          maxPrice: { $max: '$currentPrice' },
          featuredPlans: {
            $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        plans: plansWithPricing,
        filters: {
          categories,
          priceRange: {
            min: stats[0]?.minPrice || 0,
            max: stats[0]?.maxPrice || 0,
            avg: stats[0]?.avgPrice || 0
          },
          billingCycles: ['month', 'year', 'quarter'],
          totalPlans: stats[0]?.totalPlans || 0
        },
        metadata: {
          currency: 'INR',
          defaultTaxRate: 18,
          showTaxInclusive: true
        }
      }
    });
  })
);

/**
 * @desc    Get plan by ID
 * @route   GET /api/v1/plans/:id
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const plan = await Plan.findById(id).lean();

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Subscription plan not found'
      });
    }

    // Check if plan is active (unless admin request)
    if (!plan.isActive && !(req.user?.role === 'admin')) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_AVAILABLE',
        message: 'This plan is no longer available'
      });
    }

    // Get similar plans
    const similarPlans = await Plan.find({
      _id: { $ne: plan._id },
      category: plan.category,
      isActive: true
    })
      .limit(3)
      .select('name description currentPrice isPopular billingCycles')
      .lean();

    // Get plan statistics (usage, subscriptions, etc.)
    const planStats = await Subscription.aggregate([
      { $match: { planId: plan._id, status: 'active' } },
      {
        $group: {
          _id: null,
          activeSubscriptions: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgSubscriptionDuration: {
            $avg: {
              $divide: [
                { $subtract: ['$currentPeriodEnd', '$currentPeriodStart'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            }
          }
        }
      }
    ]);

    // Calculate price with different options
    const pricingOptions = {
      monthly: calculatePrice(plan, { billingCycle: 'month' }),
      yearly: calculatePrice(plan, { billingCycle: 'year' }),
      quarterly: calculatePrice(plan, { billingCycle: 'quarter' })
    };

    const responseData = {
      ...plan,
      pricing: pricingOptions.monthly,
      pricingOptions,
      statistics: planStats[0] || {
        activeSubscriptions: 0,
        totalRevenue: 0,
        avgSubscriptionDuration: 0
      },
      similarPlans,
      frequentlyAskedQuestions: plan.faqs || getDefaultFAQs(plan),
      upgradePaths: getUpgradePaths(plan),
      downgradePaths: getDowngradePaths(plan)
    };

    res.json({
      success: true,
      data: responseData
    });
  })
);

/**
 * @desc    Get plan by slug
 * @route   GET /api/v1/plans/slug/:slug
 * @access  Public
 */
router.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const plan = await Plan.findOne({ slug, isActive: true }).lean();

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Subscription plan not found'
      });
    }

    res.json({
      success: true,
      data: plan
    });
  })
);

/**
 * @desc    Create new subscription plan
 * @route   POST /api/v1/plans
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest(planSchema),
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      basePrice,
      currentPrice,
      period,
      category,
      features,
      isPopular = false,
      isFeatured = false,
      isActive = true,
      trialDays = 0,
      maxUsers,
      storage,
      supportType,
      billingCycles = ['month'],
      defaultBillingCycle = 'month',
      billingCycleDiscounts = {},
      taxPercentage = 18,
      automationSettings = {},
      availableAddons = [],
      customizableFeatures = [],
      limitations = [],
      slaGuarantee,
      setupFee = 0,
      cancellationPolicy = 'flexible',
      contractTerm = 'month-to-month'
    } = req.body;

    // Check if plan with same name exists
    const existingPlan = await Plan.findOne({ 
      $or: [
        { name },
        { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      ] 
    });

    if (existingPlan) {
      return res.status(409).json({
        success: false,
        error: 'PLAN_EXISTS',
        message: 'A plan with this name already exists'
      });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    // Create plan
    const plan = await Plan.create({
      name,
      slug,
      description,
      tagline: req.body.tagline || '',
      basePrice,
      currentPrice: currentPrice || basePrice,
      period,
      category,
      features,
      isPopular,
      isFeatured,
      isActive,
      trialDays,
      maxUsers,
      storage,
      supportType,
      billingCycles,
      defaultBillingCycle,
      billingCycleDiscounts,
      taxPercentage,
      automationSettings: {
        demandFactor: automationSettings.demandFactor || 1.0,
        seasonalAdjustment: automationSettings.seasonalAdjustment || 0,
        dynamicPricing: automationSettings.dynamicPricing || false,
        priceUpdateFrequency: automationSettings.priceUpdateFrequency || 'manual'
      },
      availableAddons,
      customizableFeatures,
      limitations,
      slaGuarantee,
      setupFee,
      cancellationPolicy,
      contractTerm,
      createdBy: req.user.userId,
      metadata: {
        version: '1.0',
        createdVia: 'admin_panel',
        initialConfiguration: {
          hasDynamicPricing: automationSettings.dynamicPricing || false,
          hasAddons: availableAddons.length > 0,
          hasCustomFeatures: customizableFeatures.length > 0
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully',
      data: plan
    });
  })
);

/**
 * @desc    Update plan
 * @route   PUT /api/v1/plans/:id
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(updatePlanSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Subscription plan not found'
      });
    }

    // Check if plan has active subscriptions before making certain changes
    if (plan.hasActiveSubscriptions && req.body.isActive === false) {
      return res.status(400).json({
        success: false,
        error: 'PLAN_HAS_ACTIVE_SUBSCRIPTIONS',
        message: 'Cannot deactivate plan with active subscriptions'
      });
    }

    // Update fields
    const updatableFields = [
      'name',
      'description',
      'tagline',
      'currentPrice',
      'isPopular',
      'isFeatured',
      'isActive',
      'trialDays',
      'maxUsers',
      'storage',
      'supportType',
      'billingCycles',
      'defaultBillingCycle',
      'billingCycleDiscounts',
      'taxPercentage',
      'availableAddons',
      'customizableFeatures',
      'limitations',
      'slaGuarantee',
      'setupFee',
      'cancellationPolicy',
      'contractTerm',
      'faqs'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        plan[field] = req.body[field];
      }
    });

    // Update automation settings if provided
    if (req.body.automationSettings) {
      plan.automationSettings = {
        ...plan.automationSettings,
        ...req.body.automationSettings
      };
    }

    // Update metadata
    plan.metadata = {
      ...plan.metadata,
      lastUpdatedBy: req.user.userId,
      lastUpdatedAt: new Date(),
      updateReason: req.body.updateReason || 'admin_update',
      version: (parseFloat(plan.metadata.version) + 0.1).toFixed(1)
    };

    await plan.save();

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plan
    });
  })
);

/**
 * @desc    Update plan price
 * @route   PATCH /api/v1/plans/:id/price
 * @access  Private/Admin
 */
router.patch(
  '/:id/price',
  authenticate,
  authorize('admin'),
  validateRequest(priceUpdateSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newPrice, reason, effectiveFrom, notifyExistingUsers = false } = req.body;

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Subscription plan not found'
      });
    }

    // Store price history
    plan.priceHistory.push({
      oldPrice: plan.currentPrice,
      newPrice,
      changedAt: new Date(),
      changedBy: req.user.userId,
      reason,
      effectiveFrom: effectiveFrom || new Date()
    });

    // Update current price
    plan.currentPrice = newPrice;

    // Update metadata
    plan.metadata.lastPriceUpdate = new Date();
    plan.metadata.priceUpdateReason = reason;

    await plan.save();

    // Notify existing users if required
    if (notifyExistingUsers) {
      await notifyUsersOfPriceChange(plan, newPrice, effectiveFrom);
    }

    res.json({
      success: true,
      message: 'Plan price updated successfully',
      data: {
        id: plan._id,
        name: plan.name,
        oldPrice: plan.priceHistory[plan.priceHistory.length - 2]?.oldPrice,
        newPrice: plan.currentPrice,
        effectiveFrom: effectiveFrom || 'immediately',
        changePercentage: ((newPrice - plan.basePrice) / plan.basePrice * 100).toFixed(2)
      }
    });
  })
);

/**
 * @desc    Update plan features
 * @route   PATCH /api/v1/plans/:id/features
 * @access  Private/Admin
 */
router.patch(
  '/:id/features',
  authenticate,
  authorize('admin'),
  validateRequest(featureUpdateSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { features, operation = 'replace', newFeatures = [] } = req.body;

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Subscription plan not found'
      });
    }

    // Update features based on operation
    switch (operation) {
      case 'add':
        plan.features = [...plan.features, ...newFeatures];
        break;
      case 'remove':
        plan.features = plan.features.filter(feature => !features.includes(feature));
        break;
      case 'replace':
        plan.features = features;
        break;
      case 'update':
        plan.features = features || plan.features;
        break;
    }

    // Track feature changes
    plan.featureHistory.push({
      operation,
      features: operation === 'add' ? newFeatures : features,
      changedAt: new Date(),
      changedBy: req.user.userId,
      previousFeatures: [...plan.features]
    });

    await plan.save();

    res.json({
      success: true,
      message: `Plan features ${operation}ed successfully`,
      data: {
        id: plan._id,
        name: plan.name,
        totalFeatures: plan.features.length,
        features: plan.features.slice(0, 10) // Return first 10 features
      }
    });
  })
);

/**
 * @desc    Toggle plan status (active/inactive)
 * @route   PATCH /api/v1/plans/:id/toggle
 * @access  Private/Admin
 */
router.patch(
  '/:id/toggle',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Subscription plan not found'
      });
    }

    // Check if plan has active subscriptions
    if (!plan.isActive && plan.hasActiveSubscriptions) {
      const activeSubscriptions = await Subscription.countDocuments({
        planId: plan._id,
        status: 'active'
      });

      if (activeSubscriptions > 0) {
        return res.status(400).json({
          success: false,
          error: 'HAS_ACTIVE_SUBSCRIPTIONS',
          message: `Cannot deactivate plan with ${activeSubscriptions} active subscriptions`
        });
      }
    }

    plan.isActive = !plan.isActive;
    
    // Track status changes
    plan.statusHistory.push({
      from: !plan.isActive,
      to: plan.isActive,
      changedAt: new Date(),
      changedBy: req.user.userId,
      reason
    });

    await plan.save();

    res.json({
      success: true,
      message: `Plan ${plan.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: plan._id,
        name: plan.name,
        isActive: plan.isActive,
        statusChangeReason: reason
      }
    });
  })
);

/**
 * @desc    Delete plan (soft delete)
 * @route   DELETE /api/v1/plans/:id
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { force = false } = req.query;

    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Subscription plan not found'
      });
    }

    // Check if plan has active subscriptions
    const activeSubscriptions = await Subscription.countDocuments({
      planId: plan._id,
      status: 'active'
    });

    if (activeSubscriptions > 0 && !force) {
      return res.status(400).json({
        success: false,
        error: 'HAS_ACTIVE_SUBSCRIPTIONS',
        message: `Cannot delete plan with ${activeSubscriptions} active subscriptions. Use force=true to override.`
      });
    }

    if (force) {
      // Hard delete
      await plan.deleteOne();
      
      res.json({
        success: true,
        message: 'Plan permanently deleted',
        data: {
          id: plan._id,
          name: plan.name,
          deleted: true
        }
      });
    } else {
      // Soft delete (archive)
      plan.isActive = false;
      plan.isArchived = true;
      plan.archivedAt = new Date();
      plan.archivedBy = req.user.userId;
      await plan.save();

      res.json({
        success: true,
        message: 'Plan archived successfully',
        data: {
          id: plan._id,
          name: plan.name,
          archived: true,
          archivedAt: plan.archivedAt
        }
      });
    }
  })
);

/**
 * @desc    Calculate plan pricing with options
 * @route   POST /api/v1/plans/:id/calculate-price
 * @access  Public
 */
router.post(
  '/:id/calculate-price',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
      quantity = 1,
      billingCycle,
      addons = [],
      customFeatures = [],
      couponCode,
      promoCode
    } = req.body;

    const plan = await Plan.findById(id).lean();

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Subscription plan not found'
      });
    }

    // Validate billing cycle
    const validBillingCycle = billingCycle || plan.defaultBillingCycle;
    if (!plan.billingCycles.includes(validBillingCycle)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_BILLING_CYCLE',
        message: `Plan only supports: ${plan.billingCycles.join(', ')}`
      });
    }

    // Validate addons
    const validAddons = [];
    if (addons.length > 0 && plan.availableAddons) {
      addons.forEach(addonId => {
        const addon = plan.availableAddons.find(a => a.addonId === addonId);
        if (addon) {
          validAddons.push(addon);
        }
      });
    }

    // Validate custom features
    const validCustomFeatures = [];
    if (customFeatures.length > 0 && plan.customizableFeatures) {
      customFeatures.forEach(customFeature => {
        const featureConfig = plan.customizableFeatures.find(
          f => f.featureId === customFeature.featureId
        );
        if (featureConfig) {
          const tier = featureConfig.tiers.find(t => t.id === customFeature.tierId);
          if (tier) {
            validCustomFeatures.push({
              ...customFeature,
              price: tier.price,
              name: featureConfig.name,
              tierName: tier.name
            });
          }
        }
      });
    }

    // Calculate price
    const priceCalculation = calculatePrice(plan, {
      quantity,
      billingCycle: validBillingCycle,
      addons: validAddons.map(a => a.addonId),
      customFeatures: validCustomFeatures
    });

    // Apply coupon/promo if provided (simplified)
    let discountDetails = null;
    if (couponCode || promoCode) {
      // In reality, you would validate the coupon here
      discountDetails = {
        type: 'coupon',
        code: couponCode || promoCode,
        discountAmount: 100, // Example discount
        description: '₹100 off your first payment'
      };
      priceCalculation.discountAmount = 100;
      priceCalculation.finalPrice = Math.max(0, priceCalculation.finalPrice - 100);
    }

    const response = {
      plan: {
        id: plan._id,
        name: plan.name,
        description: plan.description,
        basePrice: plan.basePrice,
        currentPrice: plan.currentPrice,
        period: plan.period
      },
      configuration: {
        quantity,
        billingCycle: validBillingCycle,
        addons: validAddons,
        customFeatures: validCustomFeatures
      },
      pricing: priceCalculation,
      discounts: discountDetails,
      summary: {
        subtotal: priceCalculation.totalPrice,
        totalDiscounts: priceCalculation.discountAmount,
        taxAmount: priceCalculation.taxAmount,
        grandTotal: priceCalculation.grandTotal
      },
      validity: {
        calculatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        currencyLocked: true
      }
    };

    res.json({
      success: true,
      data: response
    });
  })
);

/**
 * @desc    Compare multiple plans
 * @route   POST /api/v1/plans/compare
 * @access  Public
 */
router.post(
  '/compare',
  asyncHandler(async (req, res) => {
    const { planIds, userId } = req.body;

    if (!planIds || !Array.isArray(planIds) || planIds.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: 'At least two plan IDs are required for comparison'
      });
    }

    // Limit to 4 plans for comparison
    const idsToCompare = planIds.slice(0, 4);

    const plans = await Plan.find({
      _id: { $in: idsToCompare },
      isActive: true
    }).lean();

    if (plans.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'INSUFFICIENT_PLANS',
        message: 'Could not find at least two active plans to compare'
      });
    }

    // Get common features across all plans
    const allFeatures = [...new Set(plans.flatMap(p => p.features))];
    
    const comparison = {
      plans: plans.map(plan => ({
        id: plan._id,
        name: plan.name,
        description: plan.description,
        currentPrice: plan.currentPrice,
        period: plan.period,
        category: plan.category,
        isPopular: plan.isPopular,
        isFeatured: plan.isFeatured,
        trialDays: plan.trialDays,
        maxUsers: plan.maxUsers,
        storage: plan.storage,
        supportType: plan.supportType,
        features: plan.features,
        customizableFeatures: plan.customizableFeatures || [],
        availableAddons: plan.availableAddons || [],
        limitations: plan.limitations || []
      })),
      featuresMatrix: allFeatures.map(feature => ({
        feature,
        availableIn: plans.map(plan => plan.features.includes(feature))
      })),
      priceComparison: plans.map(plan => ({
        id: plan._id,
        name: plan.name,
        monthly: calculatePrice(plan, { billingCycle: 'month' }),
        yearly: calculatePrice(plan, { billingCycle: 'year' }),
        valueScore: calculateValueScore(plan)
      })),
      recommendations: getComparisonRecommendations(plans, userId),
      metadata: {
        comparedAt: new Date(),
        totalPlans: plans.length,
        totalFeatures: allFeatures.length
      }
    };

    res.json({
      success: true,
      data: comparison
    });
  })
);

/**
 * @desc    Get plan statistics and analytics
 * @route   GET /api/v1/plans/stats/overview
 * @access  Private/Admin
 */
router.get(
  '/stats/overview',
  authenticate,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { period = 'month', startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      dateFilter.createdAt = { $gte: thirtyDaysAgo };
    }

    const [
      planStats,
      revenueStats,
      subscriptionStats,
      popularPlans,
      categoryDistribution
    ] = await Promise.all([
      // Plan statistics
      Plan.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalPlans: { $sum: 1 },
            activePlans: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            },
            featuredPlans: {
              $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] }
            },
            avgPrice: { $avg: '$currentPrice' },
            totalCategories: { $addToSet: '$category' }
          }
        },
        {
          $project: {
            totalPlans: 1,
            activePlans: 1,
            featuredPlans: 1,
            avgPrice: { $round: ['$avgPrice', 2] },
            totalCategories: { $size: '$totalCategories' }
          }
        }
      ]),

      // Revenue statistics
      Subscription.aggregate([
        { $match: { status: 'active', ...dateFilter } },
        {
          $lookup: {
            from: 'plans',
            localField: 'planId',
            foreignField: '_id',
            as: 'plan'
          }
        },
        { $unwind: '$plan' },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            avgMonthlyRevenue: {
              $avg: {
                $cond: [
                  { $eq: ['$plan.period', 'month'] },
                  '$totalAmount',
                  { $divide: ['$totalAmount', 12] }
                ]
              }
            },
            totalSubscriptions: { $sum: 1 },
            avgSubscriptionValue: { $avg: '$totalAmount' }
          }
        }
      ]),

      // Subscription statistics by plan
      Subscription.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$planId',
            totalSubscriptions: { $sum: 1 },
            totalRevenue: { $sum: '$totalAmount' },
            avgDuration: {
              $avg: {
                $divide: [
                  { $subtract: ['$currentPeriodEnd', '$currentPeriodStart'] },
                  1000 * 60 * 60 * 24 // Convert to days
                ]
              }
            }
          }
        },
        { $sort: { totalSubscriptions: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'plans',
            localField: '_id',
            foreignField: '_id',
            as: 'plan'
          }
        },
        { $unwind: '$plan' },
        {
          $project: {
            planId: '$_id',
            planName: '$plan.name',
            totalSubscriptions: 1,
            totalRevenue: 1,
            avgDuration: { $round: ['$avgDuration', 1] },
            popularityScore: {
              $multiply: [
                { $divide: ['$totalSubscriptions', 100] },
                { $divide: ['$totalRevenue', 1000] }
              ]
            }
          }
        }
      ]),

      // Most popular plans
      Plan.find({ isActive: true })
        .sort({ isPopular: -1, currentPrice: 1 })
        .limit(5)
        .select('name currentPrice period isPopular category trialDays')
        .lean(),

      // Category distribution
      Plan.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgPrice: { $avg: '$currentPrice' },
            totalSubscriptions: { $sum: '$subscriptionCount' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    const response = {
      overview: planStats[0] || {
        totalPlans: 0,
        activePlans: 0,
        featuredPlans: 0,
        avgPrice: 0,
        totalCategories: 0
      },
      revenue: revenueStats[0] || {
        totalRevenue: 0,
        avgMonthlyRevenue: 0,
        totalSubscriptions: 0,
        avgSubscriptionValue: 0
      },
      subscriptions: subscriptionStats,
      popularPlans,
      categories: categoryDistribution,
      insights: {
        mostProfitablePlan: subscriptionStats[0] || null,
        bestValuePlan: calculateBestValuePlan(popularPlans),
        conversionRate: calculateConversionRate(subscriptionStats),
        churnRisk: calculateChurnRisk(subscriptionStats)
      }
    };

    res.json({
      success: true,
      data: response
    });
  })
);

/**
 * @desc    Get plans suitable for upgrade/downgrade from current plan
 * @route   GET /api/v1/plans/:id/alternatives
 * @access  Private
 */
router.get(
  '/:id/alternatives',
  authenticate,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type = 'upgrade' } = req.query;

    const currentPlan = await Plan.findById(id).lean();

    if (!currentPlan) {
      return res.status(404).json({
        success: false,
        error: 'PLAN_NOT_FOUND',
        message: 'Current plan not found'
      });
    }

    let alternativePlans = [];

    if (type === 'upgrade') {
      // Find plans with higher price/features
      alternativePlans = await Plan.find({
        _id: { $ne: currentPlan._id },
        isActive: true,
        currentPrice: { $gt: currentPlan.currentPrice },
        category: currentPlan.category
      })
        .sort({ currentPrice: 1 })
        .limit(5)
        .lean();
    } else if (type === 'downgrade') {
      // Find plans with lower price/features
      alternativePlans = await Plan.find({
        _id: { $ne: currentPlan._id },
        isActive: true,
        currentPrice: { $lt: currentPlan.currentPrice },
        category: currentPlan.category
      })
        .sort({ currentPrice: -1 })
        .limit(5)
        .lean();
    } else if (type === 'similar') {
      // Find plans with similar price
      const priceRange = currentPlan.currentPrice * 0.2; // ±20%
      alternativePlans = await Plan.find({
        _id: { $ne: currentPlan._id },
        isActive: true,
        currentPrice: {
          $gte: currentPlan.currentPrice - priceRange,
          $lte: currentPlan.currentPrice + priceRange
        }
      })
        .sort({ currentPrice: 1 })
        .limit(5)
        .lean();
    }

    // Add comparison data
    const alternativesWithComparison = alternativePlans.map(plan => ({
      ...plan,
      comparison: {
        priceDifference: plan.currentPrice - currentPlan.currentPrice,
        priceDifferencePercentage: ((plan.currentPrice - currentPlan.currentPrice) / currentPlan.currentPrice * 100).toFixed(2),
        hasMoreFeatures: plan.features.length > currentPlan.features.length,
        featureDifference: plan.features.length - currentPlan.features.length,
        recommendationScore: calculateRecommendationScore(currentPlan, plan, type)
      }
    }));

    res.json({
      success: true,
      data: {
        currentPlan: {
          id: currentPlan._id,
          name: currentPlan.name,
          currentPrice: currentPlan.currentPrice,
          features: currentPlan.features,
          category: currentPlan.category
        },
        alternatives: alternativesWithComparison,
        type,
        recommendation: getAlternativeRecommendation(currentPlan, alternativePlans, type)
      }
    });
  })
);

// Helper functions
const checkIfRecommended = (plan, userId) => {
  // Implement recommendation logic based on user behavior, preferences, etc.
  return plan.isPopular || false;
};

const getDefaultFAQs = (plan) => {
  return [
    {
      question: `What's included in the ${plan.name} plan?`,
      answer: plan.description
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Is there a free trial?',
      answer: plan.trialDays > 0 
        ? `Yes, you can try ${plan.name} free for ${plan.trialDays} days.` 
        : 'No free trial is available for this plan.'
    },
    {
      question: 'How does billing work?',
      answer: `You'll be billed ${plan.period}ly. You can cancel at any time.`
    }
  ];
};

const getUpgradePaths = (plan) => {
  // In reality, this would query the database for higher-tier plans
  return [
    {
      fromPlan: plan.name,
      toPlan: 'Professional',
      priceIncrease: 3000,
      newFeatures: ['Advanced analytics', 'Priority support', 'Custom integrations'],
      recommendation: 'recommended for growing teams'
    }
  ];
};

const getDowngradePaths = (plan) => {
  // In reality, this would query the database for lower-tier plans
  return [
    {
      fromPlan: plan.name,
      toPlan: 'Basic',
      priceDecrease: 3000,
      featuresLost: ['Some advanced features'],
      recommendation: 'for basic usage needs'
    }
  ];
};

const notifyUsersOfPriceChange = async (plan, newPrice, effectiveFrom) => {
  // Implementation for notifying existing users
  // This would typically integrate with email/notification service
  console.log(`Price change notification for plan ${plan.name}: ${newPrice} effective from ${effectiveFrom}`);
};

const calculateValueScore = (plan) => {
  // Calculate value score based on features vs price
  const featureCount = plan.features.length;
  const pricePerFeature = plan.currentPrice / Math.max(1, featureCount);
  const score = (1000 / pricePerFeature) * (plan.isPopular ? 1.2 : 1);
  return Math.min(100, Math.round(score));
};

const getComparisonRecommendations = (plans, userId) => {
  const recommendations = [];

  // Find best value (features per price)
  const bestValue = plans.reduce((best, plan) => {
    const valueScore = calculateValueScore(plan);
    return valueScore > best.valueScore ? { plan, valueScore } : best;
  }, { plan: null, valueScore: 0 });

  if (bestValue.plan) {
    recommendations.push({
      type: 'best_value',
      planId: bestValue.plan._id,
      planName: bestValue.plan.name,
      reason: 'Most features for the price',
      score: bestValue.valueScore
    });
  }

  // Find most popular
  const mostPopular = plans.find(p => p.isPopular);
  if (mostPopular) {
    recommendations.push({
      type: 'most_popular',
      planId: mostPopular._id,
      planName: mostPopular.name,
      reason: 'Most chosen by customers',
      score: 95
    });
  }

  // Find best for teams
  const bestForTeams = plans.find(p => p.maxUsers && p.maxUsers > 10);
  if (bestForTeams) {
    recommendations.push({
      type: 'best_for_teams',
      planId: bestForTeams._id,
      planName: bestForTeams.name,
      reason: 'Best for teams and collaboration',
      score: 90
    });
  }

  return recommendations;
};

const calculateRecommendationScore = (currentPlan, alternativePlan, type) => {
  let score = 50; // Base score

  // Price consideration
  const priceDifference = alternativePlan.currentPrice - currentPlan.currentPrice;
  if (type === 'upgrade' && priceDifference > 0) {
    score += Math.min(20, (priceDifference / currentPlan.currentPrice) * 100);
  } else if (type === 'downgrade' && priceDifference < 0) {
    score += Math.min(20, Math.abs(priceDifference / currentPlan.currentPrice) * 100);
  }

  // Feature consideration
  const featureDifference = alternativePlan.features.length - currentPlan.features.length;
  if (type === 'upgrade' && featureDifference > 0) {
    score += Math.min(20, featureDifference * 5);
  } else if (type === 'downgrade' && featureDifference < 0) {
    score += Math.min(20, Math.abs(featureDifference) * 3);
  }

  // Popularity boost
  if (alternativePlan.isPopular) {
    score += 10;
  }

  return Math.min(100, score);
};

const getAlternativeRecommendation = (currentPlan, alternatives, type) => {
  if (alternatives.length === 0) {
    return `No ${type} options available for ${currentPlan.name}`;
  }

  const bestAlternative = alternatives.reduce((best, alt) => {
    const score = calculateRecommendationScore(currentPlan, alt, type);
    return score > best.score ? { plan: alt, score } : best;
  }, { plan: null, score: 0 });

  if (!bestAlternative.plan) {
    return `Consider staying with ${currentPlan.name}`;
  }

  return {
    recommendedPlan: bestAlternative.plan.name,
    reason: type === 'upgrade' 
      ? 'Best value upgrade with significant feature improvements'
      : 'Most cost-effective option without compromising essential features',
    confidenceScore: bestAlternative.score,
    priceChange: bestAlternative.plan.currentPrice - currentPlan.currentPrice
  };
};

const calculateBestValuePlan = (plans) => {
  if (plans.length === 0) return null;
  
  return plans.reduce((best, plan) => {
    const valueScore = calculateValueScore(plan);
    return valueScore > best.score ? { plan, score: valueScore } : best;
  }, { plan: null, score: 0 }).plan;
};

const calculateConversionRate = (subscriptionStats) => {
  // Simplified calculation
  const totalSubscriptions = subscriptionStats.reduce((sum, stat) => sum + stat.totalSubscriptions, 0);
  const totalPlans = subscriptionStats.length;
  return totalPlans > 0 ? (totalSubscriptions / totalPlans).toFixed(2) : 0;
};

const calculateChurnRisk = (subscriptionStats) => {
  // Simplified risk calculation based on average duration
  const avgDuration = subscriptionStats.reduce((sum, stat) => sum + stat.avgDuration, 0) / subscriptionStats.length;
  if (avgDuration < 30) return 'high';
  if (avgDuration < 90) return 'medium';
  return 'low';
};

module.exports = router;