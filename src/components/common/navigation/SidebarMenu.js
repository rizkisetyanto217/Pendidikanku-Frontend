import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, Link, matchPath } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function SidebarMenu({ menus, title = "Beranda", }) {
    const location = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { className: "hidden md:block w-64 rounded-xl p-4 shadow-sm transition-colors", style: {
            position: "sticky",
            top: "1rem", // jarak dari atas saat sticky (misal 16px)
            backgroundColor: theme.white1,
            color: theme.black1,
        }, children: [_jsx("h2", { className: "text-xl font-semibold mb-4", style: { color: theme.primary }, children: title }), _jsx("ul", { className: "space-y-2", children: menus.map((menu) => {
                    const active = !!matchPath({ path: menu.to + "/*" }, location.pathname) ||
                        location.pathname === menu.to;
                    const bg = active ? theme.primary2 : "transparent";
                    const textColor = active ? theme.primary : theme.silver2;
                    return (_jsxs(Link, { to: menu.to, className: `flex items-center justify-between px-4 py-2 rounded-lg text-md transition font-medium
                ${active ? "bg-teal-600 text-white" : "text-gray-500 hover:bg-teal-200 dark:hover:bg-teal-700 dark:text-gray-300"}`, style: { backgroundColor: bg, color: textColor }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-lg", children: menu.icon }), _jsx("span", { children: menu.name })] }), menu.badge !== undefined && (_jsx("span", { className: "text-xs px-2 py-0.5 rounded-full font-semibold", style: {
                                    backgroundColor: theme.primary,
                                    color: theme.white1,
                                }, children: menu.badge }))] }, menu.to));
                }) })] }));
}
