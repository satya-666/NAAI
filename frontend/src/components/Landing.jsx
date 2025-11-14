import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Landing.css';

const Landing = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchShops();
  }, [city, search]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      if (search) params.append('search', search);
      
      const response = await api.get(`/shops?${params.toString()}`);
      setShops(response.data.shops || []);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Barber & Salon</h1>
          <p>Discover nearby barber shops and salons. Book appointments easily.</p>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-input city-input"
            />
          </div>
        </div>
      </section>

      {/* Shops Section */}
      <section className="shops-section">
        <div className="container">
          <h2>Nearby Barber Shops & Salons</h2>
          
          {loading ? (
            <div className="loading">Loading shops...</div>
          ) : shops.length === 0 ? (
            <div className="no-shops">
              <p>No shops found. {search || city ? 'Try different search terms.' : 'Be the first to list your shop!'}</p>
              <Link to="/signup" className="btn-primary">
                Register as Barber
              </Link>
            </div>
          ) : (
            <div className="shops-grid">
              {shops.map((shop) => (
                <div key={shop.id} className="shop-card">
                  <div className="shop-image">
                    {shop.imageUrl ? (
                      <img src={shop.imageUrl} alt={shop.name} />
                    ) : (
                      <div className="shop-placeholder">✂️</div>
                    )}
                    <div className="shop-rating">
                      ⭐ {shop.rating > 0 ? shop.rating.toFixed(1) : 'New'}
                    </div>
                  </div>
                  
                  <div className="shop-info">
                    <h3>{shop.name}</h3>
                    <p className="shop-owner">by {shop.barber?.name || 'Unknown'}</p>
                    
                    <div className="shop-location">
                      📍 {shop.address}, {shop.city}
                    </div>
                    
                    {shop.description && (
                      <p className="shop-description">{shop.description.substring(0, 100)}...</p>
                    )}
                    
                    <div className="shop-services">
                      <strong>Services:</strong>
                      <div className="services-list">
                        {shop.services && shop.services.length > 0 ? (
                          shop.services.slice(0, 3).map((service) => (
                            <span key={service.id} className="service-tag">
                              {service.name} - ${service.price}
                            </span>
                          ))
                        ) : (
                          <span>No services listed</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="shop-actions">
                      <Link to={`/shops/${shop.id}`} className="btn-view">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Are you a Barber?</h2>
          <p>List your shop and reach more customers</p>
          <Link to="/signup" className="btn-primary large">
            Register Your Shop
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;

