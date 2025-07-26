const Goal = require("../models/Goal");
const Budget = require("../models/Budget");

exports.setGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline, description, budgetId } = req.body;
    const goal = new Goal({
      userId: req.user._id,
      name,
      targetAmount,
      deadline,
      description,
      budgetId,
    });
    await goal.save();

    // Suggest initial allocatedSavings from budget if linked
    if (budgetId) {
      const budget = await Budget.findById(budgetId);
      if (budget && !budget.allocatedSavings) {
        const suggestedSavings = Math.min(budget.limit / 4, (targetAmount - 0) / 12); // Example: 1/4 of limit or monthly toward goal
        budget.allocatedSavings = suggestedSavings;
        await budget.save();
      }
    }

    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).populate("budgetId");
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGoalProgress = async (req, res) => {
  try {
    const { goalId, amount } = req.body;
    const goal = await Goal.findOneAndUpdate(
      { _id: goalId, userId: req.user._id },
      { $inc: { currentAmount: amount } },
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};