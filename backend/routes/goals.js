const router = require("express").Router();
const auth = require("../middleware/auth");
const { setGoal, getGoals, updateGoalProgress, updateGoal, deleteGoal } = require("../controllers/goalController");

router.post("/", auth, setGoal);
router.get("/", auth, getGoals);
router.post("/progress", auth, updateGoalProgress);
router.put("/:id", auth, updateGoal); // Update route
router.delete("/:id", auth, deleteGoal); // Delete route

module.exports = router;