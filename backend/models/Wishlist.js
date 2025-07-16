const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
wishlistSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Method to add item to wishlist
wishlistSchema.methods.addItem = function(productId) {
  const existingItem = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    return this; // Item already exists
  }
  
  this.items.push({
    product: productId,
    addedAt: new Date()
  });
  
  return this.save();
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Method to check if item exists in wishlist
wishlistSchema.methods.hasItem = function(productId) {
  return this.items.some(item => 
    item.product.toString() === productId.toString()
  );
};

// Method to clear wishlist
wishlistSchema.methods.clearWishlist = function() {
  this.items = [];
  return this.save();
};

// Method to get item count
wishlistSchema.methods.getItemCount = function() {
  return this.items.length;
};

// Method to move item to cart
wishlistSchema.methods.moveToCart = function(productId, cartInstance) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (!item) {
    throw new Error('Item not found in wishlist');
  }
  
  // Remove from wishlist
  this.removeItem(productId);
  
  // Add to cart (you'll need to implement this based on your cart model)
  // This is a placeholder - you'll need to implement the actual cart addition logic
  return Promise.resolve();
};

// Static method to get or create wishlist for user
wishlistSchema.statics.getOrCreateWishlist = async function(userId) {
  let wishlist = await this.findOne({ user: userId }).populate('items.product');
  
  if (!wishlist) {
    wishlist = new this({ user: userId, items: [] });
    await wishlist.save();
  }
  
  return wishlist;
};

// Static method to get wishlist with populated products
wishlistSchema.statics.getWithProducts = function(userId) {
  return this.findOne({ user: userId })
    .populate({
      path: 'items.product',
      match: { isActive: true },
      select: 'name price originalPrice images category series isNew isLimited rating'
    });
};

// Virtual for item count
wishlistSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

// Virtual for recently added items (last 7 days)
wishlistSchema.virtual('recentItems').get(function() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return this.items.filter(item => item.addedAt >= sevenDaysAgo);
});

// Method to get items by category
wishlistSchema.methods.getItemsByCategory = function(category) {
  return this.items.filter(item => 
    item.product && item.product.category === category
  );
};

// Method to get items by series
wishlistSchema.methods.getItemsBySeries = function(series) {
  return this.items.filter(item => 
    item.product && item.product.series === series
  );
};

// Method to get items in price range
wishlistSchema.methods.getItemsInPriceRange = function(minPrice, maxPrice) {
  return this.items.filter(item => 
    item.product && 
    item.product.price >= minPrice && 
    item.product.price <= maxPrice
  );
};

// Method to get sorted items
wishlistSchema.methods.getSortedItems = function(sortBy = 'newest') {
  const sortedItems = [...this.items];
  
  switch (sortBy) {
    case 'newest':
      return sortedItems.sort((a, b) => b.addedAt - a.addedAt);
    case 'oldest':
      return sortedItems.sort((a, b) => a.addedAt - b.addedAt);
    case 'price_low':
      return sortedItems.sort((a, b) => a.product.price - b.product.price);
    case 'price_high':
      return sortedItems.sort((a, b) => b.product.price - a.product.price);
    case 'name':
      return sortedItems.sort((a, b) => a.product.name.localeCompare(b.product.name));
    default:
      return sortedItems;
  }
};

// Ensure virtual fields are serialized
wishlistSchema.set('toJSON', { virtuals: true });
wishlistSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);