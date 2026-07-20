import { Link } from "react-router-dom";

function CategoryCard({ category }) {
    const imageUrl =
        category.gambar ||
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=60";

    return (
        <Link
            to={`/categories/${category.slug}`}
            className="group relative flex flex-col h-44 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-[#3D281C] bg-[#21150F]"
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#140D09] via-[#140D09]/50 to-transparent group-hover:from-[#140D09]/90 transition-colors duration-300 z-10" />

            {/* Background image */}
            <img
                src={imageUrl}
                alt={category.nama_kategori}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                loading="lazy"
                onError={(e) => {
                    e.target.style.display = "none";
                }}
            />

            {/* Text overlay */}
            <div className="relative z-20 flex flex-col justify-end h-full p-4 text-[#F5E9DC]">
                <h3 className="font-bold text-base leading-tight tracking-wide group-hover:text-[#D19A6A] group-hover:translate-x-1 transition-all duration-300">
                    {category.nama_kategori}
                </h3>
                <span className="text-xs text-[#D19A6A] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                    Lihat Produk →
                </span>
            </div>
        </Link>
    );
}

export default CategoryCard;