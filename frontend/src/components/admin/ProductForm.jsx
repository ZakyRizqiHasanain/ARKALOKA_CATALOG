import { useEffect, useRef, useState } from "react";
import { getCategories } from "../../services/categoryService";
import { uploadProductImage } from "../../services/productAdminService";

function ProductForm({ initialData = null, onSubmit, onCancel, isLoading = false }) {
    const isEdit = !!initialData;
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: initialData?.name || initialData?.nama_produk || "",
        price: initialData?.price ?? initialData?.harga ?? "",
        description: initialData?.description || initialData?.deskripsi || "",
        image: initialData?.image || initialData?.gambar || "",
        category_id: initialData?.category_id || initialData?.kategori_id || "",
        status: initialData?.status || "active",
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [imagePreview, setImagePreview] = useState(initialData?.image || initialData?.gambar || "/logo.png");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState("");

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => {})
            .finally(() => setLoadingCats(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (name === "image") setImagePreview(value || "/logo.png");
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        setImagePreview(localUrl);
        setUploadError("");
        setUploadingImage(true);

        try {
            const result = await uploadProductImage(file);
            setForm((prev) => ({ ...prev, image: result.url }));
            setImagePreview(result.url);
        } catch (err) {
            setUploadError(err.message || "Gagal upload gambar");
            setImagePreview(form.image || "/logo.png");
        } finally {
            setUploadingImage(false);
        }
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Nama project wajib diisi.";
        if (form.price === "" || isNaN(form.price) || parseFloat(form.price) < 0)
            e.price = "Estimasi harga harus angka dan tidak boleh negatif.";
        if (!form.category_id) e.category_id = "Kategori wajib dipilih.";
        return e;
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[#4E3A2C]">

            {/* Nama Project */}
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">
                    Nama Project <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Birthday Website Premium"
                    className={inputCls("name")}
                />
                {errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Estimasi Harga */}
            <div>
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">
                    Estimasi Biaya / Harga (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={inputCls("price")}
                />
                {errors.price && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.price}</p>}
            </div>

            {/* Kategori */}
            <div>
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">
                    Kategori Layanan <span className="text-red-500">*</span>
                </label>
                {loadingCats ? (
                    <div className="h-10 bg-[#E8CBA6]/30 rounded-xl animate-pulse" />
                ) : (
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className={inputCls("category_id")}
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nama_kategori}
                            </option>
                        ))}
                    </select>
                )}
                {errors.category_id && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.category_id}</p>}
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">Status Ketersediaan</label>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputCls("status")}
                >
                    <option value="active">Aktif (Siap Dikerjakan)</option>
                    <option value="inactive">Non-aktif (Finished / Archived)</option>
                </select>
            </div>

            {/* Gambar */}
            <div>
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">URL Gambar Project</label>
                <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/project.jpg"
                    className="w-full border border-[#E8CBA6] bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] mb-2"
                />
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="text-xs px-3 py-1.5 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {uploadingImage ? "Mengupload..." : "📁 Upload File"}
                    </button>
                    <span className="text-xs text-[#9A8F81] font-medium">atau paste URL gambar</span>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {uploadError && <p className="text-red-600 text-xs mt-1 font-semibold">{uploadError}</p>}
            </div>

            {/* Preview Gambar */}
            <div>
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">Preview Gambar</label>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#FBF7F1] border border-[#E8CBA6]">
                    <img
                        src={imagePreview || "/logo.png"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/logo.png";
                        }}
                    />
                    {uploadingImage && (
                        <div className="absolute inset-0 bg-[#FBF7F1]/80 flex items-center justify-center">
                            <span className="text-xs text-[#8C6A4A] font-bold animate-pulse">Mengupload...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#4E3A2C] mb-1">Rincian & Deskripsi Project</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tuliskan deskripsi rincian project secara lengkap..."
                    rows={4}
                    className="w-full border border-[#E8CBA6] bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] resize-none"
                />
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex gap-3 pt-1">
                <button
                    type="submit"
                    disabled={isLoading || uploadingImage}
                    className="px-6 py-2.5 bg-[#8C6A4A] hover:bg-[#4E3A2C] disabled:opacity-50 text-[#FBF7F1] font-bold text-sm rounded-xl transition-colors shadow-sm"
                >
                    {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Project"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#FBF7F1] border border-[#E8CBA6] hover:bg-[#E8CBA6]/40 text-[#4E3A2C] hover:text-[#4E3A2C] font-bold text-sm rounded-xl transition-colors"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}

export default ProductForm;
