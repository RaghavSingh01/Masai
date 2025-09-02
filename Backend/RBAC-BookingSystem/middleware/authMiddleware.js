const JWTUtils = require('../utils/jwtUtils');
const User = require('../models/User');

// Authenticate user with access token
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify the access token
        const decoded = JWTUtils.verifyAccessToken(token);

        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        // Attach user to request object
        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired access token',
            error: error.message
        });
    }
};

// Authorization middleware for role-based access
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

// Middleware to check if user owns the resource or is admin
const ownershipOrAdmin = (resourceUserField = 'user') => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Admin can access everything
        if (req.user.role === 'admin') {
            return next();
        }

        // For non-admin users, check ownership
        const resourceUserId = req.booking ? req.booking[resourceUserField] : req.params.userId;

        if (resourceUserId && resourceUserId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only access your own resources.'
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize,
    ownershipOrAdmin
};