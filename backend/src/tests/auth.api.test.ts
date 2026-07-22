import request from 'supertest';
import app from '../app';
import { AuthService } from '../services/auth.service';
import { generateToken } from '../utils/jwt.utils';

describe('Auth API Integration Tests (/api/auth)', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'api_integration_test_secret_12345';
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully (201 Created)', async () => {
      const mockResult = {
        user: {
          id: '507f1f77bcf86cd799439011',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'customer',
          createdAt: new Date(),
        },
        token: 'mocked_jwt_token',
      };

      jest.spyOn(AuthService.prototype, 'register').mockResolvedValueOnce(mockResult);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'Password123!',
          role: 'customer',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mocked_jwt_token');
      expect(res.body.data.user.email).toBe('jane@example.com');
    });

    it('should return 400 Bad Request when registering duplicate email', async () => {
      const duplicateError: any = new Error('Email is already in use');
      duplicateError.statusCode = 400;

      jest.spyOn(AuthService.prototype, 'register').mockRejectedValueOnce(duplicateError);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Clone',
          email: 'jane@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already in use');
    });

    it('should return 400 Bad Request for invalid registration payload (missing name/email/short password)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return JWT token (200 OK)', async () => {
      const mockResult = {
        user: {
          id: '507f1f77bcf86cd799439011',
          name: 'Registered User',
          email: 'user@example.com',
          role: 'customer',
          createdAt: new Date(),
        },
        token: 'mocked_jwt_token',
      };

      jest.spyOn(AuthService.prototype, 'login').mockResolvedValueOnce(mockResult);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'SecretPassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mocked_jwt_token');
      expect(res.body.data.user.email).toBe('user@example.com');
    });

    it('should return 401 Unauthorized for incorrect password', async () => {
      const unauthorizedError: any = new Error('Invalid email or password');
      unauthorizedError.statusCode = 401;

      jest.spyOn(AuthService.prototype, 'login').mockRejectedValueOnce(unauthorizedError);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid email or password');
    });
  });

  describe('GET /api/auth/me (Protected Route)', () => {
    it('should allow access and return user payload when valid JWT is provided', async () => {
      const token = generateToken({ userId: 'user_999', role: 'customer' });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.userId).toBe('user_999');
    });

    it('should reject access (401 Unauthorized) when token is missing', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/admin-only (Admin Protected Route)', () => {
    it('should allow access for admin user (200 OK)', async () => {
      const adminToken = generateToken({ userId: 'admin_1', role: 'admin' });

      const res = await request(app)
        .get('/api/auth/admin-only')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Welcome Admin');
    });

    it('should deny access for non-admin user (403 Forbidden)', async () => {
      const customerToken = generateToken({ userId: 'customer_1', role: 'customer' });

      const res = await request(app)
        .get('/api/auth/admin-only')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Admin rights required');
    });
  });
});
