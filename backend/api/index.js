const express = require("express");
const cors = require("cors");
const pool = require("../src/config/database");

const authRoutes = require("../src/routes/authRoutes");
const productRoutes = require("../src/routes/productRoutes");
const categoryRoutes = require("../src/routes/categoryRoutes");
const adminRoutes = require("../src/routes/adminRoutes");
const uploadRoutes = require("../src/routes/uploadRoutes");
const errorHandler = require("../src/middleware/errorMiddleware");

const app = express();

// Global CORS Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Base route fallback
app.get("*", (req, res, next) => {
    if (req.path === "/" || req.path === "/api" || req.path === "/api/") {
        return res.json({ message: "Product Store API Running" });
    }
    next();
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
