import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Project" },
    { to: "/categories", label: "Layanan" },
    { to: "/about", label: "About" },
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
            ? "text-[#8C6A4A] font-bold border-b-2 border-[#8C6A4A]"
            : "text-[#9A8F81] hover:text-[#8C6A4A] font-medium transition-colors duration-200";

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
            className={`w-full sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-lg border-b border-[#E8CBA6] transition-shadow duration-300 ${
                scrolled ? "shadow-md shadow-[#4E3A2C]/5" : "shadow-sm"
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
                        <span className="text-xl font-black text-[#4E3A2C] tracking-wider uppercase">
                            ARKALOKA
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link key={to} to={to} className={`text-sm pb-1 ${isActive(to)}`}>
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
                                    placeholder="Cari project..."
                                    className="w-52 px-4 py-2 text-sm border border-[#E8CBA6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/70"
                                />
                                <button
                                    type="submit"
                                    className="px-3.5 py-2 bg-[#8C6A4A] text-[#FBF7F1] rounded-xl text-sm font-semibold hover:bg-[#4E3A2C] transition-colors"
                                >
                                    Cari
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchOpen(false)}
                                    className="text-[#9A8F81] hover:text-[#4E3A2C] text-lg px-1"
                                >
                                    ✕
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 text-[#9A8F81] hover:text-[#8C6A4A] hover:bg-[#E8CBA6]/40 rounded-xl transition-colors"
                                title="Cari project"
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
                            className="p-2 text-[#9A8F81] hover:text-[#8C6A4A] rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-[#9A8F81] hover:text-[#8C6A4A] rounded-xl hover:bg-[#E8CBA6]/40 transition-colors"
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
                                placeholder="Cari project..."
                                className="flex-1 px-4 py-2.5 text-sm border border-[#E8CBA6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C6A4A] bg-[#FBF7F1] text-[#4E3A2C] placeholder-[#9A8F81]/70"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] rounded-xl text-sm font-semibold"
                            >
                                Cari
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden bg-[#FFFFFF] border-t border-[#E8CBA6] shadow-xl">
                    <div className="px-4 py-4 space-y-1">
                        {NAV_LINKS.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    location.pathname === to
                                        ? "bg-[#E8CBA6]/40 text-[#8C6A4A] font-bold"
                                        : "text-[#4E3A2C] hover:bg-[#FBF7F1] hover:text-[#8C6A4A]"
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