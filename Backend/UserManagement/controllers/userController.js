import User from '../models/userModels.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// Create a new user
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, age } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  const user = new User({ name, email, age, addresses: [] });
  const savedUser = await user.save();
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      age: savedUser.age,
      addresses: savedUser.addresses,
      addressCount: savedUser.addressCount
    }
  });
});

// Add new address for user
export const addUserAddress = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { street, city, state, country = 'India', pincode } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const newAddress = { street, city, state, country, pincode };
  user.addresses.push(newAddress);
  const savedUser = await user.save();
  const addedAddress = savedUser.addresses[savedUser.addresses.length - 1];
  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: {
      userId: savedUser._id,
      address: addedAddress,
      totalAddresses: savedUser.addresses.length
    }
  });
});

// Get users summary
export const getUsersSummary = asyncHandler(async (req, res) => {
  const summary = await User.getSummary();
  res.status(200).json({
    success: true,
    message: 'Users summary retrieved successfully',
    data: summary
  });
});

// Get user by ID
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({
    success: true,
    message: 'User details retrieved successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      addresses: user.addresses,
      addressCount: user.addressCount
    }
  });
});

// Bonus: Delete address
export const deleteUserAddress = asyncHandler(async (req, res) => {
  const { userId, addressId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const addressIndex = user.addresses.findIndex(
    addr => addr._id.toString() === addressId
  );
  if (addressIndex === -1) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }
  user.addresses.splice(addressIndex, 1);
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    data: { userId: user._id, remainingAddresses: user.addresses.length }
  });
});
