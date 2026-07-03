const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Verifies if the user is logged in
exports.protect = async (req, res, next) => {
  let token;
  // Check headers OR URL query parameters
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token; // The fix for the CSV Export!
  }

  if (!token) return res.status(401).json({ message: 'Not authorized, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash');
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
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