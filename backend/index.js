// import dotenv from 'dotenv';
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import rateLimit from 'express-rate-limit';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import fs from 'fs';

// // Import middleware
// import { errorHandler } from './src/middleware/error.middleware.js';
// import { requestLogger } from './src/middleware/logger.middleware.js';
// import { notFoundHandler } from './src/middleware/error.middleware.js';

// // Import routes
// import pricingRoutes from './src/routes/pricing.routes.js';
// import shareRoutes from './src/routes/share.routes.js';
// import automationRoutes from './src/routes/automation.routes.js';
// import authRoutes from './src/routes/ecommerce/auth.routes.js';
// import userRoutes from './src/routes/ecommerce/user.routes.js';
// import dataRoutes from './src/routes/ecommerce/data.routes.js';
// import sellerRoutes from './src/routes/ecommerce/seller.routes.js';
// import productRoutes from './src/routes/ecommerce/product.routes.js';
// import applicationRoutes from './src/routes/ecommerce/application.routes.js';
// import mediaRoutes from './src/routes/ecommerce/media.routes.js';

// // Import services
// import { startAutomationEngine, stopAutomationEngine } from './src/services/pricing/automation.service.js';

// // Import utils
// import logger from './src/utils/logger.js';

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 8000;

// // Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // -------------------------
// // DATABASE CONNECTION
// // -------------------------
// const connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pricing-automation';
    
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000,
//       maxPoolSize: 10,
//       socketTimeoutMS: 45000,
//       family: 4
//     };

//     await mongoose.connect(mongoURI, options);
    
//     logger.info('✅ MongoDB connected successfully');
    
//     // Event listeners for MongoDB
//     mongoose.connection.on('connected', () => {
//       logger.info('Mongoose connected to DB');
//     });

//     mongoose.connection.on('error', (err) => {
//       logger.error('Mongoose connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
//       logger.warn('Mongoose disconnected from DB');
//     });

//   } catch (error) {
//     logger.error('❌ MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// // -------------------------
// // CREATE UPLOAD DIRECTORIES
// // -------------------------
// const createUploadDirectories = () => {
//   const baseDir = join(__dirname, 'src', 'uploads');
//   const directories = [
//     join(baseDir, 'images'),
//     join(baseDir, 'videos'),
//     join(baseDir, 'documents'),
//     join(baseDir, 'profiles'),
//     join(baseDir, 'products')
//   ];

//   directories.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       logger.info(`📁 Created directory: ${dir}`);
//     }
//   });

//   return baseDir;
// };

// // Create directories
// const uploadBaseDir = createUploadDirectories();

// // -------------------------
// // MIDDLEWARE SETUP
// // -------------------------

// // Security headers
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'", "data:", "https:"],
//     },
//   },
//   crossOriginEmbedderPolicy: false,
// }));

// // CORS configuration
// const corsOptions = {
//   origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   maxAge: 86400 // 24 hours
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Handle preflight requests

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000, // requests per window
//   message: {
//     success: false,
//     error: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skipSuccessfulRequests: false,
// });

// // Apply rate limiting to API routes only
// app.use('/api/', limiter);

// // Body parsing middleware with increased limits
// app.use(express.json({ 
//   limit: process.env.MAX_JSON_SIZE || '10mb',
//   verify: (req, res, buf) => {
//     req.rawBody = buf.toString();
//   }
// }));

// app.use(express.urlencoded({ 
//   extended: true, 
//   limit: process.env.MAX_URLENCODED_SIZE || '10mb' 
// }));

// // Compression
// app.use(compression({
//   level: 6,
//   threshold: 100 * 1024, // compress responses over 100KB
// }));

// // Request logging middleware
// app.use(requestLogger);

// // Static files - serve uploads directory
// app.use('/uploads', express.static(uploadBaseDir, {
//   maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0',
//   setHeaders: (res, path) => {
//     if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
//       res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year for images
//     }
//   }
// }));

// // -------------------------
// // API ROUTES
// // -------------------------

// // Health check route (no auth required)
// app.get('/', (req, res) => {
//   res.json({ 
//     message: '🚀 Pricing Automation & E-commerce API is running successfully!',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     environment: process.env.NODE_ENV || 'development',
//     endpoints: {
//       auth: '/api/auth',
//       users: '/api/users',
//       data: '/api/data',
//       sellers: '/api/sellers',
//       products: '/api/products',
//       applications: '/api/applications',
//       pricing: '/api/pricing',
//       automation: '/api/automation',
//       share: '/api/share'
//     }
//   });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK',
//     message: 'Server is healthy 🟢',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // E-commerce routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/data', dataRoutes);
// app.use('/api/sellers', sellerRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/media', mediaRoutes);

// // Pricing automation routes
// app.use('/api/pricing', pricingRoutes);
// app.use('/api/share', shareRoutes);
// app.use('/api/automation', automationRoutes);

// // -------------------------
// // ERROR HANDLING
// // -------------------------

// // 404 handler
// app.use(notFoundHandler);

// // Global error handler
// app.use(errorHandler);

// // -------------------------
// // GRACEFUL SHUTDOWN
// // -------------------------
// const gracefulShutdown = async (signal) => {
//   logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
//   try {
//     // Stop automation engine
//     await stopAutomationEngine();
    
//     // Close MongoDB connection
//     await mongoose.connection.close(false);
//     logger.info('MongoDB connection closed');
    
//     // Exit process
//     setTimeout(() => {
//       logger.info('Graceful shutdown completed');
//       process.exit(0);
//     }, 1000);
    
//   } catch (error) {
//     logger.error('Error during graceful shutdown:', error);
//     process.exit(1);
//   }
// };

// // Register signal handlers
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// // Handle unhandled rejections
// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (error) => {
//   logger.error('Uncaught Exception:', error);
//   process.exit(1);
// });

// // -------------------------
// // START SERVER
// // -------------------------
// const startServer = async () => {
//   try {
//     // Connect to database
//     await connectDB();
    
//     // Start server
//     const server = app.listen(PORT, () => {
//       logger.info('\n' + '='.repeat(60));
//       logger.info(`✅ Server running on port ${PORT}`);
//       logger.info(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
//       logger.info(`🔗 Local: http://localhost:${PORT}`);
//       logger.info(`📊 Health: http://localhost:${PORT}/api/health`);
//       logger.info(`📁 Uploads: http://localhost:${PORT}/uploads`);
//       logger.info('='.repeat(60) + '\n');
      
//       // Log loaded routes
//       logger.info('Loaded API Routes:');
//       app._router.stack.forEach((middleware) => {
//         if (middleware.route) {
//           const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
//           logger.info(`  ${methods.padEnd(7)} ${middleware.route.path}`);
//         } else if (middleware.name === 'router') {
//           middleware.handle.stack.forEach((handler) => {
//             if (handler.route) {
//               const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
//               logger.info(`  ${methods.padEnd(7)} ${handler.route.path}`);
//             }
//           });
//         }
//       });
//     });
    
//     // Start automation engine if enabled
//     if (process.env.AUTOMATION_ENABLED === 'true') {
//       try {
//         await startAutomationEngine();
//         logger.info('✅ Automation engine started successfully');
//       } catch (error) {
//         logger.error('Failed to start automation engine:', error);
//       }
//     }
    
//     // Server error handling
//     server.on('error', (error) => {
//       if (error.code === 'EADDRINUSE') {
//         logger.error(`Port ${PORT} is already in use`);
//         process.exit(1);
//       } else {
//         throw error;
//       }
//     });
    
//     return server;
    
//   } catch (error) {
//     logger.error('❌ Failed to start server:', error);
//     process.exit(1);
//   }
// };

// // Start the server
// startServer();

// export default app;



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const compression = require('compression');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// const fs = require('fs');

// // Load environment variables
// dotenv.config();

// // Import routes - Original routes
// const paymentRoutes = require('./routes/payment.routes');
// const planRoutes = require('./routes/plan.routes');
// const couponRoutes = require('./routes/coupon.routes');
// const analyticsRoutes = require('./routes/analytics.routes');

// // Import routes - New routes
// const pricingRoutes = require('./routes/pricing.routes');
// const shareRoutes = require('./routes/share.routes');
// const automationRoutes = require('./routes/automation.routes');
// const authRoutes = require('./routes/ecommerce/auth.routes');
// const userRoutes = require('./routes/ecommerce/user.routes');
// const dataRoutes = require('./routes/ecommerce/data.routes');
// const sellerRoutes = require('./routes/ecommerce/seller.routes');
// const productRoutes = require('./routes/ecommerce/product.routes');
// const applicationRoutes = require('./routes/ecommerce/application.routes');
// const mediaRoutes = require('./routes/ecommerce/media.routes');

// // Import middleware
// const errorMiddleware = require('./src/middleware/error.middleware');

// // Import services (optional - only if using automation)
// let startAutomationEngine, stopAutomationEngine;
// try {
//   const automationService = require('./src/services/pricing/automation.service');
//   startAutomationEngine = automationService.startAutomationEngine;
//   stopAutomationEngine = automationService.stopAutomationEngine;
// } catch (error) {
//   console.warn('⚠️  Automation service not found, skipping...');
// }

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 8000;

// // -------------------------
// // CREATE UPLOAD DIRECTORIES
// // -------------------------
// const createUploadDirectories = () => {
//   const baseDir = path.join(__dirname, 'public', 'uploads');
//   const directories = [
//     baseDir,
//     path.join(baseDir, 'images'),
//     path.join(baseDir, 'videos'),
//     path.join(baseDir, 'documents'),
//     path.join(baseDir, 'profiles'),
//     path.join(baseDir, 'products')
//   ];

//   directories.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`📁 Created directory: ${dir}`);
//     }
//   });

//   return baseDir;
// };

// // Create upload directories
// const uploadBaseDir = createUploadDirectories();

// // -------------------------
// // MIDDLEWARE SETUP
// // -------------------------

// // Security headers
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'", "data:", "https:"],
//     },
//   },
//   crossOriginEmbedderPolicy: false
// }));

// // Compression
// app.use(compression({
//   level: 6,
//   threshold: 100 * 1024 // compress responses over 100KB
// }));

// // Request logging
// app.use(morgan('dev'));

// // CORS configuration
// const corsOptions = {
//   origin: process.env.FRONTEND_URL 
//     ? process.env.FRONTEND_URL.split(',') 
//     : ['http://localhost:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   maxAge: 86400 // 24 hours
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000,
//   message: {
//     status: 'error',
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Apply rate limiting to API routes
// app.use('/api/', limiter);

// // Body parsing middleware
// app.use(express.json({ 
//   limit: process.env.MAX_JSON_SIZE || '10mb',
//   verify: (req, res, buf) => {
//     req.rawBody = buf.toString();
//   }
// }));

// app.use(express.urlencoded({ 
//   extended: true, 
//   limit: process.env.MAX_URLENCODED_SIZE || '10mb' 
// }));

// // Serve static files
// app.use('/uploads', express.static(uploadBaseDir, {
//   maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0',
//   setHeaders: (res, filePath) => {
//     if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png')) {
//       res.setHeader('Cache-Control', 'public, max-age=31536000');
//     }
//   }
// }));

// // -------------------------
// // API ROUTES
// // -------------------------

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({ 
//     message: '🚀 API Server is running successfully!',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     environment: process.env.NODE_ENV || 'development',
//     endpoints: {
//       // Original endpoints
//       payments: '/api/v1/payments',
//       plans: '/api/v1/plans',
//       coupons: '/api/v1/coupons',
//       analytics: '/api/v1/analytics',
//       // New endpoints
//       auth: '/api/auth',
//       users: '/api/users',
//       data: '/api/data',
//       sellers: '/api/sellers',
//       products: '/api/products',
//       applications: '/api/applications',
//       media: '/api/media',
//       pricing: '/api/pricing',
//       automation: '/api/automation',
//       share: '/api/share'
//     }
//   });
// });

// // Health check endpoints
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK',
//     message: 'Server is healthy 🟢',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // Original API Routes (v1)
// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1/plans', planRoutes);
// app.use('/api/v1/coupons', couponRoutes);
// app.use('/api/v1/analytics', analyticsRoutes);

// // New API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/data', dataRoutes);
// app.use('/api/sellers', sellerRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/media', mediaRoutes);
// app.use('/api/pricing', pricingRoutes);
// app.use('/api/share', shareRoutes);
// app.use('/api/automation', automationRoutes);

// // -------------------------
// // ERROR HANDLING
// // -------------------------

// // Error handling middleware
// app.use(errorMiddleware);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     status: 'error',
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // -------------------------
// // DATABASE CONNECTION
// // -------------------------
// // const connectDB = async () => {
// //   try {
// //     const mongoURI = process.env.NODE_ENV === 'production' 
// //       ? process.env.MONGODB_URI_PROD 
// //       : (process.env.MONGODB_URI || 'mongodb://localhost:27017/api-database');
    
// //     const options = {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //       serverSelectionTimeoutMS: 8000,
// //       maxPoolSize: 10,
// //       socketTimeoutMS: 45000,
// //       family: 4
// //     };

// //     await mongoose.connect(mongoURI, options);
    
// //     console.log('✅ MongoDB Connected Successfully');
    
// //     // MongoDB event listeners
// //     mongoose.connection.on('connected', () => {
// //       console.log('Mongoose connected to DB');
// //     });

// //     mongoose.connection.on('error', (err) => {
// //       console.error('Mongoose connection error:', err);
// //     });

// //     mongoose.connection.on('disconnected', () => {
// //       console.warn('Mongoose disconnected from DB');
// //     });
    
// //   } catch (error) {
// //     console.error('❌ MongoDB Connection Error:', error);
// //     process.exit(1);
// //   }
// // };

// // -------------------------
// // GRACEFUL SHUTDOWN
// // -------------------------
// const gracefulShutdown = async (signal) => {
//   console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
//   try {
//     // Stop automation engine if available
//     if (stopAutomationEngine) {
//       await stopAutomationEngine();
//       console.log('Automation engine stopped');
//     }
    
//     // Close MongoDB connection
//     await mongoose.connection.close(false);
//     console.log('MongoDB connection closed');
    
//     // Exit process
//     setTimeout(() => {
//       console.log('Graceful shutdown completed');
//       process.exit(0);
//     }, 1000);
    
//   } catch (error) {
//     console.error('Error during graceful shutdown:', error);
//     process.exit(1);
//   }
// };

// // Register signal handlers
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
//   gracefulShutdown('unhandledRejection');
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (error) => {
//   console.error('❌ Uncaught Exception:', error);
//   process.exit(1);
// });

// // -------------------------
// // START SERVER
// // -------------------------
// const startServer = async () => {
//   try {
//     // Connect to database
//     await connectDB();
    
//     // Start server
//     const server = app.listen(PORT, () => {
//       console.log('\n' + '='.repeat(60));
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//       console.log(`🔗 Local: http://localhost:${PORT}`);
//       console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
//       console.log(`📊 Health: http://localhost:${PORT}/api/health`);
//       console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
//       console.log('='.repeat(60) + '\n');
//     });
    
//     // Start automation engine if enabled and available
//     if (process.env.AUTOMATION_ENABLED === 'true' && startAutomationEngine) {
//       try {
//         await startAutomationEngine();
//         console.log('✅ Automation engine started successfully');
//       } catch (error) {
//         console.error('⚠️  Failed to start automation engine:', error.message);
//       }
//     }
    
//     // Server error handling
//     server.on('error', (error) => {
//       if (error.code === 'EADDRINUSE') {
//         console.error(`❌ Port ${PORT} is already in use`);
//         process.exit(1);
//       } else {
//         throw error;
//       }
//     });
    
//     return server;
    
//   } catch (error) {
//     console.error('❌ Server startup error:', error);
//     process.exit(1);
//   }
// };

// // Start the server
// startServer();

// module.exports = app; 

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const compression = require('compression');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// const fs = require('fs');

// // Load environment variables
// dotenv.config();

// // Import routes - Original routes
// const paymentRoutes = require('./routes/payment.routes');
// const planRoutes = require('./routes/plan.routes');
// const couponRoutes = require('./routes/coupon.routes');
// const analyticsRoutes = require('./routes/analytics.routes');

// // Import routes - New routes
// const pricingRoutes = require('./routes/pricing.routes');
// const shareRoutes = require('./routes/share.routes');
// const automationRoutes = require('./routes/automation.routes');
// const authRoutes = require('./routes/auth.routes');
// const userRoutes = require('./routes/user.routes');
// const dataRoutes = require('./routes/data.routes');
// const sellerRoutes = require('./routes/seller.routes');
// const productRoutes = require('./routes/product.routes');
// const applicationRoutes = require('./routes/application.routes');
// const mediaRoutes = require('./routes/media.routes');

// // Import middleware
// const errorMiddleware = require('./src/middleware/error.middleware');

// // Import services (optional - only if using automation)
// let startAutomationEngine, stopAutomationEngine;
// try {
//   const automationService = require('./src/services/pricing/automation.service');
//   startAutomationEngine = automationService.startAutomationEngine;
//   stopAutomationEngine = automationService.stopAutomationEngine;
// } catch (error) {
//   console.warn('⚠️  Automation service not found, skipping...');
// }

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 8000;

// // -------------------------
// // CREATE UPLOAD DIRECTORIES
// // -------------------------
// const createUploadDirectories = () => {
//   const baseDir = path.join(__dirname, 'public', 'uploads');
//   const directories = [
//     baseDir,
//     path.join(baseDir, 'images'),
//     path.join(baseDir, 'videos'),
//     path.join(baseDir, 'documents'),
//     path.join(baseDir, 'profiles'),
//     path.join(baseDir, 'products')
//   ];

//   directories.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`📁 Created directory: ${dir}`);
//     }
//   });

//   return baseDir;
// };

// // Create upload directories
// const uploadBaseDir = createUploadDirectories();

// // -------------------------
// // MIDDLEWARE SETUP
// // -------------------------

// // Security headers
// app.use(helmet({
//   contentSecurityPolicy: false, // Disable CSP for now to avoid issues
//   crossOriginEmbedderPolicy: false
// }));

// // Compression
// app.use(compression({
//   level: 6,
//   threshold: 100 * 1024 // compress responses over 100KB
// }));

// // Request logging
// app.use(morgan('dev'));

// // CORS configuration
// const corsOptions = {
//   origin: process.env.FRONTEND_URL 
//     ? process.env.FRONTEND_URL.split(',') 
//     : ['http://localhost:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   maxAge: 86400 // 24 hours
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000,
//   message: {
//     status: 'error',
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Apply rate limiting to API routes
// app.use('/api/', limiter);

// // Body parsing middleware
// app.use(express.json({ 
//   limit: process.env.MAX_JSON_SIZE || '10mb'
// }));

// app.use(express.urlencoded({ 
//   extended: true, 
//   limit: process.env.MAX_URLENCODED_SIZE || '10mb' 
// }));

// // Serve static files
// app.use('/uploads', express.static(uploadBaseDir, {
//   maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0',
//   setHeaders: (res, filePath) => {
//     if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png')) {
//       res.setHeader('Cache-Control', 'public, max-age=31536000');
//     }
//   }
// }));

// // -------------------------
// // API ROUTES
// // -------------------------

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({ 
//     message: '🚀 API Server is running successfully!',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     environment: process.env.NODE_ENV || 'development',
//     endpoints: {
//       // Original endpoints
//       payments: '/api/v1/payments',
//       plans: '/api/v1/plans',
//       coupons: '/api/v1/coupons',
//       analytics: '/api/v1/analytics',
//       // New endpoints
//       auth: '/api/auth',
//       users: '/api/users',
//       data: '/api/data',
//       sellers: '/api/sellers',
//       products: '/api/products',
//       applications: '/api/applications',
//       media: '/api/media',
//       pricing: '/api/pricing',
//       automation: '/api/automation',
//       share: '/api/share'
//     }
//   });
// });

// // Health check endpoints
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK',
//     message: 'Server is healthy 🟢',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // Original API Routes (v1)
// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1/plans', planRoutes);
// app.use('/api/v1/coupons', couponRoutes);
// app.use('/api/v1/analytics', analyticsRoutes);

// // New API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/data', dataRoutes);
// app.use('/api/sellers', sellerRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/media', mediaRoutes);
// app.use('/api/pricing', pricingRoutes);
// app.use('/api/share', shareRoutes);
// app.use('/api/automation', automationRoutes);

// // -------------------------
// // ERROR HANDLING
// // -------------------------

// // Error handling middleware
// app.use(errorMiddleware);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     status: 'error',
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // -------------------------
// // DATABASE CONNECTION - UNCOMMENTED AND FIXED
// // -------------------------
// const connectDB = async () => {
//   try {
//     let mongoURI;
    
//     // Determine which MongoDB URI to use
//     if (process.env.MONGODB_URI) {
//       mongoURI = process.env.MONGODB_URI;
//     } else if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI_PROD) {
//       mongoURI = process.env.MONGODB_URI_PROD;
//     } else {
//       mongoURI = 'mongodb://127.0.0.1:27017/api-database'; // Use 127.0.0.1 instead of localhost
//     }
    
//     console.log(`🔗 Connecting to MongoDB...`);
    
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 10000,
//       maxPoolSize: 10
//     };

//     await mongoose.connect(mongoURI, options);
    
//     console.log('✅ MongoDB Connected Successfully');
    
//     // MongoDB event listeners
//     mongoose.connection.on('connected', () => {
//       console.log('Mongoose connected to DB');
//     });

//     mongoose.connection.on('error', (err) => {
//       console.error('Mongoose connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
//       console.warn('Mongoose disconnected from DB');
//     });
    
//     return mongoose.connection;
    
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error.message);
    
//     // Provide helpful error messages
//     if (error.message.includes('ECONNREFUSED')) {
//       console.log('\n💡 TROUBLESHOOTING TIPS:');
//       console.log('1. Make sure MongoDB is running:');
//       console.log('   • macOS: brew services start mongodb-community');
//       console.log('   • Ubuntu: sudo systemctl start mongod');
//       console.log('   • Windows: net start MongoDB');
//       console.log('2. Check if MongoDB is listening on port 27017');
//       console.log('3. Try: mongod --dbpath /usr/local/var/mongodb (macOS)');
//     }
    
//     process.exit(1);
//   }
// };

// // -------------------------
// // GRACEFUL SHUTDOWN
// // -------------------------
// const gracefulShutdown = async (signal) => {
//   console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
  
//   try {
//     // Stop automation engine if available
//     if (stopAutomationEngine) {
//       await stopAutomationEngine();
//       console.log('Automation engine stopped');
//     }
    
//     // Close MongoDB connection if connected
//     if (mongoose.connection.readyState === 1) {
//       await mongoose.connection.close(false);
//       console.log('MongoDB connection closed');
//     }
    
//     // Exit process
//     setTimeout(() => {
//       console.log('Graceful shutdown completed');
//       process.exit(0);
//     }, 1000);
    
//   } catch (error) {
//     console.error('Error during graceful shutdown:', error);
//     process.exit(1);
//   }
// };

// // Register signal handlers
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
// process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
//   // Don't call gracefulShutdown for promise rejections
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (error) => {
//   console.error('❌ Uncaught Exception:', error);
//   gracefulShutdown('uncaughtException');
// });

// // -------------------------
// // START SERVER
// // -------------------------
// const startServer = async () => {
//   try {
//     // Connect to database
//     await connectDB();
    
//     // Start server
//     const server = app.listen(PORT, () => {
//       console.log('\n' + '='.repeat(60));
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//       console.log(`🔗 Local: http://localhost:${PORT}`);
//       if (process.env.FRONTEND_URL) {
//         console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
//       }
//       console.log(`📊 Health: http://localhost:${PORT}/api/health`);
//       console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
//       console.log('='.repeat(60) + '\n');
//     });
    
//     // Start automation engine if enabled and available
//     if (process.env.AUTOMATION_ENABLED === 'true' && startAutomationEngine) {
//       try {
//         await startAutomationEngine();
//         console.log('✅ Automation engine started successfully');
//       } catch (error) {
//         console.error('⚠️  Failed to start automation engine:', error.message);
//       }
//     }
    
//     // Server error handling
//     server.on('error', (error) => {
//       if (error.code === 'EADDRINUSE') {
//         console.error(`❌ Port ${PORT} is already in use`);
//         console.log(`💡 Try: kill -9 $(lsof -t -i:${PORT}) or use a different port`);
//         process.exit(1);
//       } else {
//         console.error('❌ Server error:', error);
//         process.exit(1);
//       }
//     });
    
//     return server;
    
//   } catch (error) {
//     console.error('❌ Server startup error:', error);
//     process.exit(1);
//   }
// };

// // Start the server
// startServer();

// module.exports = app;



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const compression = require('compression');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// const fs = require('fs');

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 8000;

// // -------------------------
// // CREATE UPLOAD DIRECTORIES
// // -------------------------
// const createUploadDirectories = () => {
//   const baseDir = path.join(__dirname, 'public', 'uploads');
//   const directories = [
//     baseDir,
//     path.join(baseDir, 'images'),
//     path.join(baseDir, 'videos'),
//     path.join(baseDir, 'documents'),
//     path.join(baseDir, 'profiles'),
//     path.join(baseDir, 'products')
//   ];

//   directories.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`📁 Created directory: ${dir}`);
//     }
//   });

//   return baseDir;
// };

// // Create upload directories
// const uploadBaseDir = createUploadDirectories();

// // -------------------------
// // MIDDLEWARE SETUP
// // -------------------------

// // Security headers
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false
// }));

// // Compression
// app.use(compression({
//   level: 6,
//   threshold: 100 * 1024
// }));

// // Request logging
// app.use(morgan('dev'));

// // CORS configuration
// const corsOptions = {
//   origin: process.env.FRONTEND_URL 
//     ? process.env.FRONTEND_URL.split(',') 
//     : ['http://localhost:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   maxAge: 86400
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000,
//   message: {
//     status: 'error',
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false
// });

// // Apply rate limiting to API routes
// app.use('/api/', limiter);

// // Body parsing middleware
// app.use(express.json({ 
//   limit: process.env.MAX_JSON_SIZE || '10mb'
// }));

// app.use(express.urlencoded({ 
//   extended: true, 
//   limit: process.env.MAX_URLENCODED_SIZE || '10mb' 
// }));

// // Serve static files
// app.use('/uploads', express.static(uploadBaseDir));

// // -------------------------
// // SAFE ROUTE LOADING
// // -------------------------

// // Function to create placeholder routes
// const createPlaceholderRoute = (routeName) => {
//   const router = express.Router();
//   router.get('/', (req, res) => {
//     res.json({ 
//       message: `${routeName} API is working`,
//       note: 'Placeholder route',
//       timestamp: new Date().toISOString()
//     });
//   });
//   return router;
// };

// // Function to safely load a route
// const loadRoute = (modulePath, routeName) => {
//   try {
//     // Check if file exists
//     const fullPath = require.resolve(modulePath, { paths: [__dirname] });
//     return require(modulePath);
//   } catch (error) {
//     console.warn(`⚠️  ${routeName} not found: ${error.message}`);
//     return createPlaceholderRoute(routeName);
//   }
// };

// // Load all routes safely
// console.log('📦 Loading routes...');

// const paymentRoutes = loadRoute('./routes/payment.routes', 'Payment');
// const planRoutes = loadRoute('./routes/plan.routes', 'Plan');
// const couponRoutes = loadRoute('./routes/coupon.routes', 'Coupon');
// const analyticsRoutes = loadRoute('./routes/analytics.routes', 'Analytics');
// const pricingRoutes = loadRoute('./routes/pricing.routes', 'Pricing');
// const shareRoutes = loadRoute('./routes/share.routes', 'Share');
// const automationRoutes = loadRoute('./routes/automation.routes', 'Automation');
// const authRoutes = loadRoute('./routes/auth.routes', 'Auth');
// const userRoutes = loadRoute('./routes/user.routes', 'User');
// const dataRoutes = loadRoute('./routes/data.routes', 'Data');
// const sellerRoutes = loadRoute('./routes/seller.routes', 'Seller');
// const productRoutes = loadRoute('./routes/product.routes', 'Product');
// const applicationRoutes = loadRoute('./routes/application.routes', 'Application');
// const mediaRoutes = loadRoute('./routes/media.routes', 'Media');

// // Load error middleware safely
// let errorMiddleware;
// try {
//   errorMiddleware = require('./src/middleware/error.middleware');
// } catch (error) {
//   console.warn('⚠️  Error middleware not found, using default');
//   errorMiddleware = (err, req, res, next) => {
//     console.error('Error:', err.message);
//     res.status(err.status || 500).json({
//       success: false,
//       message: err.message || 'Internal Server Error'
//     });
//   };
// }

// // Load automation service safely
// let startAutomationEngine, stopAutomationEngine;
// try {
//   const automationService = require('./src/services/pricing/automation.service');
//   startAutomationEngine = automationService.startAutomationEngine;
//   stopAutomationEngine = automationService.stopAutomationEngine;
// } catch (error) {
//   console.warn('⚠️  Automation service not found');
//   startAutomationEngine = async () => console.log('Automation engine not available');
//   stopAutomationEngine = async () => console.log('Automation engine not available');
// }

// // -------------------------
// // API ROUTES
// // -------------------------

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({ 
//     message: '🚀 API Server is running successfully!',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // Health check endpoints
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK',
//     message: 'Server is healthy 🟢',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // Original API Routes (v1)
// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1/plans', planRoutes);
// app.use('/api/v1/coupons', couponRoutes);
// app.use('/api/v1/analytics', analyticsRoutes);

// // New API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/data', dataRoutes);
// app.use('/api/sellers', sellerRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/media', mediaRoutes);
// app.use('/api/pricing', pricingRoutes);
// app.use('/api/share', shareRoutes);
// app.use('/api/automation', automationRoutes);

// // -------------------------
// // ERROR HANDLING
// // -------------------------

// // Error handling middleware
// app.use(errorMiddleware);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     status: 'error',
//     message: `Route ${req.originalUrl} not found`,
//     availableRoutes: [
//       '/',
//       '/health',
//       '/api/health',
//       '/api/v1/payments',
//       '/api/v1/plans',
//       '/api/v1/coupons',
//       '/api/v1/analytics',
//       '/api/auth',
//       '/api/users',
//       '/api/data',
//       '/api/sellers',
//       '/api/products',
//       '/api/applications',
//       '/api/media',
//       '/api/pricing',
//       '/api/share',
//       '/api/automation'
//     ]
//   });
// });

// // -------------------------
// // DATABASE CONNECTION
// // -------------------------
// const connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
//     console.log(`🔗 Connecting to MongoDB...`);
    
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 10000
//     };

//     await mongoose.connect(mongoURI, options);
    
//     console.log('✅ MongoDB Connected Successfully');
    
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error.message);
    
//     if (error.message.includes('ECONNREFUSED')) {
//       console.log('\n💡 MongoDB is not running. Please start it:');
//       console.log('   For Windows: mongod --dbpath "C:\\data\\db"');
//       console.log('   Or install as service: net start MongoDB');
//     }
    
//     // Don't exit in development, continue without DB
//     if (process.env.NODE_ENV !== 'production') {
//       console.log('⚠️  Continuing without database (development mode)');
//     }
//   }
// };

// // -------------------------
// // START SERVER
// // -------------------------
// const startServer = async () => {
//   try {
//     // Connect to database
//     await connectDB();
    
//     // Start server
//     const server = app.listen(PORT, () => {
//       console.log('\n' + '='.repeat(60));
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//       console.log(`🔗 Local: http://localhost:${PORT}`);
//       console.log(`📊 Health: http://localhost:${PORT}/health`);
//       console.log('='.repeat(60));
//       console.log('\n✅ Server started successfully!');
//       console.log('\n📋 Test these endpoints:');
//       console.log('  • http://localhost:8000');
//       console.log('  • http://localhost:8000/health');
//       console.log('  • http://localhost:8000/api/v1/coupons');
//       console.log('  • http://localhost:8000/api/v1/analytics/dashboard');
//       console.log('\nPress Ctrl+C to stop\n');
//     });
    
//     // Graceful shutdown
//     const gracefulShutdown = () => {
//       console.log('\n🛑 Shutting down gracefully...');
//       server.close(() => {
//         console.log('✅ Server closed');
//         mongoose.connection.close(false, () => {
//           console.log('✅ MongoDB connection closed');
//           process.exit(0);
//         });
//       });
//     };
    
//     process.on('SIGTERM', gracefulShutdown);
//     process.on('SIGINT', gracefulShutdown);
    
//   } catch (error) {
//     console.error('❌ Server startup error:', error.message);
//     process.exit(1);
//   }
// };

// // Start the server
// startServer();

// module.exports = app;



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const helmet = require('helmet');
// const compression = require('compression');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const path = require('path');
// const fs = require('fs');

// // Load environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 8000;

// // -------------------------
// // CREATE UPLOAD DIRECTORIES
// // -------------------------
// const createUploadDirectories = () => {
//   const baseDir = path.join(__dirname, 'public', 'uploads');
//   const directories = [
//     baseDir,
//     path.join(baseDir, 'images'),
//     path.join(baseDir, 'videos'),
//     path.join(baseDir, 'documents'),
//     path.join(baseDir, 'profiles'),
//     path.join(baseDir, 'products')
//   ];

//   directories.forEach(dir => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`📁 Created directory: ${dir}`);
//     }
//   });

//   return baseDir;
// };

// // Create upload directories
// const uploadBaseDir = createUploadDirectories();

// // -------------------------
// // MIDDLEWARE SETUP
// // -------------------------

// // Security headers - Configure before CORS
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false,
//   crossOriginResourcePolicy: false
// }));

// // Compression
// app.use(compression({
//   level: 6,
//   threshold: 100 * 1024
// }));

// // Request logging
// app.use(morgan('dev'));


// app.post("/api/v1/payments/initialize", (req, res) => {
//   res.json({
//     status: "success",
//     message: "Payment initialized",
//     orderId: "order_123"
//   });
// });

// // -------------------------
// // CORS CONFIGURATION - PROPER FIX
// // -------------------------
// const allowedOrigins = process.env.FRONTEND_URL 
//   ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
//   : ['http://localhost:3000', 'http://localhost:3001'];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps, Postman, curl)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: [
//     'Content-Type', 
//     'Authorization', 
//     'X-Requested-With',
//     'Accept',
//     'Origin'
//   ],
//   exposedHeaders: ['Content-Range', 'X-Content-Range'],
//   maxAge: 86400, // 24 hours
//   preflightContinue: false,
//   optionsSuccessStatus: 204
// };

// // Apply CORS middleware - this handles OPTIONS automatically
// app.use(cors(corsOptions));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000,
//   message: {
//     status: 'error',
//     message: 'Too many requests from this IP, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   // Skip rate limiting for OPTIONS requests
//   skip: (req) => req.method === 'OPTIONS'
// });

// // Apply rate limiting to API routes
// app.use('/api/', limiter);

// // Body parsing middleware
// app.use(express.json({ 
//   limit: process.env.MAX_JSON_SIZE || '10mb'
// }));

// app.use(express.urlencoded({ 
//   extended: true, 
//   limit: process.env.MAX_URLENCODED_SIZE || '10mb' 
// }));

// // Serve static files
// app.use('/uploads', express.static(uploadBaseDir));

// // -------------------------
// // SAFE ROUTE LOADING
// // -------------------------

// // Function to create placeholder routes
// const createPlaceholderRoute = (routeName) => {
//   const router = express.Router();
//   router.get('/', (req, res) => {
//     res.json({ 
//       message: `${routeName} API is working`,
//       note: 'Placeholder route',
//       timestamp: new Date().toISOString()
//     });
//   });
//   return router;
// };

// // Function to safely load a route
// const loadRoute = (modulePath, routeName) => {
//   try {
//     const fullPath = path.join(__dirname, modulePath);
//     if (fs.existsSync(fullPath)) {
//       return require(modulePath);
//     }
//   } catch (error) {
//     console.warn(`⚠️  ${routeName} not found: ${error.message}`);
//   }
//   return createPlaceholderRoute(routeName);
// };

// // Load all routes safely
// console.log('📦 Loading routes...');

// // Original routes
// const paymentRoutes = loadRoute('./routes/payment.routes', 'Payment');
// const planRoutes = loadRoute('./routes/plan.routes', 'Plan');
// const couponRoutes = loadRoute('./routes/coupon.routes', 'Coupon');
// const analyticsRoutes = loadRoute('./routes/analytics.routes', 'Analytics');

// // New routes
// const pricingRoutes = loadRoute('./routes/pricing.routes', 'Pricing');
// const shareRoutes = loadRoute('./routes/share.routes', 'Share');
// const automationRoutes = loadRoute('./routes/automation.routes', 'Automation');
// const authRoutes = loadRoute('./routes/auth.routes', 'Auth');
// const userRoutes = loadRoute('./routes/user.routes', 'User');
// const dataRoutes = loadRoute('./routes/data.routes', 'Data');
// const sellerRoutes = loadRoute('./routes/seller.routes', 'Seller');
// const productRoutes = loadRoute('./routes/product.routes', 'Product');
// const applicationRoutes = loadRoute('./routes/application.routes', 'Application');
// const mediaRoutes = loadRoute('./routes/media.routes', 'Media');

// // Load error middleware safely
// let errorMiddleware;
// try {
//   errorMiddleware = require('./src/middleware/error.middleware');
// } catch (error) {
//   console.warn('⚠️  Error middleware not found, using default');
//   errorMiddleware = (err, req, res, next) => {
//     console.error('Error:', err.message);
//     res.status(err.status || 500).json({
//       success: false,
//       message: err.message || 'Internal Server Error'
//     });
//   };
// }

// // Load automation service safely
// let startAutomationEngine, stopAutomationEngine;
// try {
//   const automationService = require('./src/services/pricing/automation.service');
//   startAutomationEngine = automationService.startAutomationEngine;
//   stopAutomationEngine = automationService.stopAutomationEngine;
// } catch (error) {
//   console.warn('⚠️  Automation service not found');
//   startAutomationEngine = async () => console.log('Automation engine not available');
//   stopAutomationEngine = async () => console.log('Automation engine not available');
// }

// // -------------------------
// // API ROUTES
// // -------------------------

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({ 
//     message: '🚀 API Server is running successfully!',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0',
//     environment: process.env.NODE_ENV || 'development',
//     endpoints: {
//       payments: '/api/v1/payments',
//       plans: '/api/v1/plans',
//       coupons: '/api/v1/coupons',
//       analytics: '/api/v1/analytics',
//       auth: '/api/auth',
//       users: '/api/users',
//       data: '/api/data',
//       sellers: '/api/sellers',
//       products: '/api/products',
//       applications: '/api/applications',
//       media: '/api/media',
//       pricing: '/api/pricing',
//       automation: '/api/automation',
//       share: '/api/share'
//     }
//   });
// });

// // Health check endpoints
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK',
//     message: 'Server is healthy 🟢',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // Original API Routes (v1)
// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1/plans', planRoutes);
// app.use('/api/v1/coupons', couponRoutes);
// app.use('/api/v1/analytics', analyticsRoutes);

// // New API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/data', dataRoutes);
// app.use('/api/sellers', sellerRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/applications', applicationRoutes);
// app.use('/api/media', mediaRoutes);
// app.use('/api/pricing', pricingRoutes);
// app.use('/api/share', shareRoutes);
// app.use('/api/automation', automationRoutes);

// // -------------------------
// // ERROR HANDLING
// // -------------------------

// // 404 handler - Must come BEFORE error middleware
// app.use((req, res, next) => {
//   res.status(404).json({
//     status: 'error',
//     message: `Route ${req.method} ${req.originalUrl} not found`,
//     availableEndpoints: '/api/health for API info'
//   });
// });

// // Error handling middleware - Must be last
// app.use(errorMiddleware);

// // -------------------------
// // DATABASE CONNECTION
// // -------------------------
// const connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
//     console.log(`🔗 Connecting to MongoDB...`);
    
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//     };

//     await mongoose.connect(mongoURI, options);
    
//     console.log('✅ MongoDB Connected Successfully');
    
//     // MongoDB connection event handlers
//     mongoose.connection.on('error', (err) => {
//       console.error('❌ MongoDB connection error:', err);
//     });
    
//     mongoose.connection.on('disconnected', () => {
//       console.warn('⚠️  MongoDB disconnected');
//     });
    
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error.message);
    
//     if (error.message.includes('ECONNREFUSED')) {
//       console.log('\n💡 MongoDB is not running. Please start it:');
//       console.log('   For Windows: mongod --dbpath "C:\\data\\db"');
//       console.log('   For Linux/Mac: sudo systemctl start mongod');
//       console.log('   Or install as service: net start MongoDB');
//     }
    
//     // Don't exit in development
//     if (process.env.NODE_ENV !== 'production') {
//       console.log('⚠️  Continuing without database (development mode)');
//     } else {
//       throw error;
//     }
//   }
// };

// // -------------------------
// // START SERVER
// // -------------------------
// const startServer = async () => {
//   try {
//     // Connect to database
//     await connectDB();
    
//     // Start server
//     const server = app.listen(PORT, () => {
//       console.log('\n' + '='.repeat(60));
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//       console.log(`🔗 Local: http://localhost:${PORT}`);
//       console.log(`📊 Health: http://localhost:${PORT}/health`);
//       console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}`);
//       console.log('='.repeat(60));
//       console.log('\n✅ Server started successfully!');
//       console.log('\n📋 Test these endpoints:');
//       console.log('  • http://localhost:8000');
//       console.log('  • http://localhost:8000/health');
//       console.log('  • http://localhost:8000/api/v1/coupons');
//       console.log('  • http://localhost:8000/api/v1/analytics/dashboard');
//       console.log('\nPress Ctrl+C to stop\n');
//     });

//     // Handle server errors
//     server.on('error', (error) => {
//       if (error.code === 'EADDRINUSE') {
//         console.error(`❌ Port ${PORT} is already in use`);
//         process.exit(1);
//       } else {
//         console.error('❌ Server error:', error);
//         throw error;
//       }
//     });
    
//     // Graceful shutdown
//     const gracefulShutdown = async (signal) => {
//       console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
      
//       server.close(async () => {
//         console.log('✅ HTTP server closed');
        
//         if (mongoose.connection.readyState === 1) {
//           await mongoose.connection.close();
//           console.log('✅ MongoDB connection closed');
//         }
        
//         // Stop automation engine if available
//         try {
//           await stopAutomationEngine();
//         } catch (err) {
//           console.log('Automation engine already stopped');
//         }
        
//         console.log('👋 Server shutdown complete');
//         process.exit(0);
//       });
      
//       // Force shutdown after 10 seconds
//       setTimeout(() => {
//         console.error('⚠️  Forced shutdown after timeout');
//         process.exit(1);
//       }, 10000);
//     };
    
//     process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
//     process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
//   } catch (error) {
//     console.error('❌ Server startup error:', error.message);
//     process.exit(1);
//   }
// };

// // Unhandled rejection handler
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
// });

// // Uncaught exception handler
// process.on('uncaughtException', (error) => {
//   console.error('❌ Uncaught Exception:', error);
//   process.exit(1);
// });

// // Start the server
// startServer();

// module.exports = app;




// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import helmet from "helmet";
// import compression from "compression";
// import morgan from "morgan";
// import rateLimit from "express-rate-limit";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// // Load environment variables
// dotenv.config();

// // Fix __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 8000;

// // -------------------------
// // CREATE UPLOAD DIRECTORIES
// // -------------------------
// const createUploadDirectories = () => {
//   const baseDir = path.join(__dirname, "public", "uploads");
//   const directories = [
//     baseDir,
//     path.join(baseDir, "images"),
//     path.join(baseDir, "videos"),
//     path.join(baseDir, "documents"),
//     path.join(baseDir, "profiles"),
//     path.join(baseDir, "products"),
//   ];

//   directories.forEach((dir) => {
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//       console.log(`📁 Created directory: ${dir}`);
//     }
//   });

//   return baseDir;
// };

// // Create upload directories
// const uploadBaseDir = createUploadDirectories();

// // -------------------------
// // SECURITY & MIDDLEWARE SETUP
// // -------------------------

// // Security headers
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: false,
//   })
// );

// // Compression
// app.use(
//   compression({
//     level: 6,
//     threshold: 100 * 1024, // Only compress files > 100KB
//   })
// );

// // Request logging (dev mode)
// if (process.env.NODE_ENV !== "production") {
//   app.use(morgan("dev"));
// } else {
//   app.use(morgan("combined"));
// }

// // -------------------------
// // CORS CONFIGURATION
// // -------------------------
// const allowedOrigins = process.env.FRONTEND_URL
//   ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
//   : ["http://localhost:3000", "http://localhost:3001"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (mobile apps, Postman, etc.)
//     if (!origin) return callback(null, true);

//     if (
//       allowedOrigins.indexOf(origin) !== -1 ||
//       process.env.NODE_ENV === "development"
//     ) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "X-Requested-With",
//     "Accept",
//     "Origin",
//   ],
//   exposedHeaders: ["Content-Range", "X-Content-Range"],
//   maxAge: 86400, // 24 hours
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));

// // -------------------------
// // RATE LIMITING
// // -------------------------
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === "production" ? 100 : 1000,
//   message: {
//     status: "error",
//     message: "Too many requests from this IP, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   skip: (req) => req.method === "OPTIONS",
// });

// app.use("/api/", limiter);

// // -------------------------
// // BODY PARSING
// // -------------------------
// app.use(
//   express.json({
//     limit: process.env.MAX_JSON_SIZE || "10mb",
//   })
// );

// app.use(
//   express.urlencoded({
//     extended: true,
//     limit: process.env.MAX_URLENCODED_SIZE || "10mb",
//   })
// );

// // -------------------------
// // REQUEST LOGGER (Custom)
// // -------------------------
// app.use((req, res, next) => {
//   console.log(`🔵 [${req.method}] ${req.originalUrl}`);
//   if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
//     console.log("📦 Body:", JSON.stringify(req.body, null, 2));
//   }
//   next();
// });

// // -------------------------
// // STATIC FILES
// // -------------------------
// app.use("/uploads", express.static(uploadBaseDir));

// // -------------------------
// // SAFE ROUTE LOADING
// // -------------------------
// const createPlaceholderRoute = (routeName) => {
//   const router = express.Router();
//   router.get("/", (req, res) => {
//     res.json({
//       message: `${routeName} API is working`,
//       note: "Placeholder route - implement the actual route file",
//       timestamp: new Date().toISOString(),
//     });
//   });
//   return router;
// };

// const loadRoute = async (modulePath, routeName) => {
//   try {
//     const fullPath = path.join(__dirname, modulePath);
//     if (fs.existsSync(fullPath)) {
//       const module = await import(modulePath);
//       return module.default || module;
//     }
//   } catch (error) {
//     console.warn(`⚠️  ${routeName} not found: ${error.message}`);
//   }
//   return createPlaceholderRoute(routeName);
// };

// // -------------------------
// // LOAD ROUTES DYNAMICALLY
// // -------------------------
// console.log("📦 Loading routes...");

// const routes = {
//   "/api/auth": { path: "./routes/authRoutes.js", name: "Auth" },
//   "/api/users": { path: "./routes/userRoutes.js", name: "User" },
//   "/api/data": { path: "./routes/dataRoutes.js", name: "Data" },
//   "/api/sellers": { path: "./routes/sellerRoutes.js", name: "Seller" },
//   "/api/products": { path: "./routes/productRoutes.js", name: "Product" },
//   "/api/applications": { path: "./routes/applicationRoutes.js", name: "Application" },
//   "/api/media": { path: "./routes/mediaRoutes.js", name: "Media" },
//   "/api/v1/payments": { path: "./routes/paymentRoutes.js", name: "Payment" },
//   "/api/v1/plans": { path: "./routes/planRoutes.js", name: "Plan" },
//   "/api/v1/coupons": { path: "./routes/couponRoutes.js", name: "Coupon" },
//   "/api/v1/analytics": { path: "./routes/analyticsRoutes.js", name: "Analytics" },
//   "/api/pricing": { path: "./routes/pricingRoutes.js", name: "Pricing" },
//   "/api/share": { path: "./routes/shareRoutes.js", name: "Share" },
//   "/api/automation": { path: "./routes/automationRoutes.js", name: "Automation" },
// };

// // Load all routes
// const loadAllRoutes = async () => {
//   for (const [endpoint, config] of Object.entries(routes)) {
//     const route = await loadRoute(config.path, config.name);
//     app.use(endpoint, route);
//     console.log(`✅ Loaded: ${config.name} → ${endpoint}`);
//   }
// };

// // -------------------------
// // ROOT & HEALTH ENDPOINTS
// // -------------------------
// app.get("/", (req, res) => {
//   res.json({
//     message: "🚀 API Server is running successfully!",
//     timestamp: new Date().toISOString(),
//     version: "2.0.0",
//     environment: process.env.NODE_ENV || "development",
//     endpoints: Object.keys(routes).reduce((acc, key) => {
//       acc[routes[key].name.toLowerCase()] = key;
//       return acc;
//     }, {}),
//   });
// });

// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "Server is running",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database:
//       mongoose.connection.readyState === 1 ? "connected" : "disconnected",
//   });
// });

// app.get("/api/health", (req, res) => {
//   res.json({
//     status: "OK",
//     message: "Server is healthy 🟢",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage(),
//     database:
//       mongoose.connection.readyState === 1 ? "connected" : "disconnected",
//   });
// });

// // -------------------------
// // ERROR HANDLING
// // -------------------------

// // 404 handler - Must come BEFORE error middleware
// app.use((req, res, next) => {
//   console.log("❗ Route not found:", req.originalUrl);
//   res.status(404).json({
//     status: "error",
//     message: `Route ${req.method} ${req.originalUrl} not found`,
//     availableEndpoints: "/api/health for API info",
//   });
// });

// // Global error handler - Must be last
// app.use((err, req, res, next) => {
//   console.error("❌ SERVER ERROR:", err.stack);

//   // CORS errors
//   if (err.message === "Not allowed by CORS") {
//     return res.status(403).json({
//       status: "error",
//       message: "CORS policy violation",
//     });
//   }

//   // MongoDB errors
//   if (err.name === "ValidationError") {
//     return res.status(400).json({
//       status: "error",
//       message: "Validation error",
//       errors: err.errors,
//     });
//   }

//   if (err.name === "CastError") {
//     return res.status(400).json({
//       status: "error",
//       message: "Invalid ID format",
//     });
//   }

//   // Default error
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
//   });
// });

// // -------------------------
// // DATABASE CONNECTION
// // -------------------------
// // const connectDB = async () => {
// //   try {
// //     const mongoURI =
// //       process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce";
// //     console.log(`🔗 Connecting to MongoDB...`);

// //     const options = {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //       serverSelectionTimeoutMS: 10000,
// //       socketTimeoutMS: 45000,
// //     };

// //     await mongoose.connect(mongoURI, options);

// //     console.log("✅ MongoDB Connected Successfully");

// //     // MongoDB connection event handlers
// //     mongoose.connection.on("error", (err) => {
// //       console.error("❌ MongoDB connection error:", err);
// //     });

// //     mongoose.connection.on("disconnected", () => {
// //       console.warn("⚠️  MongoDB disconnected");
// //     });

// //     mongoose.connection.on("reconnected", () => {
// //       console.log("🔄 MongoDB reconnected");
// //     });
// //   } catch (error) {
// //     console.error("❌ MongoDB Connection Error:", error.message);

// //     if (error.message.includes("ECONNREFUSED")) {
// //       console.log("\n💡 MongoDB is not running. Please start it:");
// //       console.log('   For Windows: mongod --dbpath "C:\\data\\db"');
// //       console.log("   For Linux/Mac: sudo systemctl start mongod");
// //       console.log("   Or install as service: net start MongoDB");
// //     }

// //     // Don't exit in development
// //     if (process.env.NODE_ENV !== "production") {
// //       console.log("⚠️  Continuing without database (development mode)");
// //     } else {
// //       throw error;
// //     }
// //   }
// // };

// // -------------------------
// // START SERVER
// // -------------------------
// const startServer = async () => {
//   try {
//     // Load routes first
//     await loadAllRoutes();

//     // Connect to database
//     await connectDB();

//     // Start server
//     const server = app.listen(PORT, () => {
//       console.log("\n" + "=".repeat(60));
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
//       console.log(`🔗 Local: http://localhost:${PORT}`);
//       console.log(`📊 Health: http://localhost:${PORT}/health`);
//       console.log(`🌐 CORS Origins: ${allowedOrigins.join(", ")}`);
//       console.log("=".repeat(60));
//       console.log("\n✅ Server started successfully!");
//       console.log("\n📋 Available endpoints:");
//       console.log(`  • http://localhost:${PORT}`);
//       console.log(`  • http://localhost:${PORT}/health`);
//       console.log(`  • http://localhost:${PORT}/api/health`);
//       console.log("\nPress Ctrl+C to stop\n");
//     });

//     // Handle server errors
//     server.on("error", (error) => {
//       if (error.code === "EADDRINUSE") {
//         console.error(`❌ Port ${PORT} is already in use`);
//         process.exit(1);
//       } else {
//         console.error("❌ Server error:", error);
//         throw error;
//       }
//     });

//     // Graceful shutdown
//     const gracefulShutdown = async (signal) => {
//       console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

//       server.close(async () => {
//         console.log("✅ HTTP server closed");

//         if (mongoose.connection.readyState === 1) {
//           await mongoose.connection.close();
//           console.log("✅ MongoDB connection closed");
//         }

//         console.log("👋 Server shutdown complete");
//         process.exit(0);
//       });

//       // Force shutdown after 10 seconds
//       setTimeout(() => {
//         console.error("⚠️  Forced shutdown after timeout");
//         process.exit(1);
//       }, 10000);
//     };

//     process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
//     process.on("SIGINT", () => gracefulShutdown("SIGINT"));
//   } catch (error) {
//     console.error("❌ Server startup error:", error.message);
//     process.exit(1);
//   }
// };

// // -------------------------
// // GLOBAL ERROR HANDLERS
// // -------------------------
// process.on("unhandledRejection", (reason, promise) => {
//   console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
// });

// process.on("uncaughtException", (error) => {
//   console.error("❌ Uncaught Exception:", error);
//   process.exit(1);
// });

// // Start the server
// startServer();

// export default app;


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Database connector
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// -------------------------
// CREATE UPLOAD DIRECTORIES
// -------------------------
const createUploadDirectories = () => {
  const baseDir = path.join(__dirname, 'public', 'uploads');
  const directories = [
    baseDir,
    path.join(baseDir, 'images'),
    path.join(baseDir, 'videos'),
    path.join(baseDir, 'documents'),
    path.join(baseDir, 'profiles'),
    path.join(baseDir, 'products')
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  return baseDir;
};

// Create upload directories
const uploadBaseDir = createUploadDirectories();

// -------------------------
// MIDDLEWARE SETUP
// -------------------------

// Security headers - Configure before CORS
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
}));

// Compression
app.use(compression({
  level: 6,
  threshold: 100 * 1024
}));

// Request logging
app.use(morgan('dev'));

// -------------------------
// CORS CONFIGURATION - PROPER FIX
// -------------------------
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Request-ID',
    'x-request-id',
    'X-Timestamp'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'X-Request-ID'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests — use a regex to avoid path-to-regexp parse errors
app.options(/.*/, cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS'
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ 
  limit: process.env.MAX_JSON_SIZE || '10mb'
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_URLENCODED_SIZE || '10mb' 
}));

// Serve static files
app.use('/uploads', express.static(uploadBaseDir));

// -------------------------
// FIX PRICING ROUTE ISSUE
// -------------------------

// First, let's check if pricing routes file exists
const pricingRoutesPath = path.join(__dirname, 'routes', 'pricing.routes.js');
if (!fs.existsSync(pricingRoutesPath)) {
  console.log('⚠️  Pricing routes file not found, creating placeholder...');
  
  // Create a simple pricing routes file
  const pricingRoutesContent = `
const express = require('express');
const router = express.Router();

// Get market conditions
router.get('/market-conditions', (req, res) => {
  res.json({
    success: true,
    data: {
      demand: 'normal',
      season: 'regular',
      competitorPrice: 5500,
      marketTrend: 'stable'
    }
  });
});

// Get pricing recommendations
router.get('/recommendations', (req, res) => {
  res.json({
    success: true,
    data: {
      plans: [
        { id: 1, name: 'Basic', recommendedPrice: 1999 },
        { id: 2, name: 'Professional', recommendedPrice: 4999 },
        { id: 3, name: 'Enterprise', recommendedPrice: 14999 }
      ]
    }
  });
});

module.exports = router;
  `;
  
  fs.writeFileSync(pricingRoutesPath, pricingRoutesContent, 'utf8');
  console.log('✅ Created placeholder pricing routes');
}

// -------------------------
// SAFE ROUTE LOADING
// -------------------------

// Function to create placeholder routes
const createPlaceholderRoute = (routeName) => {
  const router = express.Router();
  router.get('/', (req, res) => {
    res.json({ 
      message: `${routeName} API is working`,
      note: 'Placeholder route',
      timestamp: new Date().toISOString()
    });
  });
  return router;
};

// Function to safely load a route
const loadRoute = (modulePath, routeName) => {
  try {
    const fullPath = path.join(__dirname, modulePath);

    if (fs.existsSync(fullPath)) {
      delete require.cache[require.resolve(fullPath)];
      const route = require(fullPath);
      console.log(`✅ Loaded: ${routeName} → ${modulePath}`);
      return route;
    }

    console.log(`⚠️  File not found: ${modulePath}`);
    return createPlaceholderRoute(routeName);
  } catch (error) {
    console.warn(`⚠️  Error loading ${routeName}: ${error.message}`);
    return createPlaceholderRoute(routeName);
  }
};


// Load all routes safely
console.log('\n📦 Loading routes...');

// Original routes
const paymentRoutes = loadRoute('./routes/payment.routes.js', 'Payment');
const planRoutes = loadRoute('./routes/plan.routes.js', 'Plan');
const couponRoutes = loadRoute('./routes/coupon.routes.js', 'Coupon');
const analyticsRoutes = loadRoute('./routes/analytics.routes.js', 'Analytics');

// New routes
const pricingRoutes = loadRoute('./routes/pricing.routes.js', 'Pricing');
const shareRoutes = loadRoute('./routes/share.routes.js', 'Share');
const automationRoutes = loadRoute('./routes/automation.routes.js', 'Automation');
const authRoutes = loadRoute('./routes/auth.routes.js', 'Auth');
const userRoutes = loadRoute('./routes/user.routes.js', 'User');
const dataRoutes = loadRoute('./routes/data.routes.js', 'Data');
const sellerRoutes = loadRoute('./routes/seller.routes.js', 'Seller');
const productRoutes = loadRoute('./routes/product.routes.js', 'Product');
const applicationRoutes = loadRoute('./routes/application.routes.js', 'Application');
const mediaRoutes = loadRoute('./routes/media.routes.js', 'Media');

// -------------------------
// CRITICAL ENDPOINTS FOR FRONTEND
// -------------------------

// Add endpoints that your frontend is calling
app.get('/api/v1/automation/status', (req, res) => {
  res.json({
    success: true,
    data: {
      isRunning: false,
      lastRun: new Date().toISOString(),
      settings: {
        autoAdjust: false,
        demandFactor: 1.0,
        seasonalAdjustment: 0,
        competitorTracking: false,
        profitMargin: 30
      }
    }
  });
});

app.post('/api/v1/automation/start', (req, res) => {
  res.json({
    success: true,
    message: 'Automation started',
    data: {
      startedAt: new Date().toISOString()
    }
  });
});

app.post('/api/v1/automation/stop', (req, res) => {
  res.json({
    success: true,
    message: 'Automation stopped',
    data: {
      stoppedAt: new Date().toISOString()
    }
  });
});

app.get('/api/v1/analytics/shares', (req, res) => {
  res.json({
    success: true,
    data: {
      summary: {
        totalShares: 156,
        today: 12,
        thisWeek: 87,
        thisMonth: 156
      },
      platformStats: [
        { platform: 'whatsapp', totalShares: 65, percentage: 42 },
        { platform: 'facebook', totalShares: 48, percentage: 31 },
        { platform: 'twitter', totalShares: 28, percentage: 18 },
        { platform: 'instagram', totalShares: 15, percentage: 9 }
      ],
      recentShares: [
        {
          platform: 'whatsapp',
          planName: 'Professional',
          timestamp: new Date().toISOString()
        }
      ]
    }
  });
});

app.post('/api/v1/analytics/shares/track', (req, res) => {
  res.json({
    success: true,
    message: 'Share tracked successfully'
  });
});

app.post('/api/v1/payments/initialize', (req, res) => {
  res.json({
    success: true,
    message: 'Payment initialized',
    data: {
      paymentId: `pay_${Date.now()}`,
      amount: req.body.amount || 4999,
      currency: 'INR'
    }
  });
});

app.post('/api/v1/payments/otp/verify', (req, res) => {
  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: {
      transactionId: `TXN${Date.now()}`,
      status: 'completed'
    }
  });
});

app.post('/api/v1/payments/otp/generate', (req, res) => {
  res.json({
    success: true,
    message: 'OTP sent successfully',
    data: {
      otpLength: 6,
      expiresIn: 300 // 5 minutes
    }
  });
});

app.get('/api/v1/plans', (req, res) => {
  const plans = [
    {
      _id: '1',
      name: 'Basic',
      currentPrice: 1999,
      description: 'Perfect for small teams and startups',
      features: [
        'Up to 5 team members',
        '100GB cloud storage',
        'Basic analytics dashboard',
        'Email support (48h response)',
        'Basic API access (1000 calls/day)',
        'Single project management'
      ],
      popular: false,
      category: 'starter',
      taxPercentage: 18
    },
    {
      _id: '2',
      name: 'Professional',
      currentPrice: 4999,
      description: 'For growing businesses and SMEs',
      features: [
        'Up to 20 team members',
        '500GB cloud storage',
        'Advanced analytics & reports',
        'Priority support (24h response)',
        'Custom API integrations',
        'Advanced API (10,000 calls/day)',
        'Multiple project management',
        'Team collaboration tools'
      ],
      popular: true,
      category: 'growth',
      taxPercentage: 18
    },
    {
      _id: '3',
      name: 'Enterprise',
      currentPrice: 14999,
      description: 'For large organizations & enterprises',
      features: [
        'Unlimited team members',
        '2TB cloud storage',
        'Enterprise-grade analytics',
        '24/7 dedicated support',
        'Custom solutions & integrations',
        'White-label options',
        'SLA guarantee (99.9% uptime)',
        'Advanced security features',
        'Custom training sessions',
        'Personal account manager'
      ],
      popular: false,
      category: 'enterprise',
      taxPercentage: 18
    }
  ];
  
  res.json({
    success: true,
    data: { plans }
  });
});

app.post('/api/v1/coupons/validate', (req, res) => {
  const { code } = req.body;
  const validCoupons = ['WELCOME20', 'SAVE15', 'INDIAN10', 'STARTUP25'];
  
  if (validCoupons.includes(code)) {
    res.json({
      success: true,
      valid: true,
      coupon: {
        discountValue: code === 'WELCOME20' ? 20 : 
                     code === 'SAVE15' ? 15 : 
                     code === 'INDIAN10' ? 10 : 25,
        name: `${code} Discount`
      }
    });
  } else {
    res.json({
      success: false,
      valid: false,
      error: 'Invalid coupon code'
    });
  }
});

// -------------------------
// DATABASE CONNECTION FUNCTION
// -------------------------

// Add database connection function if not in separate file
// const connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database';
    
//     const conn = await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });

//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     return conn;
//   } catch (error) {
//     console.error(`❌ MongoDB Connection Error: ${error.message}`);
//     console.log('💡 Make sure MongoDB is running. Try:');
//     console.log('   Windows: mongod --dbpath "C:\\data\\db"');
//     console.log('   Mac/Linux: brew services start mongodb-community');
//     process.exit(1);
//   }
// };

// -------------------------
// API ROUTES
// -------------------------

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API Server is running successfully!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      payments: '/api/v1/payments',
      plans: '/api/v1/plans',
      coupons: '/api/v1/coupons',
      analytics: '/api/v1/analytics',
      auth: '/api/auth',
      users: '/api/users',
      data: '/api/data',
      sellers: '/api/sellers',
      products: '/api/products',
      applications: '/api/applications',
      media: '/api/media',
      pricing: '/api/pricing',
      automation: '/api/automation',
      share: '/api/share'
    }
  });
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Server is healthy 🟢',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Original API Routes (v1)
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/plans', planRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// New API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/automation', automationRoutes);

// -------------------------
// ERROR HANDLING
// -------------------------

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableEndpoints: '/api/health for API info'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// -------------------------
// START SERVER
// -------------------------
const startServer = async () => {
  try {
    // Connect to database (fail gracefully in development)
    console.log('\n🔗 Connecting to database...');
    try {
      await connectDB();
    } catch (dbErr) {
      console.error('❌ MongoDB Connection Error:', dbErr.message || dbErr);
      if (process.env.NODE_ENV === 'production') {
        throw dbErr;
      } else {
        console.warn('⚠️  Continuing without database (development mode)');
      }
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Local: http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}`);
      console.log('='.repeat(60));
      console.log('\n✅ Server started successfully!');
      console.log('\n📋 Test these endpoints:');
      console.log('  • http://localhost:8000');
      console.log('  • http://localhost:8000/health');
      console.log('  • http://localhost:8000/api/v1/plans');
      console.log('  • http://localhost:8000/api/v1/automation/status');
      console.log('\nPress Ctrl+C to stop\n');
    });



    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try killing the process:');
        console.log('   Windows: netstat -ano | findstr :8000');
        console.log('   Then: taskkill /PID [PID] /F');
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        throw error;
      }
    });
    
    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
      
      server.close(async () => {
        console.log('✅ HTTP server closed');
        
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.close();
          console.log('✅ MongoDB connection closed');
        }
        
        console.log('👋 Server shutdown complete');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('❌ Server startup error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your .env file for correct MONGODB_URI');
    console.log('3. Try: mongod --dbpath "C:\\data\\db" (Windows)');
    process.exit(1);
  }
};

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;