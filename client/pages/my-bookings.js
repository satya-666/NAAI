import { useState, useEffect } from 'react';
import { useAuth } from '../lib/context';
import { bookingsAPI } from '../lib/api';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import { Calendar, Clock, MapPin, Star, X, Eye } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const MyBookingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'customer') {
      router.push('/');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, user, router]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsAPI.cancel(bookingId);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-info';
      case 'in_progress': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-error';
      case 'no_show': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-gold-500"></div>
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
            <h1 className="text-3xl sm:text-4xl font-bold text-white">My Bookings</h1>
            <p className="text-gray-400 mt-2">Manage your barbershop appointments</p>
          </div>

          {/* Filter Tabs */}
          <div className="card mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'in_progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 touch-manipulation min-h-[44px] ${
                    filter === tab.key
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 shadow-gold-glow'
                      : 'text-gray-400 hover:text-gold-500 hover:bg-dark-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking._id} className="card-hover">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white">
                            {booking.shop?.shopName}
                          </h3>
                          <div className="flex items-center text-gray-400 mt-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {booking.shop?.location?.city}, {booking.shop?.location?.state}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)} whitespace-nowrap`}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center bg-dark-700/30 rounded-xl p-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 mr-3">
                            <Calendar className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400">Date</p>
                            <p className="text-sm font-semibold text-white">
                              {new Date(booking.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center bg-dark-700/30 rounded-xl p-3">
                          <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30 mr-3">
                            <Clock className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400">Time</p>
                            <p className="text-sm font-semibold text-white">{booking.appointmentTime}</p>
                          </div>
                        </div>

                        <div className="flex items-center bg-dark-700/30 rounded-xl p-3">
                          <div className="p-2 bg-gold-500/20 rounded-lg border border-gold-500/30 mr-3">
                            <div className="w-4 h-4 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 bg-gold-500 rounded-full"></div>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-400">Service</p>
                            <p className="text-sm font-semibold text-white">{booking.service.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-dark-700">
                        <div className="text-2xl font-bold text-gradient">
                          ${booking.totalAmount}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {booking.status === 'completed' && (
                            <Link
                              href={`/shops/${booking.shop?._id}/review?booking=${booking._id}`}
                              className="btn-outline text-sm touch-manipulation"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Leave Review
                            </Link>
                          )}
                          <Link
                            href={`/shops/${booking.shop?._id}`}
                            className="btn-secondary text-sm touch-manipulation"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Shop
                          </Link>
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="text-red-400 hover:text-red-300 text-sm flex items-center bg-red-500/10 px-3 py-2 rounded-lg transition-colors font-semibold touch-manipulation min-h-[44px]"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-4 p-4 bg-dark-700/50 rounded-xl border border-dark-600">
                          <p className="text-sm text-gray-300">
                            <span className="font-semibold text-gold-500">Notes:</span> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-400 mb-8">
                {filter === 'all' 
                  ? 'Start by booking an appointment with a barber'
                  : `You don't have any ${filter} bookings at the moment`
                }
              </p>
              {filter === 'all' && (
                <Link href="/find-barbers" className="btn-primary touch-manipulation">
                  Find Barbers
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyBookingsPage;
