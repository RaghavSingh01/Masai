const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/masai_assignment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use routes
app.use('/', userRoutes);
app.use('/', profileRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(500).json({ error: 'Internal server error', message: error.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
