import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";

// Skeleton loaders
function ProductSkeleton() {
    return (
        <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-100" />
            <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
                <div className="h-10 bg-gray-100 rounded-xl mt-2" />
            </div>
        </div>
    );
}

function CategorySkeleton() {
    return <div className="h-44 bg-gray-100 rounded-2xl animate-pulse" />;
}

function Home() {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [loadingLatest, setLoadingLatest] = useState(true);
    const [errCats, setErrCats] = useState(null);
    const [errFeatured, setErrFeatured] = useState(null);

    useEffect(() => {
        // Categories
        getCategories()
            .then(setCategories)
            .catch(() => setErrCats("Gagal memuat kategori."))
            .finally(() => setLoadingCats(false));

        // Featured (4 produk — default sort = terbaru)
        getProducts({ limit: 4 })
            .then((d) => setFeaturedProducts(d.products || []))
            .catch(() => setErrFeatured("Gagal memuat produk pilihan."))
            .finally(() => setLoadingFeatured(false));

        // Latest 8 (sorted by newest)
        getProducts({ limit: 8, sort: "" })
            .then((d) => setLatestProducts(d.products || []))
            .catch(() => {})
            .finally(() => setLoadingLatest(false));
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* ── Hero ───────────────────────────────────────────────────── */}
            <Hero />

            {/* ── Categories Section ──────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <span className="text-indigo-600 font-semibold text-xs tracking-widest uppercase">
                            Temukan Kategori Anda
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                            Pilih Kategori Produk
                        </h2>
                    </div>
                    <Link
                        to="/categories"
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                        Semua Kategori →
                    </Link>
                </div>

                {loadingCats ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {[...Array(7)].map((_, i) => <CategorySkeleton key={i} />)}
                    </div>
                ) : errCats ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600 text-sm">
                        {errCats}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">Belum ada kategori.</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {categories.slice(0, 7).map((c) => (
                            <CategoryCard key={c.id} category={c} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Featured Products Section ──────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <span className="text-indigo-600 font-semibold text-xs tracking-widest uppercase">
                            Koleksi Unggulan
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                            Produk Pilihan
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                        Lihat Semua Produk →
                    </Link>
                </div>

                {loadingFeatured ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                ) : errFeatured ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600 text-sm">
                        {errFeatured}
                    </div>
                ) : featuredProducts.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">Belum ada produk.</div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Latest Products Section ────────────────────────────────── */}
            <section className="bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <span className="text-violet-600 font-semibold text-xs tracking-widest uppercase">
                                Baru Ditambahkan
                            </span>
                            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                                Produk Terbaru
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                        >
                            Lihat Semua →
                        </Link>
                    </div>

                    {loadingLatest ? (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {latestProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA Banner ──────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl px-8 py-14 text-center shadow-2xl shadow-indigo-200">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                            🛍️ Katalog Terlengkap
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                            Temukan Semua Produk <br className="hidden sm:block" />
                            yang Anda Butuhkan
                        </h2>
                        <p className="text-indigo-100 max-w-xl mx-auto mb-8 text-base sm:text-lg">
                            Ratusan produk dari berbagai kategori tersedia. Cari, filter, dan temukan produk impian Anda sekarang.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:-translate-y-0.5"
                        >
                            Jelajahi Semua Produk
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;