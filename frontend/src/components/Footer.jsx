import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300 mt-20 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            KatalogKITA
                        </span>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Platform katalog produk online modern yang memudahkan penemuan dan penjelajahan barang berkualitas tinggi sesuai kebutuhan bisnis dan gaya hidup Anda.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Navigasi</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-white transition-colors duration-200">Home</Link>
                            </li>
                            <li>
                                <Link to="/products" className="hover:text-white transition-colors duration-200">Katalog Produk</Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white transition-colors duration-200">Tentang Kami</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-white transition-colors duration-200">Hubungi Kami</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact details */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Kontak</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-center">
                                <span className="mr-2">📧</span> info@katalogkita.com
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📞</span> +62 812-3456-7890
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📍</span> Jakarta, Indonesia
                            </li>
                        </ul>
                    </div>

                    {/* Admin portal shortcut */}
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Portal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/admin" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                                    Login Administrator &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                    <p className="mb-4 md:mb-0">&copy; 2026 KatalogKITA. Hak Cipta Dilindungi Undang-Undang.</p>
                    <div className="flex space-x-6">
                        <span className="hover:text-gray-400 cursor-pointer">Syarat & Ketentuan</span>
                        <span className="hover:text-gray-400 cursor-pointer">Kebijakan Privasi</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;