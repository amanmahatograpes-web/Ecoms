// middleware/index.js
const authMiddleware = require('./auth.middleware');
const errorMiddleware = require('./error.middleware');
const { validateCoupon } = require('./validation');

// Placeholder functions for missing middleware
const authenticate = authMiddleware; // Use authMiddleware as authenticate
const authorize = (req, res, next) => next(); // Placeholder
const hasPermission = (permission) => (req, res, next) => next(); // Placeholder
const validateRequest = (req, res, next) => next(); // Placeholder

// Async handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  authenticate,
  authorize,
  hasPermission,
  validateRequest,
  asyncHandler,
  authMiddleware,
  errorMiddleware,
  validateCoupon
};