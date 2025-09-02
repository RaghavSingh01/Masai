require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/github-oauth-db')
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/api', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'GitHub OAuth JWT MongoDB API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler for routes not found
app.use('#', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});