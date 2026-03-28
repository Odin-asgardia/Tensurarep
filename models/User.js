const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please provide a valid email']
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  vipStatus: {
    type: Boolean,
    default: false
  },
  vipExpiryDate: {
    type: Date,
    default: null
  },
  vipPurchaseHistory: [
    { purchaseDate: Date, expiryDate: Date, amount: Number, paymentId: String, paymentMethod: String }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

userSchema.methods.isVIPActive = function() {
  if (!this.vipStatus) return false;
  if (this.vipExpiryDate && this.vipExpiryDate < new Date()) {
    this.vipStatus = false;
    this.save();
    return false;
  }
  return true;
};

module.exports = mongoose.model('User', userSchema);