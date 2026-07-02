const express = require('express');
const router = express.Router();

// Import both controllers
const { registerUser, loginUser } = require('../controllers/authController');

// Define the routes
router.post('/register', registerUser);
router.post('/login', loginUser); // Add this line

module.exports = router;