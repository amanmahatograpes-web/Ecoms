//    const mongoose = require('mongoose');

   

//     const MONGO_URI = process.env.MONGO_URI;
//     const DB_Name = process.env.DB_Name;

//     mongoose.connect(MONGO_URI,{
//         dbName:DB_Name
//     }).then(
//         () => {
//             console.log('Connect to database');
//         }
//     ).catch((err)=>{
//         console.log('Error connecting  the database' + err)
//     })
//     module.exports = connectDB;


// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;
// const DB_Name = process.env.DB_Name;

// const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URI, {
//             dbName: DB_Name
//         });
//         console.log('Connected to database');
//     } catch (err) {
//         console.error('Error connecting to the database:', err.message);
//         process.exit(1); // Exit process with failure
//     }
// };

// module.exports = connectDB;



// db.js
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config(); // load env

// const MONGO_URI = process.env.MONGO_URI;
// const DB_Name = process.env.DB_Name;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       dbName: DB_Name,
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`✅ MongoDB connected to database: ${DB_Name}`);
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
//     process.exit(1); // stop the app if DB fails
//   }
// };

// module.exports = connectDB;



// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       dbName: process.env.DB_NAME,
//     });
//     console.log(`✅ MongoDB connected successfully: ${process.env.DB_NAME}`);
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     process.exit(1);
//   }
// };

import mongoose from "mongoose";

/**
 * Remove existing validation from users collection (if exists)
 */
const dropValidationIfExists = async () => {
  try {
    const db = mongoose.connection.db;

    if (!db) return;

    const collections = await db
      .listCollections({ name: "users" })
      .toArray();

    if (collections.length > 0) {
      await db.command({
        collMod: "users",
        validator: {},
        validationLevel: "off",
      });
      console.log("✅ Removed existing validation from 'users' collection");
    }
  } catch (error) {
    console.log("ℹ️ No validation found or collection doesn't exist");
  }
};

/**
 * Connect MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      maxPoolSize: 10,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.name}`);

    await dropValidationIfExists();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;

// config/database.js
// const mongoose = require('mongoose');

// const dropValidationIfExists = async () => {
//   try {
//     const db = mongoose.connection.db;
//     const collections = await db.listCollections({ name: "users" }).toArray();
//     if (collections.length > 0) {
//       await db.command({
//         collMod: "users",
//         validator: {},
//         validationLevel: "off",
//       });
//       console.log("✅ Removed existing validation from 'users' collection");
//     }
//   } catch {
//     console.log("ℹ️ No validation found or collection doesn't exist");
//   }
// };

// const connectDB = async () => {
//   try {
//     const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    
//     console.log(`🔗 Connecting to MongoDB: ${mongoURI}`);
    
//     const options = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//     };

//     await mongoose.connect(mongoURI, options);
    
//     console.log('✅ MongoDB Connected Successfully');
    
//     await dropValidationIfExists();
    
//     // MongoDB connection event handlers
//     mongoose.connection.on('error', (err) => {
//       console.error('❌ MongoDB connection error:', err);
//     });
    
//     mongoose.connection.on('disconnected', () => {
//       console.warn('⚠️  MongoDB disconnected');
//     });
    
//     return mongoose.connection;
    
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error.message);
    
//     if (error.message.includes('ECONNREFUSED')) {
//       console.log('\n💡 MongoDB is not running. Please start it:');
//       console.log('   For Windows: mongod --dbpath "C:\\data\\db"');
//       console.log('   Or install as service: net start MongoDB');
//     }
    
//     // Don't exit in development
//     if (process.env.NODE_ENV !== 'production') {
//       console.log('⚠️  Continuing without database (development mode)');
//       return null;
//     } else {
//       throw error;
//     }
//   }
// };

// module.exports = connectDB;