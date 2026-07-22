import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import AuthContext from '../contexts/AuthContext';

describe('RegisterPage Component Unit & Integration Tests', () => {
  const mockRegister = jest.fn();

  const renderRegisterPage = (registerFn = mockRegister) => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
            login: jest.fn(),
            register: registerFn,
            logout: jest.fn(),
          }}
        >
          <RegisterPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form with all required inputs', () => {
    renderRegisterPage();

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty registration form', async () => {
    renderRegisterPage();

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('submits registration data successfully when form is valid', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    renderRegisterPage();

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Alice Dealer' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'securepassword123' },
    });
    fireEvent.change(screen.getByLabelText(/account type/i), {
      target: { value: 'admin' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Alice Dealer', 'alice@example.com', 'securepassword123', 'admin');
    });
  });
});
