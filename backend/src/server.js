const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./config/database");
const errorHandler = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : ["http://localhost:5173", "http://localhost:5174"];

// Bulletproof CORS headers middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());

// Static files — serve folder uploads/ agar gambar bisa diakses via URL
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Base route
app.get("/", (req, res) => {
    res.json({
        message: "Product Store API Running",
        endpoints: {
            auth: "/api/auth",
            products: "/api/products",
            categories: "/api/categories",
            admin: "/api/admin",
            upload: "/api/upload",
            uploads_static: "/uploads/:filename",
        },
    });
});

// Error handling middleware (must be registered last)
app.use(errorHandler);

// Database Connection & Server Startup
if (require.main === module) {
    pool.connect()
        .then(() => {
            console.log("Database connected successfully");
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
                console.log(`Uploads accessible at: http://localhost:${PORT}/uploads/`);
            });
        })
        .catch((err) => {
            console.error("Database connection failed:", err);
        });
}

module.exports = app;