import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="nav-clean sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-1.5 group">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
            LuxeStay
            <span className="w-2 h-2 rounded-full bg-orange-600 inline-block group-hover:scale-125 transition-transform duration-200"></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium text-stone-600 hover:text-stone-900 transition"
          >
            Explore Suites
          </Link>

          {isAuthenticated && (
            <Link to="/my-bookings" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              My Bookings
            </Link>
          )}
          
          {isAdmin && (
            <Link
              to="/admin"
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition"
            >
              Management Console
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-4 pl-4 border-l border-stone-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-semibold text-stone-900">{user?.fullName}</div>
                  <div className="text-[11px] text-stone-500 font-medium">{user?.role}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs bg-stone-100 hover:bg-rose-50 hover:border-rose-200 text-stone-700 hover:text-rose-700 border border-stone-200 px-3 py-1.5 rounded-lg transition duration-200 cursor-pointer font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-stone-700 hover:text-stone-900 px-3.5 py-1.5 rounded-lg hover:bg-stone-100 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm px-4 py-2 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-50"
          >
            Explore Suites
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              My Bookings
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200"
            >
              Management Console
            </Link>
          )}

          <div className="pt-2 border-t border-stone-100">
            {isAuthenticated ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900">{user?.fullName}</div>
                    <div className="text-[11px] text-stone-500">{user?.role} • {user?.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-center text-xs bg-rose-50 text-rose-700 border border-rose-200 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-stone-700 py-2.5 rounded-lg bg-stone-100 border border-stone-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center text-sm py-2.5 rounded-lg font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};