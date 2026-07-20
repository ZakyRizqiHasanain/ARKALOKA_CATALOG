import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout({ children }) {
    return (
        <div className="min-h-screen flex bg-[#140D09] text-[#F5E9DC]">
            <AdminSidebar />
            <div className="flex-1 min-w-0">
                <AdminHeader />
                <main className="p-8 bg-[#140D09] min-h-[calc(100vh-73px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;