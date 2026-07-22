import { Request, Response, NextFunction } from 'express';

const VALID_FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const VALID_TRANSMISSIONS = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'];
const currentYear = new Date().getFullYear();

export const validateVehicle = (req: Request, res: Response, next: NextFunction): void => {
  const { make, model, year, price, mileage, fuelType, transmission, stock } = req.body;
  const errors: string[] = [];

  if (!make || typeof make !== 'string' || make.trim().length === 0) {
    errors.push('Make is required');
  }

  if (!model || typeof model !== 'string' || model.trim().length === 0) {
    errors.push('Model is required');
  }

  if (year === undefined || typeof year !== 'number' || year < 1900 || year > currentYear + 1) {
    errors.push(`Year is required and must be between 1900 and ${currentYear + 1}`);
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be non-negative');
  }

  if (mileage === undefined || typeof mileage !== 'number' || mileage < 0) {
    errors.push('Mileage is required and must be non-negative');
  }

  if (!fuelType || !VALID_FUEL_TYPES.includes(fuelType)) {
    errors.push(`Fuel type is required and must be one of: ${VALID_FUEL_TYPES.join(', ')}`);
  }

  if (!transmission || !VALID_TRANSMISSIONS.includes(transmission)) {
    errors.push(`Transmission is required and must be one of: ${VALID_TRANSMISSIONS.join(', ')}`);
  }

  if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
    errors.push('Stock must be a non-negative number');
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: 'Vehicle validation failed',
      errors,
    });
    return;
  }

  next();
};
