// Task validation middleware
const validateTaskData = (req, res, next) => {
  const { title, description, priority } = req.body;
  const errors = [];

  // Check if required fields are present
  if (!title || title.trim() === '') {
    errors.push({
      field: 'title',
      message: 'Title is required and cannot be empty'
    });
  }

  if (!description || description.trim() === '') {
    errors.push({
      field: 'description', 
      message: 'Description is required and cannot be empty'
    });
  }

  if (!priority || priority.trim() === '') {
    errors.push({
      field: 'priority',
      message: 'Priority is required and cannot be empty'
    });
  } else {
    // Validate priority value
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      errors.push({
        field: 'priority',
        message: 'Priority must be low, medium, or high'
      });
    }
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // If validation passes, continue to the next middleware/controller
  next();
};

// Middleware to validate task update data
const validateTaskUpdateData = (req, res, next) => {
  const { title, description, priority } = req.body;
  const errors = [];

  // For updates, fields are optional but if present, they must be valid
  if (title !== undefined && (title === '' || (typeof title === 'string' && title.trim() === ''))) {
    errors.push({
      field: 'title',
      message: 'Title cannot be empty if provided'
    });
  }

  if (description !== undefined && (description === '' || (typeof description === 'string' && description.trim() === ''))) {
    errors.push({
      field: 'description',
      message: 'Description cannot be empty if provided'
    });
  }

  if (priority !== undefined) {
    if (priority === '' || (typeof priority === 'string' && priority.trim() === '')) {
      errors.push({
        field: 'priority',
        message: 'Priority cannot be empty if provided'
      });
    } else {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority.toLowerCase())) {
        errors.push({
          field: 'priority',
          message: 'Priority must be low, medium, or high'
        });
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

// Middleware to validate priority filter for bulk deletion
const validatePriorityFilter = (req, res, next) => {
  const { priority } = req.query;

  if (!priority) {
    return res.status(400).json({
      success: false,
      message: 'Priority filter is required for bulk deletion'
    });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (!validPriorities.includes(priority.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Priority filter must be low, medium, or high'
    });
  }

  next();
};

module.exports = {
  validateTaskData,
  validateTaskUpdateData,
  validatePriorityFilter
};
