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

export interface CreateVehiclePayload {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';
  transmission: 'Automatic' | 'Manual' | 'CVT' | 'Dual-Clutch';
  stock?: number;
  image?: string;
  description?: string;
}

export const vehicleService = {
  getVehicles: async (params: VehicleQueryParams = {}): Promise<GetVehiclesResponse> => {
    const response = await api.get<{ success: boolean; data: GetVehiclesResponse }>('/vehicles', {
      params,
    });
    return response.data.data;
  },

  createVehicle: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const response = await api.post<{ success: boolean; data: Vehicle }>('/vehicles', payload);
    return response.data.data;
  },

  updateVehicle: async (id: string, payload: Partial<CreateVehiclePayload>): Promise<Vehicle> => {
    const response = await api.put<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`, payload);
    return response.data.data;
  },

  deleteVehicle: async (id: string): Promise<Vehicle> => {
    const response = await api.delete<{ success: boolean; data: Vehicle }>(`/vehicles/${id}`);
    return response.data.data;
  },

  purchaseVehicle: async (id: string): Promise<Vehicle> => {
    const response = await api.post<{ success: boolean; message: string; data: Vehicle }>(
      `/vehicles/${id}/purchase`,
    );
    return response.data.data;
  },

  restockVehicle: async (id: string, quantity: number): Promise<Vehicle> => {
    const response = await api.post<{ success: boolean; data: Vehicle }>(
      `/vehicles/${id}/restock`,
      { quantity },
    );
    return response.data.data;
  },
};
