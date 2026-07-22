import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    authService = new AuthService(mockUserRepository);
    process.env.JWT_SECRET = 'test_secret_12345';
  });

  describe('register', () => {
    const registerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
      role: 'customer' as const,
    };

    it('should successfully register a new user and return user object with token', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const mockSavedUser = {
        _id: '507f1f77bcf86cd799439011',
        name: registerDto.name,
        email: registerDto.email,
        password: '$2a$10$hashedpassword',
        role: registerDto.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockUserRepository.create.mockResolvedValue(mockSavedUser);

      const result = await authService.register(registerDto);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('john@example.com');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw an error if email is already registered (duplicate email)', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        _id: 'existing_id',
        email: 'john@example.com',
      } as any);

      await expect(authService.register(registerDto)).rejects.toThrow('Email is already in use');
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'john@example.com',
      password: 'Password123!',
    };

    it('should successfully authenticate user with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'customer',
        comparePassword: jest.fn().mockResolvedValue(true),
      } as any;

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.login(loginDto);

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('john@example.com');
    });

    it('should throw an error for non-existent user email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw an error for incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'customer',
        comparePassword: jest.fn().mockResolvedValue(false),
      } as any;

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(loginDto)).rejects.toThrow('Invalid email or password');
    });
  });
});
