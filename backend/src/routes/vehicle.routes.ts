import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { validateVehicle } from '../validators/vehicle.validator';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const vehicleController = new VehicleController();

// Admin only: Add a new vehicle
router.post('/', authenticate, requireAdmin, validateVehicle, vehicleController.createVehicle);

export default router;
