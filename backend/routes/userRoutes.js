// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const User = require("../models/User"); // Assuming you have a User model
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/signup", upload.single("profilePic"), async (req, res) => {
  const { firstName, lastName, email, contact, dob, profession, password } = req.body;
  const profilePic = req.file ? req.file.path : null;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    await newUser.save();
    res.status(201).json({ message: "User successfully registered!" });
  } catch (err) {
    console.error("Error in user sign-up:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

router.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No Bearer token provided" });
    }
    const token = authHeader.split(" ")[1];
    console.log("Received token:", token); // Debug: Log the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify with secret
    console.log("Decoded payload:", decoded); // Debug: Log the decoded object

    const user = await User.findById(decoded.userId).select("firstName");
    if (!user) {
      console.log("User not found for userId:", decoded.userId); // Debug: Log missing user
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ firstName: user.firstName });
  } catch (error) {
    console.error("JWT Verification Error:", error.message, error.stack); // Detailed error
    res.status(401).json({ error: "Unauthorized" });
  }
});

module.exports = router;