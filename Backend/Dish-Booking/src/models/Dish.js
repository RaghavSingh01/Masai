const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a dish name'],
    trim: true,
    maxLength: [100, 'Dish name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a dish description'],
    maxLength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['appetizer', 'main-course', 'dessert', 'beverage', 'salad']
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 30
  },
  image: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
dishSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Dish', dishSchema);