const { Student, School, OtpToken } = require('../models/userModel');
const { sendEmail } = require('../otp-utils/email');
const generateOTP = require('../otp-utils/generateotp');
const {sendWelcomeEmail}=require('../otp-utils/welcome')
const sendOtp = async (req, res) => {
  const { email, type } = req.body;
  if (!email || !type) {
    return res.status(400).json({ message: 'Email and type (student/school) are required' });
  }

  const isStudent = type === 'student';
  const existingUser = isStudent
    ? await Student.findOne({ email })
    : await School.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered. Please login.' });
  }

  const otp = generateOTP();

  try {
    await OtpToken.findOneAndDelete({ email }); // clear previous if exists
    const otpDoc = new OtpToken({
      otp,
      email:email,
      userModel:type,
      attempt: 0,
      createdAt: Date.now(),
    });
    await otpDoc.save();
    await sendEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const record = await OtpToken.findOne({ email });

  if (!record || record.otp != otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  await record.deleteOne();
  res.status(200).json({ message: 'OTP verified successfully' });
};

const registerStudent = async (req, res) => {
  const {
    name,
    passwordHash,
    country,
    mobile,
    class: studentClass,
    parentName,
    schoolName,
    schoolCity,
    schoolState,
  } = req.body.form;
  const email  = req.body.email;

  try {
    const student = new Student({
      name,
      email,
      passwordHash,
      country,
      mobile,
      class: studentClass,
      parentName,
      schoolName,
      schoolCity,
      schoolState,
    });
    const saved = await student.save();
    await sendWelcomeEmail(email,name)
    res.status(200).json({ message: 'Student registered', studentId: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Student registration failed' });
  }
};

const registerSchool = async (req, res) => {
  const { name, email, passwordHash, contactPerson, contactNumber } = req.body;

  try {
    const school = new School({
      name,
      email,
      passwordHash,
      contactPerson,
      contactNumber,
    });
    const saved = await school.save();
    res.status(201).json({ message: 'School registered', schoolId: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'School registration failed' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  registerStudent,
  registerSchool,
};
