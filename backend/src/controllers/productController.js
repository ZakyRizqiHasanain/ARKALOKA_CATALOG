const pool = require("../config/database");
const jwt = require("jsonwebtoken");

// 1. Get all products (with search, category filter, sorting, pagination, and status checks)
const getProducts = async (req, res, next) => {
    try {
        const { q, category, sort, page = 1, limit = 10, admin } = req.query;
        
        let isAdmin = false;
        
        // If admin parameter is true, verify JWT token to allow viewing inactive products
        if (admin === "true") {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "Token tidak ditemukan" });
            }
            const token = authHeader.split(" ")[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.role === "admin") {
                    isAdmin = true;
                }
            } catch (err) {
                return res.status(401).json({ message: "Token tidak valid" });
            }
        }

        let queryText = `
            SELECT p.*, c.nama_kategori AS category, c.slug AS category_slug, COUNT(*) OVER() as total_count
            FROM products p
            JOIN categories c ON p.kategori_id = c.id
            WHERE 1=1
        `;
        const params = [];

        // Filter: active status only for public users
        if (!isAdmin) {
            queryText += ` AND p.status = 'active'`;
        }

        // Filter: search by name
        if (q && q.trim()) {
            params.push(`%${q.trim()}%`);
            queryText += ` AND LOWER(p.nama_produk) LIKE LOWER($${params.length})`;
        }

        // Filter: category slug
        if (category && category.trim()) {
            params.push(category.trim());
            queryText += ` AND c.slug = $${params.length}`;
        }

        // Sorting
        if (sort === "asc") {
            queryText += ` ORDER BY p.harga ASC, p.id ASC`;
        } else if (sort === "desc") {
            queryText += ` ORDER BY p.harga DESC, p.id ASC`;
        } else {
            queryText += ` ORDER BY p.id DESC`;
        }

        // Pagination calculations
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;

        params.push(limitNum);
        queryText += ` LIMIT $${params.length}`;

        params.push(offset);
        queryText += ` OFFSET $${params.length}`;

        const result = await pool.query(queryText, params);
        
        const totalProducts = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
        const totalPages = Math.ceil(totalProducts / limitNum);

        // Map database result rows to remove total_count column from output json and parse prices
        const products = result.rows.map(row => {
            const { total_count, ...product } = row;
            return {
                ...product,
                harga: parseFloat(product.harga)
            };
        });

        return res.json({
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: pageNum,
                limit: limitNum
            }
        });

    } catch (error) {
        next(error);
    }
};

// 2. Get product details by ID
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT p.*, c.nama_kategori AS category, c.slug AS category_slug 
             FROM products p 
             JOIN categories c ON p.kategori_id = c.id 
             WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        const product = result.rows[0];
        product.harga = parseFloat(product.harga);

        // Security check: If product is inactive, verify if requester is admin
        if (product.status === "inactive") {
            const authHeader = req.headers.authorization;
            let authenticated = false;
            if (authHeader) {
                const token = authHeader.split(" ")[1];
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    if (decoded.role === "admin") {
                        authenticated = true;
                    }
                } catch (err) {
                    // ignore and keep authenticated = false
                }
            }
            if (!authenticated) {
                return res.status(404).json({ message: "Produk tidak ditemukan" });
            }
        }

        return res.json(product);
    } catch (error) {
        next(error);
    }
};

// 3. Create product (Admin only)
const createProduct = async (req, res, next) => {
    try {
        const { nama_produk, kategori_id, harga, deskripsi, gambar, status = "active" } = req.body;

        // Input validation
        if (!nama_produk || !nama_produk.trim()) {
            return res.status(400).json({ message: "Nama produk wajib diisi" });
        }
        if (!kategori_id) {
            return res.status(400).json({ message: "Kategori wajib dipilih" });
        }
        if (harga === undefined || harga === null || isNaN(harga) || parseFloat(harga) < 0) {
            return res.status(400).json({ message: "Harga harus berupa angka dan tidak boleh kurang dari 0" });
        }
        if (status !== "active" && status !== "inactive") {
            return res.status(400).json({ message: "Status produk tidak valid (harus active atau inactive)" });
        }

        // Verify category exists
        const categoryCheck = await pool.query("SELECT id FROM categories WHERE id = $1", [kategori_id]);
        if (categoryCheck.rows.length === 0) {
            return res.status(400).json({ message: "Kategori yang dipilih tidak valid" });
        }

        const result = await pool.query(
            `INSERT INTO products (nama_produk, kategori_id, harga, deskripsi, gambar, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                nama_produk.trim(),
                kategori_id,
                parseFloat(harga),
                deskripsi ? deskripsi.trim() : null,
                gambar ? gambar.trim() : null,
                status
            ]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 4. Update product (Admin only)
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nama_produk, kategori_id, harga, deskripsi, gambar, status } = req.body;

        // Input validation
        if (!nama_produk || !nama_produk.trim()) {
            return res.status(400).json({ message: "Nama produk wajib diisi" });
        }
        if (!kategori_id) {
            return res.status(400).json({ message: "Kategori wajib dipilih" });
        }
        if (harga === undefined || harga === null || isNaN(harga) || parseFloat(harga) < 0) {
            return res.status(400).json({ message: "Harga harus berupa angka dan tidak boleh kurang dari 0" });
        }
        if (status !== "active" && status !== "inactive") {
            return res.status(400).json({ message: "Status produk tidak valid (harus active atau inactive)" });
        }

        // Verify category exists
        const categoryCheck = await pool.query("SELECT id FROM categories WHERE id = $1", [kategori_id]);
        if (categoryCheck.rows.length === 0) {
            return res.status(400).json({ message: "Kategori yang dipilih tidak valid" });
        }

        const result = await pool.query(
            `UPDATE products 
             SET nama_produk = $1, kategori_id = $2, harga = $3, deskripsi = $4, gambar = $5, status = $6 
             WHERE id = $7 RETURNING *`,
            [
                nama_produk.trim(),
                kategori_id,
                parseFloat(harga),
                deskripsi ? deskripsi.trim() : null,
                gambar ? gambar.trim() : null,
                status,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// 5. Delete product (Admin only)
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM products WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        return res.json({ message: "Produk berhasil dihapus", product: result.rows[0] });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};