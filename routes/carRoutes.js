// Car Routes - API endpoints for car management
const express = require('express');
const router = express.Router();
const { addCar, getAllCars, getCarById, updateCar, deleteCar, deleteCarImage } = require('../controllers/carController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

// Public Routes
// GET /api/cars - Get all available cars with filters
router.get('/', getAllCars);

// GET /api/cars/:id - Get car details by ID
router.get('/:id', getCarById);

// Protected Admin Routes
// POST /api/cars - Add new car (Admin only)
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 5), addCar);

// PUT /api/cars/:id - Update car details (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.array('images', 5), updateCar);

// DELETE /api/cars/:id - Delete car (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCar);

// DELETE /api/cars/:id/image - Delete specific car image (Admin only)
router.delete('/:id/image', authMiddleware, adminMiddleware, deleteCarImage);

module.exports = router;
