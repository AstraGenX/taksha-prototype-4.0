const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      userType: user.userType 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid. User not found.' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    res.status(500).json({ message: 'Token verification failed.' });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // If token is invalid, just set user to null and continue
    req.user = null;
    next();
  }
};

// Admin authorization middleware
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Access denied. Please login first.' });
  }
  
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  
  next();
};

// Check if user is admin or owner of resource
const isAdminOrOwner = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. Please login first.' });
    }
    
    const userId = resourceUserId || req.params.userId || req.body.userId;
    
    if (req.user.userType === 'admin' || req.user._id.toString() === userId.toString()) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
  };
};

// Middleware to check user type
const requireUserType = (userTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. Please login first.' });
    }
    
    const allowedTypes = Array.isArray(userTypes) ? userTypes : [userTypes];
    
    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ 
        message: `Access denied. Required user type: ${allowedTypes.join(' or ')}` 
      });
    }
    
    next();
  };
};

// Rate limiting for authentication routes
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validate user ownership of resource
const validateOwnership = (model, resourceParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceParam];
      const resource = await model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }
      
      // Check if user is admin or owner
      if (req.user.userType === 'admin' || resource.user.toString() === req.user._id.toString()) {
        req.resource = resource;
        next();
      } else {
        res.status(403).json({ message: 'Access denied. You can only access your own resources.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error validating resource ownership' });
    }
  };
};

// Middleware to refresh user data
const refreshUserData = async (req, res, next) => {
  try {
    if (req.user) {
      const updatedUser = await User.findById(req.user._id).select('-password');
      if (updatedUser) {
        req.user = updatedUser;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  generateToken,
  authenticate,
  optionalAuth,
  requireAdmin,
  isAdminOrOwner,
  requireUserType,
  authRateLimit,
  validateOwnership,
  refreshUserData
};