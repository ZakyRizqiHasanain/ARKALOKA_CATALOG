import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");

    if (!token || !admin) {
        return <Navigate to="/admin/login" replace />;
    }

    try {
        const parsedAdmin = JSON.parse(admin);
        if (parsedAdmin.role !== "admin") {
            return <Navigate to="/admin/login" replace />;
        }
    } catch (e) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default ProtectedRoute;