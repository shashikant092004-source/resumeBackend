const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("bufferCommands", false);

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing. Check backend/.env and dotenv config path.",
      );
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 100000,
    });

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
