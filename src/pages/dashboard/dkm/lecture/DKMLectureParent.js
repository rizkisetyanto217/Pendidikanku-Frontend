import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from "react-router-dom";
import { BookOpen, Star } from "lucide-react";
import DashboardSidebar from "@/components/common/navigation/SidebarMenu";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function DKMLectureParent() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const location = useLocation();
    const sidebarMenus = [
        { name: "Terbaru", icon: _jsx(BookOpen, {}), to: "/dkm/kajian" },
        { name: "Tema", icon: _jsx(Star, {}), to: "/dkm/tema" },
    ];
    return (_jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "w-full md:w-64 shrink-0", children: _jsx(DashboardSidebar, { menus: sidebarMenus, title: "Kajian" }) }), _jsx("div", { className: "flex-1", children: _jsx("div", { className: "p-6 rounded-xl shadow-sm", style: { backgroundColor: theme.white1, color: theme.black1 }, children: _jsx(Outlet, {}) }) })] }));
}
