const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const taskRoutes = require('./routes/taskRoutes');

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api', taskRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Task Management System API',
    version: '1.0.0',
    endpoints: {
      'POST /api/tasks': 'Create a new task',
      'GET /api/tasks': 'Get all tasks (with optional filtering)',
      'GET /api/tasks/:id': 'Get a specific task',
      'PATCH /api/tasks/:id': 'Update a task',
      'DELETE /api/tasks': 'Delete tasks by priority (bulk)',
      'DELETE /api/tasks/:id': 'Delete a specific task'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Set port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Task Management System Server is running!`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📚 Available endpoints:`);
  console.log(`   POST   /api/tasks          - Create new task`);
  console.log(`   GET    /api/tasks          - Get all tasks`);
  console.log(`   GET    /api/tasks/:id      - Get task by ID`);
  console.log(`   PATCH  /api/tasks/:id      - Update task`);
  console.log(`   DELETE /api/tasks          - Delete tasks by priority`);
  console.log(`   DELETE /api/tasks/:id      - Delete task by ID`);
  console.log(`\n✨ Ready to manage your tasks!\n`);
});

module.exports = app;
