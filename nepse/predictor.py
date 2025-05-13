from pymongo import MongoClient
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, accuracy_score
import pandas as pd
import os
from dotenv import load_dotenv
import joblib

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["Smartfin_db"]
history_collection = db["stock_history"]

# Fetch data
data = list(history_collection.find({}, {"_id": 0}))
df = pd.DataFrame(data)

# Prepare features for both models
features = df[['open_price', 'high_price', 'low_price', 'volume', 'turnover', 'close_price']]

# --- Prediction Model (RandomForestRegressor) ---
df['next_close'] = df['close_price'].shift(-1)
target_price = df['next_close'][:-1]  # Remove last row (no target)
features_price = features[:-1]

# Handle missing values
features_price = features_price.fillna(features_price.mean())
target_price = target_price.fillna(target_price.mean())

# Split data for prediction
X_train_price, X_test_price, y_train_price, y_test_price = train_test_split(features_price, target_price, test_size=0.2, random_state=42)

# Train Random Forest Regressor
rf_regressor = RandomForestRegressor(n_estimators=100, random_state=42)
rf_regressor.fit(X_train_price, y_train_price)

# Evaluate prediction
y_pred_price = rf_regressor.predict(X_test_price)
mse = mean_squared_error(y_test_price, y_pred_price)
print(f"Prediction Mean Squared Error: {mse}")

# Save prediction model
joblib.dump(rf_regressor, "random_forest_regressor.pkl")

# --- Classification Model (RandomForestClassifier) ---
df['price_change'] = (df['next_close'] - df['close_price']) / df['close_price'] * 100
df['label'] = df['price_change'].apply(lambda x: 
    'Buy' if x > 2 else 
    'Hold' if -2 <= x <= 2 else 
    'Sell' if -5 <= x < -2 else 
    'Avoid')
target_label = df['label'][:-1]
features_label = features[:-1]

# Handle missing values
features_label = features_label.fillna(features_label.mean())
target_label = target_label.fillna('Hold')

# Split data for classification
X_train_label, X_test_label, y_train_label, y_test_label = train_test_split(features_label, target_label, test_size=0.2, random_state=42)

# Train Random Forest Classifier
rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
rf_classifier.fit(X_train_label, y_train_label)

# Evaluate classification
y_pred_label = rf_classifier.predict(X_test_label)
accuracy = accuracy_score(y_test_label, y_pred_label)
print(f"Classification Accuracy: {accuracy}")

# Save classification model
joblib.dump(rf_classifier, "random_forest_classifier.pkl")