const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'taksha-api' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Write error logs to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 3,
      tailable: true
    }),
    
    // Write warning logs to warning.log
    new winston.transports.File({
      filename: path.join(logDir, 'warning.log'),
      level: 'warn',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
      tailable: true
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 3
    })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 3
    })
  ]
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Helper functions for structured logging
const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous'
    };
    
    if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });
  
  next();
};

const logError = (error, req = null, additionalData = {}) => {
  const logData = {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    ...additionalData
  };
  
  if (req) {
    logData.request = {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
      userId: req.user?.id || 'anonymous',
      ip: req.ip
    };
  }
  
  logger.error('Application Error', logData);
};

const logAuth = (action, userId, email, ip, additionalData = {}) => {
  logger.info('Authentication', {
    action,
    userId,
    email,
    ip,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

const logPayment = (action, orderId, userId, amount, status, additionalData = {}) => {
  logger.info('Payment', {
    action,
    orderId,
    userId,
    amount,
    status,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

const logOrder = (action, orderId, userId, status, additionalData = {}) => {
  logger.info('Order', {
    action,
    orderId,
    userId,
    status,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

const logProduct = (action, productId, userId, additionalData = {}) => {
  logger.info('Product', {
    action,
    productId,
    userId,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

const logEmail = (action, to, type, status, additionalData = {}) => {
  logger.info('Email', {
    action,
    to,
    type,
    status,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

const logDatabase = (action, collection, query, userId, additionalData = {}) => {
  logger.debug('Database', {
    action,
    collection,
    query,
    userId,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

const logSecurity = (event, userId, ip, additionalData = {}) => {
  logger.warn('Security', {
    event,
    userId,
    ip,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

const logPerformance = (operation, duration, additionalData = {}) => {
  logger.info('Performance', {
    operation,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

// Export logger and helper functions
module.exports = {
  logger,
  logRequest,
  logError,
  logAuth,
  logPayment,
  logOrder,
  logProduct,
  logEmail,
  logDatabase,
  logSecurity,
  logPerformance
};