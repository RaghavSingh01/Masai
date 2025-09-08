const request = require('supertest');
const app = require('../../app');
const Todo = require('../../models/Todo');
const User = require('../../models/User');

describe('Todos Integration Tests', () => {
  let authToken;
  let userId;
  let otherUserToken;
  let otherUserId;

  beforeEach(async () => {
    // Create test user and get auth token
    const userData = testUtils.createUserData();
    const signupResponse = await request(app)
      .post('/auth/signup')
      .send(userData);

    authToken = signupResponse.body.data.token;
    userId = signupResponse.body.data.user._id;

    // Create another user for access control tests
    const otherUserData = testUtils.createUserData({ email: 'other@example.com' });
    const otherSignupResponse = await request(app)
      .post('/auth/signup')
      .send(otherUserData);

    otherUserToken = otherSignupResponse.body.data.token;
    otherUserId = otherSignupResponse.body.data.user._id;
  });

  describe('POST /todos - Create Todo', () => {
    it('should create a new todo with valid token', async () => {
      const todoData = testUtils.createTodoData();

      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Todo created successfully',
        data: {
          todo: {
            title: todoData.title,
            description: todoData.description,
            status: 'pending',
            user: userId,
            _id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          }
        }
      });

      // Verify todo was saved to database
      const savedTodo = await Todo.findById(response.body.data.todo._id);
      expect(savedTodo).toBeTruthy();
      expect(savedTodo.user.toString()).toBe(userId);
    });

    it('should return 400 for missing title', async () => {
      const invalidData = { description: 'Test description' };

      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation error',
        errors: expect.arrayContaining([
          expect.objectContaining({
            msg: 'Title is required'
          })
        ])
      });
    });

    it('should return 400 for title exceeding character limit', async () => {
      const invalidData = testUtils.createTodoData({
        title: 'a'.repeat(101) // Exceeds 100 character limit
      });

      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation error'
      });
    });

    it('should fail without authentication token', async () => {
      const todoData = testUtils.createTodoData();

      const response = await request(app)
        .post('/todos')
        .send(todoData)
        .expect(401);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Access token required'
      });
    });
  });

  describe('GET /todos - Get All Todos', () => {
    beforeEach(async () => {
      // Create test todos for the authenticated user
      await Todo.create({
        title: 'Todo 1',
        description: 'First todo',
        user: userId
      });
      await Todo.create({
        title: 'Todo 2',
        description: 'Second todo',
        status: 'completed',
        user: userId
      });

      // Create a todo for another user (should not appear in results)
      await Todo.create({
        title: 'Other User Todo',
        user: otherUserId
      });
    });

    it('should get all todos for logged in user', async () => {
      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'success',
        data: {
          todos: expect.arrayContaining([
            expect.objectContaining({
              title: 'Todo 1',
              user: userId
            }),
            expect.objectContaining({
              title: 'Todo 2',
              user: userId
            })
          ]),
          pagination: {
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1
          }
        }
      });

      // Should only return todos for the authenticated user
      expect(response.body.data.todos).toHaveLength(2);
      expect(response.body.data.todos.every(todo => todo.user === userId)).toBe(true);
    });

    it('should filter todos by status', async () => {
      const response = await request(app)
        .get('/todos?status=completed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.todos).toHaveLength(1);
      expect(response.body.data.todos[0]).toMatchObject({
        title: 'Todo 2',
        status: 'completed'
      });
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/todos?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.todos).toHaveLength(1);
      expect(response.body.data.pagination).toMatchObject({
        total: 2,
        page: 1,
        limit: 1,
        totalPages: 2
      });
    });
  });

  describe('GET /todos/:id - Get Single Todo', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        description: 'Test description',
        user: userId
      });
      todoId = todo._id.toString();
    });

    it('should get a specific todo', async () => {
      const response = await request(app)
        .get(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'success',
        data: {
          todo: {
            _id: todoId,
            title: 'Test Todo',
            description: 'Test description',
            user: userId
          }
        }
      });
    });

    it('should return 404 for non-existent todo', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Todo not found'
      });
    });

    it('should not allow access to other user\'s todo', async () => {
      const response = await request(app)
        .get(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Todo not found'
      });
    });
  });

  describe('PUT /todos/:id - Update Todo', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Original Title',
        description: 'Original description',
        user: userId
      });
      todoId = todo._id.toString();
    });

    it('should update a specific todo (ensure only owner can update)', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
        status: 'completed'
      };

      const response = await request(app)
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Todo updated successfully',
        data: {
          todo: {
            _id: todoId,
            title: 'Updated Title',
            description: 'Updated description',
            status: 'completed',
            user: userId
          }
        }
      });

      // Verify update in database
      const updatedTodo = await Todo.findById(todoId);
      expect(updatedTodo.title).toBe('Updated Title');
      expect(updatedTodo.status).toBe('completed');
    });

    it('should return 404 for non-existent todo', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .put(`/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Todo not found'
      });
    });

    it('should not allow updating other user\'s todo', async () => {
      const response = await request(app)
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ title: 'Hacked title' })
        .expect(404);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Todo not found'
      });

      // Verify original todo was not modified
      const originalTodo = await Todo.findById(todoId);
      expect(originalTodo.title).toBe('Original Title');
    });

    it('should validate status field', async () => {
      const response = await request(app)
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Validation error'
      });
    });
  });

  describe('DELETE /todos/:id - Delete Todo', () => {
    let todoId;

    beforeEach(async () => {
      const todo = await Todo.create({
        title: 'Todo to Delete',
        user: userId
      });
      todoId = todo._id.toString();
    });

    it('should delete a specific todo', async () => {
      const response = await request(app)
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'success',
        message: 'Todo deleted successfully'
      });

      // Verify todo was deleted from database
      const deletedTodo = await Todo.findById(todoId);
      expect(deletedTodo).toBeNull();
    });

    it('should return 404 for non-existent todo', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Todo not found'
      });
    });

    it('should not allow deleting other user\'s todo', async () => {
      const response = await request(app)
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        status: 'error',
        message: 'Todo not found'
      });

      // Verify todo still exists in database
      const existingTodo = await Todo.findById(todoId);
      expect(existingTodo).toBeTruthy();
    });
  });

  describe('Access Control Tests', () => {
    it('should fail for unauthenticated user trying to access todos', async () => {
      const endpoints = [
        { method: 'get', path: '/todos' },
        { method: 'post', path: '/todos' },
        { method: 'get', path: '/todos/507f1f77bcf86cd799439011' },
        { method: 'put', path: '/todos/507f1f77bcf86cd799439011' },
        { method: 'delete', path: '/todos/507f1f77bcf86cd799439011' }
      ];

      for (const endpoint of endpoints) {
        const response = await request(app)[endpoint.method](endpoint.path)
          .send({})
          .expect(401);

        expect(response.body).toMatchObject({
          status: 'error',
          message: 'Access token required'
        });
      }
    });

    it('should fail if trying to update/delete other\'s todos', async () => {
      // Create todo for first user
      const todo = await Todo.create({
        title: 'User 1 Todo',
        user: userId
      });

      // Try to access with second user's token
      const updateResponse = await request(app)
        .put(`/todos/${todo._id}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ title: 'Hacked' })
        .expect(404);

      const deleteResponse = await request(app)
        .delete(`/todos/${todo._id}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .expect(404);

      // Both should fail with 404 (not 403) for security reasons
      expect(updateResponse.body.message).toBe('Todo not found');
      expect(deleteResponse.body.message).toBe('Todo not found');
    });
  });
});