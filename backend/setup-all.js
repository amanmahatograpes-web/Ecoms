const fs = require('fs');
const path = require('path');

console.log('🚀 Creating all missing files...\n');

// Create directories
const directories = [
  'routes',
  'src/middleware',
  'src/services/pricing',
  'public/uploads',
  'public/uploads/images',
  'public/uploads/videos',
  'public/uploads/documents',
  'public/uploads/profiles',
  'public/uploads/products'
];

directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Create files
const files = {
  // Middleware
  'middleware/validation.js': `const { body, validationResult } = require('express-validator');

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
];`,

  // Routes
  'routes/coupon.routes.js': `const express = require('express');
const router = express.Router();

// Simple coupon routes
router.get('/', (req, res) => {
  res.json({ 
    message: 'Coupon API is working',
    endpoints: {
      getAll: 'GET /',
      getById: 'GET /:id',
      create: 'POST /',
      update: 'PUT /:id',
      delete: 'DELETE /:id',
      validate: 'POST /validate'
    }
  });
});

router.get('/:id', (req, res) => {
  res.json({ 
    message: 'Get coupon by ID',
    id: req.params.id,
    coupon: {
      id: req.params.id,
      code: 'TEST20',
      discount: 20,
      type: 'percentage'
    }
  });
});

router.post('/', (req, res) => {
  res.json({ 
    message: 'Coupon created successfully',
    data: req.body 
  });
});

router.put('/:id', (req, res) => {
  res.json({ 
    message: 'Coupon updated successfully',
    id: req.params.id,
    data: req.body 
  });
});

router.delete('/:id', (req, res) => {
  res.json({ 
    message: 'Coupon deleted successfully',
    id: req.params.id
  });
});

router.post('/validate', (req, res) => {
  const { code, amount } = req.body;
  
  if (!code || !amount) {
    return res.status(400).json({ 
      success: false, 
      message: 'Code and amount are required' 
    });
  }
  
  res.json({
    success: true,
    message: 'Coupon is valid',
    data: {
      code: code.toUpperCase(),
      discount: 20,
      discountType: 'percentage',
      originalAmount: amount,
      finalAmount: amount * 0.8,
      savings: amount * 0.2
    }
  });
});

module.exports = router;`,

  'routes/payment.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Payment API working' }));
module.exports = router;`,

  'routes/plan.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Plan API working' }));
module.exports = router;`,

  'routes/analytics.routes.js': `const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    message: 'Analytics API is working',
    endpoints: {
      dashboard: 'GET /dashboard',
      sales: 'GET /sales',
      products: 'GET /products',
      customers: 'GET /customers'
    }
  });
});

router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      overview: {
        totalRevenue: 125000,
        totalOrders: 1250,
        totalProducts: 89,
        totalCustomers: 450
      }
    }
  });
});

module.exports = router;`,

  'routes/pricing.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Pricing API working' }));
module.exports = router;`,

  'routes/share.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Share API working' }));
module.exports = router;`,

  'routes/automation.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Automation API working' }));
module.exports = router;`,

  'routes/auth.routes.js': `const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Auth API is working' });
});

router.post('/register', (req, res) => {
  res.json({ 
    success: true,
    message: 'User registered successfully'
  });
});

router.post('/login', (req, res) => {
  res.json({ 
    success: true,
    message: 'Login successful',
    token: 'jwt-token-here'
  });
});

module.exports = router;`,

  'routes/user.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'User API working' }));
module.exports = router;`,

  'routes/data.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Data API working' }));
module.exports = router;`,

  'routes/seller.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Seller API working' }));
module.exports = router;`,

  'routes/product.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Product API working' }));
module.exports = router;`,

  'routes/application.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Application API working' }));
module.exports = router;`,

  'routes/media.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Media API working' }));
module.exports = router;`,

  // Other middleware
  'src/middleware/error.middleware.js': `const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorMiddleware;`,

  'src/services/pricing/automation.service.js': `exports.startAutomationEngine = async () => {
  console.log('🚀 Automation engine started');
  return true;
};

exports.stopAutomationEngine = async () => {
  console.log('🛑 Automation engine stopped');
  return true;
};`
};

// Create all files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create file if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log(`📄 Created file: ${filePath}`);
  } else {
    console.log(`✓ File already exists: ${filePath}`);
  }
});

console.log('\n✅ All files created successfully!');
console.log('\n📋 Next steps:');
console.log('1. Install dependencies: npm install express-validator');
console.log('2. Start server: node index.js');