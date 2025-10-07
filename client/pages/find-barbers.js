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
      <div className="bg-dark-900 min-h-screen">
        {/* Search Section */}
        <div className="bg-dark-800 shadow-dark-lg border-b border-dark-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Find <span className="text-gradient">Barbers</span> Near You
              </h1>
              <p className="text-lg sm:text-xl text-gray-400">
                Discover the best barbershops in your area
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by city or barbershop name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-12"
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="State (optional)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input-field pl-12"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="btn-primary px-8 w-full md:w-auto touch-manipulation"
                >
                  Search
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gold-500" />
                  <span className="text-sm font-semibold text-gray-300">Filters:</span>
                </div>
                
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="input-field text-sm py-2 min-h-[44px]"
                >
                  <option value="">Min Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>

                <select
                  value={filters.maxWaitTime}
                  onChange={(e) => handleFilterChange('maxWaitTime', e.target.value)}
                  className="input-field text-sm py-2 min-h-[44px]"
                >
                  <option value="">Max Wait Time</option>
                  <option value="15">Under 15 min</option>
                  <option value="30">Under 30 min</option>
                  <option value="60">Under 1 hour</option>
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input-field text-sm py-2 min-h-[44px]"
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
                  <div className="h-48 bg-dark-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-dark-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-dark-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : shops.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <h2 className="text-xl font-semibold text-white">
                  {shops.length} barbershop{shops.length !== 1 ? 's' : ''} found
                </h2>
                {userLocation && (
                  <p className="text-sm text-gray-400">
                    📍 Showing results near your location
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map((shop) => (
                  <div key={shop._id} className="card-hover group">
                    <div className="h-48 bg-gradient-to-br from-gold-500/20 to-brown-500/20 rounded-xl mb-4 flex items-center justify-center border border-gold-500/20 group-hover:border-gold-500/40 transition-colors">
                      <Scissors className="w-16 h-16 text-gold-500" />
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {shop.shopName}
                      </h3>
                      
                      <div className="flex items-center text-gray-400 mb-2">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">
                          {shop.location.address}, {shop.location.city}
                        </span>
                      </div>

                      {formatDistance(shop) && (
                        <p className="text-sm text-gold-500 font-medium">
                          📍 {formatDistance(shop)} away
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-gold-500 mr-1" />
                        <span className="font-medium text-white">{shop.averageRating}</span>
                        <span className="text-gray-500 ml-1">({shop.totalReviews})</span>
                      </div>
                      <div className="flex items-center text-gold-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{shop.currentWaitingTime} min</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-300 mb-2 text-sm">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {shop.services.slice(0, 3).map((service, index) => (
                          <span key={index} className="text-xs bg-dark-700 text-gray-300 px-3 py-1 rounded-full border border-dark-600">
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

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/shops/${shop._id}`}
                        className="flex-1 btn-primary text-center touch-manipulation"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/shops/${shop._id}/book`}
                        className="flex-1 btn-outline text-center touch-manipulation"
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
              <Scissors className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No barbershops found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria or location
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLocation('');
                  setFilters({ minRating: '', maxWaitTime: '', sortBy: 'rating' });
                  fetchShops();
                }}
                className="btn-primary touch-manipulation"
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
