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
    n !== null && n !== undefined && !isNaN(n)
        ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)
        : "Belum tersedia";

const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—";

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#FFFFFF] border border-[#E8CBA6] text-[#4E3A2C] rounded-3xl shadow-xl w-full max-w-2xl my-8">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8CBA6]">
                    <div>
                        <h2 className="font-bold text-[#4E3A2C] text-lg">{title}</h2>
                        {subtitle && <p className="text-xs text-[#9A8F81] mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#9A8F81] hover:text-[#4E3A2C] text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FBF7F1] transition-colors"
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
                    <div className="h-4 bg-[#E8CBA6]/30 rounded w-3/4" />
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
            setProducts(data.products || []);
            setPagination(data.pagination || { totalProducts: 0, totalPages: 1, currentPage: 1 });
        } catch (err) {
            setError(err.message || "Gagal memuat project.");
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
            showToast("success", "Project berhasil ditambahkan!");
            setShowAddModal(false);
            loadProducts();
        } catch (err) {
            showToast("error", err.message || "Gagal menambahkan project.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEdit = async (formData) => {
        if (!editProduct) return;
        setFormLoading(true);
        try {
            await updateProduct(editProduct.id, formData);
            showToast("success", "Project berhasil diperbarui!");
            setEditProduct(null);
            loadProducts();
        } catch (err) {
            showToast("error", err.message || "Gagal mengupdate project.");
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
            showToast("error", err.message || "Gagal menghapus project.");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 text-[#4E3A2C]">

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
                        <h1 className="text-2xl font-black text-[#4E3A2C]">Manajemen Project</h1>
                        <p className="text-sm text-[#9A8F81] mt-0.5 font-medium">
                            {pagination.totalProducts} project terdaftar
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditProduct(null); setShowAddModal(true); }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] font-bold text-sm rounded-xl shadow-sm transition-colors"
                    >
                        <span className="text-base">+</span> Tambah Project
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Cari nama project..."
                                className="flex-1 border border-[#E8CBA6] bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/60 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6A4A]"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] text-sm font-bold rounded-xl transition-colors shadow-sm"
                            >
                                Cari
                            </button>
                        </form>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="border border-[#E8CBA6] rounded-xl px-4 py-2 text-sm bg-[#FBF7F1] text-[#4E3A2C] focus:outline-none focus:ring-2 focus:ring-[#8C6A4A]"
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
                            className="border border-[#E8CBA6] rounded-xl px-4 py-2 text-sm bg-[#FBF7F1] text-[#4E3A2C] focus:outline-none focus:ring-2 focus:ring-[#8C6A4A]"
                        >
                            <option value="">Terbaru</option>
                            <option value="asc">Harga: Terendah</option>
                            <option value="desc">Harga: Tertinggi</option>
                        </select>

                        {(search || categoryFilter || sort) && (
                            <button
                                onClick={() => { setSearch(""); setSearchInput(""); setCategoryFilter(""); setSort(""); }}
                                className="px-4 py-2 text-sm text-[#4E3A2C] hover:text-[#FBF7F1] border border-[#E8CBA6] bg-[#FBF7F1] hover:bg-[#8C6A4A] font-bold rounded-xl transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#FBF7F1] border-b border-[#E8CBA6] text-xs font-bold text-[#4E3A2C] uppercase tracking-wider">
                                    <th className="px-4 py-3 text-left w-10">ID</th>
                                    <th className="px-4 py-3 text-left">Project</th>
                                    <th className="px-4 py-3 text-left">Kategori</th>
                                    <th className="px-4 py-3 text-left">Estimasi Biaya</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-left">Dibuat</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8CBA6]">
                                {loading ? (
                                    [...Array(LIMIT)].map((_, i) => <SkeletonRow key={i} />)
                                ) : products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-16 text-center">
                                            <span className="text-4xl block mb-3">📦</span>
                                            <p className="text-[#9A8F81] font-bold">
                                                {search || categoryFilter
                                                    ? "Project tidak ditemukan. Coba filter lain."
                                                    : "Belum ada project. Tambahkan project pertama!"}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-[#FBF7F1]/60 transition-colors duration-100"
                                        >
                                            <td className="px-4 py-3 text-[#9A8F81] text-xs font-mono">
                                                #{product.id}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image || product.gambar || "/logo.png"}
                                                        alt={product.name || product.nama_produk || "ARKALOKA Project"}
                                                        className="w-10 h-10 object-cover rounded-lg border border-[#E8CBA6] flex-shrink-0 bg-[#FBF7F1]"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = "/logo.png";
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-bold text-[#4E3A2C] line-clamp-1">
                                                            {product.name || product.nama_produk}
                                                        </p>
                                                        {(product.description || product.deskripsi) && (
                                                            <p className="text-xs text-[#9A8F81] line-clamp-1 mt-0.5">
                                                                {product.description || product.deskripsi}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="inline-block bg-[#FBF7F1] border border-[#E8CBA6] text-[#8C6A4A] text-xs font-bold px-2 py-1 rounded-md">
                                                    {product.category || product.kategori || "—"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 font-bold text-[#8C6A4A]">
                                                {formatRupiah(product.price ?? product.harga)}
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                                                        product.status === "active"
                                                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                                            : "bg-red-50 border border-red-200 text-red-800"
                                                    }`}
                                                >
                                                    {product.status === "active" ? "Aktif" : "Non-aktif"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-[#9A8F81] text-xs font-medium">
                                                {formatDate(product.created_at)}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => { setShowAddModal(false); setEditProduct(product); }}
                                                        className="px-3 py-1.5 text-xs font-bold text-[#4E3A2C] bg-[#FBF7F1] border border-[#E8CBA6] hover:bg-[#8C6A4A] hover:text-[#FBF7F1] rounded-lg transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget({ id: product.id, name: product.name || product.nama_produk })}
                                                        className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-800 hover:text-white rounded-lg transition-colors"
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
                        <div className="px-6 py-4 border-t border-[#E8CBA6] flex items-center justify-between">
                            <p className="text-xs text-[#9A8F81] font-medium">
                                Menampilkan {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, pagination.totalProducts)} dari{" "}
                                {pagination.totalProducts} project
                            </p>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 text-xs font-bold border border-[#E8CBA6] bg-[#FBF7F1] text-[#4E3A2C] hover:bg-[#8C6A4A] hover:text-[#FBF7F1] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
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
                                                        ? "bg-[#8C6A4A] text-[#FBF7F1] shadow-sm"
                                                        : "border border-[#E8CBA6] bg-[#FBF7F1] text-[#4E3A2C] hover:bg-[#8C6A4A] hover:text-[#FBF7F1]"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    }
                                    if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="text-[#9A8F81] text-xs px-1">…</span>;
                                    }
                                    return null;
                                })}
                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                                    disabled={page === pagination.totalPages}
                                    className="px-3 py-1.5 text-xs font-bold border border-[#E8CBA6] bg-[#FBF7F1] text-[#4E3A2C] hover:bg-[#8C6A4A] hover:text-[#FBF7F1] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
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
                    title="Tambah Project Baru"
                    subtitle="Isi formulir di bawah ini untuk menambahkan project ke katalog ARKALOKA"
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
                    title={`Edit Project — #${editProduct.id}`}
                    subtitle={`Mengubah data "${editProduct.name || editProduct.nama_produk}"`}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
                    <div className="bg-[#FFFFFF] border border-[#E8CBA6] text-[#4E3A2C] rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
                        <span className="text-4xl block">🗑️</span>
                        <h3 className="font-bold text-[#4E3A2C] text-lg">Hapus Project?</h3>
                        <p className="text-xs text-[#9A8F81]">
                            Apakah Anda yakin ingin menghapus{" "}
                            <span className="font-bold text-[#4E3A2C]">"{deleteTarget.name}"</span>? Action ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={formLoading}
                                className="flex-1 py-2.5 bg-[#FBF7F1] border border-[#E8CBA6] text-[#4E3A2C] hover:bg-[#E8CBA6]/40 hover:text-[#4E3A2C] font-bold text-sm rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={formLoading}
                                className="flex-1 py-2.5 bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors"
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
