import api from './api';
import { User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthApiResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthApiResponse> => {
    const response = await api.post<AuthApiResponse>('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthApiResponse> => {
    const response = await api.post<AuthApiResponse>('/auth/register', payload);
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
