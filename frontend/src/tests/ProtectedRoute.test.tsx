import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import AdminRoute from '../routes/AdminRoute';
import AuthContext from '../contexts/AuthContext';

describe('Route Guard Unit Tests (ProtectedRoute & AdminRoute)', () => {
  it('redirects unauthenticated user to /login in ProtectedRoute', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
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
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Secret Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page Screen</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret Content')).not.toBeInTheDocument();
  });

  it('allows access to protected content when user is authenticated', () => {
    const mockUser = { id: '1', name: 'John Customer', email: 'john@example.com', role: 'customer' as const };

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthContext.Provider
          value={{
            user: mockUser,
            token: 'mock_token',
            isAuthenticated: true,
            isAdmin: false,
            loading: false,
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Secret Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('redirects non-admin authenticated user to / in AdminRoute', () => {
    const mockUser = { id: '1', name: 'John Customer', email: 'john@example.com', role: 'customer' as const };

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AuthContext.Provider
          value={{
            user: mockUser,
            token: 'mock_token',
            isAuthenticated: true,
            isAdmin: false,
            loading: false,
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <Routes>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <div>Admin Dashboard Content</div>
                </AdminRoute>
              }
            />
            <Route path="/" element={<div>Home Page Screen</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home Page Screen')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard Content')).not.toBeInTheDocument();
  });
});
