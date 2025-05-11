const router = require("express").Router();
const axios = require("axios");
const { getStocks, getStockBySymbol } = require("../controllers/stockController");

// Fetch all stocks
router.get("/", getStocks);

// Fetch a single stock by symbol
router.get("/:symbol", getStockBySymbol);
router.get("/history/:symbol", async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/stocks/history/${req.params.symbol}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch historical stock data" });
    }
});

module.exports = router;