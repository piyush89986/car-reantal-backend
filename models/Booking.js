// Booking Model - Handles car rental bookings and status tracking
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Reference to Customer
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID is required'],
    },
    // Reference to Car
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car ID is required'],
    },
    // Booking Dates and Times
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    dropoffDate: {
      type: Date,
      required: [true, 'Dropoff date is required'],
    },
    pickupTime: {
      type: String, // Format: "HH:MM"
      required: [true, 'Pickup time is required'],
    },
    dropoffTime: {
      type: String, // Format: "HH:MM"
      required: [true, 'Dropoff time is required'],
    },
    // Location Details
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
    },
    dropoffLocation: {
      type: String,
      required: [true, 'Dropoff location is required'],
    },
    // Pricing Information
    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
    },
    rentPerDay: {
      type: Number,
      required: true,
    },
    totalRent: {
      type: Number,
      required: [true, 'Total rent must be calculated'],
    },
    // Additional Charges
    additionalCharges: {
      type: Number,
      default: 0,
    },
    // Status
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    // Payment Information
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery', 'Digital Wallet'],
      required: [true, 'Payment method is required'],
    },
    // Special Requirements/Notes
    specialRequirements: {
      type: String,
      trim: true,
    },
    // Insurance
    insuranceSelected: {
      type: Boolean,
      default: false,
    },
    insuranceCost: {
      type: Number,
      default: 0,
    },
    // Admin Notes
    adminNotes: {
      type: String,
      trim: true,
    },
    // Cancellation Information
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    // Refund Information
    refundAmount: {
      type: Number,
      default: 0,
    },
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ carId: 1 });
bookingSchema.index({ pickupDate: 1, dropoffDate: 1 });
bookingSchema.index({ status: 1 });

// Virtual for total cost including insurance and additional charges
bookingSchema.virtual('totalCost').get(function () {
  return this.totalRent + this.additionalCharges + this.insuranceCost;
});

// Ensure virtuals are included when converting to JSON
bookingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);
