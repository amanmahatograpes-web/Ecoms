const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const PricingPlan = require('../../models/PricingPlan');

// Social share validation
exports.validateShare = [
  body('planId')
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid plan ID'),

  body('platform')
    .isIn(['whatsapp', 'facebook', 'twitter', 'instagram', 'linkedin', 'telegram', 'email'])
    .withMessage('Invalid platform'),

  body('recipientData')
    .optional()
    .isObject().withMessage('Recipient data must be an object'),

  body('recipientData.email')
    .if(body('platform').equals('email'))
    .isEmail().withMessage('Valid email is required for email sharing')
    .normalizeEmail(),

  body('recipientData.phoneNumber')
    .if(body('platform').equals('whatsapp'))
    .isMobilePhone('any').withMessage('Valid phone number is required for WhatsApp sharing'),

  body('options')
    .optional()
    .isObject().withMessage('Options must be an object'),

  body('options.customMessage')
    .optional()
    .isLength({ max: 1000 }).withMessage('Custom message must be less than 1000 characters'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Check if plan exists
    const plan = await PricingPlan.findById(req.body.planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Pricing plan not found'
      });
    }

    // Check if plan is active and published
    if (!plan.isActive || !plan.isPublished) {
      return res.status(400).json({
        success: false,
        error: 'Plan is not available for sharing'
      });
    }

    next();
  }
];