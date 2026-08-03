const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server'); 

describe('Auth Endpoints API Tests', () => {
  // Generate a dynamic email so re-running tests won't hit "Email already exists" duplicate errors
  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  };

  // Close open database connections after all tests in this file finish
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // --- SIGNUP TESTS ---
  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(response.statusCode).toBe(201); // or 200 depending on your controller
      expect(response.body).toHaveProperty('token');
    });

    it('should fail if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Incomplete User' });

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  // --- LOGIN TESTS ---
  describe('POST /api/auth/login', () => {
    it('should authenticate user and return a JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should revoke a valid token and confirm logout', async () => {
      const token = jwt.sign({ id: 'test-user-id' }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/logout successful/i);
    });

    it('should reject a missing or invalid token on logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
    });
  });
});