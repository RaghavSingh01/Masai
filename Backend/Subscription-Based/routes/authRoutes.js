// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshToken);

module.exports = router;