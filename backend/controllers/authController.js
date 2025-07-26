const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // Add this line

exports.signup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { firstName, lastName, email, contact, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");
    const user = new User({
      firstName,
      lastName,
      email,
      contact,
      password: hashedPassword,
    });
    console.log("Saving new user:", user);
    await user.save({ w: "majority", j: true });
    console.log("User saved successfully:", user._id);
    res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    console.error("Signup error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name,
      connectionState: mongoose.connection.readyState,
    });
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;
    console.log("Finding user with email:", email);
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Login successful, token generated");
    res.status(200).json({ message: "Login successful", token, userId: user._id });
  } catch (err) {
    console.error("Login error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name,
      connectionState: mongoose.connection.readyState,
    });
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log("Update profile request received:", req.body);
    const { dob, profession } = req.body;
    const profilePic = req.file ? req.file.path : null;
    const userId = req.user._id;

    const updateData = { updated_at: Date.now() };
    if (dob) updateData.dob = new Date(dob);
    if (profession) updateData.profession = profession;
    if (profilePic) updateData.profilePic = profilePic;

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    console.log("Profile updated successfully:", updatedUser);
    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Profile update error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name,
      connectionState: mongoose.connection.readyState,
    });
    res.status(500).json({ error: err.message });
  }
};