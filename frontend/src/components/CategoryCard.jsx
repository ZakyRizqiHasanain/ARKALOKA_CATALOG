import { Link } from "react-router-dom";

function CategoryCard({ category }) {
    const imageUrl = category.gambar || "/logo.png";

    return (
        <Link
            to={`/categories/${category.slug}`}
            className="group relative flex flex-col h-44 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#E8CBA6] hover:border-[#8C6A4A] bg-[#FFFFFF]"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#4E3A2C]/85 via-[#4E3A2C]/40 to-transparent group-hover:from-[#8C6A4A]/90 transition-colors duration-300 z-10" />

            <img
                src={imageUrl}
                alt={category.nama_kategori || "Kategori ARKALOKA"}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/logo.png";
                }}
            />

            <div className="relative z-20 flex flex-col justify-end h-full p-4 text-[#FBF7F1]">
                <h3 className="font-bold text-base leading-tight tracking-wide group-hover:text-[#FBF7F1] group-hover:translate-x-1 transition-all duration-300">
                    {category.nama_kategori}
                </h3>
                <span className="text-xs text-[#FBF7F1]/90 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                    Lihat Project →
                </span>
            </div>
        </Link>
    );
}

export default CategoryCard;