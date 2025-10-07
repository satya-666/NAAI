import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/context';
import { Menu, X, User, LogOut, Settings, Calendar, Scissors } from 'lucide-react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-dark-800/95 backdrop-blur-md shadow-dark-lg border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-gold-glow group-hover:shadow-gold-glow-lg transition-all duration-300 group-hover:scale-110">
              <Scissors className="w-5 h-5 text-dark-900" />
            </div>
            <span className="text-xl lg:text-2xl font-bold text-gradient hidden sm:block">
              BarberConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/find-barbers" 
              className="text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              Find Barbers
            </Link>
            {isAuthenticated && user?.role === 'barber' && (
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && user?.role === 'customer' && (
              <Link 
                href="/my-bookings" 
                className="text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-gold-500 bg-dark-700 hover:bg-dark-600 px-4 py-2 rounded-xl transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-gold-glow transition-all duration-200">
                    <User className="w-4 h-4 text-dark-900" />
                  </div>
                  <span className="font-semibold">{user?.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-dark-800 rounded-xl shadow-dark-xl border border-dark-700 py-2 z-50 animate-slide-down">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-gold-500 hover:bg-dark-700 transition-all duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    {user?.role === 'customer' && (
                      <Link
                        href="/my-bookings"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-gold-500 hover:bg-dark-700 transition-all duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        My Bookings
                      </Link>
                    )}
                    <div className="border-t border-dark-700 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-gold-500 font-semibold px-4 py-2 rounded-lg hover:bg-dark-700 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-gold-500 p-2 rounded-lg hover:bg-dark-700 transition-all duration-200 touch-manipulation"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-dark-700 py-4 animate-slide-down">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                className="text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-3 rounded-lg transition-all duration-200 font-medium touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/find-barbers"
                className="text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-3 rounded-lg transition-all duration-200 font-medium touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Barbers
              </Link>
              {isAuthenticated && user?.role === 'barber' && (
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-3 rounded-lg transition-all duration-200 font-medium touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAuthenticated && user?.role === 'customer' && (
                <Link
                  href="/my-bookings"
                  className="text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-3 rounded-lg transition-all duration-200 font-medium touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-dark-700 mt-4">
                  <div className="flex items-center space-x-3 mb-4 px-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-gold-glow">
                      <User className="w-5 h-5 text-dark-900" />
                    </div>
                    <span className="font-semibold text-gray-100">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-red-400 hover:text-red-300 hover:bg-dark-700 px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-dark-700 mt-4 space-y-2">
                  <Link
                    href="/auth/login"
                    className="block text-gray-300 hover:text-gold-500 hover:bg-dark-700 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-center touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-primary w-full touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
