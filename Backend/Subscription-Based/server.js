const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');

const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const contentRoutes = require('./routes/contentRoutes');
const { updateUserSubscriptions } = require('./controllers/subscriptionController');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Successfully connected to MongoDB.');
}).catch(err => {
  console.error('Connection error', err);
  process.exit();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api', contentRoutes);

// Cron job to handle subscription expiry every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily subscription check...');
  updateUserSubscriptions();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});