const express = require('express');
const router = express.Router();
const { createClass, getClasses } = require('../controllers/classController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// @route POST /api/classes
// Security: Must be logged in (protect), AND must be Admin or Instructor
router.post('/', protect, authorizeRoles('Admin', 'Instructor'), createClass);

// @route GET /api/classes
// Security: Must be logged in to view classes
router.get('/', protect, getClasses);

module.exports = router;