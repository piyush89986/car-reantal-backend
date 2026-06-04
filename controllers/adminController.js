// Admin Controller - Handles admin operations
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const { status, carId, customerId, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (carId) {
      filter.carId = carId;
    }

    if (customerId) {
      filter.customerId = customerId;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('carId', 'name brand model rentPerDay')
      .populate('customerId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'All bookings retrieved',
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving bookings',
      error: error.message,
    });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking status',
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update status
    booking.status = status;
    if (adminNotes) {
      booking.adminNotes = adminNotes.trim();
    }
    booking.updatedAt = Date.now();

    await booking.save();

    await booking.populate('carId', 'name brand');
    await booking.populate('customerId', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message,
    });
  }
};

// Update payment status (Admin only)
const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    const validStatuses = ['Pending', 'Completed', 'Failed'];

    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.paymentStatus = paymentStatus;
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }
    booking.updatedAt = Date.now();

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message,
    });
  }
};

// Get dashboard statistics (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    // Total bookings
    const totalBookings = await Booking.countDocuments();

    // Bookings by status
    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Total revenue
    const totalRevenue = await Booking.aggregate([
      {
        $match: { status: 'Completed' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalRent' },
        },
      },
    ]);

    // Total cars
    const totalCars = await Car.countDocuments();

    // Total users (customers)
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('carId', 'name brand')
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Most booked cars
    const topCars = await Booking.aggregate([
      {
        $group: {
          _id: '$carId',
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'cars',
          localField: '_id',
          foreignField: '_id',
          as: 'carDetails',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved',
      stats: {
        totalBookings,
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalRevenue: totalRevenue[0]?.total || 0,
        totalCars,
        totalCustomers,
        recentBookings,
        topCars,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard statistics',
      error: error.message,
    });
  }
};

module.exports = {
  getAllBookings,
  updateBookingStatus,
  updatePaymentStatus,
  getDashboardStats,
};
