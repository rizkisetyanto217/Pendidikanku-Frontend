import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/common/public/MainNavbar.tsx
import { useEffect, useMemo, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { colors } from "@/constants/colorsThema";
import useHtmlDarkMode from "@/hooks/userHTMLDarkMode";
import masjid from "@/assets/Gambar-Masjid.jpeg";
/* ================= NAV ITEMS ================= */
const navItems = [
    { label: "Beranda", to: "/website", end: true },
    { label: "Dukungan", to: "/website/dukungan" },
    { label: "Panduan", to: "/website/panduan" },
    { label: "Fitur", to: "/website/fitur" },
    { label: "Tentang", to: "/website/about" },
    { label: "Kontak", to: "/website/hubungi-kami" },
];
/* ================= NAV ITEM LINK ================= */
function NavItemLink({ to, label, color, primary, end, onClick, }) {
    return (_jsx(NavLink, { to: to, end: end, onClick: onClick, className: "relative text-sm font-medium group", children: ({ isActive }) => (_jsxs("span", { className: "inline-block py-2 text-base", style: { color }, children: [label, _jsx("span", { className: "absolute left-0 right-0 -bottom-1 h-0.5 rounded-full transition-all duration-200 ease-out", style: {
                        backgroundColor: primary,
                        opacity: isActive ? 1 : 0,
                        transform: `scaleX(${isActive ? 1 : 0.25})`,
                        transformOrigin: "left",
                    } }), !isActive && (_jsx("span", { className: "absolute left-0 right-0 -bottom-1 h-px rounded-full transition-opacity duration-200 ease-out opacity-0 group-hover:opacity-40", style: { backgroundColor: primary } }))] })) }));
}
/* ================= NAVBAR ================= */
export default function WebsiteNavbar() {
    const { isDark } = useHtmlDarkMode();
    const theme = isDark ? colors.dark : colors.light;
    const [dark, setDark] = useState(isDark);
    useEffect(() => setDark(isDark), [isDark]);
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    /* scroll detector */
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);
    /* theme toggle */
    const toggleTheme = () => {
        const root = document.documentElement;
        const next = !dark;
        setDark(next);
        if (next) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };
    const iconColor = useMemo(() => ({ color: theme.black1 }), [theme]);
    return (_jsxs("nav", { className: `fixed top-0 inset-x-0 z-50 transition-all duration-300 w-full ${scrolled ? "backdrop-blur border-b" : "bg-transparent"}`, style: {
            backgroundColor: scrolled
                ? dark
                    ? theme.white2
                    : theme.white1
                : "transparent",
            borderColor: theme.white3, // border tipis
        }, children: [_jsxs("div", { className: "w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16", children: [_jsxs(NavLink, { to: "/website", end: true, className: "flex items-center gap-2 font-bold text-lg", children: [_jsx("img", { src: masjid, alt: "Logo", className: "h-12 w-12 rounded-full object-cover" }), _jsx("span", { style: { color: theme.black1 }, children: "SekolahIslamku" })] }), _jsx("div", { className: "hidden md:flex items-center gap-8", children: navItems.map((item) => (_jsx(NavItemLink, { to: item.to, end: item.end, label: item.label, color: theme.black1, primary: theme.primary }, item.label))) }), _jsxs("div", { className: "hidden md:flex items-center gap-2", children: [_jsx("button", { onClick: toggleTheme, className: "p-2 rounded-lg transition hover:opacity-80", "aria-label": dark ? "Switch to light mode" : "Switch to dark mode", style: {
                                    background: dark ? theme.white2 : theme.white1,
                                    ...iconColor,
                                }, children: dark ? _jsx(Sun, { className: "h-5 w-5" }) : _jsx(Moon, { className: "h-5 w-5" }) }), _jsx(NavLink, { to: "/website/daftar-sekarang", className: "rounded-full px-4 py-2 text-sm font-medium transition hover:opacity-90", style: { backgroundColor: theme.primary, color: theme.white1 }, children: "Daftar Sekarang" })] }), _jsxs("div", { className: "md:hidden flex items-center gap-2", children: [_jsx("button", { onClick: toggleTheme, className: "p-2 rounded-lg transition hover:opacity-80", style: {
                                    background: dark ? theme.white2 : theme.white1,
                                    ...iconColor,
                                }, children: dark ? _jsx(Sun, { className: "h-5 w-5" }) : _jsx(Moon, { className: "h-5 w-5" }) }), _jsx("button", { className: "p-2 rounded-lg", onClick: () => setOpen(!open), style: iconColor, children: open ? _jsx(X, { className: "h-6 w-6" }) : _jsx(Menu, { className: "h-6 w-6" }) })] })] }), open && (_jsxs("div", { className: "md:hidden flex flex-col gap-3 px-6 py-4 w-full", style: {
                    backgroundColor: dark ? theme.white2 : theme.white1,
                    borderTop: `1px solid ${theme.white3}`,
                }, children: [navItems.map((item) => (_jsx(NavItemLink, { to: item.to, end: item.end, label: item.label, color: theme.black1, primary: theme.primary, onClick: () => setOpen(false) }, item.label))), _jsx(NavLink, { to: "/website/daftar-sekarang", className: "mt-2 rounded-full px-4 py-2 text-center text-sm font-medium transition hover:opacity-90 w-full", style: { backgroundColor: theme.primary, color: theme.white1 }, onClick: () => setOpen(false), children: "Daftar Sekarang" })] }))] }));
}
