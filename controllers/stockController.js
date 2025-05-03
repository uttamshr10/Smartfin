const Stock = require("../models/Stock");

exports.getStocks = async (req, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
};

exports.addStock = async (req, res) => {
  const stock = new Stock(req.body);
  await stock.save();
  res.status(201).json(stock);
};
