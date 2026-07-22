import { Vehicle, IVehicle } from '../models/vehicle.model';

export class VehicleRepository {
  async create(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(vehicleData);
    return vehicle.save();
  }

  async findAll(filter: Record<string, any> = {}): Promise<IVehicle[]> {
    return Vehicle.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<IVehicle | null> {
    return Vehicle.findById(id).exec();
  }

  async update(id: string, vehicleData: Partial<IVehicle>): Promise<IVehicle | null> {
    return Vehicle.findByIdAndUpdate(id, vehicleData, { new: true, runValidators: true }).exec();
  }

  async delete(id: string): Promise<IVehicle | null> {
    return Vehicle.findByIdAndDelete(id).exec();
  }
}
