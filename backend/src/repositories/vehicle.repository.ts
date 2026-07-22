import { Vehicle, IVehicle } from '../models/vehicle.model';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  vehicles: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class VehicleRepository {
  async create(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(vehicleData);
    return vehicle.save();
  }

  async findAll(filter: Record<string, any> = {}): Promise<IVehicle[]> {
    return Vehicle.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findAllWithPagination(
    filter: Record<string, any> = {},
    options: PaginationOptions = {},
  ): Promise<PaginatedResult<IVehicle>> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 10));
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const total = await Vehicle.countDocuments(filter);
    const vehicles = await Vehicle.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      vehicles,
      total,
      page,
      limit,
      totalPages,
    };
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
