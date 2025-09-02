// middleware/validation.middleware.js
const { body, validationResult } = require('express-validator');

// Middleware to handle validation errors from express-validator
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for user registration
const validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Validation rules for content creation
const validateContent = [
  body('title')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters')
    .trim(),
  
  body('body')
    .isLength({ min: 20 })
    .withMessage('Content body must be at least 20 characters long')
    .trim(),
  
  body('category')
    .isIn(['free', 'premium'])
    .withMessage('Category must be either "free" or "premium"'),
  
  handleValidationErrors
];

// Validation rules for subscriptions
const validateSubscription = [
  body('plan')
    .isIn(['premium', 'pro'])
    .withMessage('Plan must be either "premium" or "pro"'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateContent,
  validateSubscription
};