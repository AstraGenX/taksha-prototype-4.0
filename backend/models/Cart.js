const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  customization: {
    type: Map,
    of: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  couponCode: {
    type: String
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastUpdated on save
cartSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, price, customization = {}) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );
  
  if (existingItemIndex !== -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = price;
    this.items[existingItemIndex].customization = customization;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      price,
      customization
    });
  }
  
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => item.product.toString() === productId.toString());
  
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  if (quantity <= 0) {
    return this.removeItem(productId);
  }
  
  item.quantity = quantity;
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.couponCode = null;
  this.couponDiscount = 0;
  return this.save();
};

// Method to get cart total
cartSchema.methods.getTotal = function() {
  const subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  return subtotal - this.couponDiscount;
};

// Method to get item count
cartSchema.methods.getItemCount = function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
};

// Method to apply coupon
cartSchema.methods.applyCoupon = function(couponCode, discount) {
  this.couponCode = couponCode;
  this.couponDiscount = discount;
  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.couponCode = null;
  this.couponDiscount = 0;
  return this.save();
};

// Static method to get or create cart for user
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId }).populate('items.product');
  
  if (!cart) {
    cart = new this({ user: userId, items: [] });
    await cart.save();
  }
  
  return cart;
};

// Static method to merge carts (for when user logs in)
cartSchema.statics.mergeCarts = async function(userId, tempCartItems) {
  let cart = await this.getOrCreateCart(userId);
  
  for (const tempItem of tempCartItems) {
    await cart.addItem(tempItem.product, tempItem.quantity, tempItem.price, tempItem.customization);
  }
  
  return cart;
};

// Virtual for subtotal
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Virtual for total items
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Virtual for total after discount
cartSchema.virtual('total').get(function() {
  return this.subtotal - this.couponDiscount;
});

// Ensure virtual fields are serialized
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);