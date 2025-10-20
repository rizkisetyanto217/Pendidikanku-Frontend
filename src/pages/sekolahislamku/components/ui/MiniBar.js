import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function MiniBar({ palette, label, value, total, height = 8, radius = 9999, showPercent = true, showFraction = false, animated = true, trackColor, barColor, ariaLabel = "Progress", }) {
    const safeTotal = total > 0 ? total : 0;
    const pct = safeTotal > 0 ? Math.round((value / safeTotal) * 100) : 0;
    const clampedPct = Math.max(0, Math.min(100, pct));
    const rightText = showPercent
        ? `${clampedPct}%`
        : showFraction
            ? `${value}/${safeTotal}`
            : undefined;
    return (_jsxs("div", { children: [(label || rightText) && (_jsxs("div", { className: "mb-1 flex items-center justify-between text-xs", children: [_jsx("span", { style: { color: palette.silver2 }, children: label }), rightText && (_jsx("span", { style: { color: palette.silver2 }, children: rightText }))] })), _jsx("div", { className: "w-full overflow-hidden", role: "progressbar", "aria-label": ariaLabel, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": clampedPct, style: {
                    height,
                    borderRadius: radius,
                    background: trackColor ?? palette.white2,
                }, title: showPercent ? `${clampedPct}%` : undefined, children: _jsx("div", { className: animated
                        ? "h-full transition-[width] duration-300 ease-out"
                        : "h-full", style: {
                        width: `${clampedPct}%`,
                        background: barColor ?? palette.primary,
                        borderRadius: radius,
                    } }) })] }));
}
