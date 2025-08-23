const Task = require('../models/taskModels');

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const newTask = new Task({
      title: title.trim(),
      description: description.trim(),
      priority: priority.toLowerCase(),
      dueDate: dueDate || null
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// Get all tasks with optional filtering
const getTasks = async (req, res) => {
  try {
    const { priority, status } = req.query;
    let filter = {};

    // Add priority filter if provided
    if (priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (validPriorities.includes(priority.toLowerCase())) {
        filter.priority = priority.toLowerCase();
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid priority filter. Must be low, medium, or high'
        });
      }
    }

    // Add status filter if provided
    if (status) {
      if (status.toLowerCase() === 'completed') {
        filter.isCompleted = true;
      } else if (status.toLowerCase() === 'pending') {
        filter.isCompleted = false;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid status filter. Must be completed or pending'
        });
      }
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks',
      error: error.message
    });
  }
};

// Update a task by ID
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Clean and prepare updates
    const cleanUpdates = {};
    if (updates.title) cleanUpdates.title = updates.title.trim();
    if (updates.description) cleanUpdates.description = updates.description.trim();
    if (updates.priority) cleanUpdates.priority = updates.priority.toLowerCase();
    if (updates.dueDate !== undefined) cleanUpdates.dueDate = updates.dueDate;
    if (updates.isCompleted !== undefined) cleanUpdates.isCompleted = updates.isCompleted;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      cleanUpdates,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// Delete tasks based on priority filter (bulk deletion)
const deleteTasks = async (req, res) => {
  try {
    const { priority } = req.query;

    const result = await Task.deleteMany({ 
      priority: priority.toLowerCase() 
    });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} task(s) with ${priority} priority`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tasks',
      error: error.message
    });
  }
};

// Get a single task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task
    });
  } catch (error) {
    console.error('Error retrieving task:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error retrieving task',
      error: error.message
    });
  }
};

// Delete a single task by ID
const deleteTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTasks,
  getTaskById,
  deleteTaskById
};
