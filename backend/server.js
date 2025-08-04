// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Fix path

const app = express();

// Single CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Routes with debug
console.log("Loading auth routes from:", path.resolve(__dirname, "./routes/auth")); // Debug path
app.use("/api/auth", require("./routes/auth"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/accounts", require("./routes/accounts"));
app.use("/api/budgets", require("./routes/budgets"));
app.use("/api/stocks", require("./routes/stocks"));
app.use("/api/goals", require("./routes/goals"));
app.use("/api/predictions", require("./routes/predictions"));
app.use("/api/favorite-stocks", require("./routes/favoriteStocks"));
app.use("/api", require("./routes/userRoutes"));

// Enhanced Mongoose connection with reconnection
const connectWithRetry = () => {
    mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        maxPoolSize: 50,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        autoIndex: false,
        bufferCommands: false,
        autoCreate: true,
        retryWrites: true,
    }).then(() => console.log("✅ MongoDB connected"))
      .catch(err => {
          console.error("❌ MongoDB Initial Connection Error:", err.message, err.stack);
          setTimeout(connectWithRetry, 5000); // Retry every 5 seconds
      });
};

connectWithRetry();

mongoose.connection.on('disconnected', () => {
    console.log("🔄 MongoDB disconnected. Attempting to reconnect...");
    connectWithRetry(); // Retry on disconnect
});
mongoose.connection.on('reconnected', () => console.log("✅ MongoDB reconnected"));
mongoose.connection.on('error', err => console.error("❌ MongoDB Error:", err));
mongoose.connection.on('timeout', err => console.error("❌ MongoDB Timeout:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));