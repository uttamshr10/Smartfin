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

exports.updateBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { category, limit: parseFloat(limit), month },
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ error: "Budget not found" });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!budget) return res.status(404).json({ error: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};