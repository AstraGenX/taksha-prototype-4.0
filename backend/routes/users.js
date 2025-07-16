const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('userType').optional().isIn(['individual', 'corporate', 'institution']).withMessage('Invalid user type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { name, phone, userType } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (userType) user.userType = userType;
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Update user preferences
router.put('/preferences', authenticate, [
  body('notifications').optional().isObject().withMessage('Notifications must be an object'),
  body('language').optional().isIn(['en', 'hi']).withMessage('Invalid language'),
  body('currency').optional().isIn(['INR', 'USD']).withMessage('Invalid currency')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { notifications, language, currency } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (notifications) {
      user.preferences.notifications = { ...user.preferences.notifications, ...notifications };
    }
    if (language) user.preferences.language = language;
    if (currency) user.preferences.currency = currency;
    
    await user.save();
    
    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error while updating preferences' });
  }
});

// Get user addresses
router.get('/addresses', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ addresses: user.addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error while fetching addresses' });
  }
});

// Add new address
router.post('/addresses', authenticate, [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('addressLine1').trim().isLength({ min: 5, max: 100 }).withMessage('Address line 1 must be between 5 and 100 characters'),
  body('addressLine2').optional().trim().isLength({ max: 100 }).withMessage('Address line 2 must not exceed 100 characters'),
  body('city').trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('state').trim().isLength({ min: 2, max: 50 }).withMessage('State must be between 2 and 50 characters'),
  body('pincode').trim().isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits'),
  body('country').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
  body('type').optional().isIn(['home', 'office', 'other']).withMessage('Invalid address type'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const addressData = {
      id: uuidv4(),
      ...req.body,
      country: req.body.country || 'India'
    };
    
    const user = await User.findById(req.user._id);
    await user.addAddress(addressData);
    
    res.status(201).json({
      message: 'Address added successfully',
      address: addressData
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error while adding address' });
  }
});

// Update address
router.put('/addresses/:addressId', authenticate, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('addressLine1').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Address line 1 must be between 5 and 100 characters'),
  body('addressLine2').optional().trim().isLength({ max: 100 }).withMessage('Address line 2 must not exceed 100 characters'),
  body('city').optional().trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('state').optional().trim().isLength({ min: 2, max: 50 }).withMessage('State must be between 2 and 50 characters'),
  body('pincode').optional().trim().isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits'),
  body('country').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
  body('type').optional().isIn(['home', 'office', 'other']).withMessage('Invalid address type'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    const address = user.addresses.find(addr => addr.id === addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    const updatedAddressData = {
      ...address.toObject(),
      ...req.body,
      id: addressId
    };
    
    await user.addAddress(updatedAddressData);
    
    res.json({
      message: 'Address updated successfully',
      address: updatedAddressData
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error while updating address' });
  }
});

// Delete address
router.delete('/addresses/:addressId', authenticate, async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    const address = user.addresses.find(addr => addr.id === addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    await user.removeAddress(addressId);
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error while deleting address' });
  }
});

// Set default address
router.put('/addresses/:addressId/default', authenticate, async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);
    
    const address = user.addresses.find(addr => addr.id === addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // Set all addresses as non-default
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
    
    // Set selected address as default
    address.isDefault = true;
    
    await user.save();
    
    res.json({
      message: 'Default address updated successfully',
      address
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ message: 'Server error while setting default address' });
  }
});

// Admin routes

// Get all users (Admin only)
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, userType, isActive } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (userType) query.userType = userType;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    
    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// Get user by ID (Admin only)
router.get('/admin/:userId', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
});

// Update user status (Admin only)
router.put('/admin/:userId/status', authenticate, requireAdmin, [
  body('isActive').isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isActive = isActive;
    await user.save();
    
    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
});

// Update user type (Admin only)
router.put('/admin/:userId/type', authenticate, requireAdmin, [
  body('userType').isIn(['individual', 'corporate', 'institution', 'admin']).withMessage('Invalid user type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }
    
    const { userType } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.userType = userType;
    await user.save();
    
    res.json({
      message: 'User type updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update user type error:', error);
    res.status(500).json({ message: 'Server error while updating user type' });
  }
});

// Get user statistics (Admin only)
router.get('/admin/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      usersByType,
      recentUsers,
      usersByProvider
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        { $group: { _id: '$userType', count: { $sum: 1 } } }
      ]),
      User.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email userType createdAt'),
      User.aggregate([
        { $group: { _id: '$provider', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByType,
      recentUsers,
      usersByProvider
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error while fetching user statistics' });
  }
});

module.exports = router;