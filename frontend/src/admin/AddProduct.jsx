import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { createProduct } from "../services/productAdminService";

function AddProduct({ closeForm, refreshProducts }) {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // ✅ FIX: form fields match what productAdminService.createProduct() expects:
    //   name → mapped to nama_produk
    //   description → mapped to deskripsi
    //   price → mapped to harga
    //   category_id → mapped to kategori_id
    //   gambar → passed as-is
    //   status → passed as-is
    // Removed 'slug' (not in backend schema) and 'stock' (not in backend INSERT)
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        gambar: "",
        status: "active",
        category_id: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        getCategories()
            .then(data => setCategories(data))
            .catch(err => console.error("Gagal memuat kategori:", err))
            .finally(() => setLoadingCategories(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Nama produk wajib diisi.";
        if (!form.category_id) newErrors.category_id = "Kategori wajib dipilih.";
        if (form.price === "" || isNaN(form.price) || parseFloat(form.price) < 0)
            newErrors.price = "Harga harus berupa angka dan tidak boleh negatif.";
        if (form.status !== "active" && form.status !== "inactive")
            newErrors.status = "Status tidak valid.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            await createProduct(form);
            alert("Produk berhasil ditambahkan.");
            refreshProducts();
            closeForm();
        } catch (err) {
            alert(err.message || "Gagal menambahkan produk.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tambah Produk Baru</h2>
                <button
                    type="button"
                    onClick={closeForm}
                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                    title="Tutup"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Nama Produk */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama produk..."
                        className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                            errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
                        }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Harga */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Harga (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                            errors.price ? "border-red-400 bg-red-50" : "border-gray-200"
                        }`}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                {/* Kategori */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategori <span className="text-red-500">*</span>
                    </label>
                    {loadingCategories ? (
                        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                    ) : (
                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white ${
                                errors.category_id ? "border-red-400 bg-red-50" : "border-gray-200"
                            }`}
                        >
                            <option value="">-- Pilih Kategori --</option>
                            {/* ✅ FIX: uses category.nama_kategori (correct API field name) */}
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.nama_kategori}
                                </option>
                            ))}
                        </select>
                    )}
                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                        <option value="active">Aktif</option>
                        <option value="inactive">Non-aktif</option>
                    </select>
                </div>

                {/* URL Gambar */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Gambar
                    </label>
                    <input
                        type="url"
                        name="gambar"
                        value={form.gambar}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    {/* ✅ FIX: uses field name="description" (mapped to deskripsi by productAdminService) */}
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Tuliskan deskripsi produk..."
                        rows={4}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-2 flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-sm rounded-lg transition-colors duration-200"
                    >
                        {loading ? "Menyimpan..." : "Simpan Produk"}
                    </button>
                    <button
                        type="button"
                        onClick={closeForm}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-colors duration-200"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;