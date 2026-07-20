import { useLocation } from "react-router-dom";

// Peta path ke judul halaman
const PAGE_TITLES = {
    "/admin": "Dashboard",
    "/admin/products": "Manajemen Produk",
    "/admin/categories": "Manajemen Kategori",
    "/admin/users": "Manajemen Pengguna",
};

function AdminHeader() {
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || "Admin";

    // Ambil nama admin dari localStorage
    const adminJson = localStorage.getItem("admin");
    const admin = adminJson ? JSON.parse(adminJson) : null;

    return (
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
            <div>
                <h2 className="font-bold text-gray-900">{title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                    {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800">
                        {admin?.name || "Administrator"}
                    </p>
                    <p className="text-xs text-gray-400">Admin</p>
                </div>
                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;