from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["Smartfin_db"]
stock_collection = db["stocks"]

# Delete all documents in the stocks collection
result = stock_collection.delete_many({})
print(f"Deleted {result.deleted_count} documents from stocks collection")

# Close the connection
client.close()