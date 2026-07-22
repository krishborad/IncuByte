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
      decreaseStock: jest.fn(),
      softDelete: jest.fn(),
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

  describe('getVehicles (Searching, Filtering & Pagination)', () => {
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

    it('should construct multi-field $or search filter when global search term is provided', async () => {
      mockVehicleRepository.findAllWithPagination.mockResolvedValueOnce({
        vehicles: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      await vehicleService.getVehicles({ search: 'sedan' });

      expect(mockVehicleRepository.findAllWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: [
            { make: { $regex: 'sedan', $options: 'i' } },
            { model: { $regex: 'sedan', $options: 'i' } },
            { description: { $regex: 'sedan', $options: 'i' } },
          ],
        }),
        expect.anything(),
      );
    });
  });

  describe('updateVehicle', () => {
    it('should successfully update and return the vehicle', async () => {
      const vehicleId = '507f1f77bcf86cd799439022';
      const updatePayload = { price: 24000, stock: 5 };
      const updatedVehicle = {
        _id: vehicleId,
        ...sampleVehicleData,
        ...updatePayload,
      } as any;

      mockVehicleRepository.update.mockResolvedValueOnce(updatedVehicle);

      const result = await vehicleService.updateVehicle(vehicleId, updatePayload);

      expect(mockVehicleRepository.update).toHaveBeenCalledWith(vehicleId, updatePayload);
      expect(result).toEqual(updatedVehicle);
      expect(result.price).toBe(24000);
      expect(result.stock).toBe(5);
    });

    it('should throw a 404 error if vehicle to update is not found', async () => {
      const vehicleId = 'non_existent_id';
      mockVehicleRepository.update.mockResolvedValueOnce(null);

      await expect(vehicleService.updateVehicle(vehicleId, { price: 20000 })).rejects.toThrow('Vehicle not found');
    });
  });

  describe('deleteVehicle', () => {
    it('should soft delete and return the vehicle', async () => {
      const vehicleId = '507f1f77bcf86cd799439022';
      const deletedVehicle = {
        _id: vehicleId,
        ...sampleVehicleData,
        isDeleted: true,
      } as any;

      mockVehicleRepository.softDelete.mockResolvedValueOnce(deletedVehicle);

      const result = await vehicleService.deleteVehicle(vehicleId);

      expect(mockVehicleRepository.softDelete).toHaveBeenCalledWith(vehicleId);
      expect(result).toEqual(deletedVehicle);
      expect(result.isDeleted).toBe(true);
    });

    it('should throw a 404 error if vehicle to delete is not found', async () => {
      const vehicleId = 'non_existent_id';
      mockVehicleRepository.softDelete.mockResolvedValueOnce(null);

      await expect(vehicleService.deleteVehicle(vehicleId)).rejects.toThrow('Vehicle not found');
    });
  });

  describe('purchaseVehicle', () => {
    const vehicleId = '507f1f77bcf86cd799439022';

    it('should successfully decrease stock by 1 upon purchase', async () => {
      const purchasedVehicle = {
        _id: vehicleId,
        ...sampleVehicleData,
        stock: 2,
      } as any;

      mockVehicleRepository.findById.mockResolvedValueOnce({
        _id: vehicleId,
        ...sampleVehicleData,
        stock: 3,
      } as any);

      mockVehicleRepository.decreaseStock.mockResolvedValueOnce(purchasedVehicle);

      const result = await vehicleService.purchaseVehicle(vehicleId);

      expect(mockVehicleRepository.decreaseStock).toHaveBeenCalledWith(vehicleId, 1);
      expect(result.stock).toBe(2);
    });

    it('should throw a 400 error when attempting to purchase an out of stock vehicle', async () => {
      mockVehicleRepository.findById.mockResolvedValueOnce({
        _id: vehicleId,
        ...sampleVehicleData,
        stock: 0,
      } as any);

      await expect(vehicleService.purchaseVehicle(vehicleId)).rejects.toThrow('Vehicle is out of stock');
    });

    it('should throw a 404 error when vehicle to purchase does not exist', async () => {
      mockVehicleRepository.findById.mockResolvedValueOnce(null);

      await expect(vehicleService.purchaseVehicle(vehicleId)).rejects.toThrow('Vehicle not found');
    });
  });
});
