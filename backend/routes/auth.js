// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
  try {
    console.log("Raw req.body:", JSON.stringify(req.body, null, 2)); // Log full body
    const { firstName, lastName, email, contact, password } = req.body;
    console.log("Destructured:", { firstName, lastName, email, contact, password }); // Log destructured values

    // Validate required fields
    if (!firstName || !lastName || !email || !contact || !password) {
      return res.status(400).json({ error: "All fields (firstName, lastName, email, contact, password) are required." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      contact,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({ message: "User created!", userId: user._id });
  } catch (err) {
    console.log("Signup error details:", err); // Log full error
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;