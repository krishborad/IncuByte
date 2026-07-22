import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AuthContext from '../contexts/AuthContext';

describe('Navbar Component Unit Tests', () => {
  it('renders DriveHub brand logo and guest navigation links when unauthenticated', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('DriveHub')).toBeInTheDocument();
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('renders user greeting, admin badge, and logout button when logged in as admin', () => {
    const mockUser = { id: '1', name: 'Alice Admin', email: 'admin@dealership.com', role: 'admin' as const };

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: mockUser,
            token: 'mock_jwt_token',
            isAuthenticated: true,
            isAdmin: true,
            loading: false,
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('DriveHub')).toBeInTheDocument();
    expect(screen.getByText('Alice Admin')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
