import express from "express";
import { signup, login, sendOtp, resetPassword } from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password/send-otp", sendOtp);
router.post("/forgot-password/reset", resetPassword);

export default router;