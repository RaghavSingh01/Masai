const config = require('../config/config');

const logger = (req, res, next) => {
  const start = Date.now();

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

  if (config.env === 'development') {
    console.log('Request Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Request Body:', req.body);
    }
    if (req.query && Object.keys(req.query).length > 0) {
      console.log('Query Parameters:', req.query);
    }
  }

  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;

    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);

    if (config.env === 'development' && data) {
      const logData = { ...data };
      if (logData.token) delete logData.token;
      if (logData.password) delete logData.password;
      console.log('Response Data:', logData);
    }

    return originalJson.call(this, data);
  };

  res.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Error in ${req.method} ${req.originalUrl}:`, err);
  });

  next();
};

const logDatabaseQuery = (model, operation, query = {}) => {
  if (config.env === 'development') {
    console.log(`[DB] ${model}.${operation}:, query`);
  }
};

// Log authenication attempts
const logAuthAttempt = (email, success, reason = '') => {
  const status = success ? 'SUCCESS' : 'FAILED';
  console.log(`[AUTH] ${status} - Email: ${email}${reason ? ` - Reason: ${reason}` : ''}`);
};

const logApiError = (error, req) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(`Message: ${error.message}`);
  if (config.env === 'development') {
    console.error(`Stack: ${error.stack}`);
  }
};

module.exports = {
  logger,
  logDatabaseQuery,
  logAuthAttempt,
  logApiError
};