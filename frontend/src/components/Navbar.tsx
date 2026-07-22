import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="flex items-center space-x-2 font-bold text-xl text-indigo-400 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1 transition-colors"
              aria-label="DriveHub Dealership Home"
            >
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>DriveHub</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Inventory
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span>Dashboard</span>
                <span className="bg-indigo-900 text-indigo-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-indigo-700">
                  Admin
                </span>
              </Link>
            )}

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  Hello, <strong className="text-white">{user?.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-rose-600 hover:bg-rose-700 focus:ring-2 focus:ring-rose-400 focus:outline-none text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                  aria-label="Log out of account"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-4 space-y-3 shadow-inner">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white px-3 py-2.5 rounded-lg text-base font-medium transition-colors hover:bg-slate-800"
          >
            Inventory
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-indigo-400 hover:text-indigo-300 px-3 py-2.5 rounded-lg text-base font-medium transition-colors hover:bg-slate-800"
            >
              <span>Dashboard</span>
              <span className="bg-indigo-900 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-indigo-700">
                Admin
              </span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="px-3 text-sm text-gray-300">
                Signed in as <strong className="text-white">{user?.name}</strong>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-base font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-base font-medium border border-slate-800 hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-base font-medium shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
