const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Class = require('../models/Class');
const { Parser } = require('json2csv');

// @desc    Get dashboard summary statistics
// @route   GET /api/reports/summary
exports.getDashboardSummary = async (req, res) => {
  try {
    // Run multiple independent database queries at the exact same time for speed
    const [totalStudents, totalClasses, todaySessions] = await Promise.all([
      User.countDocuments({ role: 'Student' }),
      Class.countDocuments(),
      // Find attendance sheets created specifically today
      Attendance.countDocuments({
        date: { 
          $gte: new Date().setHours(0, 0, 0, 0),
          $lte: new Date().setHours(23, 59, 59, 999) 
        }
      })
    ]);

    res.status(200).json({
      totalStudents,
      totalClasses,
      todaySessions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error generating summary' });
  }
};

// @desc    Get filtered attendance report
// @route   GET /api/reports/attendance
exports.getAttendanceReport = async (req, res) => {
  try {
    // 1. Extract Query Parameters (e.g., ?classId=123&startDate=2026-07-01)
    const { classId, startDate, endDate, status, studentId } = req.query;
    let { studentId } = req.query; // Make this a let, not const

    // SECURITY OVERRIDE: If a Student is making this request, force the filter to their exact ID
    if (req.user.role === 'Student') {
      studentId = req.user._id.toString();
    }

    // 2. Build a Dynamic Query Object
    let query = {};

    if (classId) query.classId = classId;
    
    // If dates are provided, filter between them
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    // 3. Fetch data and populate relationships
    let attendanceData = await Attendance.find(query)
      .populate('classId', 'className')
      .populate('records.studentId', 'name email');

    // 4. Advanced Filtering (In-Memory)
    // If they only want to see "Late" students, or a specific student's history
    if (status || studentId) {
      attendanceData = attendanceData.map(session => {
        // Filter the inner records array
        const filteredRecords = session.records.filter(record => {
          let match = true;
          if (status && record.status !== status) match = false;
          if (studentId && record.studentId._id.toString() !== studentId) match = false;
          return match;
        });
        
        // Return a new session object with only the filtered records
        return { ...session.toObject(), records: filteredRecords };
      }).filter(session => session.records.length > 0); // Remove empty sessions
    }

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error generating report' });
  }
};

// @desc    Export filtered attendance to CSV
// @route   GET /api/reports/export
exports.exportAttendanceCSV = async (req, res) => {
  try {
    // For simplicity, we reuse the exact same dynamic query logic as above
    const { classId, startDate, endDate } = req.query;
    let query = {};
    if (classId) query.classId = classId;
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const attendanceData = await Attendance.find(query)
      .populate('classId', 'className')
      .populate('records.studentId', 'name email');

    // 1. Flatten the data for the CSV (Spreadsheets don't like nested arrays)
    let csvData = [];
    attendanceData.forEach(session => {
      session.records.forEach(record => {
        csvData.push({
          Class: session.classId.className,
          Date: new Date(session.date).toLocaleDateString(),
          StudentName: record.studentId.name,
          Email: record.studentId.email,
          Status: record.status
        });
      });
    });

    if (csvData.length === 0) {
      return res.status(404).json({ message: 'No data found to export' });
    }

    // 2. Convert to CSV format
    const json2csvParser = new Parser();
    const csvString = json2csvParser.parse(csvData);

    // 3. Set standard HTTP headers to force a file download in the browser
    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    
    // 4. Send the file!
    return res.send(csvString);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error exporting CSV' });
  }
};