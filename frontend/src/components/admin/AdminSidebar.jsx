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
        // Hapus token DAN data admin (sesuai ProtectedRoute yang cek keduanya)
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        navigate("/admin/login");
    };

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-100 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">
                        PS
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">Product Store</p>
                        <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-5 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                    Menu
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
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`}
                        >
                            <span className="text-base">{icon}</span>
                            {label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-4 py-5 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-150"
                >
                    <span className="text-base">🚪</span>
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;