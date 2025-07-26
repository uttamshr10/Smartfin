const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: String, required: true }, // e.g., "2025-04"
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" }, // Link to Goals
  targetSavings: { type: Number }, // Total savings target
  deadline: { type: Date }, // Budget/goal deadline
  allocatedSavings: { type: Number }, // Monthly allocation to goal
});

module.exports = mongoose.model("Budget", BudgetSchema);