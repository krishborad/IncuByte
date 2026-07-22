import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB Atlas / MongoDB instance.
 * @param uri Optional MongoDB connection URI string. Defaults to process.env.MONGO_URI.
 */
export const connectDB = async (uri?: string): Promise<typeof mongoose> => {
  const connectionUri = uri || process.env.MONGO_URI;

  if (!connectionUri) {
    throw new Error('MongoDB URI is not defined');
  }

  try {
    const conn = await mongoose.connect(connectionUri);
    const host = conn?.connection?.host || 'Atlas/Local';
    if (process.env.NODE_ENV !== 'test') {
      console.log(`MongoDB Connected: ${host}`);
    }
    return conn;
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`MongoDB Connection Error: ${(error as Error).message}`);
    }
    throw error;
  }
};

/**
 * Disconnects from the current MongoDB connection.
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB Disconnected successfully.');
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`MongoDB Disconnection Error: ${(error as Error).message}`);
    }
    throw error;
  }
};
