const express = require('express');
const router = express.Router();

// Import controllers
const {
  createTask,
  getTasks,
  updateTask,
  deleteTasks,
  getTaskById,
  deleteTaskById
} = require('../Controller/taskController');

// Import middleware
const {
  validateTaskData,
  validateTaskUpdateData,
  validatePriorityFilter
} = require('../Middlewares/taskMiddlewares');

// Routes as specified in the requirements

// POST /tasks - Add a new task with validation
router.post('/tasks', validateTaskData, createTask);

// GET /tasks - Retrieve tasks with optional filtering by priority or status
router.get('/tasks', getTasks);

// GET /tasks/:id - Get a specific task by ID
router.get('/tasks/:id', getTaskById);

// PATCH /tasks/:id - Update a task with completion logic
router.patch('/tasks/:id', validateTaskUpdateData, updateTask);

// DELETE /tasks - Delete tasks based on the priority filter (bulk deletion)
router.delete('/tasks', validatePriorityFilter, deleteTasks);

// DELETE /tasks/:id - Delete a specific task by ID
router.delete('/tasks/:id', deleteTaskById);

module.exports = router;
