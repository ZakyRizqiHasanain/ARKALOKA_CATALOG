import { useEffect, useState } from "react";
import EditProduct from "./EditProduct";
import {
    getAdminProducts,
    deleteProduct
} from "../services/productAdminService";

import AdminLayout from "../components/admin/AdminLayout";
import AddProduct from "./AddProduct";

function ProductsManagement() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    // ✅ FIX: loadProducts is now a standalone function (not containing handleDelete)
    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");
            // getAdminProducts() already maps: nama_produk→name, harga→price, deskripsi→description
            const data = await getAdminProducts();
            setProducts(data);
        } catch (err) {
            setError(err.message || "Gagal memuat produk.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ FIX: handleDelete is now properly at component level (sibling of loadProducts)
    const handleDelete = async (id, name) => {
        const confirmDelete = window.confirm(
            `Apakah Anda yakin ingin menghapus produk "${name}"?`
        );
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await deleteProduct(id);
            alert("Produk berhasil dihapus.");
            loadProducts();
        } catch (err) {
            alert(err.message || "Gagal menghapus produk.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AdminLayout>
            <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {products.length} produk terdaftar
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditProduct(null);
                            setShowForm(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200 shadow-sm"
                    >
                        + Tambah Produk
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Add Product Form */}
                {showForm && !editProduct && (
                    <AddProduct
                        closeForm={() => setShowForm(false)}
                        refreshProducts={loadProducts}
                    />
                )}

                {/* Edit Product Form */}
                {editProduct && (
                    <EditProduct
                        product={editProduct}
                        closeForm={() => setEditProduct(null)}
                        refreshProducts={loadProducts}
                    />
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : products.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white p-16 rounded-xl shadow text-center text-gray-500">
                        <span className="text-4xl block mb-3">📦</span>
                        <p className="font-semibold text-gray-700">Belum ada produk.</p>
                        <p className="text-sm mt-1">Klik "Tambah Produk" untuk menambahkan produk pertama.</p>
                    </div>
                ) : (
                    /* Products Table */
                    <div className="bg-white rounded-xl shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-gray-600 uppercase tracking-wide text-xs">
                                        Produk
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600 uppercase tracking-wide text-xs">
                                        Kategori
                                    </th>
                                    <th className="p-4 text-left font-semibold text-gray-600 uppercase tracking-wide text-xs">
                                        Harga
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600 uppercase tracking-wide text-xs">
                                        Status
                                    </th>
                                    <th className="p-4 text-center font-semibold text-gray-600 uppercase tracking-wide text-xs">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        {/* ✅ FIX: uses product.name (mapped from nama_produk by getAdminProducts) */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {product.gambar && (
                                                    <img
                                                        src={product.gambar}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                                                        onError={(e) => { e.target.style.display = "none"; }}
                                                    />
                                                )}
                                                <span className="font-medium text-gray-800">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* ✅ FIX: uses product.category (mapped from category by getAdminProducts) */}
                                        <td className="p-4 text-gray-600">
                                            {product.category || "-"}
                                        </td>

                                        {/* ✅ FIX: uses product.price (mapped from harga by getAdminProducts) */}
                                        <td className="p-4 font-semibold text-gray-800">
                                            {formatRupiah(product.price)}
                                        </td>

                                        <td className="p-4 text-center">
                                            <span
                                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    product.status === "active"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                {product.status === "active" ? "Aktif" : "Non-aktif"}
                                            </span>
                                        </td>

                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setShowForm(false);
                                                        setEditProduct(product);
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
                                                >
                                                    Edit
                                                </button>
                                                {/* ✅ FIX: uses product.name (correctly mapped) */}
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default ProductsManagement;