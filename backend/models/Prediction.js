const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true }, // Link to favorited stock symbol
  stockUpdate: { type: String }, // Latest update or news
  predictedPrice: { type: Number }, // Predicted future price
  recommendation: { type: String, enum: ["Buy", "Hold", "Sell", "Avoid"] }, // Buy or Hold decision
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prediction", PredictionSchema);