from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from dotenv import load_dotenv
import os
import joblib

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/stocks/*": {"origins": "http://localhost:3000"}})
client = MongoClient(os.getenv("MONGO_URI"))
db = client["Smartfin_db"]
stock_collection = db["stocks"]
history_collection = db["stock_history"]

# Load models
regressor_model = joblib.load("random_forest_regressor.pkl")
classifier_model = joblib.load("random_forest_classifier.pkl")

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

@app.route("/stocks/predict/<symbol>", methods=["GET"])
def predict_stock(symbol):
    stock = stock_collection.find_one({"symbol": symbol.upper()}, {"_id": 0}, sort=[("fetched_at", -1)])
    if stock:
        features = [[stock['open_price'], stock['high_price'], stock['low_price'], stock['volume'], stock['turnover'], stock['close_price']]]
        prediction = regressor_model.predict(features)[0]
        return jsonify({"symbol": symbol, "predicted_close_price": prediction})
    return jsonify({"error": "Stock not found"}), 404

@app.route("/stocks/classify/<symbol>", methods=["GET"])
def classify_stock(symbol):
    stock = stock_collection.find_one({"symbol": symbol.upper()}, {"_id": 0}, sort=[("fetched_at", -1)])
    if stock:
        features = [[stock['open_price'], stock['high_price'], stock['low_price'], stock['volume'], stock['turnover'], stock['close_price']]]
        status = classifier_model.predict(features)[0]
        return jsonify({"symbol": symbol, "status": status})
    return jsonify({"error": "Stock not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)