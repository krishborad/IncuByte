import mongoose from 'mongoose';
import { Vehicle, IVehicle } from '../models/vehicle.model';

describe('Vehicle Model Unit Tests', () => {
  const validVehicleData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28500,
    mileage: 1500,
    fuelType: 'Hybrid' as const,
    transmission: 'Automatic' as const,
    stock: 5,
    image: 'https://example.com/camry.jpg',
    description: 'Reliable sedan in pristine condition.',
  };

  it('should validate a complete valid vehicle instance', () => {
    const vehicle = new Vehicle(validVehicleData);
    const err = vehicle.validateSync();
    expect(err).toBeUndefined();
    expect(vehicle.make).toBe('Toyota');
    expect(vehicle.model).toBe('Camry');
    expect(vehicle.year).toBe(2023);
    expect(vehicle.price).toBe(28500);
    expect(vehicle.mileage).toBe(1500);
    expect(vehicle.fuelType).toBe('Hybrid');
    expect(vehicle.transmission).toBe('Automatic');
    expect(vehicle.stock).toBe(5);
  });

  it('should default stock to 1 if not provided', () => {
    const dataWithoutStock = { ...validVehicleData };
    delete (dataWithoutStock as any).stock;

    const vehicle = new Vehicle(dataWithoutStock);
    expect(vehicle.stock).toBe(1);
  });

  it('should invalidate vehicle when required fields are missing', () => {
    const vehicle = new Vehicle({});
    const err = vehicle.validateSync();

    expect(err).toBeDefined();
    expect(err?.errors.make).toBeDefined();
    expect(err?.errors.model).toBeDefined();
    expect(err?.errors.year).toBeDefined();
    expect(err?.errors.price).toBeDefined();
    expect(err?.errors.mileage).toBeDefined();
    expect(err?.errors.fuelType).toBeDefined();
    expect(err?.errors.transmission).toBeDefined();
  });

  it('should invalidate negative price or mileage', () => {
    const vehicle = new Vehicle({
      ...validVehicleData,
      price: -500,
      mileage: -10,
    });
    const err = vehicle.validateSync();

    expect(err).toBeDefined();
    expect(err?.errors.price).toBeDefined();
    expect(err?.errors.mileage).toBeDefined();
  });

  it('should invalidate negative stock', () => {
    const vehicle = new Vehicle({
      ...validVehicleData,
      stock: -2,
    });
    const err = vehicle.validateSync();

    expect(err).toBeDefined();
    expect(err?.errors.stock).toBeDefined();
  });

  it('should invalidate invalid year (< 1900 or > current year + 1)', () => {
    const vehicleOld = new Vehicle({
      ...validVehicleData,
      year: 1850,
    });
    const errOld = vehicleOld.validateSync();
    expect(errOld?.errors.year).toBeDefined();

    const futureYear = new Date().getFullYear() + 5;
    const vehicleFuture = new Vehicle({
      ...validVehicleData,
      year: futureYear,
    });
    const errFuture = vehicleFuture.validateSync();
    expect(errFuture?.errors.year).toBeDefined();
  });

  it('should invalidate unsupported fuelType or transmission enum values', () => {
    const vehicle = new Vehicle({
      ...validVehicleData,
      fuelType: 'Water' as any,
      transmission: 'Telepathic' as any,
    });
    const err = vehicle.validateSync();

    expect(err).toBeDefined();
    expect(err?.errors.fuelType).toBeDefined();
    expect(err?.errors.transmission).toBeDefined();
  });
});
