const express = require('express');
const {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  createTodoValidation,
  updateTodoValidation
} = require('../controllers/todoController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// @route   POST /todos
// @desc    Create a new todo
// @access  Private
router.post('/', createTodoValidation, createTodo);

// @route   GET /todos
// @desc    Get all todos for logged in user
// @access  Private
router.get('/', getTodos);

// @route   GET /todos/:id
// @desc    Get single todo by ID
// @access  Private
router.get('/:id', getTodo);

// @route   PUT /todos/:id
// @desc    Update a specific todo
// @access  Private
router.put('/:id', updateTodoValidation, updateTodo);

// @route   DELETE /todos/:id
// @desc    Delete a specific todo
// @access  Private
router.delete('/:id', deleteTodo);

module.exports = router;