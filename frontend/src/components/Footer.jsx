import { Link } from "react-router-dom";

const YEAR = new Date().getFullYear();

function Footer() {
    return (
        <footer className="bg-[#4E3A2C] text-[#FBF7F1] mt-20 border-t border-[#E8CBA6]">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="ARKALOKA Logo"
                                className="w-9 h-9 object-contain"
                            />
                            <div>
                                <span className="text-xl font-black text-[#FBF7F1] tracking-wider block leading-tight">
                                    ARKALOKA
                                </span>
                                <span className="text-xs text-[#FBF7F1]/80 font-semibold">
                                    Digital Solution & Web Development Studio
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-[#FBF7F1]/90 leading-relaxed">
                            Layanan digital untuk pembuatan website, pengembangan sistem, dan kebutuhan IT modern.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold text-[#FBF7F1] tracking-widest uppercase mb-4 opacity-90">Navigasi</h3>
                        <ul className="space-y-2.5 text-sm text-[#FBF7F1]/90">
                            <li>
                                <Link to="/" className="hover:text-[#C79E72] transition-colors duration-200">Home</Link>
                            </li>
                            <li>
                                <Link to="/products" className="hover:text-[#C79E72] transition-colors duration-200">Project</Link>
                            </li>
                            <li>
                                <Link to="/categories" className="hover:text-[#C79E72] transition-colors duration-200">Layanan</Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-[#C79E72] transition-colors duration-200">About</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact details */}
                    <div>
                        <h3 className="text-xs font-bold text-[#FBF7F1] tracking-widest uppercase mb-4 opacity-90">Kontak</h3>
                        <ul className="space-y-3 text-sm text-[#FBF7F1]/90">
                            <li className="flex items-center gap-2">
                                <a
                                    href="https://wa.me/62895704438010"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[#FBF7F1]/90 hover:text-[#C79E72] transition-colors"
                                >
                                    <svg className="w-4 h-4 text-[#FBF7F1] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    <span>+62 895-7044-38010</span>
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[#FBF7F1] flex-shrink-0">📧</span>
                                <span>info@arkaloka.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-[#FBF7F1]/20 flex flex-col md:flex-row items-center justify-between text-xs text-[#FBF7F1]/80">
                    <p className="mb-4 md:mb-0">&copy; {YEAR} ARKALOKA. Digital Solution & Web Development Studio.</p>
                    <div className="flex space-x-6">
                        <span className="hover:text-[#C79E72] cursor-pointer">Syarat & Ketentuan</span>
                        <span className="hover:text-[#C79E72] cursor-pointer">Kebijakan Privasi</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;