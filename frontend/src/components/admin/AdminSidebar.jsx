import { NavLink, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
    { to: "/admin", label: "Dashboard", icon: "📊", exact: true },
    { to: "/admin/products", label: "Produk", icon: "📦" },
    { to: "/admin/categories", label: "Kategori", icon: "🏷️" },
];

function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        navigate("/admin/login");
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-[#21150F] border-r border-[#3D281C] min-h-screen flex flex-col text-[#F5E9DC]">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-[#3D281C]">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="ARKALOKA Logo"
                        className="w-9 h-9 object-contain"
                    />
                    <div>
                        <p className="font-black text-[#F5E9DC] text-sm leading-tight uppercase tracking-wider">
                            ARKALOKA
                        </p>
                        <p className="text-xs text-[#D19A6A] font-semibold">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-5 space-y-1">
                <p className="text-xs font-bold text-[#B8A08C] uppercase tracking-widest px-3 mb-3">
                    Menu Admin
                </p>
                {NAV_ITEMS.map(({ to, label, icon, exact }) => {
                    const isActive = exact
                        ? location.pathname === to
                        : location.pathname.startsWith(to);
                    return (
                        <NavLink
                            key={to}
                            to={to}
                            end={exact}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? "bg-[#B87333] text-[#F5E9DC] shadow-md font-bold"
                                    : "text-[#B8A08C] hover:bg-[#2C1D16] hover:text-[#F5E9DC]"
                            }`}
                        >
                            <span className="text-base">{icon}</span>
                            {label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-4 py-5 border-t border-[#3D281C]">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all duration-150"
                >
                    <span className="text-base">🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;