require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',

  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media-db',

  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,

  validation: {
    minPasswordLength: 6,
    maxPostLength: 1000,
    maxCommentLength: 500
  }
};