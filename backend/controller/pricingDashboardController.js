import PricingData from '../models/PricingData.js';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';
import logger from '../utils/logger.js';

class PricingDashboardController {
  /**
   * Get pricing dashboard data with filters and pagination
   */
  async getDashboard(req, res) {
    try {
      const {
        status = 'all',
        margin = 'all',
        category = 'all',
        sort = 'profitMargin',
        autoPricing = 'all',
        search = '',
        page = 1,
        limit = 50
      } = req.query;

      // Build query
      const query = {};

      // Status filter
      if (status !== 'all') {
        query.pricingStatus = status;
      }

      // Margin filter
      if (margin !== 'all') {
        switch (margin) {
          case 'negative':
            query.profitMargin = { $lt: 0 };
            break;
          case 'low':
            query.profitMargin = { $gte: 0, $lt: 10 };
            break;
          case 'medium':
            query.profitMargin = { $gte: 10, $lt: 25 };
            break;
          case 'high':
            query.profitMargin = { $gte: 25, $lt: 50 };
            break;
          case 'very_high':
            query.profitMargin = { $gte: 50 };
            break;
        }
      }

      // Category filter
      if (category !== 'all') {
        query.category = category;
      }

      // Auto-pricing filter
      if (autoPricing !== 'all') {
        query.autoPricingEnabled = autoPricing === 'enabled';
      }

      // Search filter
      if (search) {
        query.$or = [
          { sku: { $regex: search, $options: 'i' } },
          { productName: { $regex: search, $options: 'i' } }
        ];
      }

      // Build sort
      const sortOptions = {};
      switch (sort) {
        case 'profitMargin':
          sortOptions.profitMargin = -1;
          break;
        case 'price':
          sortOptions.listPrice = -1;
          break;
        case 'competitiveness':
          sortOptions.priceDifference = 1;
          break;
        case 'sales':
          sortOptions.salesVolume = -1;
          break;
        case 'margin':
          sortOptions.profitAmount = -1;
          break;
        default:
          sortOptions.updatedAt = -1;
      }

      // Pagination
      const skip = (page - 1) * parseInt(limit);

      // Execute query
      const [pricingData, total] = await Promise.all([
        PricingData.find(query)
          .populate('productId', 'images name category')
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        PricingData.countDocuments(query)
      ]);

      // Calculate summary
      const summary = await this.calculateSummary(query);

      // Format response
      const formattedData = pricingData.map(item => ({
        _id: item._id,
        sku: item.sku,
        productName: item.productName,
        productId: item.productId,
        listPrice: item.listPrice,
        costPrice: item.costPrice,
        salePrice: item.salePrice,
        recommendedPrice: item.recommendedPrice,
        profitMargin: item.profitMargin,
        profitAmount: item.profitAmount,
        roi: item.roi,
        fbaFees: item.fbaFees,
        competitorCount: item.competitorCount,
        lowestCompetitorPrice: item.lowestCompetitorPrice,
        priceDifference: item.priceDifference,
        isBuyBoxWinner: item.isBuyBoxWinner,
        pricingStatus: item.pricingStatus,
        autoPricingEnabled: item.autoPricingEnabled,
        category: item.category,
        salesVolume: item.salesVolume,
        lastPriceUpdate: item.lastPriceUpdate
      }));

      res.json({
        success: true,
        data: formattedData,
        summary,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      logger.error('Get pricing dashboard error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch pricing dashboard data',
        message: error.message
      });
    }
  }

  /**
   * Calculate dashboard summary
   */
  async calculateSummary(query = {}) {
    try {
      const [
        totalProducts,
        avgPrice,
        avgMargin,
        competitiveProducts,
        autoPricingCount,
        marginDistribution
      ] = await Promise.all([
        PricingData.countDocuments(query),
        PricingData.aggregate([
          { $match: query },
          { $group: { _id: null, avgPrice: { $avg: '$listPrice' } } }
        ]),
        PricingData.aggregate([
          { $match: query },
          { $group: { _id: null, avgMargin: { $avg: '$profitMargin' } } }
        ]),
        PricingData.countDocuments({ ...query, pricingStatus: 'competitive' }),
        PricingData.countDocuments({ ...query, autoPricingEnabled: true }),
        PricingData.aggregate([
          { $match: query },
          {
            $bucket: {
              groupBy: '$profitMargin',
              boundaries: [-100, 0, 10, 20, 30, 40, 1000],
              default: 'other',
              output: {
                count: { $sum: 1 },
                avgMargin: { $avg: '$profitMargin' }
              }
            }
          }
        ])
      ]);

      return {
        totalProducts,
        avgPrice: avgPrice[0]?.avgPrice || 0,
        avgMargin: avgMargin[0]?.avgMargin || 0,
        competitiveProducts,
        autoPricingCount,
        marginDistribution: marginDistribution.map(range => ({
          _id: range._id,
          count: range.count,
          avgMargin: range.avgMargin
        }))
      };
    } catch (error) {
      logger.error('Calculate summary error:', error);
      return {
        totalProducts: 0,
        avgPrice: 0,
        avgMargin: 0,
        competitiveProducts: 0,
        autoPricingCount: 0,
        marginDistribution: []
      };
    }
  }

  /**
   * Get pricing analytics
   */
  async getAnalytics(req, res) {
    try {
      const { period = 'month' } = req.query;

      // Get date range
      const now = new Date();
      const startDate = new Date();
      if (period === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (period === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'quarter') {
        startDate.setMonth(now.getMonth() - 3);
      }

      const [
        priceChanges,
        marginByCategory,
        competitorAnalysis
      ] = await Promise.all([
        // Price changes over time
        PricingData.aggregate([
          { $match: { updatedAt: { $gte: startDate } } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' }
              },
              avgPrice: { $avg: '$listPrice' },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id': 1 } }
        ]),

        // Margin by category
        PricingData.aggregate([
          {
            $group: {
              _id: '$category',
              avgMargin: { $avg: '$profitMargin' },
              totalRevenue: { $sum: { $multiply: ['$listPrice', '$salesVolume'] } },
              count: { $sum: 1 }
            }
          },
          { $sort: { totalRevenue: -1 } }
        ]),

        // Competitor analysis
        PricingData.aggregate([
          { $match: { competitorCount: { $gt: 0 } } },
          {
            $group: {
              _id: '$category',
              avgCompetitorPrice: { $avg: '$lowestCompetitorPrice' },
              avgOurPrice: { $avg: '$listPrice' },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ])
      ]);

      res.json({
        success: true,
        data: {
          priceChanges,
          marginByCategory,
          competitorAnalysis
        }
      });

    } catch (error) {
      logger.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch analytics',
        message: error.message
      });
    }
  }

  /**
   * Update single product price
   */
  async updatePrice(req, res) {
    try {
      const { productId } = req.params;
      const { price, priceType = 'list', reason = 'Manual update' } = req.body;

      if (!price || isNaN(price) || price <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid price is required'
        });
      }

      const pricingData = await PricingData.findById(productId);
      if (!pricingData) {
        return res.status(404).json({
          success: false,
          error: 'Pricing data not found'
        });
      }

      // Update price
      pricingData.listPrice = price;
      pricingData.lastPriceUpdate = new Date();

      // Recalculate profit metrics
      await pricingData.save();

      // Log price change
      logger.info(`Price updated for ${pricingData.sku}: $${price} (${reason})`);

      res.json({
        success: true,
        data: pricingData,
        message: 'Price updated successfully'
      });

    } catch (error) {
      logger.error('Update price error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update price',
        message: error.message
      });
    }
  }

  /**
   * Bulk update prices
   */
  async bulkUpdatePrices(req, res) {
    try {
      const { updates, priceType = 'list', reason = 'Bulk update' } = req.body;

      if (!updates || !Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Updates array is required'
        });
      }

      const results = {
        updated: [],
        failed: []
      };

      for (const update of updates) {
        try {
          const pricingData = await PricingData.findById(update.id);
          if (!pricingData) {
            results.failed.push({ id: update.id, error: 'Not found' });
            continue;
          }

          pricingData.listPrice = update.price;
          pricingData.lastPriceUpdate = new Date();
          await pricingData.save();

          results.updated.push({
            id: update.id,
            sku: pricingData.sku,
            oldPrice: pricingData.listPrice,
            newPrice: update.price
          });
        } catch (error) {
          results.failed.push({ id: update.id, error: error.message });
        }
      }

      logger.info(`Bulk price update completed: ${results.updated.length} updated, ${results.failed.length} failed`);

      res.json({
        success: true,
        data: results,
        message: `Updated ${results.updated.length} prices`
      });

    } catch (error) {
      logger.error('Bulk update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to perform bulk update',
        message: error.message
      });
    }
  }

  /**
   * Sync competitor prices (mock implementation)
   */
  async syncCompetitors(req, res) {
    try {
      // This would integrate with Amazon MWS, Jungle Scout API, etc.
      // For now, we'll simulate competitor data updates

      const pricingData = await PricingData.find({ competitorCount: { $gt: 0 } });

      for (const item of pricingData) {
        // Simulate competitor price changes
        const priceChange = (Math.random() - 0.5) * 0.1; // ±5% change
        item.lowestCompetitorPrice = item.lowestCompetitorPrice * (1 + priceChange);
        item.lastCompetitorUpdate = new Date();
        await item.save();
      }

      res.json({
        success: true,
        message: `Synced competitor data for ${pricingData.length} products`
      });

    } catch (error) {
      logger.error('Sync competitors error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync competitor data',
        message: error.message
      });
    }
  }
}

export default new PricingDashboardController();