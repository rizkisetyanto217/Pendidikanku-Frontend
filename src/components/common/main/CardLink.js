import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function CartLink({ label, icon, href, internal = true, onClick, }) {
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 1. Jika ada onClick, panggil itu
        if (onClick) {
            onClick();
            return;
        }
        // 2. Kalau tidak ada onClick, gunakan href
        if (!href)
            return;
        if (internal) {
            navigate(href);
        }
        else {
            window.open(href, "_blank", "noopener noreferrer");
        }
    };
    return (_jsxs("div", { onClick: handleClick, className: "cursor-pointer flex items-center justify-between p-3 rounded hover:opacity-90 transition-all", style: {
            backgroundColor: theme.white2,
            border: `1px solid ${theme.silver1}`,
        }, children: [_jsxs("span", { className: "flex items-center space-x-2", children: [_jsx("span", { children: icon }), _jsx("span", { style: { color: theme.black1 }, children: label })] }), _jsx("span", { style: { color: theme.silver4 }, children: "\u203A" })] }));
}
