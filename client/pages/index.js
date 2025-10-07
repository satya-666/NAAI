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
      <section className="bg-gradient-to-br from-barber-900 via-barber-800 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect
              <span className="block text-gradient">Barber</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Book appointments with the best barbers in your area. 
              Real-time wait times, reviews, and professional grooming services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/find-barbers" className="btn-primary text-lg px-8 py-3">
                Find Barbers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/auth/register" className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-barber-900">
                Join as Barber
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BarberConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding and booking with the perfect barber simple and convenient.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="text-primary-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Barbershops
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover some of our top-rated barbershops
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredShops.map((shop) => (
                <div key={shop._id} className="card-hover">
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-gold-100 rounded-lg mb-4 flex items-center justify-center">
                    <Scissors className="w-16 h-16 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {shop.shopName}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{shop.location.city}, {shop.location.state}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{shop.averageRating}</span>
                      <span className="text-gray-500 ml-1">({shop.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-primary-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{shop.currentWaitingTime} min wait</span>
                    </div>
                  </div>
                  <Link href={`/shops/${shop._id}`} className="btn-primary w-full text-center">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/find-barbers" className="btn-outline text-lg px-8 py-3">
              View All Barbershops
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-gold-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of customers who trust BarberConnect for their grooming needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors">
              Sign Up as Customer
            </Link>
            <Link href="/barber-registration" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors">
              Join as Barber
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
