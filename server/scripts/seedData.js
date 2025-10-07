const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Shop = require('../models/Shop');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barberconnect');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('Cleared existing data');

    // Create sample users
    const barber1 = new User({
      name: 'John Smith',
      email: 'john@barbershop.com',
      password: 'password123',
      role: 'barber',
      phone: '+1-555-0101'
    });

    const barber2 = new User({
      name: 'Mike Johnson',
      email: 'mike@classiccuts.com',
      password: 'password123',
      role: 'barber',
      phone: '+1-555-0102'
    });

    const barber3 = new User({
      name: 'Carlos Rodriguez',
      email: 'carlos@elitebarbers.com',
      password: 'password123',
      role: 'barber',
      phone: '+1-555-0103'
    });

    const customer1 = new User({
      name: 'Alice Brown',
      email: 'alice@email.com',
      password: 'password123',
      role: 'customer',
      phone: '+1-555-0201'
    });

    const customer2 = new User({
      name: 'Bob Wilson',
      email: 'bob@email.com',
      password: 'password123',
      role: 'customer',
      phone: '+1-555-0202'
    });

    const customer3 = new User({
      name: 'Sarah Davis',
      email: 'sarah@email.com',
      password: 'password123',
      role: 'customer',
      phone: '+1-555-0203'
    });

    await User.insertMany([barber1, barber2, barber3, customer1, customer2, customer3]);
    console.log('Created sample users');

    // Create sample shops
    const shop1 = new Shop({
      barber: barber1._id,
      shopName: 'Smith\'s Classic Barbershop',
      description: 'Traditional barbershop with modern amenities. We specialize in classic cuts, beard grooming, and hot towel shaves.',
      location: {
        address: '123 Main Street, Downtown',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      contact: {
        phone: '+1-555-0101',
        email: 'john@barbershop.com'
      },
      services: [
        {
          name: 'Classic Haircut',
          description: 'Traditional men\'s haircut with styling',
          price: 25,
          duration: 30
        },
        {
          name: 'Beard Trim',
          description: 'Professional beard trimming and shaping',
          price: 15,
          duration: 20
        },
        {
          name: 'Hot Towel Shave',
          description: 'Traditional hot towel shave with straight razor',
          price: 35,
          duration: 45
        },
        {
          name: 'Haircut + Beard',
          description: 'Complete grooming package',
          price: 35,
          duration: 45
        }
      ],
      operatingHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '19:00', closed: false },
        saturday: { open: '08:00', close: '17:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: false }
      },
      currentWaitingTime: 15,
      averageRating: 4.5,
      totalReviews: 12
    });

    const shop2 = new Shop({
      barber: barber2._id,
      shopName: 'Classic Cuts & Styling',
      description: 'Modern barbershop offering contemporary cuts and styling services.',
      location: {
        address: '456 Oak Avenue, Midtown',
        coordinates: {
          latitude: 40.7589,
          longitude: -73.9851
        },
        city: 'New York',
        state: 'NY',
        zipCode: '10018'
      },
      contact: {
        phone: '+1-555-0102',
        email: 'mike@classiccuts.com'
      },
      services: [
        {
          name: 'Modern Haircut',
          description: 'Contemporary men\'s haircut with modern styling',
          price: 30,
          duration: 35
        },
        {
          name: 'Fade Cut',
          description: 'Professional fade haircut',
          price: 28,
          duration: 30
        },
        {
          name: 'Beard Styling',
          description: 'Complete beard styling and maintenance',
          price: 20,
          duration: 25
        },
        {
          name: 'Hair Wash & Style',
          description: 'Hair wash with professional styling',
          price: 15,
          duration: 20
        }
      ],
      operatingHours: {
        monday: { open: '08:00', close: '20:00', closed: false },
        tuesday: { open: '08:00', close: '20:00', closed: false },
        wednesday: { open: '08:00', close: '20:00', closed: false },
        thursday: { open: '08:00', close: '20:00', closed: false },
        friday: { open: '08:00', close: '21:00', closed: false },
        saturday: { open: '09:00', close: '19:00', closed: false },
        sunday: { open: '10:00', close: '18:00', closed: false }
      },
      currentWaitingTime: 25,
      averageRating: 4.8,
      totalReviews: 18
    });

    const shop3 = new Shop({
      barber: barber3._id,
      shopName: 'Elite Barbers & Grooming',
      description: 'Premium barbershop offering luxury grooming services.',
      location: {
        address: '789 Broadway, Upper East Side',
        coordinates: {
          latitude: 40.7505,
          longitude: -73.9934
        },
        city: 'New York',
        state: 'NY',
        zipCode: '10003'
      },
      contact: {
        phone: '+1-555-0103',
        email: 'carlos@elitebarbers.com'
      },
      services: [
        {
          name: 'Premium Haircut',
          description: 'Luxury haircut with premium products',
          price: 45,
          duration: 45
        },
        {
          name: 'Executive Grooming',
          description: 'Complete grooming package for professionals',
          price: 60,
          duration: 60
        },
        {
          name: 'Beard Design',
          description: 'Custom beard design and maintenance',
          price: 30,
          duration: 35
        },
        {
          name: 'Scalp Treatment',
          description: 'Relaxing scalp massage and treatment',
          price: 25,
          duration: 30
        }
      ],
      operatingHours: {
        monday: { open: '09:00', close: '19:00', closed: false },
        tuesday: { open: '09:00', close: '19:00', closed: false },
        wednesday: { open: '09:00', close: '19:00', closed: false },
        thursday: { open: '09:00', close: '19:00', closed: false },
        friday: { open: '09:00', close: '20:00', closed: false },
        saturday: { open: '10:00', close: '18:00', closed: false },
        sunday: { open: '11:00', close: '17:00', closed: false }
      },
      currentWaitingTime: 5,
      averageRating: 4.9,
      totalReviews: 25
    });

    await Shop.insertMany([shop1, shop2, shop3]);
    console.log('Created sample shops');

    // Create sample bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const booking1 = new Booking({
      customer: customer1._id,
      shop: shop1._id,
      service: {
        name: 'Classic Haircut',
        price: 25,
        duration: 30
      },
      appointmentDate: tomorrow,
      appointmentTime: '10:00',
      status: 'confirmed',
      totalAmount: 25
    });

    const booking2 = new Booking({
      customer: customer2._id,
      shop: shop2._id,
      service: {
        name: 'Fade Cut',
        price: 28,
        duration: 30
      },
      appointmentDate: tomorrow,
      appointmentTime: '14:00',
      status: 'pending',
      totalAmount: 28
    });

    const booking3 = new Booking({
      customer: customer3._id,
      shop: shop3._id,
      service: {
        name: 'Premium Haircut',
        price: 45,
        duration: 45
      },
      appointmentDate: tomorrow,
      appointmentTime: '16:00',
      status: 'confirmed',
      totalAmount: 45
    });

    await Booking.insertMany([booking1, booking2, booking3]);
    console.log('Created sample bookings');

    // Create sample reviews
    const review1 = new Review({
      customer: customer1._id,
      shop: shop1._id,
      booking: booking1._id,
      rating: 5,
      comment: 'Excellent service! John is very professional and gave me exactly what I wanted.',
      isVerified: true
    });

    const review2 = new Review({
      customer: customer2._id,
      shop: shop2._id,
      booking: booking2._id,
      rating: 4,
      comment: 'Great fade cut, very satisfied with the result.',
      isVerified: true
    });

    const review3 = new Review({
      customer: customer3._id,
      shop: shop3._id,
      booking: booking3._id,
      rating: 5,
      comment: 'Outstanding service! The premium experience was worth every penny.',
      isVerified: true
    });

    await Review.insertMany([review1, review2, review3]);
    console.log('Created sample reviews');

    console.log('✅ Seed data created successfully!');
    console.log('\nSample accounts created:');
    console.log('Barbers:');
    console.log('- john@barbershop.com / password123');
    console.log('- mike@classiccuts.com / password123');
    console.log('- carlos@elitebarbers.com / password123');
    console.log('\nCustomers:');
    console.log('- alice@email.com / password123');
    console.log('- bob@email.com / password123');
    console.log('- sarah@email.com / password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seed function
connectDB().then(() => {
  seedData();
});
