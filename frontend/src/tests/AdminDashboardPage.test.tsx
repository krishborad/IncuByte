import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import { vehicleService } from '../services/vehicle.service';
import AuthContext from '../contexts/AuthContext';

jest.mock('../services/vehicle.service');

describe('AdminDashboardPage Component Integration Tests', () => {
  const mockVehicles = [
    {
      _id: 'v1',
      make: 'Ford',
      model: 'Mustang',
      year: 2024,
      price: 45000,
      mileage: 100,
      fuelType: 'Gasoline' as const,
      transmission: 'Manual' as const,
      stock: 3,
      image: 'https://example.com/mustang.jpg',
    },
    {
      _id: 'v2',
      make: 'Chevrolet',
      model: 'Corvette',
      year: 2023,
      price: 68000,
      mileage: 200,
      fuelType: 'Gasoline' as const,
      transmission: 'Automatic' as const,
      stock: 0,
      image: 'https://example.com/corvette.jpg',
    },
  ];

  const mockAdminUser = {
    id: 'a1',
    name: 'Admin Boss',
    email: 'admin@dealership.com',
    role: 'admin' as const,
  };

  const renderAdminDashboard = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: mockAdminUser,
            token: 'mock_admin_token',
            isAuthenticated: true,
            isAdmin: true,
            loading: false,
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <AdminDashboardPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders admin statistics summary cards correctly', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue({
      vehicles: mockVehicles,
      pagination: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByTestId('stat-total-vehicles')).toHaveTextContent('2');
    });

    expect(screen.getByTestId('stat-out-of-stock')).toHaveTextContent('1');
    expect(screen.getByTestId('stat-low-stock')).toHaveTextContent('1');
  });

  it('renders vehicle inventory management table rows', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue({
      vehicles: mockVehicles,
      pagination: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByTestId('table-row-v1')).toBeInTheDocument();
      expect(screen.getByTestId('table-row-v2')).toBeInTheDocument();
    });

    expect(screen.getByText('Ford Mustang')).toBeInTheDocument();
    expect(screen.getByText('Chevrolet Corvette')).toBeInTheDocument();
  });

  it('opens add vehicle modal when + Add New Vehicle button is clicked', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue({
      vehicles: mockVehicles,
      pagination: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByTestId('add-vehicle-btn')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('add-vehicle-btn'));

    expect(screen.getByTestId('vehicle-modal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /add new vehicle to inventory/i })).toBeInTheDocument();
  });

  it('opens restock modal and triggers restock API on confirmation', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue({
      vehicles: mockVehicles,
      pagination: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    const mockRestockedVehicle = { ...mockVehicles[1], stock: 10 };
    (vehicleService.restockVehicle as jest.Mock).mockResolvedValue(mockRestockedVehicle);

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByTestId('restock-btn-v2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('restock-btn-v2'));

    expect(screen.getByTestId('restock-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-restock-btn'));

    await waitFor(() => {
      expect(vehicleService.restockVehicle).toHaveBeenCalledWith('v2', 5);
    });
  });

  it('opens delete confirmation modal and soft deletes vehicle on confirmation', async () => {
    (vehicleService.getVehicles as jest.Mock).mockResolvedValue({
      vehicles: mockVehicles,
      pagination: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    (vehicleService.deleteVehicle as jest.Mock).mockResolvedValue(mockVehicles[0]);

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByTestId('delete-btn-v1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('delete-btn-v1'));

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-delete-btn'));

    await waitFor(() => {
      expect(vehicleService.deleteVehicle).toHaveBeenCalledWith('v1');
    });

    await waitFor(() => {
      expect(screen.queryByTestId('table-row-v1')).not.toBeInTheDocument();
    });
  });
});
