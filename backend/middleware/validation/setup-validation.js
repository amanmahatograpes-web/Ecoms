const fs = require('fs');
const path = require('path');

const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Create middleware structure
createDirectory(path.join(__dirname, 'src/middleware'));
createDirectory(path.join(__dirname, 'src/middleware/validation'));

// Create validation files
const validationFiles = {
  'src/middleware/validation/product.validation.js': `const { body, validationResult } = require('express-validator');

// Product validation rules
exports.validateProduct = [
  body('title')
    .trim()
    .notEmpty().withMessage('Product title is required')
    .isLength({ max: 500 }).withMessage('Product title cannot exceed 500 characters'),
  
  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required')
    .isLength({ max: 40 }).withMessage('SKU cannot exceed 40 characters')
    .matches(/^[A-Za-z0-9-_]+$/).withMessage('SKU can only contain letters, numbers, hyphens, and underscores'),
  
  body('brand')
    .trim()
    .notEmpty().withMessage('Brand is required')
    .isLength({ max: 50 }).withMessage('Brand name cannot exceed 50 characters'),
  
  body('price')
    .isFloat({ min: 0.01, max: 100000 }).withMessage('Price must be between 0.01 and 100,000'),
  
  body('quantity')
    .isInt({ min: 0, max: 999999 }).withMessage('Quantity must be between 0 and 999,999'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  
  body('bulletPoints')
    .isArray({ min: 1 }).withMessage('At least one bullet point is required'),
  
  body('bulletPoints.*')
    .trim()
    .notEmpty().withMessage('Bullet point cannot be empty')
    .isLength({ max: 500 }).withMessage('Bullet point cannot exceed 500 characters'),
  
  body('asin')
    .optional()
    .matches(/^[A-Z0-9]{10}$/).withMessage('ASIN must be exactly 10 uppercase letters and numbers'),
  
  body('weight')
    .optional()
    .isFloat({ min: 0 }).withMessage('Weight cannot be negative'),
  
  body('dimensions.length')
    .optional()
    .isFloat({ min: 0 }).withMessage('Length cannot be negative'),
  
  body('dimensions.width')
    .optional()
    .isFloat({ min: 0 }).withMessage('Width cannot be negative'),
  
  body('dimensions.height')
    .optional()
    .isFloat({ min: 0 }).withMessage('Height cannot be negative'),
  
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

// Application validation rules
exports.validateApplication = [
  body('productName')
    .trim()
    .notEmpty().withMessage('Product name is required'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  
  body('brand')
    .trim()
    .notEmpty().withMessage('Brand is required'),
  
  body('estimatedSales.monthly')
    .optional()
    .isInt({ min: 0 }).withMessage('Monthly sales estimate cannot be negative'),
  
  body('estimatedSales.annually')
    .optional()
    .isInt({ min: 0 }).withMessage('Annual sales estimate cannot be negative'),
  
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
];`,

  'src/middleware/error.middleware.js': `const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = null;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
    errors = [{
      field: Object.keys(err.keyPattern)[0],
      message: \`\${Object.keys(err.keyPattern)[0]} already exists\`
    }];
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = \`Invalid \${err.path}: \${err.value}\`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorMiddleware;`
};

// Create files
Object.entries(validationFiles).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  createDirectory(dir);
  
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log(`Created file: ${filePath}`);
  } else {
    console.log(`File already exists: ${filePath}`);
  }
});

console.log('\n✅ Validation middleware setup complete!');
console.log('Now install required packages:');
console.log('npm install express-validator');