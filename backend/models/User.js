const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
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
  type: {
    type: String,
    enum: ['home', 'office', 'other'],
    default: 'home'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'email';
    }
  },
  userType: {
    type: String,
    enum: ['individual', 'corporate', 'institution', 'admin'],
    default: 'individual'
  },
  phone: {
    type: String,
    sparse: true
  },
  profilePicture: {
    type: String
  },
  provider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  },
  googleId: {
    type: String,
    sparse: true
  },
  addresses: [addressSchema],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'INR'
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ userType: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get user's default address
userSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(addr => addr.isDefault);
};

// Add or update address
userSchema.methods.addAddress = function(addressData) {
  const existingAddressIndex = this.addresses.findIndex(addr => addr.id === addressData.id);
  
  if (existingAddressIndex !== -1) {
    // Update existing address
    this.addresses[existingAddressIndex] = { ...this.addresses[existingAddressIndex], ...addressData };
  } else {
    // Add new address
    this.addresses.push(addressData);
  }
  
  // If this is set as default, remove default from others
  if (addressData.isDefault) {
    this.addresses.forEach(addr => {
      if (addr.id !== addressData.id) {
        addr.isDefault = false;
      }
    });
  }
  
  return this.save();
};

// Remove address
userSchema.methods.removeAddress = function(addressId) {
  this.addresses = this.addresses.filter(addr => addr.id !== addressId);
  return this.save();
};

// Transform user object for response (remove sensitive data)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  return user;
};

module.exports = mongoose.model('User', userSchema);