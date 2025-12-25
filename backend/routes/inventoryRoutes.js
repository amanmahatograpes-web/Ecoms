const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventoryController');
const { body, param, query } = require('express-validator');

// Validation middleware
const validateInventory = [
  body('sku').notEmpty().withMessage('SKU is required'),
  body('productName').notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('currentStock').isNumeric().withMessage('Current stock must be a number'),
  body('unitCost').isNumeric().withMessage('Unit cost must be a number'),
  body('sellingPrice').isNumeric().withMessage('Selling price must be a number')
];

// Get inventory planning data
router.get(
  '/planning',
  [
    query('range').optional().isIn(['7d', '30d', '90d', '1y', 'custom']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['urgency', 'stock', 'value', 'sales', 'created'])
  ],
  inventoryController.getInventoryPlanning
);

// Get inventory analytics
router.get('/analytics', inventoryController.getInventoryAnalytics);

// Create bulk reorder
router.post(
  '/bulk-reorder',
  [
    body('items').isArray().withMessage('Items must be an array'),
    body('items.*.inventoryId').notEmpty().withMessage('Inventory ID is required'),
    body('supplierId').notEmpty().withMessage('Supplier ID is required'),
    body('expectedDeliveryDate').isISO8601().withMessage('Invalid date format')
  ],
  inventoryController.createBulkReorder
);

// Update inventory stock
router.put(
  '/:id/stock',
  [
    param('id').isMongoId().withMessage('Invalid inventory ID'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('action').isIn(['receive', 'sell', 'adjust', 'return']).withMessage('Invalid action')
  ],
  inventoryController.updateStock
);

// Get inventory by ID
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid inventory ID'),
  inventoryController.getInventoryById
);

// Create new inventory item
router.post('/', validateInventory, inventoryController.createInventory);

// Update inventory item
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid inventory ID'),
    ...validateInventory
  ],
  inventoryController.updateInventory
);

// Delete inventory item
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid inventory ID'),
  inventoryController.deleteInventory
);

// Export inventory data
router.get(
  '/export',
  [
    query('format').optional().isIn(['json', 'csv', 'excel']),
    query('range').optional().isIn(['7d', '30d', '90d', '1y', 'all'])
  ],
  inventoryController.exportInventory
);

module.exports = router;