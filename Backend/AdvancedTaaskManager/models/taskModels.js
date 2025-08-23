const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be low, medium, or high'
    },
    lowercase: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

// Middleware to set completionDate when task is marked as completed
taskSchema.pre('save', function(next) {
  if (this.isModified('isCompleted') && this.isCompleted) {
    this.completionDate = new Date();
  } else if (this.isModified('isCompleted') && !this.isCompleted) {
    this.completionDate = null;
  }
  next();
});

// Middleware for findOneAndUpdate operations
taskSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();

  if (update.isCompleted === true) {
    update.completionDate = new Date();
  } else if (update.isCompleted === false) {
    update.completionDate = null;
  }

  next();
});

// Export the Task model
module.exports = mongoose.model('Task', taskSchema);
