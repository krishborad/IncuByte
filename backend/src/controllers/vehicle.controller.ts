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

  getVehicles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.vehicleService.getVehicles(req.query);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updateVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vehicle = await this.vehicleService.updateVehicle(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.vehicleService.deleteVehicle(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  purchaseVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const vehicle = await this.vehicleService.purchaseVehicle(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Vehicle purchased successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };

  restockVehicle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const quantity = Number(req.body.quantity);
      const vehicle = await this.vehicleService.restockVehicle(req.params.id, quantity);
      res.status(200).json({
        success: true,
        message: 'Vehicle restocked successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  };
}
