import { Link } from "react-router-dom";

function About() {
    const whatsappUrl = "https://wa.me/62895704438010?text=" + encodeURIComponent("Halo ARKALOKA, saya ingin konsultasi mengenai pembuatan website / solusi IT.");

    return (
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 min-h-screen bg-[#FBF7F1] text-[#4E3A2C]">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="inline-flex items-center gap-2 text-[#8C6A4A] font-bold text-sm tracking-wider uppercase bg-[#E8CBA6]/40 border border-[#E8CBA6] px-4 py-1.5 rounded-full shadow-sm">
                    <img src="/logo.png" alt="ARKALOKA Logo" className="w-4 h-4 object-contain" />
                    Digital Solution & Web Development Studio
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-[#4E3A2C] tracking-tight">
                    Tentang ARKALOKA
                </h1>
                <p className="text-[#9A8F81] text-base sm:text-lg leading-relaxed">
                    ARKALOKA adalah layanan digital yang membantu pembuatan website, pengembangan aplikasi, dan solusi IT.
                </p>
            </div>

            {/* Content blocks */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="rounded-3xl border border-[#E8CBA6] bg-[#FFFFFF] p-12 flex flex-col items-center justify-center text-center aspect-video md:aspect-square h-[300px] md:h-[450px] shadow-md">
                    <img
                        src="/logo.png"
                        alt="ARKALOKA Logo"
                        className="w-48 h-48 object-contain mb-4"
                    />
                    <span className="text-2xl font-black text-[#4E3A2C] tracking-widest uppercase">
                        ARKALOKA
                    </span>
                    <p className="text-xs text-[#9A8F81] font-semibold mt-1 uppercase tracking-wider">
                        Digital Solution & Web Development Studio
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-[#4E3A2C] leading-tight">
                        Layanan Pembuatan Website & Solusi IT
                    </h2>
                    <p className="text-[#9A8F81] leading-relaxed text-sm sm:text-base">
                        ARKALOKA adalah layanan digital yang membantu pembuatan website, pengembangan aplikasi, dan solusi IT. Kami membantu menyusun landing page, sistem backend, hingga integrasi data secara rapi.
                    </p>
                    <p className="text-[#9A8F81] leading-relaxed text-sm sm:text-base">
                        Setiap pengerjaan dilakukan dengan cermat untuk memastikan hasil akhir yang modern, efektif, dan berkualitas tinggi.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-xl text-[#FBF7F1] bg-[#8C6A4A] hover:bg-[#4E3A2C] shadow-md transition-all duration-200"
                        >
                            💬 Konsultasi Gratis
                        </a>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-6 py-3.5 border border-[#E8CBA6] text-sm font-semibold rounded-xl text-[#4E3A2C] bg-[#FFFFFF] hover:bg-[#E8CBA6]/40 hover:text-[#4E3A2C] transition-all duration-200"
                        >
                            Lihat Project
                        </Link>
                    </div>
                </div>
            </div>

            {/* Vision & Mission cards */}
            <div className="grid sm:grid-cols-2 gap-8">
                {/* Visi */}
                <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#E8CBA6] shadow-sm space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FBF7F1] border border-[#E8CBA6] flex items-center justify-center text-2xl">
                        🎯
                    </div>
                    <h3 className="font-bold text-[#4E3A2C] text-xl">Visi</h3>
                    <p className="text-[#9A8F81] text-base leading-relaxed">
                        "Memberikan solusi teknologi yang modern, efektif, dan berkualitas."
                    </p>
                </div>

                {/* Misi */}
                <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#E8CBA6] shadow-sm space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FBF7F1] border border-[#E8CBA6] flex items-center justify-center text-2xl">
                        🚀
                    </div>
                    <h3 className="font-bold text-[#4E3A2C] text-xl">Misi</h3>
                    <p className="text-[#9A8F81] text-base leading-relaxed">
                        "Membantu kebutuhan digital melalui website dan sistem yang rapi."
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;
