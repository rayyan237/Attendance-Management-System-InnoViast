const Attendance = require('../models/Attendance');

// @desc    Mark or Update attendance for a specific class session
// @route   POST /api/attendance
exports.markAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    if (!classId || !date || !records) {
      return res.status(400).json({ message: 'Please provide classId, date, and records' });
    }

    // 1. Industry Standard: Date Normalization
    // We want to ensure we don't accidentally create two attendance sheets for the same day
    // just because they were submitted at different times (e.g., 9:00 AM vs 9:05 AM).
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0); // Set to midnight

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set to 11:59 PM

    // 2. The "Upsert" Pattern (Update or Insert)
    // First, check if an attendance sheet already exists for today
    let attendance = await Attendance.findOne({
      classId,
      date: { $gte: startOfDay, $lte: endOfDay } // Look for a date BETWEEN start and end of day
    });

    if (attendance) {
      // If it exists, they are just correcting a mistake (Update)
      attendance.records = records;
      await attendance.save();
      return res.status(200).json({ message: 'Attendance updated successfully', attendance });
    } else {
      // If it doesn't exist, this is the first roll call of the day (Insert)
      attendance = await Attendance.create({
        classId,
        date,
        records
      });
      return res.status(201).json({ message: 'Attendance marked successfully', attendance });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error marking attendance' });
  }
};