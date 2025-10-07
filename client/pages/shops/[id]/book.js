import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/context';
import { bookingsAPI, shopsAPI } from '../../../lib/api';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const BookAppointmentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (id) {
      fetchShopDetails();
    }
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/shops/' + id + '/book');
    }
  }, [isAuthenticated, router, id]);

  const fetchShopDetails = async () => {
    try {
      const response = await shopsAPI.getById(id);
      setShop(response.data.shop);
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast.error('Failed to fetch shop details');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please select a service, date, and time');
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        shopId: id,
        service: {
          name: selectedService.name,
          price: selectedService.price,
          duration: selectedService.duration
        },
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        notes: data.notes
      };

      await bookingsAPI.create(bookingData);
      toast.success('Appointment booked successfully!');
      router.push('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    if (!shop || !selectedDate) return [];
    
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    
    return slots;
  };

  const isDateValid = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop not found</h1>
          <Link href="/find-barbers" className="btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/shops/${id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-2">{shop.shopName}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Booking Form */}
            <div className="space-y-6">
              {/* Service Selection */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h2>
                <div className="space-y-3">
                  {shop.services.map((service, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedService?.name === service.name
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedService(service)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{service.name}</h3>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${service.price}</p>
                          <p className="text-sm text-gray-500">{service.duration} min</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h2>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field pl-10"
                    required
                  />
                </div>
                {selectedDate && !isDateValid(selectedDate) && (
                  <p className="text-red-600 text-sm mt-1">Please select a future date</p>
                )}
              </div>

              {/* Time Selection */}
              {selectedDate && isDateValid(selectedDate) && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h2>
                  <div className="grid grid-cols-4 gap-2">
                    {generateTimeSlots().map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                          selectedTime === time
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="input-field"
                  placeholder="Any special requests or notes for your barber..."
                />
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shop</span>
                    <span className="font-medium">{shop.shopName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="text-right text-sm">{shop.location.city}, {shop.location.state}</span>
                  </div>

                  {selectedService && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service</span>
                        <span className="font-medium">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span>{selectedService.duration} minutes</span>
                      </div>
                    </>
                  )}

                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span>{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span>{selectedTime}</span>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${selectedService?.price || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Wait Time */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <h3 className="font-medium text-blue-900">Current Wait Time</h3>
                    <p className="text-blue-700">{shop.currentWaitingTime} minutes</p>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <button
                type="submit"
                disabled={!selectedService || !selectedDate || !selectedTime || isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
