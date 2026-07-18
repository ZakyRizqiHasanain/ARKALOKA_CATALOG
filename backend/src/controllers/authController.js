const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Input Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi"
            });
        }

        // 2. Query admin user from database
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND role = 'admin'",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        const admin = result.rows[0];

        // 3. Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Email atau password salah"
            });
        }

        // 4. Generate JWT Token
        const token = jwt.sign(
            { id: admin.id, name: admin.name, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 5. Send response
        return res.json({
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                role: admin.role
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginAdmin
};
