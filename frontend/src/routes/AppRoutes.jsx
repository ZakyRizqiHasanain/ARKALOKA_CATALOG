import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Category from "../pages/Category";
import ProductDetail from "../pages/ProductDetail";


function AppRoutes(){

    return (
        <Routes>


        <Route
        path="/"
        element={<Home />}
        />


        <Route
        path="/products"
        element={<Products />}
        />


        <Route
        path="/category/:slug"
        element={<Category />}
        />


        <Route
        path="/product/:id"
        element={<ProductDetail />}
        />


        </Routes>

    )

}


export default AppRoutes;