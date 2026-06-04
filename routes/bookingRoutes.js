// Booking Routes - API endpoints for booking operations
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
  checkAvailability,
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public route
// GET /api/bookings/check-availability - Check if car is available for dates
router.get('/check-availability', checkAvailability);

// Protected routes (require authentication)
// POST /api/bookings - Create new booking
router.post('/', authMiddleware, createBooking);

// GET /api/bookings/my - Get all bookings for current user
router.get('/my', authMiddleware, getMyBookings);

// GET /api/bookings/:bookingId - Get booking details
router.get('/:bookingId', authMiddleware, getBookingDetails);

// PUT /api/bookings/:bookingId/cancel - Cancel booking
router.put('/:bookingId/cancel', authMiddleware, cancelBooking);

module.exports = router;
