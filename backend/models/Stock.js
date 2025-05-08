const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: Date
});

module.exports = mongoose.model("Goal", GoalSchema);
