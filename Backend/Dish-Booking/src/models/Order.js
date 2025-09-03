const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  dish: {
    type: mongoose.Schema.ObjectId,
    ref: 'Dish',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Order Received'
  },
  assignedChef: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  specialInstructions: {
    type: String,
    maxLength: [200, 'Special instructions cannot be more than 200 characters']
  },
  deliveryAddress: {
    street: String,
    city: String,
    zipCode: String,
    phone: String
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  estimatedDeliveryTime: {
    type: Date
  }
}, {
  timestamps: true
});

orderSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'dish',
    select: 'name price category'
  }).populate({
    path: 'assignedChef',
    select: 'name email'
  });

  next();
});

module.exports = mongoose.model('Order', orderSchema);