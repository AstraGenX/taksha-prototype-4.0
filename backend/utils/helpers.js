const crypto = require('crypto');
const CONSTANTS = require('./constants');

/**
 * Generate a unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TKS${timestamp.slice(-8)}${random}`;
};

/**
 * Generate a unique tracking number
 */
const generateTrackingNumber = () => {
  const random = Math.random().toString(36).substring(2, 12).toUpperCase();
  return `TKS${random}`;
};

/**
 * Generate a random string of specified length
 */
const generateRandomString = (length = 8) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate a secure random token
 */
const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Calculate discounted price
 */
const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  return originalPrice - (originalPrice * discountPercentage / 100);
};

/**
 * Calculate tax amount
 */
const calculateTax = (amount, taxRate = CONSTANTS.TAX.GST_RATE) => {
  return amount * taxRate;
};

/**
 * Calculate shipping cost
 */
const calculateShippingCost = (subtotal, shippingType = 'standard') => {
  if (subtotal >= CONSTANTS.SHIPPING.FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  
  return shippingType === 'express' 
    ? CONSTANTS.SHIPPING.EXPRESS_SHIPPING_COST 
    : CONSTANTS.SHIPPING.STANDARD_SHIPPING_COST;
};

/**
 * Calculate order total
 */
const calculateOrderTotal = (subtotal, tax, shipping, discount = 0) => {
  return subtotal + tax + shipping - discount;
};

/**
 * Format currency
 */
const formatCurrency = (amount, currency = CONSTANTS.CURRENCY.INR) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return formatter.format(amount);
};

/**
 * Format date
 */
const formatDate = (date, locale = 'en-IN') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date with time
 */
const formatDateTime = (date, locale = 'en-IN') => {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Generate slug from string
 */
const generateSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+91|91)?[6-9][0-9]{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

/**
 * Validate pincode (Indian format)
 */
const isValidPincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

/**
 * Sanitize string for database
 */
const sanitizeString = (str) => {
  return str.replace(/[<>]/g, '');
};

/**
 * Truncate string
 */
const truncateString = (str, length = 100) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Generate pagination info
 */
const generatePaginationInfo = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: parseInt(page),
    totalPages,
    totalItems: total,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

/**
 * Calculate estimated delivery date
 */
const calculateEstimatedDelivery = (orderDate, shippingType = 'standard') => {
  const days = shippingType === 'express' ? 3 : 7;
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + days);
  return deliveryDate;
};

/**
 * Check if order can be cancelled
 */
const canCancelOrder = (orderStatus) => {
  const cancellableStatuses = [
    CONSTANTS.ORDER_STATUS.PENDING,
    CONSTANTS.ORDER_STATUS.CONFIRMED
  ];
  return cancellableStatuses.includes(orderStatus);
};

/**
 * Check if order can be returned
 */
const canReturnOrder = (orderStatus, deliveryDate) => {
  if (orderStatus !== CONSTANTS.ORDER_STATUS.DELIVERED) {
    return false;
  }
  
  const daysSinceDelivery = (Date.now() - new Date(deliveryDate)) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= 7; // 7 days return policy
};

/**
 * Generate OTP
 */
const generateOTP = (length = 6) => {
  return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
};

/**
 * Mask sensitive data
 */
const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2 
    ? username.substring(0, 2) + '*'.repeat(username.length - 2)
    : username;
  return `${maskedUsername}@${domain}`;
};

/**
 * Mask phone number
 */
const maskPhoneNumber = (phone) => {
  return phone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');
};

/**
 * Check if value is empty
 */
const isEmpty = (value) => {
  return value === null || value === undefined || value === '' || 
         (Array.isArray(value) && value.length === 0) ||
         (typeof value === 'object' && Object.keys(value).length === 0);
};

/**
 * Deep clone object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove undefined values from object
 */
const removeUndefined = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
};

/**
 * Generate random color
 */
const generateRandomColor = () => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#3742FA', '#2F3542', '#F8B500', '#EE5A52', '#0ABDE3'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Convert string to title case
 */
const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Get time ago string
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Validate and parse sort parameter
 */
const parseSortParam = (sortParam, allowedFields = []) => {
  if (!sortParam) return {};
  
  const sortObj = {};
  const sortParts = sortParam.split(',');
  
  sortParts.forEach(part => {
    const field = part.startsWith('-') ? part.substring(1) : part;
    const direction = part.startsWith('-') ? -1 : 1;
    
    if (allowedFields.length === 0 || allowedFields.includes(field)) {
      sortObj[field] = direction;
    }
  });
  
  return sortObj;
};

/**
 * Generate cache key
 */
const generateCacheKey = (prefix, ...args) => {
  return `${prefix}:${args.join(':')}`;
};

module.exports = {
  generateOrderNumber,
  generateTrackingNumber,
  generateRandomString,
  generateSecureToken,
  calculateDiscountedPrice,
  calculateTax,
  calculateShippingCost,
  calculateOrderTotal,
  formatCurrency,
  formatDate,
  formatDateTime,
  generateSlug,
  isValidEmail,
  isValidPhoneNumber,
  isValidPincode,
  sanitizeString,
  truncateString,
  generatePaginationInfo,
  calculateEstimatedDelivery,
  canCancelOrder,
  canReturnOrder,
  generateOTP,
  maskEmail,
  maskPhoneNumber,
  isEmpty,
  deepClone,
  removeUndefined,
  generateRandomColor,
  toTitleCase,
  getTimeAgo,
  parseSortParam,
  generateCacheKey
};