const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true // e.g., "Full-Stack Batch 4"
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the User model
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // An array of IDs linking to Student users
  }]
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);