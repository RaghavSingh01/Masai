const User = require('../models/User');

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          provider: user.provider,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user profile',
      error: error.message
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;

    // Check if username/email already exists for other users
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: userId },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Username or email already exists'
        });
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          provider: user.provider,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile
};