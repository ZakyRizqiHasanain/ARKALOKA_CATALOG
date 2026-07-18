import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const catParam = searchParams.get("category") || "";
    const qParam = searchParams.get("q") || "";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);

    // Filter, Sort, and Pagination states
    const [search, setSearch] = useState(qParam);
    const [selectedCategory, setSelectedCategory] = useState(catParam);
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 1,
        currentPage: 1
    });

    const limit = 8; // products per page

    // Sync state with URL params
    useEffect(() => {
        setSelectedCategory(catParam);
        setSearch(qParam);
        setPage(1); // Reset to page 1 on filter changes
    }, [catParam, qParam]);

    // Fetch categories once
    useEffect(() => {
        getCategories()
            .then(data => {
                setCategories(data);
            })
            .catch(err => {
                console.error("Gagal mengambil kategori:", err);
            })
            .finally(() => {
                setLoadingCategories(false);
            });
    }, []);

    // Fetch products on parameter changes
    useEffect(() => {
        setLoading(true);
        getProducts({
            q: search,
            category: selectedCategory,
            sort: sort,
            page: page,
            limit: limit
        })
            .then(data => {
                setProducts(data.products || []);
                setPagination(data.pagination || { totalProducts: 0, totalPages: 1, currentPage: 1 });
                setError(null);
            })
            .catch(err => {
                console.error("Gagal memuat produk:", err);
                setError("Gagal mengambil produk dari server.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedCategory, sort, page]); // Triggers API call on Category, Sort, or Page change

    // Handle search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchParams({ category: selectedCategory, q: search });
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSort("");
        setPage(1);
        setSearchParams({});
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-16 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Katalog Produk
                </h1>
                <p className="text-gray-500 mt-2">
                    Jelajahi koleksi produk berkualitas kami untuk kebutuhan Anda.
                </p>
            </div>

            {/* Filter controls panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Sidebar Filter (Desktop) & Top Controls (Mobile) */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Search */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm tracking-wider uppercase">Cari Produk</h3>
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Ketik nama produk..."
                                className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                            <button
                                type="submit"
                                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                            >
                                🔍
                            </button>
                        </form>
                    </div>

                    {/* Sort */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm tracking-wider uppercase">Urutkan Harga</h3>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                        >
                            <option value="">Terbaru (Default)</option>
                            <option value="asc">Harga: Rendah ke Tinggi</option>
                            <option value="desc">Harga: Tinggi ke Rendah</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm tracking-wider uppercase">Kategori</h3>
                        {loadingCategories ? (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap lg:flex-col gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedCategory("");
                                        setPage(1);
                                        setSearchParams({ q: search });
                                    }}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                                        selectedCategory === ""
                                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    Semua Kategori
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategory(cat.slug);
                                            setPage(1);
                                            setSearchParams({ category: cat.slug, q: search });
                                        }}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                                            selectedCategory === cat.slug
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        {cat.nama_kategori}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={handleResetFilters}
                        className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded-xl transition-all duration-200"
                    >
                        Hapus Semua Filter
                    </button>

                </div>

                {/* Product Grid Area */}
                <div className="lg:col-span-3 space-y-8">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-96 animate-pulse">
                                    <div className="aspect-video bg-gray-200"></div>
                                    <div className="p-5 space-y-4 flex-grow">
                                        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                        <div className="space-y-2 pt-2 flex-grow">
                                            <div className="h-3 bg-gray-200 rounded"></div>
                                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                        </div>
                                        <div className="h-10 bg-gray-200 rounded-xl pt-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600">
                            {error}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm space-y-4">
                            <span className="text-4xl">🔍</span>
                            <h3 className="font-bold text-slate-800 text-lg">Produk tidak ditemukan</h3>
                            <p className="text-gray-500 max-w-sm mx-auto text-sm">
                                Coba cari dengan kata kunci lain atau gunakan kategori berbeda.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-center space-x-2 pt-6">
                                    <button
                                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                                        disabled={page === 1}
                                        className="px-3.5 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Sebelumnya
                                    </button>
                                    
                                    {[...Array(pagination.totalPages)].map((_, index) => {
                                        const p = index + 1;
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                                    page === p
                                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                                        : "border border-gray-200 bg-white hover:bg-gray-50"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))}
                                        disabled={page === pagination.totalPages}
                                        className="px-3.5 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        Berikutnya
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </section>
    );
}

export default Products;