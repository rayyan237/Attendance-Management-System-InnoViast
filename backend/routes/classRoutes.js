const express = require('express');
const router = express.Router();
const { createClass, getClasses, updateClass } = require('../controllers/classController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// @route POST /api/classes
// Security: Must be logged in (protect), AND must be Admin or Instructor
router.post('/', protect, authorizeRoles('Admin', 'Instructor'), createClass);

// @route GET /api/classes
// Security: Must be logged in to view classes
router.get('/', protect, getClasses);

//@route PUT /api/classes/:id
// (Restricted to Admins)
router.put('/:id', protect, authorizeRoles('Admin'), updateClass);

module.exports = router;