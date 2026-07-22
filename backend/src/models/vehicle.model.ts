import mongoose, { Schema, Document } from 'mongoose';

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
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IVehicleDocument = IVehicle & Document;

const currentYear = new Date().getFullYear();

const VehicleSchema: Schema = new Schema(
  {
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Vehicle manufacture year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [currentYear + 1, `Year cannot exceed ${currentYear + 1}`],
    },
    price: {
      type: Number,
      required: [true, 'Vehicle price is required'],
      min: [0, 'Price must be non-negative'],
    },
    mileage: {
      type: Number,
      required: [true, 'Vehicle mileage is required'],
      min: [0, 'Mileage must be non-negative'],
    },
    fuelType: {
      type: String,
      required: [true, 'Vehicle fuel type is required'],
      enum: {
        values: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'],
        message: '{VALUE} is not a supported fuel type',
      },
    },
    transmission: {
      type: String,
      required: [true, 'Vehicle transmission is required'],
      enum: {
        values: ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'],
        message: '{VALUE} is not a supported transmission type',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Vehicle stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 1,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/600x400?text=Car+Image',
    },
    description: {
      type: String,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Vehicle = mongoose.model<IVehicleDocument>('Vehicle', VehicleSchema);
