const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { catchAsync } = require('../middleware/errorHandler');

exports.getPostsPerUser = catchAsync(async (req, res, next) => {
  const pipeline = [
    {
      $match: {
        isPublished: true
      }
    },
    {
      $group: {
        _id: '$author',
        postsCount: { $sum: 1 },
        totalLikes: { $sum: '$likesCount' },
        latestPost: { $max: '$createdAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        userName: '$userInfo.name',
        userEmail: '$userInfo.email',
        postsCount: 1,
        totalLikes: 1,
        latestPost: 1,
        averageLikesPerPost: {
          $cond: {
            if: { $gt: ['$postsCount', 0] },
            then: { $divide: ['$totalLikes', '$postsCount'] },
            else: 0
          }
        }
      }
    },
    {
      $sort: { postsCount: -1 }
    }
  ];

  const result = await Post.aggregate(pipeline);

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      analytics: result
    }
  });
});

exports.getCommentsPerUser = catchAsync(async (req, res, next) => {
  const pipeline = [
    {
      $group: {
        _id: '$author',
        commentsCount: { $sum: 1 },
        totalLikes: { $sum: '$likesCount' },
        latestComment: { $max: '$createdAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        userName: '$userInfo.name',
        userEmail: '$userInfo.email',
        commentsCount: 1,
        totalLikes: 1,
        latestComment: 1,
        averageLikesPerComment: {
          $cond: {
            if: { $gt: ['$commentsCount', 0] },
            then: { $divide: ['$totalLikes', '$commentsCount'] },
            else: 0
          }
        }
      }
    },
    {
      $sort: { commentsCount: -1 }
    }
  ];

  const result = await Comment.aggregate(pipeline);

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      analytics: result
    }
  });
});

exports.getEngagementAnalytics = catchAsync(async (req, res, next) => {
  const pipeline = [
    {
      $match: {
        isPublished: true
      }
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'post',
        as: 'comments'
      }
    },
    {
      $addFields: {
        commentsCount: { $size: '$comments' },
        engagementScore: {
          $add: [
            '$likesCount',
            { $multiply: [{ $size: '$comments' }, 2] } 
          ]
        }
      }
    },
    {
      $group: {
        _id: '$author',
        totalPosts: { $sum: 1 },
        totalLikes: { $sum: '$likesCount' },
        totalComments: { $sum: '$commentsCount' },
        totalEngagement: { $sum: '$engagementScore' },
        avgLikesPerPost: { $avg: '$likesCount' },
        avgCommentsPerPost: { $avg: '$commentsCount' },
        maxEngagementPost: { $max: '$engagementScore' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        userName: '$userInfo.name',
        userEmail: '$userInfo.email',
        statistics: {
          totalPosts: '$totalPosts',
          totalLikes: '$totalLikes',
          totalComments: '$totalComments',
          totalEngagement: '$totalEngagement',
          avgLikesPerPost: { $round: ['$avgLikesPerPost', 2] },
          avgCommentsPerPost: { $round: ['$avgCommentsPerPost', 2] },
          maxEngagementPost: '$maxEngagementPost'
        }
      }
    },
    {
      $sort: { 'statistics.totalEngagement': -1 }
    },
    {
      $limit: 20
    }
  ];

  const result = await Post.aggregate(pipeline);

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      analytics: result
    }
  });
});

exports.getPlatformStats = catchAsync(async (req, res, next) => {
  const totalUsers = await User.countDocuments({ isActive: true });

  const totalPosts = await Post.countDocuments({ isPublished: true });

  const totalComments = await Comment.countDocuments();

  const postStats = await Post.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: '$likesCount' },
        avgLikesPerPost: { $avg: '$likesCount' },
        maxLikes: { $max: '$likesCount' },
        minLikes: { $min: '$likesCount' }
      }
    }
  ]);

  const commentStats = await Comment.aggregate([
    {
      $group: {
        _id: null,
        totalCommentLikes: { $sum: '$likesCount' },
        avgLikesPerComment: { $avg: '$likesCount' },
        maxCommentLikes: { $max: '$likesCount' }
      }
    }
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const postsPerMonth = await Post.aggregate([
    {
      $match: {
        isPublished: true,
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      platform: {
        totalUsers,
        totalPosts,
        totalComments,
        postStatistics: postStats[0] || {
          totalLikes: 0,
          avgLikesPerPost: 0,
          maxLikes: 0,
          minLikes: 0
        },
        commentStatistics: commentStats[0] || {
          totalCommentLikes: 0,
          avgLikesPerComment: 0,
          maxCommentLikes: 0
        },
        postsPerMonth
      }
    }
  });
});

exports.getPopularTags = catchAsync(async (req, res, next) => {
  const pipeline = [
    {
      $match: {
        isPublished: true,
        tags: { $exists: true, $not: { $size: 0 } }
      }
    },
    {
      $unwind: '$tags'
    },
    {
      $group: {
        _id: '$tags',
        count: { $sum: 1 },
        totalLikes: { $sum: '$likesCount' },
        posts: {
          $push: {
            id: '$_id',
            title: '$title',
            likes: '$likesCount',
            createdAt: '$createdAt'
          }
        }
      }
    },
    {
      $addFields: {
        tag: '$_id',
        avgLikesPerPost: { $divide: ['$totalLikes', '$count'] }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        _id: 0,
        tag: 1,
        count: 1,
        totalLikes: 1,
        avgLikesPerPost: { $round: ['$avgLikesPerPost', 2] },
        recentPosts: { $slice: ['$posts', 5] } 
      }
    },
    {
      $limit: 20
    }
  ];

  const result = await Post.aggregate(pipeline);

  res.status(200).json({
    status: 'success',
    results: result.length,
    data: {
      tags: result
    }
  });
});