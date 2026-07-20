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
                if (data.category_slug) {
                    getProducts({ category: data.category_slug, limit: 4 })
                        .then((r) => setRelated((r.products || []).filter((p) => p.id !== data.id).slice(0, 4)))
                        .catch(() => {});
                }
            })
            .catch((err) => setError(err.message || "Produk tidak ditemukan."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 min-h-screen animate-pulse bg-[#140D09]">
                <div className="bg-[#21150F] rounded-3xl p-8 border border-[#3D281C] grid md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-[#2C1D16] rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-6 bg-[#2C1D16] rounded w-1/4" />
                        <div className="h-10 bg-[#2C1D16] rounded w-3/4" />
                        <div className="h-8 bg-[#2C1D16] rounded w-1/3" />
                        <div className="h-3 bg-[#2C1D16] rounded" />
                        <div className="h-3 bg-[#2C1D16] rounded w-5/6" />
                        <div className="h-14 bg-[#2C1D16] rounded-2xl w-2/3 mt-6" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center min-h-screen bg-[#140D09]">
                <div className="bg-[#21150F] p-12 rounded-3xl border border-[#3D281C] shadow-lg space-y-4">
                    <span className="text-5xl">⚠️</span>
                    <h2 className="text-2xl font-bold text-[#F5E9DC]">Produk Tidak Ditemukan</h2>
                    <p className="text-red-400 text-sm">{error}</p>
                    <Link
                        to="/products"
                        className="inline-block mt-4 bg-[#B87333] hover:bg-[#A05E22] text-[#F5E9DC] font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
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
        `Halo, saya tertarik dengan produk ARKALOKA:\n\n*Nama:* ${product.nama_produk}\n*Kategori:* ${product.category}\n*Harga:* ${priceStr}\n\nApakah masih tersedia?`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;
    const imageUrl = imgError || !product.gambar
        ? "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60"
        : product.gambar;

    return (
        <div className="bg-[#140D09] min-h-screen text-[#F5E9DC]">

            {/* ── Main Detail Card ────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-8">
                <div className="bg-[#21150F] rounded-3xl border border-[#3D281C] shadow-2xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">

                        {/* Image Column */}
                        <div className="relative bg-[#140D09] aspect-square overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={product.nama_produk}
                                className="w-full h-full object-cover"
                                onError={() => setImgError(true)}
                            />
                            {product.status === "inactive" && (
                                <span className="absolute top-4 right-4 bg-red-900/90 border border-red-700 text-red-200 text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow-lg">
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
                                    className="inline-block text-xs font-bold text-[#D19A6A] uppercase tracking-widest bg-[#140D09] border border-[#3D281C] hover:bg-[#2C1D16] px-3.5 py-1.5 rounded-lg transition-colors"
                                >
                                    {product.category}
                                </Link>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F5E9DC] mt-3 leading-tight">
                                    {product.nama_produk}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className="py-4 border-t border-b border-[#3D281C]">
                                <span className="text-xs text-[#B8A08C] uppercase tracking-wider">Harga</span>
                                <p className="text-3xl font-black text-[#D19A6A] mt-1">
                                    {priceStr}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#B8A08C]">Status:</span>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                        product.status === "active"
                                            ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                                            : "bg-red-950/80 border border-red-800 text-red-300"
                                    }`}
                                >
                                    {product.status === "active" ? "✓ Tersedia" : "✗ Tidak Tersedia"}
                                </span>
                            </div>

                            {/* Description */}
                            {product.deskripsi && (
                                <div>
                                    <h3 className="font-bold text-[#D19A6A] text-xs uppercase tracking-wider mb-2">
                                        Deskripsi Produk
                                    </h3>
                                    <p className="text-[#B8A08C] text-sm leading-relaxed whitespace-pre-line">
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
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950/50 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <span className="text-xl">💬</span>
                                    <span>Hubungi via WhatsApp</span>
                                </a>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#3D281C] text-[#B8A08C] hover:text-[#F5E9DC] bg-[#140D09] hover:bg-[#2C1D16] font-semibold text-sm rounded-xl transition-colors"
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
                            <span className="text-[#D19A6A] text-xs font-semibold uppercase tracking-widest">
                                Kategori {product.category}
                            </span>
                            <h2 className="text-2xl font-extrabold text-[#F5E9DC] mt-1">
                                Produk Terkait
                            </h2>
                        </div>
                        <Link
                            to={`/categories/${product.category_slug}`}
                            className="text-sm font-bold text-[#D19A6A] hover:text-[#F5E9DC] transition-colors"
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