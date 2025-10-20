import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function LectureMaterialMonthList({ data, onSelectMonth, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    // ✅ Fungsi bantu untuk ubah "2025-07" → "Juli 2025"
    const formatMonthYear = (input) => {
        const [year, month] = input.split("-");
        const monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];
        const monthIndex = parseInt(month, 10) - 1;
        return `${monthNames[monthIndex]} ${year}`;
    };
    return (_jsx("div", { className: "space-y-2", children: data.map((item) => (_jsxs("div", { onClick: () => onSelectMonth(item.month), className: "p-3 rounded-md flex justify-between items-center cursor-pointer transition-all", style: {
                backgroundColor: theme.white1,
                border: `1px solid ${theme.silver1}`,
            }, children: [_jsxs("div", { children: [_jsxs("p", { className: "font-semibold", style: { color: theme.black1 }, children: [formatMonthYear(item.month), " "] }), _jsxs("p", { className: "text-xs", style: { color: theme.silver2 }, children: [item.total, " Kajian"] })] }), _jsx("span", { style: { color: theme.silver2 }, children: "\u203A" })] }, item.month))) }));
}
