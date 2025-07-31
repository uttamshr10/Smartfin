const router = require("express").Router();
const axios = require("axios");
const { getStocks, getStockBySymbol } = require("../controllers/stockController");

// Fetch all stocks
router.get("/", getStocks);

// Fetch a single stock by symbol
router.get("/:symbol", getStockBySymbol);

// Fetch historical stock data by symbol
router.get("/history/:symbol", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/stocks/history/${req.params.symbol}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching history from Flask:", error.message, error.response?.data);
    res.status(500).json({ error: "Failed to fetch historical stock data" });
  }
});

// Fetch stock classification (proxy to Flask)
router.get("/classify/:symbol", async (req, res) => {
  try {
    console.log("Processing classify request for:", req.params.symbol); // Debug log
    const response = await axios.get(`http://localhost:5000/stocks/classify/${req.params.symbol}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching classification from Flask:", error.message, error.response?.data);
    res.status(500).json({ error: "Failed to fetch classification" });
  }
});

module.exports = router;