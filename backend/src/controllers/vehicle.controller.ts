import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';

export class VehicleController {
  constructor(private vehicleService: VehicleService = new VehicleService()) {}

  createVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vehicle = await this.vehicleService.createVehicle(req.body);
      res.status(201).json({
        success: true,
        message: 'Vehicle created successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };
}
