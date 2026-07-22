import { UserRepository } from '../repositories/user.repository';
import { generateToken } from '../utils/jwt.utils';
import { IUser } from '../models/user.model';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'dealership_manager' | 'salesperson' | 'customer';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };
  token: string;
}

export class AuthService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      const error = new Error('Email is already in use');
      (error as any).statusCode = 400;
      throw error;
    }

    const newUser = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role || 'customer',
    });

    const token = generateToken({
      userId: newUser._id.toString(),
      role: newUser.role,
    });

    return {
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
      token,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email, true);
    if (!user) {
      const error = new Error('Invalid email or password');
      (error as any).statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      (error as any).statusCode = 401;
      throw error;
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}
