const express = require('express');
const router = express.Router();
const { markAttendance } = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// @route POST /api/attendance
// Security: Only Admins and Instructors can mark attendance
router.post('/', protect, authorizeRoles('Admin', 'Instructor'), markAttendance);

module.exports = router;