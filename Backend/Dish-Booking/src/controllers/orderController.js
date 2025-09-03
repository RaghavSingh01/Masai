const Order = require('../models/Order');
const Dish = require('../models/Dish');
const User = require('../models/User');


const createOrder = async (req, res) => {
  try {
    const { dish: dishId, quantity, specialInstructions, deliveryAddress } = req.body;

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    if (!dish.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Dish is currently not available'
      });
    }

    const totalAmount = dish.price * quantity;

    const chefs = await User.find({ role: 'chef', isActive: true });
    if (chefs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No chefs available at the moment'
      });
    }

    const randomChef = chefs[Math.floor(Math.random() * chefs.length)];

    const estimatedDeliveryTime = new Date(
      Date.now() + (dish.preparationTime + 30) * 60000
    );

    const order = await Order.create({
      user: req.user._id,
      dish: dishId,
      quantity,
      totalAmount,
      assignedChef: randomChef._id,
      specialInstructions,
      deliveryAddress,
      estimatedDeliveryTime
    });

    await order.populate([
      { path: 'user', select: 'name email' },
      { path: 'dish', select: 'name price category' },
      { path: 'assignedChef', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (req.user.role === 'user') {
      query.user = req.user._id;
    } else if (req.user.role === 'chef') {
      query.assignedChef = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (req.user.role === 'user' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (req.user.role === 'chef' && order.assignedChef._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (req.user.role === 'chef' && order.assignedChef.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update orders assigned to you'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const getAssignedOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { assignedChef: req.user._id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getMyOrders,
  getAssignedOrders
};