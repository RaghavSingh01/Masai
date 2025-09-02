// routes/subscription.routes.js
const express = require('express');
const router = express.Router();
const {
  subscribeToPlan,
  getSubscriptionStatus,
  renewSubscription,
  cancelSubscription
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

// All subscription routes require authentication
router.use(protect);

router.post('/subscribe', subscribeToPlan);
router.get('/subscription-status', getSubscriptionStatus);
router.patch('/renew', renewSubscription);
router.post('/cancel-subscription', cancelSubscription);

module.exports = router;