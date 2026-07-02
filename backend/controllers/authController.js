const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user (Admin, Instructor, or Student)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    // 1. Extract the data sent from the frontend
    const { name, email, password, role } = req.body;

    // 2. Validation: Check if the user missed any fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 3. Check if a user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 4. Security: Hash the password
    const salt = await bcrypt.genSalt(10); // Generates a random string to mix with the password
    const hashedPassword = await bcrypt.hash(password, salt); // Creates the final scrambled password

    // 5. Create the user in the database
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword, // Save the HASH, never the plain password
      role: role || 'Student' // Default to Student if no role is provided
    });

    // 6. Send a success response back to the frontend
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during registration' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Did they provide both fields?
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find the user in the database
    const user = await User.findOne({ email });
    
    // 3. Security Standard: Vague Error Messages
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Check if the password matches the hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 5. Generate the JWT (The Digital Keycard)
    const token = jwt.sign(
      { id: user._id, role: user.role }, // The Payload (Data we want to attach to the token)
      process.env.JWT_SECRET,            // The Secret Signature
      { expiresIn: '1d' }                // Token expires in 1 day for security
    );

    // 6. Send the token and user data back to the React frontend
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during login' });
  }
};