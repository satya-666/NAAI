import { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { shopsAPI } from '../lib/api';
import { MapPin, Clock, Star, Search, Filter, Scissors } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const FindBarbersPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [filters, setFilters] = useState({
    minRating: '',
    maxWaitTime: '',
    sortBy: 'rating'
  });
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    fetchShops();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const fetchShops = async (params = {}) => {
    try {
      setLoading(true);
      const queryParams = {
        ...params,
        ...(userLocation && { lat: userLocation.lat, lng: userLocation.lng, radius: 10 })
      };
      
      const response = await shopsAPI.getAll(queryParams);
      setShops(response.data.shops);
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to fetch barbershops');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = {
      ...(searchTerm && { city: searchTerm }),
      ...(location && { state: location }),
      ...(filters.minRating && { minRating: filters.minRating }),
      ...(filters.maxWaitTime && { maxWaitTime: filters.maxWaitTime }),
      sortBy: filters.sortBy
    };
    fetchShops(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDistance = (shop) => {
    if (!userLocation || !shop.location?.coordinates) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = (shop.location.coordinates.latitude - userLocation.lat) * Math.PI / 180;
    const dLon = (shop.location.coordinates.longitude - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(shop.location.coordinates.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Search Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Find Barbers Near You
              </h1>
              <p className="text-xl text-gray-600">
                Discover the best barbershops in your area
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by city or barbershop name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="State (optional)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="btn-primary px-8"
                >
                  Search
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Min Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>

                <select
                  value={filters.maxWaitTime}
                  onChange={(e) => handleFilterChange('maxWaitTime', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Max Wait Time</option>
                  <option value="15">Under 15 min</option>
                  <option value="30">Under 30 min</option>
                  <option value="60">Under 1 hour</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="distance">Sort by Distance</option>
                  <option value="waitTime">Sort by Wait Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : shops.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {shops.length} barbershop{shops.length !== 1 ? 's' : ''} found
                </h2>
                {userLocation && (
                  <p className="text-sm text-gray-600">
                    Showing results near your location
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                  <div key={shop._id} className="card-hover">
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-gold-100 rounded-lg mb-4 flex items-center justify-center">
                      <Scissors className="w-16 h-16 text-primary-600" />
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {shop.shopName}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {shop.location.address}, {shop.location.city}
                        </span>
                      </div>

                      {formatDistance(shop) && (
                        <p className="text-sm text-primary-600 font-medium">
                          {formatDistance(shop)} away
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{shop.averageRating}</span>
                        <span className="text-gray-500 ml-1">({shop.totalReviews})</span>
                      </div>
                      <div className="flex items-center text-primary-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{shop.currentWaitingTime} min</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {shop.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {service.name}
                          </span>
                        ))}
                        {shop.services.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{shop.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        href={`/shops/${shop._id}`}
                        className="flex-1 btn-primary text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/shops/${shop._id}/book`}
                        className="flex-1 btn-outline text-center"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Scissors className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No barbershops found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or location
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLocation('');
                  setFilters({ minRating: '', maxWaitTime: '', sortBy: 'rating' });
                  fetchShops();
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FindBarbersPage;
