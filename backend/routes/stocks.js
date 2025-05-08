const router = require("express").Router();
const { getStocks, getStockBySymbol } = require("../controllers/stockController");

// Fetch all stocks
router.get("/", getStocks);

// Fetch a single stock by symbol
router.get("/:symbol", getStockBySymbol);

module.exports = router;