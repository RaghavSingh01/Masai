const jwt = require('jsonwebtoken');
const User = require('../models/User');

class JWTUtils {
    // Generate access token (15 minutes expiry)
    static generateAccessToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET || 'access_token_secret',
            { expiresIn: '15m' }
        );
    }

    // Generate refresh token (7 days expiry)
    static generateRefreshToken(payload) {
        return jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET || 'refresh_token_secret',
            { expiresIn: '7d' }
        );
    }

    // Verify access token
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_token_secret');
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }

    // Verify refresh token
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh_token_secret');
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    // Generate token pair
    static generateTokens(user) {
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);

        return { accessToken, refreshToken };
    }

    // Store refresh token in database
    static async storeRefreshToken(userId, refreshToken) {
        try {
            await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        refreshTokens: {
                            token: refreshToken,
                            createdAt: new Date()
                        }
                    }
                }
            );
        } catch (error) {
            throw new Error('Failed to store refresh token');
        }
    }

    // Remove refresh token from database
    static async removeRefreshToken(userId, refreshToken) {
        try {
            await User.findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        refreshTokens: { token: refreshToken }
                    }
                }
            );
        } catch (error) {
            throw new Error('Failed to remove refresh token');
        }
    }

    // Validate refresh token exists in database
    static async validateRefreshToken(userId, refreshToken) {
        try {
            const user = await User.findOne({
                _id: userId,
                'refreshTokens.token': refreshToken
            });
            return !!user;
        } catch (error) {
            return false;
        }
    }

    // Clean expired refresh tokens
    static async cleanExpiredTokens(userId) {
        try {
            await User.findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        refreshTokens: {
                            createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                        }
                    }
                }
            );
        } catch (error) {
            console.error('Failed to clean expired tokens:', error);
        }
    }
}

module.exports = JWTUtils;