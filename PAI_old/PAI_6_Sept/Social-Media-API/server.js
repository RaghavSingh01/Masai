const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config/config');

connectDB();

process.on('uncaughtException', (err) => {
  console.log('Error!');
  console.log(err.name, err.message);
  process.exit(1);
});

const port = config.port || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated!');
  });
});
