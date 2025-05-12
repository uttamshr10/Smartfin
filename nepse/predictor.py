from pymongo import MongoClient
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["Smartfin_db"]
history_collection = db["stock_history"]

# Fetch data
data = list(history_collection.find({}, {"_id": 0}))
df = pd.DataFrame(data)

# Prepare features and target
features = df[['open_price', 'high_price', 'low_price', 'volume', 'turnover']]
target = df['close_price'].shift(-1)  # Predict next day's close price
features = features[:-1]  # Remove last row (no target)
target = target[:-1]

# Handle missing values
features = features.fillna(features.mean())
target = target.fillna(target.mean())

# Split data
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# Train Random Forest
rf = RandomForestRegressor(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# Predict and evaluate
y_pred = rf.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse}")

# Save model (optional)
import joblib
joblib.dump(rf, "random_forest_model.pkl")