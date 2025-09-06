const express = require('express');
const router = express.Router();

const {
  getPostsPerUser,
  getCommentsPerUser,
  getEngagementAnalytics,
  getPlatformStats,
  getPopularTags
} = require('../controllers/analyticsController');

const { authenticate, restrictTo } = require('../middleware/auth');

router.get('/posts-per-user', getPostsPerUser);
router.get('/platform-stats', getPlatformStats);
router.get('/popular-tags', getPopularTags);

router.use(authenticate);

router.get('/comments-per-user', getCommentsPerUser);
router.get('/engagement', getEngagementAnalytics);

router.use(restrictTo('admin'));

module.exports = router;