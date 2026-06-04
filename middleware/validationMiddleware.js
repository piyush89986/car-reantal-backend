// Validation Middleware - Input validation and sanitization
const validator = require('validator');

// Validate user registration input
const validateUserRegistration = (req, res, next) => {
  const { firstName, lastName, email, password, phone, address, city, state, zipCode, licenseNumber, licenseExpiry } = req.body;

  const errors = [];

  // First name validation
  if (!firstName || firstName.trim() === '') {
    errors.push('First name is required');
  } else if (firstName.length < 2) {
    errors.push('First name must be at least 2 characters');
  }

  // Last name validation
  if (!lastName || lastName.trim() === '') {
    errors.push('Last name is required');
  } else if (lastName.length < 2) {
    errors.push('Last name must be at least 2 characters');
  }

  // Email validation
  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  // Phone validation
  if (!phone || !/^\d{10}$/.test(phone)) {
    errors.push('Phone number must be 10 digits');
  }

  // Address validation
  if (!address || address.trim() === '') {
    errors.push('Address is required');
  }

  // City validation
  if (!city || city.trim() === '') {
    errors.push('City is required');
  }

  // State validation
  if (!state || state.trim() === '') {
    errors.push('State is required');
  }

  // Zip code validation
  if (!zipCode || zipCode.trim() === '') {
    errors.push('Zip code is required');
  }

  // License number validation
  if (!licenseNumber || licenseNumber.trim() === '') {
    errors.push('License number is required');
  }

  // License expiry validation
  if (!licenseExpiry) {
    errors.push('License expiry date is required');
  } else if (new Date(licenseExpiry) < new Date()) {
    errors.push('License has expired');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors,
    });
  }

  next();
};

// Validate user login input
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.trim() === '') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors,
    });
  }

  next();
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
};
