// models/content.model.js
const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['free', 'premium'],
    required: true,
    default: 'free'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Index for better query performance
ContentSchema.index({ category: 1, createdAt: -1 });
ContentSchema.index({ createdBy: 1 });
ContentSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Content', ContentSchema);