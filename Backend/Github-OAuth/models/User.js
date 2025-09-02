const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    enum: ['github', 'local'],
    default: 'local'
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'local';
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800 // 7 days
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

module.exports = mongoose.model('User', userSchema);