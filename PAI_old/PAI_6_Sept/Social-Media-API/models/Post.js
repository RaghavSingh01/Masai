const mongoose = require('mongoose');
const config = require('../config/config');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the post'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  body: {
    type: String,
    required: [true, 'Please provide content for the post'],
    maxlength: [config.validation.maxPostLength, `Post content cannot be more than ${config.validation.maxPostLength} characters`]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  likesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  options: { sort: { createdAt: -1 } }
});

postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ isPublished: 1 });

postSchema.pre('save', function(next) {
  if (this.isModified('likes')) {
    this.likesCount = this.likes.length;
  }
  next();
});

postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

postSchema.methods.addLike = function(userId) {
  if (!this.isLikedBy(userId)) {
    this.likes.push({ user: userId });
    this.likesCount = this.likes.length;
  }
};

postSchema.methods.removeLike = function(userId) {
  this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  this.likesCount = this.likes.length;
};

postSchema.statics.findByAuthor = function(authorId) {
  return this.find({ author: authorId, isPublished: true }).populate('author', 'name email avatar');
};

postSchema.statics.findPublished = function() {
  return this.find({ isPublished: true }).populate('author', 'name email avatar');
};

module.exports = mongoose.model('Post', postSchema);