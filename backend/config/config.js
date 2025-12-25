require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 8000,
  
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/selling_applications',
  
  corsOrigins: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',') 
    : ['http://localhost:3000'],
  
  rateLimit: {
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    max: parseInt(process.env.API_RATE_LIMIT_MAX) || 100
  }
};

// Validate required environment variables
const validateConfig = () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is required in .env file');
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

module.exports = config;