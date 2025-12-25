// const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');

// const inventorySchema = new mongoose.Schema({
//   // Basic Information
//   inventoryId: {
//     type: String,
//     required: true,
//     unique: true,
//     default: () => `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`
//   },
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   sku: {
//     type: String,
//     required: [true, 'SKU is required'],
//     unique: true,
//     index: true
//   },
//   fnsku: {
//     type: String,
//     unique: true,
//     sparse: true
//   },
//   asin: {
//     type: String,
//     required: [true, 'ASIN is required'],
//     index: true
//   },
  
//   // Product Details
//   productName: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true
//   },
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     enum: [
//       'Electronics',
//       'Books',
//       'Home & Kitchen',
//       'Clothing',
//       'Beauty & Personal Care',
//       'Sports & Outdoors',
//       'Toys & Games',
//       'Automotive',
//       'Health & Household',
//       'Grocery',
//       'Office Products',
//       'Pet Supplies',
//       'Baby',
//       'Tools & Home Improvement',
//       'Industrial & Scientific'
//     ],
//     index: true
//   },
//   subCategory: {
//     type: String,
//     default: ''
//   },
//   brand: {
//     type: String,
//     required: [true, 'Brand is required'],
//     index: true
//   },
  
//   // Stock Information
//   currentStock: {
//     type: Number,
//     required: true,
//     default: 0,
//     min: 0
//   },
//   availableQuantity: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   inboundQuantity: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   reservedQuantity: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   damagedQuantity: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
  
//   // Planning Levels
//   reorderPoint: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   safetyStock: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
//   maxStockLevel: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   optimalStockLevel: {
//     type: Number,
//     default: 0,
//     min: 0
//   },
  
//   // Sales & Performance
//   dailySales: {
//     type: Number,
//     default: 0
//   },
//   weeklySales: {
//     type: Number,
//     default: 0
//   },
//   monthlySales: {
//     type: Number,
//     default: 0
//   },
//   salesVelocity: {
//     type: Number,
//     default: 0
//   },
//   avgDailySales: {
//     type: Number,
//     default: 0
//   },
//   salesTrend: {
//     type: String,
//     enum: ['increasing', 'stable', 'decreasing', 'seasonal'],
//     default: 'stable'
//   },
  
//   // Financial Information
//   unitCost: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   sellingPrice: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   profitMargin: {
//     type: Number,
//     default: 0
//   },
//   inventoryValue: {
//     type: Number,
//     default: 0
//   },
  
//   // Warehouse & Fulfillment
//   warehouse: {
//     type: String,
//     required: true,
//     enum: ['FBA-1', 'FBA-2', 'FBA-3', 'FBM-1', 'FBM-2', 'FBM-3', '3PL-1', '3PL-2'],
//     default: 'FBA-1'
//   },
//   fulfillmentChannel: {
//     type: String,
//     enum: ['FBA', 'FBM', 'SFP'],
//     default: 'FBA'
//   },
//   storageType: {
//     type: String,
//     enum: ['standard', 'oversize', 'dangerous', 'refrigerated'],
//     default: 'standard'
//   },
  
//   // Supplier Information
//   supplierId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Supplier'
//   },
//   supplierName: {
//     type: String,
//     default: ''
//   },
//   leadTimeDays: {
//     type: Number,
//     default: 7,
//     min: 1
//   },
//   minimumOrderQuantity: {
//     type: Number,
//     default: 1
//   },
  
//   // Status & Health
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'stranded', 'out_of_stock', 'excess', 'low_stock', 'healthy'],
//     default: 'active',
//     index: true
//   },
//   healthScore: {
//     type: Number,
//     default: 100,
//     min: 0,
//     max: 100
//   },
//   urgencyLevel: {
//     type: String,
//     enum: ['critical', 'high', 'medium', 'low', 'excess'],
//     default: 'low'
//   },
  
//   // Forecast Data
//   forecast30Days: {
//     type: Number,
//     default: 0
//   },
//   forecast60Days: {
//     type: Number,
//     default: 0
//   },
//   forecast90Days: {
//     type: Number,
//     default: 0
//   },
//   forecastAccuracy: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
  
//   // Metrics & Calculations
//   daysOfCoverage: {
//     type: Number,
//     default: 0
//   },
//   turnoverRate: {
//     type: Number,
//     default: 0
//   },
//   sellThroughRate: {
//     type: Number,
//     default: 0
//   },
//   gmroi: {
//     type: Number,
//     default: 0
//   },
  
//   // Alerts & Notifications
//   lastReorderDate: {
//     type: Date
//   },
//   nextReorderDate: {
//     type: Date
//   },
//   stockOutRiskDate: {
//     type: Date
//   },
  
//   // Historical Data
//   stockHistory: [{
//     date: {
//       type: Date,
//       default: Date.now
//     },
//     quantity: Number,
//     type: {
//       type: String,
//       enum: ['inbound', 'outbound', 'adjustment', 'damage']
//     },
//     notes: String
//   }],
  
//   // Timestamps
//   lastUpdated: {
//     type: Date,
//     default: Date.now
//   },
  
//   // Metadata
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   isArchived: {
//     type: Boolean,
//     default: false
//   },
//   tags: [{
//     type: String
//   }]
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Add pagination plugin
// inventorySchema.plugin(mongoosePaginate);

// // Indexes for better query performance
// inventorySchema.index({ sku: 1, asin: 1 });
// inventorySchema.index({ status: 1, urgencyLevel: 1 });
// inventorySchema.index({ category: 1, subCategory: 1 });
// inventorySchema.index({ warehouse: 1, fulfillmentChannel: 1 });
// inventorySchema.index({ healthScore: -1 });
// inventorySchema.index({ daysOfCoverage: 1 });
// inventorySchema.index({ updatedAt: -1 });
// inventorySchema.index({ 
//   status: 1, 
//   category: 1, 
//   warehouse: 1, 
//   updatedAt: -1 
// });

// // Virtuals
// inventorySchema.virtual('totalQuantity').get(function() {
//   return this.currentStock + this.inboundQuantity;
// });

// inventorySchema.virtual('availableForSale').get(function() {
//   return this.availableQuantity - this.reservedQuantity;
// });

// inventorySchema.virtual('stockoutRisk').get(function() {
//   if (this.avgDailySales === 0) return 0;
//   return this.currentStock / this.avgDailySales;
// });

// inventorySchema.virtual('suggestedOrderQuantity').get(function() {
//   if (this.currentStock <= this.reorderPoint) {
//     return Math.max(
//       this.minimumOrderQuantity,
//       this.maxStockLevel - this.currentStock
//     );
//   }
//   return 0;
// });

// inventorySchema.virtual('coverageDays').get(function() {
//   if (this.avgDailySales === 0) return 999;
//   return Math.floor(this.currentStock / this.avgDailySales);
// });

// inventorySchema.virtual('projectedCoverageDays').get(function() {
//   if (this.avgDailySales === 0) return 999;
//   const projectedStock = this.currentStock + this.suggestedOrderQuantity - this.forecast30Days;
//   return Math.floor(projectedStock / this.avgDailySales);
// });

// // Pre-save middleware
// inventorySchema.pre('save', function(next) {
//   // Calculate inventory value
//   this.inventoryValue = this.currentStock * this.unitCost;
  
//   // Calculate profit margin
//   if (this.sellingPrice > 0 && this.unitCost > 0) {
//     this.profitMargin = ((this.sellingPrice - this.unitCost) / this.sellingPrice) * 100;
//   }
  
//   // Calculate days of coverage
//   if (this.avgDailySales > 0) {
//     this.daysOfCoverage = Math.floor(this.currentStock / this.avgDailySales);
//   }
  
//   // Update status based on stock levels
//   if (this.currentStock === 0) {
//     this.status = 'out_of_stock';
//     this.urgencyLevel = 'critical';
//   } else if (this.currentStock <= this.safetyStock) {
//     this.status = 'low_stock';
//     this.urgencyLevel = 'high';
//   } else if (this.currentStock > this.maxStockLevel * 1.5) {
//     this.status = 'excess';
//     this.urgencyLevel = 'excess';
//   } else if (this.currentStock <= this.reorderPoint) {
//     this.status = 'low_stock';
//     this.urgencyLevel = 'medium';
//   } else {
//     this.status = 'healthy';
//     this.urgencyLevel = 'low';
//   }
  
//   // Calculate health score
//   this.calculateHealthScore();
  
//   // Calculate stock out risk date
//   if (this.avgDailySales > 0) {
//     const daysUntilStockout = Math.floor(this.currentStock / this.avgDailySales);
//     this.stockOutRiskDate = new Date(Date.now() + daysUntilStockout * 24 * 60 * 60 * 1000);
//   }
  
//   // Set next reorder date
//   if (this.currentStock <= this.reorderPoint) {
//     this.nextReorderDate = new Date(Date.now() + this.leadTimeDays * 24 * 60 * 60 * 1000);
//   }
  
//   next();
// });

// // Instance methods
// inventorySchema.methods.calculateHealthScore = function() {
//   let score = 100;
  
//   // Deduct for low stock
//   if (this.currentStock <= this.safetyStock) {
//     score -= 40;
//   } else if (this.currentStock <= this.reorderPoint) {
//     score -= 20;
//   }
  
//   // Deduct for excess stock
//   if (this.currentStock > this.maxStockLevel * 1.5) {
//     score -= 30;
//   }
  
//   // Deduct for low sales velocity
//   if (this.salesVelocity < 0.5) {
//     score -= 15;
//   }
  
//   // Add for good coverage
//   if (this.coverageDays >= 30 && this.coverageDays <= 60) {
//     score += 10;
//   }
  
//   // Deduct for poor coverage
//   if (this.coverageDays < 7) {
//     score -= 25;
//   } else if (this.coverageDays > 90) {
//     score -= 20;
//   }
  
//   this.healthScore = Math.max(0, Math.min(100, score));
// };

// inventorySchema.methods.updateStock = async function(quantity, type = 'adjustment', notes = '') {
//   const oldStock = this.currentStock;
//   this.currentStock += quantity;
  
//   // Add to stock history
//   this.stockHistory.push({
//     date: new Date(),
//     quantity: Math.abs(quantity),
//     type,
//     notes
//   });
  
//   // Keep only last 100 entries
//   if (this.stockHistory.length > 100) {
//     this.stockHistory = this.stockHistory.slice(-100);
//   }
  
//   this.lastUpdated = new Date();
  
//   await this.save();
  
//   return {
//     oldStock,
//     newStock: this.currentStock,
//     change: quantity
//   };
// };

// inventorySchema.methods.calculateReorderQuantity = function() {
//   if (this.currentStock > this.reorderPoint) {
//     return 0;
//   }
  
//   const suggestedQty = this.maxStockLevel - this.currentStock;
//   const moq = this.minimumOrderQuantity || 1;
  
//   // Ensure we meet MOQ
//   if (suggestedQty < moq) {
//     return moq;
//   }
  
//   // Round up to nearest MOQ multiple if needed
//   if (moq > 1 && suggestedQty % moq !== 0) {
//     return Math.ceil(suggestedQty / moq) * moq;
//   }
  
//   return suggestedQty;
// };

// // Static methods
// inventorySchema.statics.getInventoryMetrics = async function(filters = {}) {
//   const matchStage = { isActive: true, isArchived: false, ...filters };
  
//   const metrics = await this.aggregate([
//     { $match: matchStage },
//     {
//       $group: {
//         _id: null,
//         totalSKUs: { $sum: 1 },
//         totalValue: { $sum: { $multiply: ['$currentStock', '$unitCost'] } },
//         totalStock: { $sum: '$currentStock' },
//         totalInbound: { $sum: '$inboundQuantity' },
//         lowStockCount: {
//           $sum: {
//             $cond: [
//               { $and: [
//                 { $lte: ['$currentStock', '$reorderPoint'] },
//                 { $gt: ['$currentStock', 0] }
//               ]},
//               1,
//               0
//             ]
//           }
//         },
//         outOfStockCount: {
//           $sum: { $cond: [{ $eq: ['$currentStock', 0] }, 1, 0] }
//         },
//         excessStockCount: {
//           $sum: { $cond: [{ $gt: ['$currentStock', '$maxStockLevel'] }, 1, 0] }
//         },
//         avgCoverageDays: { $avg: '$daysOfCoverage' },
//         avgTurnover: { $avg: '$turnoverRate' },
//         avgHealthScore: { $avg: '$healthScore' }
//       }
//     }
//   ]);
  
//   const result = metrics[0] || {
//     totalSKUs: 0,
//     totalValue: 0,
//     totalStock: 0,
//     totalInbound: 0,
//     lowStockCount: 0,
//     outOfStockCount: 0,
//     excessStockCount: 0,
//     avgCoverageDays: 0,
//     avgTurnover: 0,
//     avgHealthScore: 0
//   };
  
//   // Calculate additional metrics
//   result.totalAvailable = result.totalStock - result.totalInbound;
//   result.healthPercentage = Math.round((result.avgHealthScore / 100) * 100);
//   result.lowStockPercentage = result.totalSKUs > 0 
//     ? Math.round((result.lowStockCount / result.totalSKUs) * 100) 
//     : 0;
  
//   return result;
// };

// inventorySchema.statics.getCategoryDistribution = async function(filters = {}) {
//   const matchStage = { isActive: true, isArchived: false, ...filters };
  
//   const categories = await this.aggregate([
//     { $match: matchStage },
//     {
//       $group: {
//         _id: '$category',
//         count: { $sum: 1 },
//         totalValue: { $sum: { $multiply: ['$currentStock', '$unitCost'] } },
//         totalStock: { $sum: '$currentStock' },
//         avgTurnover: { $avg: '$turnoverRate' },
//         avgHealthScore: { $avg: '$healthScore' }
//       }
//     },
//     { $sort: { count: -1 } }
//   ]);
  
//   // Calculate total count for percentage
//   const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
  
//   return categories.map(cat => ({
//     category: cat._id,
//     count: cat.count,
//     totalValue: cat.totalValue,
//     totalStock: cat.totalStock,
//     avgTurnover: Math.round(cat.avgTurnover * 100) / 100,
//     avgHealthScore: Math.round(cat.avgHealthScore * 10) / 10,
//     percentage: totalCount > 0 ? Math.round((cat.count / totalCount) * 100 * 10) / 10 : 0
//   }));
// };

// inventorySchema.statics.getWarehouseUtilization = async function() {
//   return this.aggregate([
//     { $match: { isActive: true, isArchived: false } },
//     {
//       $group: {
//         _id: '$warehouse',
//         itemCount: { $sum: 1 },
//         totalValue: { $sum: { $multiply: ['$currentStock', '$unitCost'] } },
//         totalStock: { $sum: '$currentStock' },
//         avgUtilization: { $avg: { $divide: ['$currentStock', '$maxStockLevel'] } }
//       }
//     },
//     { $sort: { totalValue: -1 } },
//     {
//       $project: {
//         warehouse: '$_id',
//         itemCount: 1,
//         totalValue: 1,
//         totalStock: 1,
//         utilizationPercentage: {
//           $round: [{ $multiply: ['$avgUtilization', 100] }, 1]
//         },
//         status: {
//           $switch: {
//             branches: [
//               { case: { $gte: ['$avgUtilization', 0.9] }, then: 'Critical' },
//               { case: { $gte: ['$avgUtilization', 0.75] }, then: 'High' },
//               { case: { $gte: ['$avgUtilization', 0.5] }, then: 'Medium' },
//               { case: { $gte: ['$avgUtilization', 0.25] }, then: 'Low' }
//             ],
//             default: 'Empty'
//           }
//         }
//       }
//     }
//   ]);
// };

// inventorySchema.statics.getReorderRecommendations = async function(filters = {}) {
//   const matchStage = { 
//     isActive: true, 
//     isArchived: false,
//     $or: [
//       { $expr: { $lte: ['$currentStock', '$reorderPoint'] } },
//       { currentStock: 0 }
//     ],
//     ...filters
//   };
  
//   return this.aggregate([
//     { $match: matchStage },
//     {
//       $addFields: {
//         suggestedOrder: {
//           $cond: [
//             { $lte: ['$currentStock', '$reorderPoint'] },
//             {
//               $max: [
//                 '$minimumOrderQuantity',
//                 { $subtract: ['$maxStockLevel', '$currentStock'] }
//               ]
//             },
//             '$maxStockLevel'
//           ]
//         },
//         coverageDays: {
//           $cond: [
//             { $eq: ['$avgDailySales', 0] },
//             999,
//             { $divide: ['$currentStock', '$avgDailySales'] }
//           ]
//         },
//         urgencyLevel: {
//           $switch: {
//             branches: [
//               { case: { $eq: ['$currentStock', 0] }, then: 'critical' },
//               { case: { $lte: ['$currentStock', '$safetyStock'] }, then: 'high' },
//               { case: { $lte: ['$currentStock', '$reorderPoint'] }, then: 'medium' }
//             ],
//             default: 'low'
//           }
//         }
//       }
//     },
//     { $sort: { urgencyLevel: 1, coverageDays: 1 } },
//     {
//       $project: {
//         inventoryId: 1,
//         sku: 1,
//         asin: 1,
//         productName: 1,
//         category: 1,
//         warehouse: 1,
//         currentStock: 1,
//         reorderPoint: 1,
//         maxStockLevel: 1,
//         avgDailySales: 1,
//         coverageDays: { $round: ['$coverageDays', 1] },
//         suggestedOrder: 1,
//         unitCost: 1,
//         totalCost: { $multiply: ['$suggestedOrder', '$unitCost'] },
//         urgencyLevel: 1,
//         leadTimeDays: 1,
//         supplierName: 1,
//         lastReorderDate: 1
//       }
//     }
//   ]);
// };

// const Inventory = mongoose.model('Inventory', inventorySchema);

// module.exports = Inventory;

import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Home', 'Toys', 'Books', 'Sports', 'Beauty', 'Food', 'Other']
  },
  description: {
    type: String,
    trim: true
  },
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  reorderPoint: {
    type: Number,
    required: true,
    min: 0
  },
  safetyStock: {
    type: Number,
    required: true,
    min: 0
  },
  maxStockLevel: {
    type: Number,
    required: true,
    min: 0
  },
  leadTime: {
    type: Number,
    required: true,
    min: 0,
    default: 7
  },
  supplier: {
    type: String,
    required: true,
    enum: ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Other']
  },
  warehouse: {
    type: String,
    required: true,
    enum: ['Main Warehouse', 'East Warehouse', 'West Warehouse', 'North Warehouse', 'South Warehouse']
  },
  location: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  
  // Sales data
  dailySales: {
    type: Number,
    default: 0
  },
  weeklySales: {
    type: Number,
    default: 0
  },
  monthlySales: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  
  // Forecast data
  forecastDemand: {
    type: Number,
    default: 0
  },
  forecastAccuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Historical data
  salesHistory: [{
    date: Date,
    quantity: Number,
    revenue: Number
  }],
  
  stockHistory: [{
    date: Date,
    quantity: Number,
    action: {
      type: String,
      enum: ['purchase', 'sale', 'adjustment', 'return']
    }
  }],
  
  // Status flags
  status: {
    type: String,
    enum: ['active', 'discontinued', 'seasonal', 'new'],
    default: 'active'
  },
  
  // Reorder data
  lastReorderDate: Date,
  nextReorderDate: Date,
  reorderQuantity: {
    type: Number,
    default: 0
  },
  
  // Metrics
  turnoverRate: {
    type: Number,
    default: 0
  },
  daysOfSupply: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for inventory value
inventorySchema.virtual('inventoryValue').get(function() {
  return this.currentStock * this.unitCost;
});

// Virtual for profit margin
inventorySchema.virtual('profitMargin').get(function() {
  return ((this.sellingPrice - this.unitCost) / this.sellingPrice) * 100;
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.currentStock === 0) return 'out_of_stock';
  if (this.currentStock <= this.reorderPoint) return 'low_stock';
  if (this.currentStock > this.maxStockLevel) return 'excess_stock';
  return 'normal';
});

// Virtual for coverage days
inventorySchema.virtual('coverageDays').get(function() {
  return this.dailySales > 0 ? Math.floor(this.currentStock / this.dailySales) : 0;
});

// Indexes for better query performance
inventorySchema.index({ category: 1, currentStock: 1 });
inventorySchema.index({ warehouse: 1, status: 1 });
inventorySchema.index({ supplier: 1 });
inventorySchema.index({ createdAt: -1 });

// Pre-save middleware
inventorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if reorder is needed
inventorySchema.methods.needsReorder = function() {
  return this.currentStock <= this.reorderPoint;
};

// Method to calculate suggested order quantity
inventorySchema.methods.calculateSuggestedOrder = function() {
  if (this.currentStock <= this.reorderPoint) {
    return Math.max(0, this.maxStockLevel - this.currentStock);
  }
  return 0;
};

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;