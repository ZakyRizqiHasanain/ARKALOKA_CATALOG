import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";

function ProductSkeleton() {
    return (
        <div className="flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-[#E8CBA6]/30" />
            <div className="p-5 space-y-3">
                <div className="h-5 bg-[#E8CBA6]/30 rounded w-3/4" />
                <div className="h-4 bg-[#E8CBA6]/30 rounded w-1/3" />
                <div className="space-y-1.5">
                    <div className="h-3 bg-[#E8CBA6]/30 rounded" />
                    <div className="h-3 bg-[#E8CBA6]/30 rounded w-4/5" />
                </div>
                <div className="h-10 bg-[#E8CBA6]/30 rounded-xl mt-2" />
            </div>
        </div>
    );
}

function CategorySkeleton() {
    return <div className="h-44 bg-[#FFFFFF] border border-[#E8CBA6] rounded-2xl animate-pulse" />;
}

function Home() {
    const [categories, setCategories] = useState([]);
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [latestProjects, setLatestProjects] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [loadingLatest, setLoadingLatest] = useState(true);
    const [errCats, setErrCats] = useState(null);
    const [errFeatured, setErrFeatured] = useState(null);

    const whatsappConsultationUrl = "https://wa.me/62895704438010?text=" + encodeURIComponent("Halo ARKALOKA, saya ingin konsultasi mengenai pembuatan website / solusi IT.");

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setErrCats("Gagal memuat kategori."))
            .finally(() => setLoadingCats(false));

        getProducts({ limit: 4 })
            .then((d) => setFeaturedProjects(d.products || []))
            .catch(() => setErrFeatured("Gagal memuat project pilihan."))
            .finally(() => setLoadingFeatured(false));

        getProducts({ limit: 8, sort: "" })
            .then((d) => setLatestProjects(d.products || []))
            .catch(() => {})
            .finally(() => setLoadingLatest(false));
    }, []);

    return (
        <div className="bg-[#FBF7F1] min-h-screen text-[#9A8F81]">
            {/* ── Hero Section ────────────────────────────────────────────── */}
            <Hero />

            {/* ── Kategori Section ────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <span className="text-[#9A8F81] font-bold text-xs tracking-widest uppercase">
                            Temukan Spesialisasi
                        </span>
                        <h2 className="text-3xl font-extrabold text-[#4E3A2C] mt-1">
                            Kategori Layanan
                        </h2>
                    </div>
                    <Link
                        to="/categories"
                        className="text-sm font-bold text-[#8C6A4A] hover:text-[#4E3A2C] transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                        Semua Kategori →
                    </Link>
                </div>

                {loadingCats ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {[...Array(7)].map((_, i) => <CategorySkeleton key={i} />)}
                    </div>
                ) : errCats ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm font-medium">
                        {errCats}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12 text-[#9A8F81]">Belum ada kategori.</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {categories.slice(0, 7).map((c) => (
                            <CategoryCard key={c.id} category={c} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Featured Projects Section ──────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <span className="text-[#9A8F81] font-bold text-xs tracking-widest uppercase">
                            Portofolio Pilihan
                        </span>
                        <h2 className="text-3xl font-extrabold text-[#4E3A2C] mt-1">
                            Featured Projects
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="text-sm font-bold text-[#8C6A4A] hover:text-[#4E3A2C] transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                        Lihat Semua Project →
                    </Link>
                </div>

                {loadingFeatured ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                ) : errFeatured ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 text-sm font-medium">
                        {errFeatured}
                    </div>
                ) : featuredProjects.length === 0 ? (
                    <div className="text-center py-12 text-[#9A8F81]">Belum ada project showcase.</div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProjects.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Latest Projects Section ────────────────────────────────── */}
            <section className="bg-[#E8CBA6]/40 border-y border-[#E8CBA6]">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                        <div>
                            <span className="text-[#9A8F81] font-bold text-xs tracking-widest uppercase">
                                Rilis Terbaru
                            </span>
                            <h2 className="text-3xl font-extrabold text-[#4E3A2C] mt-1">
                                Project Terbaru
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            className="text-sm font-bold text-[#8C6A4A] hover:text-[#4E3A2C] transition-colors flex items-center gap-1 whitespace-nowrap"
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
                            {latestProjects.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA Banner ──────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#E8CBA6]/40 via-[#FBF7F1] to-[#FFFFFF] border border-[#E8CBA6] rounded-3xl px-8 py-14 text-center shadow-md">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#8C6A4A]/15 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C79E72]/20 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#E8CBA6] text-[#8C6A4A] text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-sm">
                            <img src="/logo.png" alt="ARKALOKA Logo" className="w-3.5 h-3.5" />
                            Solusi Digital ARKALOKA
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-[#4E3A2C] leading-tight mb-4">
                            Siap Membangun Solusi Digital Anda?
                        </h2>
                        <p className="text-[#9A8F81] max-w-xl mx-auto mb-8 text-base sm:text-lg">
                            Konsultasikan kebutuhan pembuatan website, sistem backend, atau kustomisasi project Anda secara langsung dengan tim ARKALOKA.
                        </p>
                        <a
                            href={whatsappConsultationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] font-bold rounded-2xl transition-all duration-300 shadow-md hover:-translate-y-0.5"
                        >
                            💬 Konsultasi Gratis
                            <span>→</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;