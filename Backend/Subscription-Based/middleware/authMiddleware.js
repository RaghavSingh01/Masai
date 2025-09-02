// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Blacklist = require('../models/blacklistModel');

// General authentication: check for a valid token
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Check if token is blacklisted
    const blacklisted = await Blacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: 'Token is invalid (blacklisted)' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based authorization: check if user is an admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

// Subscription-based authorization: check for premium or pro users
const premiumAccess = (req, res, next) => {
  if (req.user && (req.user.role === 'premium' || req.user.role === 'pro' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Premium or Pro subscription required' });
  }
};

module.exports = { protect, adminOnly, premiumAccess };