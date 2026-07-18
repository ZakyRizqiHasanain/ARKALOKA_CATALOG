const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");

// Protected route
router.get("/stats", verifyToken, getDashboardStats);

module.exports = router;