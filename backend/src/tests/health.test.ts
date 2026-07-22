import request from 'supertest';
import app from '../app';

describe('Health Check & Fallback Route Tests', () => {
  it('GET /api/health returns 200 OK and status UP', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('UP');
    expect(response.body.service).toBe('Car Dealership Inventory API');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('GET /api/non-existent-route returns 404 Not Found', async () => {
    const response = await request(app).get('/api/non-existent-route');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('not found');
  });
});
