const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  balance: { type: Number, default: 0 },
  type: { type: String, enum: ["cash", "bank", "digital"], required: true }
});

module.exports = mongoose.model("Account", AccountSchema);
