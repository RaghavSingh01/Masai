const User = require('../models/User');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { generateToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, validateObjectId } = require('../utils/validator');
const { logAuthAttempt } = require('../middleware/logger');

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, bio } = req.body;

  const validation = validateUserRegistration({ name, email, password });
  if (!validation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: validation.errors
    });
  }

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    logAuthAttempt(email, false, 'User already exists');
    return res.status(400).json({
      status: 'fail',
      message: 'User with this email already exists'
    });
  }

  const newUser = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    bio: bio ? bio.trim() : ''
  });

  const token = generateToken(newUser._id);

  logAuthAttempt(email, true, 'User registered successfully');

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: newUser.getPublicProfile(),
      token
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const validation = validateUserLogin({ email, password });
  if (!validation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: validation.errors
    });
  }

  const user = await User.findByEmail(email).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    logAuthAttempt(email, false, 'Invalid credentials');
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email or password'
    });
  }

  if (!user.isActive) {
    logAuthAttempt(email, false, 'Account deactivated');
    return res.status(401).json({
      status: 'fail',
      message: 'Your account has been deactivated. Please contact support.'
    });
  }

  const token = generateToken(user._id);

  logAuthAttempt(email, true);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: user.getPublicProfile(),
      token
    }
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user.getPublicProfile()
    }
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name, bio, avatar } = req.body;

  const updateData = {};

  if (name !== undefined) {
    if (name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name must be between 2 and 50 characters'
      });
    }
    updateData.name = name.trim();
  }

  if (bio !== undefined) {
    if (bio.length > 200) {
      return res.status(400).json({
        status: 'fail',
        message: 'Bio cannot be more than 200 characters'
      });
    }
    updateData.bio = bio.trim();
  }

  if (avatar !== undefined) {
    updateData.avatar = avatar.trim();
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: updatedUser.getPublicProfile()
    }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const idValidation = validateObjectId(userId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const user = await User.findById(userId).populate({
    path: 'posts',
    select: 'title body createdAt likesCount',
    options: { sort: { createdAt: -1 }, limit: 5 }
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!user.isActive) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user.getPublicProfile()
    }
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const maxLimit = 50;
  const actualLimit = limit > maxLimit ? maxLimit : limit;

  const users = await User.find({ isActive: true })
    .select('name email bio avatar createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(actualLimit);

  const total = await User.countDocuments({ isActive: true });
  const totalPages = Math.ceil(total / actualLimit);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        limit: actualLimit
      }
    }
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully'
  });
});