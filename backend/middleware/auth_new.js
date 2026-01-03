const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware - Simplified for development
 */
const authenticate = async (req, res, next) => {
  try {
    // For development, skip authentication
    if (process.env.NODE_ENV !== 'production') {
      req.user = { id: 'dev-user', role: 'admin' };
      return next();
    }

    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

    // For now, just set a mock user
    req.user = decoded;
    next();

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

/**
 * Authorization middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // For development, allow all roles
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = { authenticate, authorize };


// middleware/auth_new.js - CHANGE TO ES6
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// /**
//  * Authentication middleware - Simplified for development
//  */
// export const authenticate = async (req, res, next) => {
//   try {
//     // For development, skip authentication
//     if (process.env.NODE_ENV !== 'production') {
//       req.user = { id: 'dev-user', role: 'admin' };
//       return next();
//     }

//     // Get token from header
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         success: false,
//         error: 'No token provided'
//       });
//     }

//     const token = authHeader.split(' ')[1];

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');

//     // For now, just set a mock user
//     req.user = decoded;
//     next();

//   } catch (error) {
//     console.error('Auth error:', error);
//     return res.status(401).json({
//       success: false,
//       error: 'Invalid token'
//     });
//   }
// };

// /**
//  * Authorization middleware
//  */
// export const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         error: 'Authentication required'
//       });
//     }

//     // For development, allow all roles
//     if (process.env.NODE_ENV !== 'production') {
//       return next();
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         error: 'Insufficient permissions'
//       });
//     }

//     next();
//   };
// };

// // If you want to export as default object
// // export default { authenticate, authorize };