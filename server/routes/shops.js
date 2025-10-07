const express = require('express');
const { body, validationResult } = require('express-validator');
const Shop = require('../models/Shop');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/shops
// @desc    Create a new shop
// @access  Private (Barber only)
router.post('/', auth, requireRole(['barber']), [
  body('shopName').trim().isLength({ min: 2 }).withMessage('Shop name must be at least 2 characters'),
  body('location.address').trim().isLength({ min: 5 }).withMessage('Address must be at least 5 characters'),
  body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('location.city').trim().isLength({ min: 2 }).withMessage('City is required'),
  body('location.state').trim().isLength({ min: 2 }).withMessage('State is required'),
  body('location.zipCode').trim().isLength({ min: 5 }).withMessage('Valid zip code is required'),
  body('contact.phone').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('services').isArray({ min: 1 }).withMessage('At least one service is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if barber already has a shop
    const existingShop = await Shop.findOne({ barber: req.user._id });
    if (existingShop) {
      return res.status(400).json({ message: 'You already have a shop registered' });
    }

    const shopData = {
      ...req.body,
      barber: req.user._id
    };

    const shop = new Shop(shopData);
    await shop.save();

    res.status(201).json({
      message: 'Shop created successfully',
      shop
    });
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({ message: 'Server error creating shop' });
  }
});

// @route   GET /api/shops
// @desc    Get all shops with optional location filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 10, city, state } = req.query;
    let query = { isActive: true };

    // If coordinates provided, find shops within radius
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusInKm = parseFloat(radius);

      query = {
        ...query,
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: radiusInKm * 1000 // Convert km to meters
          }
        }
      };
    }

    // If city/state provided, filter by location
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }

    const shops = await Shop.find(query)
      .populate('barber', 'name email profilePicture')
      .sort({ averageRating: -1, totalReviews: -1 });

    res.json({ shops });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ message: 'Server error fetching shops' });
  }
});

// @route   GET /api/shops/:id
// @desc    Get shop by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('barber', 'name email profilePicture phone');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ shop });
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ message: 'Server error fetching shop' });
  }
});

// @route   PUT /api/shops/:id
// @desc    Update shop
// @access  Private (Shop owner only)
router.put('/:id', auth, requireRole(['barber']), async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, barber: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or access denied' });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Shop updated successfully',
      shop: updatedShop
    });
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({ message: 'Server error updating shop' });
  }
});

// @route   PUT /api/shops/:id/waiting-time
// @desc    Update waiting time
// @access  Private (Shop owner only)
router.put('/:id/waiting-time', auth, requireRole(['barber']), [
  body('waitingTime').isInt({ min: 0 }).withMessage('Waiting time must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const shop = await Shop.findOne({ _id: req.params.id, barber: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found or access denied' });
    }

    shop.currentWaitingTime = req.body.waitingTime;
    await shop.save();

    res.json({
      message: 'Waiting time updated successfully',
      waitingTime: shop.currentWaitingTime
    });
  } catch (error) {
    console.error('Update waiting time error:', error);
    res.status(500).json({ message: 'Server error updating waiting time' });
  }
});

// @route   GET /api/shops/barber/my-shop
// @desc    Get barber's own shop
// @access  Private (Barber only)
router.get('/barber/my-shop', auth, requireRole(['barber']), async (req, res) => {
  try {
    const shop = await Shop.findOne({ barber: req.user._id })
      .populate('barber', 'name email profilePicture phone');

    if (!shop) {
      return res.status(404).json({ message: 'No shop found for this barber' });
    }

    res.json({ shop });
  } catch (error) {
    console.error('Get barber shop error:', error);
    res.status(500).json({ message: 'Server error fetching shop' });
  }
});

module.exports = router;
