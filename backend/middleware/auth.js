// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const logger = require('../utils/logger');

// /**
//  * Authentication middleware
//  */
// const authenticate = async (req, res, next) => {
//   try {
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
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Check if user exists and is active
//     const user = await User.findById(decoded.userId).select('-password -refreshToken');
    
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         error: 'Account is deactivated'
//       });
//     }

//     if (user.isBlocked) {
//       return res.status(401).json({
//         success: false,
//         error: 'Account is blocked'
//       });
//     }

//     // Check if account is locked due to failed login attempts
//     if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
//       return res.status(401).json({
//         success: false,
//         error: 'Account is temporarily locked'
//       });
//     }

//     // Add user to request
//     req.user = {
//       userId: user._id,
//       email: user.email,
//       name: user.name,
//       role: user.role,
//       permissions: user.getPermissions()
//     };

//     // Update last activity
//     user.lastActivity = new Date();
//     await user.save();

//     next();
//   } catch (error) {
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         error: 'Invalid token'
//       });
//     }

//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         error: 'Token expired'
//       });
//     }

//     logger.error('Authentication error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Authentication failed'
//     });
//   }
// };

// /**
//  * Authorization middleware
//  */
// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         error: 'Authentication required'
//       });
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

// /**
//  * Rate limiting middleware
//  */
// const rateLimit = (options = {}) => {
//   const {
//     windowMs = 15 * 60 * 1000, // 15 minutes
//     max = 100, // limit each IP to 100 requests per windowMs
//     keyGenerator = (req) => req.ip,
//     skipSuccessfulRequests = false
//   } = options;

//   const requests = new Map();

//   return (req, res, next) => {
//     const key = keyGenerator(req);
//     const now = Date.now();
//     const windowStart = now - windowMs;

//     // Clean up old entries
//     for (const [k, entry] of requests.entries()) {
//       if (entry.timestamp < windowStart) {
//         requests.delete(k);
//       }
//     }

//     // Get or create entry for this key
//     let entry = requests.get(key);
//     if (!entry) {
//       entry = { count: 0, timestamp: now };
//       requests.set(key, entry);
//     }

//     // Check if limit exceeded
//     if (entry.count >= max) {
//       const resetTime = Math.ceil((entry.timestamp + windowMs - now) / 1000);
      
//       res.setHeader('X-RateLimit-Limit', max);
//       res.setHeader('X-RateLimit-Remaining', 0);
//       res.setHeader('X-RateLimit-Reset', resetTime);
      
//       return res.status(429).json({
//         success: false,
//         error: 'Too many requests, please try again later',
//         retryAfter: resetTime
//       });
//     }

//     // Increment counter
//     entry.count++;
    
//     // Update timestamp for sliding window
//     if (skipSuccessfulRequests && res.statusCode < 400) {
//       // Don't update timestamp for successful requests if skipSuccessfulRequests is true
//     } else {
//       entry.timestamp = now;
//     }

//     // Set rate limit headers
//     res.setHeader('X-RateLimit-Limit', max);
//     res.setHeader('X-RateLimit-Remaining', max - entry.count);
//     res.setHeader('X-RateLimit-Reset', Math.ceil((entry.timestamp + windowMs - now) / 1000));

//     next();
//   };
// };

// /**
//  * Validate API key middleware
//  */
// const validateApiKey = (req, res, next) => {
//   const apiKey = req.headers['x-api-key'] || req.query.apiKey;

//   if (!apiKey) {
//     return res.status(401).json({
//       success: false,
//       error: 'API key required'
//     });
//   }

//   // Validate API key (in production, this would check against a database)
//   const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
//   if (!validApiKeys.includes(apiKey)) {
//     return res.status(401).json({
//       success: false,
//       error: 'Invalid API key'
//     });
//   }

//   next();
// };

// /**
//  * CORS middleware
//  */
// const cors = (options = {}) => {
//   const {
//     origin = process.env.ALLOWED_ORIGINS || '*',
//     methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders = ['Content-Type', 'Authorization', 'X-API-Key'],
//     credentials = true,
//     maxAge = 86400 // 24 hours
//   } = options;

//   return (req, res, next) => {
//     // Set CORS headers
//     if (origin === '*') {
//       res.setHeader('Access-Control-Allow-Origin', '*');
//     } else {
//       const requestOrigin = req.headers.origin;
//       const allowedOrigins = origin.split(',');
      
//       if (allowedOrigins.includes(requestOrigin)) {
//         res.setHeader('Access-Control-Allow-Origin', requestOrigin);
//       }
//     }

//     res.setHeader('Access-Control-Allow-Methods', methods.join(','));
//     res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(','));
    
//     if (credentials) {
//       res.setHeader('Access-Control-Allow-Credentials', 'true');
//     }
    
//     res.setHeader('Access-Control-Max-Age', maxAge);

//     // Handle preflight requests
//     if (req.method === 'OPTIONS') {
//       return res.status(200).end();
//     }

//     next();
//   };
// };

// /**
//  * Request logging middleware
//  */
// const requestLogger = (req, res, next) => {
//   const start = Date.now();
  
//   // Log request
//   logger.info(`${req.method} ${req.url} - ${req.ip} - ${req.headers['user-agent']}`);
  
//   // Log response
//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     logger.info(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
//   });

//   next();
// };

// /**
//  * Error handling middleware
//  */
// const errorHandler = (err, req, res, next) => {
//   logger.error('Unhandled error:', {
//     message: err.message,
//     stack: err.stack,
//     url: req.url,
//     method: req.method,
//     ip: req.ip
//   });

//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     return res.status(400).json({
//       success: false,
//       error: 'Validation failed',
//       details: Object.values(err.errors).map(e => e.message)
//     });
//   }

//   // Mongoose duplicate key error
//   if (err.code === 11000) {
//     return res.status(409).json({
//       success: false,
//       error: 'Duplicate key error',
//       message: 'Resource already exists'
//     });
//   }

//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       success: false,
//       error: 'Invalid token'
//     });
//   }

//   if (err.name === 'TokenExpiredError') {
//     return res.status(401).json({
//       success: false,
//       error: 'Token expired'
//     });
//   }

//   // Default error
//   res.status(err.status || 500).json({
//     success: false,
//     error: err.message || 'Internal server error'
//   });
// };

// module.exports = {
//   authenticate,
//   authorize,
//   rateLimit,
//   validateApiKey,
//   cors,
//   requestLogger,
//   errorHandler
// };


// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authenticate = async (req, res, next) => {
//   try {
//     // Get token from header or cookie
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     } else if (req.cookies && req.cookies.accessToken) {
//       token = req.cookies.accessToken;
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Access denied. No token provided.'
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

//     // Check if user still exists
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User no longer exists.'
//       });
//     }

//     // Check if user is active
//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: 'User account is deactivated.'
//       });
//     }

//     // Check if password was changed after token was issued
//     if (user.changedPasswordAfter(decoded.iat)) {
//       return res.status(401).json({
//         success: false,
//         message: 'Password was changed. Please login again.'
//       });
//     }

//     // Attach user to request
//     req.user = decoded;
//     next();
//   } catch (error) {
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token.'
//       });
//     }
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Token expired.'
//       });
//     }
//     res.status(500).json({
//       success: false,
//       message: 'Authentication failed.'
//     });
//   }
// };

// const authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Role ${req.user.role} is not authorized to access this resource`
//       });
//     }
//     next();
//   };
// };

// module.exports = { authenticate, authorize };

const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const User = require('../models/User');
const Token = require('../models/Token');
const logger = require('../utils/logger');

/**
 * Security middleware - Apply security headers
 */
const securityHeaders = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  });
};

/**
 * CORS configuration middleware
 */
const corsMiddleware = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000'];

  return cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400 // 24 hours
  });
};

/**
 * Rate limiting middleware
 */
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100,
    message = 'Too many requests from this IP, please try again later.',
    skipFailedRequests = false,
    keyGenerator = (req) => req.ip
  } = options;

  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    skipFailedRequests,
    keyGenerator,
    handler: (req, res, next, options) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        url: req.url,
        method: req.method
      });
      
      res.setHeader('Retry-After', Math.ceil(options.windowMs / 1000));
      res.status(options.statusCode).json(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Specific rate limiters for different endpoints
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipFailedRequests: false
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many API requests, please try again later.'
});

const strictLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many sensitive requests, please try again in an hour.'
});

/**
 * Authentication middleware - Verify JWT tokens
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header, cookie, or query parameter
    let token;
    
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Check query parameter (for file downloads, etc.)
    else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'ACCESS_DENIED',
        message: 'No authentication token provided'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'TOKEN_EXPIRED',
          message: 'Authentication token has expired'
        });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Invalid authentication token'
        });
      }
      throw error;
    }

    // Check if token is blacklisted
    const blacklistedToken = await Token.findOne({
      token: token,
      type: 'access',
      isRevoked: true
    });

    if (blacklistedToken) {
      return res.status(401).json({
        success: false,
        error: 'TOKEN_REVOKED',
        message: 'Authentication token has been revoked'
      });
    }

    // Find user
    const user = await User.findById(decoded.userId)
      .select('+lastActivity +loginAttempts +lockedUntil +isBlocked +passwordChangedAt')
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User account no longer exists'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'ACCOUNT_DEACTIVATED',
        message: 'User account is deactivated'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_BLOCKED',
        message: 'User account is blocked by administrator'
      });
    }

    // Check if account is locked due to failed attempts
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json({
        success: false,
        error: 'ACCOUNT_LOCKED',
        message: 'Account is temporarily locked due to multiple failed attempts',
        lockedUntil: user.lockedUntil
      });
    }

    // Check if password was changed after token was issued
    if (user.passwordChangedAt) {
      const passwordChangedTimestamp = Math.floor(user.passwordChangedAt.getTime() / 1000);
      if (decoded.iat < passwordChangedTimestamp) {
        return res.status(401).json({
          success: false,
          error: 'PASSWORD_CHANGED',
          message: 'Password was changed recently. Please login again.'
        });
      }
    }

    // Check if token version matches (for forced logout)
    if (decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        error: 'SESSION_EXPIRED',
        message: 'Session has expired. Please login again.'
      });
    }

    // Attach user to request
    req.user = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions || [],
      tokenVersion: user.tokenVersion
    };

    // Log authentication success
    logger.info('Authentication successful', {
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    next();
  } catch (error) {
    logger.error('Authentication middleware error:', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      url: req.url
    });

    res.status(500).json({
      success: false,
      error: 'AUTHENTICATION_FAILED',
      message: 'Authentication process failed'
    });
  }
};

/**
 * Authorization middleware - Check user roles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Unauthorized access attempt', {
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        ip: req.ip,
        url: req.url
      });

      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'Insufficient permissions to access this resource'
      });
    }

    next();
  };
};

/**
 * Permission-based authorization middleware
 */
const hasPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required'
      });
    }

    // Check if user has admin role (admins have all permissions)
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user has required permissions
    const hasAllPermissions = requiredPermissions.every(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      logger.warn('Insufficient permissions', {
        userId: req.user.userId,
        userPermissions: req.user.permissions,
        requiredPermissions,
        ip: req.ip,
        url: req.url
      });

      return res.status(403).json({
        success: false,
        error: 'INSUFFICIENT_PERMISSIONS',
        message: 'You do not have the required permissions'
      });
    }

    next();
  };
};

/**
 * API Key validation middleware
 */
const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API_KEY_REQUIRED',
        message: 'API key is required for this endpoint'
      });
    }

    // In a real application, you would validate against a database
    // For now, we'll check against environment variable
    const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

    if (!validApiKeys.includes(apiKey)) {
      logger.warn('Invalid API key attempt', {
        apiKey: apiKey.substring(0, 10) + '...', // Log partial key for security
        ip: req.ip,
        url: req.url
      });

      return res.status(401).json({
        success: false,
        error: 'INVALID_API_KEY',
        message: 'Invalid API key'
      });
    }

    // Optional: Track API key usage
    req.apiKey = apiKey;
    next();
  } catch (error) {
    logger.error('API key validation error:', error);
    res.status(500).json({
      success: false,
      error: 'API_KEY_VALIDATION_FAILED',
      message: 'Failed to validate API key'
    });
  }
};

/**
 * Request validation middleware
 */
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body
      if (schema.body) {
        await schema.body.validateAsync(req.body, {
          abortEarly: false,
          stripUnknown: true
        });
      }

      // Validate request query
      if (schema.query) {
        await schema.query.validateAsync(req.query, {
          abortEarly: false,
          stripUnknown: true
        });
      }

      // Validate request params
      if (schema.params) {
        await schema.params.validateAsync(req.params, {
          abortEarly: false,
          stripUnknown: true
        });
      }

      next();
    } catch (error) {
      if (error.isJoi) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          errors
        });
      }

      logger.error('Request validation error:', error);
      res.status(500).json({
        success: false,
        error: 'VALIDATION_PROCESS_FAILED',
        message: 'Failed to validate request'
      });
    }
  };
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Skip logging for health checks and static files
  if (req.path === '/health' || req.path.startsWith('/static/')) {
    return next();
  }

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer || 'direct',
    contentType: req.headers['content-type'],
    contentLength: req.headers['content-length']
  });

  // Capture response
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: body ? body.length : 0,
      userId: req.user ? req.user.userId : 'anonymous'
    });

    originalSend.call(this, body);
  };

  next();
};

/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userId: req.user ? req.user.userId : 'anonymous',
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Handle specific error types
  if (err.name === 'ValidationError') { // Mongoose validation error
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Database validation failed',
      errors
    });
  }

  if (err.code === 11000) { // MongoDB duplicate key error
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: 'DUPLICATE_ENTRY',
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    });
  }

  if (err.name === 'CastError') { // MongoDB cast error
    return res.status(400).json({
      success: false,
      error: 'INVALID_ID',
      message: 'Invalid identifier provided'
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid authentication token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired'
    });
  }

  // Handle custom error with status code
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.error || 'UNKNOWN_ERROR',
      message: err.message
    });
  }

  // Default error response
  const statusCode = err.status || 500;
  const errorResponse = {
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Not found middleware
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.url}`
  });
};

/**
 * Async handler wrapper - Eliminates try-catch blocks in route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validate content type middleware
 */
const validateContentType = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    if (req.method === 'GET' || req.method === 'DELETE') {
      return next();
    }

    const contentType = req.headers['content-type'];
    
    if (!contentType) {
      return res.status(400).json({
        success: false,
        error: 'CONTENT_TYPE_REQUIRED',
        message: 'Content-Type header is required'
      });
    }

    const isAllowed = allowedTypes.some(type => contentType.includes(type));
    
    if (!isAllowed) {
      return res.status(415).json({
        success: false,
        error: 'UNSUPPORTED_MEDIA_TYPE',
        message: `Content-Type must be one of: ${allowedTypes.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Request timeout middleware
 */
const timeout = (milliseconds = 30000) => {
  return (req, res, next) => {
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          error: 'REQUEST_TIMEOUT',
          message: 'Request timeout. Please try again.'
        });
      }
    }, milliseconds);

    // Clear timeout on successful response
    res.on('finish', () => clearTimeout(timeoutId));
    next();
  };
};

module.exports = {
  // Security
  securityHeaders,
  corsMiddleware,
  
  // Rate limiting
  createRateLimiter,
  authLimiter,
  apiLimiter,
  strictLimiter,
  
  // Authentication & Authorization
  authenticate,
  authorize,
  hasPermission,
  validateApiKey,
  
  // Request handling
  validateRequest,
  requestLogger,
  validateContentType,
  timeout,
  
  // Error handling
  errorHandler,
  notFound,
  asyncHandler
};