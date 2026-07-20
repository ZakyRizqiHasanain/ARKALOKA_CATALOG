import apiClient from "../utils/apiClient";

// ── Kolom DB aktual (dari schema inspection): ──────────────────────────────
//   id, kategori_id, nama_produk, harga, deskripsi, gambar, status, created_at
// ── Service ini memetakan nama field DB ke nama frontend: ──────────────────
//   nama_produk  → name
//   harga        → price
//   deskripsi    → description
//   gambar       → image
//   kategori_id  → category_id
// ──────────────────────────────────────────────────────────────────────────

/** Peta dari DB columns ke frontend fields */
function mapProductFromDB(row) {
    return {
        id: row.id,
        name: row.nama_produk,
        price: parseFloat(row.harga),
        description: row.deskripsi || "",
        image: row.gambar || "",
        status: row.status || "active",
        category_id: row.kategori_id,
        category: row.category || row.nama_kategori || "",
        category_slug: row.category_slug || "",
        stock: row.stock ?? 0,
        created_at: row.created_at,
    };
}

/** Peta dari frontend fields ke DB columns (untuk INSERT/UPDATE) */
function mapProductToDB(formData) {
    return {
        nama_produk: formData.name,
        kategori_id: parseInt(formData.category_id, 10),
        harga: parseFloat(formData.price),
        deskripsi: formData.description || "",
        gambar: formData.image || "",
        status: formData.status || "active",
        // stock hanya dikirim jika ada (opsional — bergantung apakah kolom sudah di-migrate)
        ...(formData.stock !== undefined && formData.stock !== ""
            ? { stock: parseInt(formData.stock, 10) }
            : {}),
    };
}

// 1. Ambil semua produk (admin view — includes inactive)
export async function getAdminProducts({ q = "", category = "", sort = "", page = 1, limit = 8 } = {}) {
    const params = new URLSearchParams({ admin: "true", limit, page });
    if (q) params.append("q", q);
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);

    const response = await apiClient(`/products?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Gagal mengambil produk");

    return {
        products: (data.products || []).map(mapProductFromDB),
        pagination: data.pagination || { totalProducts: 0, totalPages: 1, currentPage: 1, limit: 8 },
    };
}

// 2. Tambah produk baru
export async function createProduct(formData) {
    const body = mapProductToDB(formData);

    const response = await apiClient("/products", {
        method: "POST",
        body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal menambahkan produk");
    return data;
}

// 3. Update produk
export async function updateProduct(id, formData) {
    const body = mapProductToDB(formData);

    const response = await apiClient(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal mengupdate produk");
    return data;
}

// 4. Hapus produk
export async function deleteProduct(id) {
    const response = await apiClient(`/products/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal menghapus produk");
    return data;
}

// 5. Upload gambar ke server
export async function uploadProductImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient("/upload/image", {
        method: "POST",
        body: formData, // apiClient otomatis hapus Content-Type untuk FormData
        headers: {}, // override default JSON header
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal upload gambar");
    return data; // { message, filename, url }
}