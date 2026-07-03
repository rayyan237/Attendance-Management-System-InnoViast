const Class = require('../models/Class');
const User = require('../models/User');

// @desc    Create a new class/cohort
// @route   POST /api/classes
exports.createClass = async (req, res) => {
  try {
    const { className, students, instructorId } = req.body;
    
    // Logic Fix: If Admin, use the ID they picked. If Instructor, force their own ID.
    const finalInstructorId = req.user.role === 'Admin' ? instructorId : req.user._id;

    const newClass = await Class.create({
      className,
      instructorId: finalInstructorId,
      students: students || []
    });

    res.status(201).json({ message: 'Class created', class: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Server Error during class creation' });
  }
};

// @desc    Get all classes for the logged-in user
// @route   GET /api/classes
exports.getClasses = async (req, res) => {
  try {
    let query = {};
    
    // RBAC LOGIC: If the user is an Instructor, only look for their classes
    if (req.user.role === 'Instructor') {
      query.instructorId = req.user._id;
    }
    // (If Admin, the query remains {}, meaning fetch all)

    const classes = await Class.find(query)
      .populate('instructorId', 'name email')
      .populate('students', 'name email');

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching classes' });
  }
};

// @desc    Update a class (Change instructor or students)
// @route   PUT /api/classes/:id
exports.updateClass = async (req, res) => {
  try {
    const { className, instructorId, students } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { className, instructorId, students },
      { new: true }
    );
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating class' });
  }
};