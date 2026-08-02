module.exports = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        const app = require("../src/server");
        return app(req, res);
    } catch (err) {
        console.error("Vercel Function Error:", err);
        return res.status(500).json({
            error: err.message || "Internal Server Error",
            stack: err.stack
        });
    }
};
