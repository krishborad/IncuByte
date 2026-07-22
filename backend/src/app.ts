import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.use(errorHandler);

export default app;
