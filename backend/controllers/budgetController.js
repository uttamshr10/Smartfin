const Budget = require("../models/Budget");
const Goal = require("../models/Goal");

exports.setBudget = async (req, res) => {
  try {
    const { category, limit, month, goalId, targetSavings, deadline, allocatedSavings } = req.body;
    const budget = new Budget({
      userId: req.user._id,
      category,
      limit,
      month,
      goalId,
      targetSavings,
      deadline,
      allocatedSavings,
    });
    await budget.save();

    // Update goal if allocatedSavings is provided
    if (goalId && allocatedSavings) {
      await Goal.findOneAndUpdate(
        { _id: goalId, userId: req.user._id },
        { $inc: { currentAmount: allocatedSavings } },
        { new: true }
      );
    }

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).populate("goalId");
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};