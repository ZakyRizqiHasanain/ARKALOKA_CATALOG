import { Link } from "react-router-dom";

function CategoryCard({ category }) {
    const imageUrl = category.gambar || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=60";

    return (
        <Link
            to={`/products?category=${category.slug}`}
            className="group relative flex flex-col h-44 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
            {/* Background Image overlay */}
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors duration-300 z-10"></div>
            <img
                src={imageUrl}
                alt={category.nama_kategori}
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
            />

            {/* Content overlay */}
            <div className="relative z-20 flex flex-col justify-end h-full p-5 text-white">
                <h3 className="font-bold text-lg leading-tight tracking-wide transform group-hover:translate-x-1 transition-transform duration-300">
                    {category.nama_kategori}
                </h3>
                <span className="text-xs text-gray-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Lihat Produk &rarr;
                </span>
            </div>
        </Link>
    );
}

export default CategoryCard;