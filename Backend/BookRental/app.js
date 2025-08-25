const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

const app = express();


app.use(express.json());


mongoose.connect('mongodb://localhost:27017/book_rental_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});


app.use('/', userRoutes);
app.use('/', bookRoutes);
app.use('/', rentalRoutes);


app.use((error, req, res, next) => {
  res.status(500).json({ 
    error: 'Internal server error', 
    message: error.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
