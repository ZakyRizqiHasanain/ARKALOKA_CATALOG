import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const formatRupiah = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n);

    const imageUrl =
        product.gambar ||
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60";

    const isActive = product.status === "active";

    return (
        <Link
            to={`/products/${product.id}`}
            className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3] bg-gray-50">
                <img
                    src={imageUrl}
                    alt={product.nama_produk}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src =
                            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60";
                    }}
                />

                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-indigo-50">
                    {product.category || "Umum"}
                </span>

                {/* Status badge (only show if inactive) */}
                {!isActive && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        Non-aktif
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-5 gap-2">
                <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
                    {product.nama_produk}
                </h3>

                <p className="text-indigo-700 font-extrabold text-lg leading-tight">
                    {formatRupiah(product.harga)}
                </p>

                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                    {product.deskripsi || "Tidak ada deskripsi untuk produk ini."}
                </p>

                <div className="pt-2 mt-auto">
                    <span className="w-full text-center inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                        Lihat Detail →
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;