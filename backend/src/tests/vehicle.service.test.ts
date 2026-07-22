import { VehicleService } from '../services/vehicle.service';
import { VehicleRepository } from '../repositories/vehicle.repository';

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
      findAllWithPagination: jest.fn(),
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

  describe('getVehicles', () => {
    it('should return paginated vehicle list and metadata with default page and limit', async () => {
      const mockVehicles = [
        { _id: '1', make: 'Toyota', model: 'Camry', price: 28000 },
        { _id: '2', make: 'Honda', model: 'Accord', price: 29000 },
      ] as any[];

      mockVehicleRepository.findAllWithPagination.mockResolvedValueOnce({
        vehicles: mockVehicles,
        total: 12,
        page: 1,
        limit: 10,
        totalPages: 2,
      });

      const result = await vehicleService.getVehicles({});

      expect(mockVehicleRepository.findAllWithPagination).toHaveBeenCalled();
      expect(result.vehicles).toHaveLength(2);
      expect(result.pagination).toEqual({
        total: 12,
        page: 1,
        limit: 10,
        totalPages: 2,
      });
    });

    it('should pass filtering and sorting query options to repository', async () => {
      mockVehicleRepository.findAllWithPagination.mockResolvedValueOnce({
        vehicles: [],
        total: 0,
        page: 2,
        limit: 5,
        totalPages: 0,
      });

      const queryParams = {
        page: '2',
        limit: '5',
        sortBy: 'price',
        sortOrder: 'asc' as const,
        make: 'BMW',
        minPrice: '30000',
        maxPrice: '80000',
        fuelType: 'Hybrid',
      };

      await vehicleService.getVehicles(queryParams as any);

      expect(mockVehicleRepository.findAllWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          make: expect.any(Object),
          price: { $gte: 30000, $lte: 80000 },
          fuelType: 'Hybrid',
        }),
        {
          page: 2,
          limit: 5,
          sortBy: 'price',
          sortOrder: 'asc',
        },
      );
    });
  });
});
