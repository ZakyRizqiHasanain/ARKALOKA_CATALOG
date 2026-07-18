import API_URL from "./api";

// 1. Get products with query parameters (search, category slug, sorting, pagination)
export async function getProducts(params = {}) {
    const urlParams = new URLSearchParams();
    
    if (params.q) urlParams.append("q", params.q);
    if (params.category) urlParams.append("category", params.category);
    if (params.sort) urlParams.append("sort", params.sort);
    if (params.page) urlParams.append("page", params.page);
    if (params.limit) urlParams.append("limit", params.limit);
    if (params.admin) urlParams.append("admin", params.admin);

    const response = await fetch(`${API_URL}/products?${urlParams.toString()}`, {
        headers: params.admin === "true" ? {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        } : {}
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil data produk");
    }
    return data;
}

// 2. Get product details by ID
export async function getProductById(id) {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/products/${id}`, { headers });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil detail produk");
    }
    return data;
}