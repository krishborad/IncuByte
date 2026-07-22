import { Schema, model, Document } from 'mongoose';

export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid';
export type TransmissionType = 'Automatic' | 'Manual' | 'CVT' | 'Dual-Clutch';

export interface IVehicle {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  stock: number;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IVehicleDocument = IVehicle & Document;

const currentYear = new Date().getFullYear();

const VehicleSchema = new Schema<IVehicle>(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be 1900 or later'],
      max: [currentYear + 1, `Year cannot exceed ${currentYear + 1}`],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage must be non-negative'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel Type is required'],
      enum: {
        values: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
        message: '{VALUE} is not a supported fuel type',
      },
    },
    transmission: {
      type: String,
      required: [true, 'Transmission is required'],
      enum: {
        values: ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'],
        message: '{VALUE} is not a supported transmission type',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 1,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/600x400?text=Car+Image',
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

export const Vehicle = model<IVehicle>('Vehicle', VehicleSchema);
