import { Vehicle, IVehicle } from '../models/vehicle.model';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class VehicleRepository {
  async create(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(vehicleData);
    return vehicle.save();
  }

  async findById(id: string): Promise<IVehicle | null> {
    return Vehicle.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
  }

  async findAll(filter: Record<string, any> = {}): Promise<IVehicle[]> {
    const activeFilter = { ...filter, isDeleted: { $ne: true } };
    return Vehicle.find(activeFilter).exec();
  }

  async findAllWithPagination(
    filter: Record<string, any> = {},
    options: PaginationOptions,
  ): Promise<{ vehicles: IVehicle[]; total: number; page: number; limit: number; totalPages: number }> {
    const activeFilter = { ...filter, isDeleted: { $ne: true } };
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const [vehicles, total] = await Promise.all([
      Vehicle.find(activeFilter).sort(sort).skip(skip).limit(limit).exec(),
      Vehicle.countDocuments(activeFilter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      vehicles,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(id: string, vehicleData: Partial<IVehicle>): Promise<IVehicle | null> {
    return Vehicle.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, vehicleData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async decreaseStock(id: string, quantity: number = 1): Promise<IVehicle | null> {
    return Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true }, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true },
    ).exec();
  }

  async softDelete(id: string): Promise<IVehicle | null> {
    return Vehicle.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true },
    ).exec();
  }

  async delete(id: string): Promise<IVehicle | null> {
    return Vehicle.findByIdAndDelete(id).exec();
  }
}
