// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Assuming you have a User model for MongoDB

// Set up multer for file uploads (if profile picture is required)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST request for sign-up
router.post("/signup", upload.single("profilePic"), async (req, res) => {
  const { firstName, lastName, email, contact, dob, profession, password } = req.body;
  const profilePic = req.file ? req.file.path : null;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      contact,
      dob,
      profession,
      password: hashedPassword,
      profilePic,
    });

    // Save to the database
    await newUser.save();
    res.status(201).json({ message: "User successfully registered!" });
  } catch (err) {
    console.error("Error in user sign-up:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

module.exports = router;
