// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: message,
    // Only include the stack trace in development mode for security reasons
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;