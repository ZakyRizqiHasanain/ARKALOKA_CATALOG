const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const connectionString = (process.env.DATABASE_URL || "postgresql://postgres.utzrhmxfttvtqkepxipe:Akunbaru13*@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres").trim();

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