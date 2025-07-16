// Application constants
const CONSTANTS = {
  // User types
  USER_TYPES: {
    INDIVIDUAL: 'individual',
    CORPORATE: 'corporate',
    INSTITUTION: 'institution',
    ADMIN: 'admin'
  },

  // Product categories
  PRODUCT_CATEGORIES: {
    CORPORATE: 'corporate',
    CUSTOM: 'custom',
    HOME: 'home',
    PERSONAL: 'personal',
    NEW: 'new',
    SPIRITUAL: 'spiritual'
  },

  // Product series
  PRODUCT_SERIES: {
    TAKSHAVERSE: 'TakshaVerse',
    MOMENTS_PLUS: 'Moments+',
    EPOCH_SERIES: 'Epoch Series',
    ARK_SERIES: 'Ark Series',
    SPIRITUAL_COLLECTION: 'Spiritual Collection'
  },

  // Order statuses
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    RETURNED: 'returned'
  },

  // Payment statuses
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  // Blog categories
  BLOG_CATEGORIES: {
    DESIGN: 'design',
    CULTURE: 'culture',
    CRAFTSMANSHIP: 'craftsmanship',
    SPIRITUALITY: 'spirituality',
    BUSINESS: 'business',
    LIFESTYLE: 'lifestyle',
    TUTORIAL: 'tutorial',
    NEWS: 'news'
  },

  // Blog statuses
  BLOG_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  },

  // Email types
  EMAIL_TYPES: {
    WELCOME: 'welcome',
    ORDER_CONFIRMATION: 'order_confirmation',
    ORDER_SHIPPED: 'order_shipped',
    ORDER_DELIVERED: 'order_delivered',
    PASSWORD_RESET: 'password_reset',
    VERIFICATION: 'verification'
  },

  // Rate limiting
  RATE_LIMITS: {
    GENERAL: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100
    },
    AUTH: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5
    },
    UPLOAD: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10
    }
  },

  // File upload
  UPLOAD_LIMITS: {
    FILE_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_FILES: 10
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },

  // JWT
  JWT: {
    EXPIRES_IN: '7d',
    REFRESH_EXPIRES_IN: '30d'
  },

  // Stock thresholds
  STOCK: {
    LOW_STOCK_THRESHOLD: 10,
    OUT_OF_STOCK: 0
  },

  // Currency
  CURRENCY: {
    INR: 'INR',
    USD: 'USD'
  },

  // Shipping
  SHIPPING: {
    FREE_SHIPPING_THRESHOLD: 999,
    STANDARD_SHIPPING_COST: 99,
    EXPRESS_SHIPPING_COST: 199
  },

  // Tax
  TAX: {
    GST_RATE: 0.18, // 18% GST
    CGST_RATE: 0.09, // 9% CGST
    SGST_RATE: 0.09  // 9% SGST
  },

  // Coupon types
  COUPON_TYPES: {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed'
  },

  // Notification types
  NOTIFICATION_TYPES: {
    ORDER_UPDATES: 'order_updates',
    PROMOTIONS: 'promotions',
    NEWSLETTER: 'newsletter',
    SMS: 'sms'
  },

  // Address types
  ADDRESS_TYPES: {
    HOME: 'home',
    OFFICE: 'office',
    OTHER: 'other'
  },

  // Review statuses
  REVIEW_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
  },

  // Comment statuses
  COMMENT_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    SPAM: 'spam'
  },

  // Language codes
  LANGUAGES: {
    ENGLISH: 'en',
    HINDI: 'hi'
  },

  // Indian states
  INDIAN_STATES: [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ],

  // Error messages
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    INVALID_TOKEN: 'Invalid token',
    TOKEN_EXPIRED: 'Token expired',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    PRODUCT_NOT_FOUND: 'Product not found',
    ORDER_NOT_FOUND: 'Order not found',
    CART_EMPTY: 'Cart is empty',
    INSUFFICIENT_STOCK: 'Insufficient stock',
    PAYMENT_FAILED: 'Payment failed',
    EMAIL_SEND_ERROR: 'Error sending email'
  },

  // Success messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTRATION_SUCCESS: 'Registration successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully',
    ORDER_PLACED: 'Order placed successfully',
    ORDER_CANCELLED: 'Order cancelled successfully',
    PAYMENT_SUCCESS: 'Payment successful',
    EMAIL_SENT: 'Email sent successfully'
  }
};

module.exports = CONSTANTS;