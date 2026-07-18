const pool = require("../config/database");

// 1. Get all categories
const getCategories = async (req, res, next) => {
    try {
        const result = await pool.query(
            "SELECT * FROM categories ORDER BY id ASC"
        );
        return res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

// 2. Create category (Admin only)
const createCategory = async (req, res, next) => {
    try {
        const { nama_kategori, slug, gambar } = req.body;

        // Input validation
        if (!nama_kategori || !nama_kategori.trim()) {
            return res.status(400).json({ message: "Nama kategori wajib diisi" });
        }
        if (!slug || !slug.trim()) {
            return res.status(400).json({ message: "Slug wajib diisi" });
        }
        // Validate slug format: alphanumeric and dashes only, lowercase
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            return res.status(400).json({ message: "Slug harus berupa huruf kecil, angka, atau tanda hubung (-)" });
        }

        // Check if slug is unique
        const checkSlug = await pool.query(
            "SELECT id FROM categories WHERE slug = $1",
            [slug]
        );
        if (checkSlug.rows.length > 0) {
            return res.status(400).json({ message: "Slug sudah digunakan kategori lain" });
        }

        const result = await pool.query(
            "INSERT INTO categories (nama_kategori, slug, gambar) VALUES ($1, $2, $3) RETURNING *",
            [nama_kategori.trim(), slug.trim(), gambar ? gambar.trim() : null]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 3. Update category (Admin only)
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nama_kategori, slug, gambar } = req.body;

        if (!nama_kategori || !nama_kategori.trim()) {
            return res.status(400).json({ message: "Nama kategori wajib diisi" });
        }
        if (!slug || !slug.trim()) {
            return res.status(400).json({ message: "Slug wajib diisi" });
        }
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            return res.status(400).json({ message: "Slug harus berupa huruf kecil, angka, atau tanda hubung (-)" });
        }

        // Check if slug is unique by another category
        const checkSlug = await pool.query(
            "SELECT id FROM categories WHERE slug = $1 AND id <> $2",
            [slug, id]
        );
        if (checkSlug.rows.length > 0) {
            return res.status(400).json({ message: "Slug sudah digunakan kategori lain" });
        }

        const result = await pool.query(
            "UPDATE categories SET nama_kategori = $1, slug = $2, gambar = $3 WHERE id = $4 RETURNING *",
            [nama_kategori.trim(), slug.trim(), gambar ? gambar.trim() : null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 4. Delete category (Admin only)
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM categories WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        return res.json({ message: "Kategori berhasil dihapus", category: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};