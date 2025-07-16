const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { authenticate, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['corporate', 'custom', 'home', 'personal', 'new', 'spiritual']).withMessage('Invalid category'),
  query('series').optional().isIn(['TakshaVerse', 'Moments+', 'Epoch Series', 'Ark Series', 'Spiritual Collection']).withMessage('Invalid series'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'rating_desc', 'newest', 'oldest']).withMessage('Invalid sort option')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const {
      page = 1,
      limit = 20,
      category,
      series,
      minPrice,
      maxPrice,
      sort = 'newest',
      search,
      isNew,
      isLimited,
      isFeatured
    } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (series) query.series = series;
    if (isNew === 'true') query.isNew = true;
    if (isLimited === 'true') query.isLimited = true;
    if (isFeatured === 'true') query.isFeatured = true;
    
    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'rating_desc':
        sortOption = { 'rating.average': -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }
    
    // If search, add text score to sort
    if (search) {
      sortOption.score = { $meta: 'textScore' };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name')
        .lean(),
      Product.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    
    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.getFeaturedProducts(parseInt(limit));
    
    res.json({ products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error while fetching featured products' });
  }
});

// Get new products
router.get('/new', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.getNewProducts(parseInt(limit));
    
    res.json({ products });
  } catch (error) {
    console.error('Get new products error:', error);
    res.status(500).json({ message: 'Server error while fetching new products' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    if (!['corporate', 'custom', 'home', 'personal', 'new', 'spiritual'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    const products = await Product.getByCategory(category, { page, limit, sort });
    const totalProducts = await Product.countDocuments({ category, isActive: true });
    
    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / parseInt(limit)),
        totalProducts,
        hasNextPage: parseInt(page) < Math.ceil(totalProducts / parseInt(limit)),
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Server error while fetching products by category' });
  }
});

// Get single product by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name profilePicture');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive && (!req.user || req.user.userType !== 'admin')) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Increment view count
    await product.incrementViewCount();
    
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// Get product by slug
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ 'seo.slug': req.params.slug })
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name profilePicture');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive && (!req.user || req.user.userType !== 'admin')) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Increment view count
    await product.incrementViewCount();
    
    res.json({ product });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// Create new product (Admin only)
router.post('/', authenticate, requireAdmin, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['corporate', 'custom', 'home', 'personal', 'new', 'spiritual']).withMessage('Invalid category'),
  body('series').isIn(['TakshaVerse', 'Moments+', 'Epoch Series', 'Ark Series', 'Spiritual Collection']).withMessage('Invalid series'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('stock.quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const productData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };
    
    // Ensure at least one image is marked as main
    if (productData.images && productData.images.length > 0) {
      const hasMainImage = productData.images.some(img => img.isMain);
      if (!hasMainImage) {
        productData.images[0].isMain = true;
      }
    }
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }
    res.status(500).json({ message: 'Server error while creating product' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticate, requireAdmin, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().isIn(['corporate', 'custom', 'home', 'personal', 'new', 'spiritual']).withMessage('Invalid category'),
  body('series').optional().isIn(['TakshaVerse', 'Moments+', 'Epoch Series', 'Ark Series', 'Spiritual Collection']).withMessage('Invalid series'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }).withMessage('Original price must be a positive number'),
  body('stock.quantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'createdBy') {
        product[key] = req.body[key];
      }
    });
    
    product.updatedBy = req.user._id;
    
    await product.save();
    
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Soft delete - just mark as inactive
    product.isActive = false;
    product.updatedBy = req.user._id;
    await product.save();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// Add review to product
router.post('/:id/reviews', authenticate, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 5, max: 500 }).withMessage('Comment must be between 5 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { rating, comment } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (!product.isActive) {
      return res.status(400).json({ message: 'Cannot review inactive product' });
    }
    
    try {
      await product.addReview(req.user._id, req.user.name, rating, comment);
      
      res.status(201).json({
        message: 'Review added successfully',
        product
      });
    } catch (error) {
      if (error.message === 'User has already reviewed this product') {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
});

// Get product reviews
router.get('/:id/reviews', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { page = 1, limit = 10 } = req.query;
    
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name profilePicture')
      .select('reviews rating');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = product.reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(skip, skip + parseInt(limit));
    
    const totalReviews = product.reviews.length;
    const totalPages = Math.ceil(totalReviews / parseInt(limit));
    
    res.json({
      reviews,
      rating: product.rating,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

// Update stock quantity (Admin only)
router.patch('/:id/stock', authenticate, requireAdmin, [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('reserved').optional().isInt({ min: 0 }).withMessage('Reserved quantity must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { quantity, reserved } = req.body;
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.stock.quantity = quantity;
    if (reserved !== undefined) {
      product.stock.reserved = reserved;
    }
    
    await product.save();
    
    res.json({
      message: 'Stock updated successfully',
      stock: product.stock
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error while updating stock' });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20, category, series, minPrice, maxPrice } = req.query;
    
    const searchQuery = {
      $text: { $search: query },
      isActive: true
    };
    
    if (category) searchQuery.category = category;
    if (series) searchQuery.series = series;
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseFloat(maxPrice);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, totalProducts] = await Promise.all([
      Product.find(searchQuery, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'name')
        .lean(),
      Product.countDocuments(searchQuery)
    ]);
    
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    
    res.json({
      products,
      searchQuery: query,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProducts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ message: 'Server error while searching products' });
  }
});

module.exports = router;