const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { authenticate } = require('../middleware/auth');
const { sendOrderConfirmationEmail } = require('../services/emailService');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', authenticate, [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('currency').optional().isIn(['INR', 'USD']).withMessage('Invalid currency'),
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('shippingAddress.phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
  body('shippingAddress.addressLine1').trim().isLength({ min: 5 }).withMessage('Address line 1 is required'),
  body('shippingAddress.city').trim().isLength({ min: 2 }).withMessage('City is required'),
  body('shippingAddress.state').trim().isLength({ min: 2 }).withMessage('State is required'),
  body('shippingAddress.pincode').trim().isLength({ min: 6, max: 6 }).withMessage('Valid pincode is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { amount, currency = 'INR', items, shippingAddress, notes } = req.body;
    
    // Validate items and calculate total
    let calculatedAmount = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.product}` });
      }
      
      if (!product.isActive) {
        return res.status(400).json({ message: `Product is not available: ${product.name}` });
      }
      
      if (product.availableStock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.availableStock}, Requested: ${item.quantity}` 
        });
      }
      
      const itemTotal = product.price * item.quantity;
      calculatedAmount += itemTotal;
      
      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.mainImage,
        price: product.price,
        quantity: item.quantity,
        sku: product.sku,
        category: product.category,
        series: product.series,
        customization: item.customization || {}
      });
    }
    
    // Add tax (18% GST)
    const tax = calculatedAmount * 0.18;
    const shipping = calculatedAmount >= 500 ? 0 : 50; // Free shipping above ₹500
    const total = calculatedAmount + tax + shipping;
    
    // Verify amount matches
    if (Math.abs(amount - total) > 0.01) {
      return res.status(400).json({ 
        message: 'Amount mismatch', 
        calculated: total, 
        provided: amount 
      });
    }
    
    // Create order in database
    const order = new Order({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      pricing: {
        subtotal: calculatedAmount,
        tax,
        shipping,
        total
      },
      payment: {
        method: 'card',
        status: 'pending',
        amount: total,
        currency
      },
      notes: {
        customer: notes
      }
    });
    
    await order.save();
    
    // Reserve stock for items
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'stock.reserved': item.quantity }
      });
    }
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // Convert to paisa
      currency,
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });
    
    // Update order with Razorpay order ID
    order.payment.razorpayOrderId = razorpayOrder.id;
    await order.save();
    
    res.json({
      orderId: order._id,
      orderNumber: order.orderNumber,
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: 'Taksha Veda',
      description: 'Handcrafted Products',
      image: 'https://takshaveda.com/logo.png',
      prefill: {
        name: shippingAddress.name,
        email: shippingAddress.email,
        contact: shippingAddress.phone
      },
      theme: {
        color: '#D97706'
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// Verify payment
router.post('/verify-payment', authenticate, [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required'),
  body('orderId').notEmpty().withMessage('Order ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }
    
    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');
    
    if (razorpay_signature !== expectedSign) {
      // Payment verification failed
      order.payment.status = 'failed';
      order.payment.failureReason = 'Invalid signature';
      await order.save();
      
      // Release reserved stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { 'stock.reserved': -item.quantity }
        });
      }
      
      return res.status(400).json({ message: 'Payment verification failed' });
    }
    
    // Payment successful
    order.payment.status = 'completed';
    order.payment.razorpayPaymentId = razorpay_payment_id;
    order.payment.razorpaySignature = razorpay_signature;
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    
    // Add tracking
    order.tracking.push({
      status: 'confirmed',
      message: 'Payment received and order confirmed',
      timestamp: new Date()
    });
    
    await order.save();
    
    // Reduce stock and release reserved stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 
          'stock.quantity': -item.quantity,
          'stock.reserved': -item.quantity,
          'salesCount': item.quantity
        }
      });
    }
    
    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );
    
    // Send order confirmation email
    await sendOrderConfirmationEmail(order);
    
    res.json({
      message: 'Payment verified successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.pricing.total,
        paidAt: order.payment.paidAt
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error while verifying payment' });
  }
});

// Handle payment failure
router.post('/payment-failed', authenticate, [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('error').isObject().withMessage('Error details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { razorpay_order_id, orderId, error } = req.body;
    
    // Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to order' });
    }
    
    // Update order status
    order.payment.status = 'failed';
    order.payment.failureReason = error.description || 'Payment failed';
    order.status = 'cancelled';
    
    // Add tracking
    order.tracking.push({
      status: 'cancelled',
      message: `Payment failed: ${error.description}`,
      timestamp: new Date()
    });
    
    // Set cancellation details
    order.cancellation = {
      reason: 'Payment failed',
      cancelledAt: new Date(),
      cancelledBy: req.user._id
    };
    
    await order.save();
    
    // Release reserved stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'stock.reserved': -item.quantity }
      });
    }
    
    res.json({
      message: 'Payment failure recorded',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        failureReason: order.payment.failureReason
      }
    });
  } catch (error) {
    console.error('Payment failure error:', error);
    res.status(500).json({ message: 'Server error while recording payment failure' });
  }
});

// Get payment details
router.get('/payment/:paymentId', authenticate, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    // Find order with this payment ID
    const order = await Order.findOne({ 'payment.razorpayPaymentId': paymentId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found for this payment' });
    }
    
    if (order.user.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to payment details' });
    }
    
    res.json({
      payment,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.pricing.total
      }
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ message: 'Server error while fetching payment details' });
  }
});

// Refund payment (Admin only)
router.post('/refund', authenticate, [
  body('paymentId').notEmpty().withMessage('Payment ID is required'),
  body('amount').optional().isFloat({ min: 1 }).withMessage('Amount must be a positive number'),
  body('reason').optional().trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { paymentId, amount, reason } = req.body;
    
    // Find order
    const order = await Order.findOne({ 'payment.razorpayPaymentId': paymentId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found for this payment' });
    }
    
    // Check if user is admin or order owner
    if (req.user.userType !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to refund' });
    }
    
    // Create refund
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to paisa
      notes: {
        reason: reason || 'Refund requested',
        orderId: order._id.toString()
      }
    });
    
    // Update order
    order.refund = {
      status: 'processing',
      amount: amount || order.pricing.total,
      reason: reason || 'Refund requested',
      requestedAt: new Date(),
      refundId: refund.id
    };
    
    order.payment.status = 'refunded';
    
    // Add tracking
    order.tracking.push({
      status: 'refunded',
      message: `Refund initiated: ${reason || 'Refund requested'}`,
      timestamp: new Date(),
      updatedBy: req.user._id
    });
    
    await order.save();
    
    res.json({
      message: 'Refund initiated successfully',
      refund,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        refundStatus: order.refund.status,
        refundAmount: order.refund.amount
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ message: 'Server error while processing refund' });
  }
});

// Get refund details
router.get('/refund/:refundId', authenticate, async (req, res) => {
  try {
    const { refundId } = req.params;
    
    // Get refund details from Razorpay
    const refund = await razorpay.refunds.fetch(refundId);
    
    // Find order with this refund ID
    const order = await Order.findOne({ 'refund.refundId': refundId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found for this refund' });
    }
    
    if (order.user.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to refund details' });
    }
    
    res.json({
      refund,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        refundStatus: order.refund.status
      }
    });
  } catch (error) {
    console.error('Get refund details error:', error);
    res.status(500).json({ message: 'Server error while fetching refund details' });
  }
});

// Webhook for Razorpay events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }
    
    const event = JSON.parse(body);
    
    switch (event.event) {
      case 'payment.captured':
        // Handle successful payment
        const paymentCaptured = event.payload.payment.entity;
        await handlePaymentCaptured(paymentCaptured);
        break;
        
      case 'payment.failed':
        // Handle failed payment
        const paymentFailed = event.payload.payment.entity;
        await handlePaymentFailed(paymentFailed);
        break;
        
      case 'refund.processed':
        // Handle refund processed
        const refundProcessed = event.payload.refund.entity;
        await handleRefundProcessed(refundProcessed);
        break;
        
      default:
        console.log('Unhandled webhook event:', event.event);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing error' });
  }
});

// Helper functions for webhook handling
async function handlePaymentCaptured(payment) {
  const order = await Order.findOne({ 'payment.razorpayOrderId': payment.order_id });
  if (order) {
    order.payment.status = 'completed';
    order.payment.razorpayPaymentId = payment.id;
    order.payment.paidAt = new Date();
    await order.save();
  }
}

async function handlePaymentFailed(payment) {
  const order = await Order.findOne({ 'payment.razorpayOrderId': payment.order_id });
  if (order) {
    order.payment.status = 'failed';
    order.payment.failureReason = payment.error_description;
    order.status = 'cancelled';
    await order.save();
  }
}

async function handleRefundProcessed(refund) {
  const order = await Order.findOne({ 'refund.refundId': refund.id });
  if (order) {
    order.refund.status = 'completed';
    order.refund.processedAt = new Date();
    await order.save();
  }
}

module.exports = router;