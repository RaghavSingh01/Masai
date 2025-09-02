// models/subscription.model.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'pro'],
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  paymentId: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, { 
  timestamps: true 
});

// Index for better query performance
SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1 });

module.exports = mongoose.model('Subscription', SubscriptionSchema);