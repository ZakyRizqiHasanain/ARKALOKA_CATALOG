import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(number);
    };

    // Fallback image if no image URL is provided
    const imageUrl = product.gambar || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60";

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
            
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-video bg-gray-50 flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={product.nama_produk}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                
                {/* Category Tag */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-indigo-50">
                    {product.category || "Umum"}
                </span>
            </div>

            {/* Content Body */}
            <div className="flex flex-col flex-grow p-5 space-y-3">
                <h3 className="font-bold text-slate-800 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
                    {product.nama_produk}
                </h3>
                
                <p className="text-slate-900 font-extrabold text-base">
                    {formatRupiah(product.harga)}
                </p>
                
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                    {product.deskripsi || "Tidak ada deskripsi tersedia untuk produk ini."}
                </p>

                {/* Footer Action */}
                <div className="pt-2">
                    <Link
                        to={`/product/${product.id}`}
                        className="w-full text-center inline-flex items-center justify-center px-4 py-2.5 border border-indigo-100 text-sm font-semibold rounded-xl text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    >
                        Lihat Detail
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default ProductCard;