// models/User.js

const mongoose = require("mongoose");

// Define schema for User
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // Make sure it's required
    },
    lastName: {
      type: String,
      required: true, // Make sure it's required
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email should be unique in the collection
    },
    contact: {
      type: String,
      required: true, // Make sure it's required
    },
    dob: {
      type: Date,
    },
    profession: {
      type: String,
    },
    password: {
      type: String,
      required: true, // Make sure it's required
    },
    profilePic: {
      type: String, // You will store the path to the image if provided
    },
  },
  { timestamps: true }
);

// Create a model based on the schema
const User = mongoose.model("User", UserSchema);

module.exports = User;
