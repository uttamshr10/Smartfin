const Goal = require("../models/Goal");

exports.createGoal = async (req, res) => {
  const goal = new Goal({ ...req.body, userId: req.user });
  await goal.save();
  res.status(201).json(goal);
};

exports.getGoals = async (req, res) => {
  const goals = await Goal.find({ userId: req.user });
  res.json(goals);
};
