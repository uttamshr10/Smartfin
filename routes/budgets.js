const router = require("express").Router();
const auth = require("../middleware/auth");
const { setBudget, getBudgets } = require("../controllers/budgetController");

router.post("/", auth, setBudget);
router.get("/", auth, getBudgets);

module.exports = router;
