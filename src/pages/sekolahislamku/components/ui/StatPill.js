import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function StatPill({ palette, label, value, icon, tooltip, className = "", onClick, }) {
    const Wrapper = onClick ? "button" : "div";
    return (_jsxs(Wrapper, { onClick: onClick, title: tooltip, className: `p-3 rounded-xl border text-left ${onClick ? "cursor-pointer" : ""} ${className}`, style: { borderColor: palette.silver1, background: palette.white2 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [icon, _jsx("div", { className: "text-xs", style: { color: palette.silver2 }, children: label })] }), _jsx("div", { className: "text-lg font-semibold", children: value })] }));
}
