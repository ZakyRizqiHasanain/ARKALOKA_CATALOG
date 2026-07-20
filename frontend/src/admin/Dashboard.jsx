import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    PieChart,
    Pie,
    Legend,
} from "recharts";
import AdminLayout from "../components/admin/AdminLayout";
import OverviewCard from "../components/admin/OverviewCard";
import { getDashboardStats, getAdminData } from "../services/adminService";

const CHART_COLORS = [
    "#B87333",
    "#D19A6A",
    "#E5B27F",
    "#10b981",
    "#f59e0b",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
];

const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#21150F] border border-[#3D281C] rounded-xl shadow-lg px-4 py-3 text-sm text-[#F5E9DC]">
                <p className="font-semibold text-[#F5E9DC] mb-1">{label}</p>
                <p className="text-[#D19A6A] font-bold">{payload[0].value} produk</p>
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#21150F] border border-[#3D281C] rounded-xl shadow-lg px-4 py-3 text-sm text-[#F5E9DC]">
                <p className="font-semibold text-[#F5E9DC]">{payload[0].name}</p>
                <p className="text-[#D19A6A] font-bold">{payload[0].value} produk</p>
            </div>
        );
    }
    return null;
};

function SkeletonCard() {
    return (
        <div className="bg-[#21150F] rounded-2xl border border-[#3D281C] shadow-sm p-6 flex items-start gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-[#2C1D16] flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-3 bg-[#2C1D16] rounded w-1/2" />
                <div className="h-8 bg-[#2C1D16] rounded w-1/3" />
            </div>
        </div>
    );
}

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const admin = getAdminData();

    useEffect(() => {
        setLoading(true);
        getDashboardStats()
            .then((data) => {
                setStats(data);
                setError(null);
            })
            .catch((err) => {
                console.error("Dashboard stats error:", err);
                setError(err.message || "Gagal memuat data dashboard.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-[#21150F] rounded-2xl border border-red-900/50 shadow-lg p-10 text-center space-y-4 max-w-md">
                        <span className="text-5xl">⚠️</span>
                        <h2 className="text-xl font-bold text-[#F5E9DC]">Gagal Memuat Dashboard</h2>
                        <p className="text-red-400 text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-5 py-2 bg-[#B87333] hover:bg-[#A05E22] text-[#F5E9DC] text-sm font-semibold rounded-lg transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 text-[#F5E9DC]">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-black text-[#F5E9DC]">Dashboard ARKALOKA</h1>
                        <p className="text-sm text-[#B8A08C] mt-0.5">
                            Selamat datang kembali
                            {admin?.name ? (
                                <span className="font-semibold text-[#D19A6A]"> {admin.name}</span>
                            ) : (
                                ", Admin"
                            )}
                            👋
                        </p>
                    </div>
                    <span className="text-xs text-[#B8A08C] bg-[#21150F] border border-[#3D281C] rounded-full px-3 py-1 self-start sm:self-center">
                        {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {loading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : (
                        <>
                            <OverviewCard
                                title="Total Produk"
                                value={stats?.totalProducts}
                                icon="📦"
                                accentColor="brand"
                                description="Seluruh produk dalam katalog"
                            />
                            <OverviewCard
                                title="Total Kategori"
                                value={stats?.totalCategories}
                                icon="🏷️"
                                accentColor="amber"
                                description="Kategori terdaftar"
                            />
                            <OverviewCard
                                title="Total Pengguna"
                                value={stats?.totalUsers}
                                icon="👤"
                                accentColor="emerald"
                                description="Admin terdaftar"
                            />
                        </>
                    )}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar chart */}
                    <div className="lg:col-span-2 bg-[#21150F] rounded-2xl border border-[#3D281C] shadow-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-[#F5E9DC]">Produk per Kategori</h3>
                                <p className="text-xs text-[#B8A08C]">Distribusi jumlah produk berdasarkan kategori</p>
                            </div>
                            <span className="text-xs font-semibold bg-[#140D09] border border-[#3D281C] text-[#D19A6A] px-2.5 py-1 rounded-lg">
                                Bar Chart
                            </span>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-[#2C1D16] rounded-xl animate-pulse" />
                        ) : !stats?.categoryStats || stats.categoryStats.length === 0 ? (
                            <div className="h-64 flex items-center justify-center text-[#B8A08C] text-sm">
                                Belum ada data kategori.
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#3D281C" />
                                        <XAxis
                                            dataKey="category_name"
                                            tick={{ fill: "#B8A08C", fontSize: 11 }}
                                            angle={-15}
                                            textAnchor="end"
                                        />
                                        <YAxis tick={{ fill: "#B8A08C", fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip content={<CustomBarTooltip />} />
                                        <Bar dataKey="product_count" radius={[8, 8, 0, 0]}>
                                            {stats.categoryStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Pie chart */}
                    <div className="bg-[#21150F] rounded-2xl border border-[#3D281C] shadow-md p-6 space-y-4">
                        <div>
                            <h3 className="font-bold text-[#F5E9DC]">Proporsi Kategori</h3>
                            <p className="text-xs text-[#B8A08C]">Persentase distribusi produk</p>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-[#2C1D16] rounded-xl animate-pulse" />
                        ) : !stats?.categoryStats || stats.categoryStats.length === 0 ? (
                            <div className="h-64 flex items-center justify-center text-[#B8A08C] text-sm">
                                Belum ada data.
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.categoryStats}
                                            dataKey="product_count"
                                            nameKey="category_name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={75}
                                            innerRadius={40}
                                            paddingAngle={4}
                                        >
                                            {stats.categoryStats.map((entry, index) => (
                                                <Cell key={`pie-cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                        <Legend tick={{ fill: "#B8A08C", fontSize: 11 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Products */}
                <div className="bg-[#21150F] rounded-2xl border border-[#3D281C] shadow-md p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-[#F5E9DC]">Produk Terbaru</h3>
                            <p className="text-xs text-[#B8A08C]">5 produk terakhir yang ditambahkan ke sistem</p>
                        </div>
                        <a
                            href="/admin/products"
                            className="text-xs font-semibold text-[#D19A6A] hover:underline transition-colors"
                        >
                            Lihat semua →
                        </a>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 bg-[#2C1D16] rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : !stats?.recentProducts || stats.recentProducts.length === 0 ? (
                        <p className="text-sm text-[#B8A08C] py-8 text-center">Belum ada produk.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#140D09] text-xs font-semibold text-[#B8A08C] uppercase tracking-wider">
                                        <th className="px-4 py-3 text-left">Nama Produk</th>
                                        <th className="px-4 py-3 text-left">Kategori</th>
                                        <th className="px-4 py-3 text-left">Harga</th>
                                        <th className="px-4 py-3 text-right">Dibuat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#3D281C]">
                                    {stats.recentProducts.map((prod) => (
                                        <tr key={prod.id} className="hover:bg-[#2C1D16] transition-colors">
                                            <td className="px-4 py-3 font-medium text-[#F5E9DC] line-clamp-1">
                                                {prod.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-block bg-[#140D09] border border-[#3D281C] text-[#D19A6A] text-xs font-semibold px-2.5 py-1 rounded-md">
                                                    {prod.category || "—"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-[#D19A6A]">
                                                {formatRupiah(prod.price)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-[#B8A08C]">
                                                {formatDate(prod.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    );
}

export default Dashboard;