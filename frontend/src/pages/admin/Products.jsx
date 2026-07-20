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

const formatRupiah = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#21150F] border border-[#3D281C] text-[#F5E9DC] rounded-3xl shadow-2xl w-full max-w-2xl my-8">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#3D281C]">
                    <div>
                        <h2 className="font-bold text-[#F5E9DC] text-lg">{title}</h2>
                        {subtitle && <p className="text-xs text-[#B8A08C] mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#B8A08C] hover:text-[#F5E9DC] text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2C1D16] transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            {[...Array(7)].map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <div className="h-4 bg-[#2C1D16] rounded w-3/4" />
                </td>
            ))}
        </tr>
    );
}

function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ totalProducts: 0, totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const LIMIT = 8;

    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

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

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => {});
    }, []);

    useEffect(() => { setPage(1); }, [search, categoryFilter, sort]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(searchInput);
    };

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

    return (
        <AdminLayout>
            <div className="space-y-6 text-[#F5E9DC]">

                {toast && (
                    <div
                        className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all duration-300 ${
                            toast.type === "success"
                                ? "bg-emerald-800 text-white border border-emerald-600"
                                : "bg-red-800 text-white border border-red-600"
                        }`}
                    >
                        {toast.type === "success" ? "✅" : "❌"} {toast.message}
                    </div>
                )}

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-black text-[#F5E9DC]">Manajemen Produk</h1>
                        <p className="text-sm text-[#B8A08C] mt-0.5">
                            {pagination.totalProducts} produk terdaftar
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditProduct(null); setShowAddModal(true); }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B87333] hover:bg-[#A05E22] text-[#F5E9DC] font-semibold text-sm rounded-xl shadow-md transition-colors"
                    >
                        <span className="text-base">+</span> Tambah Produk
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-[#21150F] rounded-2xl border border-[#3D281C] shadow-md p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari nama produk..."
                                className="flex-1 border border-[#3D281C] bg-[#140D09] text-[#F5E9DC] placeholder-[#B8A08C]/50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#B87333] hover:bg-[#A05E22] text-[#F5E9DC] text-sm font-semibold rounded-xl transition-colors"
                            >
                                Cari
                            </button>
                        </form>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-[#3D281C] rounded-xl px-4 py-2 text-sm bg-[#140D09] text-[#F5E9DC] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.slug}>
                                    {c.nama_kategori}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="border border-[#3D281C] rounded-xl px-4 py-2 text-sm bg-[#140D09] text-[#F5E9DC] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                        >
                            <option value="">Terbaru</option>
                            <option value="asc">Harga: Terendah</option>
                            <option value="desc">Harga: Tertinggi</option>
                        </select>

                        {(search || categoryFilter || sort) && (
                            <button
                                onClick={() => { setSearch(""); setSearchInput(""); setCategoryFilter(""); setSort(""); }}
                                className="px-4 py-2 text-sm text-[#B8A08C] hover:text-[#F5E9DC] border border-[#3D281C] bg-[#140D09] rounded-xl hover:bg-[#2C1D16] transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-950/40 border border-red-800/50 text-red-300 rounded-xl px-5 py-3 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-[#21150F] rounded-2xl border border-[#3D281C] shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#140D09] border-b border-[#3D281C] text-xs font-semibold text-[#B8A08C] uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left w-10">ID</th>
                                    <th className="px-4 py-3 text-left">Produk</th>
                                    <th className="px-4 py-3 text-left">Kategori</th>
                                    <th className="px-4 py-3 text-left">Harga</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-left">Dibuat</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#3D281C]">
                                {loading ? (
                                    [...Array(LIMIT)].map((_, i) => <SkeletonRow key={i} />)
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <span className="text-4xl block mb-3">📦</span>
                                            <p className="text-[#B8A08C] font-medium">
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
                                            className="hover:bg-[#2C1D16] transition-colors duration-100"
                                        >
                                            <td className="px-4 py-3 text-[#B8A08C] text-xs font-mono">
                                                #{product.id}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded-lg border border-[#3D281C] flex-shrink-0"
                                                            onError={(e) => { e.target.style.display = "none"; }}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-[#140D09] border border-[#3D281C] rounded-lg flex-shrink-0 flex items-center justify-center text-[#B8A08C] text-lg">
                                                            🖼
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-[#F5E9DC] line-clamp-1">
                                                            {product.name}
                                                        </p>
                                                        {product.description && (
                                                            <p className="text-xs text-[#B8A08C] line-clamp-1 mt-0.5">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="inline-block bg-[#140D09] border border-[#3D281C] text-[#D19A6A] text-xs font-semibold px-2 py-1 rounded-md">
                                                    {product.category || "—"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 font-semibold text-[#D19A6A]">
                                                {formatRupiah(product.price)}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        product.status === "active"
                                                            ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                                                            : "bg-red-950/80 border border-red-800 text-red-300"
                                                    }`}
                                                >
                                                    {product.status === "active" ? "Aktif" : "Non-aktif"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-[#B8A08C] text-xs">
                                                {formatDate(product.created_at)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => { setShowAddModal(false); setEditProduct(product); }}
                                                        className="px-3 py-1.5 text-xs font-semibold text-[#D19A6A] bg-[#140D09] border border-[#3D281C] hover:bg-[#2C1D16] rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget({ id: product.id, name: product.name })}
                                                        className="px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-950/40 border border-red-800/40 hover:bg-red-900/60 rounded-lg transition-colors"
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

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-[#3D281C] flex items-center justify-between">
                            <p className="text-xs text-[#B8A08C]">
                                Menampilkan {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, pagination.totalProducts)} dari{" "}
                                {pagination.totalProducts} produk
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 text-xs font-semibold border border-[#3D281C] bg-[#140D09] text-[#B8A08C] hover:text-[#F5E9DC] hover:bg-[#2C1D16] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    ← Prev
                                </button>
                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const p = i + 1;
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
                                                        ? "bg-[#B87333] text-[#F5E9DC] shadow-sm"
                                                        : "border border-[#3D281C] bg-[#140D09] text-[#B8A08C] hover:bg-[#2C1D16] hover:text-[#F5E9DC]"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    }
                                    if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="text-[#B8A08C] text-xs px-1">…</span>;
                                    }
                                    return null;
                                })}
                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                                    disabled={page === pagination.totalPages}
                                    className="px-3 py-1.5 text-xs font-semibold border border-[#3D281C] bg-[#140D09] text-[#B8A08C] hover:text-[#F5E9DC] hover:bg-[#2C1D16] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Modals */}
            {showAddModal && (
                <Modal
                    title="Tambah Produk Baru"
                    subtitle="Isi formulir di bawah ini untuk menambahkan produk ke katalog ARKALOKA"
                    onClose={() => setShowAddModal(false)}
                >
                    <ProductForm
                        onSubmit={handleAdd}
                        onCancel={() => setShowAddModal(false)}
                        isLoading={formLoading}
                    />
                </Modal>
            )}

            {editProduct && (
                <Modal
                    title={`Edit Produk — #${editProduct.id}`}
                    subtitle={`Mengubah data "${editProduct.name}"`}
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

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                    <div className="bg-[#21150F] border border-[#3D281C] text-[#F5E9DC] rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
                        <span className="text-4xl block">🗑️</span>
                        <h3 className="font-bold text-[#F5E9DC] text-lg">Hapus Produk?</h3>
                        <p className="text-xs text-[#B8A08C]">
                            Apakah Anda yakin ingin menghapus{" "}
                            <span className="font-semibold text-[#F5E9DC]">"{deleteTarget.name}"</span>? Action ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={formLoading}
                                className="flex-1 py-2.5 bg-[#140D09] border border-[#3D281C] text-[#B8A08C] hover:text-[#F5E9DC] font-semibold text-sm rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={formLoading}
                                className="flex-1 py-2.5 bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors"
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
