const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Shop = require('../models/Shop');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private (Customer only)
router.post('/', auth, requireRole(['customer']), [
  body('shopId').isMongoId().withMessage('Valid shop ID is required'),
  body('bookingId').isMongoId().withMessage('Valid booking ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { shopId, bookingId, rating, comment, photos } = req.body;

    // Verify booking exists and belongs to customer
    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user._id,
      shop: shopId,
      status: 'completed'
    });

    if (!booking) {
      return res.status(404).json({ 
        message: 'Booking not found, not completed, or access denied' 
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    const review = new Review({
      customer: req.user._id,
      shop: shopId,
      booking: bookingId,
      rating,
      comment,
      photos: photos || [],
      isVerified: true
    });

    await review.save();

    // Update shop's average rating and total reviews
    await updateShopRating(shopId);

    // Populate review with customer details
    await review.populate('customer', 'name profilePicture');

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
});

// @route   GET /api/reviews/shop/:shopId
// @desc    Get reviews for a shop
// @access  Public
router.get('/shop/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    let query = { shop: shopId };
    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('customer', 'name profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get shop reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   GET /api/reviews/customer/my-reviews
// @desc    Get customer's reviews
// @access  Private (Customer only)
router.get('/customer/my-reviews', auth, requireRole(['customer']), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ customer: req.user._id })
      .populate('shop', 'shopName location')
      .populate('booking', 'appointmentDate service')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ customer: req.user._id });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get customer reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (Review owner only)
router.put('/:id', auth, requireRole(['customer']), [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findOne({ _id: req.params.id, customer: req.user._id });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found or access denied' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('customer', 'name profilePicture');

    // Update shop rating if rating changed
    if (req.body.rating && req.body.rating !== review.rating) {
      await updateShopRating(review.shop);
    }

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error updating review' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Review owner only)
router.delete('/:id', auth, requireRole(['customer']), async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, customer: req.user._id });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found or access denied' });
    }

    const shopId = review.shop;
    await Review.findByIdAndDelete(req.params.id);

    // Update shop rating after deletion
    await updateShopRating(shopId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
});

// Helper function to update shop rating
async function updateShopRating(shopId) {
  try {
    const reviews = await Review.find({ shop: shopId });
    
    if (reviews.length === 0) {
      await Shop.findByIdAndUpdate(shopId, {
        averageRating: 0,
        totalReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Shop.findByIdAndUpdate(shopId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Update shop rating error:', error);
  }
}

module.exports = router;
