// routes/content.routes.js
const express = require('express');
const router = express.Router();
const {
  getFreeContent,
  getPremiumContent,
  createContent,
  updateContent,
  deleteContent,
  getAllContent,
  getContentById
} = require('../controllers/contentController');
const { protect, adminOnly, premiumAccess } = require('../middleware/authMiddleware');

// Public routes
router.get('/content/free', getFreeContent);
router.get('/content/:id', getContentById);

// Protected routes - Premium content access
router.get('/content/premium', protect, premiumAccess, getPremiumContent);

// Admin only routes
router.use('/content', protect, adminOnly);
router.get('/content', getAllContent);
router.post('/content', createContent);
router.put('/content/:id', updateContent);
router.delete('/content/:id', deleteContent);

module.exports = router;