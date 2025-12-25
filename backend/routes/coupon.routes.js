const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { 
  authenticate, 
  authorize, 
  hasPermission,
  validateRequest,
  asyncHandler 
} = require('../middleware');

// Import validation schemas
const { 
  couponSchema, 
  validateCouponSchema,
  updateCouponSchema 
} = require('../middleware/validation/couponValidation');

// Utility functions
const generateCouponCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const calculateDiscount = (coupon, amount) => {
  let discount = 0;
  
  if (coupon.discountType === 'percentage') {
    discount = (amount * coupon.discountValue) / 100;
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discount = coupon.discountValue;
  } else if (coupon.discountType === 'free_shipping') {
    // Special handling for free shipping coupons
    discount = coupon.discountValue || 0;
  }
  
  return discount;
};

/**
 * @desc    Get all coupons with filters and pagination
 * @route   GET /api/v1/coupons
 * @access  Private/Admin
 */
router.get(
  '/',
  authenticate,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      discountType, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;
    
    // Build filter
    const filter = {};
    
    // Status filter
    if (status) {
      if (status === 'active') {
        filter.isActive = true;
        filter.$or = [
          { validUntil: { $exists: false } },
          { validUntil: { $gte: new Date() } }
        ];
        filter.$or.push({ validFrom: { $lte: new Date() } }, { validFrom: { $exists: false } });
      } else if (status === 'expired') {
        filter.validUntil = { $lt: new Date() };
      } else if (status === 'upcoming') {
        filter.validFrom = { $gt: new Date() };
      } else if (status === 'inactive') {
        filter.isActive = false;
      }
    }
    
    // Discount type filter
    if (discountType) {
      filter.discountType = discountType;
    }
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);
    
    // Execute queries in parallel
    const [coupons, total, stats] = await Promise.all([
      // Get paginated coupons
      Coupon.find(filter)
        .select('-__v')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      
      // Get total count
      Coupon.countDocuments(filter),
      
      // Get quick stats
      Coupon.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalDiscounts: { $sum: '$discountValue' },
            totalUsage: { $sum: '$usedCount' },
            activeCoupons: {
              $sum: {
                $cond: [{ $eq: ['$isActive', true] }, 1, 0]
              }
            }
          }
        }
      ])
    ]);
    
    // Add validation status to each coupon
    const couponsWithStatus = coupons.map(coupon => ({
      ...coupon,
      validationStatus: getCouponStatus(coupon)
    }));
    
    res.json({
      success: true,
      data: {
        coupons: couponsWithStatus,
        pagination: {
          total,
          page: parseInt(page),
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
          hasNext: skip + limitNum < total,
          hasPrev: page > 1
        },
        stats: stats[0] || {
          totalDiscounts: 0,
          totalUsage: 0,
          activeCoupons: 0
        },
        filters: {
          status,
          discountType,
          search,
          startDate,
          endDate
        }
      }
    });
  })
);

/**
 * @desc    Get single coupon by ID
 * @route   GET /api/v1/coupons/:id
 * @access  Private/Admin
 */
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id).lean();
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'COUPON_NOT_FOUND',
        message: 'Coupon not found'
      });
    }
    
    // Get usage history (if implemented)
    const usageHistory = await getCouponUsageHistory(id);
    
    res.json({
      success: true,
      data: {
        ...coupon,
        validationStatus: getCouponStatus(coupon),
        usageHistory
      }
    });
  })
);

/**
 * @desc    Get coupon by code
 * @route   GET /api/v1/coupons/code/:code
 * @access  Private/Admin
 */
router.get(
  '/code/:code',
  authenticate,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { code } = req.params;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase() 
    }).lean();
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'COUPON_NOT_FOUND',
        message: 'Coupon not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        ...coupon,
        validationStatus: getCouponStatus(coupon)
      }
    });
  })
);

/**
 * @desc    Create new coupon
 * @route   POST /api/v1/coupons
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest(couponSchema),
  asyncHandler(async (req, res) => {
    const {
      code,
      discountType,
      discountValue,
      minimumPurchase,
      maximumDiscount,
      usageLimit,
      validFrom,
      validUntil,
      isActive = true,
      description,
      applicableCategories,
      excludedProducts,
      singleUsePerUser = false,
      firstOrderOnly = false
    } = req.body;
    
    // Generate code if not provided
    let couponCode = code;
    if (!couponCode) {
      couponCode = generateCouponCode();
      // Ensure uniqueness
      let isUnique = false;
      while (!isUnique) {
        const existing = await Coupon.findOne({ code: couponCode });
        if (!existing) isUnique = true;
        else couponCode = generateCouponCode();
      }
    } else {
      // Check if code already exists
      const existingCoupon = await Coupon.findOne({ 
        code: couponCode.toUpperCase() 
      });
      
      if (existingCoupon) {
        return res.status(409).json({
          success: false,
          error: 'COUPON_EXISTS',
          message: 'Coupon code already exists'
        });
      }
    }
    
    // Validate dates
    if (validFrom && validUntil && new Date(validFrom) >= new Date(validUntil)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_DATES',
        message: 'Valid from date must be before valid until date'
      });
    }
    
    // Create coupon
    const coupon = await Coupon.create({
      code: couponCode.toUpperCase(),
      discountType,
      discountValue,
      minimumPurchase: minimumPurchase || 0,
      maximumDiscount,
      usageLimit: usageLimit || null,
      validFrom: validFrom || new Date(),
      validUntil,
      isActive,
      description,
      applicableCategories,
      excludedProducts,
      singleUsePerUser,
      firstOrderOnly,
      createdBy: req.user.userId,
      metadata: {
        createdVia: 'admin_panel',
        campaign: req.body.campaign || null
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  })
);

/**
 * @desc    Bulk create coupons
 * @route   POST /api/v1/coupons/bulk
 * @access  Private/Admin
 */
router.post(
  '/bulk',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { 
      count = 1, 
      prefix = 'CPN', 
      discountType, 
      discountValue,
      ...commonFields 
    } = req.body;
    
    if (count > 100) {
      return res.status(400).json({
        success: false,
        error: 'TOO_MANY_COUPONS',
        message: 'Cannot generate more than 100 coupons at once'
      });
    }
    
    const coupons = [];
    const errors = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const code = `${prefix}${generateCouponCode(6)}`;
        
        // Check uniqueness
        const existing = await Coupon.findOne({ code });
        if (existing) {
          errors.push({ code, error: 'Code already exists' });
          continue;
        }
        
        const coupon = await Coupon.create({
          code,
          discountType,
          discountValue,
          ...commonFields,
          createdBy: req.user.userId,
          metadata: {
            createdVia: 'bulk_generation',
            batchId: `batch_${Date.now()}`
          }
        });
        
        coupons.push(coupon);
      } catch (error) {
        errors.push({ index: i, error: error.message });
      }
    }
    
    res.status(201).json({
      success: true,
      message: `Generated ${coupons.length} coupons successfully`,
      data: {
        coupons,
        errors: errors.length > 0 ? errors : undefined,
        summary: {
          totalRequested: count,
          created: coupons.length,
          failed: errors.length
        }
      }
    });
  })
);

/**
 * @desc    Update coupon
 * @route   PUT /api/v1/coupons/:id
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(updateCouponSchema),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'COUPON_NOT_FOUND',
        message: 'Coupon not found'
      });
    }
    
    // Prevent updates to used coupons for certain fields
    if (coupon.usedCount > 0) {
      const restrictedFields = ['code', 'discountType', 'discountValue'];
      restrictedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          return res.status(400).json({
            success: false,
            error: 'CANNOT_UPDATE_USED_COUPON',
            message: `Cannot update ${field} for a coupon that has been used`
          });
        }
      });
    }
    
    // Update fields
    const updatableFields = [
      'minimumPurchase',
      'maximumDiscount',
      'usageLimit',
      'validFrom',
      'validUntil',
      'isActive',
      'description',
      'applicableCategories',
      'excludedProducts',
      'singleUsePerUser',
      'firstOrderOnly'
    ];
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        coupon[field] = req.body[field];
      }
    });
    
    // Update metadata
    coupon.metadata = {
      ...coupon.metadata,
      lastUpdatedBy: req.user.userId,
      lastUpdatedAt: new Date(),
      updateReason: req.body.updateReason
    };
    
    await coupon.save();
    
    res.json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  })
);

/**
 * @desc    Toggle coupon active status
 * @route   PATCH /api/v1/coupons/:id/toggle
 * @access  Private/Admin
 */
router.patch(
  '/:id/toggle',
  authenticate,
  authorize('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'COUPON_NOT_FOUND',
        message: 'Coupon not found'
      });
    }
    
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    
    res.json({
      success: true,
      message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: coupon._id,
        code: coupon.code,
        isActive: coupon.isActive
      }
    });
  })
);

/**
 * @desc    Delete coupon
 * @route   DELETE /api/v1/coupons/:id
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { force = false } = req.query;
    
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'COUPON_NOT_FOUND',
        message: 'Coupon not found'
      });
    }
    
    // Check if coupon has been used
    if (coupon.usedCount > 0 && !force) {
      return res.status(400).json({
        success: false,
        error: 'COUPON_IN_USE',
        message: 'Coupon has been used. Use force=true to delete anyway.'
      });
    }
    
    // Soft delete (mark as inactive and archived)
    coupon.isActive = false;
    coupon.isArchived = true;
    coupon.archivedAt = new Date();
    coupon.archivedBy = req.user.userId;
    await coupon.save();
    
    // Or hard delete if force is true
    if (force) {
      await coupon.deleteOne();
    }
    
    res.json({
      success: true,
      message: force ? 'Coupon permanently deleted' : 'Coupon archived successfully',
      data: {
        id: coupon._id,
        code: coupon.code,
        deleted: force
      }
    });
  })
);

/**
 * @desc    Validate coupon
 * @route   POST /api/v1/coupons/validate
 * @access  Public/Private
 */
router.post(
  '/validate',
  validateRequest(validateCouponSchema),
  asyncHandler(async (req, res) => {
    const { 
      code, 
      amount = 0, 
      userId,
      cartItems = [],
      shippingAddress = {}
    } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase() 
    }).lean();
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'INVALID_COUPON',
        message: 'Invalid coupon code'
      });
    }
    
    // Validate coupon
    const validation = await validateCoupon(coupon, {
      amount,
      userId,
      cartItems,
      shippingAddress
    });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errorCode || 'COUPON_VALIDATION_FAILED',
        message: validation.message,
        data: {
          couponCode: coupon.code,
          validationDetails: validation.details
        }
      });
    }
    
    // Calculate discount
    const discount = calculateDiscount(coupon, amount);
    const finalAmount = Math.max(0, amount - discount);
    
    res.json({
      success: true,
      message: 'Coupon is valid',
      data: {
        coupon: {
          id: coupon._id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minimumPurchase: coupon.minimumPurchase,
          maximumDiscount: coupon.maximumDiscount,
          description: coupon.description,
          validUntil: coupon.validUntil
        },
        discountDetails: {
          discountAmount: discount,
          discountPercentage: coupon.discountType === 'percentage' ? coupon.discountValue : null,
          originalAmount: amount,
          finalAmount,
          savings: discount
        },
        validation: {
          isValid: true,
          validatedAt: new Date(),
          validationId: `val_${Date.now()}`
        }
      }
    });
  })
);

/**
 * @desc    Apply coupon (with usage tracking)
 * @route   POST /api/v1/coupons/apply
 * @access  Private
 */
router.post(
  '/apply',
  authenticate,
  validateRequest(validateCouponSchema),
  asyncHandler(async (req, res) => {
    const { 
      code, 
      amount, 
      orderId,
      cartItems = []
    } = req.body;
    
    const userId = req.user.userId;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase() 
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'INVALID_COUPON',
        message: 'Invalid coupon code'
      });
    }
    
    // Validate coupon
    const validation = await validateCoupon(coupon, {
      amount,
      userId,
      cartItems
    });
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errorCode,
        message: validation.message
      });
    }
    
    // Calculate discount
    const discount = calculateDiscount(coupon, amount);
    const finalAmount = Math.max(0, amount - discount);
    
    // Increment usage count
    coupon.usedCount += 1;
    coupon.lastUsedAt = new Date();
    coupon.lastUsedBy = userId;
    
    // Add to usage history
    coupon.usageHistory.push({
      orderId,
      userId,
      amount,
      discount,
      appliedAt: new Date(),
      ipAddress: req.ip
    });
    
    await coupon.save();
    
    // Track user's coupon usage if single use per user
    if (coupon.singleUsePerUser) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { usedCoupons: coupon._id }
      });
    }
    
    res.json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        coupon: {
          id: coupon._id,
          code: coupon.code,
          discountType: coupon.discountType
        },
        orderDetails: {
          orderId,
          originalAmount: amount,
          discount,
          finalAmount,
          couponSavings: discount
        },
        usage: {
          usedCount: coupon.usedCount,
          remainingUses: coupon.usageLimit ? coupon.usageLimit - coupon.usedCount : null
        }
      }
    });
  })
);

/**
 * @desc    Get coupon statistics and analytics
 * @route   GET /api/v1/coupons/stats/overview
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
      totalStats,
      typeDistribution,
      usageTrend,
      topCoupons,
      recentUsage
    ] = await Promise.all([
      // Total statistics
      Coupon.aggregate([
        {
          $group: {
            _id: null,
            totalCoupons: { $sum: 1 },
            activeCoupons: {
              $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
            },
            expiredCoupons: {
              $sum: {
                $cond: [
                  { $and: [
                    { $ne: ['$validUntil', null] },
                    { $lt: ['$validUntil', new Date()] }
                  ]},
                  1,
                  0
                ]
              }
            },
            totalDiscountsGiven: { $sum: { $multiply: ['$usedCount', '$discountValue'] } },
            totalUsage: { $sum: '$usedCount' },
            avgDiscountValue: { $avg: '$discountValue' }
          }
        }
      ]),
      
      // Distribution by type
      Coupon.aggregate([
        {
          $group: {
            _id: '$discountType',
            count: { $sum: 1 },
            totalUsage: { $sum: '$usedCount' },
            avgDiscount: { $avg: '$discountValue' }
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      // Usage trend over time
      Coupon.aggregate([
        { $unwind: '$usageHistory' },
        { $match: dateFilter },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$usageHistory.appliedAt' }
            },
            dailyUsage: { $sum: 1 },
            totalDiscount: { $sum: '$usageHistory.discount' }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]),
      
      // Top performing coupons
      Coupon.find()
        .sort({ usedCount: -1 })
        .limit(10)
        .select('code discountType discountValue usedCount lastUsedAt isActive')
        .lean(),
      
      // Recent coupon usage
      Coupon.aggregate([
        { $unwind: '$usageHistory' },
        { $match: dateFilter },
        { $sort: { 'usageHistory.appliedAt': -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: 'usageHistory.userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            couponCode: '$code',
            discountType: 1,
            discountAmount: '$usageHistory.discount',
            orderAmount: '$usageHistory.amount',
            userName: '$user.name',
            userEmail: '$user.email',
            appliedAt: '$usageHistory.appliedAt',
            orderId: '$usageHistory.orderId'
          }
        }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        overview: totalStats[0] || {
          totalCoupons: 0,
          activeCoupons: 0,
          expiredCoupons: 0,
          totalDiscountsGiven: 0,
          totalUsage: 0,
          avgDiscountValue: 0
        },
        distribution: {
          byType: typeDistribution,
          byStatus: {
            active: totalStats[0]?.activeCoupons || 0,
            expired: totalStats[0]?.expiredCoupons || 0,
            upcoming: 0 // Would need additional query
          }
        },
        trends: {
          usage: usageTrend,
          efficiency: {
            usageRate: totalStats[0]?.totalCoupons ? 
              (totalStats[0]?.totalUsage / totalStats[0]?.totalCoupons * 100).toFixed(2) : 0
          }
        },
        performance: {
          topCoupons,
          recentUsage
        },
        summary: {
          totalSavings: totalStats[0]?.totalDiscountsGiven || 0,
          averageSavingsPerOrder: totalStats[0]?.totalUsage ? 
            (totalStats[0]?.totalDiscountsGiven / totalStats[0]?.totalUsage).toFixed(2) : 0,
          conversionRate: 'N/A' // Would need order data
        }
      }
    });
  })
);

/**
 * @desc    Export coupons
 * @route   GET /api/v1/coupons/export
 * @access  Private/Admin
 */
router.get(
  '/export',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const { format = 'json' } = req.query;
    
    const coupons = await Coupon.find({})
      .select('-__v -usageHistory')
      .sort({ createdAt: -1 })
      .lean();
    
    if (format === 'csv') {
      // Convert to CSV
      const csvData = convertToCSV(coupons);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=coupons_${Date.now()}.csv`);
      return res.send(csvData);
    }
    
    // Default to JSON
    res.json({
      success: true,
      data: coupons,
      metadata: {
        exportedAt: new Date().toISOString(),
        count: coupons.length,
        format: 'json'
      }
    });
  })
);

// Helper functions
const getCouponStatus = (coupon) => {
  const now = new Date();
  
  if (!coupon.isActive) {
    return { status: 'inactive', message: 'Coupon is inactive' };
  }
  
  if (coupon.validFrom && now < new Date(coupon.validFrom)) {
    return { status: 'upcoming', message: 'Coupon is not yet valid' };
  }
  
  if (coupon.validUntil && now > new Date(coupon.validUntil)) {
    return { status: 'expired', message: 'Coupon has expired' };
  }
  
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { status: 'limit_reached', message: 'Coupon usage limit reached' };
  }
  
  return { status: 'active', message: 'Coupon is active and valid' };
};

const validateCoupon = async (coupon, context) => {
  const {
    amount = 0,
    userId,
    cartItems = []
  } = context;
  
  const now = new Date();
  const validation = {
    isValid: true,
    message: 'Coupon is valid',
    details: []
  };
  
  // Check if active
  if (!coupon.isActive) {
    return {
      isValid: false,
      errorCode: 'COUPON_INACTIVE',
      message: 'This coupon is inactive',
      details: ['Coupon is marked as inactive']
    };
  }
  
  // Check validity dates
  if (coupon.validFrom && now < new Date(coupon.validFrom)) {
    return {
      isValid: false,
      errorCode: 'COUPON_NOT_YET_VALID',
      message: 'Coupon is not yet valid',
      details: [`Valid from ${new Date(coupon.validFrom).toLocaleDateString()}`]
    };
  }
  
  if (coupon.validUntil && now > new Date(coupon.validUntil)) {
    return {
      isValid: false,
      errorCode: 'COUPON_EXPIRED',
      message: 'Coupon has expired',
      details: [`Expired on ${new Date(coupon.validUntil).toLocaleDateString()}`]
    };
  }
  
  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return {
      isValid: false,
      errorCode: 'USAGE_LIMIT_REACHED',
      message: 'Coupon usage limit has been reached',
      details: [`Used ${coupon.usedCount} times out of ${coupon.usageLimit}`]
    };
  }
  
  // Check minimum purchase
  if (coupon.minimumPurchase && amount < coupon.minimumPurchase) {
    return {
      isValid: false,
      errorCode: 'MINIMUM_PURCHASE_REQUIRED',
      message: `Minimum purchase of ${coupon.minimumPurchase} required`,
      details: [`Current amount: ${amount}`]
    };
  }
  
  // Check single use per user
  if (coupon.singleUsePerUser && userId) {
    const userUsedCoupon = await checkUserCouponUsage(userId, coupon._id);
    if (userUsedCoupon) {
      return {
        isValid: false,
        errorCode: 'ALREADY_USED_BY_USER',
        message: 'You have already used this coupon',
        details: ['Single use per user restriction']
      };
    }
  }
  
  // Check first order only
  if (coupon.firstOrderOnly && userId) {
    const userOrderCount = await getUserOrderCount(userId);
    if (userOrderCount > 0) {
      return {
        isValid: false,
        errorCode: 'NOT_FIRST_ORDER',
        message: 'This coupon is for first orders only',
        details: [`User has ${userOrderCount} previous orders`]
      };
    }
  }
  
  // Check applicable categories
  if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
    const hasApplicableItem = cartItems.some(item => 
      coupon.applicableCategories.includes(item.categoryId)
    );
    if (!hasApplicableItem) {
      return {
        isValid: false,
        errorCode: 'CATEGORY_RESTRICTED',
        message: 'Coupon not applicable to items in cart',
        details: [`Applicable to categories: ${coupon.applicableCategories.join(', ')}`]
      };
    }
  }
  
  // Check excluded products
  if (coupon.excludedProducts && coupon.excludedProducts.length > 0) {
    const hasExcludedItem = cartItems.some(item => 
      coupon.excludedProducts.includes(item.productId)
    );
    if (hasExcludedItem) {
      return {
        isValid: false,
        errorCode: 'EXCLUDED_PRODUCT',
        message: 'Coupon cannot be used with items in cart',
        details: [`Excludes products: ${coupon.excludedProducts.join(', ')}`]
      };
    }
  }
  
  return validation;
};

const checkUserCouponUsage = async (userId, couponId) => {
  // This would check in Order collection
  const orderWithCoupon = await Order.findOne({
    userId,
    'coupon.couponId': couponId,
    status: { $in: ['completed', 'processing'] }
  });
  
  return !!orderWithCoupon;
};

const getUserOrderCount = async (userId) => {
  return await Order.countDocuments({
    userId,
    status: { $in: ['completed', 'processing', 'shipped'] }
  });
};

const getCouponUsageHistory = async (couponId) => {
  return await Order.find({
    'coupon.couponId': couponId,
    status: { $in: ['completed', 'processing', 'shipped'] }
  })
  .sort({ createdAt: -1 })
  .limit(20)
  .select('orderNumber totalAmount discountAmount createdAt user')
  .populate('user', 'name email')
  .lean();
};

const convertToCSV = (data) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item)
      .map(val => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val).replace(/,/g, ';');
      })
      .join(',')
  );
  
  return [headers, ...rows].join('\n');
};

module.exports = router;