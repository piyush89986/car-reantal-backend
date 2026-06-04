// Booking Utility Functions - Helper functions for booking operations
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// Calculate number of days between two dates
const calculateDays = (pickupDate, dropoffDate) => {
  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);
  const timeDiff = dropoff - pickup;
  const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 1;
};

// Calculate total rent
const calculateTotalRent = (rentPerDay, numberOfDays) => {
  return rentPerDay * numberOfDays;
};

// Check if car is available for given dates
const checkCarAvailability = async (carId, pickupDate, dropoffDate, excludeBookingId = null) => {
  try {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    // Query to find overlapping bookings
    let query = {
      carId,
      status: { $in: ['Pending', 'Confirmed'] },
      $or: [
        {
          // Existing booking starts before our dropoff and ends after our pickup
          pickupDate: { $lt: dropoff },
          dropoffDate: { $gt: pickup },
        },
      ],
    };

    // Exclude current booking if updating
    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const existingBooking = await Booking.findOne(query);

    return !existingBooking; // Return true if available (no overlapping bookings)
  } catch (error) {
    console.error('Availability check error:', error);
    return false;
  }
};

// Validate booking dates
const validateBookingDates = (pickupDate, dropoffDate, pickupTime, dropoffTime) => {
  const errors = [];

  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if pickup date is in the future
  if (pickup < today) {
    errors.push('Pickup date must be in the future');
  }

  // Check if dropoff is after pickup
  if (dropoff <= pickup) {
    errors.push('Dropoff date must be after pickup date');
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(pickupTime)) {
    errors.push('Invalid pickup time format (use HH:MM)');
  }
  if (!timeRegex.test(dropoffTime)) {
    errors.push('Invalid dropoff time format (use HH:MM)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate booking reference number
const generateBookingReference = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK-${timestamp}-${random}`;
};

// Calculate refund amount based on cancellation time
const calculateRefund = (totalRent, insuranceCost, additionalCharges, pickupDate) => {
  const pickup = new Date(pickupDate);
  const today = new Date();
  const hoursUntilPickup = (pickup - today) / (1000 * 60 * 60);

  let refundPercentage = 0;

  // Full refund if cancelled 7+ days before pickup
  if (hoursUntilPickup >= 168) {
    refundPercentage = 100;
  }
  // 75% refund if cancelled 3-7 days before pickup
  else if (hoursUntilPickup >= 72) {
    refundPercentage = 75;
  }
  // 50% refund if cancelled 1-3 days before pickup
  else if (hoursUntilPickup >= 24) {
    refundPercentage = 50;
  }
  // No refund if cancelled within 24 hours
  else {
    refundPercentage = 0;
  }

  // Calculate refund (full amount minus insurance cost)
  const refundAmount = (totalRent * refundPercentage) / 100;
  return {
    amount: refundAmount,
    percentage: refundPercentage,
  };
};

module.exports = {
  calculateDays,
  calculateTotalRent,
  checkCarAvailability,
  validateBookingDates,
  generateBookingReference,
  calculateRefund,
};
