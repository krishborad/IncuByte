import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center py-16 space-y-4">
      <h1 className="text-6xl font-extrabold text-indigo-500">404</h1>
      <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
      <p className="text-slate-400">The requested page does not exist or has been moved.</p>
      <div>
        <Link to="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-md">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
