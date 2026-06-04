// Booking Controller - Handles booking operations
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const {
  calculateDays,
  calculateTotalRent,
  checkCarAvailability,
  validateBookingDates,
  generateBookingReference,
  calculateRefund,
} = require('../utils/bookingUtils');

// Create new booking
const createBooking = async (req, res) => {
  try {
    const {
      carId,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      pickupLocation,
      dropoffLocation,
      specialRequirements,
      insuranceSelected,
      paymentMethod,
    } = req.body;

    const userId = req.userId;

    // Validate required fields
    if (!carId || !pickupDate || !dropoffDate || !pickupTime || !dropoffTime || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields',
      });
    }

    // Validate dates and times
    const dateValidation = validateBookingDates(pickupDate, dropoffDate, pickupTime, dropoffTime);
    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking dates or times',
        errors: dateValidation.errors,
      });
    }

    // Check if car exists
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Check car availability
    const isAvailable = await checkCarAvailability(carId, pickupDate, dropoffDate);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for the selected dates',
      });
    }

    // Calculate rental details
    const numberOfDays = calculateDays(pickupDate, dropoffDate);
    const totalRent = calculateTotalRent(car.rentPerDay, numberOfDays);
    const insuranceCost = insuranceSelected ? Math.ceil(totalRent * 0.1) : 0; // 10% insurance cost

    // Create booking
    const newBooking = new Booking({
      customerId: userId,
      carId,
      pickupDate: new Date(pickupDate),
      dropoffDate: new Date(dropoffDate),
      pickupTime,
      dropoffTime,
      pickupLocation: pickupLocation.trim(),
      dropoffLocation: dropoffLocation.trim(),
      numberOfDays,
      rentPerDay: car.rentPerDay,
      totalRent,
      insuranceSelected,
      insuranceCost,
      specialRequirements: specialRequirements ? specialRequirements.trim() : '',
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Pending',
      paymentStatus: 'Pending',
    });

    // Save booking
    await newBooking.save();

    // Populate car and customer details
    await newBooking.populate('carId', 'name brand model rentPerDay');
    await newBooking.populate('customerId', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
};

// Get all bookings for current user
const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { customerId: userId };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('carId', 'name brand model rentPerDay fuelType seatingCapacity images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving bookings',
      error: error.message,
    });
  }
};

// Get booking details
const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Booking.findById(bookingId)
      .populate('carId')
      .populate('customerId', 'firstName lastName email phone address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the booking owner or admin
    if (booking.customerId._id.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking details retrieved',
      data: booking,
    });
  } catch (error) {
    console.error('Get booking details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving booking details',
      error: error.message,
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.userId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the booking owner
    if (booking.customerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'Completed' || booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status.toLowerCase()} booking`,
      });
    }

    // Calculate refund
    const refund = calculateRefund(booking.totalRent, booking.insuranceCost, booking.additionalCharges, booking.pickupDate);

    // Update booking
    booking.status = 'Cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason || 'No reason provided';
    booking.refundAmount = refund.amount;
    booking.paymentStatus = 'Pending'; // Mark for refund processing

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
      refund: {
        amount: refund.amount,
        percentage: refund.percentage,
      },
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message,
    });
  }
};

// Check car availability for given dates
const checkAvailability = async (req, res) => {
  try {
    const { carId, pickupDate, dropoffDate } = req.query;

    if (!carId || !pickupDate || !dropoffDate) {
      return res.status(400).json({
        success: false,
        message: 'Car ID, pickup date, and dropoff date are required',
      });
    }

    const isAvailable = await checkCarAvailability(carId, pickupDate, dropoffDate);

    res.status(200).json({
      success: true,
      isAvailable,
      message: isAvailable ? 'Car is available' : 'Car is not available for selected dates',
    });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
  checkAvailability,
};
