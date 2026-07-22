import React, { useState, useEffect, useCallback } from 'react';
import { vehicleService, CreateVehiclePayload } from '../services/vehicle.service';
import VehicleFormModal from '../components/VehicleFormModal';
import { Vehicle } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [showVehicleModal, setShowVehicleModal] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [showRestockModal, setShowRestockModal] = useState<boolean>(false);
  const [restockVehicleItem, setRestockVehicleItem] = useState<Vehicle | null>(null);
  const [restockQty, setRestockQty] = useState<number>(5);

  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleService.getVehicles({ limit: 100 });
      setVehicles(data.vehicles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load inventory for admin dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Stats calculation
  const totalVehicles = vehicles.length;
  const totalValuation = vehicles.reduce((sum, v) => sum + v.price * v.stock, 0);
  const outOfStockCount = vehicles.filter((v) => v.stock === 0).length;
  const lowStockCount = vehicles.filter((v) => v.stock > 0 && v.stock <= 3).length;

  const handleOpenCreateModal = () => {
    setEditingVehicle(null);
    setShowVehicleModal(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowVehicleModal(true);
  };

  const handleSaveVehicle = async (data: CreateVehiclePayload) => {
    setActionLoading(true);
    try {
      if (editingVehicle) {
        const updated = await vehicleService.updateVehicle(editingVehicle._id, data);
        setVehicles((prev) => prev.map((v) => (v._id === editingVehicle._id ? updated : v)));
      } else {
        const created = await vehicleService.createVehicle(data);
        setVehicles((prev) => [created, ...prev]);
      }
      setShowVehicleModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save vehicle details.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    setActionLoading(true);
    try {
      await vehicleService.deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      setDeletingVehicleId(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete vehicle.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRestockModal = (vehicle: Vehicle) => {
    setRestockVehicleItem(vehicle);
    setRestockQty(5);
    setShowRestockModal(true);
  };

  const handleConfirmRestock = async () => {
    if (!restockVehicleItem || restockQty <= 0) return;
    setActionLoading(true);
    try {
      const restocked = await vehicleService.restockVehicle(restockVehicleItem._id, restockQty);
      setVehicles((prev) => prev.map((v) => (v._id === restockVehicleItem._id ? restocked : v)));
      setShowRestockModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to restock vehicle inventory.');
    } finally {
      setActionLoading(false);
    }
  };

  const formattedCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8" data-testid="admin-dashboard-container">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl gap-4">
        <div>
          <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase bg-indigo-950/80 border border-indigo-800 px-3 py-1 rounded-full">
            Admin Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Dealership Inventory Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage vehicles, add stock, update pricing, and monitor sales stats.</p>
        </div>
        <div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
            data-testid="add-vehicle-btn"
          >
            <span>+ Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-grid">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Listings</p>
          <p className="text-3xl font-black text-white mt-2" data-testid="stat-total-vehicles">{totalVehicles}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Inventory Value</p>
          <p className="text-3xl font-black text-indigo-400 mt-2" data-testid="stat-total-valuation">{formattedCurrency(totalValuation)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Out of Stock</p>
          <p className="text-3xl font-black text-rose-400 mt-2" data-testid="stat-out-of-stock">{outOfStockCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Low Stock (≤3)</p>
          <p className="text-3xl font-black text-amber-400 mt-2" data-testid="stat-low-stock">{lowStockCount}</p>
        </div>
      </div>

      {/* Inventory Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Vehicle Inventory Management</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400" data-testid="admin-loading">
            Loading inventory database...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-400">{error}</div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 text-center text-slate-400" data-testid="admin-empty">
            No vehicles registered yet. Click "+ Add New Vehicle" above to add your first vehicle listing.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Year</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Mileage</th>
                  <th className="px-6 py-4">Specs</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60" data-testid="inventory-table-body">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-800/40 transition-colors" data-testid={`table-row-${v._id}`}>
                    <td className="px-6 py-4 font-semibold text-white flex items-center space-x-3">
                      <img
                        src={v.image || 'https://via.placeholder.com/150'}
                        alt={v.model}
                        className="w-12 h-12 object-cover rounded-xl bg-slate-950 border border-slate-800"
                      />
                      <div>
                        <div>{v.make} {v.model}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{v.year}</td>
                    <td className="px-6 py-4 font-bold text-indigo-400">{formattedCurrency(v.price)}</td>
                    <td className="px-6 py-4">{v.mileage.toLocaleString()} mi</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <div>{v.fuelType}</div>
                      <div>{v.transmission}</div>
                    </td>
                    <td className="px-6 py-4">
                      {v.stock === 0 ? (
                        <span className="bg-rose-950 text-rose-300 border border-rose-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                          0 (Out)
                        </span>
                      ) : (
                        <span className="bg-slate-950 text-slate-200 border border-slate-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                          {v.stock} units
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenRestockModal(v)}
                        className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        data-testid={`restock-btn-${v._id}`}
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(v)}
                        className="bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        data-testid={`edit-btn-${v._id}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingVehicleId(v._id)}
                        className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        data-testid={`delete-btn-${v._id}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicle Add / Edit Form Modal */}
      <VehicleFormModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSubmit={handleSaveVehicle}
        initialData={editingVehicle}
        loading={actionLoading}
      />

      {/* Restock Inventory Modal */}
      {showRestockModal && restockVehicleItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" data-testid="restock-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  Inventory Restock
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">Restock Vehicle</h3>
              </div>
              <button onClick={() => setShowRestockModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <p className="text-slate-300 text-sm">
              Increase stock count for <strong className="text-white">{restockVehicleItem.year} {restockVehicleItem.make} {restockVehicleItem.model}</strong> (Current Stock: {restockVehicleItem.stock} units).
            </p>

            <div>
              <label htmlFor="restock-qty" className="block text-xs font-medium text-slate-300 mb-1">Restock Quantity</label>
              <input
                id="restock-qty"
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
                data-testid="restock-qty-input"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowRestockModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestock}
                disabled={actionLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/25"
                data-testid="confirm-restock-btn"
              >
                {actionLoading ? 'Restocking...' : 'Add Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingVehicleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" data-testid="delete-modal">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="text-2xl font-bold text-white">Delete Vehicle</h3>
            <p className="text-slate-300 text-sm">
              Are you sure you want to soft delete this vehicle listing? It will be removed from customer search results.
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setDeletingVehicleId(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVehicle(deletingVehicleId)}
                disabled={actionLoading}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-rose-500/25"
                data-testid="confirm-delete-btn"
              >
                {actionLoading ? 'Deleting...' : 'Delete Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
