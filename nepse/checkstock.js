const { MongoClient } = require("mongodb");
require("dotenv").config();

async function checkStocks() {
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("Smartfin_db");
        const stockCollection = db.collection("stocks");

        const stocks = await stockCollection.find().limit(5).toArray();
        console.log("Stocks in Smartfin_db.stocks (limited to 5):");
        console.dir(stocks, { depth: null });
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
    }
}

checkStocks();