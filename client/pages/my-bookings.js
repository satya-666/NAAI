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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Manage your barbershop appointments</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
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
                <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.shop?.shopName}
                          </h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {booking.shop?.location?.city}, {booking.shop?.location?.state}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <div>
                            <p className="text-sm font-medium">Date</p>
                            <p className="text-sm">
                              {new Date(booking.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <div>
                            <p className="text-sm font-medium">Time</p>
                            <p className="text-sm">{booking.appointmentTime}</p>
                          </div>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <div className="w-4 h-4 mr-2 flex items-center justify-center">
                            <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Service</p>
                            <p className="text-sm">{booking.service.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-gray-900">
                          ${booking.totalAmount}
                        </div>
                        <div className="flex items-center space-x-2">
                          {booking.status === 'completed' && (
                            <Link
                              href={`/shops/${booking.shop?._id}/review?booking=${booking._id}`}
                              className="btn-outline text-sm"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Leave Review
                            </Link>
                          )}
                          <Link
                            href={`/shops/${booking.shop?._id}`}
                            className="btn-outline text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Shop
                          </Link>
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="text-red-600 hover:text-red-700 text-sm flex items-center"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notes:</span> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Start by booking an appointment with a barber'
                  : `You don't have any ${filter} bookings at the moment`
                }
              </p>
              {filter === 'all' && (
                <Link href="/find-barbers" className="btn-primary">
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
