const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Removes accidental white spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate accounts
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true // We store a hash, NEVER the plain text password
  },
  role: {
    type: String,
    enum: ['Admin', 'Instructor', 'Student'], // Strict validation
    default: 'Student'
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);