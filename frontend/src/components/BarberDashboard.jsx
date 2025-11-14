import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './BarberDashboard.css';

const BarberDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
  });
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'barber') {
      navigate('/');
      return;
    }
    fetchShop();
  }, [isAuthenticated, user, navigate]);

  const fetchShop = async () => {
    try {
      const response = await api.get('/barber/shop');
      if (response.data.shop) {
        setShop(response.data.shop);
        setServices(response.data.shop.services || []);
        setFormData({
          name: response.data.shop.name || '',
          description: response.data.shop.description || '',
          address: response.data.shop.address || '',
          city: response.data.shop.city || '',
          state: response.data.shop.state || '',
          zipCode: response.data.shop.zipCode || '',
          phone: response.data.shop.phone || '',
          email: response.data.shop.email || '',
          latitude: response.data.shop.latitude?.toString() || '',
          longitude: response.data.shop.longitude?.toString() || '',
          imageUrl: response.data.shop.imageUrl || '',
        });
        setShowForm(false);
      } else {
        setShowForm(true);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setShowForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (shop) {
        // Update existing shop
        await api.put(`/shops/${shop.id}`, formData);
        alert('Shop updated successfully!');
      } else {
        // Create new shop
        const shopData = {
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          services: services.length > 0 ? services : undefined,
        };
        await api.post('/shops', shopData);
        alert('Shop created successfully!');
      }
      fetchShop();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save shop');
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.price && newService.duration) {
      setServices([...services, { ...newService, price: parseFloat(newService.price), duration: parseInt(newService.duration) }]);
      setNewService({ name: '', description: '', price: '', duration: '' });
    }
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleAddServiceToShop = async () => {
    if (!shop || !newService.name || !newService.price || !newService.duration) {
      alert('Please fill all service fields');
      return;
    }
    try {
      await api.post(`/shops/${shop.id}/services`, {
        ...newService,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration),
      });
      setNewService({ name: '', description: '', price: '', duration: '' });
      fetchShop();
      alert('Service added successfully!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add service');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="barber-dashboard">
      <div className="dashboard-container">
        <h1>My Shop Management</h1>

        {shop && !showForm ? (
          <div className="shop-view">
            <div className="shop-header">
              <h2>{shop.name}</h2>
              <button onClick={() => setShowForm(true)} className="btn-edit">
                Edit Shop
              </button>
            </div>

            <div className="shop-details">
              <p><strong>Description:</strong> {shop.description || 'No description'}</p>
              <p><strong>Address:</strong> {shop.address}, {shop.city}</p>
              {shop.phone && <p><strong>Phone:</strong> {shop.phone}</p>}
              {shop.email && <p><strong>Email:</strong> {shop.email}</p>}
              <p><strong>Rating:</strong> ⭐ {shop.rating > 0 ? shop.rating.toFixed(1) : 'No ratings yet'}</p>
            </div>

            <div className="services-section">
              <h3>Services</h3>
              {services.length > 0 ? (
                <div className="services-list">
                  {services.map((service, index) => (
                    <div key={service.id || index} className="service-item">
                      <div>
                        <strong>{service.name}</strong> - ${service.price}
                        <p>{service.description || 'No description'}</p>
                        <small>Duration: {service.duration} minutes</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No services added yet</p>
              )}

              <div className="add-service-form">
                <h4>Add New Service</h4>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Price ($)"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  />
                  <button onClick={handleAddServiceToShop} className="btn-add">
                    Add Service
                  </button>
                </div>
                <textarea
                  placeholder="Service Description (optional)"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  rows="2"
                />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="shop-form">
            <h2>{shop ? 'Edit Shop' : 'Create Your Shop'}</h2>

            <div className="form-group">
              <label>Shop Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {!shop && (
              <div className="services-section">
                <h3>Initial Services (Optional - can add later)</h3>
                {services.map((service, index) => (
                  <div key={index} className="service-item">
                    <strong>{service.name}</strong> - ${service.price} ({service.duration} min)
                    <button type="button" onClick={() => handleRemoveService(index)}>Remove</button>
                  </div>
                ))}
                <div className="add-service-form">
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Duration (min)"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  />
                  <button type="button" onClick={handleAddService}>Add Service</button>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {shop ? 'Update Shop' : 'Create Shop'}
              </button>
              {shop && (
                <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BarberDashboard;

