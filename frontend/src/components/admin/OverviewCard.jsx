// OverviewCard — stat card untuk Dark Luxury theme
function OverviewCard({ title, value, icon, accentColor = "brand", description }) {

    const colorMap = {
        brand: {
            bg: "bg-[#140D09]",
            border: "border-[#3D281C]",
            text: "text-[#D19A6A]",
        },
        indigo: {
            bg: "bg-[#140D09]",
            border: "border-[#3D281C]",
            text: "text-[#D19A6A]",
        },
        emerald: {
            bg: "bg-[#140D09]",
            border: "border-emerald-900/50",
            text: "text-emerald-400",
        },
        amber: {
            bg: "bg-[#140D09]",
            border: "border-amber-900/50",
            text: "text-amber-400",
        },
    };

    const colors = colorMap[accentColor] || colorMap.brand;

    return (
        <div className="bg-[#21150F] rounded-2xl shadow-lg border border-[#3D281C] p-6 flex items-start gap-4 hover:border-[#B87333]/50 transition-colors duration-200">
            {/* Icon Badge */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${colors.bg} ${colors.border}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#B8A08C] truncate">{title}</p>
                <p className={`text-3xl font-black mt-1 ${colors.text}`}>
                    {value ?? "—"}
                </p>
                {description && (
                    <p className="text-xs text-[#B8A08C]/80 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}

export default OverviewCard;