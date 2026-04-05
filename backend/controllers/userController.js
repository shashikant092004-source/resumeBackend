const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isDatabaseConnected = () => mongoose.connection.readyState === 1;
const getDebugMeta = () => ({
  dbReadyState: mongoose.connection.readyState,
  dbName: mongoose.connection.name || null,
  modelCollection: User.collection.name,
  controllerVersion: "2026-04-05-user-controller-v2",
});

// Create User
exports.createUser = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message:
          "Database is not connected. Check MongoDB connection before calling this endpoint.",
        debug: getDebugMeta(),
      });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered ❌",
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User created successfully",
      data: user,
      debug: getDebugMeta(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message, debug: getDebugMeta() });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message:
          "Database is not connected. Check MongoDB connection before calling this endpoint.",
        debug: getDebugMeta(),
      });
    }

    const users = await User.find();
    res.json({ data: users, debug: getDebugMeta() });
  } catch (error) {
    res.status(500).json({ message: error.message, debug: getDebugMeta() });
  }
};

exports.loginUser = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ❌ Plain password check (simple)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Response
    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
