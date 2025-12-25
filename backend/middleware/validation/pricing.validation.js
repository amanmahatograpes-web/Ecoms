const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const PricingPlan = require('../../models/PricingPlan');

// Pricing plan validation
exports.validatePricingPlan = [
  body('name')
    .trim()
    .notEmpty().withMessage('Plan name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .customSanitizer((value, { req }) => 
      value.charAt(0).toUpperCase() + value.slice(1)
    ),

  body('description')
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),

  body('basePrice')
    .isFloat({ min: 0 }).withMessage('Base price must be a positive number'),

  body('currentPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Current price must be a positive number'),

  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP']).withMessage('Invalid currency'),

  body('period')
    .optional()
    .isIn(['hour', 'day', 'week', 'month', 'quarter', 'year', 'lifetime']).withMessage('Invalid period'),

  body('category')
    .isIn(['starter', 'growth', 'enterprise', 'custom']).withMessage('Invalid category'),

  body('taxPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Tax percentage must be between 0 and 100'),

  body('features')
    .optional()
    .isArray().withMessage('Features must be an array'),

  body('features.*.name')
    .if(body('features').isArray())
    .notEmpty().withMessage('Feature name is required'),

  body('automationSettings.enabled')
    .optional()
    .isBoolean().withMessage('Automation enabled must be a boolean'),

  body('automationSettings.demandFactor')
    .optional()
    .isFloat({ min: 0.5, max: 2.0 }).withMessage('Demand factor must be between 0.5 and 2.0'),

  body('automationSettings.profitMargin')
    .optional()
    .isFloat({ min: 10, max: 60 }).withMessage('Profit margin must be between 10 and 60'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check for duplicate slug
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');

    const existingPlan = await PricingPlan.findOne({ slug });
    if (existingPlan && (!req.params.id || existingPlan._id.toString() !== req.params.id)) {
      return res.status(409).json({
        success: false,
        error: 'A plan with similar name already exists'
      });
    }

    next();
  }
];

// Price adjustment validation
exports.validatePriceAdjustment = [
  param('id')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid ID format'),

  body('newPrice')
    .isFloat({ min: 0 }).withMessage('New price must be a positive number'),

  body('notes')
    .optional()
    .isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if plan exists
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Pricing plan not found'
      });
    }

    // Check if price change is within reasonable limits
    const oldPrice = plan.currentPrice;
    const newPrice = parseFloat(req.body.newPrice);
    const changePercentage = Math.abs((newPrice - oldPrice) / oldPrice) * 100;

    if (changePercentage > 50 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Price change exceeds 50%. Admin approval required.'
      });
    }

    next();
  }
];