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
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-xl sm:text-2xl">✨</span>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-gradient group-hover:opacity-90 transition">
            LuxeStay
          </span>
        </Link>

        {/* Desktop Navigation (Hidden on mobile < 768px) */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium text-slate-300 hover:text-sky-400 transition"
          >
            Explore Rooms
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition"
            >
              ⚡ Admin Panel
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-700/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-semibold text-white">{user?.fullName}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{user?.role}</div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs bg-slate-800 hover:bg-red-950/80 hover:border-red-600/50 text-slate-300 hover:text-red-300 border border-slate-700 px-3 py-1.5 rounded-lg transition duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-gradient text-sm px-4 py-1.5 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button (Visible on mobile < 768px) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 pt-3 pb-5 space-y-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Explore Rooms
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20"
            >
              ⚡ Admin Panel
            </Link>
          )}

          <div className="pt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{user?.fullName}</div>
                    <div className="text-[10px] text-slate-400">{user?.role} • {user?.email}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-center text-xs bg-red-950/60 text-red-300 border border-red-800/50 py-2 rounded-lg font-medium cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-slate-300 py-2 rounded-lg bg-slate-800 border border-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gradient text-center text-sm py-2 rounded-lg font-medium"
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