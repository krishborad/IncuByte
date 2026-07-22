import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicle.service';
import VehicleCard from '../components/VehicleCard';
import { Vehicle } from '../types';
import { useAuth } from '../hooks/useAuth';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehicles({});
      setVehicles(data.vehicles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicle inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handlePurchase = async (vehicleId: string) => {
    try {
      const updatedVehicle = await vehicleService.purchaseVehicle(vehicleId);
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => (v._id === vehicleId ? updatedVehicle : v)),
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Purchase failed. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase bg-indigo-950/80 border border-indigo-800 px-3 py-1 rounded-full">
            Featured Dealership Inventory
          </span>
          <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl mt-3">
            Find Your Next Vehicle
          </h1>
          <p className="mt-3 text-slate-300 text-base leading-relaxed">
            Browse our complete inventory of pristine cars, trucks, and SUVs. Search specs, check live availability, and purchase online.
          </p>
        </div>
      </div>

      {/* Loading State Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="loading-skeleton">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl h-96 animate-pulse p-4 space-y-4">
              <div className="bg-slate-800 h-44 rounded-xl w-full"></div>
              <div className="bg-slate-800 h-6 rounded w-3/4"></div>
              <div className="bg-slate-800 h-8 rounded w-1/2"></div>
              <div className="bg-slate-800 h-16 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-rose-950/80 border border-rose-800 rounded-2xl p-8 text-center space-y-4 shadow-xl" data-testid="error-state">
          <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-rose-900/50 text-rose-400 mb-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Error Loading Vehicles</h2>
          <p className="text-rose-300 text-sm max-w-md mx-auto">{error}</p>
          <div>
            <button
              onClick={fetchVehicles}
              className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-rose-600/20"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty Inventory State */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3" data-testid="empty-state">
          <h3 className="text-xl font-bold text-white">No Vehicles Available</h3>
          <p className="text-slate-400 text-sm">Check back later or contact dealership management.</p>
        </div>
      )}

      {/* Vehicle Grid */}
      {!loading && !error && vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="vehicle-grid">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
