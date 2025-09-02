const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes - require authentication
router.use(authenticateToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;