


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
// OTP STORAGE (In-memory for demo - use Redis in production)
// -------------------------
const otpStorage = new Map();

// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to store OTP with expiration
function storeOTP(key, otp, expiryMinutes = 5) {
  const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
  otpStorage.set(key, {
    otp,
    expiryTime,
    attempts: 0,
    maxAttempts: 3
  });
}

// Function to verify OTP
function verifyOTP(key, inputOtp) {
  const stored = otpStorage.get(key);
  if (!stored) {
    return { valid: false, error: 'OTP not found or expired' };
  }

  if (Date.now() > stored.expiryTime) {
    otpStorage.delete(key);
    return { valid: false, error: 'OTP has expired' };
  }

  if (stored.attempts >= stored.maxAttempts) {
    otpStorage.delete(key);
    return { valid: false, error: 'Too many failed attempts' };
  }

  stored.attempts++;

  if (stored.otp === inputOtp) {
    otpStorage.delete(key);
    return { valid: true };
  }

  return { valid: false, error: 'Invalid OTP' };
}

// Function to cleanup expired OTPs
function cleanupExpiredOTPs() {
  const now = Date.now();
  for (const [key, value] of otpStorage.entries()) {
    if (now > value.expiryTime) {
      otpStorage.delete(key);
    }
  }
}

// Cleanup expired OTPs every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

// -------------------------
// CRITICAL ENDPOINTS FOR FRONTEND
// -------------------------

// Payment endpoints
app.post("/api/v1/payments/initialize", (req, res) => {
  console.log("💰 Payment initialize called:", req.body);
  res.json({
    success: true,
    message: "Payment initialized successfully",
    data: {
      paymentId: `pay_${Date.now()}`,
      amount: req.body.amount || 4999,
      currency: "INR",
      orderId: `order_${Date.now()}`,
      timestamp: new Date().toISOString(),
    },
  });
});

// Handle GET requests to payments/initialize (should be POST)
app.get("/api/v1/payments/initialize", (req, res) => {
  res.status(405).json({
    success: false,
    error: "METHOD_NOT_ALLOWED",
    message: "GET method not allowed for this endpoint. Use POST instead.",
    correctMethod: "POST"
  });
});

app.post("/api/v1/payments/otp/generate", (req, res) => {
  console.log("📱 OTP generate called:", req.body);
  
  const { paymentId, mobileNumber } = req.body;
  
  if (!paymentId) {
    return res.status(400).json({
      success: false,
      error: "PAYMENT_ID_REQUIRED",
      message: "Payment ID is required"
    });
  }

  // Generate OTP
  const otp = generateOTP();
  const otpKey = `payment_${paymentId}`;
  
  // Store OTP (expires in 5 minutes)
  storeOTP(otpKey, otp, 5);
  
  console.log(`📱 Generated OTP for payment ${paymentId}: ${otp} (sent to ${mobileNumber || 'registered mobile'})`);
  
  res.json({
    success: true,
    message: "OTP sent successfully to your registered mobile number",
    data: {
      otpLength: 6,
      expiresIn: 300, // 5 minutes in seconds
      maskedMobile: mobileNumber ? `******${mobileNumber.slice(-4)}` : "******7890",
      timestamp: new Date().toISOString(),
      paymentId
    },
  });
});

app.post("/api/v1/payments/otp/verify", (req, res) => {
  console.log("🔐 OTP verify called:", req.body);
  
  const { paymentId, otp } = req.body;
  
  if (!paymentId || !otp) {
    return res.status(400).json({
      success: false,
      error: "MISSING_PARAMETERS",
      message: "Payment ID and OTP are required"
    });
  }

  const otpKey = `payment_${paymentId}`;
  const verification = verifyOTP(otpKey, otp);
  
  if (!verification.valid) {
    return res.status(400).json({
      success: false,
      error: "OTP_VERIFICATION_FAILED",
      message: verification.error
    });
  }

  // OTP verified successfully - proceed with payment
  res.json({
    success: true,
    message: "Payment verified successfully",
    data: {
      transactionId: `TXN${Date.now()}`,
      status: "completed",
      amount: 4999, // This should come from the payment record
      paymentId,
      verifiedAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    },
  });
});

// Add endpoint to resend OTP
app.post("/api/v1/payments/otp/resend", (req, res) => {
  console.log("🔄 OTP resend called:", req.body);
  
  const { paymentId } = req.body;
  
  if (!paymentId) {
    return res.status(400).json({
      success: false,
      error: "PAYMENT_ID_REQUIRED",
      message: "Payment ID is required"
    });
  }

  const otpKey = `payment_${paymentId}`;
  const existingOTP = otpStorage.get(otpKey);
  
  // Check if we can resend (not too frequent)
  if (existingOTP && Date.now() - (existingOTP.expiryTime - 5 * 60 * 1000) < 60000) { // Less than 1 minute since last generation
    return res.status(429).json({
      success: false,
      error: "TOO_FREQUENT",
      message: "Please wait before requesting a new OTP"
    });
  }

  // Generate new OTP
  const otp = generateOTP();
  storeOTP(otpKey, otp, 5);
  
  console.log(`🔄 Resent OTP for payment ${paymentId}: ${otp}`);
  
  res.json({
    success: true,
    message: "OTP resent successfully",
    data: {
      otpLength: 6,
      expiresIn: 300,
      timestamp: new Date().toISOString(),
      paymentId
    },
  });
});

// Add endpoint to get OTP status (for debugging - remove in production)
if (process.env.NODE_ENV === 'development') {
  app.get("/api/v1/payments/otp/status/:paymentId", (req, res) => {
    const { paymentId } = req.params;
    const otpKey = `payment_${paymentId}`;
    const stored = otpStorage.get(otpKey);
    
    if (!stored) {
      return res.json({
        success: true,
        data: { status: 'no_otp_found' }
      });
    }

    const remainingTime = Math.max(0, Math.floor((stored.expiryTime - Date.now()) / 1000));
    
    res.json({
      success: true,
      data: {
        status: remainingTime > 0 ? 'active' : 'expired',
        remainingTime,
        attempts: stored.attempts,
        maxAttempts: stored.maxAttempts,
        expiresAt: new Date(stored.expiryTime).toISOString()
      }
    });
  });
}

// Plan endpoints
app.get("/api/v1/plans", (req, res) => {
  console.log("📋 Plans endpoint called");
  const plans = [
    {
      _id: "1",
      name: "Basic",
      currentPrice: 1999,
      description: "Perfect for small teams and startups",
      features: [
        "Up to 5 team members",
        "100GB cloud storage",
        "Basic analytics dashboard",
        "Email support (48h response)",
        "Basic API access (1000 calls/day)",
        "Single project management",
      ],
      popular: false,
      category: "starter",
      taxPercentage: 18,
    },
    {
      _id: "2",
      name: "Professional",
      currentPrice: 4999,
      description: "For growing businesses and SMEs",
      features: [
        "Up to 20 team members",
        "500GB cloud storage",
        "Advanced analytics & reports",
        "Priority support (24h response)",
        "Custom API integrations",
        "Advanced API (10,000 calls/day)",
        "Multiple project management",
        "Team collaboration tools",
      ],
      popular: true,
      category: "growth",
      taxPercentage: 18,
    },
    {
      _id: "3",
      name: "Enterprise",
      currentPrice: 14999,
      description: "For large organizations & enterprises",
      features: [
        "Unlimited team members",
        "2TB cloud storage",
        "Enterprise-grade analytics",
        "24/7 dedicated support",
        "Custom solutions & integrations",
        "White-label options",
        "SLA guarantee (99.9% uptime)",
        "Advanced security features",
        "Custom training sessions",
        "Personal account manager",
      ],
      popular: false,
      category: "enterprise",
      taxPercentage: 18,
    },
  ];

  res.json({
    success: true,
    data: { plans },
  });
});

// Coupon endpoints
app.post("/api/v1/coupons/validate", (req, res) => {
  console.log("🎫 Coupon validate called:", req.body);
  const { code } = req.body;
  const validCoupons = ["WELCOME20", "SAVE15", "INDIAN10", "STARTUP25"];

  if (validCoupons.includes(code)) {
    res.json({
      success: true,
      valid: true,
      coupon: {
        discountValue:
          code === "WELCOME20"
            ? 20
            : code === "SAVE15"
            ? 15
            : code === "INDIAN10"
            ? 10
            : 25,
        name: `${code} Discount`,
        code: code,
        minPurchase: 0,
        maxDiscount: 1000,
      },
    });
  } else {
    res.json({
      success: false,
      valid: false,
      error: "Invalid coupon code. Please try again.",
    });
  }
});

// Analytics endpoints
app.get("/api/v1/analytics/shares", (req, res) => {
  console.log("📊 Analytics shares called");
  res.json({
    success: true,
    data: {
      summary: {
        totalShares: 156,
        today: 12,
        thisWeek: 87,
        thisMonth: 156,
      },
      platformStats: [
        { platform: "whatsapp", totalShares: 65, percentage: 42 },
        { platform: "facebook", totalShares: 48, percentage: 31 },
        { platform: "twitter", totalShares: 28, percentage: 18 },
        { platform: "instagram", totalShares: 15, percentage: 9 },
      ],
      recentShares: [
        {
          platform: "whatsapp",
          planName: "Professional",
          timestamp: new Date().toISOString(),
          userId: "user_123",
        },
      ],
    },
  });
});

app.post("/api/v1/analytics/shares/track", (req, res) => {
  console.log("📈 Track share called:", req.body);
  res.json({
    success: true,
    message: "Share tracked successfully",
    data: {
      trackedAt: new Date().toISOString(),
      platform: req.body.platform || "unknown",
      planId: req.body.planId || "default",
    },
  });
});

// Automation endpoints
app.get("/api/v1/automation/status", (req, res) => {
  console.log("🤖 Automation status called");
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
        profitMargin: 30,
      },
      nextRun: new Date(Date.now() + 3600000).toISOString(),
    },
  });
});

app.post("/api/v1/automation/start", (req, res) => {
  console.log("🚀 Automation start called:", req.body);
  res.json({
    success: true,
    message: "Automation started successfully",
    data: {
      startedAt: new Date().toISOString(),
      automationId: `auto_${Date.now()}`,
      status: "running",
    },
  });
});

app.post("/api/v1/automation/stop", (req, res) => {
  console.log("🛑 Automation stop called:", req.body);
  res.json({
    success: true,
    message: "Automation stopped successfully",
    data: {
      stoppedAt: new Date().toISOString(),
      automationId: req.body.automationId || `auto_${Date.now()}`,
      status: "stopped",
    },
  });
});

// Pricing endpoints
app.get("/api/pricing/market-conditions", (req, res) => {
  console.log("📈 Market conditions called");
  res.json({
    success: true,
    data: {
      demand: "normal",
      season: "regular",
      competitorPrice: 5500,
      marketTrend: "stable",
      averageMarketPrice: 6000,
      demandLevel: 75,
      seasonMultiplier: 1.0,
    },
  });
});

app.get("/api/pricing/recommendations", (req, res) => {
  console.log("💡 Pricing recommendations called");
  res.json({
    success: true,
    data: {
      plans: [
        { id: 1, name: "Basic",
           recommendedPrice: 1999,
            currentPrice: 1999 },
        {
          id: 2,
          name: "Professional",
          recommendedPrice: 4999,
          currentPrice: 4999,
        },
        { id: 3, name: "Enterprise", recommendedPrice: 14999, currentPrice: 14999 },
      ],
      factors: {
        demandAdjustment: 0,
        seasonAdjustment: 0,
        competitorAdjustment: 0,
        totalAdjustment: 0,
      },
    },
  });
});

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
  res.json({
    message: "🚀 Server running successfully!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      data: "/api/data",
      sellers: "/api/sellers",
      products: "/api/products",
      payments: {
        initialize: "/api/v1/payments/initialize",
        otpGenerate: "/api/v1/payments/otp/generate",
        otpVerify: "/api/v1/payments/otp/verify",
        otpResend: "/api/v1/payments/otp/resend"
      },
      plans: "/api/v1/plans",
      coupons: "/api/v1/coupons",
      analytics: "/api/v1/analytics",
      pricing: "/api/pricing",
      automation: "/api/v1/automation",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy 🟢",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// -------------------------
// 404 HANDLER
// -------------------------
app.use((req, res) => {
  console.log("❗ Route not found:", req.originalUrl);
  res.status(404).json({
    message: "Route not found",
    requestedUrl: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      "/",
      "/health",
      "/api/health",
      "/api/auth/*",
      "/api/users/*",
      "/api/data/*",
      "/api/sellers/*",
      "/api/products/*",
      "/api/v1/plans",
      "/api/v1/payments/initialize",
      "/api/v1/payments/otp/generate",
      "/api/v1/payments/otp/verify",
      "/api/v1/payments/otp/resend",
      "/api/v1/coupons/validate",
      "/api/v1/analytics/*",
      "/api/pricing/*",
      "/api/v1/automation/*",
    ],
  });
});

// -------------------------
// GLOBAL ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
    timestamp: new Date().toISOString(),
  });
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n` + "=".repeat(60));
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`);
      console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
      console.log("=".repeat(60));
      console.log("\n📋 Available Endpoints:");
      console.log("  • GET  /                 - Server status");
      console.log("  • GET  /health           - Health check");
      console.log("  • GET  /api/health       - API health");
      console.log("  • GET  /api/v1/plans     - Get subscription plans");
      console.log("  • POST /api/v1/payments/initialize - Initialize payment");
      console.log("  • POST /api/v1/payments/otp/generate - Generate OTP");
      console.log("  • POST /api/v1/payments/otp/verify   - Verify OTP");
      console.log("  • POST /api/v1/payments/otp/resend   - Resend OTP");
      console.log("  • POST /api/v1/coupons/validate      - Validate coupon");
      console.log("  • GET  /api/pricing/recommendations - Get pricing recommendations");
      console.log("  • GET  /api/v1/automation/status     - Automation status");
      if (process.env.NODE_ENV === 'development') {
        console.log("  • GET  /api/v1/payments/otp/status/:paymentId - OTP status (dev only)");
      }
      console.log("\n🔵 Ready to accept requests...\n");
    });
  })

  
  .catch((error) => {
    console.error("❌ Failed to connect to database:", error);
    console.log("⚠️  Starting server without database connection...");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT} (without DB)`);
    });
  });

export default app;