// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Blacklist = require('../models/blacklistModel');

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
  });
  
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
  
  return { accessToken, refreshToken };
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password, // Will be hashed by pre-save middleware
      role: 'user',
      subscription: {
        plan: 'free',
        expiryDate: null
      }
    });

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user & blacklist tokens
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    
    // Add token to blacklist
    await Blacklist.create({ token });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Check if refresh token is blacklisted
    const blacklisted = await Blacklist.findOne({ token: refreshToken });
    if (blacklisted) {
      return res.status(401).json({ message: 'Refresh token is invalid' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m'
    });

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken
};