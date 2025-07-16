const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Blog = require('../models/Blog');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      userStats,
      orderStats,
      blogStats
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped', 'out_for_delivery'] } } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .select('orderNumber status pricing.total createdAt'),
      Product.find({ isActive: true })
        .sort({ salesCount: -1 })
        .limit(5)
        .select('name price salesCount category'),
      User.aggregate([
        { $group: { _id: '$userType', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Blog.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders,
      topProducts,
      userStats,
      orderStats,
      blogStats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard statistics' });
  }
});

// Get sales analytics
router.get('/analytics/sales', authenticate, requireAdmin, [
  query('period').optional().isIn(['7d', '30d', '90d', '1y', 'custom']).withMessage('Invalid period'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], async (req, res) => {
  try {
    const { period = '30d', startDate, endDate } = req.query;
    
    let start, end;
    if (period === 'custom' && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      const periodMap = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      };
      start = new Date(end.getTime() - periodMap[period] * 24 * 60 * 60 * 1000);
    }
    
    const [
      salesByDay,
      salesByCategory,
      salesBySeries,
      topProducts,
      orderTrends
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: { $in: ['delivered', 'shipped', 'out_for_delivery'] }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            sales: { $sum: '$pricing.total' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: { $in: ['delivered', 'shipped', 'out_for_delivery'] }
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.category',
            sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            quantity: { $sum: '$items.quantity' }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: { $in: ['delivered', 'shipped', 'out_for_delivery'] }
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.series',
            sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            quantity: { $sum: '$items.quantity' }
          }
        }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end },
            status: { $in: ['delivered', 'shipped', 'out_for_delivery'] }
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.name',
            sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            quantity: { $sum: '$items.quantity' },
            category: { $first: '$items.category' }
          }
        },
        { $sort: { sales: -1 } },
        { $limit: 10 }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
            shipped: { $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] } },
            delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);
    
    res.json({
      period: { start, end },
      salesByDay,
      salesByCategory,
      salesBySeries,
      topProducts,
      orderTrends
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching sales analytics' });
  }
});

// Get product analytics
router.get('/analytics/products', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      productsByCategory,
      productsBySeries,
      stockStatus,
      topRatedProducts,
      mostViewedProducts,
      mostWishlistedProducts
    ] = await Promise.all([
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$series', count: { $sum: 1 } } }
      ]),
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            inStock: { $sum: { $cond: [{ $gt: ['$stock.quantity', 0] }, 1, 0] } },
            outOfStock: { $sum: { $cond: [{ $eq: ['$stock.quantity', 0] }, 1, 0] } },
            lowStock: { $sum: { $cond: [{ $and: [{ $gt: ['$stock.quantity', 0] }, { $lte: ['$stock.quantity', '$stock.threshold'] }] }, 1, 0] } }
          }
        }
      ]),
      Product.find({ isActive: true })
        .sort({ 'rating.average': -1 })
        .limit(10)
        .select('name rating.average rating.count category price'),
      Product.find({ isActive: true })
        .sort({ viewCount: -1 })
        .limit(10)
        .select('name viewCount category price'),
      Product.find({ isActive: true })
        .sort({ wishlistCount: -1 })
        .limit(10)
        .select('name wishlistCount category price')
    ]);
    
    res.json({
      productsByCategory,
      productsBySeries,
      stockStatus: stockStatus[0] || { inStock: 0, outOfStock: 0, lowStock: 0 },
      topRatedProducts,
      mostViewedProducts,
      mostWishlistedProducts
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching product analytics' });
  }
});

// Get user analytics
router.get('/analytics/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      usersByType,
      usersByProvider,
      userGrowth,
      activeUsers,
      topCustomers
    ] = await Promise.all([
      User.aggregate([
        { $group: { _id: '$userType', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: '$provider', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            newUsers: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } },
        { $limit: 12 }
      ]),
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            inactive: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } }
          }
        }
      ]),
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'shipped', 'out_for_delivery'] } } },
        {
          $group: {
            _id: '$user',
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$pricing.total' }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            name: '$user.name',
            email: '$user.email',
            totalOrders: 1,
            totalSpent: 1
          }
        }
      ])
    ]);
    
    res.json({
      usersByType,
      usersByProvider,
      userGrowth,
      activeUsers: activeUsers[0] || { total: 0, active: 0, inactive: 0 },
      topCustomers
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching user analytics' });
  }
});

// Get inventory alerts
router.get('/inventory/alerts', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      lowStockProducts,
      outOfStockProducts,
      overStockedProducts
    ] = await Promise.all([
      Product.find({
        isActive: true,
        'stock.quantity': { $gt: 0, $lte: 5 }
      }).select('name category stock.quantity stock.threshold'),
      Product.find({
        isActive: true,
        'stock.quantity': 0
      }).select('name category stock.quantity'),
      Product.find({
        isActive: true,
        'stock.quantity': { $gt: 100 }
      }).select('name category stock.quantity')
    ]);
    
    res.json({
      lowStockProducts,
      outOfStockProducts,
      overStockedProducts,
      alerts: {
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        overStocked: overStockedProducts.length
      }
    });
  } catch (error) {
    console.error('Get inventory alerts error:', error);
    res.status(500).json({ message: 'Server error while fetching inventory alerts' });
  }
});

// Get recent activities
router.get('/activities/recent', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const [
      recentOrders,
      recentUsers,
      recentProducts,
      recentBlogs
    ] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(limit) / 4)
        .populate('user', 'name email')
        .select('orderNumber status pricing.total createdAt'),
      User.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(limit) / 4)
        .select('name email userType createdAt'),
      Product.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(limit) / 4)
        .select('name category price createdAt'),
      Blog.find()
        .sort({ createdAt: -1 })
        .limit(parseInt(limit) / 4)
        .populate('author', 'name')
        .select('title status createdAt author')
    ]);
    
    // Combine and sort all activities
    const activities = [
      ...recentOrders.map(order => ({
        type: 'order',
        title: `New order #${order.orderNumber}`,
        description: `Order placed by ${order.user.name}`,
        amount: order.pricing.total,
        status: order.status,
        createdAt: order.createdAt
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        title: `New user registered`,
        description: `${user.name} joined as ${user.userType}`,
        createdAt: user.createdAt
      })),
      ...recentProducts.map(product => ({
        type: 'product',
        title: `New product added`,
        description: `${product.name} in ${product.category}`,
        amount: product.price,
        createdAt: product.createdAt
      })),
      ...recentBlogs.map(blog => ({
        type: 'blog',
        title: `New blog post`,
        description: `${blog.title} by ${blog.author.name}`,
        status: blog.status,
        createdAt: blog.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
     .slice(0, parseInt(limit));
    
    res.json({ activities });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ message: 'Server error while fetching recent activities' });
  }
});

// Get system health
router.get('/system/health', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      dbStats,
      orderStats,
      userStats,
      productStats
    ] = await Promise.all([
      // Database connection health
      new Promise((resolve) => {
        const mongoose = require('mongoose');
        resolve({
          status: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
          readyState: mongoose.connection.readyState
        });
      }),
      Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            processing: { $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] } }
          }
        }
      ]),
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } }
          }
        }
      ]),
      Product.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
            outOfStock: { $sum: { $cond: [{ $eq: ['$stock.quantity', 0] }, 1, 0] } }
          }
        }
      ])
    ]);
    
    res.json({
      database: dbStats,
      orders: orderStats[0] || { total: 0, pending: 0, processing: 0 },
      users: userStats[0] || { total: 0, active: 0 },
      products: productStats[0] || { total: 0, active: 0, outOfStock: 0 },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({ message: 'Server error while fetching system health' });
  }
});

module.exports = router;