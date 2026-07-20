import { Link } from "react-router-dom";

function About() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 min-h-screen bg-[#140D09] text-[#F5E9DC]">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="inline-flex items-center gap-2 text-[#D19A6A] font-bold text-sm tracking-wider uppercase bg-[#21150F] border border-[#3D281C] px-4 py-1.5 rounded-full">
                    <img
                        src="/logo.png"
                        alt="ARKALOKA Logo"
                        className="w-4 h-4 object-contain"
                    />
                    Tentang ARKALOKA
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-[#F5E9DC] tracking-tight">
                    Platform Katalog Digital ARKALOKA
                </h1>
                <p className="text-[#B8A08C] text-base sm:text-lg leading-relaxed">
                    Kami hadir untuk memberikan kemudahan bagi Anda dalam mencari, membandingkan, dan memilih produk terbaik tanpa kerumitan sistem transaksi otomatis.
                </p>
            </div>

            {/* Content blocks */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="rounded-3xl border border-[#3D281C] bg-[#21150F] p-12 flex flex-col items-center justify-center text-center aspect-video md:aspect-square h-[300px] md:h-[450px] shadow-2xl">
                    <img
                        src="/logo.png"
                        alt="ARKALOKA Logo"
                        className="w-48 h-48 object-contain mb-4"
                    />
                    <span className="text-2xl font-black text-[#F5E9DC] tracking-widest uppercase">
                        ARKALOKA
                    </span>
                    <p className="text-xs text-[#D19A6A] font-semibold mt-1 uppercase tracking-wider">
                        Dark Luxury Bronze Catalog
                    </p>
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-[#F5E9DC] leading-tight">
                        Mengapa Memilih Katalog Online ARKALOKA?
                    </h2>
                    <p className="text-[#B8A08C] leading-relaxed text-sm sm:text-base">
                        ARKALOKA adalah jembatan interaksi personal antara penjual dan pembeli. Di sini, Anda dapat menjelajahi ribuan produk berkualitas tinggi dari berbagai kategori pilihan. Kami percaya bahwa komunikasi langsung menghasilkan pemahaman produk dan negosiasi harga terbaik.
                    </p>
                    <p className="text-[#B8A08C] leading-relaxed text-sm sm:text-base">
                        Sistem ARKALOKA dirancang agar sangat ringan, ramah perangkat seluler (mobile friendly), dan berfokus pada kecepatan pencarian produk yang relevan untuk Anda.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-bold rounded-xl text-[#F5E9DC] bg-[#B87333] hover:bg-[#A05E22] shadow-lg shadow-[#B87333]/20 transition-all duration-200"
                        >
                            Jelajahi Katalog
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mission & Vision cards */}
            <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-[#21150F] p-8 rounded-3xl border border-[#3D281C] shadow-md space-y-4">
                    <span className="text-3xl">🎯</span>
                    <h3 className="font-bold text-[#F5E9DC] text-lg">Misi ARKALOKA</h3>
                    <p className="text-[#B8A08C] text-sm leading-relaxed">
                        Menyediakan katalog yang rapi, informatif, dan selalu terupdate guna mempercepat interaksi jual beli bisnis retail.
                    </p>
                </div>
                <div className="bg-[#21150F] p-8 rounded-3xl border border-[#3D281C] shadow-md space-y-4">
                    <span className="text-3xl">💡</span>
                    <h3 className="font-bold text-[#F5E9DC] text-lg">Visi ARKALOKA</h3>
                    <p className="text-[#B8A08C] text-sm leading-relaxed">
                        Menjadi rujukan utama platform direktori katalog bisnis lokal dengan integrasi layanan WhatsApp tercepat dan terpercaya.
                    </p>
                </div>
                <div className="bg-[#21150F] p-8 rounded-3xl border border-[#3D281C] shadow-md space-y-4">
                    <span className="text-3xl">🤝</span>
                    <h3 className="font-bold text-[#F5E9DC] text-lg">Nilai Utama</h3>
                    <p className="text-[#B8A08C] text-sm leading-relaxed">
                        Mengedepankan integritas data produk, kejujuran spesifikasi, dan kemudahan navigasi bagi pengguna.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;
