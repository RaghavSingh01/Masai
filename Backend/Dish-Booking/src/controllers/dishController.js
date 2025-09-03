const Dish = require('../models/Dish');


const getAllDishes = async (req, res) => {
  try {
    const { category, available, search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const dishes = await Dish.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Dish.countDocuments(query);

    res.json({
      success: true,
      data: {
        dishes,
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


const getDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('createdBy', 'name email');

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    res.json({
      success: true,
      data: { dish }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const createDish = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;

    const dish = await Dish.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Dish created successfully',
      data: { dish }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const updateDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Dish updated successfully',
      data: { dish: updatedDish }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


const deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    await Dish.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const toggleAvailability = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found'
      });
    }

    dish.isAvailable = !dish.isAvailable;
    await dish.save();

    res.json({
      success: true,
      message: `Dish ${dish.isAvailable ? 'enabled' : 'disabled'} successfully`,
      data: { dish }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllDishes,
  getDish,
  createDish,
  updateDish,
  deleteDish,
  toggleAvailability
};