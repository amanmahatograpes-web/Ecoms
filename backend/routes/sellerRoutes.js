import express from "express";
import bcrypt from "bcryptjs";
import Seller from "../models/seller.js";

const router = express.Router();

// ✅ Seller Registration
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, address, contact, password, confirmPassword } = req.body;

    // Validation
    if (!fullName || !email || !address || !contact || !password || !confirmPassword)
      return res.status(400).json({ success: false, message: "All fields are required" });

    if (!/^\d{10}$/.test(contact))
      return res.status(400).json({ success: false, message: "Invalid contact number" });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: "Passwords do not match" });

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new Seller({
      fullName,
      email,
      address,
      contact,
      password: hashedPassword,
    });

    await newSeller.save();

    res.status(201).json({ success: true, message: "Seller registered successfully!" });
  } catch (err) {
    console.error("❌ Seller Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
