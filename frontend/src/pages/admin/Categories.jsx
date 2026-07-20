import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../services/categoryService";

// ── Auto-generate slug dari nama ──────────────────────────────────────────
function toSlug(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

// ── Toast Notification ────────────────────────────────────────────────────
function Toast({ toast }) {
    if (!toast) return null;
    return (
        <div
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all duration-300 ${
                toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
        >
            {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
    );
}

// ── Category Form Modal ───────────────────────────────────────────────────
function CategoryModal({ initial, onSubmit, onClose, isLoading }) {
    const isEdit = !!initial;

    const [form, setForm] = useState({
        nama_kategori: initial?.nama_kategori || "",
        slug: initial?.slug || "",
        gambar: initial?.gambar || "",
    });
    const [errors, setErrors] = useState({});
    const [slugManual, setSlugManual] = useState(isEdit); // edit mode: slug tidak auto-generate

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const next = { ...prev, [name]: value };
            // Auto-generate slug dari nama (hanya jika bukan mode manual / edit)
            if (name === "nama_kategori" && !slugManual) {
                next.slug = toSlug(value);
            }
            return next;
        });
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSlugChange = (e) => {
        setSlugManual(true);
        setForm((prev) => ({ ...prev, slug: e.target.value }));
        if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.nama_kategori.trim()) e.nama_kategori = "Nama kategori wajib diisi.";
        if (!form.slug.trim()) e.slug = "Slug wajib diisi.";
        else if (!/^[a-z0-9-]+$/.test(form.slug.trim()))
            e.slug = "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-).";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        await onSubmit({ ...form, slug: form.slug.trim(), nama_kategori: form.nama_kategori.trim() });
    };

    const inputCls = (field) =>
        `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            errors[field] ? "border-red-400 bg-red-50" : "border-gray-200"
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg">
                            {isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
                        </h2>
                        {isEdit && (
                            <p className="text-xs text-gray-400 mt-0.5">ID: #{initial.id}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">

                    {/* Nama Kategori */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Kategori <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="nama_kategori"
                            value={form.nama_kategori}
                            onChange={handleChange}
                            placeholder="Contoh: Elektronik"
                            className={inputCls("nama_kategori")}
                            autoFocus
                        />
                        {errors.nama_kategori && (
                            <p className="text-red-500 text-xs mt-1">{errors.nama_kategori}</p>
                        )}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Slug <span className="text-red-500">*</span>
                            {!isEdit && (
                                <span className="ml-2 text-xs text-gray-400 font-normal">
                                    (auto-generated dari nama)
                                </span>
                            )}
                        </label>
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleSlugChange}
                            placeholder="contoh: elektronik"
                            className={inputCls("slug")}
                        />
                        {errors.slug && (
                            <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Digunakan sebagai URL: <code className="bg-gray-100 px-1 rounded">/category/{form.slug || "..."}</code>
                        </p>
                    </div>

                    {/* Gambar URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL Gambar
                            <span className="ml-2 text-xs text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <input
                            type="url"
                            name="gambar"
                            value={form.gambar}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {/* Preview gambar */}
                        {form.gambar && (
                            <div className="mt-2 w-full h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                <img
                                    src={form.gambar}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors"
                        >
                            {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-36 bg-gray-100" />
            <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────
const LIMIT = 8;

function AdminCategoriesPage() {
    const [allCategories, setAllCategories] = useState([]);   // semua data (filter client-side)
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    // ── Toast helper ──────────────────────────────────────────────────────
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Fetch all categories ──────────────────────────────────────────────
    const loadCategories = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getCategories();
            setAllCategories(data);
        } catch (err) {
            setError(err.message || "Gagal memuat kategori.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadCategories(); }, [loadCategories]);

    // Reset page saat search berubah
    useEffect(() => { setPage(1); }, [search]);

    // ── Client-side filter & pagination ──────────────────────────────────
    const filtered = allCategories.filter((c) =>
        c.nama_kategori.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / LIMIT));
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

    // ── Add ───────────────────────────────────────────────────────────────
    const handleAdd = async (formData) => {
        setFormLoading(true);
        try {
            await createCategory(formData);
            showToast("success", "Kategori berhasil ditambahkan!");
            setShowAddModal(false);
            loadCategories();
        } catch (err) {
            showToast("error", err.message || "Gagal menambahkan kategori.");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Edit ──────────────────────────────────────────────────────────────
    const handleEdit = async (formData) => {
        if (!editCategory) return;
        setFormLoading(true);
        try {
            await updateCategory(editCategory.id, formData);
            showToast("success", "Kategori berhasil diperbarui!");
            setEditCategory(null);
            loadCategories();
        } catch (err) {
            showToast("error", err.message || "Gagal mengupdate kategori.");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setFormLoading(true);
        try {
            await deleteCategory(deleteTarget.id);
            showToast("success", `Kategori "${deleteTarget.nama_kategori}" berhasil dihapus.`);
            setDeleteTarget(null);
            loadCategories();
        } catch (err) {
            showToast("error", err.message || "Gagal menghapus kategori.");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <AdminLayout>
            <div className="space-y-6">
                <Toast toast={toast} />

                {/* ── Page Header ───────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Manajemen Kategori</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {allCategories.length} kategori terdaftar
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditCategory(null); setShowAddModal(true); }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
                    >
                        <span className="text-base">+</span> Tambah Kategori
                    </button>
                </div>

                {/* ── Search Bar ────────────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau slug kategori..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                    {search && (
                        <p className="text-xs text-gray-400 mt-2 px-1">
                            Menampilkan {filtered.length} hasil untuk "{search}"
                        </p>
                    )}
                </div>

                {/* ── Error Banner ──────────────────────────────────────── */}
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-5 py-3 text-sm flex items-center justify-between">
                        <span>⚠️ {error}</span>
                        <button
                            onClick={loadCategories}
                            className="text-red-600 underline text-xs font-medium ml-4"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* ── Category Grid ─────────────────────────────────────── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <span className="text-4xl block mb-3">🏷️</span>
                        <p className="font-semibold text-gray-700">
                            {search ? "Kategori tidak ditemukan." : "Belum ada kategori."}
                        </p>
                        {!search && (
                            <p className="text-sm text-gray-400 mt-1">
                                Klik "Tambah Kategori" untuk membuat kategori pertama.
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {paginated.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group"
                                >
                                    {/* Gambar */}
                                    <div className="h-36 bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden">
                                        {cat.gambar ? (
                                            <img
                                                src={cat.gambar}
                                                alt={cat.nama_kategori}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl text-indigo-200">
                                                🏷️
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 truncate">
                                            {cat.nama_kategori}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">
                                            /{cat.slug}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => {
                                                    setShowAddModal(false);
                                                    setEditCategory(cat);
                                                }}
                                                className="flex-1 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(cat)}
                                                className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Pagination ───────────────────────────────── */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
                                <p className="text-xs text-gray-400">
                                    Halaman {page} dari {totalPages} ({filtered.length} kategori)
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 rounded-lg transition-colors"
                                    >
                                        ← Prev
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
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
                                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={page === totalPages}
                                        className="px-3 py-1.5 text-xs font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 rounded-lg transition-colors"
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Modal: Add Category ────────────────────────────────────── */}
            {showAddModal && (
                <CategoryModal
                    onSubmit={handleAdd}
                    onClose={() => setShowAddModal(false)}
                    isLoading={formLoading}
                />
            )}

            {/* ── Modal: Edit Category ───────────────────────────────────── */}
            {editCategory && (
                <CategoryModal
                    initial={editCategory}
                    onSubmit={handleEdit}
                    onClose={() => setEditCategory(null)}
                    isLoading={formLoading}
                />
            )}

            {/* ── Modal: Delete Confirmation ─────────────────────────────── */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">
                        <span className="text-5xl">⚠️</span>
                        <h3 className="font-bold text-gray-900 text-lg">Hapus Kategori?</h3>
                        <p className="text-gray-500 text-sm">
                            Menghapus kategori{" "}
                            <span className="font-semibold text-gray-800">
                                "{deleteTarget.nama_kategori}"
                            </span>{" "}
                            dapat mempengaruhi produk yang menggunakan kategori ini.
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

export default AdminCategoriesPage;
