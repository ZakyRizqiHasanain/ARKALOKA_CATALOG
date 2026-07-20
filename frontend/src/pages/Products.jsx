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

    const [search, setSearch] = useState(qParam);
    const [selectedCategory, setSelectedCategory] = useState(catParam);
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalProducts: 0,
        totalPages: 1,
        currentPage: 1
    });

    const limit = 8;

    useEffect(() => {
        setSelectedCategory(catParam);
        setSearch(qParam);
        setPage(1);
    }, [catParam, qParam]);

    useEffect(() => {
        getCategories()
            .then((data) => setCategories(data))
            .catch((err) => console.error("Gagal mengambil kategori:", err))
            .finally(() => setLoadingCategories(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        getProducts({
            q: search,
            category: selectedCategory,
            sort: sort,
            page: page,
            limit: limit
        })
            .then((data) => {
                setProducts(data.products || []);
                setPagination(data.pagination || { totalProducts: 0, totalPages: 1, currentPage: 1 });
                setError(null);
            })
            .catch((err) => {
                console.error("Gagal memuat produk:", err);
                setError("Gagal mengambil produk dari server.");
            })
            .finally(() => setLoading(false));
    }, [selectedCategory, sort, page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        setSearchParams({ category: selectedCategory, q: search });
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSort("");
        setPage(1);
        setSearchParams({});
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-16 min-h-screen bg-[#140D09] text-[#F5E9DC]">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5E9DC] tracking-tight">
                    Katalog Produk ARKALOKA
                </h1>
                <p className="text-[#B8A08C] mt-2">
                    Jelajahi koleksi produk eksklusif kami untuk kebutuhan dan gaya hidup Anda.
                </p>
            </div>

            {/* Filter controls panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Sidebar Filter */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Search */}
                    <div className="bg-[#21150F] p-5 rounded-2xl border border-[#3D281C] shadow-md space-y-3">
                        <h3 className="font-bold text-[#D19A6A] text-xs tracking-widest uppercase">Cari Produk</h3>
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Ketik nama produk..."
                                className="w-full pl-3 pr-10 py-2.5 bg-[#140D09] border border-[#3D281C] rounded-xl text-sm text-[#F5E9DC] placeholder-[#B8A08C] focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-all duration-200"
                            />
                            <button
                                type="submit"
                                className="absolute right-2.5 top-2.5 text-[#B8A08C] hover:text-[#D19A6A] transition-colors duration-200"
                            >
                                🔍
                            </button>
                        </form>
                    </div>

                    {/* Sort */}
                    <div className="bg-[#21150F] p-5 rounded-2xl border border-[#3D281C] shadow-md space-y-3">
                        <h3 className="font-bold text-[#D19A6A] text-xs tracking-widest uppercase">Urutkan Harga</h3>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2.5 bg-[#140D09] border border-[#3D281C] rounded-xl text-sm text-[#F5E9DC] focus:outline-none focus:ring-2 focus:ring-[#B87333] transition-all duration-200"
                        >
                            <option value="">Terbaru (Default)</option>
                            <option value="asc">Harga: Rendah ke Tinggi</option>
                            <option value="desc">Harga: Tinggi ke Rendah</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="bg-[#21150F] p-5 rounded-2xl border border-[#3D281C] shadow-md space-y-3">
                        <h3 className="font-bold text-[#D19A6A] text-xs tracking-widest uppercase">Kategori</h3>
                        {loadingCategories ? (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-8 bg-[#2C1D16] rounded animate-pulse" />
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
                                            ? "bg-[#B87333] text-[#F5E9DC] shadow-md"
                                            : "bg-[#140D09] text-[#B8A08C] hover:bg-[#2C1D16] hover:text-[#F5E9DC] border border-[#3D281C]"
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
                                                ? "bg-[#B87333] text-[#F5E9DC] shadow-md"
                                                : "bg-[#140D09] text-[#B8A08C] hover:bg-[#2C1D16] hover:text-[#F5E9DC] border border-[#3D281C]"
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
                        className="w-full py-2.5 bg-[#2C1D16] hover:bg-[#3D281C] border border-[#3D281C] text-[#B8A08C] hover:text-[#F5E9DC] font-semibold text-xs rounded-xl transition-all duration-200"
                    >
                        Hapus Semua Filter
                    </button>

                </div>

                {/* Product Grid Area */}
                <div className="lg:col-span-3 space-y-8">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col bg-[#21150F] rounded-2xl border border-[#3D281C] overflow-hidden h-96 animate-pulse">
                                    <div className="aspect-video bg-[#2C1D16]" />
                                    <div className="p-5 space-y-4 flex-grow">
                                        <div className="h-5 bg-[#2C1D16] rounded w-2/3" />
                                        <div className="h-4 bg-[#2C1D16] rounded w-1/3" />
                                        <div className="space-y-2 pt-2 flex-grow">
                                            <div className="h-3 bg-[#2C1D16] rounded" />
                                            <div className="h-3 bg-[#2C1D16] rounded w-5/6" />
                                        </div>
                                        <div className="h-10 bg-[#2C1D16] rounded-xl pt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-6 text-center text-red-400">
                            {error}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-[#21150F] rounded-2xl p-16 text-center border border-[#3D281C] shadow-md space-y-4">
                            <span className="text-4xl">🔍</span>
                            <h3 className="font-bold text-[#F5E9DC] text-lg">Produk tidak ditemukan</h3>
                            <p className="text-[#B8A08C] max-w-sm mx-auto text-sm">
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
                                        className="px-3.5 py-2 rounded-xl text-sm font-semibold border border-[#3D281C] bg-[#21150F] text-[#B8A08C] hover:text-[#F5E9DC] hover:bg-[#2C1D16] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
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
                                                        ? "bg-[#B87333] text-[#F5E9DC] shadow-md"
                                                        : "border border-[#3D281C] bg-[#21150F] text-[#B8A08C] hover:bg-[#2C1D16] hover:text-[#F5E9DC]"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))}
                                        disabled={page === pagination.totalPages}
                                        className="px-3.5 py-2 rounded-xl text-sm font-semibold border border-[#3D281C] bg-[#21150F] text-[#B8A08C] hover:text-[#F5E9DC] hover:bg-[#2C1D16] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
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