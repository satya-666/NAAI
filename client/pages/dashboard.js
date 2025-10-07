import { useState, useEffect } from 'react';
import { useAuth } from '../lib/context';
import { shopsAPI, bookingsAPI } from '../lib/api';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import { Calendar, Clock, Users, Star, Settings, Plus, Edit } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitingTime, setWaitingTime] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'barber') {
      router.push('/');
      return;
    }
    fetchShopData();
  }, [isAuthenticated, user, router]);

  const fetchShopData = async () => {
    try {
      const [shopResponse, bookingsResponse] = await Promise.all([
        shopsAPI.getMyShop(),
        bookingsAPI.getShopBookings('', { limit: 10 })
      ]);
      
      setShop(shopResponse.data.shop);
      setBookings(bookingsResponse.data.bookings);
      setWaitingTime(shopResponse.data.shop?.currentWaitingTime || 0);
    } catch (error) {
      console.error('Error fetching shop data:', error);
      if (error.response?.status === 404) {
        // No shop found, redirect to create shop
        router.push('/barber-registration');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateWaitingTime = async (newTime) => {
    try {
      await shopsAPI.updateWaitingTime(shop._id, newTime);
      setWaitingTime(newTime);
      toast.success('Waiting time updated successfully');
    } catch (error) {
      console.error('Error updating waiting time:', error);
      toast.error('Failed to update waiting time');
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status);
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status } : booking
      ));
      toast.success('Booking status updated');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-info';
      case 'in_progress': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gold-500"></div>
        </div>
      </Layout>
    );
  }

  if (!shop) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">No shop found</h1>
            <p className="text-gray-400 mb-6">You need to create a shop profile first.</p>
            <Link href="/barber-registration" className="btn-primary touch-manipulation">
              Create Shop Profile
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-dark-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-2">Welcome back, <span className="text-gold-500">{user?.name}</span>!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <div className="card group hover:border-gold-500/30 transition-all">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Today's Bookings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {bookings.filter(b => {
                      const bookingDate = new Date(b.appointmentDate);
                      const today = new Date();
                      return bookingDate.toDateString() === today.toDateString();
                    }).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card group hover:border-gold-500/30 transition-all">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-500/30">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Bookings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className="card group hover:border-gold-500/30 transition-all">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-xl border border-gold-500/30">
                  <Star className="w-6 h-6 text-gold-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Average Rating</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{shop.averageRating}</p>
                </div>
              </div>
            </div>

            <div className="card group hover:border-gold-500/30 transition-all">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Wait Time</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{waitingTime} min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Shop Management */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Shop Management</h2>
                  <Link href={`/shops/${shop._id}/edit`} className="btn-outline touch-manipulation">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Shop
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="bg-dark-700/50 rounded-xl p-4 border border-dark-600">
                    <h3 className="font-semibold text-white text-lg">{shop.shopName}</h3>
                    <p className="text-sm text-gray-400 mt-1">{shop.location.address}, {shop.location.city}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-dark-700/30 rounded-xl p-4">
                    <span className="text-gray-300 font-medium">Current Wait Time</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={waitingTime}
                        onChange={(e) => setWaitingTime(parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 bg-dark-800 border border-dark-600 text-white rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-gold-500"
                        min="0"
                      />
                      <button
                        onClick={() => updateWaitingTime(waitingTime)}
                        className="btn-primary text-sm px-4 touch-manipulation"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-dark-700/30 rounded-xl p-4">
                    <span className="text-gray-300 font-medium">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      shop.isOpen ? 'badge-success' : 'badge-error'
                    }`}>
                      {shop.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="card mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Recent Bookings</h2>
                  <Link href="/bookings" className="text-gold-500 hover:text-gold-400 text-sm font-semibold transition-colors">
                    View All →
                  </Link>
                </div>

                <div className="space-y-3">
                  {bookings.length > 0 ? (
                    bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 px-4 bg-dark-700/30 rounded-xl border border-dark-700 hover:border-dark-600 transition-colors">
                        <div className="flex-1">
                          <p className="font-semibold text-white">{booking.customer?.name}</p>
                          <p className="text-sm text-gray-400 mt-1">{booking.service.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="text-green-400 hover:text-green-300 text-sm font-semibold bg-green-500/10 px-3 py-1 rounded-lg transition-colors touch-manipulation"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No bookings yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/shops/new" className="w-full btn-primary text-center touch-manipulation">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Link>
                  <Link href="/bookings" className="w-full btn-outline text-center touch-manipulation">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Bookings
                  </Link>
                  <Link href="/reviews" className="w-full btn-outline text-center touch-manipulation">
                    <Star className="w-4 h-4 mr-2" />
                    View Reviews
                  </Link>
                  <Link href="/settings" className="w-full btn-outline text-center touch-manipulation">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </div>
              </div>

              {/* Shop Stats */}
              <div className="card">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Shop Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Total Reviews</span>
                    <span className="font-semibold text-white text-lg">{shop.totalReviews}</span>
                  </div>
                  <div className="border-t border-dark-700"></div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Services</span>
                    <span className="font-semibold text-white text-lg">{shop.services.length}</span>
                  </div>
                  <div className="border-t border-dark-700"></div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Member Since</span>
                    <span className="font-semibold text-white text-sm">
                      {new Date(shop.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
