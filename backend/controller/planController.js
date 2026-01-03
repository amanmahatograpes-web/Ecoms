const Plan = require('../models/Plan');
const asyncHandler = require('express-async-handler');

// @desc    Get all plans
// @route   GET /api/v1/plans
// @access  Public
const getPlans = asyncHandler(async (req, res) => {
    const {
        billingCycle,
        isActive = true,
        isPopular,
        minPrice,
        maxPrice,
        sort = 'price',
        limit = 10,
        page = 1
    } = req.query;

    // Build query
    let query = {};

    // Filter by billing cycle
    if (billingCycle) {
        query.billingCycle = billingCycle;
    }

    // Filter by active status
    query.isActive = isActive === 'true';

    // Filter by popularity
    if (isPopular) {
        query.isPopular = isPopular === 'true';
    }

    // Filter by price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Execute query with pagination
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const plansPromise = Plan.find(query)
        .sort(sort)
        .skip(skip)
        .limit(pageSize);

    const totalPromise = Plan.countDocuments(query);

    const [plans, total] = await Promise.all([plansPromise, totalPromise]);

    // Calculate pagination
    const totalPages = Math.ceil(total / pageSize);

    res.status(200).json({
        success: true,
        count: plans.length,
        total,
        totalPages,
        currentPage: pageNumber,
        data: plans,
        pagination: {
            next: pageNumber < totalPages ? pageNumber + 1 : null,
            prev: pageNumber > 1 ? pageNumber - 1 : null
        }
    });
});

// @desc    Get single plan
// @route   GET /api/v1/plans/:id
// @access  Public
const getPlanById = asyncHandler(async (req, res) => {
    const plan = await Plan.findOne({
        $or: [
            { _id: req.params.id },
            { planId: req.params.id }
        ]
    });

    if (!plan) {
        res.status(404);
        throw new Error('Plan not found');
    }

    res.status(200).json({
        success: true,
        data: plan
    });
});

// @desc    Create new plan
// @route   POST /api/v1/plans
// @access  Private/Admin
const createPlan = asyncHandler(async (req, res) => {
    const {
        name,
        planId,
        description,
        price,
        billingCycle,
        features
    } = req.body;

    // Check if plan already exists
    const planExists = await Plan.findOne({ planId });
    if (planExists) {
        res.status(400);
        throw new Error('Plan with this ID already exists');
    }

    // Create plan
    const plan = await Plan.create({
        name,
        planId,
        description,
        price,
        billingCycle,
        features,
        ...req.body
    });

    res.status(201).json({
        success: true,
        message: 'Plan created successfully',
        data: plan
    });
});

// @desc    Update plan
// @route   PUT /api/v1/plans/:id
// @access  Private/Admin
const updatePlan = asyncHandler(async (req, res) => {
    let plan = await Plan.findById(req.params.id);

    if (!plan) {
        res.status(404);
        throw new Error('Plan not found');
    }

    // Check if planId is being changed and if it already exists
    if (req.body.planId && req.body.planId !== plan.planId) {
        const planIdExists = await Plan.findOne({ 
            planId: req.body.planId,
            _id: { $ne: req.params.id }
        });
        
        if (planIdExists) {
            res.status(400);
            throw new Error('Plan ID already exists');
        }
    }

    plan = await Plan.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
            new: true,
            runValidators: true 
        }
    );

    res.status(200).json({
        success: true,
        message: 'Plan updated successfully',
        data: plan
    });
});

// @desc    Delete plan
// @route   DELETE /api/v1/plans/:id
// @access  Private/Admin
const deletePlan = asyncHandler(async (req, res) => {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
        res.status(404);
        throw new Error('Plan not found');
    }

    // Soft delete (set isActive to false)
    plan.isActive = false;
    await plan.save();

    res.status(200).json({
        success: true,
        message: 'Plan deactivated successfully'
    });
});

// @desc    Get plan statistics
// @route   GET /api/v1/plans/stats
// @access  Private/Admin
const getPlanStats = asyncHandler(async (req, res) => {
    const stats = await Plan.aggregate([
        {
            $match: { isActive: true }
        },
        {
            $group: {
                _id: '$billingCycle',
                count: { $sum: 1 },
                averagePrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                totalValue: { $sum: '$price' }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const totalStats = await Plan.aggregate([
        {
            $match: { isActive: true }
        },
        {
            $group: {
                _id: null,
                totalPlans: { $sum: 1 },
                popularPlans: {
                    $sum: { $cond: ['$isPopular', 1, 0] }
                },
                recommendedPlans: {
                    $sum: { $cond: ['$isRecommended', 1, 0] }
                }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            statsByCycle: stats,
            totals: totalStats[0] || {}
        }
    });
});

module.exports = {
    getPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    getPlanStats
};