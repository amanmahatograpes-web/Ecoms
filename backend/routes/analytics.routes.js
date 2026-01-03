const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

// Import middleware if you have authentication
// const { protect, authorize } = require('../middleware/auth');

// Helper function to get date ranges
const getDateRanges = () => {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  
  return {
    today: today,
    yesterday: new Date(today.getTime() - 24 * 60 * 60 * 1000),
    startOfWeek: new Date(today.setDate(today.getDate() - today.getDay())),
    startOfMonth: new Date(today.getFullYear(), today.getMonth(), 1),
    startOfYear: new Date(today.getFullYear(), 0, 1),
    thirtyDaysAgo: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    sevenDaysAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    oneHourAgo: new Date(Date.now() - 60 * 60 * 1000)
  };
};

// @desc    Get comprehensive dashboard analytics
// @route   GET /api/v1/analytics/dashboard
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const {
      today,
      startOfMonth,
      startOfYear,
      thirtyDaysAgo,
      sevenDaysAgo
    } = getDateRanges();
    
    // Get data in parallel for better performance
    const [
      todayOrders,
      todayRevenue,
      monthlyOrders,
      monthlyRevenue,
      yearlyRevenue,
      totalProducts,
      totalUsers,
      totalOrders,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Today's stats
      Order.countDocuments({ 
        createdAt: { $gte: today },
        status: 'completed'
      }),
      
      Order.aggregate([
        { $match: { 
          createdAt: { $gte: today },
          status: 'completed'
        }},
        { $group: { 
          _id: null, 
          total: { $sum: '$totalAmount' }
        }}
      ]),
      
      // Monthly stats
      Order.countDocuments({ 
        createdAt: { $gte: startOfMonth },
        status: 'completed'
      }),
      
      Order.aggregate([
        { $match: { 
          createdAt: { $gte: startOfMonth },
          status: 'completed'
        }},
        { $group: { 
          _id: null, 
          total: { $sum: '$totalAmount' }
        }}
      ]),
      
      // Yearly stats
      Order.aggregate([
        { $match: { 
          createdAt: { $gte: startOfYear },
          status: 'completed'
        }},
        { $group: { 
          _id: null, 
          total: { $sum: '$totalAmount' }
        }}
      ]),
      
      // Total counts
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      
      // Recent orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .populate('items.product', 'name images'),
      
      // Top selling products
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $unwind: '$items' },
        { $group: { 
            _id: '$items.product', 
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { 
              $multiply: ['$items.price', '$items.quantity'] 
            }}
          } 
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
        { $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $project: {
            productId: '$_id',
            productName: '$product.name',
            productImage: { $arrayElemAt: ['$product.images', 0] },
            category: '$product.category',
            totalQuantity: 1,
            totalRevenue: 1,
            averagePrice: { 
              $divide: ['$totalRevenue', '$totalQuantity'] 
            }
          }
        }
      ])
    ]);

    // Get additional metrics
    const [newCustomers, lowStockProducts, pendingOrders] = await Promise.all([
      User.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo },
        role: 'customer'
      }),
      Product.countDocuments({ stock: { $lte: 10 } }),
      Order.countDocuments({ status: 'pending' })
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          today: {
            orders: todayOrders,
            revenue: todayRevenue[0]?.total || 0
          },
          monthly: {
            orders: monthlyOrders,
            revenue: monthlyRevenue[0]?.total || 0
          },
          yearly: {
            revenue: yearlyRevenue[0]?.total || 0
          },
          totals: {
            products: totalProducts,
            customers: totalUsers,
            orders: totalOrders,
            newCustomers,
            lowStock: lowStockProducts,
            pendingOrders
          }
        },
        recentOrders,
        topProducts,
        performanceMetrics: {
          averageOrderValue: monthlyOrders > 0 ? 
            (monthlyRevenue[0]?.total || 0) / monthlyOrders : 0,
          conversionRate: 0, // Implement based on your business logic
          customerGrowth: 0   // Implement based on your business logic
        }
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        timeRange: {
          today: today.toISOString(),
          monthStart: startOfMonth.toISOString(),
          yearStart: startOfYear.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard analytics', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get sales analytics with filters
// @route   GET /api/v1/analytics/sales
// @access  Private/Admin
router.get('/sales', async (req, res) => {
  try {
    const { period = '30d', startDate, endDate, groupBy = 'day' } = req.query;
    
    let dateFilter = {};
    let groupFormat = "%Y-%m-%d";
    
    // Set date format based on groupBy
    switch(groupBy) {
      case 'hour':
        groupFormat = "%Y-%m-%d %H:00";
        break;
      case 'week':
        groupFormat = "%Y-%W";
        break;
      case 'month':
        groupFormat = "%Y-%m";
        break;
      case 'year':
        groupFormat = "%Y";
        break;
    }
    
    // Apply date filters
    if (startDate && endDate) {
      dateFilter.createdAt = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    } else {
      // Apply period filter
      const now = new Date();
      let start = new Date();
      
      switch(period) {
        case '7d':
          start.setDate(now.getDate() - 7);
          break;
        case '30d':
          start.setDate(now.getDate() - 30);
          break;
        case '90d':
          start.setDate(now.getDate() - 90);
          break;
        case '1y':
          start.setFullYear(now.getFullYear() - 1);
          break;
        default:
          start.setDate(now.getDate() - 30);
      }
      
      dateFilter.createdAt = { $gte: start, $lte: now };
    }

    // Execute analytics queries in parallel
    const [
      salesTrend,
      statusDistribution,
      paymentDistribution,
      categorySales
    ] = await Promise.all([
      // Sales trend over time
      Order.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        { $group: {
            _id: { 
              $dateToString: { 
                format: groupFormat, 
                date: "$createdAt" 
              } 
            },
            date: { $first: "$createdAt" },
            revenue: { $sum: '$totalAmount' },
            orders: { $sum: 1 },
            itemsSold: { $sum: { $sum: '$items.quantity' } },
            averageOrderValue: { $avg: '$totalAmount' }
          }
        },
        { $sort: { date: 1 } },
        { $project: {
            date: '$_id',
            revenue: 1,
            orders: 1,
            itemsSold: 1,
            averageOrderValue: { $round: ['$averageOrderValue', 2] }
          }
        }
      ]),

      // Order status distribution
      Order.aggregate([
        { $match: dateFilter },
        { $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { 
              $sum: { 
                $cond: [{ $eq: ['$status', 'completed'] }, '$totalAmount', 0] 
              } 
            }
          }
        },
        { $sort: { count: -1 } }
      ]),

      // Payment method distribution
      Order.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        { $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
            averageAmount: { $avg: '$totalAmount' }
          }
        },
        { $sort: { revenue: -1 } }
      ]),

      // Sales by category
      Order.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        { $unwind: '$items' },
        { $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $group: {
            _id: '$product.category',
            revenue: { 
              $sum: { 
                $multiply: ['$items.price', '$items.quantity'] 
              } 
            },
            itemsSold: { $sum: '$items.quantity' },
            orderCount: { $addToSet: '$_id' }
          }
        },
        { $project: {
            category: '$_id',
            revenue: 1,
            itemsSold: 1,
            orderCount: { $size: '$orderCount' }
          }
        },
        { $sort: { revenue: -1 } }
      ])
    ]);

    // Calculate summary statistics
    const summary = {
      totalRevenue: salesTrend.reduce((sum, day) => sum + day.revenue, 0),
      totalOrders: salesTrend.reduce((sum, day) => sum + day.orders, 0),
      totalItemsSold: salesTrend.reduce((sum, day) => sum + day.itemsSold, 0),
      averageOrderValue: salesTrend.length > 0 ? 
        salesTrend.reduce((sum, day) => sum + day.averageOrderValue, 0) / salesTrend.length : 0,
      completedOrders: statusDistribution.find(s => s._id === 'completed')?.count || 0,
      completionRate: salesTrend.length > 0 ? 
        (statusDistribution.find(s => s._id === 'completed')?.count || 0) / 
        statusDistribution.reduce((sum, s) => sum + s.count, 0) * 100 : 0
    };

    res.json({
      success: true,
      data: {
        salesTrend,
        statusDistribution,
        paymentDistribution,
        categorySales,
        summary,
        filters: {
          period,
          startDate: dateFilter.createdAt?.$gte || null,
          endDate: dateFilter.createdAt?.$lte || null,
          groupBy
        }
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching sales analytics', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get product analytics
// @route   GET /api/v1/analytics/products
// @access  Private/Admin
router.get('/products', async (req, res) => {
  try {
    const { sortBy = 'revenue', limit = 10, category } = req.query;
    
    const matchFilter = { status: 'completed' };
    
    const [
      productPerformance,
      categoryPerformance,
      inventoryStatus,
      topViewed
    ] = await Promise.all([
      // Product performance
      Order.aggregate([
        { $match: matchFilter },
        { $unwind: '$items' },
        { $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            totalSold: { $sum: '$items.quantity' },
            totalRevenue: { 
              $sum: { $multiply: ['$items.price', '$items.quantity'] } 
            },
            averagePrice: { $avg: '$items.price' },
            orderCount: { $addToSet: '$_id' }
          }
        },
        { $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $project: {
            productId: '$_id',
            name: '$product.name',
            category: '$product.category',
            sku: '$product.sku',
            price: '$product.price',
            stock: '$product.stock',
            images: '$product.images',
            totalSold: 1,
            totalRevenue: 1,
            averagePrice: { $round: ['$averagePrice', 2] },
            orderCount: { $size: '$orderCount' },
            stockStatus: {
              $cond: [
                { $eq: ['$product.stock', 0] },
                'out_of_stock',
                { $cond: [
                  { $lte: ['$product.stock', 10] },
                  'low_stock',
                  'in_stock'
                ]}
              ]
            },
            sellThroughRate: {
              $cond: [
                { $gt: ['$product.stock', 0] },
                { $multiply: [
                  { $divide: ['$totalSold', { $add: ['$totalSold', '$product.stock'] }] },
                  100
                ]},
                100
              ]
            }
          }
        },
        { $sort: { [sortBy]: -1 } },
        { $limit: parseInt(limit) }
      ]),

      // Category performance
      Order.aggregate([
        { $match: matchFilter },
        { $unwind: '$items' },
        { $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $group: {
            _id: '$product.category',
            totalRevenue: { 
              $sum: { $multiply: ['$items.price', '$items.quantity'] } 
            },
            totalSold: { $sum: '$items.quantity' },
            products: { $addToSet: '$items.product' },
            averagePrice: { $avg: '$items.price' }
          }
        },
        { $project: {
            category: '$_id',
            totalRevenue: 1,
            totalSold: 1,
            productCount: { $size: '$products' },
            averagePrice: { $round: ['$averagePrice', 2] },
            revenueShare: 0 // Will calculate after
          }
        },
        { $sort: { totalRevenue: -1 } }
      ]),

      // Inventory status
      Product.aggregate([
        { $match: category ? { category } : {} },
        { $project: {
            name: 1,
            sku: 1,
            category: 1,
            price: 1,
            stock: 1,
            reorderLevel: 1,
            status: {
              $cond: [
                { $eq: ['$stock', 0] },
                'out_of_stock',
                { $cond: [
                  { $lte: ['$stock', '$reorderLevel'] },
                  'low_stock',
                  'in_stock'
                ]}
              ]
            },
            lastRestocked: 1,
            daysOfSupply: {
              $cond: [
                { $gt: ['$stock', 0] },
                { $divide: ['$stock', { $ifNull: ['$averageDailySales', 1] }] },
                0
              ]
            }
          }
        },
        { $sort: { stock: 1 } },
        { $limit: 20 }
      ]),

      // Top viewed products
      Product.find()
        .sort({ views: -1 })
        .limit(10)
        .select('name views price stock category sku')
    ]);

    // Calculate revenue share for categories
    const totalCategoryRevenue = categoryPerformance.reduce(
      (sum, cat) => sum + cat.totalRevenue, 0
    );
    
    categoryPerformance.forEach(cat => {
      cat.revenueShare = totalCategoryRevenue > 0 ? 
        (cat.totalRevenue / totalCategoryRevenue * 100) : 0;
    });

    res.json({
      success: true,
      data: {
        productPerformance,
        categoryPerformance,
        inventoryStatus,
        topViewed,
        summary: {
          totalProducts: await Product.countDocuments(),
          outOfStock: await Product.countDocuments({ stock: 0 }),
          lowStock: await Product.countDocuments({ 
            stock: { $gt: 0, $lte: 10 } 
          }),
          totalValueSold: productPerformance.reduce(
            (sum, p) => sum + p.totalRevenue, 0
          )
        }
      }
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching product analytics', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get customer analytics
// @route   GET /api/v1/analytics/customers
// @access  Private/Admin
router.get('/customers', async (req, res) => {
  try {
    const { segment = 'all', sortBy = 'revenue' } = req.query;
    const { thirtyDaysAgo } = getDateRanges();

    const [
      customerSegments,
      topCustomers,
      customerLocations,
      acquisitionTrend
    ] = await Promise.all([
      // Customer segments
      User.aggregate([
        { $match: { role: 'customer' } },
        { $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'user',
            as: 'orders'
          }
        },
        { $project: {
            name: 1,
            email: 1,
            createdAt: 1,
            lastLogin: 1,
            totalOrders: { $size: '$orders' },
            totalSpent: { 
              $sum: {
                $map: {
                  input: '$orders',
                  as: 'order',
                  in: { 
                    $cond: [
                      { $eq: ['$$order.status', 'completed'] },
                      '$$order.totalAmount',
                      0
                    ]
                  }
                }
              }
            },
            lastOrderDate: { $max: '$orders.createdAt' },
            segment: {
              $cond: [
                { $eq: [{ $size: '$orders' }, 0] },
                'prospect',
                { $cond: [
                  { $gte: [{ $size: '$orders' }, 5] },
                  'loyal',
                  'regular'
                ]}
              ]
            }
          }
        },
        { $group: {
            _id: '$segment',
            count: { $sum: 1 },
            averageSpent: { $avg: '$totalSpent' },
            totalRevenue: { $sum: '$totalSpent' }
          }
        }
      ]),

      // Top customers
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: {
            _id: '$user',
            totalSpent: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
            firstOrder: { $min: '$createdAt' },
            lastOrder: { $max: '$createdAt' },
            averageOrderValue: { $avg: '$totalAmount' },
            favoriteCategory: { $addToSet: '$items.category' }
          }
        },
        { $sort: { [sortBy]: -1 } },
        { $limit: 20 },
        { $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $project: {
            customerId: '$_id',
            name: '$user.name',
            email: '$user.email',
            joined: '$user.createdAt',
            totalSpent: 1,
            orderCount: 1,
            averageOrderValue: { $round: ['$averageOrderValue', 2] },
            customerLifetime: {
              $divide: [
                { $subtract: [new Date(), '$firstOrder'] },
                1000 * 60 * 60 * 24 // Convert to days
              ]
            },
            orderFrequency: {
              $cond: [
                { $gt: ['$orderCount', 1] },
                { $divide: [
                    { $subtract: ['$lastOrder', '$firstOrder'] },
                    { $multiply: [1000 * 60 * 60 * 24, '$orderCount'] }
                  ]
                },
                0
              ]
            }
          }
        }
      ]),

      // Customer geographic distribution
      User.aggregate([
        { $match: { 
            role: 'customer',
            $or: [
              { city: { $exists: true, $ne: '' } },
              { country: { $exists: true, $ne: '' } }
            ]
          }
        },
        { $group: {
            _id: {
              country: '$country',
              city: '$city'
            },
            count: { $sum: 1 },
            totalSpent: {
              $sum: {
                $reduce: {
                  input: '$orders',
                  initialValue: 0,
                  in: { 
                    $add: [
                      '$$value',
                      { $cond: [
                        { $eq: ['$$this.status', 'completed'] },
                        '$$this.totalAmount',
                        0
                      ]}
                    ]
                  }
                }
              }
            }
          }
        },
        { $project: {
            location: {
              $cond: [
                { $and: ['$_id.city', '$_id.country'] },
                { $concat: ['$_id.city', ', ', '$_id.country'] },
                { $ifNull: ['$_id.city', '$_id.country'] }
              ]
            },
            count: 1,
            totalSpent: 1,
            averageValue: { $divide: ['$totalSpent', '$count'] }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 15 }
      ]),

      // Customer acquisition trend
      User.aggregate([
        { $match: { 
            role: 'customer',
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        { $group: {
            _id: { 
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$createdAt" 
              } 
            },
            newCustomers: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Calculate retention metrics
    const activeCustomers = await Order.distinct('user', {
      createdAt: { $gte: thirtyDaysAgo },
      status: 'completed'
    });

    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    const retentionMetrics = {
      totalCustomers,
      activeCustomers: activeCustomers.length,
      retentionRate: totalCustomers > 0 ? 
        (activeCustomers.length / totalCustomers * 100).toFixed(2) : 0,
      averageCustomerValue: topCustomers.length > 0 ? 
        topCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / topCustomers.length : 0
    };

    res.json({
      success: true,
      data: {
        customerSegments,
        topCustomers,
        customerLocations,
        acquisitionTrend,
        metrics: retentionMetrics
      }
    });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching customer analytics', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get real-time analytics
// @route   GET /api/v1/analytics/realtime
// @access  Private/Admin
router.get('/realtime', async (req, res) => {
  try {
    const { oneHourAgo, sevenDaysAgo } = getDateRanges();
    
    const [
      recentActivity,
      currentStats,
      hourlyTrend
    ] = await Promise.all([
      // Recent activity (orders, users, etc.)
      Order.find({ 
        createdAt: { $gte: oneHourAgo } 
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'name email')
      .lean(),

      // Current statistics
      Promise.all([
        Order.countDocuments({ 
          createdAt: { $gte: oneHourAgo },
          status: 'completed'
        }),
        
        Order.aggregate([
          { $match: { 
              createdAt: { $gte: oneHourAgo },
              status: 'completed' 
            } 
          },
          { $group: {
              _id: null,
              total: { $sum: '$totalAmount' }
            }
          }
        ]),
        
        User.countDocuments({ 
          createdAt: { $gte: oneHourAgo } 
        }),
        
        Product.countDocuments({ stock: 0 })
      ]),

      // Hourly trend for today
      Order.aggregate([
        { $match: { 
            createdAt: { $gte: oneHourAgo },
            status: 'completed' 
          } 
        },
        { $group: {
            _id: { 
              $dateToString: { 
                format: "%Y-%m-%d %H:00", 
                date: "$createdAt" 
              } 
            },
            orders: { $sum: 1 },
            revenue: { $sum: '$totalAmount' },
            customers: { $addToSet: '$user' }
          }
        },
        { $sort: { _id: 1 } },
        { $project: {
            hour: '$_id',
            orders: 1,
            revenue: 1,
            uniqueCustomers: { $size: '$customers' }
          }
        }
      ])
    ]);

    const [recentOrders, recentRevenue, newUsers, outOfStock] = currentStats;

    res.json({
      success: true,
      data: {
        currentStats: {
          recentOrders,
          recentRevenue: recentRevenue[0]?.total || 0,
          newUsers,
          outOfStockProducts: outOfStock
        },
        recentActivity,
        hourlyTrend,
        system: {
          timestamp: new Date(),
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage()
        }
      }
    });
  } catch (error) {
    console.error('Realtime analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching realtime analytics', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get share analytics
// @route   POST /api/v1/analytics/shares
// @access  Private/Admin
router.post('/shares', async (req, res) => {
  try {
    const { startDate, endDate, platform } = req.body;
    
    // This is a placeholder - implement your actual share tracking logic
    // You would typically have a Share model to track social shares
    
    const filter = {};
    if (platform) filter.platform = platform;
    if (startDate && endDate) {
      filter.sharedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Mock response - replace with actual database queries
    res.json({
      success: true,
      message: 'Share analytics retrieved',
      data: {
        totalShares: 156,
        sharesByPlatform: {
          whatsapp: 78,
          facebook: 42,
          twitter: 21,
          email: 15
        },
        conversionRate: 12.5,
        topSharedProducts: [
          { productId: 'premium_plan', shares: 89 },
          { productId: 'basic_plan', shares: 45 },
          { productId: 'enterprise_plan', shares: 22 }
        ],
        metrics: {
          shareToOrderConversion: 8.2,
          averageSharesPerUser: 2.1,
          mostActiveSharingPeriod: '18:00-20:00'
        },
        timeframe: {
          startDate: startDate || '2024-01-01',
          endDate: endDate || '2024-01-31'
        }
      }
    });
  } catch (error) {
    console.error('Share analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching share analytics'
    });
  }
});

// @desc    Track a share
// @route   POST /api/v1/analytics/shares/track
// @access  Public (or authenticated based on your needs)
router.post('/shares/track', async (req, res) => {
  try {
    const { productId, platform, userId, metadata } = req.body;
    
    if (!productId || !platform) {
      return res.status(400).json({
        success: false,
        message: 'productId and platform are required'
      });
    }

    // Here you would typically:
    // 1. Save to Share collection
    // 2. Update product share count
    // 3. Log for analytics
    
    res.json({
      success: true,
      message: 'Share tracked successfully',
      data: {
        trackId: `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        platform,
        userId: userId || null,
        trackedAt: new Date().toISOString(),
        metadata: metadata || {},
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });
  } catch (error) {
    console.error('Track share error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error tracking share'
    });
  }
});

// @desc    Track a payment
// @route   POST /api/v1/analytics/payments/track
// @access  Private
router.post('/payments/track', async (req, res) => {
  try {
    const { paymentId, amount, productId, userId, status, paymentMethod } = req.body;
    
    if (!paymentId || !amount || !productId) {
      return res.status(400).json({
        success: false,
        message: 'paymentId, amount, and productId are required'
      });
    }

    // Here you would typically:
    // 1. Save to Payment collection
    // 2. Update analytics
    // 3. Trigger any post-payment actions
    
    res.json({
      success: true,
      message: 'Payment tracked successfully',
      data: {
        paymentId,
        amount,
        productId,
        userId: userId || null,
        status: status || 'completed',
        paymentMethod: paymentMethod || 'stripe',
        trackedAt: new Date().toISOString(),
        analytics: {
          conversionValue: amount,
          revenueAttribution: 'direct'
        }
      }
    });
  } catch (error) {
    console.error('Track payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error tracking payment'
    });
  }
});

// @desc    Get custom report
// @route   POST /api/v1/analytics/report
// @access  Private/Admin
router.post('/report', async (req, res) => {
  try {
    const { 
      metrics = ['revenue', 'orders', 'customers'],
      dimensions = ['date', 'category'],
      filters = {},
      dateRange,
      format = 'json'
    } = req.body;

    // Build aggregation pipeline based on request
    const pipeline = [];
    
    // Add match stage for filters
    const matchStage = {};
    
    if (dateRange?.start && dateRange?.end) {
      matchStage.createdAt = {
        $gte: new Date(dateRange.start),
        $lte: new Date(dateRange.end)
      };
    }
    
    if (filters.status) {
      matchStage.status = filters.status;
    }
    
    if (filters.category) {
      matchStage['items.category'] = filters.category;
    }
    
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Add group stage based on dimensions
    const groupStage = { _id: {} };
    
    dimensions.forEach(dim => {
      switch(dim) {
        case 'date':
          groupStage._id.date = { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$createdAt" 
            } 
          };
          break;
        case 'month':
          groupStage._id.month = { 
            $dateToString: { 
              format: "%Y-%m", 
              date: "$createdAt" 
            } 
          };
          break;
        case 'category':
          groupStage._id.category = '$items.category';
          break;
        case 'product':
          groupStage._id.productId = '$items.product';
          groupStage._id.productName = '$items.name';
          break;
        case 'customer':
          groupStage._id.customerId = '$user';
          break;
      }
    });

    // Add metrics to group stage
    metrics.forEach(metric => {
      switch(metric) {
        case 'revenue':
          groupStage.revenue = { $sum: '$totalAmount' };
          break;
        case 'orders':
          groupStage.orders = { $sum: 1 };
          break;
        case 'items':
          groupStage.items = { $sum: { $sum: '$items.quantity' } };
          break;
        case 'customers':
          groupStage.customers = { $addToSet: '$user' };
          break;
        case 'averageOrderValue':
          groupStage.averageOrderValue = { $avg: '$totalAmount' };
          break;
      }
    });

    pipeline.push({ $unwind: '$items' });
    pipeline.push({ $group: groupStage });
    
    // Add post-processing for customer count
    if (metrics.includes('customers')) {
      pipeline.push({
        $addFields: {
          customers: { $size: '$customers' }
        }
      });
    }

    pipeline.push({ $sort: { '_id.date': 1 } });

    const reportData = await Order.aggregate(pipeline);

    res.json({
      success: true,
      data: {
        report: reportData,
        metadata: {
          generatedAt: new Date().toISOString(),
          metrics,
          dimensions,
          filters,
          dateRange,
          recordCount: reportData.length
        }
      }
    });
  } catch (error) {
    console.error('Custom report error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating report', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;