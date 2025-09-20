const express = require('express');
const auth = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get('/', auth, messageController.getMessages);

module.exports = router;