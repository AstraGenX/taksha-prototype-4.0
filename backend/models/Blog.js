const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['design', 'culture', 'craftsmanship', 'spirituality', 'business', 'lifestyle', 'tutorial', 'news']
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    type: String,
    required: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String
    },
    caption: {
      type: String
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  readingTime: {
    type: Number, // in minutes
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  seo: {
    title: {
      type: String
    },
    description: {
      type: String
    },
    keywords: [{
      type: String
    }],
    slug: {
      type: String,
      unique: true
    }
  },
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  publishedAt: {
    type: Date
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
blogSchema.index({ status: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ 'seo.slug': 1 });
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Pre-save middleware to generate slug and calculate reading time
blogSchema.pre('save', function(next) {
  // Generate slug if not provided
  if (!this.seo.slug) {
    this.seo.slug = this.generateSlug();
  }
  
  // Calculate reading time
  this.readingTime = this.calculateReadingTime();
  
  // Set published date when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Update lastModified
  this.lastModified = new Date();
  
  next();
});

// Method to generate slug
blogSchema.methods.generateSlug = function() {
  return this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Method to calculate reading time
blogSchema.methods.calculateReadingTime = function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Method to increment view count
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to like/unlike post
blogSchema.methods.toggleLike = function(userId) {
  const likedIndex = this.likedBy.indexOf(userId);
  
  if (likedIndex === -1) {
    // Like the post
    this.likedBy.push(userId);
    this.likes += 1;
  } else {
    // Unlike the post
    this.likedBy.splice(likedIndex, 1);
    this.likes -= 1;
  }
  
  return this.save();
};

// Method to add comment
blogSchema.methods.addComment = function(userId, name, email, comment) {
  this.comments.push({
    user: userId,
    name,
    email,
    comment,
    createdAt: new Date()
  });
  
  return this.save();
};

// Method to approve comment
blogSchema.methods.approveComment = function(commentId) {
  const comment = this.comments.id(commentId);
  if (comment) {
    comment.isApproved = true;
    return this.save();
  }
  throw new Error('Comment not found');
};

// Method to remove comment
blogSchema.methods.removeComment = function(commentId) {
  this.comments = this.comments.filter(comment => comment._id.toString() !== commentId);
  return this.save();
};

// Static method to get published posts
blogSchema.statics.getPublished = function(options = {}) {
  const { page = 1, limit = 10, category, tags, sort = '-publishedAt' } = options;
  const query = { status: 'published' };
  
  if (category) {
    query.category = category;
  }
  
  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }
  
  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'name profilePicture')
    .populate('relatedProducts', 'name price images');
};

// Static method to get featured posts
blogSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ 
    status: 'published', 
    isFeatured: true 
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .populate('author', 'name profilePicture');
};

// Static method to get related posts
blogSchema.statics.getRelated = function(postId, category, tags, limit = 3) {
  const query = {
    _id: { $ne: postId },
    status: 'published',
    $or: [
      { category: category },
      { tags: { $in: tags } }
    ]
  };
  
  return this.find(query)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .populate('author', 'name profilePicture');
};

// Static method to get popular posts
blogSchema.statics.getPopular = function(limit = 10, timeframe = 30) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - timeframe);
  
  return this.find({
    status: 'published',
    publishedAt: { $gte: dateThreshold }
  })
  .sort({ views: -1, likes: -1 })
  .limit(limit)
  .populate('author', 'name profilePicture');
};

// Static method to search posts
blogSchema.statics.search = function(query, options = {}) {
  const { page = 1, limit = 10, category, tags } = options;
  
  const searchQuery = {
    $text: { $search: query },
    status: 'published'
  };
  
  if (category) {
    searchQuery.category = category;
  }
  
  if (tags && tags.length > 0) {
    searchQuery.tags = { $in: tags };
  }
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'name profilePicture');
};

// Virtual for comment count
blogSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for approved comment count
blogSchema.virtual('approvedCommentCount').get(function() {
  return this.comments.filter(comment => comment.isApproved).length;
});

// Virtual for is liked by user
blogSchema.virtual('isLikedByUser').get(function() {
  return function(userId) {
    return this.likedBy.includes(userId);
  };
});

// Virtual for reading time text
blogSchema.virtual('readingTimeText').get(function() {
  return `${this.readingTime} min read`;
});

// Virtual for published date formatted
blogSchema.virtual('publishedDateFormatted').get(function() {
  return this.publishedAt ? this.publishedAt.toLocaleDateString() : null;
});

// Ensure virtual fields are serialized
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);