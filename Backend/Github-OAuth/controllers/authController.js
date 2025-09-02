const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { getAccessToken, getUserProfile, getUserEmail } = require('../services/githubAuth');

/**
 * GitHub OAuth callback handler
 */
const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'Authorization code not provided'
      });
    }

    // Exchange code for access token
    const accessToken = await getAccessToken(code);

    if (!accessToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to get access token'
      });
    }

    // Get user profile from GitHub
    const githubUser = await getUserProfile(accessToken);

    // Get user email (might be null if private)
    let email = githubUser.email;
    if (!email) {
      email = await getUserEmail(accessToken);
    }

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Email not available from GitHub profile'
      });
    }

    // Check if user already exists
    let user = await User.findOne({
      $or: [
        { githubId: githubUser.id.toString() },
        { email: email }
      ]
    });

    if (user) {
      // Update existing user
      user.githubId = githubUser.id.toString();
      user.username = githubUser.login;
      user.email = email;
      user.avatar = githubUser.avatar_url;
      user.provider = 'github';
      user.isVerified = true;
      await user.save();
    } else {
      // Create new user
      user = new User({
        githubId: githubUser.id.toString(),
        username: githubUser.login,
        email: email,
        avatar: githubUser.avatar_url,
        provider: 'github',
        isVerified: true
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      username: user.username
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend or send response
    if (process.env.FRONTEND_URL) {
      return res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    }

    res.json({
      status: 'success',
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider
      }
    });

  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/**
 * Login with email and password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if user registered with GitHub
    if (user.provider === 'github') {
      return res.status(400).json({
        status: 'error',
        message: 'Please use GitHub to login'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      username: user.username
    });

    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        provider: user.provider
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Register new user
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, email, and password are required'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email or username'
      });
    }

    // Create user
    const user = new User({
      username,
      email,
      password,
      provider: 'local'
    });

    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      username: user.username
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        provider: user.provider
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Logout user
 */
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

module.exports = {
  githubCallback,
  login,
  register,
  logout
};