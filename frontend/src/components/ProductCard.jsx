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
            className="group flex flex-col h-full bg-[#21150F] rounded-2xl border border-[#3D281C] shadow-md hover:shadow-2xl hover:border-[#B87333]/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3] bg-[#140D09]">
                <img
                    src={imageUrl}
                    alt={product.nama_produk}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src =
                            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60";
                    }}
                />

                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-[#140D09]/80 backdrop-blur-md text-[#D19A6A] text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-[#3D281C]">
                    {product.category || "Umum"}
                </span>

                {/* Status badge (only show if inactive) */}
                {!isActive && (
                    <span className="absolute top-3 right-3 bg-red-900/80 border border-red-700 text-red-200 text-xs font-bold px-2 py-1 rounded-md">
                        Non-aktif
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-5 gap-2">
                <h3 className="font-bold text-[#F5E9DC] text-base line-clamp-1 group-hover:text-[#D19A6A] transition-colors duration-200">
                    {product.nama_produk}
                </h3>

                <p className="text-[#D19A6A] font-extrabold text-lg leading-tight">
                    {formatRupiah(product.harga)}
                </p>

                <p className="text-sm text-[#B8A08C] line-clamp-2 leading-relaxed flex-grow">
                    {product.deskripsi || "Tidak ada deskripsi untuk produk ini."}
                </p>

                <div className="pt-2 mt-auto">
                    <span className="w-full text-center inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl text-[#D19A6A] bg-[#2C1D16] border border-[#3D281C] group-hover:bg-[#B87333] group-hover:text-[#F5E9DC] group-hover:border-transparent transition-all duration-300">
                        Lihat Detail →
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;