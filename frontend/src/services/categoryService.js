import API_URL from "./api";

// 1. Get all categories
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
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal menambahkan kategori");
    }
    return data;
}

// 3. Update category (Admin only)
export async function updateCategory(id, categoryData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal mengupdate kategori");
    }
    return data;
}

// 4. Delete category (Admin only)
export async function deleteCategory(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus kategori");
    }
    return data;
}