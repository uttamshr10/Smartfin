# C:\Users\Uttam\Desktop\smartfin\nepse\stocks_api.py
from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/stocks/*": {"origins": "http://localhost:3000"}})  # Allow Node.js origin
client = MongoClient(os.getenv("MONGO_URI"))
db = client["Smartfin_db"]
stock_collection = db["stocks"]

@app.route("/stocks", methods=["GET"])
def get_stocks():
    stocks = list(stock_collection.find({}, {"_id": 0}))
    return jsonify(stocks)

@app.route("/stocks/<symbol>", methods=["GET"])
def get_stock(symbol):
    stock = stock_collection.find_one({"symbol": symbol.upper()}, {"_id": 0})
    if stock:
        return jsonify(stock)
    return jsonify({"error": "Stock not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)