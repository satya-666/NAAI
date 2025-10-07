import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/context';
import { shopsAPI } from '../lib/api';
import { useForm } from 'react-hook-form';
import { MapPin, Phone, Mail, Scissors, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BarberRegistrationPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([
    { name: '', description: '', price: '', duration: '' }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'barber') {
      router.push('/auth/register?role=barber');
    }
  }, [isAuthenticated, user, router]);

  const addService = () => {
    setServices([...services, { name: '', description: '', price: '', duration: '' }]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index, field, value) => {
    const updatedServices = services.map((service, i) => 
      i === index ? { ...service, [field]: value } : service
    );
    setServices(updatedServices);
  };

  const onSubmit = async (data) => {
    // Validate services
    const validServices = services.filter(service => 
      service.name && service.price && service.duration
    );

    if (validServices.length === 0) {
      toast.error('Please add at least one service');
      return;
    }

    setIsSubmitting(true);
    try {
      const shopData = {
        ...data,
        location: {
          address: data.address,
          coordinates: {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude)
          },
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        },
        contact: {
          phone: data.phone,
          email: data.email
        },
        services: validServices.map(service => ({
          name: service.name,
          description: service.description,
          price: parseFloat(service.price),
          duration: parseInt(service.duration)
        })),
        operatingHours: {
          monday: { open: data.mondayOpen, close: data.mondayClose, closed: data.mondayClosed },
          tuesday: { open: data.tuesdayOpen, close: data.tuesdayClose, closed: data.tuesdayClosed },
          wednesday: { open: data.wednesdayOpen, close: data.wednesdayClose, closed: data.wednesdayClosed },
          thursday: { open: data.thursdayOpen, close: data.thursdayClose, closed: data.thursdayClosed },
          friday: { open: data.fridayOpen, close: data.fridayClose, closed: data.fridayClosed },
          saturday: { open: data.saturdayOpen, close: data.saturdayClose, closed: data.saturdayClosed },
          sunday: { open: data.sundayOpen, close: data.sundayClose, closed: data.sundayClosed }
        }
      };

      await shopsAPI.create(shopData);
      toast.success('Shop created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating shop:', error);
      toast.error(error.response?.data?.message || 'Failed to create shop');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'barber') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-gold-500 rounded-lg flex items-center justify-center">
              <Scissors className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Barbershop</h1>
          <p className="text-gray-600 mt-2">Set up your shop profile to start accepting bookings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop Name *
                </label>
                <input
                  {...register('shopName', { required: 'Shop name is required' })}
                  type="text"
                  className="input-field"
                  placeholder="Enter your shop name"
                />
                {errors.shopName && (
                  <p className="text-red-600 text-sm mt-1">{errors.shopName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input-field"
                  placeholder="Describe your barbershop"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Location</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('address', { required: 'Address is required' })}
                    type="text"
                    className="input-field pl-10"
                    placeholder="Enter your shop address"
                  />
                </div>
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    type="text"
                    className="input-field"
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    {...register('state', { required: 'State is required' })}
                    type="text"
                    className="input-field"
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    {...register('zipCode', { required: 'ZIP code is required' })}
                    type="text"
                    className="input-field"
                    placeholder="ZIP Code"
                  />
                  {errors.zipCode && (
                    <p className="text-red-600 text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    {...register('latitude', { 
                      required: 'Latitude is required',
                      pattern: {
                        value: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/,
                        message: 'Invalid latitude'
                      }
                    })}
                    type="text"
                    className="input-field"
                    placeholder="e.g., 40.7128"
                  />
                  {errors.latitude && (
                    <p className="text-red-600 text-sm mt-1">{errors.latitude.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    {...register('longitude', { 
                      required: 'Longitude is required',
                      pattern: {
                        value: /^-?((1[0-7][0-9])|([1-9]?[0-9]))\.{1}\d{1,6}$/,
                        message: 'Invalid longitude'
                      }
                    })}
                    type="text"
                    className="input-field"
                    placeholder="e.g., -74.0060"
                  />
                  {errors.longitude && (
                    <p className="text-red-600 text-sm mt-1">{errors.longitude.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('phone', { required: 'Phone number is required' })}
                    type="tel"
                    className="input-field pl-10"
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Services</h2>
              <button
                type="button"
                onClick={addService}
                className="btn-outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </button>
            </div>

            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Service {index + 1}</h3>
                    {services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        className="input-field"
                        placeholder="e.g., Haircut"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(index, 'price', e.target.value)}
                        className="input-field"
                        placeholder="25"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        value={service.duration}
                        onChange={(e) => updateService(index, 'duration', e.target.value)}
                        className="input-field"
                        placeholder="30"
                        min="15"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        className="input-field"
                        placeholder="Brief description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Operating Hours</h2>
            
            <div className="space-y-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register(`${day}Closed`)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Closed</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      {...register(`${day}Open`)}
                      className="input-field"
                      disabled={false}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      {...register(`${day}Close`)}
                      className="input-field"
                      disabled={false}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Shop...' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarberRegistrationPage;
