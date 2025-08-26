const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}: ${id}. Please provide a valid MongoDB ObjectId.`
      });
    }
    
    next();
  };
};

const validateRequestBody = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    next();
  };
};

const validateEmail = (req, res, next) => {
  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(req.body.email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }
  }
  
  next();
};

const validateStringLength = (field, minLength = 1, maxLength = 255) => {
  return (req, res, next) => {
    if (req.body[field]) {
      const value = req.body[field].toString().trim();
      
      if (value.length < minLength || value.length > maxLength) {
        return res.status(400).json({
          success: false,
          message: `${field} must be between ${minLength} and ${maxLength} characters long`
        });
      }
    }
    
    next();
  };
};

const validateEnrollment = (req, res, next) => {
  const { studentId, courseId } = req.body;
  
  if (!studentId || !courseId) {
    return res.status(400).json({
      success: false,
      message: 'Both studentId and courseId are required'
    });
  }
  
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid studentId format'
    });
  }
  
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid courseId format'
    });
  }
  
  next();
};

const handleValidationError = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  next(error);
};

const globalErrorHandler = (error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  validateObjectId,
  validateRequestBody,
  validateEmail,
  validateStringLength,
  validateEnrollment,
  handleValidationError,
  globalErrorHandler,
  asyncHandler
};