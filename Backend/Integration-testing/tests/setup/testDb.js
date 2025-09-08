const { connectDB, disconnectDB, clearDB } = require('../../config/database');

// Set test environment
process.env.NODE_ENV = 'test';

// Increase Jest timeout for database operations
jest.setTimeout(10000);

beforeAll(async () => {
  // Connect to test database
  await connectDB();
});

afterAll(async () => {
  // Disconnect from database
  await disconnectDB();
});

beforeEach(async () => {
  // Clear all collections before each test
  await clearDB();
});

// Global test utilities
global.testUtils = {
  // Helper function to create test user data
  createUserData: (overrides = {}) => ({
    email: 'test@example.com',
    password: 'password123',
    ...overrides
  }),

  // Helper function to create test todo data
  createTodoData: (overrides = {}) => ({
    title: 'Test Todo',
    description: 'Test todo description',
    ...overrides
  })
};