const { body, validationResult } = require('express-validator');

// Coupon validation middleware
exports.validateCoupon = [
  body('code')
    .notEmpty().withMessage('Coupon code is required')
    .isLength({ min: 3, max: 20 }).withMessage('Code must be 3-20 characters')
    .matches(/^[A-Z0-9]+$/).withMessage('Code must be uppercase alphanumeric'),
  
  body('discountType')
    .notEmpty().withMessage('Discount type is required')
    .isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
  
  body('discountValue')
    .notEmpty().withMessage('Discount value is required')
    .isFloat({ min: 0 }).withMessage('Discount must be positive number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    next();
  }
];