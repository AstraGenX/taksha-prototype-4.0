const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Blog = require('../models/Blog');
const { authenticate, optionalAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all published blog posts
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['design', 'culture', 'craftsmanship', 'spirituality', 'business', 'lifestyle', 'tutorial', 'news']).withMessage('Invalid category'),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'title']).withMessage('Invalid sort option')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { page = 1, limit = 10, category, tags, sort = 'newest' } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      tags: tags ? tags.split(',') : undefined,
      sort: sort === 'newest' ? '-publishedAt' : sort === 'oldest' ? 'publishedAt' : sort === 'popular' ? '-views -likes' : 'title'
    };
    
    const posts = await Blog.getPublished(options);
    
    const totalPosts = await Blog.countDocuments({ 
      status: 'published',
      ...(category && { category }),
      ...(tags && { tags: { $in: tags.split(',') } })
    });
    
    const totalPages = Math.ceil(totalPosts / parseInt(limit));
    
    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ message: 'Server error while fetching blog posts' });
  }
});

// Get featured blog posts
router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const posts = await Blog.getFeatured(parseInt(limit));
    
    res.json({ posts });
  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({ message: 'Server error while fetching featured posts' });
  }
});

// Get popular blog posts
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10, timeframe = 30 } = req.query;
    
    const posts = await Blog.getPopular(parseInt(limit), parseInt(timeframe));
    
    res.json({ posts });
  } catch (error) {
    console.error('Get popular posts error:', error);
    res.status(500).json({ message: 'Server error while fetching popular posts' });
  }
});

// Search blog posts
router.get('/search', [
  query('q').trim().isLength({ min: 1 }).withMessage('Search query is required'),
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
    
    const { q, page = 1, limit = 10, category, tags } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      category,
      tags: tags ? tags.split(',') : undefined
    };
    
    const posts = await Blog.search(q, options);
    
    res.json({
      posts,
      searchQuery: q,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search blog posts error:', error);
    res.status(500).json({ message: 'Server error while searching blog posts' });
  }
});

// Get single blog post by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id)
      .populate('author', 'name profilePicture')
      .populate('relatedProducts', 'name price images category series')
      .populate('comments.user', 'name profilePicture');
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    if (post.status !== 'published' && (!req.user || req.user.userType !== 'admin')) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Increment view count
    await post.incrementViews();
    
    // Get related posts
    const relatedPosts = await Blog.getRelated(post._id, post.category, post.tags, 3);
    
    res.json({ 
      post,
      relatedPosts
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ message: 'Server error while fetching blog post' });
  }
});

// Get blog post by slug
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const post = await Blog.findOne({ 'seo.slug': req.params.slug })
      .populate('author', 'name profilePicture')
      .populate('relatedProducts', 'name price images category series')
      .populate('comments.user', 'name profilePicture');
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    if (post.status !== 'published' && (!req.user || req.user.userType !== 'admin')) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Increment view count
    await post.incrementViews();
    
    // Get related posts
    const relatedPosts = await Blog.getRelated(post._id, post.category, post.tags, 3);
    
    res.json({ 
      post,
      relatedPosts
    });
  } catch (error) {
    console.error('Get blog post by slug error:', error);
    res.status(500).json({ message: 'Server error while fetching blog post' });
  }
});

// Like/Unlike blog post
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    if (post.status !== 'published') {
      return res.status(400).json({ message: 'Cannot like unpublished post' });
    }
    
    const wasLiked = post.likedBy.includes(req.user._id);
    await post.toggleLike(req.user._id);
    
    res.json({
      message: wasLiked ? 'Post unliked' : 'Post liked',
      isLiked: !wasLiked,
      likes: post.likes
    });
  } catch (error) {
    console.error('Like blog post error:', error);
    res.status(500).json({ message: 'Server error while liking blog post' });
  }
});

// Add comment to blog post
router.post('/:id/comments', authenticate, [
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
    
    const { comment } = req.body;
    
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    if (post.status !== 'published') {
      return res.status(400).json({ message: 'Cannot comment on unpublished post' });
    }
    
    await post.addComment(req.user._id, req.user.name, req.user.email, comment);
    
    // Populate the post with updated comments
    await post.populate('comments.user', 'name profilePicture');
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment: post.comments[post.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

// Admin routes

// Create new blog post (Admin only)
router.post('/', authenticate, requireAdmin, [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('excerpt').trim().isLength({ min: 10, max: 300 }).withMessage('Excerpt must be between 10 and 300 characters'),
  body('category').isIn(['design', 'culture', 'craftsmanship', 'spirituality', 'business', 'lifestyle', 'tutorial', 'news']).withMessage('Invalid category'),
  body('featuredImage').isURL().withMessage('Featured image must be a valid URL'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const postData = {
      ...req.body,
      author: req.user._id
    };
    
    const post = new Blog(postData);
    await post.save();
    
    await post.populate('author', 'name profilePicture');
    
    res.status(201).json({
      message: 'Blog post created successfully',
      post
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Blog post with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error while creating blog post' });
  }
});

// Update blog post (Admin only)
router.put('/:id', authenticate, requireAdmin, [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('content').optional().trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('excerpt').optional().trim().isLength({ min: 10, max: 300 }).withMessage('Excerpt must be between 10 and 300 characters'),
  body('category').optional().isIn(['design', 'culture', 'craftsmanship', 'spirituality', 'business', 'lifestyle', 'tutorial', 'news']).withMessage('Invalid category'),
  body('featuredImage').optional().isURL().withMessage('Featured image must be a valid URL'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'author') {
        post[key] = req.body[key];
      }
    });
    
    await post.save();
    await post.populate('author', 'name profilePicture');
    
    res.json({
      message: 'Blog post updated successfully',
      post
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Blog post with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error while updating blog post' });
  }
});

// Delete blog post (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ message: 'Server error while deleting blog post' });
  }
});

// Get all blog posts for admin
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    const posts = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'name profilePicture');
    
    const totalPosts = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);
    
    res.json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all blog posts error:', error);
    res.status(500).json({ message: 'Server error while fetching blog posts' });
  }
});

// Approve comment (Admin only)
router.put('/:id/comments/:commentId/approve', authenticate, requireAdmin, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    await post.approveComment(req.params.commentId);
    
    res.json({ message: 'Comment approved successfully' });
  } catch (error) {
    console.error('Approve comment error:', error);
    if (error.message === 'Comment not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while approving comment' });
  }
});

// Delete comment (Admin only)
router.delete('/:id/comments/:commentId', authenticate, requireAdmin, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    await post.removeComment(req.params.commentId);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error while deleting comment' });
  }
});

module.exports = router;