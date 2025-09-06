const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { validateCommentText, validateObjectId } = require('../utils/validator');

exports.createComment = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { text } = req.body;

  const postIdValidation = validateObjectId(postId);
  if (!postIdValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: postIdValidation.message
    });
  }

  const textValidation = validateCommentText(text);
  if (!textValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: textValidation.message
    });
  }

  const post = await Post.findById(postId);
  if (!post || !post.isPublished) {
    return next(new AppError('Post not found', 404));
  }

  const newComment = await Comment.create({
    text: text.trim(),
    author: req.user._id,
    post: postId
  });

  await newComment.populate('author', 'name email avatar');

  res.status(201).json({
    status: 'success',
    message: 'Comment created successfully',
    data: {
      comment: newComment
    }
  });
});

exports.getCommentsByPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const postIdValidation = validateObjectId(postId);
  if (!postIdValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: postIdValidation.message
    });
  }

  const post = await Post.findById(postId);
  if (!post || !post.isPublished) {
    return next(new AppError('Post not found', 404));
  }

  const maxLimit = 50;
  const actualLimit = limit > maxLimit ? maxLimit : limit;

  const comments = await Comment.find({ post: postId })
    .populate('author', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(actualLimit);

  const total = await Comment.countDocuments({ post: postId });
  const totalPages = Math.ceil(total / actualLimit);

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        limit: actualLimit
      }
    }
  });
});

exports.getCommentById = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;

  const idValidation = validateObjectId(commentId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const comment = await Comment.findById(commentId)
    .populate('author', 'name email avatar')
    .populate('post', 'title');

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment
    }
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;

  const idValidation = validateObjectId(commentId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const textValidation = validateCommentText(text);
  if (!textValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: textValidation.message
    });
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update your own comments', 403));
  }

  comment.text = text.trim();
  await comment.save();

  await comment.populate('author', 'name email avatar');

  res.status(200).json({
    status: 'success',
    message: 'Comment updated successfully',
    data: {
      comment
    }
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;

  const idValidation = validateObjectId(commentId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own comments', 403));
  }

  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    status: 'success',
    message: 'Comment deleted successfully'
  });
});

exports.toggleLike = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;

  const idValidation = validateObjectId(commentId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }

  const userId = req.user._id;
  const isLiked = comment.isLikedBy(userId);

  if (isLiked) {
    comment.removeLike(userId);
  } else {
    comment.addLike(userId);
  }

  await comment.save();

  res.status(200).json({
    status: 'success',
    message: isLiked ? 'Comment unliked successfully' : 'Comment liked successfully',
    data: {
      likesCount: comment.likesCount,
      isLiked: !isLiked
    }
  });
});

exports.getMyComments = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const maxLimit = 50;
  const actualLimit = limit > maxLimit ? maxLimit : limit;

  const comments = await Comment.find({ author: req.user._id })
    .populate('post', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(actualLimit);

  const total = await Comment.countDocuments({ author: req.user._id });
  const totalPages = Math.ceil(total / actualLimit);

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        limit: actualLimit
      }
    }
  });
});