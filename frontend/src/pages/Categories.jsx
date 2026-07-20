import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import { getCategories } from "../services/categoryService";

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setError("Gagal memuat kategori. Coba lagi."))
            .finally(() => setLoading(false));
    }, []);

    const filtered = categories.filter((c) =>
        c.nama_kategori.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen">

            {/* ── Page Header ──────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                        🏷️ Semua Kategori
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black mb-4">
                        Temukan Kategori Anda
                    </h1>
                    <p className="text-indigo-100 max-w-lg mx-auto text-base sm:text-lg mb-8">
                        Pilih kategori untuk melihat produk yang sesuai kebutuhan Anda.
                    </p>

                    {/* Search */}
                    <div className="max-w-sm mx-auto">
                        <div className="relative">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kategori..."
                                className="w-full pl-11 pr-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/60 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content ──────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-12">


                {/* Count info */}
                {!loading && !error && (
                    <p className="text-sm text-gray-500 mb-6">
                        {search
                            ? `Menampilkan ${filtered.length} hasil untuk "${search}"`
                            : `${categories.length} kategori tersedia`}
                    </p>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center text-red-600">
                        <span className="text-3xl block mb-2">⚠️</span>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-44 bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">🔍</span>
                        <h3 className="font-bold text-slate-800 text-xl mb-2">
                            {search ? "Kategori tidak ditemukan" : "Belum ada kategori"}
                        </h3>
                        <p className="text-gray-400 text-sm">
                            {search ? `Coba cari dengan kata kunci lain.` : "Kategori akan segera tersedia."}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="mt-4 px-6 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                            >
                                Reset Pencarian
                            </button>
                        )}
                    </div>
                )}

                {/* Category grid */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {filtered.map((cat) => (
                            <CategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoriesPage;
