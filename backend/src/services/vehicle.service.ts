import { VehicleRepository } from '../repositories/vehicle.repository';
import { IVehicle } from '../models/vehicle.model';

export class VehicleService {
  constructor(private vehicleRepository: VehicleRepository = new VehicleRepository()) {}

  async createVehicle(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    return this.vehicleRepository.create(vehicleData);
  }
}
