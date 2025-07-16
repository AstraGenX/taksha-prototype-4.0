const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  customization: {
    type: Map,
    of: String
  },
  sku: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  series: {
    type: String,
    required: true
  }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  },
  landmark: {
    type: String
  }
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  transactionId: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  gateway: {
    type: String,
    default: 'razorpay'
  },
  paidAt: {
    type: Date
  },
  failureReason: {
    type: String
  }
}, { _id: false });

const trackingSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  message: {
    type: String
  },
  location: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  payment: paymentSchema,
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  tracking: [trackingSchema],
  shipping: {
    method: {
      type: String,
      default: 'standard'
    },
    carrier: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    estimatedDelivery: {
      type: Date
    },
    actualDelivery: {
      type: Date
    },
    shippingCost: {
      type: Number,
      default: 0
    }
  },
  notes: {
    customer: {
      type: String
    },
    admin: {
      type: String
    },
    internal: {
      type: String
    }
  },
  couponCode: {
    type: String
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  refund: {
    status: {
      type: String,
      enum: ['none', 'requested', 'approved', 'processing', 'completed', 'rejected'],
      default: 'none'
    },
    amount: {
      type: Number,
      default: 0
    },
    reason: {
      type: String
    },
    requestedAt: {
      type: Date
    },
    processedAt: {
      type: Date
    },
    refundId: {
      type: String
    }
  },
  cancellation: {
    reason: {
      type: String
    },
    cancelledAt: {
      type: Date
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  source: {
    type: String,
    enum: ['website', 'mobile', 'admin', 'phone', 'email'],
    default: 'website'
  },
  deliveredAt: {
    type: Date
  },
  expectedDelivery: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'payment.razorpayOrderId': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = this.generateOrderNumber();
  }
  next();
});

// Method to generate order number
orderSchema.methods.generateOrderNumber = function() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TK${timestamp.slice(-8)}${random}`;
};

// Method to update tracking status
orderSchema.methods.updateStatus = function(status, message, location, updatedBy) {
  this.status = status;
  
  this.tracking.push({
    status,
    message,
    location,
    updatedBy,
    timestamp: new Date()
  });
  
  if (status === 'delivered') {
    this.deliveredAt = new Date();
  }
  
  return this.save();
};

// Method to calculate total amount
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = this.pricing.shipping || 0;
  const discount = this.pricing.discount || 0;
  
  this.pricing.subtotal = subtotal;
  this.pricing.tax = tax;
  this.pricing.total = subtotal + tax + shipping - discount;
  
  return this.pricing.total;
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy) {
  if (['delivered', 'cancelled', 'returned'].includes(this.status)) {
    throw new Error('Order cannot be cancelled');
  }
  
  this.status = 'cancelled';
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy
  };
  
  this.tracking.push({
    status: 'cancelled',
    message: `Order cancelled. Reason: ${reason}`,
    timestamp: new Date(),
    updatedBy: cancelledBy
  });
  
  return this.save();
};

// Method to process refund
orderSchema.methods.processRefund = function(amount, reason) {
  this.refund = {
    status: 'requested',
    amount,
    reason,
    requestedAt: new Date()
  };
  
  return this.save();
};

// Method to get current tracking status
orderSchema.methods.getCurrentTracking = function() {
  return this.tracking.length > 0 ? this.tracking[this.tracking.length - 1] : null;
};

// Static method to get orders by user
orderSchema.statics.getByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const query = { user: userId };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('items.product', 'name images')
    .populate('user', 'name email');
};

// Static method to get orders with filters
orderSchema.statics.getWithFilters = function(filters = {}, options = {}) {
  const { page = 1, limit = 20, sort = '-createdAt' } = options;
  
  return this.find(filters)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user', 'name email')
    .populate('items.product', 'name images');
};

// Static method to get sales analytics
orderSchema.statics.getSalesAnalytics = function(startDate, endDate) {
  const matchStage = {
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ['delivered', 'shipped', 'out_for_delivery'] }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        totalItems: { $sum: { $sum: '$items.quantity' } }
      }
    }
  ]);
};

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for is cancellable
orderSchema.virtual('isCancellable').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

// Virtual for is returnable
orderSchema.virtual('isReturnable').get(function() {
  return this.status === 'delivered' && this.orderAge <= 7; // 7 days return policy
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);