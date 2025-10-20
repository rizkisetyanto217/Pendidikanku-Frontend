import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SidebarLink } from "./SidebarLink";
import clsx from "clsx";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function Sidebar({ items, isMobile = false, isOpen, onClose, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    if (isMobile && !isOpen)
        return null;
    const sidebarContent = (_jsxs("aside", { className: clsx("py-8 flex flex-col items-center space-y-6", isMobile ? "w-64 h-full animate-slide-in-left" : "w-28"), style: { backgroundColor: theme.primary2 }, onClick: (e) => isMobile && e.stopPropagation(), children: [_jsx("h1", { className: "text-xl font-bold", style: { color: theme.quaternary }, children: "Masjid" }), items.map((item) => (_jsx(SidebarLink, { text: item.text, icon: item.icon, to: item.to, activeBasePath: item.activeBasePath }, item.to)))] }));
    return sidebarContent;
}
