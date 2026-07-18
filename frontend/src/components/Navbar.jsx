import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path
            ? "text-indigo-600 font-semibold border-b-2 border-indigo-600"
            : "text-gray-600 hover:text-indigo-600 hover:font-medium transition-all duration-200";
    };

    const isMobileActive = (path) => {
        return location.pathname === path
            ? "text-indigo-600 font-semibold bg-indigo-50"
            : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-all duration-200";
    };

    return (
        <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    
                    {/* Brand Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                            KatalogKITA
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`pb-1 ${isActive("/")}`}>
                            Home
                        </Link>
                        <Link to="/products" className={`pb-1 ${isActive("/products")}`}>
                            Katalog
                        </Link>
                        <Link to="/about" className={`pb-1 ${isActive("/about")}`}>
                            Tentang Kami
                        </Link>
                        <Link to="/contact" className={`pb-1 ${isActive("/contact")}`}>
                            Kontak
                        </Link>
                    </div>

                    {/* Admin Portal Button */}
                    <div className="hidden md:block">
                        <Link 
                            to="/admin" 
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            Portal Admin
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {isOpen && (
                <div className="md:hidden border-b border-gray-100 bg-white transition duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2.5 rounded-md text-base ${isMobileActive("/")}`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2.5 rounded-md text-base ${isMobileActive("/products")}`}
                        >
                            Katalog
                        </Link>
                        <Link
                            to="/about"
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2.5 rounded-md text-base ${isMobileActive("/about")}`}
                        >
                            Tentang Kami
                        </Link>
                        <Link
                            to="/contact"
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2.5 rounded-md text-base ${isMobileActive("/contact")}`}
                        >
                            Kontak
                        </Link>
                        <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center mt-4 px-3 py-2.5 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow"
                        >
                            Portal Admin
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;