const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Shop = require('../models/Shop');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (Customer only)
router.post('/', auth, requireRole(['customer']), [
  body('shopId').isMongoId().withMessage('Valid shop ID is required'),
  body('service.name').trim().isLength({ min: 2 }).withMessage('Service name is required'),
  body('service.price').isFloat({ min: 0 }).withMessage('Service price must be positive'),
  body('service.duration').isInt({ min: 15 }).withMessage('Service duration must be at least 15 minutes'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shopId, service, appointmentDate, appointmentTime, notes } = req.body;

    // Check if shop exists and is active
    const shop = await Shop.findById(shopId);
    if (!shop || !shop.isActive) {
      return res.status(404).json({ message: 'Shop not found or inactive' });
    }

    // Check if service exists in shop
    const shopService = shop.services.find(s => s.name === service.name);
    if (!shopService) {
      return res.status(400).json({ message: 'Service not available at this shop' });
    }

    // Validate appointment date (must be in the future)
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    if (appointmentDateTime <= new Date()) {
      return res.status(400).json({ message: 'Appointment must be scheduled for the future' });
    }

    // Check for conflicting bookings
    const existingBooking = await Booking.findOne({
      shop: shopId,
      appointmentDate: appointmentDateTime,
      status: { $in: ['pending', 'confirmed', 'in_progress'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot is already booked' });
    }

    const booking = new Booking({
      customer: req.user._id,
      shop: shopId,
      service: {
        name: service.name,
        price: service.price,
        duration: service.duration
      },
      appointmentDate: appointmentDateTime,
      appointmentTime,
      notes,
      totalAmount: service.price,
      estimatedWaitingTime: shop.currentWaitingTime
    });

    await booking.save();

    // Populate the booking with shop and customer details
    await booking.populate([
      { path: 'shop', select: 'shopName location contact' },
      { path: 'customer', select: 'name email phone' }
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @route   GET /api/bookings/customer/my-bookings
// @desc    Get customer's bookings
// @access  Private (Customer only)
router.get('/customer/my-bookings', auth, requireRole(['customer']), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { customer: req.user._id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('shop', 'shopName location contact')
      .sort({ appointmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get customer bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// @route   GET /api/bookings/shop/:shopId
// @desc    Get shop's bookings
// @access  Private (Shop owner only)
router.get('/shop/:shopId', auth, requireRole(['barber']), async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, date, page = 1, limit = 10 } = req.query;

    // Verify shop ownership
    const shop = await Shop.findOne({ _id: shopId, barber: req.user._id });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or access denied' });
    }

    let query = { shop: shopId };
    if (status) {
      query.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .sort({ appointmentDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get shop bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Shop owner only)
router.put('/:id/status', auth, requireRole(['barber']), [
  body('status').isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const { id } = req.params;

    // Find booking and verify shop ownership
    const booking = await Booking.findById(id).populate('shop');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const shop = await Shop.findOne({ _id: booking.shop._id, barber: req.user._id });
    if (!shop) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update status and timestamps
    const updateData = { status };
    if (status === 'in_progress') {
      updateData.actualStartTime = new Date();
    } else if (status === 'completed') {
      updateData.actualEndTime = new Date();
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('customer', 'name email phone');

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private (Customer only)
router.delete('/:id', auth, requireRole(['customer']), async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, customer: req.user._id });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or access denied' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
});

module.exports = router;
