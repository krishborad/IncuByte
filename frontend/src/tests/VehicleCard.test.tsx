import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehicleCard from '../components/VehicleCard';
import { Vehicle } from '../types';

describe('VehicleCard Component Unit Tests', () => {
  const sampleVehicle: Vehicle = {
    _id: '507f1f77bcf86cd799439011',
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 28500,
    mileage: 1200,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    stock: 5,
    image: 'https://example.com/camry.jpg',
    description: 'Reliable hybrid sedan.',
  };

  it('renders vehicle information correctly', () => {
    render(<VehicleCard vehicle={sampleVehicle} />);

    expect(screen.getByText('2024 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('$28,500')).toBeInTheDocument();
    expect(screen.getByText('1,200 mi')).toBeInTheDocument();
    expect(screen.getByText('Hybrid')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
    expect(screen.getByText('In Stock (5)')).toBeInTheDocument();
  });

  it('displays Low Stock badge when stock is 3 or less', () => {
    const lowStockVehicle = { ...sampleVehicle, stock: 2 };
    render(<VehicleCard vehicle={lowStockVehicle} />);

    expect(screen.getByText('Only 2 Left')).toBeInTheDocument();
  });

  it('displays Out of Stock badge and disables purchase button when stock is 0', () => {
    const outOfStockVehicle = { ...sampleVehicle, stock: 0 };
    render(<VehicleCard vehicle={outOfStockVehicle} onPurchase={jest.fn()} isAuthenticated={true} />);

    expect(screen.getAllByText('Out of Stock').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
  });

  it('calls onPurchase handler when purchase button is clicked by authenticated user', async () => {
    const mockOnPurchase = jest.fn().mockResolvedValue(undefined);
    render(<VehicleCard vehicle={sampleVehicle} onPurchase={mockOnPurchase} isAuthenticated={true} />);

    const purchaseButton = screen.getByRole('button', { name: /purchase vehicle/i });
    expect(purchaseButton).not.toBeDisabled();

    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(mockOnPurchase).toHaveBeenCalledWith(sampleVehicle._id);
    });
  });
});
