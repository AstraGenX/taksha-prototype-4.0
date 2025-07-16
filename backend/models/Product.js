const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['corporate', 'custom', 'home', 'personal', 'new', 'spiritual']
  },
  series: {
    type: String,
    required: true,
    enum: ['TakshaVerse', 'Moments+', 'Epoch Series', 'Ark Series', 'Spiritual Collection']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String
    },
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  gallery: [{
    type: String
  }],
  features: [{
    type: String
  }],
  specifications: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
    unit: {
      type: String,
      default: 'cm'
    }
  },
  materials: [{
    type: String
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    hex: {
      type: String
    },
    image: {
      type: String
    }
  }],
  stock: {
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    reserved: {
      type: Number,
      default: 0
    },
    threshold: {
      type: Number,
      default: 5
    }
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isNew: {
    type: Boolean,
    default: false
  },
  isLimited: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reviews: [reviewSchema],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },
  customization: {
    available: {
      type: Boolean,
      default: false
    },
    options: [{
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['text', 'image', 'color', 'size'],
        required: true
      },
      required: {
        type: Boolean,
        default: false
      },
      options: [{
        label: String,
        value: String,
        price: Number
      }]
    }]
  },
  shipping: {
    weight: {
      type: Number,
      default: 0
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    processingTime: {
      type: Number,
      default: 2
    },
    deliveryTime: {
      min: {
        type: Number,
        default: 5
      },
      max: {
        type: Number,
        default: 7
      }
    }
  },
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ series: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNew: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'seo.slug': 1 });
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  const mainImage = this.images.find(img => img.isMain);
  return mainImage ? mainImage.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
  if (this.stock.quantity === 0) return 'out_of_stock';
  if (this.stock.quantity <= this.stock.threshold) return 'low_stock';
  return 'in_stock';
});

// Virtual for available stock (total - reserved)
productSchema.virtual('availableStock').get(function() {
  return Math.max(0, this.stock.quantity - this.stock.reserved);
});

// Pre-save middleware to generate SKU and slug
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = this.generateSKU();
  }
  
  if (!this.seo.slug) {
    this.seo.slug = this.generateSlug();
  }
  
  next();
});

// Method to generate SKU
productSchema.methods.generateSKU = function() {
  const categoryCode = this.category.substring(0, 3).toUpperCase();
  const seriesCode = this.series.replace(/\s/g, '').substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `${categoryCode}${seriesCode}${timestamp}`;
};

// Method to generate slug
productSchema.methods.generateSlug = function() {
  return this.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Method to update rating
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = Number((totalRating / this.reviews.length).toFixed(1));
  this.rating.count = this.reviews.length;
};

// Method to add review
productSchema.methods.addReview = function(userId, name, rating, comment) {
  // Check if user already reviewed
  const existingReview = this.reviews.find(review => review.user.toString() === userId.toString());
  if (existingReview) {
    throw new Error('User has already reviewed this product');
  }
  
  this.reviews.push({
    user: userId,
    name,
    rating,
    comment
  });
  
  this.updateRating();
  return this.save();
};

// Method to reserve stock
productSchema.methods.reserveStock = function(quantity) {
  if (this.availableStock < quantity) {
    throw new Error('Insufficient stock available');
  }
  
  this.stock.reserved += quantity;
  return this.save();
};

// Method to release reserved stock
productSchema.methods.releaseStock = function(quantity) {
  this.stock.reserved = Math.max(0, this.stock.reserved - quantity);
  return this.save();
};

// Method to reduce stock after purchase
productSchema.methods.reduceStock = function(quantity) {
  if (this.stock.quantity < quantity) {
    throw new Error('Insufficient stock');
  }
  
  this.stock.quantity -= quantity;
  this.stock.reserved = Math.max(0, this.stock.reserved - quantity);
  this.salesCount += quantity;
  return this.save();
};

// Method to increment view count
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment wishlist count
productSchema.methods.incrementWishlistCount = function() {
  this.wishlistCount += 1;
  return this.save();
};

// Method to decrement wishlist count
productSchema.methods.decrementWishlistCount = function() {
  this.wishlistCount = Math.max(0, this.wishlistCount - 1);
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get new products
productSchema.statics.getNewProducts = function(limit = 10) {
  return this.find({ isNew: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, options = {}) {
  const query = { category, isActive: true };
  const { page = 1, limit = 20, sort = '-createdAt' } = options;
  
  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
};

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);