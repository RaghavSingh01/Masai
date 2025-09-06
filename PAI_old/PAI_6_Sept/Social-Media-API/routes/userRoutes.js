const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  getUserById,
  getAllUsers,
  deleteAccount
} = require('../controllers/userController');

const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/', getAllUsers);
router.get('/:userId', getUserById);


router.use(authenticate); 

router.get('/profile/me', getProfile);
router.put('/profile/me', updateProfile);
router.delete('/profile/me', deleteAccount);

module.exports = router;