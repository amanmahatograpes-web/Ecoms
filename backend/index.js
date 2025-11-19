// // server.js
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json()); // parse JSON requests

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     dbName: process.env.DB_NAME,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB connection error:", err));

// // ----------------------
// // User Schema & Model
// // ----------------------
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   mobile: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // ----------------------
// // Generic Data Schema for JSON Upload
// // ----------------------
// const dataSchema = new mongoose.Schema({}, { strict: false }); // allows any JSON structure
// const Data = mongoose.model("Data", dataSchema);

// // ----------------------
// // Routes
// // ----------------------

// // Signup route
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("👉 Incoming signup request");
//     console.log("Method:", req.method);
//     console.log("URL:", req.url);
//     console.log("Headers:", req.headers);
//     console.log("Body:", req.body);

//     const { fullName, email, password, confirmPassword, mobile } = req.body;

//     // Validation
//     if (!fullName || !email || !password || !confirmPassword || !mobile)
//       return res.status(400).json({ message: "All fields are required" });

//     if (password !== confirmPassword)
//       return res.status(400).json({ message: "Passwords do not match" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "Email already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       username: req.body.username || `user${Date.now()}`, // default unique username
//       fullName: req.body.fullName,
//       email: req.body.email,
//       password: hashedPassword,
//       mobile: req.body.mobile,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Signup error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // JSON upload route
// app.post("/upload-json", async (req, res) => {
//   try {
//     const jsonData = req.body; // JSON sent from client
//     const newData = new Data(jsonData);
//     await newData.save();
//     res.status(200).json({ status: "success", data: newData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ status: "error", message: err.message });
//   }
// });

// // ----------------------
// // Start Server
// // ----------------------
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



// server.js
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB connection with detailed logging
// mongoose
//   .connect(process.env.MONGO_URI, {
//     dbName: process.env.DB_NAME,
//   })
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     console.log("📦 Database:", process.env.DB_NAME);
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });

// // ----------------------
// // User Schema & Model
// // ----------------------
// const userSchema = new mongoose.Schema(
//   {
// username: { type: String, required: false, default: '' }
// ,    fullName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     mobile: { type: String, required: true },
//   },
//   { timestamps: true } // adds createdAt and updatedAt
// );

// const User = mongoose.model("User", userSchema);

// // ----------------------
// // Generic Data Schema for JSON Upload
// // ----------------------
// const dataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
// const Data = mongoose.model("Data", dataSchema);

// // ----------------------
// // Routes
// // ----------------------

// // Signup route
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("\n🔵 ========== SIGNUP REQUEST ==========");
//     console.log("📥 Request received at:", new Date().toISOString());
//     console.log("📋 Request Body:", JSON.stringify(req.body, null, 2));

//     const { fullName, email, password, confirmPassword, mobile } = req.body;

//     // Validation
//     if (!fullName || !email || !password || !confirmPassword || !mobile) {
//       console.log("⚠️  Validation failed: Missing fields");
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//       console.log("⚠️  Validation failed: Passwords don't match");
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     // Check existing user
//     console.log("🔍 Checking if user exists with email:", email);
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       console.log("⚠️  User already exists with email:", email);
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash password
//     console.log("🔐 Hashing password...");
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user object
//     const userData = {
//       username: req.body.username || `user${Date.now()}`,
//       fullName: fullName,
//       email: email,
//       password: hashedPassword,
//       mobile: mobile,
//     };

//     console.log("📝 User data to be saved:");
//     console.log({
//       username: userData.username,
//       fullName: userData.fullName,
//       email: userData.email,
//       mobile: userData.mobile,
//       password: "[HASHED]", // Don't log actual password
//     });

//     const newUser = new User(userData);

//     // Save to MongoDB
//     console.log("💾 Saving user to MongoDB...");
//     await newUser.save();

//     console.log("✅ User saved successfully!");
//     console.log("📊 Saved user details:");
//     console.log({
//       id: newUser._id,
//       username: newUser.username,
//       email: newUser.email,
//       createdAt: newUser.createdAt,
//     });
//     console.log("🔵 ========== END SIGNUP REQUEST ==========\n");

//     res.status(201).json({
//       message: "User registered successfully",
//       userId: newUser._id,
//     });
//   } catch (err) {
//     console.error("❌ Signup error:", err.message);
//     console.error("Stack trace:", err.stack);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // app.post("/signup", async (req, res) => {
// //   try {
// //     console.log("\n🔵 SIGNUP REQUEST STARTED 🔵");
// //     console.log("📥 Request Body:", req.body);

// //     // Destructure and trim inputs
// //     const { fullName, email, password, confirmPassword, mobile, username } = req.body;

// //     // 1️⃣ Validate required fields
// //     if (!fullName?.trim() || !email?.trim() || !password || !confirmPassword || !mobile?.trim()) {
// //       return res.status(400).json({ message: "All fields are required" });
// //     }

// //     // 2️⃣ Passwords must match
// //     if (password !== confirmPassword) {
// //       return res.status(400).json({ message: "Passwords do not match" });
// //     }

// //     // 3️⃣ Check if user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: "Email already exists" });
// //     }

// //     // 4️⃣ Hash password
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     // 5️⃣ Create user object
// //     const newUser = new User({
// //       username: username?.trim() || `user${Date.now()}`,
// //       fullName: fullName.trim(),
// //       email: email.trim().toLowerCase(),
// //       password: hashedPassword,
// //       mobile: mobile.trim(),
// //     });

// //     // 6️⃣ Save user to MongoDB
// //     const savedUser = await newUser.save();

// //     console.log("✅ User saved successfully:", savedUser._id);

// //     // 7️⃣ Return success response
// //     return res.status(201).json({
// //       message: "User registered successfully",
// //       userId: savedUser._id,
// //     });
// //   } catch (err) {
// //     // Check if error is validation from MongoDB
// //     if (err.name === "ValidationError") {
// //       console.error("❌ MongoDB Validation Error:", err.message);
// //       return res.status(400).json({ message: "Validation failed", error: err.message });
// //     }

// //     console.error("❌ Signup Server Error:", err);
// //     return res.status(500).json({ message: "Server error", error: err.message });
// //   }
// // });


// // JSON upload route
// app.post("/upload-json", async (req, res) => {
//   try {
//     console.log("\n🟢 ========== JSON UPLOAD REQUEST ==========");
//     console.log("📥 Request received at:", new Date().toISOString());
//     console.log("📋 JSON Data received:");
//     console.log(JSON.stringify(req.body, null, 2));

//     const jsonData = req.body;

//     console.log("💾 Saving JSON data to MongoDB...");
//     const newData = new Data(jsonData);
//     await newData.save();

//     console.log("✅ JSON data saved successfully!");
//     console.log("📊 Saved data details:");
//     console.log({
//       id: newData._id,
//       createdAt: newData.createdAt,
//     });
//     console.log("🟢 ========== END JSON UPLOAD REQUEST ==========\n");

//     res.status(200).json({
//       status: "success",
//       data: newData,
//     });
//   } catch (err) {
//     console.error("❌ JSON upload error:", err.message);
//     console.error("Stack trace:", err.stack);
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// });

// // Test route
// app.get("/", (req, res) => {
//   console.log("🏠 Home route accessed");
//   res.json({
//     message: "Server is running!",
//     endpoints: {
//       signup: "POST /signup",
//       uploadJson: "POST /upload-json",
//     },
//   });
// });

// // Get all users (for testing - remove in production)
// app.get("/users", async (req, res) => {
//   try {
//     console.log("\n📋 Fetching all users...");
//     const users = await User.find().select("-password"); // exclude password
//     console.log(`✅ Found ${users.length} users`);
//     res.json(users);
//   } catch (err) {
//     console.error("❌ Error fetching users:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ----------------------
// // Start Server
// // ----------------------
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log("\n🚀 ========================================");
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log("🚀 ========================================\n");
//   console.log("📡 Available endpoints:");
//   console.log(`   GET  http://localhost:${PORT}/`);
//   console.log(`   POST http://localhost:${PORT}/signup`);
//   console.log(`   POST http://localhost:${PORT}/upload-json`);
//   console.log(`   GET  http://localhost:${PORT}/users`);
//   console.log("\n✨ Waiting for requests...\n");
// });



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB connection with detailed logging
// mongoose
//   .connect(process.env.MONGO_URI, {
//     dbName: process.env.DB_NAME,
//   })
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     console.log("📦 Database:", process.env.DB_NAME);
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });

// // ----------------------
// // User Schema & Model
// // ----------------------
// // ----------------------
// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: false, unique: true, sparse: true },
//     fullName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     mobile: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// // ----------------------
// // Generic Data Schema for JSON Upload
// // ----------------------
// const dataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
// const Data = mongoose.model("Data", dataSchema);

// // ----------------------
// // Routes
// // ----------------------

// // Signup route with improved error handling
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("\n🔵 SIGNUP REQUEST STARTED 🔵");
//     console.log("📥 Request Body:", req.body);

//     // Destructure and trim inputs
//     const { fullName, email, password, confirmPassword, mobile, username } = req.body;

//     // 1️⃣ Validate required fields
//     if (!fullName?.trim() || !email?.trim() || !password || !confirmPassword || !mobile?.trim()) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 2️⃣ Passwords must match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     // 3️⃣ Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // 4️⃣ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 5️⃣ Create user object
//     const newUser = new User({
//       username: username?.trim() || `user${Date.now()}`,
//       fullName: fullName.trim(),
//       email: email.trim().toLowerCase(),
//       password: hashedPassword,
//       mobile: mobile.trim(),
//     });

//     // 6️⃣ Save user to MongoDB
//     const savedUser = await newUser.save();

//     console.log("✅ User saved successfully:", savedUser._id);

//     // 7️⃣ Return success response
//     return res.status(201).json({
//       message: "User registered successfully",
//       userId: savedUser._id,
//     });
//   } catch (err) {
//     // Check if error is validation from MongoDB
//     if (err.name === "ValidationError") {
//       console.error("❌ MongoDB Validation Error:", err.message);
//       return res.status(400).json({ message: "Validation failed", error: err.message });
//     }

//     console.error("❌ Signup Server Error:", err);
//     return res.status(500).json({ message: "Server error", error: err.message });
//   }
// });
// +
// // JSON upload route
// app.post("/upload-json", async (req, res) => {
//   try {
//     console.log("\n🟢 ========== JSON UPLOAD REQUEST ==========");
//     console.log("📥 Request received at:", new Date().toISOString());
//     console.log("📋 JSON Data received:");
//     console.log(JSON.stringify(req.body, null, 2));

//     const jsonData = req.body;

//     console.log("💾 Saving JSON data to MongoDB...");
//     const newData = new Data(jsonData);
//     await newData.save();

//     console.log("✅ JSON data saved successfully!");
//     console.log("📊 Saved data details:");
//     console.log({
//       id: newData._id,
//       createdAt: newData.createdAt,
//     });
//     console.log("🟢 ========== END JSON UPLOAD REQUEST ==========\n");

//     res.status(200).json({
//       status: "success",
//       data: newData,
//     });
//   } catch (err) {
//     console.error("❌ JSON upload error:", err.message);
//     console.error("Stack trace:", err.stack);
//     res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// });

// // Test route
// app.get("/", (req, res) => {
//   console.log("🏠 Home route accessed");
//   res.json({
//     message: "Server is running!",
//     endpoints: {
//       signup: "POST /signup",
//       uploadJson: "POST /upload-json",
//       users: "GET /users",
//     },
//   });
// });

// // Get all users (for testing - remove in production)
// app.get("/users", async (req, res) => {
//   try {
//     console.log("\n📋 Fetching all users...");
//     const users = await User.find().select("-password");
//     console.log(`✅ Found ${users.length} users`);
//     res.json(users);
//   } catch (err) {
//     console.error("❌ Error fetching users:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ----------------------
// // Start Server
// // ----------------------
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log("\n🚀 ========================================");
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log("🚀 ========================================\n");
//   console.log("📡 Available endpoints:");
//   console.log(`   GET  http://localhost:${PORT}/`);
//   console.log(`   POST http://localhost:${PORT}/signup`);
//   console.log(`   POST http://localhost:${PORT}/upload-json`);
//   console.log(`   GET  http://localhost:${PORT}/users`);
//   console.log("\n✨ Waiting for requests...\n");
// });








// ----------------------
// Imports
// ----------------------
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// // ----------------------
// // Environment Setup
// // ----------------------
// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // ----------------------
// // MongoDB Connection
// // ----------------------
// mongoose
//   .connect(process.env.MONGO_URI, {
//     dbName: process.env.DB_NAME,
//   })
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     console.log("📦 Database:", process.env.DB_NAME);
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//   });

// // ----------------------
// // User Schema & Model
// // ----------------------
// const userSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     mobile: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// // ----------------------
// // Generic Data Schema for JSON Upload
// // ----------------------
// const dataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
// const Data = mongoose.model("Data", dataSchema);

// // ----------------------
// // Routes
// // ----------------------

// // ✅ Signup Route
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("\n🔵 SIGNUP REQUEST STARTED 🔵");
//     console.log("📥 Request Body:", req.body);

//     const { fullName, email, password, confirmPassword, mobile } = req.body;

//     // Input Validation
//     if (!fullName?.trim() || !email?.trim() || !password || !confirmPassword || !mobile?.trim()) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     // Check Existing User
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash Password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create User
//     const newUser = new User({
//       fullName: fullName.trim(),
//       email: email.trim().toLowerCase(),
//       password: hashedPassword,
//       mobile: mobile.trim(),
//     });

//     // Save User
//     const savedUser = await newUser.save();
//     console.log("✅ User saved successfully:", savedUser._id);

//     // Send Response
//     res.status(201).json({
//       message: "User registered successfully",
//       userId: savedUser._id,
//     });
//   } catch (err) {
//     console.error("❌ Signup Server Error (Full):", err);
//     res.status(500).json({
//       message: "Server error",
//       error: err.message,
//       stack: err.stack,
//       code: err.code || null,
//     });
//   }
// });

// // ✅ Upload JSON Route
// app.post("/upload-json", async (req, res) => {
//   try {
//     console.log("\n🟢 JSON UPLOAD REQUEST RECEIVED");
//     console.log("📥 Request Body:", JSON.stringify(req.body, null, 2));

//     const jsonData = req.body;
//     const newData = new Data(jsonData);
//     await newData.save();

//     console.log("✅ JSON data saved successfully:", newData._id);
//     res.status(200).json({ status: "success", data: newData });
//   } catch (err) {
//     console.error("❌ JSON Upload Error:", err);
//     res.status(500).json({ status: "error", message: err.message });
//   }
// });

// // ✅ Get All Users (testing)
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find().select("-password"); // Hide passwords
//     res.json(users);
//   } catch (err) {
//     console.error("❌ Fetch Users Error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Home Route
// app.get("/", (req, res) => {
//   res.json({
//     message: "🚀 Server is running successfully!",
//     endpoints: {
//       signup: "POST /signup",
//       uploadJson: "POST /upload-json",
//       users: "GET /users",
//     },
//   });
// });

// // ----------------------
// // Start Server
// // ----------------------
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log("\n🚀 ========================================");
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log("🚀 ========================================\n");
// });



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";

// dotenv.config();

// const app = express();

// // ----------------------
// // Middleware
// // ----------------------
// app.use(cors({
//   origin: process.env.CLIENT_URL || "*",
//   credentials: true
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // ----------------------
// // MongoDB Connection with Error Handling
// // ----------------------
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       dbName: process.env.DB_NAME,
//       maxPoolSize: 10,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });
//     console.log("✅ MongoDB connected successfully");
//     console.log("📦 Database:", process.env.DB_NAME);
    
//     // ✅ Drop validation if exists on Users collection
//     await dropValidationIfExists();
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1);
//   }
// };

// //  
// // ----------------------
// // Forgot Password: Send OTP
// // ----------------------
// const otpStore = new Map(); // Temporary in-memory storage (you can later move to DB)

// app.post("/forgot-password/send-otp", async (req, res) => {
//   try {
//     const { mobile } = req.body;
//     if (!mobile) {
//       return res.status(400).json({ success: false, message: "Mobile number is required" });
//     }

//     const user = await User.findOne({ mobile: mobile.trim() });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "No user found with this mobile number" });
//     }

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Store OTP temporarily for 5 minutes
//     otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

//     console.log(`📱 OTP for ${mobile}: ${otp}`);

//     // (Later you can integrate Twilio or Fast2SMS here)
//     res.json({ success: true, message: "OTP sent successfully!" });
//   } catch (err) {
//     console.error("❌ Send OTP Error:", err);
//     res.status(500).json({ success: false, message: "Failed to send OTP" });
//   }
// });




// // ✅ Function to remove existing validation from Users collection
// const dropValidationIfExists = async () => {
//   try {
//     const db = mongoose.connection.db;
//     const collections = await db.listCollections({ name: 'users' }).toArray();
    
//     if (collections.length > 0) {
//       // Remove validator if it exists
//       await db.command({
//         collMod: 'users',
//         validator: {},
//         validationLevel: 'off'
//       });
//       console.log("✅ Removed existing validation from 'users' collection");
//     }
//   } catch (err) {
//     console.log("ℹ️ No existing validation to remove or collection doesn't exist yet");
//   }
// };

// // Handle connection events
// mongoose.connection.on('error', (err) => {
//   console.error('❌ MongoDB connection error:', err);
// });

// mongoose.connection.on('disconnected', () => {
//   console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
// });

// // ----------------------
// // User Schema & Model (Simplified - No strict validation at DB level)
// // ----------------------
// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: false,
//       unique: true,
//       sparse: true,
//       trim: true,
//       lowercase: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     mobile: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   { 
//     timestamps: true,
//     strict: true,
//     validateBeforeSave: true
//   }
// );

// // Index for faster queries
// userSchema.index({ email: 1 });
// userSchema.index({ username: 1 });

// const User = mongoose.model("User", userSchema, "users");

// // ----------------------
// // Generic Data Schema for JSON Upload
// // ----------------------
// const dataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
// const Data = mongoose.model("Data", dataSchema, "data");

// // ----------------------
// // Validation Helper Functions
// // ----------------------
// const validateEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const validatePassword = (password) => {
//   return password && password.length >= 6;
// };

// const validateMobile = (mobile) => {
//   const mobileRegex = /^[0-9]{10,15}$/;
//   return mobileRegex.test(mobile);
// };

// // ----------------------
// // Routes
// // ----------------------

// // Health check route
// app.get("/", (req, res) => {
//   res.json({
//     status: "running",
//     message: "🚀 Server is running successfully!",
//     timestamp: new Date().toISOString(),
//     endpoints: {
//       signup: "POST /signup",
//       login: "POST /login",
//       uploadJson: "POST /upload-json",
//       users: "GET /users",
//       data: "GET /data"
//     },
//   });
// });

// // ----------------------
// // Signup Route
// // ----------------------
// app.post("/signup", async (req, res) => {
//   try {
//     console.log("\n🔵 SIGNUP REQUEST STARTED 🔵");
//     console.log("📥 Request Body:", req.body);
    
//     const { fullName, email, password, confirmPassword, mobile, username } = req.body;

//     // Validate required fields
//     if (!fullName?.trim()) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Full name is required" 
//       });
//     }

//     if (!email?.trim()) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Email is required" 
//       });
//     }

//     if (!validateEmail(email.trim())) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Please provide a valid email address" 
//       });
//     }

//     if (!password) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Password is required" 
//       });
//     }

//     if (!validatePassword(password)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Password must be at least 6 characters long" 
//       });
//     }

//     if (!confirmPassword) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Please confirm your password" 
//       });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Passwords do not match" 
//       });
//     }

//     if (!mobile?.trim()) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Mobile number is required" 
//       });
//     }

//     if (!validateMobile(mobile.trim())) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Please provide a valid mobile number (10-15 digits)" 
//       });
//     }

//     // Check for existing user
//     const existingUser = await User.findOne({ 
//       email: email.trim().toLowerCase() 
//     });
    
//     if (existingUser) {
//       console.log("⚠️ Email already exists:", email);
//       return res.status(409).json({ 
//         success: false,
//         message: "An account with this email already exists" 
//       });
//     }

//     // Check for existing username if provided
//     if (username?.trim()) {
//       const existingUsername = await User.findOne({ 
//         username: username.trim().toLowerCase() 
//       });
      
//       if (existingUsername) {
//         return res.status(409).json({ 
//           success: false,
//           message: "This username is already taken" 
//         });
//       }
//     }

//     // Hash password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create user object
//     const userData = {
//       username: username?.trim() || `user${Date.now()}`,
//       fullName: fullName.trim(),
//       email: email.trim().toLowerCase(),
//       password: hashedPassword,
//       mobile: mobile.trim(),
//     };

//     console.log("📝 Creating user with data:", { ...userData, password: "[HIDDEN]" });

//     // Create and save user
//     const newUser = new User(userData);
//     const savedUser = await newUser.save();
    
//     console.log("✅ User registered successfully:", savedUser._id);

//     // Return success response without password
//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: savedUser._id,
//         username: savedUser.username,
//         fullName: savedUser.fullName,
//         email: savedUser.email,
//         mobile: savedUser.mobile,
//         createdAt: savedUser.createdAt
//       }
//     });

//   } catch (err) {
//     console.error("❌ Signup Error:", err);
//     console.error("Error name:", err.name);
//     console.error("Error code:", err.code);
    
//     // Handle duplicate key errors
//     if (err.code === 11000) {
//       const field = Object.keys(err.keyPattern || {})[0] || 'field';
//       return res.status(409).json({ 
//         success: false,
//         message: `This ${field} is already registered` 
//       });
//     }

//     // Handle validation errors
//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map(e => e.message);
//       return res.status(400).json({ 
//         success: false,
//         message: messages.join(', ') 
//       });
//     }

//     // Handle MongoDB validation errors (code 121)
//     if (err.code === 121) {
//       console.error("❌ MongoDB Schema Validation Error");
//       console.error("This usually means the collection has a validator that doesn't match your data");
//       return res.status(500).json({ 
//         success: false,
//         message: "Database validation error. Please contact support." 
//       });
//     }

//     res.status(500).json({ 
//       success: false,
//       message: "An error occurred during registration. Please try again.",
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// });

// // ----------------------
// // Login Route
// // ----------------------
// app.post("/login", async (req, res) => {
//   try {
//     console.log("\n🔵 LOGIN REQUEST STARTED 🔵");
    
//     const { email, password } = req.body;

//     // Validate inputs
//     if (!email?.trim() || !password) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Email and password are required" 
//       });
//     }

//     // Find user
//     const user = await User.findOne({ 
//       email: email.trim().toLowerCase() 
//     });

//     if (!user) {
//       return res.status(401).json({ 
//         success: false,
//         message: "Invalid email or password" 
//       });
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ 
//         success: false,
//         message: "Invalid email or password" 
//       });
//     }

//     console.log("✅ User logged in successfully:", user._id);

//     // Return user data without password
//     res.json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user._id,
//         username: user.username,
//         fullName: user.fullName,
//         email: user.email,
//         mobile: user.mobile
//       }
//     });

//   } catch (err) {
//     console.error("❌ Login Error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "An error occurred during login. Please try again." 
//     });
//   }
// });

// // ----------------------
// // Upload JSON Route
// // ----------------------
// app.post("/upload-json", async (req, res) => {
//   try {
//     console.log("\n🟢 JSON UPLOAD REQUEST RECEIVED");

//     const jsonData = req.body;

//     // Validate that data exists
//     if (!jsonData || Object.keys(jsonData).length === 0) {
//       return res.status(400).json({ 
//         success: false,
//         message: "No data provided" 
//       });
//     }

//     const newData = new Data(jsonData);
//     const savedData = await newData.save();

//     console.log("✅ JSON data saved successfully:", savedData._id);
    
//     res.status(201).json({ 
//       success: true,
//       message: "Data uploaded successfully",
//       data: savedData 
//     });

//   } catch (err) {
//     console.error("❌ JSON Upload Error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to upload data",
//       error: err.message 
//     });
//   }
// });

// // ----------------------
// // Get All Data
// // ----------------------
// app.get("/data", async (req, res) => {
//   try {
//     const { limit = 50, page = 1 } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const data = await Data.find()
//       .limit(parseInt(limit))
//       .skip(skip)
//       .sort({ createdAt: -1 });

//     const total = await Data.countDocuments();

//     res.json({
//       success: true,
//       data,
//       pagination: {
//         total,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         pages: Math.ceil(total / parseInt(limit))
//       }
//     });
//   } catch (err) {
//     console.error("❌ Fetch Data Error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to fetch data" 
//     });
//   }
// });

// // ----------------------
// // Get All Users (Admin/Testing)
// // ----------------------
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find()
//       .select("-password")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: users.length,
//       users
//     });
//   } catch (err) {
//     console.error("❌ Fetch Users Error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to fetch users" 
//     });
//   }
// });

// // ----------------------
// // Get Single User by ID
// // ----------------------
// app.get("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");

//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         message: "User not found" 
//       });
//     }

//     res.json({
//       success: true,
//       user
//     });
//   } catch (err) {
//     console.error("❌ Fetch User Error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to fetch user" 
//     });
//   }
// });

// // ----------------------
// // Delete User (for testing/cleanup)
// // ----------------------
// app.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         message: "User not found" 
//       });
//     }

//     res.json({
//       success: true,
//       message: "User deleted successfully"
//     });
//   } catch (err) {
//     console.error("❌ Delete User Error:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to delete user" 
//     });
//   }
// });

// // ----------------------
// // 404 Handler
// // ----------------------
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found"
//   });
// });

// // ----------------------
// // Global Error Handler
// // ----------------------
// app.use((err, req, res, next) => {
//   console.error("❌ Unhandled Error:", err);
//   res.status(500).json({
//     success: false,
//     message: "Internal server error"
//   });
// });



// // ----------------------
// // Forgot Password: Verify OTP & Reset Password
// // ----------------------
// app.post("/forgot-password/reset", async (req, res) => {
//   try {
//     const { mobile, otp, password } = req.body;

//     if (!mobile || !otp || !password) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     const storedOtp = otpStore.get(mobile);
//     if (!storedOtp) {
//       return res.status(400).json({ success: false, message: "No OTP request found. Please resend OTP." });
//     }

//     if (Date.now() > storedOtp.expiresAt) {
//       otpStore.delete(mobile);
//       return res.status(400).json({ success: false, message: "OTP expired. Please resend OTP." });
//     }

//     if (storedOtp.otp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     // Find user and update password
//     const user = await User.findOne({ mobile });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     await user.save();

//     otpStore.delete(mobile); // clear OTP after success

//     res.json({ success: true, message: "Password reset successfully!" });
//   } catch (err) {
//     console.error("❌ Reset Password Error:", err);
//     res.status(500).json({ success: false, message: "Failed to reset password" });
//   }
// });

// // ----------------------
// // Start Server
// // ----------------------
// const PORT = process.env.PORT || 8000;

// const startServer = async () => {
//   await connectDB();
  
//   app.listen(PORT, () => {
//     console.log("\n🚀 ========================================");
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//     console.log("🚀 ========================================\n");
//     console.log(`   GET  http://localhost:${PORT}/users`);
//   });
// };

// startServer().catch((err) => {
//   console.error("Failed to start server:", err);
//   process.exit(1);
// });




// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// // Routes
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import dataRoutes from "./routes/dataRoutes.js";
// import sellerRoutes from "./routes/sellerRoutes.js";

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/data", dataRoutes);
// app.use("/api/sellers", sellerRoutes);

// // Health Check
// app.get("/", (req, res) => {
//   res.json({ message: "🚀 Server running successfully!" });
// });


// app.get("/", (req, res) => {
//   res.send("🚀 Seller Backend API Running...");
// });

// // Error Handlers
// app.use((req, res) => res.status(404).json({ message: "Route not found" }));
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: "Internal server error" });
// });

// // Start Server
// const PORT = process.env.PORT || 8000;
// connectDB().then(() => {
//   app.listen(PORT, () =>
//     console.log(`🚀 Server running at http://localhost:${PORT}`)
//   );
// });



// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// // Routes
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import dataRoutes from "./routes/dataRoutes.js";
// import sellerRoutes from "./routes/sellerRoutes.js";
// // import roleRoutes from "./models/roleRoutes.js";
// dotenv.config();
// const app = express();

// // --------------------
// // Middleware
// // --------------------
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // --------------------
// // API Routes
// // --------------------
// app.use("/api/auth", authRoutes);   // Login, Signup, Forgot Password, Reset Password
// app.use("/api/users", userRoutes);
// app.use("/api/data", dataRoutes);
// app.use("/api/sellers", sellerRoutes);
// // app.use("/api/ role", sellerRoutes);
// // --------------------
// // Health Check
// // --------------------
// app.get("/", (req, res) => {
//   res.json({ message: "🚀 Server running successfully!" });
// });

// // --------------------
// // Error Handlers
// // --------------------
// app.use((req, res) => res.status(404).json({ message: "Route not found" }));
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: "Internal server error" });
// });

// // --------------------
// // Start Server
// // --------------------
// const PORT = process.env.PORT || 8000;

// connectDB().then(() => {
//   app.listen(PORT, () =>
//     console.log(`✅ Server running at http://localhost:${PORT}`)
//   );
// });






// =======================================
// server.js (ES Modules Version)
// =======================================



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------
// GLOBAL MIDDLEWARE
// -------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 🔥 GLOBAL REQUEST LOGGER (This prints request + body)
app.use((req, res, next) => {
  console.log(`🔵 [${req.method}] ${req.originalUrl}`);
  if (req.method === "POST" || req.method === "PUT") {
    console.log("📦 BODY RECEIVED:", req.body);
  }
  next();
});

// -------------------------
// STATIC FOLDER (Uploads)
// -------------------------
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

// -------------------------
// API ROUTES
// -------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/products", productRoutes);

// -------------------------
// HEALTH CHECK
// -------------------------
app.get("/", (req, res) => {
  console.log("⚡ Health check called");
  res.json({ message: "🚀 Server running successfully!" });
});

// -------------------------
// 404 HANDLER
// -------------------------
app.use((req, res) => {
  console.log("❗ Route not found:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

// -------------------------
// GLOBAL ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(500).json({ message: "Internal server error" });
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`✅ Server running at http://localhost:${PORT}`)
  );
});

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import connectDB from "./config/db.js";

// // Import Routes
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import dataRoutes from "./routes/dataRoutes.js";
// import sellerRoutes from "./routes/sellerRoutes.js";
// import productRoutes from "./routes/productRoutes.js"; // <-- added from your old backend

// // --------------------
// // Initial Setup
// // --------------------
// dotenv.config();
// const app = express();

// // Fix "__dirname" in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // --------------------
// // Middleware
// // --------------------
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // --------------------
// // Static Uploads Folder (same as old backend)
// // --------------------
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// app.use("/uploads", express.static(uploadDir));

// // --------------------
// // API Routes
// // --------------------
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/data", dataRoutes);
// app.use("/api/sellers", sellerRoutes);
// app.use("/api/products", productRoutes); // <--- connected successfully

// // --------------------
// // Health Check
// // --------------------
// app.get("/", (req, res) => {
//   res.json({ message: "🚀 Server running successfully!" });
// });

// // --------------------
// // Not Found Handler
// // --------------------
// app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// // --------------------
// // Error Handler
// // --------------------
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", err.stack);
//   res.status(500).json({ message: "Internal server error" });
// });

// // --------------------
// // Start Server
// // --------------------
// const PORT = process.env.PORT || 8000;

// connectDB().then(() => {
//   app.listen(PORT, () =>
//     console.log(`✅ Server running at http://localhost:${PORT}`)
//   );
// });







// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// // Import Routes
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import dataRoutes from "./routes/dataRoutes.js";
// import sellerRoutes from "./routes/sellerRoutes.js";

// dotenv.config();
// const app = express();

// // --------------------
// // 🔗 Connect Database
// // --------------------
// connectDB();

// // --------------------
// // ⚙️ Middleware
// // --------------------
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173", // ✅ Match your frontend port
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // --------------------
// // 📦 Routes
// // --------------------
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/data", dataRoutes);
// app.use("/api/sellers", sellerRoutes); // ✅ Seller route properly mounted

// // --------------------
// // 🩺 Health Check
// // --------------------
// app.get("/", (req, res) => {
//   res.json({ message: "🚀 API Server Running Successfully!" });
// });

// // --------------------
// // ❌ 404 Handler
// // --------------------
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // --------------------
// // ⚠️ Error Handler
// // --------------------
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", err);
//   res.status(500).json({ message: "Internal Server Error" });
// });

// // --------------------
// // 🚀 Start Server
// // --------------------
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running at: http://localhost:${PORT}`);
// });
