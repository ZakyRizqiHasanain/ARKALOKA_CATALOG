import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

function AdminLayout({ children }) {
    return (
        <div className="min-h-screen flex bg-[#FBF7F1] text-[#4E3A2C]">
            <AdminSidebar />
            <div className="flex-1 min-w-0">
                <AdminHeader />
                <main className="p-8 bg-[#FBF7F1] min-h-[calc(100vh-73px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;