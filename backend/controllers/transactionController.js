const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");

exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, note } = req.body;
    const transaction = new Transaction({
      userId: req.user._id,
      type,
      category,
      amount,
      date,
      note,
    });
    await transaction.save();

    // Check and update budget
    const month = new Date(date).toISOString().slice(0, 7); // e.g., "2025-07"
    const budget = await Budget.findOne({ userId: req.user._id, category, month });
    if (budget && type === "expense") {
      const totalSpent = await Transaction.aggregate([
        { $match: { userId: req.user._id, category, date: { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const spent = totalSpent[0]?.total || 0;
      if (spent > budget.limit) {
        console.log(`Budget exceeded for ${category} in ${month}`);
        // Optionally send a notification or update budget status
      }
    }

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};