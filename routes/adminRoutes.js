// Admin Routes - API endpoints for admin operations
const express = require('express');
const router = express.Router();
const { getAllBookings, updateBookingStatus, updatePaymentStatus, getDashboardStats } = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', getDashboardStats);

// GET /api/admin/bookings - Get all bookings
router.get('/bookings', getAllBookings);

// PUT /api/admin/bookings/:bookingId/status - Update booking status
router.put('/bookings/:bookingId/status', updateBookingStatus);

// PUT /api/admin/bookings/:bookingId/payment - Update payment status
router.put('/bookings/:bookingId/payment', updatePaymentStatus);

module.exports = router;
