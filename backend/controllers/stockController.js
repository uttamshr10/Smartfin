const axios = require("axios");

// Fetch all stocks from Flask API
exports.getStocks = async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/stocks");
        console.log("Flask API response (all stocks):", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching stocks from Flask:", error.message, error.response?.data);
        res.status(500).json({ error: "Failed to fetch stocks" });
    }
};

// Fetch a single stock by symbol from Flask API
exports.getStockBySymbol = async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/stocks/${req.params.symbol}`);
        console.log(`Flask API response for ${req.params.symbol}:`, response.data);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching stock ${req.params.symbol} from Flask:`, error.message, error.response?.data);
        res.status(404).json({ error: "Stock not found" });
    }
};