const config = require('../config/config');
const { logApiError } = require('./logger');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return {
    status: 'fail',
    statusCode: 400,
    message
  };
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field}: '${value}' already exists. Please use another value.`;

  return {
    status: 'fail',
    statusCode: 400,
    message
  };
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return {
    status: 'fail',
    statusCode: 400,
    message
  };
};

// Handle JWT error
const handleJWTError = () => {
  return {
    status: 'fail',
    statusCode: 401,
    message: 'Invalid token. Please log in again.'
  };
};

const handleJWTExpiredError = () => {
  return {
    status: 'fail',
    statusCode: 401,
    message: 'Your token has expired. Please log in again.'
  };
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  else {
    console.error('ERROR:', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

const errorHandler = (err, req, res, next) => {
  logApiError(err, req);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.env === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
      error.isOperational = true;
    }

    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
      error.isOperational = true;
    }

    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
      error.isOperational = true;
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
      error.isOperational = true;
    }

    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
      error.isOperational = true;
    }

    sendErrorProd(error, res);
  }
};

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  catchAsync,
  AppError
};