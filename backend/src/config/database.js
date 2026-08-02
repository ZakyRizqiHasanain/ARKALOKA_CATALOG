const {Pool}=require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });


const connectionString = process.env.DATABASE_URL || "postgresql://postgres.utzrhmxfttvtqkepxipe:Akunbaru13*@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres";

const config = {
    connectionString,
    ssl: { rejectUnauthorized: false },
};

const pool = new Pool(config);


module.exports=pool;