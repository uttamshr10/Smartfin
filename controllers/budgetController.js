const Budget = require("../models/Budget");

exports.setBudget = async (req, res) => {
  const { category, limit, month } = req.body;
  const budget = new Budget({ userId: req.user, category, limit, month });
  await budget.save();
  res.status(201).json(budget);
};

exports.getBudgets = async (req, res) => {
  const budgets = await Budget.find({ userId: req.user });
  res.json(budgets);
};
