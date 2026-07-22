import request from 'supertest';
import app from '../app';
import { VehicleService } from '../services/vehicle.service';
import { generateToken } from '../utils/jwt.utils';

describe('Vehicle API Integration Tests (POST /api/vehicles)', () => {
  let adminToken: string;
  let customerToken: string;

  const validVehiclePayload = {
    make: 'BMW',
    model: 'M3',
    year: 2024,
    price: 76000,
    mileage: 10,
    fuelType: 'Gasoline',
    transmission: 'Dual-Clutch',
    stock: 2,
    description: 'High performance sports sedan.',
  };

  beforeEach(() => {
    process.env.JWT_SECRET = 'vehicle_api_test_secret_12345';
    adminToken = generateToken({ userId: 'admin_user_id', role: 'admin' });
    customerToken = generateToken({ userId: 'customer_user_id', role: 'customer' });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should allow admin to create a new vehicle (201 Created)', async () => {
    const mockCreatedVehicle = {
      _id: '507f1f77bcf86cd799439099',
      ...validVehiclePayload,
      image: 'https://via.placeholder.com/600x400?text=Car+Image',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jest.spyOn(VehicleService.prototype, 'createVehicle').mockResolvedValueOnce(mockCreatedVehicle as any);

    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validVehiclePayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.make).toBe('BMW');
    expect(res.body.data.model).toBe('M3');
  });

  it('should deny non-admin users with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(validVehiclePayload);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Admin rights required');
  });

  it('should deny unauthenticated requests with 401 Unauthorized', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .send(validVehiclePayload);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 Bad Request when required vehicle fields are missing', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        make: 'BMW',
        // missing model, year, price, mileage, fuelType, transmission
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 400 Bad Request for negative price or invalid fuelType', async () => {
    const res = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...validVehiclePayload,
        price: -100,
        fuelType: 'InvalidFuel',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });
});
