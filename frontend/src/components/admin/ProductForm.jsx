import { useEffect, useRef, useState } from "react";
import { getCategories } from "../../services/categoryService";
import { uploadProductImage } from "../../services/productAdminService";

function ProductForm({ initialData = null, onSubmit, onCancel, isLoading = false }) {
    const isEdit = !!initialData;
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: initialData?.name || "",
        price: initialData?.price || "",
        description: initialData?.description || "",
        image: initialData?.image || "",
        category_id: initialData?.category_id || "",
        status: initialData?.status || "active",
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [imagePreview, setImagePreview] = useState(initialData?.image || "");
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
        if (name === "image") setImagePreview(value);
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
            setImagePreview(form.image);
        } finally {
            setUploadingImage(false);
        }
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Nama produk wajib diisi.";
        if (form.price === "" || isNaN(form.price) || parseFloat(form.price) < 0)
            e.price = "Harga harus angka dan tidak boleh negatif.";
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
        `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-all bg-[#140D09] text-[#F5E9DC] placeholder-[#B8A08C]/50 ${
            errors[field] ? "border-red-500 bg-red-950/20" : "border-[#3D281C]"
        }`;

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[#F5E9DC]">

            {/* Nama Produk */}
            <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#B8A08C] mb-1">
                    Nama Produk <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Kemeja Linen Premium ARKALOKA"
                    className={inputCls("name")}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Harga */}
            <div>
                <label className="block text-sm font-semibold text-[#B8A08C] mb-1">
                    Harga (Rp) <span className="text-red-400">*</span>
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
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Kategori */}
            <div>
                <label className="block text-sm font-semibold text-[#B8A08C] mb-1">
                    Kategori <span className="text-red-400">*</span>
                </label>
                {loadingCats ? (
                    <div className="h-10 bg-[#2C1D16] rounded-xl animate-pulse" />
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
                {errors.category_id && <p className="text-red-400 text-xs mt-1">{errors.category_id}</p>}
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm font-semibold text-[#B8A08C] mb-1">Status</label>
                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputCls("status")}
                >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non-aktif</option>
                </select>
            </div>

            {/* Gambar */}
            <div>
                <label className="block text-sm font-semibold text-[#B8A08C] mb-1">Gambar</label>
                <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-[#3D281C] bg-[#140D09] text-[#F5E9DC] placeholder-[#B8A08C]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B87333] mb-2"
                />
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="text-xs px-3 py-1.5 bg-[#2C1D16] border border-[#3D281C] hover:bg-[#3D281C] text-[#F5E9DC] rounded-lg transition-colors disabled:opacity-50"
                    >
                        {uploadingImage ? "Mengupload..." : "📁 Upload File"}
                    </button>
                    <span className="text-xs text-[#B8A08C]">atau paste URL di atas</span>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
            </div>

            {/* Preview Gambar */}
            <div>
                <label className="block text-sm font-semibold text-[#B8A08C] mb-1">Preview</label>
                {imagePreview ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#140D09] border border-[#3D281C]">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = ""; setImagePreview(""); }}
                        />
                        {uploadingImage && (
                            <div className="absolute inset-0 bg-[#140D09]/80 flex items-center justify-center">
                                <span className="text-xs text-[#D19A6A] animate-pulse">Mengupload...</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full aspect-video rounded-xl bg-[#140D09] border border-dashed border-[#3D281C] flex items-center justify-center text-[#B8A08C] text-xs">
                        Belum ada gambar
                    </div>
                )}
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#B8A08C] mb-1">Deskripsi</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tuliskan deskripsi produk secara lengkap..."
                    rows={4}
                    className="w-full border border-[#3D281C] bg-[#140D09] text-[#F5E9DC] placeholder-[#B8A08C]/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B87333] resize-none"
                />
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex gap-3 pt-1">
                <button
                    type="submit"
                    disabled={isLoading || uploadingImage}
                    className="px-6 py-2.5 bg-[#B87333] hover:bg-[#A05E22] disabled:opacity-50 text-[#F5E9DC] font-semibold text-sm rounded-xl transition-colors shadow-md"
                >
                    {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#2C1D16] border border-[#3D281C] hover:bg-[#3D281C] text-[#B8A08C] hover:text-[#F5E9DC] font-semibold text-sm rounded-xl transition-colors"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}

export default ProductForm;
