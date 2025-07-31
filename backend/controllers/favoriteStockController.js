const FavoriteStock = require("../models/FavoriteStock");

exports.addFavorite = async (req, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.user._id;
    const existing = await FavoriteStock.findOne({ userId, symbol });
    if (existing) return res.status(400).json({ error: "Stock already favorited" });

    const favorite = new FavoriteStock({ userId, symbol });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.user._id;
    const result = await FavoriteStock.findOneAndDelete({ userId, symbol });
    if (!result) return res.status(404).json({ error: "Favorite not found" });
    res.json({ message: "Favorite removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await FavoriteStock.find({ userId: req.user._id });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};