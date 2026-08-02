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
            .catch((err) => setError(err.message || "Project tidak ditemukan."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 min-h-screen animate-pulse bg-[#FBF7F1]">
                <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#E8CBA6] grid md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-[#E8CBA6]/30 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-6 bg-[#E8CBA6]/30 rounded w-1/4" />
                        <div className="h-10 bg-[#E8CBA6]/30 rounded w-3/4" />
                        <div className="h-8 bg-[#E8CBA6]/30 rounded w-1/3" />
                        <div className="h-3 bg-[#E8CBA6]/30 rounded" />
                        <div className="h-3 bg-[#E8CBA6]/30 rounded w-5/6" />
                        <div className="h-14 bg-[#E8CBA6]/30 rounded-2xl w-2/3 mt-6" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center min-h-screen bg-[#FBF7F1]">
                <div className="bg-[#FFFFFF] p-12 rounded-3xl border border-[#E8CBA6] shadow-sm space-y-4">
                    <span className="text-5xl">⚠️</span>
                    <h2 className="text-2xl font-bold text-[#4E3A2C]">Project Tidak Ditemukan</h2>
                    <p className="text-red-700 text-sm">{error}</p>
                    <Link
                        to="/products"
                        className="inline-block mt-4 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
                    >
                        Kembali ke Project Showcase
                    </Link>
                </div>
            </div>
        );
    }

    const whatsappNumber = "62895704438010";
    const priceStr = product.harga ? formatRupiah(product.harga) : "Custom Pricing";
    const whatsappMsg = encodeURIComponent(
        `Halo ARKALOKA, saya ingin konsultasi mengenai project website: ${product.nama_produk}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;
    const imageUrl = imgError || !product.gambar ? "/logo.png" : product.gambar;

    return (
        <div className="bg-[#FBF7F1] min-h-screen text-[#4E3A2C]">

            {/* ── Main Detail Card ────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-8">
                <div className="bg-[#FFFFFF] rounded-3xl border border-[#E8CBA6] shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">

                        {/* Image Column */}
                        <div className="relative bg-[#FBF7F1] aspect-square overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={product.nama_produk || "ARKALOKA Project"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/logo.png";
                                    setImgError(true);
                                }}
                            />
                            {product.status === "inactive" && (
                                <span className="absolute top-4 right-4 bg-red-800 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow-lg">
                                    Selesai / Archived
                                </span>
                            )}
                        </div>

                        {/* Info Column */}
                        <div className="p-8 md:p-12 flex flex-col gap-6">

                            {/* Category + Name */}
                            <div>
                                <Link
                                    to={`/categories/${product.category_slug}`}
                                    className="inline-block text-xs font-bold text-[#4E3A2C] uppercase tracking-widest bg-[#C79E72] hover:bg-[#8C6A4A] hover:text-[#FBF7F1] px-3.5 py-1.5 rounded-lg transition-colors border border-[#E8CBA6]"
                                >
                                    Kategori Layanan: {product.category}
                                </Link>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#4E3A2C] mt-3 leading-tight">
                                    {product.nama_produk}
                                </h1>
                            </div>

                            {/* Estimation Price */}
                            <div className="py-4 border-t border-b border-[#E8CBA6]">
                                <span className="text-xs text-[#9A8F81] uppercase tracking-wider font-semibold">Estimasi Biaya</span>
                                <p className="text-3xl font-black text-[#8C6A4A] mt-1">
                                    {priceStr}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#9A8F81] font-semibold">Status Ketersediaan:</span>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                        product.status === "active"
                                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                            : "bg-red-50 border border-red-200 text-red-800"
                                    }`}
                                >
                                    {product.status === "active" ? "✓ Siap Dikerjakan" : "✗ Kuota Penuh"}
                                </span>
                            </div>

                            {/* Description */}
                            {product.deskripsi && (
                                <div>
                                    <h3 className="font-bold text-[#4E3A2C] text-xs uppercase tracking-wider mb-2">
                                        Rincian & Deskripsi Project
                                    </h3>
                                    <p className="text-[#9A8F81] text-sm leading-relaxed whitespace-pre-line">
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
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] font-bold rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <span className="text-xl">💬</span>
                                    <span>Hubungi Kami via WhatsApp</span>
                                </a>
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E8CBA6] text-[#4E3A2C] hover:text-[#4E3A2C] bg-[#FBF7F1] hover:bg-[#E8CBA6]/40 font-semibold text-sm rounded-xl transition-colors text-center"
                                >
                                    ← Kembali ke Project Showcase
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Related Projects ─────────────────────────────────────── */}
            {related.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 py-10 pb-20">
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <span className="text-[#9A8F81] text-xs font-bold uppercase tracking-widest">
                                Layanan {product.category}
                            </span>
                            <h2 className="text-2xl font-extrabold text-[#4E3A2C] mt-1">
                                Project Terkait
                            </h2>
                        </div>
                        <Link
                            to={`/categories/${product.category_slug}`}
                            className="text-sm font-bold text-[#8C6A4A] hover:text-[#4E3A2C] transition-colors"
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