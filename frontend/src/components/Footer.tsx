import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-gray-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        <p>© {new Date().getFullYear()} DriveHub Car Dealership Inventory System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
