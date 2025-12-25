const fs = require('fs');
const path = require('path');

const routes = {
  'routes/payment.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Payment API working' }));
module.exports = router;`,

  'routes/plan.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Plan API working' }));
module.exports = router;`,

  'routes/coupon.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Coupon API working' }));
module.exports = router;`,

  'routes/analytics.routes.js': `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Analytics API working' }));
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
module.exports = router;`
};

// Create ecommerce routes
const ecommerceRoutes = [
  'auth', 'user', 'data', 'seller', 'product', 'application', 'media'
];

ecommerceRoutes.forEach(route => {
  routes[`routes/ecommerce/${route}.routes.js`] = `const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: '${route.charAt(0).toUpperCase() + route.slice(1)} API working' }));
module.exports = router;`;
});

// Create directories and files
Object.keys(routes).forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
  
  // Create file if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, routes[filePath]);
    console.log(`Created file: ${filePath}`);
  } else {
    console.log(`File already exists: ${filePath}`);
  }
});

console.log('\n✅ All route files created successfully!');
console.log('Run: node index.js');