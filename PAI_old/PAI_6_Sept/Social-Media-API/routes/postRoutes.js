const express = require('express');
const router = express.Router();


const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts
} = require('../controllers/postController');

const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getAllPosts);
router.get('/:postId', optionalAuth, getPostById);

router.use(authenticate); 

router.post('/', createPost);
router.get('/user/me', getMyPosts);
router.put('/:postId', updatePost);
router.delete('/:postId', deletePost);
router.post('/:postId/like', toggleLike);

module.exports = router;