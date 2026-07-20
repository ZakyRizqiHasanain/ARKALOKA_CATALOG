import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const formatRupiah = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setImgError(false);
        window.scrollTo(0, 0);

        getProductById(id)
            .then((data) => {
                setProduct(data);
                // Fetch produk terkait (same category, exclude current)
                if (data.category_slug) {
                    getProducts({ category: data.category_slug, limit: 4 })
                        .then((r) => setRelated((r.products || []).filter((p) => p.id !== data.id).slice(0, 4)))
                        .catch(() => {});
                }
            })
            .catch((err) => setError(err.message || "Produk tidak ditemukan."))
            .finally(() => setLoading(false));
    }, [id]);

    // ── Loading State ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 min-h-screen animate-pulse bg-slate-50">
                <div className="flex gap-2 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded w-20" />
                    ))}
                </div>
                <div className="bg-white rounded-3xl p-8 grid md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                        <div className="h-10 bg-gray-200 rounded w-3/4" />
                        <div className="h-8 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                        <div className="h-3 bg-gray-200 rounded w-4/6" />
                        <div className="h-14 bg-gray-200 rounded-2xl w-2/3 mt-6" />
                    </div>
                </div>
            </div>
        );
    }

    // ── Error State ──────────────────────────────────────────────────────
    if (error || !product) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center min-h-screen bg-slate-50">
                <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <span className="text-5xl">⚠️</span>
                    <h2 className="text-2xl font-bold text-slate-800">Produk Tidak Ditemukan</h2>
                    <p className="text-red-500 text-sm">{error}</p>
                    <Link
                        to="/products"
                        className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
                    >
                        Kembali ke Katalog
                    </Link>
                </div>
            </div>
        );
    }

    const whatsappNumber = "6281234567890";
    const priceStr = formatRupiah(product.harga);
    const whatsappMsg = encodeURIComponent(
        `Halo, saya tertarik dengan produk:\n\n*Nama:* ${product.nama_produk}\n*Kategori:* ${product.category}\n*Harga:* ${priceStr}\n\nApakah masih tersedia?`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;
    const imageUrl = imgError || !product.gambar
        ? "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60"
        : product.gambar;

    return (
        <div className="bg-slate-50 min-h-screen">

            {/* ── Main Detail Card ────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">

                        {/* Image Column */}
                        <div className="relative bg-gray-50 aspect-square overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={product.nama_produk}
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                            {product.status === "inactive" && (
                                <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow-lg">
                                    Non-aktif
                                </span>
                            )}
                        </div>

                        {/* Info Column */}
                        <div className="p-8 md:p-12 flex flex-col gap-6">

                            {/* Category + Name */}
                            <div>
                                <Link
                                    to={`/categories/${product.category_slug}`}
                                    className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors"
                                >
                                    {product.category}
                                </Link>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 leading-tight">
                                    {product.nama_produk}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className="py-4 border-t border-b border-gray-100">
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Harga</span>
                                <p className="text-3xl font-black text-indigo-600 mt-1">
                                    {priceStr}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Status:</span>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                        product.status === "active"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-red-100 text-red-600"
                                    }`}
                                >
                                    {product.status === "active" ? "✓ Tersedia" : "✗ Tidak Tersedia"}
                                </span>
                            </div>

                            {/* Description */}
                            {product.deskripsi && (
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2">
                                        Deskripsi Produk
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {product.deskripsi}
                                    </p>
                                </div>
                            )}

                            {/* CTA */}
                            <div className="mt-auto pt-4 flex flex-col gap-3">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <span className="text-xl">💬</span>
                                    <span>Hubungi via WhatsApp</span>
                                </a>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    ← Kembali ke Katalog
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Related Products ─────────────────────────────────────── */}
            {related.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 py-10 pb-20">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <span className="text-indigo-600 text-xs font-semibold uppercase tracking-widest">
                                Kategori {product.category}
                            </span>
                            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                                Produk Terkait
                            </h2>
                        </div>
                        <Link
                            to={`/categories/${product.category_slug}`}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            Lihat Semua →
                        </Link>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {related.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ProductDetail;