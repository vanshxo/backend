const mongoose = require('mongoose');

const connectDb = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ DB Connection Failed:", err.message);
      process.exit(1);
    }
  };
  

  module.exports={connectDb}