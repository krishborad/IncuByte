import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehicleCard from '../components/VehicleCard';
import { Vehicle } from '../types';

describe('VehicleCard Component & Confirmation Modal Unit Tests', () => {
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
    expect(screen.getByTestId(`purchase-btn-${outOfStockVehicle._id}`)).toBeDisabled();
  });

  it('opens confirmation modal when purchase button is clicked by authenticated user', () => {
    render(<VehicleCard vehicle={sampleVehicle} onPurchase={jest.fn()} isAuthenticated={true} />);

    const purchaseButton = screen.getByTestId(`purchase-btn-${sampleVehicle._id}`);
    fireEvent.click(purchaseButton);

    expect(screen.getByTestId('purchase-modal')).toBeInTheDocument();
    expect(screen.getByText('Confirm Order')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to complete this vehicle purchase? Your account will be charged and 1 unit will be reserved from inventory.')).toBeInTheDocument();
  });

  it('closes confirmation modal when cancel button is clicked', () => {
    render(<VehicleCard vehicle={sampleVehicle} onPurchase={jest.fn()} isAuthenticated={true} />);

    fireEvent.click(screen.getByTestId(`purchase-btn-${sampleVehicle._id}`));
    expect(screen.getByTestId('purchase-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('modal-cancel-btn'));
    expect(screen.queryByTestId('purchase-modal')).not.toBeInTheDocument();
  });

  it('calls onPurchase handler and displays success toast when purchase is confirmed', async () => {
    const mockOnPurchase = jest.fn().mockResolvedValue(undefined);
    render(<VehicleCard vehicle={sampleVehicle} onPurchase={mockOnPurchase} isAuthenticated={true} />);

    fireEvent.click(screen.getByTestId(`purchase-btn-${sampleVehicle._id}`));
    expect(screen.getByTestId('purchase-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('modal-confirm-btn'));

    await waitFor(() => {
      expect(mockOnPurchase).toHaveBeenCalledWith(sampleVehicle._id);
    });

    await waitFor(() => {
      expect(screen.getByTestId('purchase-success-toast')).toBeInTheDocument();
    });
  });
});
