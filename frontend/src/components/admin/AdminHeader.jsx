import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
    "/admin": "Dashboard",
    "/admin/products": "Manajemen Project",
    "/admin/categories": "Manajemen Kategori",
    "/admin/users": "Manajemen Pengguna",
};

function AdminHeader() {
    const location = useLocation();
    const title = PAGE_TITLES[location.pathname] || "Admin";

    const adminJson = localStorage.getItem("admin");
    const admin = adminJson ? JSON.parse(adminJson) : null;

    return (
        <header className="bg-[#FFFFFF] border-b border-[#E8CBA6] px-8 py-4 flex items-center justify-between text-[#4E3A2C]">
            <div>
                <h2 className="font-extrabold text-[#4E3A2C] text-lg">{title}</h2>
                <p className="text-xs text-[#9A8F81] mt-0.5 font-medium">
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
                    <p className="text-sm font-bold text-[#4E3A2C]">
                        {admin?.name || "Administrator"}
                    </p>
                    <p className="text-xs text-[#9A8F81] font-semibold">ARKALOKA Admin</p>
                </div>
                <div className="w-9 h-9 bg-[#8C6A4A] rounded-full flex items-center justify-center text-[#FBF7F1] font-bold text-sm shadow-sm border border-[#E8CBA6]">
                    {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;