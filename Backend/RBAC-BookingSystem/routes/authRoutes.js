const express = require('express');
const User = require('../models/User');
const JWTUtils = require('../utils/jwtUtils');
const { authenticate } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');

const router = express.Router();

// POST /signup - Register a new user
router.post('/signup', asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username, email, and password are required'
        });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User with this email or username already exists'
        });
    }

    // Create new user (password will be hashed automatically)
    const user = await User.create({
        username,
        email,
        password,
        role: role || 'user' // Default to 'user' role
    });

    // Generate tokens
    const { accessToken, refreshToken } = JWTUtils.generateTokens(user);

    // Store refresh token
    await JWTUtils.storeRefreshToken(user._id, refreshToken);

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: user.toJSON(),
            accessToken,
            refreshToken
        }
    });
}));

// POST /login - Authenticate user and generate JWT tokens
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    // Generate tokens
    const { accessToken, refreshToken } = JWTUtils.generateTokens(user);

    // Store refresh token
    await JWTUtils.storeRefreshToken(user._id, refreshToken);

    // Clean expired tokens
    await JWTUtils.cleanExpiredTokens(user._id);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: user.toJSON(),
            accessToken,
            refreshToken
        }
    });
}));

// POST /refresh - Issue a new access token using a refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: 'Refresh token is required'
        });
    }

    // Verify refresh token
    const decoded = JWTUtils.verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const isValidToken = await JWTUtils.validateRefreshToken(decoded.id, refreshToken);

    if (!isValidToken) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }

    // Get user
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User not found'
        });
    }

    // Generate new access token
    const accessToken = JWTUtils.generateAccessToken({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    });

    res.status(200).json({
        success: true,
        message: 'Access token refreshed successfully',
        data: {
            accessToken
        }
    });
}));

// POST /logout - Logout user and invalidate refresh token
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        await JWTUtils.removeRefreshToken(req.user.id, refreshToken);
    }

    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
}));

// GET /profile - Get current user profile
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
            user: user.toJSON()
        }
    });
}));

module.exports = router;