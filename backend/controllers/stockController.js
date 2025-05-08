const axios = require("axios");

// Fetch all stocks from Flask API
exports.getStocks = async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/stocks");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stocks" });
    }
};

// Fetch a single stock by symbol from Flask API
exports.getStockBySymbol = async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/stocks/${req.params.symbol}`);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: "Stock not found" });
    }
};