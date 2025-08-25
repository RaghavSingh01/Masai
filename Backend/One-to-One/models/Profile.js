const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  bio: {
    type: String,
    optional: true
  },
  socialMediaLinks: {
    type: [String],
    optional: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Profile', profileSchema);
