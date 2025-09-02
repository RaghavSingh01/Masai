// controllers/subscription.controller.js
const User = require('../models/userModel');
const Subscription = require('../models/subscriptionModel');

// @desc    Subscribe to a plan
// @route   POST /api/subscribe
// @access  Private
const subscribeToPlan = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user._id;

    // Validate plan
    const validPlans = ['premium', 'pro'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    // Check if user already has an active subscription
    const user = await User.findById(userId);
    if (user.subscription.plan !== 'free' && 
        user.subscription.expiryDate && 
        new Date(user.subscription.expiryDate) > new Date()) {
      return res.status(400).json({ message: 'You already have an active subscription' });
    }

    // Calculate expiry date (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Update user subscription
    await User.findByIdAndUpdate(userId, {
      'subscription.plan': plan,
      'subscription.expiryDate': expiryDate,
      role: plan // Update role to match subscription
    });

    // Create subscription record
    await Subscription.create({
      userId,
      plan,
      startDate: new Date(),
      endDate: expiryDate,
      status: 'active'
    });

    res.json({
      message: `Successfully subscribed to ${plan} plan`,
      subscription: {
        plan,
        expiryDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check subscription status
// @route   GET /api/subscription-status
// @access  Private
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    let isActive = false;
    let daysRemaining = 0;

    if (user.subscription.expiryDate) {
      const now = new Date();
      const expiry = new Date(user.subscription.expiryDate);
      isActive = expiry > now;
      
      if (isActive) {
        daysRemaining = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      }
    }

    res.json({
      subscription: {
        plan: user.subscription.plan,
        expiryDate: user.subscription.expiryDate,
        isActive,
        daysRemaining
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Renew subscription
// @route   PATCH /api/renew
// @access  Private
const renewSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user.subscription.plan === 'free') {
      return res.status(400).json({ message: 'No subscription to renew' });
    }

    // Check if subscription has expired
    if (user.subscription.expiryDate && new Date(user.subscription.expiryDate) < new Date()) {
      return res.status(400).json({ 
        message: 'Subscription has expired. Please purchase a new subscription.' 
      });
    }

    // Extend subscription by 30 days
    const currentExpiry = new Date(user.subscription.expiryDate);
    const newExpiryDate = new Date(currentExpiry);
    newExpiryDate.setDate(newExpiryDate.getDate() + 30);

    await User.findByIdAndUpdate(userId, {
      'subscription.expiryDate': newExpiryDate
    });

    // Update subscription record
    await Subscription.findOneAndUpdate(
      { userId, status: 'active' },
      { endDate: newExpiryDate }
    );

    res.json({
      message: 'Subscription renewed successfully',
      subscription: {
        plan: user.subscription.plan,
        expiryDate: newExpiryDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel subscription
// @route   POST /api/cancel-subscription
// @access  Private
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user.subscription.plan === 'free') {
      return res.status(400).json({ message: 'No subscription to cancel' });
    }

    // Update user to free plan
    await User.findByIdAndUpdate(userId, {
      'subscription.plan': 'free',
      'subscription.expiryDate': null,
      role: 'user'
    });

    // Update subscription record
    await Subscription.findOneAndUpdate(
      { userId, status: 'active' },
      { 
        status: 'cancelled',
        endDate: new Date()
      }
    );

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: {
        plan: 'free',
        expiryDate: null
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update expired subscriptions (cron job function)
// @access  Internal
const updateUserSubscriptions = async () => {
  try {
    const now = new Date();
    
    // Find users with expired subscriptions
    const expiredUsers = await User.find({
      'subscription.expiryDate': { $lt: now },
      'subscription.plan': { $ne: 'free' }
    });

    // Update expired users to free plan
    for (const user of expiredUsers) {
      await User.findByIdAndUpdate(user._id, {
        'subscription.plan': 'free',
        'subscription.expiryDate': null,
        role: 'user'
      });

      // Update subscription record
      await Subscription.findOneAndUpdate(
        { userId: user._id, status: 'active' },
        { 
          status: 'expired',
          endDate: now
        }
      );
    }

    console.log(`Updated ${expiredUsers.length} expired subscriptions`);
  } catch (error) {
    console.error('Error updating subscriptions:', error);
  }
};

module.exports = {
  subscribeToPlan,
  getSubscriptionStatus,
  renewSubscription,
  cancelSubscription,
  updateUserSubscriptions
};