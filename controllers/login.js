// models/userModels.js should export Student and School models
const { Student, School, OtpToken } = require('../models/userModel');
const { sendEmail } = require('../otp-utils/email'); // Your Evolvx-branded mailer
const generateOTP = require('../otp-utils/generateotp');  // Utility for random OTP codes

// POST /api/auth/login/send-otp
const sendLoginOtp = async (req, res) => {
  const { email, type } = req.body; // type: "student" or "school"
  if (!email || !type) {
    return res.status(400).json({ message: 'Email and type are required' });
  }

  // Check user existence in relevant collection
  const user = type === 'student'
    ? await Student.findOne({ email })
    : await School.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Account not found with this email.' });
  }

  // Generate OTP and save token (overwrite old)
  const otp = generateOTP();
  await OtpToken.findOneAndDelete({ user: user._id });

  await OtpToken.create({
    user: user._id,
    email:email,
    userModel: type === 'student' ? 'student' : 'school',
    otp,
  });

  await sendEmail(email, otp);

  res.status(200).json({ message: 'OTP sent to your email address.' });
};

module.exports = { sendLoginOtp };
