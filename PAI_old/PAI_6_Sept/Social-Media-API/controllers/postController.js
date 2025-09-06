const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { validatePostCreation, validateObjectId } = require('../utils/validator');

exports.createPost = catchAsync(async (req, res, next) => {
  const { title, body, tags } = req.body;

  const validation = validatePostCreation({ title, body });
  if (!validation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: validation.errors
    });
  }

  const processedTags = tags ? 
    tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0) : [];

  const newPost = await Post.create({
    title: title.trim(),
    body: body.trim(),
    author: req.user._id,
    tags: processedTags
  });

  await newPost.populate('author', 'name email avatar');

  res.status(201).json({
    status: 'success',
    message: 'Post created successfully',
    data: {
      post: newPost
    }
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const tag = req.query.tag;
  const author = req.query.author;

  const query = { isPublished: true };
  if (tag) {
    query.tags = { $in: [tag.toLowerCase()] };
  }
  if (author) {
    const authorValidation = validateObjectId(author);
    if (authorValidation.isValid) {
      query.author = author;
    }
  }

  const maxLimit = 50;
  const actualLimit = limit > maxLimit ? maxLimit : limit;

  const posts = await Post.find(query)
    .populate('author', 'name email avatar')
    .populate('commentsCount')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(actualLimit);

  const total = await Post.countDocuments(query);
  const totalPages = Math.ceil(total / actualLimit);

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        limit: actualLimit
      }
    }
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const idValidation = validateObjectId(postId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const post = await Post.findById(postId)
    .populate('author', 'name email avatar')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'name email avatar'
      },
      options: { sort: { createdAt: -1 } }
    });

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (!post.isPublished) {
    return next(new AppError('Post not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      post
    }
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { title, body, tags } = req.body;

  const idValidation = validateObjectId(postId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return next(new AppError('You can only update your own posts', 403));
  }

  const updateData = {};

  if (title !== undefined) {
    if (title.trim().length < 3 || title.trim().length > 100) {
      return res.status(400).json({
        status: 'fail',
        message: 'Title must be between 3 and 100 characters'
      });
    }
    updateData.title = title.trim();
  }

  if (body !== undefined) {
    if (body.trim().length < 10 || body.trim().length > 1000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Body must be between 10 and 1000 characters'
      });
    }
    updateData.body = body.trim();
  }

  if (tags !== undefined) {
    updateData.tags = tags.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    updateData,
    { new: true, runValidators: true }
  ).populate('author', 'name email avatar');

  res.status(200).json({
    status: 'success',
    message: 'Post updated successfully',
    data: {
      post: updatedPost
    }
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const idValidation = validateObjectId(postId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You can only delete your own posts', 403));
  }

  await Comment.deleteMany({ post: postId });

  await Post.findByIdAndDelete(postId);

  res.status(200).json({
    status: 'success',
    message: 'Post deleted successfully'
  });
});

exports.toggleLike = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const idValidation = validateObjectId(postId);
  if (!idValidation.isValid) {
    return res.status(400).json({
      status: 'fail',
      message: idValidation.message
    });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(new AppError('Post not found', 404));
  }

  if (!post.isPublished) {
    return next(new AppError('Post not found', 404));
  }

  const userId = req.user._id;
  const isLiked = post.isLikedBy(userId);

  if (isLiked) {
    post.removeLike(userId);
  } else {
    post.addLike(userId);
  }

  await post.save();

  res.status(200).json({
    status: 'success',
    message: isLiked ? 'Post unliked successfully' : 'Post liked successfully',
    data: {
      likesCount: post.likesCount,
      isLiked: !isLiked
    }
  });
});

// Get posts by current user
exports.getMyPosts = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const maxLimit = 50;
  const actualLimit = limit > maxLimit ? maxLimit : limit;

  const posts = await Post.find({ author: req.user._id })
    .populate('commentsCount')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(actualLimit);

  const total = await Post.countDocuments({ author: req.user._id });
  const totalPages = Math.ceil(total / actualLimit);

  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
      pagination: {
        current: page,
        pages: totalPages,
        total,
        limit: actualLimit
      }
    }
  });
});