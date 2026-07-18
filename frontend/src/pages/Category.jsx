import { Navigate, useParams } from "react-router-dom";

function Category() {
    const { slug } = useParams();
    return <Navigate to={`/products?category=${slug}`} replace />;
}

export default Category;