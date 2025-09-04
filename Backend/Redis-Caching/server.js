const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Redis = require('ioredis');

// Import routes
const itemRoutes = require('./routes/itemRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
});

// Redis connection events
redis.on('connect', () => {
  console.log('âœ… Connected to Redis server');
});

redis.on('error', (err) => {
  console.error('âŒ Redis connection error:', err);
});

redis.on('ready', () => {
  console.log('ðŸš€ Redis client ready');
});

// Make redis client available to routes
app.set('redis', redis);

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() + ' seconds'
  });
});

// API routes
app.use('/api', itemRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Redis Caching Express API',
    version: '1.0.0',
    endpoints: {
      'GET /api/items': 'Get all items (with caching)',
      'POST /api/items': 'Create a new item (invalidates cache)',
      'PUT /api/items/:id': 'Update an item by ID (invalidates cache)', 
      'DELETE /api/items/:id': 'Delete an item by ID (invalidates cache)',
      'GET /health': 'Health check endpoint'
    }
  });
});

// 404 handler
app.use( (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('âŒ Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(' SIGTERM received, shutting down gracefully');
  redis.disconnect();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(' SIGINT received, shutting down gracefully');
  redis.disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API available at: http://localhost:${PORT}/api/items`);
  console.log(` Health check at: http://localhost:${PORT}/health`);
});

module.exports = app;