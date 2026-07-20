import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

function ProductSkeleton() {
    return (
        <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-100" />
            <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-10 bg-gray-100 rounded-xl mt-2" />
            </div>
        </div>
    );
}

/**
 * /categories/:slug
 * Menampilkan semua produk dalam satu kategori
 */
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

    // Ambil nama kategori dari list
    useEffect(() => {
        getCategories()
            .then((cats) => {
                const found = cats.find((c) => c.slug === slug);
                setCategoryName(found?.nama_kategori || slug);
            })
            .catch(() => {});
    }, [slug]);

    // Fetch produk by kategori
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

    // Reset page saat slug / sort berubah
    useEffect(() => { setPage(1); }, [slug, sort]);

    return (
        <div className="bg-slate-50 min-h-screen">

            {/* ── Category Banner Header ───────────────────────────────── */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <div className="max-w-7xl mx-auto px-6 py-14 text-center">
                    <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                        🏷️ Kategori
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black mb-2">
                        {categoryName || "Memuat..."}
                    </h1>
                    {!loading && (
                        <p className="text-indigo-100 text-sm mt-2">
                            {pagination.totalProducts} produk tersedia
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
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Terbaru</option>
                        <option value="asc">Harga: Terendah</option>
                        <option value="desc">Harga: Tertinggi</option>
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center text-red-600">
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
                        <h3 className="text-xl font-bold text-slate-800">Belum ada produk</h3>
                        <p className="text-gray-400 text-sm">
                            Kategori ini belum memiliki produk aktif.
                        </p>
                        <Link
                            to="/products"
                            className="inline-block mt-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
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
                                    className="px-4 py-2 text-sm font-semibold border border-gray-200 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors"
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
                                                        ? "bg-indigo-600 text-white shadow-sm"
                                                        : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    }
                                    if (p === page - 2 || p === page + 2) {
                                        return <span key={p} className="text-gray-400 text-xs">…</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                                    disabled={page === pagination.totalPages}
                                    className="px-4 py-2 text-sm font-semibold border border-gray-200 bg-white rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                >
                                    Berikutnya →
                                </button>
                            </div>
                        )}

                        {/* Back to all categories */}
                        <div className="mt-12 text-center">
                            <Link
                                to="/categories"
                                className="text-sm text-indigo-600 font-semibold hover:underline"
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
