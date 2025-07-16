const jwt = require('jsonwebtoken');
const { Student, School, OtpToken,CookieToken } = require('../models/userModel'); // Your schemas


// POST /api/auth/login/verify-otp
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    if (!email || !otp || !type) {
      return res.status(400).json({ message: 'Email, type, and OTP are required.' });
    }

    // 1. Fetch user by type
    const userModel = type === 'student' ? Student : School;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Account not found.' });
    }

    // 2. Find matching OTP from database
    const otpRecord = await OtpToken.findOne({
      user: user._id,
      userModel: type === 'student' ? 'student' : 'school',
      otp,
      email:email
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // 3. OTP is valid — delete it
    await otpRecord.deleteOne();

    // 4. Sign JWT token
    const payload = {
      id: user._id,
      email: user.email,
      type,
    };

    const token = jwt.sign(payload, process.env.SECRET_STRING, { expiresIn: '60d' });

    // 5. Save token in CookieToken collection
    await CookieToken.create({
      user: user._id,
      userModel: type === 'student' ? 'student' : 'school',
      token,
    });

    // 6. Set cookie (for browser clients)
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5184000 * 1000, // 60 days in milliseconds
    });

    // 7. Send response back to client
    return res.status(200).json({
      message: 'OTP verified. Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        type,
        name: user?.name || user?.contactPerson, // based on Student vs School
      },
    });
  } catch (error) {
    console.error('Error verifying login OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { verifyLoginOtp };
