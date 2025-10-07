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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!shop) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No shop found</h1>
            <p className="text-gray-600 mb-6">You need to create a shop profile first.</p>
            <Link href="/barber-registration" className="btn-primary">
              Create Shop Profile
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {bookings.filter(b => {
                      const bookingDate = new Date(b.appointmentDate);
                      const today = new Date();
                      return bookingDate.toDateString() === today.toDateString();
                    }).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-semibold text-gray-900">{shop.averageRating}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wait Time</p>
                  <p className="text-2xl font-semibold text-gray-900">{waitingTime} min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shop Management */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Shop Management</h2>
                  <Link href={`/shops/${shop._id}/edit`} className="btn-outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Shop
                  </Link>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{shop.shopName}</h3>
                    <p className="text-sm text-gray-600">{shop.location.address}, {shop.location.city}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Wait Time</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={waitingTime}
                        onChange={(e) => setWaitingTime(parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        min="0"
                      />
                      <button
                        onClick={() => updateWaitingTime(waitingTime)}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      shop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {shop.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                  <Link href="/bookings" className="text-primary-600 hover:text-primary-500 text-sm">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {bookings.length > 0 ? (
                    bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{booking.customer?.name}</p>
                          <p className="text-sm text-gray-600">{booking.service.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No bookings yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/shops/new" className="w-full btn-primary text-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Link>
                  <Link href="/bookings" className="w-full btn-outline text-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    View All Bookings
                  </Link>
                  <Link href="/reviews" className="w-full btn-outline text-center">
                    <Star className="w-4 h-4 mr-2" />
                    View Reviews
                  </Link>
                  <Link href="/settings" className="w-full btn-outline text-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </div>
              </div>

              {/* Shop Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-medium">{shop.totalReviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Services</span>
                    <span className="font-medium">{shop.services.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">
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
