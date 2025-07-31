const Budget = require("../models/Budget");

exports.setBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    const budget = new Budget({
      userId: req.user._id,
      category,
      limit: parseFloat(limit),
      month,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};