// here setup the express server - main entry point for us
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Configure CORS to allow requests from the React frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Adjust if your frontend uses a different origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./backend/routes/auth"));
app.use("/api/transactions", require("./backend/routes/transactions"));
app.use("/api/accounts", require("./backend/routes/accounts"));
app.use("/api/budgets", require("./backend/routes/budgets"));
app.use("/api/goals", require("./backend/routes/goals"));
app.use("/api/stocks", require("./backend/routes/stocks"));
app.use("/api/predictions", require("./backend/routes/predictions"));

// Connect to DB (for other routes using Mongoose, e.g., auth, transactions)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.log("❌ DB Error", err));

// Start server
const PORT = process.env.PORT || 3000; // Changed to 3000 to avoid conflict with Flask (5000)
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));