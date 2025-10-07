import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import { shopsAPI, reviewsAPI } from '../../lib/api';
import { MapPin, Clock, Star, Phone, Mail, Calendar, Scissors, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ShopDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    if (id) {
      fetchShopDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      const response = await shopsAPI.getById(id);
      setShop(response.data.shop);
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast.error('Failed to fetch shop details');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getShopReviews(id);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ));
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop not found</h1>
            <Link href="/find-barbers" className="btn-primary">
              Back to Search
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/find-barbers" className="text-gray-600 hover:text-gray-900">
                  <ChevronLeft className="w-6 h-6" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{shop.shopName}</h1>
                  <p className="text-gray-600">{shop.description}</p>
                </div>
              </div>
              <Link
                href={`/shops/${shop._id}/book`}
                className="btn-primary"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Shop Image */}
              <div className="h-64 bg-gradient-to-br from-primary-100 to-gold-100 rounded-lg mb-6 flex items-center justify-center">
                <Scissors className="w-24 h-24 text-primary-600" />
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button
                      onClick={() => setActiveTab('services')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'services'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Services
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'reviews'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Reviews ({reviews.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('about')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'about'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      About
                    </button>
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === 'services' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Services & Pricing</h3>
                      <div className="space-y-4">
                        {shop.services.map((service, index) => (
                          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              {service.description && (
                                <p className="text-sm text-gray-600">{service.description}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">${service.price}</p>
                              <p className="text-sm text-gray-500">{service.duration} min</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                      {reviews.length > 0 ? (
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary-600">
                                      {review.customer?.name?.charAt(0)}
                                    </span>
                                  </div>
                                  <span className="font-medium text-gray-900">{review.customer?.name}</span>
                                </div>
                                <div className="flex items-center">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-gray-700">{review.comment}</p>
                              )}
                              <p className="text-sm text-gray-500 mt-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No reviews yet.</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'about' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Shop</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{shop.location.address}, {shop.location.city}, {shop.location.state} {shop.location.zipCode}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-600">
                              <Phone className="w-4 h-4 mr-2" />
                              <span>{shop.contact.phone}</span>
                            </div>
                            {shop.contact.email && (
                              <div className="flex items-center text-gray-600">
                                <Mail className="w-4 h-4 mr-2" />
                                <span>{shop.contact.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Operating Hours</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(shop.operatingHours).map(([day, hours]) => (
                              <div key={day} className="flex justify-between">
                                <span className="capitalize font-medium">{day}</span>
                                <span className={hours.closed ? 'text-red-500' : 'text-gray-600'}>
                                  {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      {renderStars(shop.averageRating)}
                      <span className="ml-2 font-medium">{shop.averageRating}</span>
                      <span className="text-gray-500 ml-1">({shop.totalReviews})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Wait Time</span>
                    <div className="flex items-center text-primary-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="font-medium">{shop.currentWaitingTime} min</span>
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

                <div className="mt-6 space-y-3">
                  <Link
                    href={`/shops/${shop._id}/book`}
                    className="w-full btn-primary text-center"
                  >
                    Book Appointment
                  </Link>
                  <button className="w-full btn-outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </button>
                </div>
              </div>

              {/* Barber Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Barber</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-primary-600">
                      {shop.barber?.name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{shop.barber?.name}</h4>
                    <p className="text-sm text-gray-600">Barber</p>
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

export default ShopDetailPage;
