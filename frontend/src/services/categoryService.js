/**
 * categoryService.js
 *
 * Menggunakan apiClient untuk token expiry handling otomatis.
 *
 * Kolom DB aktual: id, nama_kategori, slug, gambar
 *
 * getCategories() adalah public (tidak butuh token) — dipakai di frontend publik.
 * create/update/delete butuh JWT (admin only).
 */
import apiClient from "../utils/apiClient";
import API_URL from "./api";

// 1. Get all categories — PUBLIC (tidak perlu token)
export async function getCategories() {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data kategori");
    }
    return data;
}

// 2. Create category (Admin only)
export async function createCategory(categoryData) {
    const response = await apiClient("/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal menambahkan kategori");
    return data;
}

// 3. Update category (Admin only)
export async function updateCategory(id, categoryData) {
    const response = await apiClient(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal mengupdate kategori");
    return data;
}

// 4. Delete category (Admin only)
export async function deleteCategory(id) {
    const response = await apiClient(`/categories/${id}`, {
        method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal menghapus kategori");
    return data;
}