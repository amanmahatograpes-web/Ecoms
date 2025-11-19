 import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { validateEmail, validatePassword, validateMobile } from "../utils/validators.js";

const otpStore = new Map(); // Temporary memory store

// ---------- SIGNUP ----------
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, mobile, username } = req.body;

    if (!fullName?.trim()) return res.status(400).json({ message: "Full name is required" });
    if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email" });
    if (!validatePassword(password)) return res.status(400).json({ message: "Password too short" });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });
    if (!validateMobile(mobile)) return res.status(400).json({ message: "Invalid mobile number" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username?.trim() || `user${Date.now()}`,
      fullName,
      email,
      password: hashed,
      mobile,
    });

    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- SEND OTP ----------
export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: "Mobile required" });

    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    console.log(`📱 OTP for ${mobile}: ${otp}`);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------- RESET PASSWORD ----------
export const resetPassword = async (req, res) => {
  try {
    const { mobile, otp, password } = req.body;
    const stored = otpStore.get(mobile);
    if (!stored) return res.status(400).json({ message: "No OTP found" });
    if (Date.now() > stored.expiresAt) return res.status(400).json({ message: "OTP expired" });
    if (stored.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    otpStore.delete(mobile);

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
