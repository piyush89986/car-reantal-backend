// Authentication Routes - API endpoints for auth operations
const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validationMiddleware');

// Public Routes
// POST /api/auth/register - Register a new user
router.post('/register', validateUserRegistration, register);

// POST /api/auth/login - Login user
router.post('/login', validateUserLogin, login);

// Protected Routes (require authentication)
// GET /api/auth/profile - Get current user profile
router.get('/profile', authMiddleware, getProfile);

// PUT /api/auth/profile - Update user profile
router.put('/profile', authMiddleware, updateProfile);

// PUT /api/auth/change-password - Change user password
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
