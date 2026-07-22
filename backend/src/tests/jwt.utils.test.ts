import { generateToken, verifyToken } from '../utils/jwt.utils';

describe('JWT Utilities (generateToken & verifyToken)', () => {
  const userId = '507f1f77bcf86cd799439011';
  const role = 'user';

  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_key_12345';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  it('should generate a valid JWT token', () => {
    const token = generateToken({ userId, role });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  it('should verify and decode a valid JWT token', () => {
    const token = generateToken({ userId, role });
    const decoded = verifyToken(token);
    expect(decoded).toBeDefined();
    expect(decoded.userId).toBe(userId);
    expect(decoded.role).toBe(role);
  });

  it('should throw an error when verifying an invalid token', () => {
    expect(() => verifyToken('invalid.token.string')).toThrow();
  });

  it('should throw an error if JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    expect(() => generateToken({ userId, role })).toThrow('JWT_SECRET is not configured');
  });
});
