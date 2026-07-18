import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";

function Home() {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);
    const [errorProducts, setErrorProducts] = useState(null);

    useEffect(() => {
        // Fetch categories
        getCategories()
            .then(data => {
                setCategories(data);
                setErrorCategories(null);
            })
            .catch(err => {
                console.error("Error categories:", err);
                setErrorCategories("Gagal memuat kategori produk.");
            })
            .finally(() => {
                setLoadingCategories(false);
            });

        // Fetch featured products (limit to 4)
        getProducts({ limit: 4 })
            .then(data => {
                setFeaturedProducts(data.products || []);
                setErrorProducts(null);
            })
            .catch(err => {
                console.error("Error products:", err);
                setErrorProducts("Gagal memuat produk pilihan.");
            })
            .finally(() => {
                setLoadingProducts(false);
            });
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <Hero />

            {/* popular categories Section */}
            <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12">
                    <div>
                        <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
                            Temukan Kategori Anda
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                            Pilih Kategori Produk
                        </h2>
                    </div>
                </div>

                {loadingCategories ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="h-44 bg-gray-200 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : errorCategories ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600">
                        {errorCategories}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </section>

            {/* Featured Products Section */}
            <section className="max-w-7xl mx-auto px-6 py-8 md:py-12">
                <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8">
                    <div>
                        <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
                            Koleksi Terpopuler
                        </span>
                        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
                            Produk Pilihan
                        </h2>
                    </div>
                    <Link
                        to="/products"
                        className="text-indigo-600 hover:text-indigo-700 font-bold text-sm mt-2 sm:mt-0 flex items-center transition-colors duration-200"
                    >
                        Lihat semua produk &rarr;
                    </Link>
                </div>

                {loadingProducts ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-96 animate-pulse">
                                <div className="aspect-video bg-gray-200"></div>
                                <div className="p-5 space-y-4 flex-grow">
                                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="space-y-2 pt-2 flex-grow">
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                    <div className="h-10 bg-gray-200 rounded-xl pt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : errorProducts ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600">
                        {errorProducts}
                    </div>
                ) : featuredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
                        Belum ada produk yang tersedia.
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;