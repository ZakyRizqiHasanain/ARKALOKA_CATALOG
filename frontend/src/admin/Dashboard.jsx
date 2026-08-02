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
    "#8C6A4A",
    "#C79E72",
    "#E8CBA6",
    "#4E3A2C",
];

const safeFormatRupiah = (val) => {
    if (val === null || val === undefined || isNaN(val) || val === "") {
        return "Belum tersedia";
    }
    const num = Number(val);
    if (isNaN(num)) return "Belum tersedia";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(num);
};

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
            <div className="bg-[#FBF7F1] border border-[#E8CBA6] rounded-xl shadow-lg px-4 py-3 text-sm text-[#4E3A2C]">
                <p className="font-bold text-[#4E3A2C] mb-1">{label}</p>
                <p className="text-[#8C6A4A] font-bold">{payload[0].value} project</p>
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#FBF7F1] border border-[#E8CBA6] rounded-xl shadow-lg px-4 py-3 text-sm text-[#4E3A2C]">
                <p className="font-bold text-[#4E3A2C]">{payload[0].name}</p>
                <p className="text-[#8C6A4A] font-bold">{payload[0].value} project</p>
            </div>
        );
    }
    return null;
};

function SkeletonCard() {
    return (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm p-6 flex items-start gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-[#E8CBA6]/30 flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-3 bg-[#E8CBA6]/30 rounded w-1/2" />
                <div className="h-8 bg-[#E8CBA6]/30 rounded w-1/3" />
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

    const chartData = (stats?.productsByCategory || stats?.categoryStats || []).map((item) => ({
        name: item.category || item.category_name || item.name || "Kategori",
        value: Number(item.total ?? item.product_count ?? item.value ?? 0),
    }));

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-[#FFFFFF] rounded-2xl border border-red-200 shadow-lg p-10 text-center space-y-4 max-w-md">
                        <span className="text-5xl">⚠️</span>
                        <h2 className="text-xl font-bold text-[#4E3A2C]">Gagal Memuat Dashboard</h2>
                        <p className="text-red-700 text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-5 py-2 bg-[#8C6A4A] hover:bg-[#4E3A2C] text-[#FBF7F1] text-sm font-semibold rounded-lg transition-colors"
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
            <div className="space-y-8 text-[#4E3A2C]">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-black text-[#4E3A2C]">Dashboard ARKALOKA</h1>
                        <p className="text-sm text-[#9A8F81] mt-0.5">
                            Selamat datang kembali
                            {admin?.name ? (
                                <span className="font-bold text-[#4E3A2C]"> {admin.name}</span>
                            ) : (
                                ", Admin"
                            )}
                            👋
                        </p>
                    </div>
                    <span className="text-xs text-[#8C6A4A] bg-[#FFFFFF] border border-[#E8CBA6] rounded-full px-3 py-1 font-semibold self-start sm:self-center">
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
                                description="Seluruh project terdaftar"
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
                    <div className="lg:col-span-2 bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-[#4E3A2C]">Project per Kategori</h3>
                                <p className="text-xs text-[#9A8F81]">Distribusi jumlah project berdasarkan kategori</p>
                            </div>
                            <span className="text-xs font-bold bg-[#FBF7F1] border border-[#E8CBA6] text-[#8C6A4A] px-2.5 py-1 rounded-lg">
                                Bar Chart
                            </span>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-[#E8CBA6]/30 rounded-xl animate-pulse" />
                        ) : chartData.length === 0 ? (
                            <div className="h-64 flex items-center justify-center text-[#9A8F81] text-sm">
                                Belum ada data kategori
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E8CBA6" strokeOpacity={0.6} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: "#4E3A2C", fontSize: 11 }}
                                            angle={-15}
                                            textAnchor="end"
                                        />
                                        <YAxis tick={{ fill: "#4E3A2C", fontSize: 11 }} allowDecimals={false} />
                                        <Tooltip content={<CustomBarTooltip />} />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Pie chart */}
                    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm p-6 space-y-4">
                        <div>
                            <h3 className="font-bold text-[#4E3A2C]">Proporsi Kategori</h3>
                            <p className="text-xs text-[#9A8F81]">Persentase distribusi project</p>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-[#E8CBA6]/30 rounded-xl animate-pulse" />
                        ) : chartData.length === 0 ? (
                            <div className="h-64 flex items-center justify-center text-[#9A8F81] text-sm">
                                Belum ada data.
                            </div>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={75}
                                            innerRadius={40}
                                            paddingAngle={4}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`pie-cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                        <Legend tick={{ fill: "#4E3A2C", fontSize: 11 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8CBA6] shadow-sm p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-[#4E3A2C]">Project Terbaru</h3>
                            <p className="text-xs text-[#9A8F81]">5 project terakhir yang ditambahkan ke sistem</p>
                        </div>
                        <a
                            href="/admin/products"
                            className="text-xs font-bold text-[#8C6A4A] hover:text-[#4E3A2C] hover:underline transition-colors"
                        >
                            Lihat semua →
                        </a>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-10 bg-[#E8CBA6]/30 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : !stats?.recentProducts || stats.recentProducts.length === 0 ? (
                        <p className="text-sm text-[#9A8F81] py-8 text-center">Belum ada project.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#FBF7F1] text-xs font-bold text-[#4E3A2C] uppercase tracking-wider border-b border-[#E8CBA6]">
                                        <th className="px-4 py-3 text-left">Nama Project</th>
                                        <th className="px-4 py-3 text-left">Kategori</th>
                                        <th className="px-4 py-3 text-left">Estimasi Biaya</th>
                                        <th className="px-4 py-3 text-right">Dibuat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E8CBA6]">
                                    {stats.recentProducts.map((prod) => (
                                        <tr key={prod.id} className="hover:bg-[#FBF7F1]/60 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-[#4E3A2C]">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={prod.gambar || "/logo.png"}
                                                        alt={prod.nama_produk || prod.name || "ARKALOKA Project"}
                                                        className="w-8 h-8 rounded-lg object-cover bg-[#FBF7F1] border border-[#E8CBA6]"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = "/logo.png";
                                                        }}
                                                    />
                                                    <span className="line-clamp-1">
                                                        {prod.nama_produk || prod.name || "Project ARKALOKA"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-block bg-[#FBF7F1] border border-[#E8CBA6] text-[#8C6A4A] text-xs font-bold px-2.5 py-1 rounded-md">
                                                    {prod.kategori || prod.category || "—"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-[#8C6A4A]">
                                                {safeFormatRupiah(prod.harga ?? prod.price)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-[#9A8F81]">
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