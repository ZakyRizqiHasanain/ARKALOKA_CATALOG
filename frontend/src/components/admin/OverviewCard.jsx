// OverviewCard — stat card untuk 4 Marked Green Colors theme
function OverviewCard({ title, value, icon, accentColor = "brand", description }) {

    const colorMap = {
        brand: {
            bg: "bg-[#FBF7F1]",
            border: "border-[#E8CBA6]",
            text: "text-[#4E3A2C]",
        },
        indigo: {
            bg: "bg-[#FBF7F1]",
            border: "border-[#E8CBA6]",
            text: "text-[#8C6A4A]",
        },
        emerald: {
            bg: "bg-[#FBF7F1]",
            border: "border-emerald-200",
            text: "text-emerald-800",
        },
        amber: {
            bg: "bg-[#FBF7F1]",
            border: "border-amber-200",
            text: "text-amber-800",
        },
    };

    const colors = colorMap[accentColor] || colorMap.brand;

    return (
        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E8CBA6] p-6 flex items-start gap-4 hover:border-[#8C6A4A] transition-colors duration-200">
            {/* Icon Badge */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${colors.bg} ${colors.border}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#9A8F81] truncate">{title}</p>
                <p className={`text-3xl font-black mt-1 ${colors.text}`}>
                    {value ?? "—"}
                </p>
                {description && (
                    <p className="text-xs text-[#9A8F81] mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}

export default OverviewCard;