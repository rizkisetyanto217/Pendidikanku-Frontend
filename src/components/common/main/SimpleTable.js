import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function SimpleTable({ columns, rows, onRowClick, emptyText = "Belum ada data.", }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-full overflow-x-auto hidden xl:block", children: _jsxs("table", { className: "min-w-[600px] w-full text-sm border rounded-lg overflow-hidden", style: { borderColor: theme.silver1 }, children: [_jsx("thead", { style: { backgroundColor: theme.success2 }, children: _jsx("tr", { children: columns.map((col, idx) => (_jsx("th", { className: "px-4 py-2 text-left whitespace-nowrap", style: { color: theme.black2 }, children: col }, idx))) }) }), _jsx("tbody", { children: rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "text-center px-4 py-6", style: { color: theme.silver2 }, children: emptyText }) })) : (rows.map((cells, rowIndex) => (_jsx("tr", { className: "border-t hover:cursor-pointer transition", style: { borderColor: theme.silver1 }, onClick: () => onRowClick?.(rowIndex), onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = theme.white3), onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = "transparent"), children: cells.map((cell, cellIndex) => (_jsx("td", { className: "px-4 py-2 align-top max-w-[200px]", style: {
                                        color: theme.black1,
                                        backgroundColor: "transparent",
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                    }, children: _jsx("div", { className: "flex flex-wrap gap-1", style: {
                                            display: typeof cell === "string" ? "-webkit-box" : "flex",
                                            WebkitLineClamp: typeof cell === "string" ? 3 : "unset",
                                            WebkitBoxOrient: "vertical",
                                            overflow: typeof cell === "string" ? "hidden" : "unset",
                                            textOverflow: "ellipsis",
                                        }, children: cell }) }, cellIndex))) }, rowIndex)))) })] }) }), _jsx("div", { className: "xl:hidden space-y-4", children: rows.length === 0 ? (_jsx("div", { className: "text-center text-sm py-4", style: { color: theme.silver2 }, children: emptyText })) : (rows.map((cells, rowIndex) => (_jsx("div", { className: "rounded-xl p-4 border space-y-2", style: {
                        borderColor: theme.silver1,
                        backgroundColor: theme.white1,
                    }, onClick: () => onRowClick?.(rowIndex), children: cells.map((cell, cellIndex) => {
                        // Gabung kolom 0 (No) dan kolom 2 (Deskripsi atau teks)
                        if (cellIndex === 0) {
                            const no = cell;
                            const deskripsi = cells[2]; // kolom ke-3
                            return (_jsxs("div", { className: "text-sm font-medium", style: { color: theme.black1 }, children: [no, ". ", deskripsi] }, `mobile-combined-${rowIndex}`));
                        }
                        // Skip kolom ke-2 karena sudah ditampilkan
                        if (cellIndex === 2)
                            return null;
                        return (_jsx("div", { className: "text-sm", style: { color: theme.black1 }, children: cell }, cellIndex));
                    }) }, rowIndex)))) })] }));
}
