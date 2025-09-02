const { body, param, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    next();
};

// User validation rules
const validateSignup = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.[a-z])(?=.[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

    body('role')
        .optional()
        .isIn(['user', 'admin'])
        .withMessage('Role must be either user or admin'),

    handleValidationErrors
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

// Booking validation rules
const validateBooking = [
    body('serviceName')
        .isIn(['plumbing', 'car repair', 'cleaning', 'electrical', 'painting', 'carpentry'])
        .withMessage('Invalid service name'),

    body('requestedDate')
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid date')
        .custom((value) => {
            if (value <= new Date()) {
                throw new Error('Requested date must be in the future');
            }
            return true;
        }),

    body('requestedTime')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Please provide valid time in HH:MM format'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),

    handleValidationErrors
];

const validateUpdateBooking = [
    body('serviceName')
        .optional()
        .isIn(['plumbing', 'car repair', 'cleaning', 'electrical', 'painting', 'carpentry'])
        .withMessage('Invalid service name'),

    body('requestedDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid date')
        .custom((value) => {
            if (value && value <= new Date()) {
                throw new Error('Requested date must be in the future');
            }
            return true;
        }),

    body('requestedTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Please provide valid time in HH:MM format'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),

    handleValidationErrors
];

// Admin action validation
const validateAdminAction = [
    body('adminNotes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Admin notes cannot exceed 500 characters'),

    handleValidationErrors
];

// Parameter validation
const validateObjectId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid booking ID'),

    handleValidationErrors
];

module.exports = {
    validateSignup,
    validateLogin,
    validateBooking,
    validateUpdateBooking,
    validateAdminAction,
    validateObjectId,
    handleValidationErrors
};