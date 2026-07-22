import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import { vehicleService } from '../services/vehicle.service';
import AuthContext from '../contexts/AuthContext';

jest.mock('../services/vehicle.service');

describe('HomePage Vehicle Dashboard Component Integration Tests', () => {
  const mockVehicles = [
    {
      _id: '1',
      make: 'Honda',
      model: 'Civic',
      year: 2024,
      price: 25000,
      mileage: 500,
      fuelType: 'Gasoline' as const,
      transmission: 'CVT' as const,
      stock: 4,
    },
    {
      _id: '2',
      make: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 42000,
      mileage: 3000,
      fuelType: 'Electric' as const,
      transmission: 'Automatic' as const,
      stock: 2,
    },
  ];

  const renderHomePage = () => {
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
            register: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <HomePage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading skeleton initial state while fetching vehicles', () => {
    (vehicleService.getVehicles as jest.Mock).mockReturnValue(new Promise(() => {}));
    renderHomePage();

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders vehicle cards grid after successful API fetch', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValueOnce({
      vehicles: mockVehicles,
      pagination: { total: 2, page: 1, limit: 10, totalPages: 1 },
    });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId('vehicle-grid')).toBeInTheDocument();
    });

    expect(screen.getByText('2024 Honda Civic')).toBeInTheDocument();
    expect(screen.getByText('2023 Tesla Model 3')).toBeInTheDocument();
  });

  it('displays error state with retry button when API fails', async () => {
    (vehicleService.getVehicles as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch inventory from server' } },
    });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    expect(screen.getByText('Error Loading Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch inventory from server')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
