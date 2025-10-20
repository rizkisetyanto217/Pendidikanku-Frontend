import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function MasjidFaqCategorySidebar({ categories, selected, onSelect, }) {
    const [isMobile, setIsMobile] = useState(false);
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    if (isMobile) {
        // ✅ Mobile horizontal scrollable tab style
        return (_jsx("div", { className: "mb-4 overflow-x-auto", children: _jsx("div", { className: "flex gap-2 w-max px-1", children: categories.map((cat) => (_jsx("button", { onClick: () => onSelect(cat), className: `px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${selected === cat
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-transparent text-gray-700 border-gray-300 hover:bg-teal-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-teal-800"}`, style: {
                        backgroundColor: selected === cat ? theme.primary : theme.white1,
                        color: selected === cat ? theme.white1 : theme.black1,
                        borderColor: selected === cat ? theme.secondary : theme.silver1,
                    }, children: cat }, cat))) }) }));
    }
    // 🖥️ Desktop vertical sidebar
    return (_jsx("div", { className: "rounded-xl border p-4 space-y-2", style: { backgroundColor: theme.white1, borderColor: theme.white3 }, children: categories.map((cat) => (_jsx("button", { onClick: () => onSelect(cat), className: `block w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${selected === cat
                ? "bg-teal-600 text-white"
                : "text-gray-700 hover:bg-teal-100 dark:text-gray-300 dark:hover:bg-teal-800"}`, style: {
                backgroundColor: selected === cat ? theme.primary : theme.white1,
                color: selected === cat ? theme.white1 : theme.black1,
            }, children: cat }, cat))) }));
}
