const router = require("express").Router();
const auth = require("../middleware/auth");
const { addPrediction, getPredictions } = require("../controllers/PredictionController");

router.post("/", auth, addPrediction);
router.get("/", auth, getPredictions);

module.exports = router;