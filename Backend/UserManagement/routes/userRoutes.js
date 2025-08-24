import express from 'express';
import {
  createUser,
  addUserAddress,
  getUsersSummary,
  getUserById,
  deleteUserAddress
} from '../controllers/userController.js';
import {
  validateUser,
  validateAddress,
  validateUserId,
  validateAddressId
} from '../middlewares/validation.js';

const router = express.Router();

router.get('/summary', getUsersSummary);
router.post('/', validateUser, createUser);
router.get('/:userId', validateUserId, getUserById);
router.post('/:userId/address', validateUserId, validateAddress, addUserAddress);
router.delete('/:userId/address/:addressId', validateAddressId, deleteUserAddress);

export default router;
