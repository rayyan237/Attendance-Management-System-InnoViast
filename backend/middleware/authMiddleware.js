const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Verifies if the user is logged in
exports.protect = async (req, res, next) => {
  let token;

  // Check if the request header contains a token (Standard format: "Bearer <token>")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract just the token part
      token = req.headers.authorization.split(' ')[1];

      // Verify the token's wax seal using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database (excluding their password) and attach it to the request
      req.user = await User.findById(decoded.id).select('-passwordHash');

      // The keycard is valid. Pass them to the next function (the actual controller)
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. The "Role Bouncer" - Checks if the user has the right permissions
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user was set by the 'protect' middleware above
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};