const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
const verifyToken = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected routes (Admin only)
router.post("/", verifyToken, createProduct);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

module.exports = router;