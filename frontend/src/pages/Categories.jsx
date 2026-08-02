import { useEffect, useState } from "react";
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
            .catch(() => setError("Gagal memuat kategori project. Coba lagi."))
            .finally(() => setLoading(false));
    }, []);

    const filtered = categories.filter((c) =>
        c.nama_kategori.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-[#FBF7F1] min-h-screen text-[#4E3A2C]">

            {/* ── Page Header ──────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-[#FBF7F1] via-[#FBF7F1] to-[#E8CBA6]/40 border-b border-[#E8CBA6] text-[#4E3A2C]">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <span className="inline-flex items-center gap-2 bg-[#E8CBA6]/40 border border-[#E8CBA6] text-[#8C6A4A] text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm">
                        <img src="/logo.png" alt="ARKALOKA Logo" className="w-3.5 h-3.5 object-contain" />
                        Kategori Project ARKALOKA
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black mb-4 text-[#4E3A2C]">
                        Spesialisasi & Kategori Project
                    </h1>
                    <p className="text-[#9A8F81] max-w-lg mx-auto text-base sm:text-lg mb-8">
                        Pilih spesialisasi teknologi untuk melihat ragam contoh project & solusi IT buatan ARKALOKA.
                    </p>

                    {/* Search */}
                    <div className="max-w-sm mx-auto">
                        <div className="relative">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8F81]"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kategori project..."
                                className="w-full pl-11 pr-4 py-3 bg-[#FBF7F1] border border-[#E8CBA6] rounded-2xl text-[#4E3A2C] placeholder-[#9A8F81]/70 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C6A4A]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content ──────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Count info */}
                {!loading && !error && (
                    <p className="text-sm text-[#9A8F81] mb-6 font-medium">
                        {search
                            ? `Menampilkan ${filtered.length} hasil untuk "${search}"`
                            : `${categories.length} kategori project tersedia`}
                    </p>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700">
                        <span className="text-3xl block mb-2">⚠️</span>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-[#8C6A4A] text-[#FBF7F1] text-sm font-semibold rounded-xl hover:bg-[#4E3A2C] transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-44 bg-[#FFFFFF] border border-[#E8CBA6] rounded-2xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">🔍</span>
                        <h3 className="font-bold text-[#4E3A2C] text-xl mb-2">
                            {search ? "Kategori project tidak ditemukan" : "Belum ada kategori"}
                        </h3>
                        <p className="text-[#9A8F81] text-sm">
                            {search ? `Coba cari dengan kata kunci lain.` : "Kategori akan segera diperbarui."}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="mt-4 px-6 py-2 bg-[#8C6A4A] text-[#FBF7F1] text-sm font-semibold rounded-xl hover:bg-[#4E3A2C] transition-colors"
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
