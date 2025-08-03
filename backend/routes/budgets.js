const router = require("express").Router();
const auth = require("../middleware/auth");
const { setBudget, getBudgets, updateBudget, deleteBudget } = require("../controllers/budgetController");

router.post("/", auth, setBudget);
router.get("/", auth, getBudgets);
router.put("/:id", auth, updateBudget); // Update route
router.delete("/:id", auth, deleteBudget); // Delete route

module.exports = router;