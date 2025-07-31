const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  console.log("Auth middleware - Authorization header:", authHeader); // Debug full header
  const token = authHeader?.split(" ")[1];
  console.log("Auth middleware - Token received:", token); // Debug log
  if (!token) return res.status(401).json({ error: "No token found" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware - Verified payload:", verified); // Debug full payload

    // Validate userId before creating ObjectId
    if (!verified.userId || typeof verified.userId !== "string" || verified.userId.length !== 24) {
      throw new Error("Invalid userId in token");
    }

    req.user = { _id: new mongoose.Types.ObjectId(verified.userId) }; // Ensure ObjectId
    console.log("Auth middleware - Set req.user:", req.user); // Debug log
    next();
  } catch (err) {
    console.log("Auth middleware - Verification error:", err.message, err.stack); // Debug stack trace
    res.status(401).json({ error: err.message === "jwt expired" ? "Token expired" : "Invalid token" });
  }
};