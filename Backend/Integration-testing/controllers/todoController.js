const { body, validationResult } = require('express-validator');
const Todo = require('../models/Todo');

// Validation rules
const createTodoValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

const updateTodoValidation = [
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'completed'])
    .withMessage('Status must be either pending or completed')
];

// @desc    Create new todo
// @route   POST /todos
// @access  Private
const createTodo = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { title, description } = req.body;

    const todo = await Todo.create({
      title,
      description,
      user: req.user._id
    });

    res.status(201).json({
      status: 'success',
      message: 'Todo created successfully',
      data: { todo }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all todos for logged in user
// @route   GET /todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = { user: req.user._id };
    if (status && ['pending', 'completed'].includes(status)) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Todo.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        todos,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo
// @route   GET /todos/:id
// @access  Private
const getTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        status: 'error',
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { todo }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update todo
// @route   PUT /todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { title, description, status } = req.body;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status })
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!todo) {
      return res.status(404).json({
        status: 'error',
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Todo updated successfully',
      data: { todo }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete todo
// @route   DELETE /todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        status: 'error',
        message: 'Todo not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  createTodoValidation,
  updateTodoValidation
};