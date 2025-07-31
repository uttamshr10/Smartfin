const Prediction = require("../models/Prediction");
const FavoriteStock = require("../models/FavoriteStock");

exports.addPrediction = async (req, res) => {
  try {
    const { symbol, stockUpdate, predictedPrice, recommendation } = req.body;
    const userId = req.user._id;

    // Check if the stock is favorited
    const favorite = await FavoriteStock.findOne({ userId, symbol });
    if (!favorite) return res.status(400).json({ error: "Stock must be favorited to predict" });

    const prediction = new Prediction({
      userId,
      symbol,
      stockUpdate,
      predictedPrice,
      recommendation,
    });
    await prediction.save();
    res.status(201).json(prediction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};