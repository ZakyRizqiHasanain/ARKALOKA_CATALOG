import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-16 md:py-24">
            {/* Background decorative circles */}
            <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-indigo-100 blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-violet-100 blur-3xl opacity-60"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column Text */}
                    <div className="md:col-span-7 space-y-6 text-center md:text-left">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-100/80 mb-2">
                            ✨ Katalog Produk Modern & Terpercaya
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                            Temukan Produk <br />
                            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                Terbaik & Berkualitas
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                            Jelajahi beragam kategori pilihan mulai dari Elektronik, Fashion, hingga Kuliner nusantara. Cari detail produk yang Anda butuhkan dan hubungi kami langsung via WhatsApp untuk pertanyaan lebih lanjut.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
                            <Link
                                to="/products"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Jelajahi Katalog
                            </Link>
                            <Link
                                to="/about"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-indigo-600 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Pelajari Lebih Lanjut
                            </Link>
                        </div>
                    </div>

                    {/* Right Column Image */}
                    <div className="md:col-span-5 relative">
                        <div className="relative mx-auto max-w-md md:max-w-none">
                            {/* Decorative shadow ring */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-10 blur-xl transform rotate-3"></div>
                            
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80"
                                alt="Modern Catalog App Mockup"
                                className="relative rounded-2xl border border-gray-100 shadow-2xl object-cover w-full h-[300px] sm:h-[400px]"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default Hero;