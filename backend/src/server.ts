import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';
import { seedInitialData } from './utils/seed';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`🚀 Car Dealership Backend API Server listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', (error as Error).message);
    process.exit(1);
  }
};

startServer();
