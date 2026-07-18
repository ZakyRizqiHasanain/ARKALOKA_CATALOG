import API_URL from "./api";

// 1. Get all products for admin management (maps backend fields to frontend format)
export async function getAdminProducts() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/products?admin=true&limit=100`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil produk");
    }
    
    // Map database fields (nama_produk, harga, deskripsi) back to frontend convention (name, price, description)
    return (data.products || []).map(product => ({
        id: product.id,
        name: product.nama_produk,
        price: parseFloat(product.harga),
        description: product.deskripsi,
        gambar: product.gambar,
        status: product.status,
        category: product.category,
        category_id: product.kategori_id
    }));
}

// 2. Create a new product (Admin only) (maps frontend form convention to backend format)
export async function createProduct(productData) {
    const token = localStorage.getItem("token");
    
    const backendData = {
        nama_produk: productData.name,
        kategori_id: parseInt(productData.category_id, 10),
        harga: parseFloat(productData.price),
        deskripsi: productData.description,
        gambar: productData.gambar || "",
        status: productData.status || "active"
    };

    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal menambahkan produk");
    }
    return data;
}

// 3. Update an existing product (Admin only) (maps frontend form convention to backend format)
export async function updateProduct(id, productData) {
    const token = localStorage.getItem("token");
    
    const backendData = {
        nama_produk: productData.name,
        kategori_id: parseInt(productData.category_id, 10),
        harga: parseFloat(productData.price),
        deskripsi: productData.description,
        gambar: productData.gambar || "",
        status: productData.status || "active"
    };

    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal mengupdate produk");
    }
    return data;
}

// 4. Delete a product (Admin only)
export async function deleteProduct(id) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Gagal menghapus produk");
    }
    return data;
}