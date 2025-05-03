const Prediction = require("../models/Prediction");

exports.addPrediction = async (req, res) => {
  try {
    const prediction = new Prediction({
      ...req.body,
      userId: req.user
    });
    await prediction.save();
    res.status(201).json(prediction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
