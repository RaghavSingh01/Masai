// routes/index.js
const express = require('express');
const router = express.Router();

const recipeRoutes = require('./recipes');
const compareRoutes = require('./compare');

// Mount the routes to their respective paths
router.use('/', recipeRoutes);
router.use('/', compareRoutes); // Or a different path like '/compare'

// Health check route for the API
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

module.exports = router;