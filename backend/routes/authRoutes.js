const express = require('express');
const router = express.Router();

// Import both controllers
const { registerUser, loginUser, getUsers, updateUser, deleteUser } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Define the routes
router.post('/register', registerUser);
router.post('/login', loginUser); 
router.get('/users', protect, authorizeRoles('Admin', 'Instructor'), getUsers);
// Update a user (Admin or Self)
router.put('/users/:id', protect, updateUser);
// Delete a user (Admin only)
router.delete('/users/:id', protect, authorizeRoles('Admin'), deleteUser);

module.exports = router;