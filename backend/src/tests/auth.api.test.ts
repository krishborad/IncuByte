import request from 'supertest';
import app from '../app';
import { AuthService } from '../services/auth.service';

describe('Auth API Integration Tests (/api/auth)', () => {
  beforeEach(() => {
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
});
