import { Routes, Route } from "react-router-dom";
import ProductsManagement from "../admin/ProductsManagement";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Category from "../pages/Category";
import ProductDetail from "../pages/ProductDetail";

import Login from "../admin/Login";
import Dashboard from "../admin/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes(){

    return (
        <Routes>

            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category/:slug" element={<Category />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Admin Login */}
            <Route
                path="/admin/login"
                element={<Login />}
            />

            {/* Protected Admin */}
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

            <ProductsManagement />

            </ProtectedRoute>

            }

            />

        </Routes>
    );
}

export default AppRoutes;