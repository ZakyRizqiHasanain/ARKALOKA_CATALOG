import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Categories from "../pages/Categories";
import CategoryPage from "../pages/CategoryPage";

// Admin auth
import Login from "../admin/Login";
import ProtectedRoute from "../components/ProtectedRoute";

// Admin pages
import Dashboard from "../admin/Dashboard";
import AdminProductsPage from "../pages/admin/Products";
import AdminCategoriesPage from "../pages/admin/Categories";

function AppRoutes() {
    return (
        <Routes>
            {/* ── Public Routes ─────────────────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />

            {/* ── Admin Login ───────────────────────────────────── */}
            <Route path="/admin/login" element={<Login />} />

            {/* ── Protected Admin Routes ────────────────────────── */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/products"
                element={
                    <ProtectedRoute>
                        <AdminProductsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/categories"
                element={
                    <ProtectedRoute>
                        <AdminCategoriesPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;