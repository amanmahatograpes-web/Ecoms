const Inventory = require('../models/Inventory');
const ForecastCalculator = require('../utils/forecastCalculator');
const { validationResult } = require('express-validator');

class InventoryController {
  // Get all inventory items with planning data
  async getInventoryPlanning(req, res) {
    try {
      const { range = '30d', category, warehouse, supplier, page = 1, limit = 50, sort = 'urgency', search } = req.query;
      
      // Build filter
      const filter = {};
      
      // Date range filter
      const dateFilter = this.getDateRangeFilter(range);
      if (dateFilter) {
        filter.createdAt = dateFilter;
      }
      
      // Additional filters
      if (category && category !== 'all') filter.category = category;
      if (warehouse && warehouse !== 'all') filter.warehouse = warehouse;
      if (supplier && supplier !== 'all') filter.supplier = supplier;
      if (search) {
        filter.$or = [
          { productName: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Get total count
      const total = await Inventory.countDocuments(filter);
      
      // Get inventory items with sorting
      let sortOption = {};
      switch (sort) {
        case 'urgency':
          sortOption = { currentStock: 1, reorderPoint: 1 };
          break;
        case 'stock':
          sortOption = { currentStock: -1 };
          break;
        case 'value':
          sortOption = { inventoryValue: -1 };
          break;
        case 'sales':
          sortOption = { dailySales: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
      
      const inventoryItems = await Inventory.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      
      // Calculate planning data for each item
      const planningData = inventoryItems.map(item => {
        const dailySales = item.dailySales || 0;
        const leadTime = item.leadTime || 7;
        
        // Calculate forecast
        const forecast = ForecastCalculator.calculateForecast(item.salesHistory || []);
        
        // Calculate reorder parameters
        const reorderPoint = item.reorderPoint || ForecastCalculator.calculateReorderPoint(dailySales, leadTime);
        const maxStock = item.maxStockLevel || ForecastCalculator.calculateMaxStock(dailySales);
        const safetyStock = item.safetyStock || Math.ceil(dailySales * leadTime * 0.5);
        
        // Determine urgency
        let urgency = 'low';
        let suggestedOrder = 0;
        
        if (item.currentStock === 0) {
          urgency = 'critical';
          suggestedOrder = maxStock;
        } else if (item.currentStock <= reorderPoint) {
          suggestedOrder = Math.max(0, maxStock - item.currentStock);
          urgency = item.currentStock <= safetyStock ? 'high' : 'medium';
        } else if (item.currentStock > maxStock * 1.2) {
          urgency = 'excess';
          suggestedOrder = 0;
        }
        
        // Calculate coverage
        const coverageDays = dailySales > 0 ? Math.floor(item.currentStock / dailySales) : 999;
        const projectedStock = item.currentStock + suggestedOrder - forecast.forecast;
        const projectedCoverage = dailySales > 0 ? Math.max(0, Math.floor(projectedStock / dailySales)) : 999;
        
        return {
          ...item,
          dailySales,
          leadTimeDays: leadTime,
          safetyStock,
          reorderPoint,
          maxStock,
          suggestedOrder,
          urgency,
          coverageDays,
          forecastSales: forecast.forecast,
          forecastAccuracy: forecast.accuracy,
          projectedStock,
          projectedCoverage,
          inventoryValue: item.currentStock * item.unitCost
        };
      });
      
      // Sort by urgency if needed
      if (sort === 'urgency') {
        planningData.sort((a, b) => {
          const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3, excess: 4 };
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        });
      }
      
      // Calculate summary metrics
      const summary = await this.calculateSummaryMetrics(filter);
      
      res.json({
        success: true,
        data: planningData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        summary,
        filters: {
          range,
          category,
          warehouse,
          supplier,
          search
        }
      });
      
    } catch (error) {
      console.error('Error fetching inventory planning data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inventory planning data',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  // Calculate summary metrics
  async calculateSummaryMetrics(filter = {}) {
    const inventoryItems = await Inventory.find(filter).lean();
    
    if (inventoryItems.length === 0) {
      return {
        totalSKUs: 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        excessStockItems: 0,
        averageCoverageDays: 0,
        turnoverRate: 0,
        forecastAccuracy: 87.5
      };
    }
    
    const totalSKUs = inventoryItems.length;
    const totalValue = inventoryItems.reduce((sum, item) => 
      sum + (item.currentStock * (item.unitCost || 0)), 0
    );
    
    const lowStockItems = inventoryItems.filter(item => 
      item.currentStock <= item.reorderPoint && item.currentStock > 0
    ).length;
    
    const outOfStockItems = inventoryItems.filter(item => 
      item.currentStock === 0
    ).length;
    
    const excessStockItems = inventoryItems.filter(item => 
      item.currentStock > item.maxStockLevel
    ).length;
    
    const totalCoverageDays = inventoryItems.reduce((sum, item) => {
      const dailySales = item.dailySales || item.avgDailySales || 0;
      return sum + (dailySales > 0 ? Math.floor(item.currentStock / dailySales) : 999);
    }, 0);
    
    const averageCoverageDays = Math.round(totalCoverageDays / totalSKUs);
    
    const totalSales = inventoryItems.reduce((sum, item) => 
      sum + (item.dailySales || 0), 0
    );
    
    const averageInventory = inventoryItems.reduce((sum, item) => 
      sum + item.currentStock, 0
    ) / totalSKUs;
    
    const turnoverRate = averageInventory > 0 ? (totalSales / averageInventory).toFixed(2) : 0;
    
    // Calculate forecast accuracy from recent items
    const recentItems = inventoryItems.slice(0, 10);
    const avgForecastAccuracy = recentItems.length > 0 
      ? recentItems.reduce((sum, item) => sum + (item.forecastAccuracy || 0), 0) / recentItems.length
      : 87.5;
    
    return {
      totalSKUs,
      totalValue: Math.round(totalValue),
      lowStockItems,
      outOfStockItems,
      excessStockItems,
      averageCoverageDays,
      turnoverRate: parseFloat(turnoverRate),
      forecastAccuracy: Math.round(avgForecastAccuracy)
    };
  }
  
  // Get date range filter
  getDateRangeFilter(range) {
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return null;
    }
    
    return { $gte: startDate };
  }
  
  // Get inventory analytics
  async getInventoryAnalytics(req, res) {
    try {
      const analytics = await Inventory.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$currentStock', '$unitCost'] } },
            avgTurnover: { $avg: '$turnoverRate' },
            lowStockCount: {
              $sum: {
                $cond: [
                  { $and: [
                    { $lte: ['$currentStock', '$reorderPoint'] },
                    { $gt: ['$currentStock', 0] }
                  ]},
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            category: '$_id',
            count: 1,
            totalValue: 1,
            avgTurnover: 1,
            lowStockCount: 1,
            _id: 0
          }
        },
        { $sort: { totalValue: -1 } }
      ]);
      
      // Warehouse utilization
      const warehouseStats = await Inventory.aggregate([
        {
          $group: {
            _id: '$warehouse',
            itemCount: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$currentStock', '$unitCost'] } },
            capacity: { $sum: '$maxStockLevel' }
          }
        },
        {
          $project: {
            warehouse: '$_id',
            itemCount: 1,
            totalValue: 1,
            capacity: 1,
            utilization: { $multiply: [{ $divide: ['$itemCount', '$capacity'] }, 100] },
            _id: 0
          }
        }
      ]);
      
      res.json({
        success: true,
        data: {
          categoryDistribution: analytics,
          warehouseUtilization: warehouseStats,
          timestamp: new Date()
        }
      });
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics data'
      });
    }
  }
  
  // Create bulk reorder
  async createBulkReorder(req, res) {
    try {
      const { items, supplierId, expectedDeliveryDate, notes } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No items provided for reorder'
        });
      }
      
      // Validate items
      const validatedItems = [];
      let totalCost = 0;
      let totalQuantity = 0;
      
      for (const item of items) {
        const inventoryItem = await Inventory.findById(item.inventoryId);
        
        if (!inventoryItem) {
          return res.status(404).json({
            success: false,
            message: `Inventory item ${item.inventoryId} not found`
          });
        }
        
        const suggestedOrder = inventoryItem.calculateSuggestedOrder();
        
        if (suggestedOrder === 0) {
          continue;
        }
        
        validatedItems.push({
          inventoryId: inventoryItem._id,
          sku: inventoryItem.sku,
          productName: inventoryItem.productName,
          quantity: suggestedOrder,
          unitCost: inventoryItem.unitCost,
          totalCost: suggestedOrder * inventoryItem.unitCost
        });
        
        totalCost += suggestedOrder * inventoryItem.unitCost;
        totalQuantity += suggestedOrder;
      }
      
      if (validatedItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid items need reordering'
        });
      }
      
      // In a real application, you would create a PurchaseOrder document here
      const reorderData = {
        reorderId: `RE-${Date.now()}`,
        items: validatedItems,
        totalQuantity,
        totalCost,
        supplierId,
        expectedDeliveryDate,
        notes,
        status: 'pending',
        createdAt: new Date()
      };
      
      // Update inventory items with reorder info
      for (const item of validatedItems) {
        await Inventory.findByIdAndUpdate(item.inventoryId, {
          lastReorderDate: new Date(),
          nextReorderDate: expectedDeliveryDate,
          reorderQuantity: item.quantity
        });
      }
      
      res.json({
        success: true,
        message: `Bulk reorder created for ${validatedItems.length} items`,
        data: reorderData
      });
      
    } catch (error) {
      console.error('Error creating bulk reorder:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create bulk reorder'
      });
    }
  }
  
  // Update inventory stock
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity, action, notes } = req.body;
      
      const inventoryItem = await Inventory.findById(id);
      
      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }
      
      let newStock = inventoryItem.currentStock;
      
      switch (action) {
        case 'receive':
          newStock += quantity;
          break;
        case 'sell':
          newStock = Math.max(0, newStock - quantity);
          break;
        case 'adjust':
          newStock = quantity;
          break;
        case 'return':
          newStock += quantity;
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid action'
          });
      }
      
      // Update inventory
      inventoryItem.currentStock = newStock;
      inventoryItem.stockHistory.push({
        date: new Date(),
        quantity: Math.abs(quantity),
        action,
        notes
      });
      
      await inventoryItem.save();
      
      res.json({
        success: true,
        message: 'Stock updated successfully',
        data: {
          id: inventoryItem._id,
          sku: inventoryItem.sku,
          productName: inventoryItem.productName,
          currentStock: inventoryItem.currentStock,
          previousStock: inventoryItem.currentStock - (action === 'sell' ? -quantity : quantity)
        }
      });
      
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update stock'
      });
    }
  }
  
  // Get inventory item by ID
  async getInventoryById(req, res) {
    try {
      const { id } = req.params;
      
      const inventoryItem = await Inventory.findById(id);
      
      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }
      
      res.json({
        success: true,
        data: inventoryItem
      });
      
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch inventory item'
      });
    }
  }
  
  // Create new inventory item
  async createInventory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const inventoryData = req.body;
      
      // Calculate initial forecast and reorder points
      const dailySales = inventoryData.dailySales || 0;
      const leadTime = inventoryData.leadTime || 7;
      
      inventoryData.reorderPoint = inventoryData.reorderPoint || 
        ForecastCalculator.calculateReorderPoint(dailySales, leadTime);
      
      inventoryData.maxStockLevel = inventoryData.maxStockLevel || 
        ForecastCalculator.calculateMaxStock(dailySales);
      
      inventoryData.safetyStock = inventoryData.safetyStock || 
        Math.ceil(dailySales * leadTime * 0.5);
      
      const inventoryItem = new Inventory(inventoryData);
      await inventoryItem.save();
      
      res.status(201).json({
        success: true,
        message: 'Inventory item created successfully',
        data: inventoryItem
      });
      
    } catch (error) {
      console.error('Error creating inventory item:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'SKU already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create inventory item'
      });
    }
  }
  
  // Update inventory item
  async updateInventory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const inventoryItem = await Inventory.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Inventory item updated successfully',
        data: inventoryItem
      });
      
    } catch (error) {
      console.error('Error updating inventory item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update inventory item'
      });
    }
  }
  
  // Delete inventory item
  async deleteInventory(req, res) {
    try {
      const { id } = req.params;
      
      const inventoryItem = await Inventory.findByIdAndDelete(id);
      
      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: 'Inventory item not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Inventory item deleted successfully'
      });
      
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete inventory item'
      });
    }
  }
  
  // Export inventory data
  async exportInventory(req, res) {
    try {
      const { format = 'json', range = '30d' } = req.query;
      
      const filter = this.getDateRangeFilter(range);
      const inventoryItems = await Inventory.find(filter || {}).lean();
      
      let data;
      let contentType;
      let filename;
      
      switch (format) {
        case 'csv':
          data = this.convertToCSV(inventoryItems);
          contentType = 'text/csv';
          filename = `inventory_export_${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'excel':
          // In production, use a library like exceljs
          data = JSON.stringify(inventoryItems);
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          filename = `inventory_export_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        default:
          data = JSON.stringify(inventoryItems, null, 2);
          contentType = 'application/json';
          filename = `inventory_export_${new Date().toISOString().split('T')[0]}.json`;
      }
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(data);
      
    } catch (error) {
      console.error('Error exporting inventory:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export inventory data'
      });
    }
  }
  
  // Convert to CSV
  convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item)
        .map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        )
        .join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}

module.exports = new InventoryController();