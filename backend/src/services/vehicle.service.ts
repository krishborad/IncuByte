import { VehicleRepository } from '../repositories/vehicle.repository';
import { IVehicle } from '../models/vehicle.model';

export interface VehicleQueryOptions {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  q?: string;
  make?: string;
  model?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  minYear?: string | number;
  maxYear?: string | number;
  fuelType?: string;
  transmission?: string;
}

export interface GetVehiclesResponse {
  vehicles: IVehicle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class VehicleService {
  constructor(private vehicleRepository: VehicleRepository = new VehicleRepository()) {}

  async createVehicle(vehicleData: Partial<IVehicle>): Promise<IVehicle> {
    return this.vehicleRepository.create(vehicleData);
  }

  async getVehicles(query: VehicleQueryOptions): Promise<GetVehiclesResponse> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    const filter: Record<string, any> = {};

    const searchTerm = query.search || query.q;
    if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim().length > 0) {
      const searchRegex = { $regex: searchTerm.trim(), $options: 'i' };
      filter.$or = [
        { make: searchRegex },
        { model: searchRegex },
        { description: searchRegex },
      ];
    }

    if (query.make) {
      filter.make = { $regex: query.make, $options: 'i' };
    }

    if (query.model) {
      filter.model = { $regex: query.model, $options: 'i' };
    }

    if (query.fuelType) {
      filter.fuelType = query.fuelType;
    }

    if (query.transmission) {
      filter.transmission = query.transmission;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined && !isNaN(Number(query.minPrice))) {
        filter.price.$gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined && !isNaN(Number(query.maxPrice))) {
        filter.price.$lte = Number(query.maxPrice);
      }
    }

    if (query.minYear !== undefined || query.maxYear !== undefined) {
      filter.year = {};
      if (query.minYear !== undefined && !isNaN(Number(query.minYear))) {
        filter.year.$gte = Number(query.minYear);
      }
      if (query.maxYear !== undefined && !isNaN(Number(query.maxYear))) {
        filter.year.$lte = Number(query.maxYear);
      }
    }

    const result = await this.vehicleRepository.findAllWithPagination(filter, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return {
      vehicles: result.vehicles,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async updateVehicle(id: string, updateData: Partial<IVehicle>): Promise<IVehicle> {
    const updatedVehicle = await this.vehicleRepository.update(id, updateData);
    if (!updatedVehicle) {
      const error: any = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<IVehicle> {
    const deletedVehicle = await this.vehicleRepository.softDelete(id);
    if (!deletedVehicle) {
      const error: any = new Error('Vehicle not found');
      error.statusCode = 404;
      throw error;
    }
    return deletedVehicle;
  }
}
