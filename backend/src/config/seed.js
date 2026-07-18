const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const pool = require("./database");

async function runSeed() {
    console.log("Starting database seeding...");
    
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
            { nama: "Elektronik", slug: "elektronik", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=60" },
            { nama: "Fashion", slug: "fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60" },
            { nama: "Makanan", slug: "makanan", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=60" },
            { nama: "Minuman", slug: "minuman", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=60" },
            { nama: "Furniture", slug: "furniture", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=60" },
            { nama: "Aksesoris", slug: "aksesoris", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=60" },
            { nama: "Lainnya", slug: "lainnya", img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=60" }
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

        // 4. Seed Products
        console.log("Seeding products...");
        const products = [
            {
                kategori_id: getCatId("elektronik"),
                nama_produk: "Laptop ASUS ROG Zephyrus",
                harga: 18500000,
                deskripsi: "Laptop gaming super tipis dan bertenaga tinggi dengan prosesor AMD Ryzen 9 dan NVIDIA RTX 4060. Layar 14 inci OLED 120Hz yang sangat jernih.",
                gambar: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("elektronik"),
                nama_produk: "Smartphone Samsung Galaxy S24 Ultra",
                harga: 19999000,
                deskripsi: "Flagship smartphone dengan AI canggih, kamera 200MP, dan layar Dynamic AMOLED 2X 6.8 inci. Dilengkapi S-Pen internal dan frame Titanium.",
                gambar: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("fashion"),
                nama_produk: "Jaket Denim Vintage Oversize",
                harga: 299000,
                deskripsi: "Jaket denim klasik unisex dengan potongan oversized yang trendy. Terbuat dari bahan jeans tebal berkualitas tinggi yang nyaman dipakai sepanjang hari.",
                gambar: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("makanan"),
                nama_produk: "Nasi Goreng Wagyu Istimewa",
                harga: 75000,
                deskripsi: "Nasi goreng bumbu rempah nusantara khas dengan irisan daging sapi wagyu empuk yang berlimpah, telur ceplok setengah matang, dan kerupuk udang.",
                gambar: "https://images.unsplash.com/photo-1603133872878-6967b6827050?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("minuman"),
                nama_produk: "Es Kopi Susu Gula Aren 1 Liter",
                harga: 65000,
                deskripsi: "Signature blend kopi espresso dengan susu segar creamy dan gula aren murni. Dikemas dalam botol 1 Liter, praktis untuk dinikmati bersama keluarga.",
                gambar: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("furniture"),
                nama_produk: "Kursi Kerja Kantor Ergonomis",
                harga: 1450000,
                deskripsi: "Kursi kerja dengan penopang lumbar fleksibel, sandaran jala (mesh) anti gerah, armrest 3D yang dapat diatur, dan roda nilon kokoh anti slip.",
                gambar: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("aksesoris"),
                nama_produk: "Kacamata Hitam Aviator Polarized",
                harga: 185000,
                deskripsi: "Kacamata polarized pelindung UV400 dengan frame stainless steel tipis dan kuat. Melindungi mata dari silau sinar matahari dengan gaya yang keren.",
                gambar: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=60",
                status: "active"
            },
            {
                kategori_id: getCatId("lainnya"),
                nama_produk: "Mug Keramik Custom Premium (Contoh Inactive)",
                harga: 45000,
                deskripsi: "Mug keramik premium dengan cetakan sablon anti luntur. Cocok untuk hadiah ulang tahun, souvenir kantor, atau pemakaian pribadi. (Diset tidak aktif).",
                gambar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=60",
                status: "inactive"
            }
        ];

        for (const prod of products) {
            await pool.query(
                `INSERT INTO products (kategori_id, nama_produk, harga, deskripsi, gambar, status) VALUES ($1, $2, $3, $4, $5, $6)`,
                [prod.kategori_id, prod.nama_produk, prod.harga, prod.deskripsi, prod.gambar, prod.status]
            );
        }
        console.log(`${products.length} products seeded.`);

        console.log("Database seeded successfully.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        pool.end();
    }
}

runSeed();
