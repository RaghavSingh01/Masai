const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();

    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ user: user._id });
        return {
          user,
          profile: profile || null
        };
      })
    );

    res.json(usersWithProfiles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = await Profile.findOne({ user: req.params.id });

    res.json({
      user,
      profile: profile || null
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.post('/add-profile', async (req, res) => {
  try {
    const { bio, socialMediaLinks, user } = req.body;

    if (!user) {
      return res.status(400).json({ error: 'User reference is required' });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingProfile = await Profile.findOne({ user });
    if (existingProfile) {
      return res.status(400).json({ error: 'User already has a profile' });
    }

    const newProfile = new Profile({
      bio,
      socialMediaLinks,
      user
    });


    const savedProfile = await newProfile.save();
    res.status(201).json({ message: 'Profile added successfully', profile: savedProfile });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'User already has a profile' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

module.exports = router;
