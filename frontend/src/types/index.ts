export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'dealership_manager' | 'salesperson' | 'customer';
  createdAt?: string;
}

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';
  transmission: 'Automatic' | 'Manual' | 'CVT' | 'Dual-Clutch';
  stock: number;
  image?: string;
  description?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetVehiclesResponse {
  vehicles: Vehicle[];
  pagination: Pagination;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}
