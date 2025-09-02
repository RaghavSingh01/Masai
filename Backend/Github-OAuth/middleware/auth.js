const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header (e.g., "Bearer <token>")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // If not in header, check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify the token using the secret from your .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user from the database using the ID from the token payload
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is valid, but user not found.'
      });
    }

    // Attach the user object to the request for use in other routes
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle cases like invalid or expired tokens
    res.status(401).json({
      status: 'error',
      message: 'Invalid token.'
    });
  }
};

module.exports = { authenticateToken };