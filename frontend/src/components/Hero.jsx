import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#140D09] via-[#21150F] to-[#140D09] py-16 md:py-24 border-b border-[#3D281C]">
            {/* Background decorative circles */}
            <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-[#B87333]/10 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#D19A6A]/10 blur-3xl opacity-50"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column Text */}
                    <div className="md:col-span-7 space-y-6 text-center md:text-left">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-[#D19A6A] bg-[#21150F] border border-[#3D281C] shadow-sm mb-2">
                            <img
                                src="/logo.png"
                                alt="ARKALOKA Logo"
                                className="w-4 h-4 object-contain"
                            />
                            Katalog Produk Eksklusif ARKALOKA
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5E9DC] leading-tight tracking-tight">
                            Temukan Produk <br />
                            <span className="bg-gradient-to-r from-[#B87333] via-[#D19A6A] to-[#F5E9DC] bg-clip-text text-transparent">
                                Luxury & Modern
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-[#B8A08C] max-w-2xl leading-relaxed">
                            Selamat datang di ARKALOKA. Jelajahi pilihan produk berkelas dengan desain modern dan kualitas eksklusif. Temukan produk impian Anda dan terhubung langsung via WhatsApp.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                            <Link
                                to="/products"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 border border-transparent text-base font-bold rounded-xl text-[#F5E9DC] bg-[#B87333] hover:bg-[#A05E22] shadow-xl shadow-[#B87333]/20 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Jelajahi Katalog
                            </Link>
                            <Link
                                to="/about"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-[#3D281C] text-base font-semibold rounded-xl text-[#F5E9DC] bg-[#21150F] hover:bg-[#2C1D16] hover:text-[#D19A6A] shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Tentang ARKALOKA
                            </Link>
                        </div>
                    </div>

                    {/* Right Column Logo Showcase */}
                    <div className="md:col-span-5 relative">
                        <div className="relative mx-auto max-w-md md:max-w-none">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#B87333] to-[#D19A6A] opacity-20 blur-2xl transform rotate-3"></div>
                            
                            <div className="relative rounded-3xl border border-[#3D281C] bg-[#21150F]/90 backdrop-blur-md p-10 shadow-2xl flex flex-col items-center justify-center text-center space-y-5">
                                <img
                                    src="/logo.png"
                                    alt="ARKALOKA Logo"
                                    className="w-44 h-44 object-contain"
                                />
                                <span className="text-2xl font-black text-[#F5E9DC] tracking-widest uppercase">
                                    ARKALOKA
                                </span>
                                <p className="text-xs text-[#D19A6A] font-semibold tracking-wider uppercase">
                                    Dark Luxury Bronze Catalog
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Hero;