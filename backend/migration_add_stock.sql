-- migration_add_stock.sql
-- Jalankan sekali untuk menambahkan kolom stock ke tabel products
-- Perintah: psql -U postgres -d product_store -f migration_add_stock.sql

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;

-- Verifikasi
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'stock';
