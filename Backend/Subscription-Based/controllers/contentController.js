const Content = require('../models/contentModel');
const User = require('../models/userModel');

// @desc    Get free content
// @route   GET /api/content/free
// @access  Public
const getFreeContent = async (req, res) => {
  try {
    const content = await Content.find({ category: 'free' })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get premium content
// @route   GET /api/content/premium
// @access  Private (Premium/Pro users only)
const getPremiumContent = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Check if user has valid premium/pro subscription
    if (user.subscription.plan === 'free') {
      return res.status(403).json({ 
        message: 'Premium subscription required to access this content' 
      });
    }

    // Check if subscription is active
    if (user.subscription.expiryDate && new Date(user.subscription.expiryDate) < new Date()) {
      return res.status(403).json({ 
        message: 'Your subscription has expired. Please renew to access premium content.' 
      });
    }

    const content = await Content.find({ category: 'premium' })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private (Admin only)
const createContent = async (req, res) => {
  try {
    const { title, description, body, category } = req.body;

    // Validation
    if (!title || !description || !body || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!['free', 'premium'].includes(category)) {
      return res.status(400).json({ message: 'Invalid content category' });
    }

    const content = await Content.create({
      title,
      description,
      body,
      category,
      createdBy: req.user._id
    });

    const populatedContent = await Content.findById(content._id)
      .populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: populatedContent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private (Admin only)
const updateContent = async (req, res) => {
  try {
    const { title, description, body, category } = req.body;
    const contentId = req.params.id;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Update content
    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      {
        title: title || content.title,
        description: description || content.description,
        body: body || content.body,
        category: category || content.category,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: updatedContent
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private (Admin only)
const deleteContent = async (req, res) => {
  try {
    const contentId = req.params.id;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await Content.findByIdAndDelete(contentId);

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all content (Admin only)
// @route   GET /api/content
// @access  Private (Admin only)
const getAllContent = async (req, res) => {
  try {
    const content = await Content.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: content.length,
      data: content
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get content by ID
// @route   GET /api/content/:id
// @access  Public/Private (depends on content category)
const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // If content is premium, check user subscription
    if (content.category === 'premium' && req.user) {
      const user = await User.findById(req.user._id);
      
      if (user.subscription.plan === 'free') {
        return res.status(403).json({ 
          message: 'Premium subscription required to access this content' 
        });
      }

      if (user.subscription.expiryDate && new Date(user.subscription.expiryDate) < new Date()) {
        return res.status(403).json({ 
          message: 'Your subscription has expired. Please renew to access premium content.' 
        });
      }
    }

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getFreeContent,
  getPremiumContent,
  createContent,
  updateContent,
  deleteContent,
  getAllContent,
  getContentById
};