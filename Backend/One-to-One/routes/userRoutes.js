const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /add-user
router.post('/add-user', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email fields are required' });
    }
    if (name.length < 3) {
      return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }

    const newUser = new User({ name, email });
    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

module.exports = router;
