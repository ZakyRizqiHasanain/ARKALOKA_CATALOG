import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductForm from "../../components/admin/ProductForm";
import {
    getAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../../services/productAdminService";
import { getCategories } from "../../services/categoryService";

// ── Helpers ────────────────────────────────────────────────────────────────
const formatRupiah = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

// ── Modal Wrapper ──────────────────────────────────────────────────────────
function Modal({ title, subtitle, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
                        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
}

// ── Skeleton Row ──────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            {[...Array(7)].map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────
function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ totalProducts: 0, totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");

    // Filter & search states
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const LIMIT = 8;

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null); // product object atau null
    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
    const [toast, setToast] = useState(null); // { type: "success"|"error", message }

    // ── Toast helper ──────────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Fetch products ─────────────────────────────────────────────────────
    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getAdminProducts({
                q: search,
                category: categoryFilter,
                sort,
                page,
                limit: LIMIT,
            });
            setProducts(data.products);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message || "Gagal memuat produk.");
        } finally {
            setLoading(false);
        }
    }, [search, categoryFilter, sort, page]);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    // Fetch categories untuk filter dropdown
    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => {});
    }, []);

    // Reset ke page 1 jika filter berubah
    useEffect(() => { setPage(1); }, [search, categoryFilter, sort]);

    // ── Search submit ──────────────────────────────────────────────────────
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    // ── Add product ────────────────────────────────────────────────────────
    const handleAdd = async (formData) => {
        setFormLoading(true);
        try {
            await createProduct(formData);
            showToast("success", "Produk berhasil ditambahkan!");
            setShowAddModal(false);
            loadProducts();
        } catch (err) {
            showToast("error", err.message || "Gagal menambahkan produk.");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Edit product ───────────────────────────────────────────────────────
    const handleEdit = async (formData) => {
        if (!editProduct) return;
        setFormLoading(true);
        try {
            await updateProduct(editProduct.id, formData);
            showToast("success", "Produk berhasil diperbarui!");
            setEditProduct(null);
            loadProducts();
        } catch (err) {
            showToast("error", err.message || "Gagal mengupdate produk.");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Delete product ─────────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setFormLoading(true);
        try {
            await deleteProduct(deleteTarget.id);
            showToast("success", `"${deleteTarget.name}" berhasil dihapus.`);
            setDeleteTarget(null);
            loadProducts();
        } catch (err) {
            showToast("error", err.message || "Gagal menghapus produk.");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* ── Toast Notification ────────────────────────────────── */}
                {toast && (
                    <div
                        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all duration-300 ${
                            toast.type === "success"
                                ? "bg-emerald-600 text-white"
                                : "bg-red-600 text-white"
                        }`}
                    >
                        {toast.type === "success" ? "✅" : "❌"} {toast.message}
                    </div>
                )}

                {/* ── Page Header ───────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Manajemen Produk</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {pagination.totalProducts} produk terdaftar
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditProduct(null); setShowAddModal(true); }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
                    >
                        <span className="text-base">+</span> Tambah Produk
                    </button>
                </div>

                {/* ── Search & Filter Bar ───────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari nama produk..."
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                Cari
                            </button>
                        </form>

                        {/* Filter Kategori */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                    {c.nama_kategori}
                                </option>
                            ))}
                        </select>

                        {/* Sort Harga */}
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            <option value="">Terbaru</option>
                            <option value="asc">Harga: Terendah</option>
                            <option value="desc">Harga: Tertinggi</option>
                        </select>

                        {/* Reset */}
                        {(search || categoryFilter || sort) && (
                            <button
                                onClick={() => { setSearch(""); setSearchInput(""); setCategoryFilter(""); setSort(""); }}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Error Banner ──────────────────────────────────────── */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* ── Products Table ────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left w-10">ID</th>
                                    <th className="px-4 py-3 text-left">Produk</th>
                                    <th className="px-4 py-3 text-left">Kategori</th>
                                    <th className="px-4 py-3 text-left">Harga</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-left">Dibuat</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    [...Array(LIMIT)].map((_, i) => <SkeletonRow key={i} />)
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <span className="text-4xl block mb-3">📦</span>
                                            <p className="text-gray-500 font-medium">
                                                {search || categoryFilter
                                                    ? "Produk tidak ditemukan. Coba filter lain."
                                                    : "Belum ada produk. Tambahkan produk pertama!"}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-gray-50 transition-colors duration-100"
                                        >
                                            {/* ID */}
                                            <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                                                #{product.id}
                                            </td>

                                            {/* Produk (gambar + nama) */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                                                            onError={(e) => { e.target.style.display = "none"; }}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300 text-lg">
                                                            🖼
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-800 line-clamp-1">
                                                            {product.name}
                                                        </p>
                                                        {product.description && (
                                                            <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Kategori */}
                                            <td className="px-4 py-3">
                                                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-md">
                                                    {product.category || "—"}
                                                </span>
                                            </td>

                                            {/* Harga */}
                                            <td className="px-4 py-3 font-semibold text-gray-800">
                                                {formatRupiah(product.price)}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3 text-center">
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

                                            {/* Tanggal */}
                                            <td className="px-4 py-3 text-gray-500 text-xs">
                                                {formatDate(product.created_at)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => { setShowAddModal(false); setEditProduct(product); }}
                                                        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Pagination ───────────────────────────────────── */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                Menampilkan {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, pagination.totalProducts)} dari{" "}
                                {pagination.totalProducts} produk
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    ← Prev
                                </button>
                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    // Tampilkan max 5 halaman di sekitar current
                                    if (
                                        p === 1 ||
                                        p === pagination.totalPages ||
                                        (p >= page - 1 && p <= page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                                                    page === p
                                                        ? "bg-indigo-600 text-white shadow-sm"
                                                        : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    }
                                    if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="text-gray-400 text-xs px-1">…</span>;
                                    }
                                    return null;
                                })}
                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                                    disabled={page === pagination.totalPages}
                                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* ── Modal: Add Product ─────────────────────────────────────── */}
            {showAddModal && (
                <Modal title="Tambah Produk Baru" onClose={() => setShowAddModal(false)}>
                    <ProductForm
                        onSubmit={handleAdd}
                        onCancel={() => setShowAddModal(false)}
                        isLoading={formLoading}
                    />
                </Modal>
            )}

            {/* ── Modal: Edit Product ────────────────────────────────────── */}
            {editProduct && (
                <Modal
                    title="Edit Produk"
                    subtitle={`ID: #${editProduct.id} — ${editProduct.name}`}
                    onClose={() => setEditProduct(null)}
                >
                    <ProductForm
                        initialData={editProduct}
                        onSubmit={handleEdit}
                        onCancel={() => setEditProduct(null)}
                        isLoading={formLoading}
                    />
                </Modal>
            )}

            {/* ── Modal: Delete Confirmation ─────────────────────────────── */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">
                        <span className="text-5xl">🗑️</span>
                        <h3 className="font-bold text-gray-900 text-lg">Hapus Produk?</h3>
                        <p className="text-gray-500 text-sm">
                            Apakah Anda yakin ingin menghapus produk{" "}
                            <span className="font-semibold text-gray-800">"{deleteTarget.name}"</span>?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={formLoading}
                                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={formLoading}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
                            >
                                {formLoading ? "Menghapus..." : "Ya, Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminProductsPage;
