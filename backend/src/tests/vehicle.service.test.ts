import { VehicleService } from '../services/vehicle.service';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { IVehicle } from '../models/vehicle.model';

describe('VehicleService Unit Tests', () => {
  let vehicleService: VehicleService;
  let mockVehicleRepository: jest.Mocked<VehicleRepository>;

  const sampleVehicleData = {
    make: 'Honda',
    model: 'Civic',
    year: 2024,
    price: 25000,
    mileage: 50,
    fuelType: 'Gasoline' as const,
    transmission: 'CVT' as const,
    stock: 3,
    description: 'Brand new 2024 Honda Civic',
  };

  beforeEach(() => {
    mockVehicleRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<VehicleRepository>;

    vehicleService = new VehicleService(mockVehicleRepository);
  });

  describe('createVehicle', () => {
    it('should successfully create and return a new vehicle', async () => {
      const mockCreatedVehicle = {
        _id: '507f1f77bcf86cd799439022',
        ...sampleVehicleData,
        image: 'https://via.placeholder.com/600x400?text=Car+Image',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      mockVehicleRepository.create.mockResolvedValueOnce(mockCreatedVehicle);

      const result = await vehicleService.createVehicle(sampleVehicleData);

      expect(mockVehicleRepository.create).toHaveBeenCalledWith(sampleVehicleData);
      expect(result).toEqual(mockCreatedVehicle);
      expect(result.make).toBe('Honda');
    });

    it('should throw an error if repository creation fails', async () => {
      const dbError = new Error('Database insertion failed');
      mockVehicleRepository.create.mockRejectedValueOnce(dbError);

      await expect(vehicleService.createVehicle(sampleVehicleData)).rejects.toThrow('Database insertion failed');
    });
  });
});
