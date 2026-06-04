// Car Controller - Handles car management operations
const Car = require('../models/Car');
const path = require('path');
const fs = require('fs');

// Add new car (Admin only)
const addCar = async (req, res) => {
  try {
    const { name, brand, model, year, color, fuelType, transmission, seatingCapacity, mileage, rentPerDay, features, description } = req.body;

    // Validate required fields
    if (!name || !brand || !model || !year || !fuelType || !transmission || !seatingCapacity || !rentPerDay) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Get image paths from uploaded files
    const images = req.files ? req.files.map(file => `/uploads/cars/${file.filename}`) : [];

    // Create new car
    const newCar = new Car({
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim(),
      year: parseInt(year),
      color: color.trim(),
      fuelType,
      transmission,
      seatingCapacity: parseInt(seatingCapacity),
      mileage: parseInt(mileage),
      rentPerDay: parseFloat(rentPerDay),
      images,
      features: features ? JSON.parse(features) : [],
      description: description ? description.trim() : '',
      addedBy: req.userId,
      isAvailable: true,
    });

    // Save to database
    await newCar.save();

    res.status(201).json({
      success: true,
      message: 'Car added successfully',
      car: newCar,
    });
  } catch (error) {
    console.error('Add car error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding car',
      error: error.message,
    });
  }
};

// Get all cars with filters
const getAllCars = async (req, res) => {
  try {
    const { brand, fuelType, seatingCapacity, minPrice, maxPrice, search } = req.query;

    // Build filter object
    const filter = { isAvailable: true };

    if (brand) {
      filter.brand = brand;
    }

    if (fuelType) {
      filter.fuelType = fuelType;
    }

    if (seatingCapacity) {
      filter.seatingCapacity = parseInt(seatingCapacity);
    }

    if (minPrice || maxPrice) {
      filter.rentPerDay = {};
      if (minPrice) filter.rentPerDay.$gte = parseFloat(minPrice);
      if (maxPrice) filter.rentPerDay.$lte = parseFloat(maxPrice);
    }

    // Text search by car name
    if (search) {
      filter.$text = { $search: search };
    }

    // Fetch cars with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cars = await Car.find(filter)
      .limit(limit)
      .skip(skip)
      .populate('addedBy', 'firstName lastName email');

    const total = await Car.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Cars retrieved successfully',
      data: cars,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving cars',
      error: error.message,
    });
  }
};

// Get car details by ID
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findById(id).populate('addedBy', 'firstName lastName email');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car details retrieved',
      car,
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving car',
      error: error.message,
    });
  }
};

// Update car details (Admin only)
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, model, year, color, fuelType, transmission, seatingCapacity, mileage, rentPerDay, features, description, isAvailable } = req.body;

    // Find car
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Update basic info
    if (name) car.name = name.trim();
    if (brand) car.brand = brand.trim();
    if (model) car.model = model.trim();
    if (year) car.year = parseInt(year);
    if (color) car.color = color.trim();
    if (fuelType) car.fuelType = fuelType;
    if (transmission) car.transmission = transmission;
    if (seatingCapacity) car.seatingCapacity = parseInt(seatingCapacity);
    if (mileage) car.mileage = parseInt(mileage);
    if (rentPerDay) car.rentPerDay = parseFloat(rentPerDay);
    if (description) car.description = description.trim();
    if (features) car.features = JSON.parse(features);
    if (isAvailable !== undefined) car.isAvailable = isAvailable;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/cars/${file.filename}`);
      car.images = [...car.images, ...newImages];
    }

    car.updatedAt = Date.now();

    // Save updated car
    await car.save();

    res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      car,
    });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating car',
      error: error.message,
    });
  }
};

// Delete car (Admin only)
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByIdAndDelete(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Delete associated image files
    if (car.images && car.images.length > 0) {
      car.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully',
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting car',
      error: error.message,
    });
  }
};

// Delete specific image from car
const deleteCarImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found',
      });
    }

    // Remove image from array
    car.images = car.images.filter(img => img !== imageUrl);

    // Delete image file from disk
    const fullPath = path.join(__dirname, '../', imageUrl);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await car.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      car,
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message,
    });
  }
};

module.exports = {
  addCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
  deleteCarImage,
};
