// In routes/account.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const AccountController = require("../controllers/accountController");

// Set up multer for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage });

// Create account
router.post("/signup", upload.single("profilePic"), AccountController.createAccount);

module.exports = router;
