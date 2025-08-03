const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");

router.post("/", auth, createTransaction);
router.get("/", auth, getTransactions);
router.delete("/:id", auth, deleteTransaction);
router.put("/:id", auth, updateTransaction); // Update route

module.exports = router;