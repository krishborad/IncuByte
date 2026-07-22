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
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const formattedMileage = new Intl.NumberFormat('en-US').format(vehicle.mileage);

  const handleOpenConfirm = () => {
    if (!isAuthenticated || vehicle.stock === 0) return;
    setShowConfirmModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!onPurchase) return;
    setBuying(true);
    try {
      await onPurchase(vehicle._id);
      setShowConfirmModal(false);
      setPurchaseSuccess(true);
      setTimeout(() => setPurchaseSuccess(false), 4000);
    } catch {
      // Error handled by parent or alert
    } finally {
      setBuying(false);
    }
  };

  const isOutOfStock = vehicle.stock === 0;
  const isLowStock = vehicle.stock > 0 && vehicle.stock <= 3;

  return (
    <>
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:border-slate-700 transition-all duration-300 flex flex-col relative"
        data-testid={`vehicle-card-${vehicle._id}`}
      >
        {/* Success Alert Overlay Toast */}
        {purchaseSuccess && (
          <div
            className="absolute top-3 left-3 right-3 z-20 bg-emerald-950/95 border border-emerald-700 text-emerald-200 text-xs font-semibold p-3 rounded-xl shadow-xl flex items-center justify-between animate-fade-in"
            data-testid="purchase-success-toast"
          >
            <span>🎉 Purchase successful! Inventory updated.</span>
            <button
              onClick={() => setPurchaseSuccess(false)}
              className="text-emerald-400 hover:text-emerald-200 ml-2"
            >
              ✕
            </button>
          </div>
        )}

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
              onClick={handleOpenConfirm}
              disabled={isOutOfStock || !isAuthenticated}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2 ${
                isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : !isAuthenticated
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              }`}
              data-testid={`purchase-btn-${vehicle._id}`}
            >
              {isOutOfStock ? (
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in"
          data-testid="purchase-modal"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800 px-2.5 py-0.5 rounded-full">
                  Confirm Order
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">Purchase Vehicle</h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-white p-1"
                data-testid="modal-close-btn"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
              <p className="text-white font-semibold text-lg">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Price:</span>
                <span className="text-indigo-400 font-extrabold">{formattedPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current Stock:</span>
                <span className="text-slate-200 font-semibold">{vehicle.stock} remaining</span>
              </div>
            </div>

            <p className="text-slate-300 text-sm">
              Are you sure you want to complete this vehicle purchase? Your account will be charged and 1 unit will be reserved from inventory.
            </p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={buying}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-colors"
                data-testid="modal-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={buying}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
                data-testid="modal-confirm-btn"
              >
                {buying ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm Purchase</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleCard;
