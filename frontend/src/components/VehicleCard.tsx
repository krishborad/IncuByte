import React, { useState } from 'react';
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase?: (vehicleId: string) => Promise<void>;
  isAuthenticated?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPurchase,
  isAuthenticated = false,
}) => {
  const [buying, setBuying] = useState<boolean>(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.mileage);

  const handlePurchase = async () => {
    if (!onPurchase) return;
    setBuying(true);
    try {
      await onPurchase(vehicle._id);
    } finally {
      setBuying(false);
    }
  };

  const isOutOfStock = vehicle.stock === 0;
  const isLowStock = vehicle.stock > 0 && vehicle.stock <= 3;

  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:border-slate-700 transition-all duration-300 flex flex-col"
      data-testid={`vehicle-card-${vehicle._id}`}
    >
      {/* Vehicle Image Container */}
      <div className="relative h-48 bg-slate-950 overflow-hidden">
        <img
          src={vehicle.image || 'https://via.placeholder.com/600x400?text=Car+Image'}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="bg-rose-950/90 text-rose-300 border border-rose-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/90 text-amber-300 border border-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Only {vehicle.stock} Left
            </span>
          ) : (
            <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              In Stock ({vehicle.stock})
            </span>
          )}
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="text-2xl font-extrabold text-indigo-400">{formattedPrice}</p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div>
            <span className="text-slate-500 block">Mileage</span>
            <span className="font-semibold text-slate-200">{formattedMileage} mi</span>
          </div>
          <div>
            <span className="text-slate-500 block">Fuel Type</span>
            <span className="font-semibold text-slate-200">{vehicle.fuelType}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Transmission</span>
            <span className="font-semibold text-slate-200">{vehicle.transmission}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Stock Qty</span>
            <span className="font-semibold text-slate-200">{vehicle.stock} units</span>
          </div>
        </div>

        {/* Purchase Action Button */}
        {onPurchase && (
          <button
            onClick={handlePurchase}
            disabled={isOutOfStock || buying || !isAuthenticated}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : !isAuthenticated
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
            }`}
          >
            {buying ? (
              <span>Processing...</span>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : !isAuthenticated ? (
              <span>Sign In to Buy</span>
            ) : (
              <span>Purchase Vehicle</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
