// OverviewCard — stat card dengan icon, warna aksen, dan animasi angka
function OverviewCard({ title, value, icon, accentColor = "indigo", description }) {

    const colorMap = {
        indigo: {
            bg: "bg-indigo-50",
            text: "text-indigo-600",
            badge: "bg-indigo-100",
        },
        emerald: {
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            badge: "bg-emerald-100",
        },
        violet: {
            bg: "bg-violet-50",
            text: "text-violet-600",
            badge: "bg-violet-100",
        },
        amber: {
            bg: "bg-amber-50",
            text: "text-amber-600",
            badge: "bg-amber-100",
        },
    };

    const colors = colorMap[accentColor] || colorMap.indigo;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
            {/* Icon Badge */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colors.bg}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                <p className={`text-3xl font-black mt-1 ${colors.text}`}>
                    {value ?? "—"}
                </p>
                {description && (
                    <p className="text-xs text-gray-400 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}

export default OverviewCard;