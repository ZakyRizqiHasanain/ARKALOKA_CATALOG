const pool = require("../config/database");

const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Total products
        const productsCountRes = await pool.query("SELECT COUNT(*) FROM products");
        const totalProducts = parseInt(productsCountRes.rows[0].count, 10);

        // 2. Total categories
        const categoriesCountRes = await pool.query("SELECT COUNT(*) FROM categories");
        const totalCategories = parseInt(categoriesCountRes.rows[0].count, 10);

        // 3. Total users (admins)
        const usersCountRes = await pool.query("SELECT COUNT(*) FROM users");
        const totalUsers = parseInt(usersCountRes.rows[0].count, 10);

        // 4. Recent products (latest 5)
        const recentProductsRes = await pool.query(`
            SELECT p.id, p.nama_produk, p.harga, p.gambar, p.status, p.created_at, c.nama_kategori AS kategori
            FROM products p
            JOIN categories c ON p.kategori_id = c.id
            ORDER BY p.id DESC
            LIMIT 5
        `);
        const recentProducts = recentProductsRes.rows.map(row => ({
            id: row.id,
            nama_produk: row.nama_produk,
            harga: row.harga !== null && row.harga !== undefined ? Number(row.harga) : 0,
            gambar: row.gambar || "/logo.png",
            kategori: row.kategori,
            status: row.status,
            created_at: row.created_at
        }));

        // 5. Products grouped by category
        const productsByCategoryRes = await pool.query(`
            SELECT c.nama_kategori AS category, COUNT(p.id)::int AS total
            FROM categories c
            LEFT JOIN products p ON p.kategori_id = c.id
            GROUP BY c.id, c.nama_kategori
            ORDER BY total DESC
        `);
        const productsByCategory = productsByCategoryRes.rows;

        return res.json({
            totalProducts,
            totalCategories,
            totalUsers,
            recentProducts,
            productsByCategory
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};