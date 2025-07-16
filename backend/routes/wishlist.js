const express = require('express');
const { body, validationResult } = require('express-validator');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.getWithProducts(req.user._id);
    
    if (!wishlist) {
      return res.json({ wishlist: { items: [], itemCount: 0 } });
    }
    
    // Filter out null products (inactive products)
    wishlist.items = wishlist.items.filter(item => item.product !== null);
    
    res.json({ wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
});

// Add item to wishlist
router.post('/add', authenticate, [
  body('productId').notEmpty().withMessage('Product ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { productId } = req.body;
    
    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }
    
    // Get or create wishlist
    const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
    
    // Check if item already exists
    if (wishlist.hasItem(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    // Add item to wishlist
    await wishlist.addItem(productId);
    
    // Increment product wishlist count
    await product.incrementWishlistCount();
    
    // Get updated wishlist with products
    const updatedWishlist = await Wishlist.getWithProducts(req.user._id);
    
    res.json({
      message: 'Item added to wishlist successfully',
      wishlist: updatedWishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error while adding to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/remove/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Get wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Check if item exists in wishlist
    if (!wishlist.hasItem(productId)) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }
    
    // Remove item from wishlist
    await wishlist.removeItem(productId);
    
    // Decrement product wishlist count
    const product = await Product.findById(productId);
    if (product) {
      await product.decrementWishlistCount();
    }
    
    // Get updated wishlist with products
    const updatedWishlist = await Wishlist.getWithProducts(req.user._id);
    
    res.json({
      message: 'Item removed from wishlist successfully',
      wishlist: updatedWishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
});

// Toggle item in wishlist (add if not exists, remove if exists)
router.post('/toggle', authenticate, [
  body('productId').notEmpty().withMessage('Product ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { productId } = req.body;
    
    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }
    
    // Get or create wishlist
    const wishlist = await Wishlist.getOrCreateWishlist(req.user._id);
    
    let message, action;
    
    if (wishlist.hasItem(productId)) {
      // Remove from wishlist
      await wishlist.removeItem(productId);
      await product.decrementWishlistCount();
      message = 'Item removed from wishlist';
      action = 'removed';
    } else {
      // Add to wishlist
      await wishlist.addItem(productId);
      await product.incrementWishlistCount();
      message = 'Item added to wishlist';
      action = 'added';
    }
    
    // Get updated wishlist with products
    const updatedWishlist = await Wishlist.getWithProducts(req.user._id);
    
    res.json({
      message,
      action,
      wishlist: updatedWishlist,
      inWishlist: action === 'added'
    });
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ message: 'Server error while toggling wishlist' });
  }
});

// Clear wishlist
router.delete('/clear', authenticate, async (req, res) => {
  try {
    // Get wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Decrement wishlist count for all products
    for (const item of wishlist.items) {
      const product = await Product.findById(item.product);
      if (product) {
        await product.decrementWishlistCount();
      }
    }
    
    // Clear wishlist
    await wishlist.clearWishlist();
    
    res.json({ message: 'Wishlist cleared successfully' });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ message: 'Server error while clearing wishlist' });
  }
});

// Get wishlist summary
router.get('/summary', authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    if (!wishlist) {
      return res.json({
        itemCount: 0,
        hasItems: false
      });
    }
    
    const summary = {
      itemCount: wishlist.itemCount,
      hasItems: wishlist.items.length > 0,
      recentItemsCount: wishlist.recentItems.length
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Get wishlist summary error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist summary' });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    
    const inWishlist = wishlist ? wishlist.hasItem(productId) : false;
    
    res.json({ inWishlist });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ message: 'Server error while checking wishlist' });
  }
});

// Get wishlist items by category
router.get('/category/:category', authenticate, async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!['corporate', 'custom', 'home', 'personal', 'new', 'spiritual'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    const wishlist = await Wishlist.getWithProducts(req.user._id);
    
    if (!wishlist) {
      return res.json({ items: [] });
    }
    
    const items = wishlist.getItemsByCategory(category);
    
    res.json({ items });
  } catch (error) {
    console.error('Get wishlist by category error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist by category' });
  }
});

// Get wishlist items by series
router.get('/series/:series', authenticate, async (req, res) => {
  try {
    const { series } = req.params;
    
    if (!['TakshaVerse', 'Moments+', 'Epoch Series', 'Ark Series', 'Spiritual Collection'].includes(series)) {
      return res.status(400).json({ message: 'Invalid series' });
    }
    
    const wishlist = await Wishlist.getWithProducts(req.user._id);
    
    if (!wishlist) {
      return res.json({ items: [] });
    }
    
    const items = wishlist.getItemsBySeries(series);
    
    res.json({ items });
  } catch (error) {
    console.error('Get wishlist by series error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist by series' });
  }
});

// Get sorted wishlist items
router.get('/sorted/:sortBy', authenticate, async (req, res) => {
  try {
    const { sortBy } = req.params;
    
    if (!['newest', 'oldest', 'price_low', 'price_high', 'name'].includes(sortBy)) {
      return res.status(400).json({ message: 'Invalid sort option' });
    }
    
    const wishlist = await Wishlist.getWithProducts(req.user._id);
    
    if (!wishlist) {
      return res.json({ items: [] });
    }
    
    const items = wishlist.getSortedItems(sortBy);
    
    res.json({ items });
  } catch (error) {
    console.error('Get sorted wishlist error:', error);
    res.status(500).json({ message: 'Server error while fetching sorted wishlist' });
  }
});

// Get wishlist items in price range
router.get('/price-range/:minPrice/:maxPrice', authenticate, async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.params;
    
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    
    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
      return res.status(400).json({ message: 'Invalid price range' });
    }
    
    const wishlist = await Wishlist.getWithProducts(req.user._id);
    
    if (!wishlist) {
      return res.json({ items: [] });
    }
    
    const items = wishlist.getItemsInPriceRange(min, max);
    
    res.json({ items });
  } catch (error) {
    console.error('Get wishlist by price range error:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist by price range' });
  }
});

// Move item from wishlist to cart
router.post('/move-to-cart', authenticate, [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { productId, quantity = 1 } = req.body;
    
    // Get wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Check if item exists in wishlist
    if (!wishlist.hasItem(productId)) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }
    
    // Get product details
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
    
    // Add to cart
    const Cart = require('../models/Cart');
    const cart = await Cart.getOrCreateCart(req.user._id);
    await cart.addItem(productId, quantity, product.price);
    
    // Remove from wishlist
    await wishlist.removeItem(productId);
    await product.decrementWishlistCount();
    
    // Get updated wishlist
    const updatedWishlist = await Wishlist.getWithProducts(req.user._id);
    
    res.json({
      message: 'Item moved to cart successfully',
      wishlist: updatedWishlist
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({ message: 'Server error while moving item to cart' });
  }
});

module.exports = router;