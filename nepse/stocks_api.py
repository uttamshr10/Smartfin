from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/stocks/*": {"origins": "http://localhost:3000"}})
client = MongoClient(os.getenv("MONGO_URI"))
db = client["Smartfin_db"]
stock_collection = db["stocks"]
history_collection = db["stock_history"]  # Add reference to stock_history

@app.route("/stocks", methods=["GET"])
def get_stocks():
    stocks = list(stock_collection.find({}, {"_id": 0}))
    return jsonify(stocks)

@app.route("/stocks/<symbol>", methods=["GET"])
def get_stock(symbol):
    stock = stock_collection.find_one(
        {"symbol": symbol.upper()},
        {"_id": 0},
        sort=[("fetched_at", -1)]
    )
    if stock:
        return jsonify(stock)
    return jsonify({"error": "Stock not found"}), 404

@app.route("/stocks/history/<symbol>", methods=["GET"])
def get_stock_history(symbol):
    history = list(history_collection.find(
        {"symbol": symbol.upper()},
        {"_id": 0},
        sort=[("historical_date", -1)]
    ))
    if history:
        return jsonify(history)
    return jsonify({"error": "No historical data found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)