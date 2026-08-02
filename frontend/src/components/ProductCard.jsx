import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const formatRupiah = (n) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(n);

    const imageUrl = product.gambar || "/logo.png";
    const isActive = product.status === "active";

    return (
        <Link
            to={`/products/${product.id}`}
            className="group flex flex-col h-full bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm hover:shadow-xl hover:border-[#8C6A4A] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3] bg-[#FBF7F1]">
                <img
                    src={imageUrl}
                    alt={product.nama_produk || "ARKALOKA Project"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/logo.png";
                    }}
                />

                {/* Kategori Layanan badge */}
                <span className="absolute top-3 left-3 bg-[#C79E72] text-[#4E3A2C] text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-[#E8CBA6]">
                    {product.category || "Web Development"}
                </span>

                {/* Status badge */}
                {!isActive && (
                    <span className="absolute top-3 right-3 bg-red-800 text-white text-xs font-bold px-2 py-1 rounded-md">
                        Selesai
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-5 gap-2">
                <h3 className="font-bold text-[#4E3A2C] text-base line-clamp-1 group-hover:text-[#8C6A4A] transition-colors duration-200">
                    {product.nama_produk}
                </h3>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9A8F81] font-medium uppercase tracking-wider">Estimasi Project</span>
                    <p className="text-[#8C6A4A] font-extrabold text-sm leading-tight">
                        {product.harga ? formatRupiah(product.harga) : "Custom Pricing"}
                    </p>
                </div>

                <p className="text-sm text-[#9A8F81] line-clamp-2 leading-relaxed flex-grow">
                    {product.deskripsi || "Solusi pengerjaan project IT dan pembuatan website profesional."}
                </p>

                <div className="pt-2 mt-auto">
                    <span className="w-full text-center inline-flex items-center justify-center px-4 py-2.5 text-sm font-bold rounded-xl text-[#FBF7F1] bg-[#8C6A4A] border border-transparent group-hover:bg-[#4E3A2C] transition-all duration-300 shadow-sm">
                        Detail Project →
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;