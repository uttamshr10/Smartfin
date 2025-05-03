const router = require("express").Router();
const auth = require("../middleware/auth");
const { createGoal, getGoals } = require("../controllers/goalController");

router.post("/", auth, createGoal);
router.get("/", auth, getGoals);

module.exports = router;
