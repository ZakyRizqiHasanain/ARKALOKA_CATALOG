import { NavLink, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
    { to: "/admin", label: "Dashboard", icon: "📊", exact: true },
    { to: "/admin/products", label: "Project", icon: "📦" },
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
        <aside className="w-64 flex-shrink-0 bg-[#4E3A2C] border-r border-[#E8CBA6]/30 min-h-screen flex flex-col text-[#FBF7F1]">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-[#E8CBA6]/30">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="ARKALOKA Logo"
                        className="w-9 h-9 object-contain"
                    />
                    <div>
                        <p className="font-black text-[#FBF7F1] text-sm leading-tight uppercase tracking-wider">
                            ARKALOKA
                        </p>
                        <p className="text-xs text-[#FBF7F1]/80 font-semibold">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-5 space-y-1">
                <p className="text-xs font-bold text-[#FBF7F1]/80 uppercase tracking-widest px-3 mb-3">
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
                                    ? "bg-[#C79E72] text-[#4E3A2C] shadow-md font-bold"
                                    : "text-[#FBF7F1]/90 hover:bg-[#8C6A4A] hover:text-[#FBF7F1]"
                            }`}
                        >
                            <span className="text-base">{icon}</span>
                            {label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-4 py-5 border-t border-[#E8CBA6]/30">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-200 hover:bg-red-900/40 hover:text-white transition-all duration-150"
                >
                    <span className="text-base">🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;