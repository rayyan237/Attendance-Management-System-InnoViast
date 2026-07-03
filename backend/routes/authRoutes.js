const express = require('express');
const router = express.Router();

// Import both controllers
const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Define the routes
router.post('/register', registerUser);
router.post('/login', loginUser); 
router.get('/users', protect, authorizeRoles('Admin', 'Instructor'), getUsers);

module.exports = router;