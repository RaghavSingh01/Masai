const app = require('./app');
const connectDB = require('./config/database');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception! Shutting down...');
  console.error('Error:', err.name, err.message);
  process.exit(1);
});


connectDB();


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
📡 Listening on port ${PORT}
🌐 Local URL: http://localhost:${PORT}
📚 API Documentation: http://localhost:${PORT}
🏥 Health Check: http://localhost:${PORT}/health
  `);
});


process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection! Shutting down...');
  console.error('Error:', err.name, err.message);
  
  server.close(() => {
    process.exit(1);
  });
});


process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});


process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
    process.exit(0);
  });
});

module.exports = server;