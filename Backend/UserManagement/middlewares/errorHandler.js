export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  if (err.name === 'CastError') {
    error = { message: 'Resource not found', status: 404 };
  }
  if (err.code === 11000) {
    error = { message: 'Duplicate field value entered', status: 400 };
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, status: 400 };
  }
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
};

export const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
