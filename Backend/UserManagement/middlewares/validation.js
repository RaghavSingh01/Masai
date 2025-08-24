import { body, param, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
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

export const validateUser = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name should only contain letters and spaces'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 1, max: 150 }).withMessage('Age must be a number between 1 and 150'),
  handleValidationErrors
];

export const validateAddress = [
  body('street')
    .notEmpty().withMessage('Street is required')
    .isLength({ max: 200 }).withMessage('Street cannot exceed 200 characters'),
  body('city')
    .notEmpty().withMessage('City is required')
    .isLength({ max: 100 }).withMessage('City cannot exceed 100 characters'),
  body('state')
    .notEmpty().withMessage('State is required')
    .isLength({ max: 100 }).withMessage('State cannot exceed 100 characters'),
  body('country')
    .optional()
    .isLength({ max: 100 }).withMessage('Country cannot exceed 100 characters'),
  body('pincode')
    .notEmpty().withMessage('Pincode is required')
    .custom((value, { req }) => {
      const country = req.body.country || 'India';
      if (country === 'India') {
        if (!/^[1-9][0-9]{5}$/.test(value)) {
          throw new Error('Indian pincode must be 6 digits and cannot start with 0');
        }
      } else {
        if (!/^[A-Za-z0-9]{3,10}$/.test(value)) {
          throw new Error('Pincode must be 3-10 alphanumeric characters');
        }
      }
      return true;
    }),
  handleValidationErrors
];

export const validateUserId = [
  param('userId').isMongoId().withMessage('Invalid user ID format'),
  handleValidationErrors
];

export const validateAddressId = [
  param('userId').isMongoId().withMessage('Invalid user ID format'),
  param('addressId').isMongoId().withMessage('Invalid address ID format'),
  handleValidationErrors
];
