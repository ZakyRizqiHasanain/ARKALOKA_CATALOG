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

// ─── Palette untuk chart ───────────────────────────────────────────────────
const CHART_COLORS = [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#10b981", // emerald
    "#f59e0b", // amber
    "#3b82f6", // blue
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f97316", // orange
];

// ─── Format angka ke Rupiah ────────────────────────────────────────────────
const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);

// ─── Format tanggal ke ID locale ──────────────────────────────────────────
const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// ─── Custom Tooltip untuk BarChart ────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
                <p className="font-semibold text-gray-800 mb-1">{label}</p>
                <p className="text-indigo-600 font-bold">{payload[0].value} produk</p>
            </div>
        );
    }
    return null;
};

// ─── Custom Tooltip untuk PieChart ────────────────────────────────────────
const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
                <p className="font-semibold text-gray-800">{payload[0].name}</p>
                <p className="text-indigo-600 font-bold">{payload[0].value} produk</p>
            </div>
        );
    }
    return null;
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
        </div>
    );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────
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

    // ── Error State ──────────────────────────────────────────────────────
    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 text-center space-y-4 max-w-md">
                        <span className="text-5xl">⚠️</span>
                        <h2 className="text-xl font-bold text-gray-800">Gagal Memuat Dashboard</h2>
                        <p className="text-red-500 text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
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
            <div className="space-y-8">

                {/* ── Page Header ──────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Selamat datang kembali
                            {admin?.name ? (
                                <span className="font-semibold text-indigo-600"> {admin.name}</span>
                            ) : (
                                ", Admin"
                            )}
                            👋
                        </p>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1 self-start sm:self-center">
                        {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                </div>

                {/* ── Stat Cards ───────────────────────────────────────────── */}
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
                                accentColor="indigo"
                                description="Semua produk (aktif & non-aktif)"
                            />
                            <OverviewCard
                                title="Total Kategori"
                                value={stats?.totalCategories}
                                icon="🏷️"
                                accentColor="violet"
                                description="Kategori yang tersedia"
                            />
                            <OverviewCard
                                title="Total Admin"
                                value={stats?.totalUsers}
                                icon="👤"
                                accentColor="emerald"
                                description="Akun admin terdaftar"
                            />
                        </>
                    )}
                </div>

                {/* ── Charts & Recent Products (2-column on large screens) ── */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

                    {/* ─ Bar Chart: Produk per Kategori ─────────────────────── */}
                    <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="mb-6">
                            <h2 className="font-bold text-gray-900 text-base">
                                Produk per Kategori
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">Jumlah produk aktif di setiap kategori</p>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                        ) : stats?.productsByCategory?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart
                                    data={stats.productsByCategory}
                                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                                    barCategoryGap="35%"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                        interval={0}
                                        angle={-20}
                                        textAnchor="end"
                                        height={50}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#f1f5f9", radius: 6 }} />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                        {stats.productsByCategory.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                                Belum ada data kategori.
                            </div>
                        )}
                    </div>

                    {/* ─ Pie Chart: Distribusi Produk ──────────────────────── */}
                    <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="mb-6">
                            <h2 className="font-bold text-gray-900 text-base">Distribusi Produk</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Proporsi per kategori</p>
                        </div>

                        {loading ? (
                            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                        ) : stats?.productsByCategory?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={stats.productsByCategory}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={3}
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {stats.productsByCategory.map((_, index) => (
                                            <Cell
                                                key={`pie-${index}`}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                                Belum ada data.
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Recent Products Table ─────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-gray-900 text-base">Produk Terbaru</h2>
                            <p className="text-xs text-gray-400 mt-0.5">5 produk yang baru ditambahkan</p>
                        </div>
                        <a
                            href="/admin/products"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            Lihat semua →
                        </a>
                    </div>

                    {loading ? (
                        <div className="p-6 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded flex-1" />
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                    <div className="h-4 bg-gray-200 rounded w-20" />
                                    <div className="h-4 bg-gray-200 rounded w-16" />
                                </div>
                            ))}
                        </div>
                    ) : !stats?.recentProducts?.length ? (
                        <div className="p-12 text-center text-gray-400 text-sm">
                            <span className="text-3xl block mb-2">📭</span>
                            Belum ada produk.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3 text-left">Nama Produk</th>
                                        <th className="px-6 py-3 text-left">Kategori</th>
                                        <th className="px-6 py-3 text-left">Harga</th>
                                        <th className="px-6 py-3 text-left">Status</th>
                                        <th className="px-6 py-3 text-left">Tanggal Dibuat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {stats.recentProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            {/* Nama Produk */}
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-800">
                                                    {product.nama_produk}
                                                </span>
                                            </td>

                                            {/* Kategori */}
                                            <td className="px-6 py-4">
                                                <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                                                    {product.category}
                                                </span>
                                            </td>

                                            {/* Harga */}
                                            <td className="px-6 py-4 font-semibold text-gray-700">
                                                {formatRupiah(product.harga)}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        product.status === "active"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-red-100 text-red-600"
                                                    }`}
                                                >
                                                    {product.status === "active" ? "Aktif" : "Non-aktif"}
                                                </span>
                                            </td>

                                            {/* Tanggal */}
                                            <td className="px-6 py-4 text-gray-500">
                                                {formatDate(product.created_at)}
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