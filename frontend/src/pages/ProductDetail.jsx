import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        getProductById(id)
            .then(data => {
                setProduct(data);
                setError(null);
            })
            .catch(err => {
                console.error("Error detail:", err);
                setError(err.message || "Produk tidak ditemukan atau tidak aktif.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-16 animate-pulse space-y-8 min-h-screen">
                <div className="flex items-center space-x-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 rounded-3xl h-[450px]"></div>
                    <div className="space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-3 pt-4">
                            <div className="h-3.5 bg-gray-200 rounded"></div>
                            <div className="h-3.5 bg-gray-200 rounded"></div>
                            <div className="h-3.5 bg-gray-200 rounded w-5/6"></div>
                        </div>
                        <div className="h-12 bg-gray-200 rounded-xl w-1/2 pt-6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center min-h-screen">
                <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <span className="text-5xl">⚠️</span>
                    <h2 className="text-2xl font-bold text-slate-800">Detail Produk Error</h2>
                    <p className="text-red-500">{error || "Produk tidak dapat dimuat."}</p>
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
    const productPriceStr = formatRupiah(product.harga);
    const whatsappMessage = encodeURIComponent(
        `Halo, saya tertarik dengan produk di katalog Anda:\n\n*Nama:* ${product.nama_produk}\n*Kategori:* ${product.category}\n*Harga:* ${productPriceStr}\n\nApakah produk ini masih tersedia?`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    const imageUrl = product.gambar || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=60";

    return (
        <section className="max-w-6xl mx-auto px-6 py-10 md:py-16 min-h-screen bg-slate-50">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                <span>&rarr;</span>
                <Link to="/products" className="hover:text-indigo-600 transition-colors">Katalog</Link>
                <span>&rarr;</span>
                <Link to={`/products?category=${product.category_slug}`} className="hover:text-indigo-600 transition-colors">
                    {product.category}
                </Link>
                <span>&rarr;</span>
                <span className="text-gray-800 font-medium line-clamp-1">{product.nama_produk}</span>
            </div>

            {/* Main detail content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
                    
                    {/* Image Column */}
                    <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square border border-gray-100">
                        <img
                            src={imageUrl}
                            alt={product.nama_produk}
                            className="w-full h-full object-cover"
                        />
                        {product.status === "inactive" && (
                            <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase shadow">
                                Non-aktif (Preview)
                            </span>
                        )}
                    </div>

                    {/* Info Column */}
                    <div className="space-y-6">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md">
                                {product.category}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight leading-tight">
                                {product.nama_produk}
                            </h1>
                        </div>

                        <div className="border-t border-b border-gray-100 py-4">
                            <span className="text-gray-400 text-sm">Harga</span>
                            <p className="text-3xl font-black text-indigo-600 mt-1">
                                {productPriceStr}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Deskripsi</h3>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                {product.deskripsi || "Tidak ada deskripsi rinci untuk produk ini."}
                            </p>
                        </div>

                        {/* Call to Action WhatsApp */}
                        <div className="pt-6">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                <span className="text-xl">💬</span>
                                <span>Hubungi via WhatsApp</span>
                            </a>
                            <p className="text-xs text-gray-400 mt-2.5 italic">
                                *Anda akan diarahkan langsung ke chat WhatsApp admin kami untuk negosiasi atau info produk lebih lanjut.
                            </p>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

export default ProductDetail;