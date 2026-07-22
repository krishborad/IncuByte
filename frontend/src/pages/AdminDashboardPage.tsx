import React from 'react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white">Admin Management Dashboard</h1>
        <p className="mt-2 text-slate-400">Manage vehicle inventory, restock stock, add new listings, and monitor sales.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
