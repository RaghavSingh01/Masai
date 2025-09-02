// models/blacklist.model.js
const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Blacklist', BlacklistSchema);