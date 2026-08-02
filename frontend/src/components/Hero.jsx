import { Link } from "react-router-dom";

function Hero() {
    const whatsappUrl = "https://wa.me/62895704438010?text=" + encodeURIComponent("Halo ARKALOKA, saya ingin konsultasi mengenai kendala coding / project website.");

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#FBF7F1] via-[#FBF7F1] to-[#E8CBA6]/40 py-16 md:py-24 border-b border-[#E8CBA6]">
            {/* Background decorative circles */}
            <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-[#8C6A4A]/10 blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#C79E72]/20 blur-3xl opacity-60"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column Text */}
                    <div className="md:col-span-7 space-y-6 text-center md:text-left">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-[#4E3A2C] bg-[#E8CBA6]/40 border border-[#E8CBA6] shadow-sm mb-2">
                            <img src="/logo.png" alt="ARKALOKA Logo" className="w-4 h-4 object-contain" />
                            Digital Solution & Web Development Studio
                        </span>
                        
                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#4E3A2C] leading-tight tracking-tight">
                                ARKALOKA
                            </h1>
                            <p className="text-xl sm:text-2xl font-bold text-[#8C6A4A]">
                                Digital Solution & Web Development Studio
                            </p>
                        </div>

                        <p className="text-base sm:text-lg text-[#9A8F81] max-w-2xl leading-relaxed">
                            Sedang mengalami kendala tugas coding, project website, atau error program? Kami membantu menyelesaikan kebutuhan IT dengan pengerjaan yang rapi, terstruktur, dan sesuai kebutuhan.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-transparent text-base font-bold rounded-xl text-[#FBF7F1] bg-[#8C6A4A] hover:bg-[#4E3A2C] shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                💬 Konsultasi Gratis
                            </a>
                            <Link
                                to="/products"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 border border-[#E8CBA6] text-base font-semibold rounded-xl text-[#4E3A2C] bg-[#FFFFFF] hover:bg-[#E8CBA6]/40 hover:text-[#4E3A2C] shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Lihat Project
                            </Link>
                        </div>

                        <p className="text-xs text-[#9A8F81] font-semibold tracking-wide pt-1">
                            ✨ "Deadline lebih tenang, project lebih maksimal."
                        </p>
                    </div>

                    {/* Right Column Logo Showcase */}
                    <div className="md:col-span-5 relative">
                        <div className="relative mx-auto max-w-md md:max-w-none">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#8C6A4A] to-[#C79E72] opacity-30 blur-2xl transform rotate-3"></div>
                            
                            <div className="relative rounded-3xl border border-[#E8CBA6] bg-[#FFFFFF] p-10 shadow-xl flex flex-col items-center justify-center text-center space-y-5">
                                <img
                                    src="/logo.png"
                                    alt="ARKALOKA Logo"
                                    className="w-44 h-44 object-contain"
                                />
                                <span className="text-2xl font-black text-[#4E3A2C] tracking-widest uppercase">
                                    ARKALOKA
                                </span>
                                <p className="text-xs text-[#9A8F81] font-semibold tracking-wider uppercase">
                                    Digital Solution & Web Development
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