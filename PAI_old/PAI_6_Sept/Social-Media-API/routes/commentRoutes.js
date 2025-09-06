const express = require('express');
const router = express.Router();

const {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
  toggleLike,
  getMyComments
} = require('../controllers/commentController');

const { authenticate } = require('../middleware/auth');

router.get('/post/:postId', getCommentsByPost);
router.get('/:commentId', getCommentById);

router.use(authenticate); 

router.post('/post/:postId', createComment);
router.get('/user/me', getMyComments);
router.put('/:commentId', updateComment);
router.delete('/:commentId', deleteComment);
router.post('/:commentId/like', toggleLike);

module.exports = router;