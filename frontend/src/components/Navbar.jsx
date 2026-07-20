import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Produk" },
    { to: "/categories", label: "Kategori" },
];

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setSearchOpen(false);
    }, [location]);

    useEffect(() => {
        if (searchOpen) searchRef.current?.focus();
    }, [searchOpen]);

    const isActive = (to) =>
        location.pathname === to
            ? "text-[#D19A6A] font-bold"
            : "text-[#B8A08C] hover:text-[#D19A6A] font-medium transition-colors duration-200";

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setSearchOpen(false);
        }
    };

    return (
        <nav
            className={`w-full sticky top-0 z-50 bg-[#21150F]/90 backdrop-blur-lg border-b border-[#3D281C] transition-shadow duration-300 ${
                scrolled ? "shadow-lg shadow-[#140D09]/50" : "shadow-sm"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-18">

                    {/* Brand Logo & Name */}
                    <Link
                        to="/"
                        className="flex-shrink-0 flex items-center gap-3 group"
                    >
                        <img
                            src="/logo.png"
                            alt="ARKALOKA Logo"
                            className="w-9 h-9 object-contain transform group-hover:scale-105 transition-transform"
                        />
                        <span className="text-xl font-black text-[#F5E9DC] tracking-wider uppercase">
                            ARKALOKA
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link key={to} to={to} className={`text-sm pb-0.5 ${isActive(to)}`}>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {searchOpen ? (
                            <form onSubmit={handleSearch} className="flex items-center gap-2">
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari produk..."
                                    className="w-52 px-4 py-2 text-sm border border-[#3D281C] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B87333] bg-[#140D09] text-[#F5E9DC] placeholder-[#B8A08C]"
                                />
                                <button
                                    type="submit"
                                    className="px-3.5 py-2 bg-[#B87333] text-[#F5E9DC] rounded-xl text-sm font-semibold hover:bg-[#A05E22] transition-colors"
                                >
                                    Cari
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="text-[#B8A08C] hover:text-[#F5E9DC] text-lg px-1"
                                >
                                    ✕
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 text-[#B8A08C] hover:text-[#D19A6A] hover:bg-[#2C1D16] rounded-xl transition-colors"
                                title="Cari produk"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Mobile: search + hamburger */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="p-2 text-[#B8A08C] hover:text-[#D19A6A] rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-[#B8A08C] hover:text-[#F5E9DC] rounded-xl hover:bg-[#2C1D16] transition-colors"
                        >
                            {isOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {searchOpen && (
                    <div className="md:hidden pb-3">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari produk..."
                                className="flex-1 px-4 py-2.5 text-sm border border-[#3D281C] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B87333] bg-[#140D09] text-[#F5E9DC] placeholder-[#B8A08C]"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-[#B87333] text-[#F5E9DC] rounded-xl text-sm font-semibold"
                            >
                                Cari
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden bg-[#21150F] border-t border-[#3D281C] shadow-xl">
                    <div className="px-4 py-4 space-y-1">
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    location.pathname === to
                                        ? "bg-[#2C1D16] text-[#D19A6A] font-bold"
                                        : "text-[#B8A08C] hover:bg-[#2C1D16] hover:text-[#F5E9DC]"
                                }`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;