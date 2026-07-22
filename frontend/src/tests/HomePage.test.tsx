import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import { vehicleService } from '../services/vehicle.service';
import AuthContext from '../contexts/AuthContext';

jest.mock('../services/vehicle.service');

describe('HomePage Search, Filter & Pagination Component Integration Tests', () => {
  const mockVehiclesPage1 = [
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
  ];

  const mockVehiclesPage2 = [
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

  it('fetches vehicles with search query when user types into search input', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue({
      vehicles: mockVehiclesPage1,
      pagination: { total: 1, page: 1, limit: 6, totalPages: 1 },
    });

    renderHomePage();

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Civic' } });

    await waitFor(() => {
      expect(vehicleService.getVehicles).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Civic' }),
      );
    });
  });

  it('fetches vehicles with fuelType and transmission parameters when filters change', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue({
      vehicles: mockVehiclesPage2,
      pagination: { total: 1, page: 1, limit: 6, totalPages: 1 },
    });

    renderHomePage();

    const fuelSelect = screen.getByTestId('fuel-select');
    fireEvent.change(fuelSelect, { target: { value: 'Electric' } });

    await waitFor(() => {
      expect(vehicleService.getVehicles).toHaveBeenCalledWith(
        expect.objectContaining({ fuelType: 'Electric' }),
      );
    });
  });

  it('handles pagination next and previous button clicks', async () => {
    (vehicleService.getVehicles as jest.Mock)
      .mockResolvedValueOnce({
        vehicles: mockVehiclesPage1,
        pagination: { total: 2, page: 1, limit: 1, totalPages: 2 },
      })
      .mockResolvedValueOnce({
        vehicles: mockVehiclesPage2,
        pagination: { total: 2, page: 2, limit: 1, totalPages: 2 },
      });

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId('next-page-btn')).toBeInTheDocument();
    });

    const nextBtn = screen.getByTestId('next-page-btn');
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(vehicleService.getVehicles).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    });
  });
});
