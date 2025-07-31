const router = require("express").Router();
const auth = require("../middleware/auth");
const { addFavorite, removeFavorite, getFavorites } = require("../controllers/favoriteStockController");

router.post("/stocks/:symbol", auth, addFavorite);
router.delete("/stocks/:symbol", auth, removeFavorite);
router.get("/", auth, getFavorites);

module.exports = router;