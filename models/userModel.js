const mongoose = require('mongoose');

// ----------------------------------------
// Student Schema
// ----------------------------------------
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false },
    country: { type: String, required: true },
    mobile: { type: String, required: true },
    class: { type: Number, required: true },
    track: { type: String }, // Can be optional/auto-assigned
    parentName: { type: String, required: true },
    schoolName: { type: String, required: true },
    schoolCity: { type: String, required: true },
    schoolState: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

// ----------------------------------------
// School Schema
// ----------------------------------------
const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // passwordHash: { type: String, required: true },
    contactPerson: { type: String, required: true },
    contactNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

// ----------------------------------------
// OTP Token Schema
// ----------------------------------------
const otpTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    userModel: {
      type: String,
      required: true,
      enum: ['student', 'school']
    },
    email:{
      type:String,
      required:true
    },
    otp: {
      type: String,
      required: true
    },
    attempt: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600 // 10 minutes in seconds
    }
  },
  {
    timestamps: true
  }
);

// ----------------------------------------
// Cookie Token Schema (Login Sessions)
// ----------------------------------------
const cookieTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    userModel: {
      type: String,
      required: true,
      enum: ['student', 'school']
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 5184000 // Expires in 60 days
    }
  },
  {
    timestamps: true
  }
);

// ----------------------------------------
// Model Exports
// ----------------------------------------
const Student = mongoose.model('Student', studentSchema);
const School = mongoose.model('School', schoolSchema);
const OtpToken = mongoose.model('OtpToken', otpTokenSchema);
const CookieToken = mongoose.model('CookieToken', cookieTokenSchema);

module.exports = {
  Student,
  School,
  OtpToken,
  CookieToken
};
