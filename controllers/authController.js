const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.register = async (req, res) => {
  try {
    const { email, username, password, passwordConfirm } = req.body;

    if (!email || !username || !password || !passwordConfirm) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    let user = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (user) {
      return res.status(400).json({ success: false, message: 'Email or username already exists' });
    }

    user = await User.create({
      email,
      username,
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        vipStatus: user.isVIPActive(),
        vipExpiryDate: user.vipExpiryDate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, newPasswordConfirm } = req.body;

    if (!email || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
