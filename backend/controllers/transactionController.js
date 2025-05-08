const Transaction = require("../models/Transaction");

// Create new transaction
exports.createTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      userId: req.user
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
