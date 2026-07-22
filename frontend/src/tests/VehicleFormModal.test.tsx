import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VehicleFormModal from '../components/VehicleFormModal';
import { Vehicle } from '../types';

describe('VehicleFormModal Component Unit Tests', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  const sampleVehicle: Vehicle = {
    _id: '123',
    make: 'BMW',
    model: 'M3',
    year: 2024,
    price: 75000,
    mileage: 500,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    stock: 2,
    image: 'https://example.com/bmw.jpg',
    description: 'High performance sports sedan.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty form modal when adding new vehicle', async () => {
    render(<VehicleFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /add new vehicle to inventory/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /create vehicle/i })).toBeInTheDocument();
  });

  it('populates form fields when editing an existing vehicle', async () => {
    render(
      <VehicleFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={sampleVehicle}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /edit vehicle details/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/make/i)).toHaveValue('BMW');
      expect(screen.getByLabelText(/model/i)).toHaveValue('M3');
    });

    expect(screen.getByTestId('image-preview-img')).toHaveAttribute('src', 'https://example.com/bmw.jpg');
    expect(screen.getByRole('button', { name: /update vehicle/i })).toBeInTheDocument();
  });

  it('displays validation error messages when required fields are empty', async () => {
    render(<VehicleFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: '' } });

    fireEvent.click(screen.getByTestId('form-submit-btn'));

    await waitFor(() => {
      expect(screen.getByText('Make is required')).toBeInTheDocument();
      expect(screen.getByText('Model is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits valid vehicle form payload', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined);
    render(<VehicleFormModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/make/i), { target: { value: 'Audi' } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: 'RS6' } });
    fireEvent.change(screen.getByLabelText(/year/i), { target: { value: '2024' } });
    fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '120000' } });
    fireEvent.change(screen.getByLabelText(/mileage/i), { target: { value: '150' } });

    fireEvent.click(screen.getByTestId('form-submit-btn'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
