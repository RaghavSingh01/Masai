const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');

describe('Auth Integration Tests', () => {

  describe('POST /auth/signup', () => {
    it('should successfully register a new user', async () => {
      const userData = testUtils.createUserData();

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'User created successfully',
        data: {
          user: {
            email: userData.email.toLowerCase(),
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          },
          token: expect.any(String)
        }
      });

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email.toLowerCase());
    });

    it('should return 400 for invalid email', async () => {
      const invalidData = testUtils.createUserData({ email: 'invalid-email' });

      const response = await request(app)
        .post('/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation error',
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'Please enter a valid email'
          })
        ])
      });
    });

    it('should return 400 for short password', async () => {
      const invalidData = testUtils.createUserData({ password: '123' });

      const response = await request(app)
        .post('/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation error',
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'Password must be at least 6 characters long'
          })
        ])
      });
    });

    it('should return 400 for duplicate email', async () => {
      const userData = testUtils.createUserData();

      // Create first user
      await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      // Try to create user with same email
      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'User already exists with this email'
      });
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      const userData = testUtils.createUserData();
      await request(app)
        .post('/auth/signup')
        .send(userData);
    });

    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            email: loginData.email,
            _id: expect.any(String)
          },
          token: expect.any(String)
        }
      });
    });

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Invalid credentials'
      });
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Invalid credentials'
      });
    });

    it('should return 400 for invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation error'
      });
    });
  });

  describe('Protected Routes Authentication', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      // Create user and get auth token
      const userData = testUtils.createUserData();
      const signupResponse = await request(app)
        .post('/auth/signup')
        .send(userData);

      authToken = signupResponse.body.data.token;
      userId = signupResponse.body.data.user._id;
    });

    it('should fail to access protected route without token', async () => {
      const response = await request(app)
        .get('/todos')
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Access token required'
      });
    });

    it('should fail to access protected route with invalid token', async () => {
      const response = await request(app)
        .get('/todos')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Invalid token'
      });
    });

    it('should successfully access protected route with valid token', async () => {
      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'success',
        data: {
          todos: [],
          pagination: expect.any(Object)
        }
      });
    });

    it('should fail with malformed authorization header', async () => {
      const response = await request(app)
        .get('/todos')
        .set('Authorization', authToken) // Missing 'Bearer ' prefix
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Access token required'
      });
    });
  });
});