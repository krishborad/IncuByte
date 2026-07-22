import React, { useState, useEffect, useCallback } from 'react';
import { vehicleService, VehicleQueryParams } from '../services/vehicle.service';
import VehicleCard from '../components/VehicleCard';
import { Vehicle, Pagination } from '../types';
import { useAuth } from '../hooks/useAuth';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter State
  const [search, setSearch] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('');
  const [transmission, setTransmission] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('createdAt:desc');
  const [page, setPage] = useState<number>(1);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortBy, sortOrder] = sortOption.split(':') as [string, 'asc' | 'desc'];

      const params: VehicleQueryParams = {
        page,
        limit: 6,
        search: search.trim() || undefined,
        make: make || undefined,
        fuelType: fuelType || undefined,
        transmission: transmission || undefined,
        sortBy,
        sortOrder,
      };

      const data = await vehicleService.getVehicles(params);
      setVehicles(data.vehicles);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load vehicle inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, make, fuelType, transmission, sortOption]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setMake('');
    setFuelType('');
    setTransmission('');
    setSortOption('createdAt:desc');
    setPage(1);
  };

  const handlePurchase = async (vehicleId: string) => {
    try {
      const updatedVehicle = await vehicleService.purchaseVehicle(vehicleId);
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => (v._id === vehicleId ? updatedVehicle : v)),
      );
      setToastMessage({ text: 'Vehicle purchased successfully!', type: 'success' });
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Purchase failed. Please try again.';
      setToastMessage({ text: errMsg, type: 'error' });
      setTimeout(() => setToastMessage(null), 5000);
      throw err;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center space-x-3 transition-all animate-bounce-short ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-700 text-emerald-200'
              : 'bg-rose-950/95 border-rose-700 text-rose-200'
          }`}
          role="status"
          aria-live="assertive"
        >
          <span>{toastMessage.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white p-1"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <span className="inline-block text-indigo-400 text-xs font-bold tracking-widest uppercase bg-indigo-950/80 border border-indigo-800 px-3 py-1 rounded-full">
            Featured Dealership Inventory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Find Your Next Dream Vehicle
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse our complete inventory of premium cars, trucks, and SUVs. Search specs, filter options, check live stock, and purchase online seamlessly.
          </p>
        </div>
      </div>

      {/* Search & Filtering Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <label htmlFor="inventory-search-input" className="sr-only">
            Search Inventory
          </label>
          <input
            id="inventory-search-input"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by make, model, description..."
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors placeholder-slate-500 text-sm sm:text-base"
            data-testid="search-input"
          />
          <svg
            className="w-6 h-6 text-slate-500 absolute left-4 top-3.5 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filter & Sort Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
          {/* Make Filter */}
          <div>
            <label htmlFor="make-filter" className="block text-xs font-medium text-slate-400 mb-1">
              Make
            </label>
            <input
              id="make-filter"
              type="text"
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setPage(1);
              }}
              placeholder="e.g. Toyota"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="make-select"
            />
          </div>

          {/* Fuel Type Filter */}
          <div>
            <label htmlFor="fuel-filter" className="block text-xs font-medium text-slate-400 mb-1">
              Fuel Type
            </label>
            <select
              id="fuel-filter"
              value={fuelType}
              onChange={(e) => {
                setFuelType(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="fuel-select"
            >
              <option value="">All Fuel Types</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Plug-in Hybrid">Plug-in Hybrid</option>
            </select>
          </div>

          {/* Transmission Filter */}
          <div>
            <label htmlFor="transmission-filter" className="block text-xs font-medium text-slate-400 mb-1">
              Transmission
            </label>
            <select
              id="transmission-filter"
              value={transmission}
              onChange={(e) => {
                setTransmission(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="transmission-select"
            >
              <option value="">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
              <option value="Dual-Clutch">Dual-Clutch</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label htmlFor="sort-select" className="block text-xs font-medium text-slate-400 mb-1">
              Sort By
            </label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="sort-select"
            >
              <option value="createdAt:desc">Newest Listings</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
              <option value="year:desc">Year: Newest First</option>
              <option value="year:asc">Year: Oldest First</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold py-2.5 px-3 rounded-xl transition-colors min-h-[42px] focus:outline-none focus:ring-2 focus:ring-slate-500"
              data-testid="reset-filters-btn"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading State Skeleton */}
      {loading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-busy="true"
          aria-label="Loading vehicles"
          data-testid="loading-skeleton"
        >
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
        <div
          className="bg-rose-950/80 border border-rose-800 rounded-2xl p-8 text-center space-y-4 shadow-xl"
          role="alert"
          data-testid="error-state"
        >
          <div className="inline-flex justify-center items-center w-14 h-14 rounded-full bg-rose-900/50 text-rose-400 mb-1">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">Error Loading Vehicles</h2>
          <p className="text-rose-300 text-sm max-w-md mx-auto">{error}</p>
          <div>
            <button
              onClick={fetchVehicles}
              className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-rose-600/20 focus:outline-none focus:ring-2 focus:ring-rose-400 min-h-[44px]"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty Inventory State */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-lg" data-testid="empty-state">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-800 text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">No Vehicles Matching Your Criteria</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            We couldn't find any vehicles matching your search query or filter options. Try resetting your filters to view full inventory.
          </p>
          <div>
            <button
              onClick={handleResetFilters}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[44px]"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Vehicle Grid */}
      {!loading && !error && vehicles.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-slate-400 px-1 gap-2" role="status" aria-live="polite">
            <span>
              Showing <strong className="text-white">{vehicles.length}</strong> of{' '}
              <strong className="text-white">{pagination.total}</strong> vehicles
            </span>
            <span>
              Page <strong className="text-white">{pagination.page}</strong> of{' '}
              <strong className="text-white">{pagination.totalPages}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="vehicle-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onPurchase={handlePurchase}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <nav className="flex justify-center items-center space-x-4 pt-6" aria-label="Pagination" data-testid="pagination-controls">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                aria-label="Go to previous page"
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl border border-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                data-testid="prev-page-btn"
              >
                Previous
              </button>
              <span className="text-sm text-slate-300 font-medium px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={page >= pagination.totalPages}
                aria-label="Go to next page"
                className="bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl border border-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                data-testid="next-page-btn"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
