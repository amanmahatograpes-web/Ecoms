const { query, validationResult } = require('express-validator');

// Analytics query validation
exports.validateAnalyticsQuery = [
  query('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be in ISO 8601 format'),

  query('endDate')
    .optional()
    .isISO8601().withMessage('End date must be in ISO 8601 format'),

  query('timeframe')
    .optional()
    .isIn(['24h', '7d', '30d', '90d', 'all']).withMessage('Invalid timeframe'),

  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Ensure end date is after start date if both are provided
    if (req.query.startDate && req.query.endDate) {
      const start = new Date(req.query.startDate);
      const end = new Date(req.query.endDate);
      
      if (end < start) {
        return res.status(400).json({
          success: false,
          error: 'End date must be after start date'
        });
      }

      // Limit date range to 1 year for performance
      const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
      if (end - start > maxRange) {
        return res.status(400).json({
          success: false,
          error: 'Date range cannot exceed 1 year'
        });
      }
    }

    next();
  }
];