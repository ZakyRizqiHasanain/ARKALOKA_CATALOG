-- Clean up existing tables (optional, for safe seeding)
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- 1. Users Table (Admin accounts only)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role = 'admin'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    gambar TEXT
);

-- 3. Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    kategori_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    nama_produk VARCHAR(255) NOT NULL,
    harga NUMERIC(12, 2) NOT NULL CHECK (harga >= 0),
    deskripsi TEXT,
    gambar TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
