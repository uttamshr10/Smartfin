const express = require("express");
const router = express.Router();
const multer = require("multer");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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
    console.log("Received token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded payload:", decoded);

    const user = await User.findById(decoded.userId).select("firstName profilePic");
    if (!user) {
      console.log("User not found for userId:", decoded.userId);
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ firstName: user.firstName, profilePic: user.profilePic });
  } catch (error) {
    console.error("JWT Verification Error:", error.message, error.stack);
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.put("/user", upload.single("profilePic"), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No Bearer token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.file) {
      user.profilePic = req.file.path;
    }

    if (req.body.password) {
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user: { profilePic: user.profilePic } });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;