const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

let connectionString = (process.env.DATABASE_URL || "").trim();

// Auto-fix: If connectionString is empty or uses direct IPv6 host that fails on Vercel AWS Lambda, automatically enforce the working IPv4 Pooler URL
if (!connectionString || connectionString.includes("db.utzrhmxft") || !connectionString.includes("pooler.supabase.com")) {
    connectionString = "postgresql://postgres.utzrhmxfttvtqkepxipe:Akunbaru13*@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle pg client", err);
});

module.exports = pool;