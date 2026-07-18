import { Link } from "react-router-dom";

function About() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 min-h-screen bg-slate-50">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span className="text-indigo-600 font-bold text-sm tracking-wider uppercase bg-indigo-50 px-3 py-1 rounded-full">
                    Tentang Kami
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    KatalogKITA Platform
                </h1>
                <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                    Kami hadir untuk memberikan kemudahan bagi Anda dalam mencari, membandingkan, dan memilih produk terbaik tanpa kerumitan sistem transaksi otomatis.
                </p>
            </div>

            {/* Content blocks */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100 aspect-video md:aspect-square h-[300px] md:h-[450px]">
                    <img
                        src="https://images.unsplash.com/photo-1552581230-26407447765e?w=600&auto=format&fit=crop&q=80"
                        alt="Our Team Planning"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                        Mengapa Memilih Katalog Online Kami?
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        KatalogKITA adalah jembatan interaksi personal antara penjual dan pembeli. Di sini, Anda dapat menjelajahi ribuan produk berkualitas tinggi dari berbagai kategori pilihan. Kami percaya bahwa komunikasi langsung menghasilkan pemahaman produk dan negosiasi harga terbaik.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        Sistem kami dirancang agar sangat ringan, ramah perangkat seluler (mobile friendly), dan berfokus pada kecepatan pencarian produk yang relevan untuk Anda.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all duration-200"
                        >
                            Mulai Belanja
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-5 py-3 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                        >
                            Kontak Admin
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mission & Vision cards */}
            <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <span className="text-3xl">🎯</span>
                    <h3 className="font-bold text-slate-800 text-lg">Misi Kami</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Menyediakan katalog yang rapi, informatif, dan selalu terupdate guna mempercepat interaksi jual beli bisnis retail.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <span className="text-3xl">💡</span>
                    <h3 className="font-bold text-slate-800 text-lg">Visi Kami</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Menjadi rujukan utama platform direktori katalog bisnis lokal dengan integrasi layanan WhatsApp tercepat dan terpercaya.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                    <span className="text-3xl">🤝</span>
                    <h3 className="font-bold text-slate-800 text-lg">Nilai Utama</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Mengedepankan integritas data produk, kejujuran spesifikasi, dan kemudahan navigasi bagi pengguna.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;
