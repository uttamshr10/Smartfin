const router = require("express").Router();
const auth = require("../middleware/auth");
const { setGoal, getGoals, updateGoalProgress } = require("../controllers/goalController");

router.post("/", auth, setGoal);
router.get("/", auth, getGoals);
router.post("/progress", auth, updateGoalProgress);

module.exports = router;