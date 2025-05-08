const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  predictionType: {
    type: String,
    enum: ["expense", "savings", "stock"],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Can store any JSON object
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prediction", PredictionSchema);
