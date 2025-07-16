const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticate, async (req, res) => {
  try {
    const cart = await Cart.getOrCreateCart(req.user._id);
    await cart.populate('items.product', 'name price originalPrice images category series isActive stock');
    
    // Filter out inactive products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    
    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// Add item to cart
router.post('/add', authenticate, [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('customization').optional().isObject().withMessage('Customization must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { productId, quantity, customization = {} } = req.body;
    
    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }
    
    // Check stock availability
    if (product.availableStock < quantity) {
      return res.status(400).json({ 
        message: 'Insufficient stock', 
        available: product.availableStock,
        requested: quantity
      });
    }
    
    // Get or create cart
    const cart = await Cart.getOrCreateCart(req.user._id);
    
    // Add item to cart
    await cart.addItem(productId, quantity, product.price, customization);
    
    // Populate cart with product details
    await cart.populate('items.product', 'name price originalPrice images category series isActive stock');
    
    res.json({
      message: 'Item added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// Update item quantity
router.put('/update/:productId', authenticate, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { productId } = req.params;
    const { quantity } = req.body;
    
    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // If quantity is 0, remove item
    if (quantity === 0) {
      await cart.removeItem(productId);
    } else {
      // Check product availability
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      if (!product.isActive) {
        return res.status(400).json({ message: 'Product is not available' });
      }
      
      if (product.availableStock < quantity) {
        return res.status(400).json({ 
          message: 'Insufficient stock', 
          available: product.availableStock,
          requested: quantity
        });
      }
      
      await cart.updateItemQuantity(productId, quantity);
    }
    
    // Populate cart with product details
    await cart.populate('items.product', 'name price originalPrice images category series isActive stock');
    
    res.json({
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    if (error.message === 'Item not found in cart') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    await cart.removeItem(productId);
    
    // Populate cart with product details
    await cart.populate('items.product', 'name price originalPrice images category series isActive stock');
    
    res.json({
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
});

// Clear cart
router.delete('/clear', authenticate, async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    await cart.clearCart();
    
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
});

// Apply coupon
router.post('/apply-coupon', authenticate, [
  body('couponCode').trim().notEmpty().withMessage('Coupon code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { couponCode } = req.body;
    
    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Simple coupon validation (you can expand this)
    const validCoupons = {
      'WELCOME10': { discount: 10, minAmount: 500, type: 'percentage' },
      'SAVE50': { discount: 50, minAmount: 1000, type: 'fixed' },
      'FIRSTORDER': { discount: 15, minAmount: 300, type: 'percentage' }
    };
    
    const coupon = validCoupons[couponCode.toUpperCase()];
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }
    
    const subtotal = cart.subtotal;
    if (subtotal < coupon.minAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of ₹${coupon.minAmount} required for this coupon` 
      });
    }
    
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.discount) / 100;
    } else {
      discount = coupon.discount;
    }
    
    // Apply coupon
    await cart.applyCoupon(couponCode.toUpperCase(), discount);
    
    // Populate cart with product details
    await cart.populate('items.product', 'name price originalPrice images category series isActive stock');
    
    res.json({
      message: 'Coupon applied successfully',
      cart,
      discount: {
        code: couponCode.toUpperCase(),
        amount: discount,
        type: coupon.type
      }
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ message: 'Server error while applying coupon' });
  }
});

// Remove coupon
router.delete('/remove-coupon', authenticate, async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    await cart.removeCoupon();
    
    // Populate cart with product details
    await cart.populate('items.product', 'name price originalPrice images category series isActive stock');
    
    res.json({
      message: 'Coupon removed successfully',
      cart
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({ message: 'Server error while removing coupon' });
  }
});

// Get cart summary
router.get('/summary', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        total: 0
      });
    }
    
    await cart.populate('items.product', 'name price isActive stock');
    
    // Filter out inactive products
    cart.items = cart.items.filter(item => item.product && item.product.isActive);
    
    const summary = {
      itemCount: cart.totalItems,
      subtotal: cart.subtotal,
      discount: cart.couponDiscount,
      total: cart.total,
      couponCode: cart.couponCode,
      hasItems: cart.items.length > 0
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({ message: 'Server error while fetching cart summary' });
  }
});

// Validate cart items (check stock availability)
router.post('/validate', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    await cart.populate('items.product', 'name price isActive stock');
    
    const validationResults = [];
    let hasErrors = false;
    
    for (const item of cart.items) {
      const result = {
        productId: item.product._id,
        name: item.product.name,
        requestedQuantity: item.quantity,
        isValid: true,
        error: null
      };
      
      if (!item.product.isActive) {
        result.isValid = false;
        result.error = 'Product is no longer available';
        hasErrors = true;
      } else if (item.product.availableStock < item.quantity) {
        result.isValid = false;
        result.error = `Only ${item.product.availableStock} items available`;
        result.availableQuantity = item.product.availableStock;
        hasErrors = true;
      }
      
      validationResults.push(result);
    }
    
    res.json({
      isValid: !hasErrors,
      items: validationResults,
      message: hasErrors ? 'Some items in your cart are not available' : 'Cart is valid'
    });
  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({ message: 'Server error while validating cart' });
  }
});

module.exports = router;