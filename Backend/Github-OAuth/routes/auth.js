const express = require('express');
const router = express.Router();
const { githubCallback, login, register, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// === GitHub OAuth Routes ===

// 1. Redirects user to GitHub's authorization page
router.get('/github', (req, res) => {
  const githubAuthUrl = "https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user:email";
  res.redirect(githubAuthUrl);
});

// 2. GitHub redirects back to this URL after authorization
router.get('/github/callback', githubCallback);


// === Local Authentication Routes ===

// Register a new user
router.post('/register', register);

// Login with email and password
router.post('/login', login);

// Logout (requires authentication to know who is logging out)
router.post('/logout', authenticateToken, logout);


// Make sure this is the last line
module.exports = router;