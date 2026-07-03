const express = require('express');
const router = express.Router();
const { getDashboardSummary, getAttendanceReport, exportAttendanceCSV } = require('../controllers/reportController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// @route   GET /api/reports/summary
router.get('/summary', protect, authorizeRoles('Admin', 'Instructor'), getDashboardSummary);

// @route   GET /api/reports/attendance
router.get('/attendance', protect, authorizeRoles('Admin', 'Instructor', 'Student'), getAttendanceReport);

// @route   GET /api/reports/export
router.get('/export', protect, authorizeRoles('Admin', 'Instructor'), exportAttendanceCSV);

module.exports = router;