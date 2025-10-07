import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout/Layout';
import { shopsAPI } from '../lib/api';
import { MapPin, Clock, Star, Scissors, Users, Award, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [featuredShops, setFeaturedShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedShops = async () => {
      try {
        const response = await shopsAPI.getAll({ limit: 3 });
        setFeaturedShops(response.data.shops);
      } catch (error) {
        console.error('Error fetching featured shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedShops();
  }, []);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Find Nearby Barbers',
      description: 'Discover the best barbers in your area with our location-based search.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Real-time Wait Times',
      description: 'See current waiting times and book appointments that fit your schedule.'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Reviews & Ratings',
      description: 'Read authentic reviews and ratings from other customers.'
    },
    {
      icon: <Scissors className="w-8 h-8" />,
      title: 'Professional Services',
      description: 'Access to skilled barbers offering a wide range of grooming services.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Barbers' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '50K+', label: 'Appointments Booked' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-900 via-brown-900 to-dark-800 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brown-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Find Your Perfect
              <span className="block text-gradient mt-2">Barber</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Book appointments with the best barbers in your area. 
              Real-time wait times, reviews, and professional grooming services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/find-barbers" className="btn-primary text-lg px-8 w-full sm:w-auto touch-manipulation">
                Find Barbers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/barber-registration" className="btn-outline text-lg px-8 w-full sm:w-auto touch-manipulation">
                Join as Barber
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-dark-800 border-y border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-gradient">BarberConnect</span>?
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              We make finding and booking with the perfect barber simple and convenient.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-hover text-center group">
                <div className="text-gold-500 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Featured <span className="text-gradient">Barbershops</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
              Discover some of our top-rated barbershops
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-dark-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-dark-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-dark-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredShops.map((shop) => (
                <div key={shop._id} className="card-hover group">
                  <div className="h-48 bg-gradient-to-br from-gold-500/20 to-brown-500/20 rounded-xl mb-4 flex items-center justify-center border border-gold-500/20 group-hover:border-gold-500/40 transition-colors">
                    <Scissors className="w-16 h-16 text-gold-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {shop.shopName}
                  </h3>
                  <div className="flex items-center text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{shop.location.city}, {shop.location.state}</span>
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
                  <Link href={`/shops/${shop._id}`} className="btn-primary w-full text-center touch-manipulation">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/find-barbers" className="btn-outline text-lg px-8 touch-manipulation">
              View All Barbershops
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gold-600 via-gold-500 to-brown-600 text-dark-900 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-64 h-64 bg-brown-800 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gold-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-dark-800 max-w-2xl mx-auto">
            Join thousands of customers who trust BarberConnect for their grooming needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-dark-900 text-gold-500 hover:bg-dark-800 font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 min-h-[44px] flex items-center justify-center touch-manipulation">
              Sign Up as Customer
            </Link>
            <Link href="/barber-registration" className="border-2 border-dark-900 text-dark-900 hover:bg-dark-900 hover:text-gold-500 font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 min-h-[44px] flex items-center justify-center touch-manipulation">
              Join as Barber
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
