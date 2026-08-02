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

    const limit = 50;

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
                console.error("Gagal memuat project:", err);
                setError("Gagal mengambil daftar project dari server.");
            })
            .finally(() => setLoading(false));
    }, [selectedCategory, sort, page]);

    const filteredProducts = products.filter((p) => {
        const q = search.toLowerCase().trim();
        if (!q) return true;
        const nameMatch = (p.nama_produk || p.name || "").toLowerCase().includes(q);
        const descMatch = (p.deskripsi || p.description || "").toLowerCase().includes(q);
        const catMatch = (p.category || "").toLowerCase().includes(q);
        return nameMatch || descMatch || catMatch;
    });

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (val) {
            setSearchParams({ category: selectedCategory, q: val });
        } else {
            setSearchParams(selectedCategory ? { category: selectedCategory } : {});
        }
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSort("");
        setPage(1);
        setSearchParams({});
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-16 min-h-screen bg-[#FBF7F1] text-[#4E3A2C]">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4E3A2C] tracking-tight">
                    Showcase Project ARKALOKA
                </h1>
                <p className="text-[#9A8F81] mt-2">
                    Jelajahi portofolio project, aplikasi web, dan solusi IT buatan tim ARKALOKA.
                </p>
            </div>

            {/* Filter controls panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Sidebar Filter */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* Search Bar */}
                    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8CBA6] shadow-sm space-y-3">
                        <h3 className="font-bold text-[#4E3A2C] text-xs tracking-widest uppercase">Cari Project</h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Ketik nama atau deskripsi..."
                                className="w-full pl-3 pr-10 py-2.5 bg-[#FBF7F1] border border-[#E8CBA6] rounded-xl text-sm text-[#4E3A2C] placeholder-[#9A8F81]/70 focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] transition-all duration-200"
                            />
                            {search ? (
                                <button
                                    onClick={() => handleSearchChange({ target: { value: "" } })}
                                    className="absolute right-3 top-2.5 text-[#9A8F81] hover:text-[#4E3A2C] text-sm"
                                >
                                    ✕
                                </button>
                            ) : (
                                <span className="absolute right-3 top-2.5 text-[#9A8F81] text-sm">
                                    🔍
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8CBA6] shadow-sm space-y-3">
                        <h3 className="font-bold text-[#4E3A2C] text-xs tracking-widest uppercase">Urutkan Estimasi</h3>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2.5 bg-[#FBF7F1] border border-[#E8CBA6] rounded-xl text-sm text-[#4E3A2C] focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] transition-all duration-200"
                        >
                            <option value="">Terbaru (Default)</option>
                            <option value="asc">Estimasi: Rendah ke Tinggi</option>
                            <option value="desc">Estimasi: Tinggi ke Rendah</option>
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8CBA6] shadow-sm space-y-3">
                        <h3 className="font-bold text-[#4E3A2C] text-xs tracking-widest uppercase">Kategori Project</h3>
                        {loadingCategories ? (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-8 bg-[#E8CBA6]/30 rounded animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-wrap lg:flex-col gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedCategory("");
                                        setPage(1);
                                        setSearchParams(search ? { q: search } : {});
                                    }}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                                        selectedCategory === ""
                                            ? "bg-[#8C6A4A] text-[#FBF7F1] shadow-sm"
                                            : "bg-[#FBF7F1] text-[#4E3A2C] hover:bg-[#8C6A4A] hover:text-[#FBF7F1] border border-[#E8CBA6]"
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
                                            setSearchParams(search ? { category: cat.slug, q: search } : { category: cat.slug });
                                        }}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                                            selectedCategory === cat.slug
                                                ? "bg-[#8C6A4A] text-[#FBF7F1] shadow-sm"
                                                : "bg-[#FBF7F1] text-[#4E3A2C] hover:bg-[#8C6A4A] hover:text-[#FBF7F1] border border-[#E8CBA6]"
                                        }`}
                                    >
                                        {cat.nama_kategori}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reset Button */}
                    {(search || selectedCategory || sort) && (
                        <button
                            onClick={handleResetFilters}
                            className="w-full py-2.5 bg-[#8C6A4A] hover:bg-[#4E3A2C] border border-transparent text-[#FBF7F1] font-bold text-xs rounded-xl transition-all duration-200 shadow-sm"
                        >
                            Hapus Filter
                        </button>
                    )}

                </div>

                {/* Product Grid Area */}
                <div className="lg:col-span-3 space-y-8">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] overflow-hidden h-96 animate-pulse">
                                    <div className="aspect-video bg-[#E8CBA6]/30" />
                                    <div className="p-5 space-y-4 flex-grow">
                                        <div className="h-5 bg-[#E8CBA6]/30 rounded w-2/3" />
                                        <div className="h-4 bg-[#E8CBA6]/30 rounded w-1/3" />
                                        <div className="space-y-2 pt-2 flex-grow">
                                            <div className="h-3 bg-[#E8CBA6]/30 rounded" />
                                            <div className="h-3 bg-[#E8CBA6]/30 rounded w-5/6" />
                                        </div>
                                        <div className="h-10 bg-[#E8CBA6]/30 rounded-xl pt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 font-medium">
                            {error}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="bg-[#FFFFFF] rounded-2xl p-16 text-center border border-[#E8CBA6] shadow-sm space-y-4">
                            <span className="text-4xl">🔍</span>
                            <h3 className="font-bold text-[#4E3A2C] text-lg">Tidak ada project ditemukan</h3>
                            <p className="text-[#9A8F81] max-w-sm mx-auto text-sm">
                                Coba cari dengan kata kunci lain atau pilih kategori project yang berbeda.
                            </p>
                            {search && (
                                <button
                                    onClick={() => handleSearchChange({ target: { value: "" } })}
                                    className="px-5 py-2 bg-[#8C6A4A] text-[#FBF7F1] text-xs font-semibold rounded-xl hover:bg-[#4E3A2C] transition-colors"
                                >
                                    Reset Pencarian
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {search && (
                                <p className="text-xs text-[#9A8F81]">
                                    Menampilkan {filteredProducts.length} hasil pencarian untuk "{search}"
                                </p>
                            )}

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </section>
    );
}

export default Products;