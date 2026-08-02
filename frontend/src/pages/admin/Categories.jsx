import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../../services/categoryService";

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-[#FFFFFF] border border-[#E8CBA6] text-[#4E3A2C] rounded-3xl shadow-xl w-full max-w-lg my-8">
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

function CategoryFormModal({ initialData, onSubmit, onCancel, isLoading }) {
    const isEdit = !!initialData;
    const [form, setForm] = useState({
        nama_kategori: initialData?.nama_kategori || "",
        slug: initialData?.slug || "",
        gambar: initialData?.gambar || "",
    });
    const [errors, setErrors] = useState({});

    const autoSlug = (name) =>
        name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const next = { ...prev, [name]: value };
            if (name === "nama_kategori" && !isEdit) {
                next.slug = autoSlug(value);
            }
            return next;
        });
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.nama_kategori.trim()) errs.nama_kategori = "Nama kategori wajib diisi.";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        await onSubmit(form);
    };

    const inputCls = (field) =>
        `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] transition-all bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/60 ${
            errors[field] ? "border-red-500 bg-red-50" : "border-[#E8CBA6]"
        }`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-[#4E3A2C]">
            <div>
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">
                    Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="nama_kategori"
                    value={form.nama_kategori}
                    onChange={handleChange}
                    placeholder="Contoh: Web Development"
                    className={inputCls("nama_kategori")}
                />
                {errors.nama_kategori && (
                    <p className="text-red-600 text-xs mt-1 font-semibold">{errors.nama_kategori}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">Slug</label>
                <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="web-development"
                    className={inputCls("slug")}
                />
                <p className="text-xs text-[#9A8F81] mt-1 font-medium">
                    Digunakan untuk URL (otomatis terisi dari nama).
                </p>
            </div>

            <div>
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">URL Gambar</label>
                <input
                    type="url"
                    name="gambar"
                    value={form.gambar}
                    onChange={handleChange}
                    placeholder="https://example.com/kategori.jpg"
                    className={inputCls("gambar")}
                />
            </div>

            {form.gambar && (
                <div>
                    <label className="block text-xs font-bold text-[#4E3A2C] mb-1">Preview Gambar</label>
                    <div className="h-28 rounded-xl overflow-hidden bg-[#FBF7F1] border border-[#E8CBA6]">
                        <img
                            src={form.gambar || "/logo.png"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/logo.png";
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-[#8C6A4A] hover:bg-[#4E3A2C] disabled:opacity-50 text-[#FBF7F1] font-bold text-sm rounded-xl transition-colors shadow-sm"
                >
                    {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="py-2.5 px-5 bg-[#FBF7F1] border border-[#E8CBA6] text-[#4E3A2C] hover:bg-[#E8CBA6]/40 hover:text-[#4E3A2C] font-bold text-sm rounded-xl transition-colors"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}

function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const LIMIT = 8;

    const [showAddModal, setShowAddModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const loadCategories = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message || "Gagal memuat kategori.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadCategories(); }, [loadCategories]);

    useEffect(() => { setPage(1); }, [search]);

    const filtered = categories.filter(
        (c) =>
            c.nama_kategori.toLowerCase().includes(search.toLowerCase()) ||
            c.slug.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / LIMIT) || 1;
    const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

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
                        <h1 className="text-2xl font-black text-[#4E3A2C]">Manajemen Kategori</h1>
                        <p className="text-sm text-[#9A8F81] mt-0.5 font-medium">
                            {categories.length} kategori terdaftar
                        </p>
                    </div>
                    <button
                        onClick={() => { setEditCategory(null); setShowAddModal(true); }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] font-bold text-sm rounded-xl shadow-sm transition-colors"
                    >
                        <span className="text-base">+</span> Tambah Kategori
                    </button>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-sm">
                    <div className="relative w-full sm:w-80">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8F81] text-sm">🔍</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau slug kategori..."
                            className="w-full pl-10 pr-4 py-2.5 border border-[#E8CBA6] bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6A4A]"
                        />
                    </div>
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-xs text-[#8C6A4A] hover:text-[#4E3A2C] font-bold underline"
                        >
                            Reset pencarian
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Categories Cards Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-[#FFFFFF] border border-[#E8CBA6] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] p-12 text-center shadow-sm">
                        <span className="text-4xl block mb-3">🏷️</span>
                        <p className="text-[#9A8F81] font-bold">
                            {search ? "Kategori tidak ditemukan." : "Belum ada kategori. Tambahkan sekarang!"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {paginated.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm overflow-hidden hover:border-[#8C6A4A] transition-all duration-200 group flex flex-col justify-between"
                                >
                                    <div className="h-36 bg-[#FBF7F1] overflow-hidden relative">
                                        <img
                                            src={cat.gambar || "/logo.png"}
                                            alt={cat.nama_kategori}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/logo.png";
                                            }}
                                        />
                                    </div>

                                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-[#4E3A2C] text-base line-clamp-1 group-hover:text-[#8C6A4A] transition-colors">
                                                {cat.nama_kategori}
                                            </h3>
                                            <p className="text-xs text-[#9A8F81] mt-0.5 font-mono">
                                                /{cat.slug}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 pt-2 border-t border-[#E8CBA6]">
                                            <button
                                                onClick={() => setEditCategory(cat)}
                                                className="flex-1 py-1.5 text-xs font-bold text-[#4E3A2C] bg-[#FBF7F1] border border-[#E8CBA6] hover:bg-[#8C6A4A] hover:text-[#FBF7F1] rounded-lg transition-colors"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(cat)}
                                                className="flex-1 py-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-800 hover:text-white rounded-lg transition-colors"
                                            >
                                                🗑️ Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-9 h-9 text-sm font-semibold rounded-xl transition-colors ${
                                                page === p
                                                    ? "bg-[#8C6A4A] text-[#FBF7F1] shadow-sm"
                                                    : "border border-[#E8CBA6] bg-[#FBF7F1] hover:bg-[#8C6A4A] text-[#4E3A2C] hover:text-[#FBF7F1]"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

            </div>

            {/* Modals */}
            {showAddModal && (
                <Modal
                    title="Tambah Kategori Baru"
                    subtitle="Masukkan nama kategori baru"
                    onClose={() => setShowAddModal(false)}
                >
                    <CategoryFormModal
                        onSubmit={handleAdd}
                        onCancel={() => setShowAddModal(false)}
                        isLoading={formLoading}
                    />
                </Modal>
            )}

            {editCategory && (
                <Modal
                    title={`Edit Kategori — ${editCategory.nama_kategori}`}
                    subtitle="Ubah detail kategori"
                    onClose={() => setEditCategory(null)}
                >
                    <CategoryFormModal
                        initialData={editCategory}
                        onSubmit={handleEdit}
                        onCancel={() => setEditCategory(null)}
                        isLoading={formLoading}
                    />
                </Modal>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
                    <div className="bg-[#FFFFFF] border border-[#E8CBA6] text-[#4E3A2C] rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
                        <span className="text-4xl block">🗑️</span>
                        <h3 className="font-bold text-[#4E3A2C] text-lg">Hapus Kategori?</h3>
                        <p className="text-xs text-[#9A8F81]">
                            Apakah Anda yakin ingin menghapus kategori{" "}
                            <span className="font-bold text-[#4E3A2C]">"{deleteTarget.nama_kategori}"</span>?
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

export default AdminCategoriesPage;
