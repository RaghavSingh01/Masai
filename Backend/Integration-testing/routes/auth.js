const express = require('express');
const {
  signup,
  login,
  signupValidation,
  loginValidation
} = require('../controllers/authController');

const router = express.Router();

// @route   POST /auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', signupValidation, signup);

// @route   POST /auth/login
// @desc    Login user and return JWT token
// @access  Public
router.post('/login', loginValidation, login);

module.exports = router;