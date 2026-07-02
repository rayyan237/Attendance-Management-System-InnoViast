const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// --- MOUNT ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);         // ADDED: Routes for class creation
app.use('/api/attendance', attendanceRoutes); // ADDED: Routes for attendance

app.get('/', (req, res) => {
  res.send('Attendance API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});