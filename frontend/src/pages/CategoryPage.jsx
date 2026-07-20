import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

function ProductSkeleton() {
    return (
        <div className="flex flex-col bg-[#21150F] rounded-2xl border border-[#3D281C] shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-[#2C1D16]" />
            <div className="p-5 space-y-3">
                <div className="h-5 bg-[#2C1D16] rounded w-3/4" />
                <div className="h-4 bg-[#2C1D16] rounded w-1/3" />
                <div className="h-3 bg-[#2C1D16] rounded w-full" />
                <div className="h-10 bg-[#2C1D16] rounded-xl mt-2" />
            </div>
        </div>
    );
}

function CategoryPage() {
    const { slug } = useParams();

    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [pagination, setPagination] = useState({ totalProducts: 0, totalPages: 1, currentPage: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const LIMIT = 12;

    useEffect(() => {
        getCategories()
            .then((cats) => {
                const found = cats.find((c) => c.slug === slug);
                setCategoryName(found?.nama_kategori || slug);
            })
            .catch(() => {});
    }, [slug]);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getProducts({ category: slug, sort, page, limit: LIMIT })
            .then((d) => {
                setProducts(d.products || []);
                setPagination(d.pagination || { totalProducts: 0, totalPages: 1, currentPage: 1 });
            })
            .catch(() => setError("Gagal memuat produk. Coba lagi."))
            .finally(() => setLoading(false));
    }, [slug, sort, page]);

    useEffect(() => { setPage(1); }, [slug, sort]);

    return (
        <div className="bg-[#140D09] min-h-screen text-[#F5E9DC]">

            {/* ── Category Banner Header ───────────────────────────────── */}
            <div className="bg-gradient-to-br from-[#21150F] via-[#2C1D16] to-[#140D09] border-b border-[#3D281C] text-[#F5E9DC]">
                <div className="max-w-7xl mx-auto px-6 py-14 text-center">
                    <span className="inline-flex items-center gap-2 bg-[#140D09]/80 border border-[#3D281C] text-[#D19A6A] text-xs font-semibold px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
                        <img
                            src="/logo.png"
                            alt="ARKALOKA Logo"
                            className="w-3.5 h-3.5 object-contain"
                        />
                        Kategori ARKALOKA
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black mb-2">
                        {categoryName || "Memuat..."}
                    </h1>
                    {!loading && (
                        <p className="text-[#B8A08C] text-sm mt-2">
                            {pagination.totalProducts} produk tersedia dalam kategori ini
                        </p>
                    )}
                </div>
            </div>

            {/* ── Content ──────────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Sort */}
                <div className="flex justify-end mb-8">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="border border-[#3D281C] rounded-xl px-4 py-2 text-sm bg-[#21150F] text-[#F5E9DC] focus:outline-none focus:ring-2 focus:ring-[#B87333]"
                    >
                        <option value="">Terbaru</option>
                        <option value="asc">Harga: Terendah</option>
                        <option value="desc">Harga: Tertinggi</option>
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-8 text-center text-red-400">
                        <span className="text-3xl block mb-2">⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-20 space-y-4">
                        <span className="text-5xl">📦</span>
                        <h3 className="text-xl font-bold text-[#F5E9DC]">Belum ada produk</h3>
                        <p className="text-[#B8A08C] text-sm">
                            Kategori ini belum memiliki produk aktif.
                        </p>
                        <Link
                            to="/products"
                            className="inline-block mt-2 px-6 py-3 bg-[#B87333] hover:bg-[#A05E22] text-[#F5E9DC] font-semibold rounded-xl transition-colors"
                        >
                            Lihat Semua Produk
                        </Link>
                    </div>
                )}

                {/* Product grid */}
                {!loading && !error && products.length > 0 && (
                    <>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-sm font-semibold border border-[#3D281C] bg-[#21150F] text-[#B8A08C] hover:text-[#F5E9DC] rounded-xl disabled:opacity-40 transition-colors"
                                >
                                    ← Sebelumnya
                                </button>

                                {[...Array(pagination.totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    if (p === 1 || p === pagination.totalPages || (p >= page - 1 && p <= page + 1)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-9 h-9 text-sm font-semibold rounded-xl transition-colors ${
                                                    page === p
                                                        ? "bg-[#B87333] text-[#F5E9DC] shadow-sm"
                                                        : "border border-[#3D281C] bg-[#21150F] text-[#B8A08C] hover:bg-[#2C1D16] hover:text-[#F5E9DC]"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    }
                                    if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="text-[#B8A08C] text-xs">…</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                                    disabled={page === pagination.totalPages}
                                    className="px-4 py-2 text-sm font-semibold border border-[#3D281C] bg-[#21150F] text-[#B8A08C] hover:text-[#F5E9DC] rounded-xl disabled:opacity-40 transition-colors"
                                >
                                    Berikutnya →
                                </button>
                            </div>
                        )}

                        {/* Back to all categories */}
                        <div className="mt-12 text-center">
                            <Link
                                to="/categories"
                                className="text-sm text-[#D19A6A] font-semibold hover:underline"
                            >
                                ← Lihat Semua Kategori
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CategoryPage;
