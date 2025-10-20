import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { SidebarLink } from "./SidebarLink";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import SidebarSubLink from "./SidebarSubLink";
export default function MobileSidebar({ items, isOpen, onClose, }) {
    const [expandedMenus, setExpandedMenus] = useState([]);
    const location = useLocation();
    // Reset + expand menu sesuai path saat sidebar dibuka
    useEffect(() => {
        if (!isOpen)
            return;
        const matchedParents = items
            .filter((item) => item.children?.some((child) => location.pathname.startsWith(child.to)))
            .map((item) => item.text);
        setExpandedMenus(matchedParents);
    }, [isOpen, items, location.pathname]);
    const toggleExpand = (label) => {
        setExpandedMenus((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]);
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex md:hidden", onClick: onClose, children: [_jsx("div", { className: "absolute inset-0 bg-black opacity-50" }), _jsxs("aside", { className: clsx("relative z-50 w-64 h-full py-8 px-4 animate-slide-in-left", "bg-teal-100 dark:bg-teal-900 flex flex-col space-y-4"), onClick: (e) => e.stopPropagation(), children: [_jsx("h1", { className: "text-sm font-bold text-blue-900 dark:text-blue-200 text-center mb-4", children: "MasjidKu" }), items.map((item) => item.children ? (_jsx(ExpandableMenu, { item: item, isExpanded: expandedMenus.includes(item.text), toggleExpand: toggleExpand, onClose: onClose }, item.text)) : (_jsx(SidebarLink, { text: item.text, icon: item.icon, to: item.to, isHorizontal: true, onClick: onClose }, item.to)))] })] }));
}
function ExpandableMenu({ item, isExpanded, toggleExpand, onClose, }) {
    const location = useLocation();
    const isChildActive = item.children?.some((child) => location.pathname.startsWith(child.to));
    return (_jsxs("div", { className: "w-full", children: [_jsxs("button", { onClick: () => toggleExpand(item.text), className: clsx("w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md", isChildActive
                    ? "bg-teal-600 text-white"
                    : " text-teal-900 dark:text-white"), children: [_jsxs("div", { className: "flex items-center space-x-2", children: [item.icon && _jsx("span", { className: "text-lg", children: item.icon }), _jsx("span", { children: item.text })] }), _jsx("span", { children: isExpanded ? "▾" : "▸" })] }), isExpanded && (_jsx("div", { className: "ml-6 mt-2 space-y-2", children: item.children?.map((child) => (_jsx(SidebarSubLink, { text: child.text, icon: child.icon, to: child.to, onClick: onClose }, child.to))) }))] }));
}
