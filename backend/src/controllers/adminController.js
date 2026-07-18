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
            SELECT p.id, p.nama_produk, p.harga, p.status, c.nama_kategori AS category
            FROM products p
            JOIN categories c ON p.kategori_id = c.id
            ORDER BY p.id DESC
            LIMIT 5
        `);
        const recentProducts = recentProductsRes.rows.map(row => ({
            ...row,
            harga: parseFloat(row.harga)
        }));

        return res.json({
            totalProducts,
            totalCategories,
            totalUsers,
            recentProducts
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};