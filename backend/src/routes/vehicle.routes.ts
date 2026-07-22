import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { validateVehicle, validateVehicleUpdate } from '../validators/vehicle.validator';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();
const vehicleController = new VehicleController();

// Public: Get all vehicles (with pagination, sorting, filtering)
router.get('/', vehicleController.getVehicles);

// Admin only: Add a new vehicle
router.post('/', authenticate, requireAdmin, validateVehicle, vehicleController.createVehicle);

// Admin only: Update an existing vehicle
router.put('/:id', authenticate, requireAdmin, validateVehicleUpdate, vehicleController.updateVehicle);

export default router;
