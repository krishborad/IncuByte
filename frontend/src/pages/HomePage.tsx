import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          Welcome to <span className="text-indigo-400">DriveHub</span> Inventory
        </h1>
        <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
          Explore our premier selection of vehicles, filter by specifications, search inventory, or manage dealership stock seamlessly.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
