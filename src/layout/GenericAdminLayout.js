import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/layout/GenericAdminLayout.tsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminTopbar from "@/components/common/navigation/AdminTopbar";
import MobileSidebar from "@/components/common/navigation/MobileSidebar";
import Sidebar from "@/components/common/navigation/Sidebar";
import useHtmlThema from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
export default function GenericAdminLayout({ desktopSidebar, mobileSidebar, topbarTitle, }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isDark, themeName } = useHtmlThema();
    const theme = pickTheme(themeName, isDark);
    const isDashboard = location.pathname.endsWith("/");
    return (_jsxs("div", { className: "min-h-screen flex relative", style: { backgroundColor: theme.white2, overflow: "visible" }, children: [_jsx("div", { className: "hidden md:flex md:h-screen", children: _jsx(Sidebar, { items: desktopSidebar }) }), _jsx(MobileSidebar, { isOpen: isOpen, onClose: () => setIsOpen(false), items: mobileSidebar }), _jsxs("main", { className: "flex-1 flex flex-col overflow-auto", children: [_jsx(AdminTopbar, { onMenuClick: () => setIsOpen(true), title: topbarTitle }), _jsx("div", { className: isDashboard ? "p-8" : "p-4", children: _jsx(Outlet, {}) })] })] }));
}
