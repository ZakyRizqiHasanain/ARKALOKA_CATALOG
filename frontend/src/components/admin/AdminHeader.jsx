import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
    "/admin": "Dashboard",
    "/admin/products": "Manajemen Produk",
    "/admin/categories": "Manajemen Kategori",
    "/admin/users": "Manajemen Pengguna",
};

function AdminHeader() {
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || "Admin";

    const adminJson = localStorage.getItem("admin");
    const admin = adminJson ? JSON.parse(adminJson) : null;

    return (
        <header className="bg-[#21150F] border-b border-[#3D281C] px-8 py-4 flex items-center justify-between text-[#F5E9DC]">
            <div>
                <h2 className="font-bold text-[#F5E9DC] text-lg">{title}</h2>
                <p className="text-xs text-[#B8A08C] mt-0.5">
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
                    <p className="text-sm font-semibold text-[#F5E9DC]">
                        {admin?.name || "Administrator"}
                    </p>
                    <p className="text-xs text-[#D19A6A] font-semibold">ARKALOKA Admin</p>
                </div>
                <div className="w-9 h-9 bg-[#B87333] rounded-full flex items-center justify-center text-[#F5E9DC] font-bold text-sm shadow-md">
                    {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;