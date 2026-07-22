import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';

describe('Database Connection (connectDB & disconnectDB)', () => {
  let connectSpy: jest.SpyInstance;
  let disconnectSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('connectDB', () => {
    it('should successfully connect to MongoDB when a valid URI is provided', async () => {
      const mockConnection = {} as typeof mongoose;
      connectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValueOnce(mockConnection);

      const uri = 'mongodb://localhost:27017/test_db';
      await expect(connectDB(uri)).resolves.toBeDefined();
      expect(connectSpy).toHaveBeenCalledWith(uri);
    });

    it('should fall back to process.env.MONGO_URI when no URI parameter is passed', async () => {
      const mockConnection = {} as typeof mongoose;
      connectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValueOnce(mockConnection);

      process.env.MONGO_URI = 'mongodb://localhost:27017/env_db';
      await expect(connectDB()).resolves.toBeDefined();
      expect(connectSpy).toHaveBeenCalledWith('mongodb://localhost:27017/env_db');
    });

    it('should throw an error if MONGO_URI environment variable is missing and no URI passed', async () => {
      const originalEnv = process.env.MONGO_URI;
      delete process.env.MONGO_URI;

      await expect(connectDB()).rejects.toThrow('MongoDB URI is not defined');

      process.env.MONGO_URI = originalEnv;
    });

    it('should throw an error when mongoose.connect fails (connection failure)', async () => {
      const dbError = new Error('Database connection failed');
      connectSpy = jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(dbError);

      await expect(connectDB('mongodb://invalid-uri')).rejects.toThrow('Database connection failed');
      expect(connectSpy).toHaveBeenCalledWith('mongodb://invalid-uri');
    });
  });

  describe('disconnectDB', () => {
    it('should disconnect from MongoDB successfully', async () => {
      disconnectSpy = jest.spyOn(mongoose, 'disconnect').mockResolvedValueOnce();

      await expect(disconnectDB()).resolves.not.toThrow();
      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should throw an error if mongoose.disconnect fails', async () => {
      const error = new Error('Disconnection error');
      disconnectSpy = jest.spyOn(mongoose, 'disconnect').mockRejectedValueOnce(error);

      await expect(disconnectDB()).rejects.toThrow('Disconnection error');
    });
  });
});
