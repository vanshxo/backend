const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  registerStudent,
  registerSchool,
} = require('../controllers/authController');

const { sendLoginOtp }=require('../controllers/login')
const { verifyLoginOtp }=require('../controllers/verify-otp')

// Send OTP (email-based)
router.post('/send-otp', sendOtp); // requires: { email, type: "student" | "school" }

// Verify OTP
router.post('/verify-otp', verifyOtp); // requires: { email, otp }

// Register student after OTP
router.post('/student/register', registerStudent);

// Register school after OTP
router.post('/school/register', registerSchool);

router.post('/login',sendLoginOtp);

router.post('/verify-login-otp',verifyLoginOtp);

module.exports = router;
