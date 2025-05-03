const Account = require("../models/Account");

exports.createAccount = async (req, res) => {
  try {
    const account = new Account({ ...req.body, userId: req.user });
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAccounts = async (req, res) => {
  const accounts = await Account.find({ userId: req.user });
  res.json(accounts);
};
