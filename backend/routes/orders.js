const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sendOrderStatusUpdateEmail } = require('../services/emailService');

const router = express.Router();

// Get user's orders
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { page = 1, limit = 10, status } = req.query;
    
    const options = { page: parseInt(page), limit: parseInt(limit) };
    if (status) options.status = status;
    
    const orders = await Order.getByUser(req.user._id, options);
    const totalOrders = await Order.countDocuments({ 
      user: req.user._id,
      ...(status && { status })
    });
    
    const totalPages = Math.ceil(totalOrders / parseInt(limit));
    
    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .populate('tracking.updatedBy', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// Get order by order number
router.get('/number/:orderNumber', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .populate('tracking.updatedBy', 'name');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Get order by number error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// Cancel order
router.post('/:id/cancel', authenticate, [
  body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Cancellation reason must be between 5 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to cancel this order
    if (order.user.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }
    
    try {
      await order.cancelOrder(reason, req.user._id);
      
      // Release reserved stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { 'stock.reserved': -item.quantity }
        });
      }
      
      // Send status update email
      await sendOrderStatusUpdateEmail(order, 'cancelled', `Order cancelled: ${reason}`);
      
      res.json({
        message: 'Order cancelled successfully',
        order
      });
    } catch (error) {
      if (error.message === 'Order cannot be cancelled') {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
});

// Request refund
router.post('/:id/refund', authenticate, [
  body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Refund reason must be between 5 and 500 characters'),
  body('amount').optional().isFloat({ min: 1 }).withMessage('Refund amount must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { reason, amount } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to request refund for this order
    if (order.user.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }
    
    if (order.payment.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot refund unpaid order' });
    }
    
    if (order.refund.status !== 'none') {
      return res.status(400).json({ message: 'Refund already requested for this order' });
    }
    
    const refundAmount = amount || order.pricing.total;
    
    await order.processRefund(refundAmount, reason);
    
    res.json({
      message: 'Refund requested successfully',
      order
    });
  } catch (error) {
    console.error('Request refund error:', error);
    res.status(500).json({ message: 'Server error while requesting refund' });
  }
});

// Get order tracking
router.get('/:id/tracking', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('tracking.updatedBy', 'name')
      .select('orderNumber tracking status');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is authorized to view this order's tracking
    if (order.user && order.user.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to order tracking' });
    }
    
    res.json({
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      tracking: order.tracking
    });
  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({ message: 'Server error while fetching order tracking' });
  }
});

// Admin routes

// Get all orders (Admin only)
router.get('/admin/all', authenticate, requireAdmin, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
  query('sort').optional().isIn(['newest', 'oldest', 'amount_high', 'amount_low']).withMessage('Invalid sort option')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { page = 1, limit = 20, status, sort = 'newest', search } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (search) {
      filters.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.name': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'amount_high':
        sortOption = { 'pricing.total': -1 };
        break;
      case 'amount_low':
        sortOption = { 'pricing.total': 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }
    
    const orders = await Order.getWithFilters(filters, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption
    });
    
    const totalOrders = await Order.countDocuments(filters);
    const totalPages = Math.ceil(totalOrders / parseInt(limit));
    
    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalOrders,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Update order status (Admin only)
router.put('/:id/status', authenticate, requireAdmin, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned']).withMessage('Invalid status'),
  body('message').optional().trim().isLength({ max: 500 }).withMessage('Message must not exceed 500 characters'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location must not exceed 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { status, message, location } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    await order.updateStatus(status, message, location, req.user._id);
    
    // Send status update email
    await sendOrderStatusUpdateEmail(order, status, message);
    
    // If order is shipped, send shipping notification
    if (status === 'shipped') {
      const { sendOrderShippedEmail } = require('../services/emailService');
      await sendOrderShippedEmail(order);
    }
    
    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// Update shipping details (Admin only)
router.put('/:id/shipping', authenticate, requireAdmin, [
  body('trackingNumber').optional().trim().isLength({ min: 1 }).withMessage('Tracking number is required'),
  body('carrier').optional().trim().isLength({ min: 1 }).withMessage('Carrier is required'),
  body('estimatedDelivery').optional().isISO8601().withMessage('Invalid estimated delivery date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { trackingNumber, carrier, estimatedDelivery } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (trackingNumber) order.shipping.trackingNumber = trackingNumber;
    if (carrier) order.shipping.carrier = carrier;
    if (estimatedDelivery) order.shipping.estimatedDelivery = new Date(estimatedDelivery);
    
    await order.save();
    
    res.json({
      message: 'Shipping details updated successfully',
      order
    });
  } catch (error) {
    console.error('Update shipping details error:', error);
    res.status(500).json({ message: 'Server error while updating shipping details' });
  }
});

// Get order analytics (Admin only)
router.get('/admin/analytics', authenticate, requireAdmin, [
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { startDate, endDate, period = '30d' } = req.query;
    
    let start, end;
    if (startDate && endDate) {
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
    
    const analytics = await Order.getSalesAnalytics(start, end);
    
    // Get order status distribution
    const statusDistribution = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get daily sales
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ['delivered', 'shipped', 'out_for_delivery'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);
    
    res.json({
      analytics: analytics[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalItems: 0
      },
      statusDistribution,
      dailySales,
      period: { start, end }
    });
  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({ message: 'Server error while fetching order analytics' });
  }
});

module.exports = router;