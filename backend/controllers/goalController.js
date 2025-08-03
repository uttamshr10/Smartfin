const Goal = require("../models/Goal");
const mongoose = require("mongoose");

exports.setGoal = async (req, res) => {
  try {
    console.log("Set goal request received, req.user:", req.user, "req.body:", req.body);
    const { name, targetAmount, deadline, description } = req.body;

    if (!name || !targetAmount || !deadline) {
      throw new Error("Missing required fields: name, targetAmount, and deadline are required");
    }

    if (!req.user || !req.user._id) {
      throw new Error("Authentication failed: userId not available");
    }

    const goal = new Goal({
      userId: req.user._id,
      name,
      targetAmount: parseFloat(targetAmount),
      deadline: new Date(deadline),
      description,
    });
    console.log("Goal object before save:", goal.toObject());
    await goal.save();

    res.status(201).json(goal);
  } catch (err) {
    console.error("Set goal error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name,
      body: req.body,
      user: req.user,
    });
    const status = err.name === "ValidationError" || err.name === "CastError" ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    console.log("Get goals request received, req.user:", req.user);
    const goals = await Goal.find({ userId: req.user._id });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGoalProgress = async (req, res) => {
  try {
    console.log("Update goal progress request received, req.user:", req.user);
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

exports.updateGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline, description } = req.body;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, targetAmount: parseFloat(targetAmount), deadline: new Date(deadline), description },
      { new: true, runValidators: true }
    );
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json({ message: "Goal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};