import { User } from '../models/user.model';
import { Vehicle } from '../models/vehicle.model';

export const seedInitialData = async (): Promise<void> => {
  try {
    // Seed Default Users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        {
          name: 'Dealership Admin',
          email: 'admin@dealership.com',
          password: 'adminpassword123',
          role: 'admin',
        },
        {
          name: 'John Customer',
          email: 'customer@example.com',
          password: 'customerpassword123',
          role: 'customer',
        },
      ]);
      console.log('Seeded default Admin (admin@dealership.com) and Customer accounts.');
    }

    // Seed Initial Vehicles if empty
    const vehicleCount = await Vehicle.countDocuments({ isDeleted: { $ne: true } });
    if (vehicleCount === 0) {
      await Vehicle.create([
        {
          make: 'BMW',
          model: 'M3 Competition',
          year: 2024,
          price: 75000,
          mileage: 500,
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          stock: 3,
          image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
          description: 'High-performance luxury sports sedan with twin-turbo inline 6 engine.',
        },
        {
          make: 'Tesla',
          model: 'Model S Plaid',
          year: 2023,
          price: 89900,
          mileage: 1200,
          fuelType: 'Electric',
          transmission: 'Automatic',
          stock: 2,
          image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
          description: 'Tri-motor all-wheel drive electric supercar with revolutionary acceleration.',
        },
        {
          make: 'Porsche',
          model: '911 GT3',
          year: 2024,
          price: 182900,
          mileage: 150,
          fuelType: 'Gasoline',
          transmission: 'Dual-Clutch',
          stock: 1,
          image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80',
          description: 'Naturally aspirated 4.0L flat-6 engine precision track machine.',
        },
        {
          make: 'Audi',
          model: 'RS6 Avant',
          year: 2023,
          price: 125000,
          mileage: 3500,
          fuelType: 'Gasoline',
          transmission: 'Automatic',
          stock: 4,
          image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop&q=80',
          description: 'V8 twin-turbo performance wagon combining family utility with supercar speed.',
        },
        {
          make: 'Toyota',
          model: 'RAV4 Hybrid',
          year: 2024,
          price: 34500,
          mileage: 450,
          fuelType: 'Hybrid',
          transmission: 'CVT',
          stock: 8,
          image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
          description: 'Efficient, reliable hybrid compact crossover for daily commuting and adventures.',
        },
        {
          make: 'Ford',
          model: 'F-150 Lightning',
          year: 2023,
          price: 69900,
          mileage: 2800,
          fuelType: 'Electric',
          transmission: 'Automatic',
          stock: 5,
          image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
          description: 'All-electric pickup truck with Mega Power Frunk and Pro Power Onboard.',
        },
      ]);
      console.log('Seeded 6 sample vehicle listings into inventory database.');
    }
  } catch (error) {
    console.warn('Seed data initialization notice:', (error as Error).message);
  }
};
