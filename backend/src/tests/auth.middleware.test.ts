import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize, requireAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { generateToken } from '../utils/jwt.utils';

describe('Auth Middleware Unit Tests', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    process.env.JWT_SECRET = 'middleware_test_secret_12345';
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('should attach decoded user payload to req.user and call next() when valid token provided', () => {
      const token = generateToken({ userId: 'user_123', role: 'admin' });
      mockRequest.headers = {
        authorization: `Bearer ${token}`,
      };

      authenticate(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.userId).toBe('user_123');
      expect(mockRequest.user?.role).toBe('admin');
      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should return 401 Unauthorized when Authorization header is missing', () => {
      authenticate(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Access denied. No token provided.',
        }),
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 Unauthorized when Authorization header format is not Bearer', () => {
      mockRequest.headers = {
        authorization: 'Basic token123',
      };

      authenticate(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid token format. Format must be Bearer <token>',
        }),
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 Unauthorized when token is invalid or expired', () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid.jwt.token',
      };

      authenticate(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid or expired token',
        }),
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('authorize / requireAdmin', () => {
    it('should call next() if user role is in allowed roles', () => {
      mockRequest.user = { userId: 'admin_1', role: 'admin' };
      const middleware = authorize('admin', 'dealership_manager');

      middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 Forbidden if user role is not in allowed roles', () => {
      mockRequest.user = { userId: 'user_1', role: 'customer' };
      const middleware = authorize('admin', 'dealership_manager');

      middleware(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Access forbidden. Insufficient permissions.',
        }),
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should allow admin via requireAdmin middleware', () => {
      mockRequest.user = { userId: 'admin_1', role: 'admin' };

      requireAdmin(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should block non-admin via requireAdmin middleware with 403 Forbidden', () => {
      mockRequest.user = { userId: 'sales_1', role: 'salesperson' };

      requireAdmin(mockRequest as AuthenticatedRequest, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Access forbidden. Admin rights required.',
        }),
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});
