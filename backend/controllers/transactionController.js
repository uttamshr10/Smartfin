const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");

exports.createTransaction = async (req, res) => {
  try {
    console.log("Create transaction request received, raw body:", req.body);
    const { type, category, amount, date, note, userId } = req.body;

    let effectiveUserId;
    try {
      effectiveUserId = new mongoose.Types.ObjectId(userId);
      new mongoose.Types.ObjectId(effectiveUserId); // Validate
    } catch (idError) {
      throw new Error(`Invalid userId format: ${userId} - ${idError.message}`);
    }

    const transaction = new Transaction({
      userId: effectiveUserId,
      type,
      category,
      amount: parseFloat(amount) || 0,
      date: date ? new Date(date) : new Date(),
      note: note || "",
    });
    console.log("Transaction object before save:", transaction.toObject());
    await transaction.save();
    console.log("Transaction saved successfully:", transaction._id);

    const month = new Date(date || Date.now()).toISOString().slice(0, 7);
    const budget = await Budget.findOne({ userId: effectiveUserId, category, month });
    if (budget && type === "expense") {
      const totalSpent = await Transaction.aggregate([
        { $match: { userId: effectiveUserId, category, date: { $gte: new Date(`${month}-01`), $lte: new Date(`${month}-31`) } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const spent = totalSpent[0]?.total || 0;
      if (spent > budget.limit) {
        console.log(`Budget exceeded for ${category} in ${month}`);
      }
    }

    res.status(201).json(transaction);
  } catch (err) {
    console.error("Create transaction error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      name: err.name,
      body: req.body,
      user: req.user,
    });
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};