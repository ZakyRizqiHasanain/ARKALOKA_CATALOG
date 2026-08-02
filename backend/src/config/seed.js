const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const pool = require("./database");

async function runSeed() {
    console.log("Starting database seeding for ARKALOKA Digital Studio...");
    
    try {
        // 1. Read and execute migration.sql
        const migrationSqlPath = path.join(__dirname, "migration.sql");
        const migrationSql = fs.readFileSync(migrationSqlPath, "utf8");
        
        console.log("Running migrations...");
        await pool.query(migrationSql);
        console.log("Migrations executed successfully.");

        // 2. Hash admin password and insert admin
        console.log("Seeding default admin...");
        const adminEmail = "admin@gmail.com";
        const adminPasswordRaw = "admin123";
        const adminPasswordHash = await bcrypt.hash(adminPasswordRaw, 10);
        
        await pool.query(
            `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
            ["Admin Utama", adminEmail, adminPasswordHash, "admin"]
        );
        console.log(`Admin account seeded: ${adminEmail} / ${adminPasswordRaw}`);

        // 3. Seed Categories
        console.log("Seeding categories...");
        const categories = [
            {
                nama: "Web Development",
                slug: "web-development",
                img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=60"
            },
            {
                nama: "Backend & Database",
                slug: "backend-database",
                img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=60"
            },
            {
                nama: "Debugging & Testing",
                slug: "debugging-testing",
                img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60"
            },
            {
                nama: "Custom Website",
                slug: "custom-website",
                img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60"
            },
            {
                nama: "Project Documentation",
                slug: "project-documentation",
                img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60"
            }
        ];

        const seededCategories = [];
        for (const cat of categories) {
            const res = await pool.query(
                `INSERT INTO categories (nama_kategori, slug, gambar) VALUES ($1, $2, $3) RETURNING *`,
                [cat.nama, cat.slug, cat.img]
            );
            seededCategories.push(res.rows[0]);
        }
        console.log(`${seededCategories.length} categories seeded.`);

        // Helper to get category ID by slug
        const getCatId = (slug) => seededCategories.find(c => c.slug === slug).id;

        // 4. Seed Projects
        console.log("Seeding IT projects...");
        const products = [
            {
                kategori_id: getCatId("custom-website"),
                nama_produk: "Birthday Website Premium",
                harga: 500000,
                deskripsi: "Website ulang tahun dengan desain modern, animasi interaktif, dan tampilan responsive.",
                gambar: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("web-development"),
                nama_produk: "Company Profile Website",
                harga: 1500000,
                deskripsi: "Website company profile profesional dengan desain elegan dan mudah dikembangkan.",
                gambar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("backend-database"),
                nama_produk: "REST API Management System",
                harga: 2000000,
                deskripsi: "Backend API menggunakan Node.js Express dengan database PostgreSQL.",
                gambar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("debugging-testing"),
                nama_produk: "Bug Fix & Optimization Project",
                harga: 350000,
                deskripsi: "Perbaikan error program, optimasi fitur, dan testing sistem.",
                gambar: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("project-documentation"),
                nama_produk: "Student Project Documentation",
                harga: 250000,
                deskripsi: "Pembuatan README, laporan project, dan dokumentasi GitHub.",
                gambar: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60",
                status: "active"
            }
        ];

        for (const prod of products) {
            await pool.query(
                `INSERT INTO products (kategori_id, nama_produk, harga, deskripsi, gambar, status) VALUES ($1, $2, $3, $4, $5, $6)`,
                [prod.kategori_id, prod.nama_produk, prod.harga, prod.deskripsi, prod.gambar, prod.status]
            );
        }
        console.log(`${products.length} projects seeded.`);

        console.log("Database seeded successfully for ARKALOKA Studio.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        pool.end();
    }
}

runSeed();
