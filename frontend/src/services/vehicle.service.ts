import api from './api';
import { GetVehiclesResponse, Vehicle } from '../types';

export interface VehicleQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
}

export const vehicleService = {
  getVehicles: async (params: VehicleQueryParams = {}): Promise<GetVehiclesResponse> => {
    const response = await api.get<{ success: boolean; data: GetVehiclesResponse }>('/vehicles', {
      params,
    });
    return response.data.data;
  },

  purchaseVehicle: async (id: string): Promise<Vehicle> => {
    const response = await api.post<{ success: boolean; message: string; data: Vehicle }>(
      `/vehicles/${id}/purchase`,
    );
    return response.data.data;
  },
};
