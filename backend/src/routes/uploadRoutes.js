const express = require("express");
const router = express.Router();
const path = require("path");
const upload = require("../middleware/uploadMiddleware");
const verifyToken = require("../middleware/authMiddleware");

// POST /api/upload/image — Admin only, single file upload
router.post("/image", verifyToken, upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Tidak ada file yang diupload" });
    }

    // Kembalikan URL relatif yang bisa diakses dari frontend
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(201).json({
        message: "Upload berhasil",
        filename: req.file.filename,
        url: imageUrl,
    });
});

module.exports = router;
