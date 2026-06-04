// Car Model - Handles car inventory and details
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    // Car Information
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Car brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Car model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Car year is required'],
      min: 1990,
      max: new Date().getFullYear() + 1,
    },
    color: {
      type: String,
      required: [true, 'Car color is required'],
    },
    // Specifications
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
      required: [true, 'Fuel type is required'],
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      required: [true, 'Transmission type is required'],
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: 2,
      max: 8,
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
    },
    // Pricing
    rentPerDay: {
      type: Number,
      required: [true, 'Rent per day is required'],
      min: 0,
    },
    // Images - storing file paths
    images: [
      {
        type: String, // URL/path to image
        default: null,
      },
    ],
    // Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },
    // Features
    features: [
      {
        type: String,
        // Examples: 'Air Conditioning', 'Power Steering', 'ABS', etc.
      },
    ],
    // Description
    description: {
      type: String,
      trim: true,
    },
    // Owner/Added by Admin
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

// Index for faster searches
carSchema.index({ brand: 1, fuelType: 1, seatingCapacity: 1 });
carSchema.index({ name: 'text' });

module.exports = mongoose.model('Car', carSchema);
