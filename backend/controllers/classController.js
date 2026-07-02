const Class = require('../models/Class');
const User = require('../models/User');

// @desc    Create a new class/cohort
// @route   POST /api/classes
exports.createClass = async (req, res) => {
  try {
    const { className, students } = req.body;

    // 1. Validation
    if (!className) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    // 2. Creation - Notice how we use req.user._id!
    const newClass = await Class.create({
      className,
      instructorId: req.user._id, // The middleware automatically provides this!
      students: students || []    // Default to an empty array if no students are added yet
    });

    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during class creation' });
  }
};

// @desc    Get all classes for the logged-in user
// @route   GET /api/classes
exports.getClasses = async (req, res) => {
  try {
    // 3. Industry Standard: The Populate Method
    // We search for classes, but we tell Mongoose to swap the instructorId and student IDs 
    // with their actual names and emails from the Users collection.
    const classes = await Class.find()
      .populate('instructorId', 'name email')
      .populate('students', 'name email');

    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching classes' });
  }
};