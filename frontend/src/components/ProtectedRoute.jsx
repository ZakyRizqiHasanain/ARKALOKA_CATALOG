import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");

    if (
        !token ||
        !admin ||
        token === "undefined" ||
        admin === "undefined" ||
        token === "null" ||
        admin === "null"
    ) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        return <Navigate to="/admin/login" replace />;
    }

    try {
        const parsedAdmin = JSON.parse(admin);
        if (!parsedAdmin || typeof parsedAdmin !== "object" || parsedAdmin.role !== "admin") {
            localStorage.removeItem("token");
            localStorage.removeItem("admin");
            return <Navigate to="/admin/login" replace />;
        }
    } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}

export default ProtectedRoute;