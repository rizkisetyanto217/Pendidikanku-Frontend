import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PublicUserDropdown from "./UserDropDown";
export default function PublicNavbar({ masjidName, masjidSlug, hideOnScroll = false, showLogin = true, // default: tampilkan login
loginEnabled = true, // default: tombol login aktif
 }) {
    const navigate = useNavigate();
    const { slug: slugFromParams } = useParams();
    // 🔁 Resolve slug dengan prioritas: props → useParams → pathname
    const resolvedSlug = useMemo(() => {
        if (masjidSlug && masjidSlug.trim())
            return masjidSlug.trim();
        if (slugFromParams && slugFromParams.trim())
            return slugFromParams.trim();
        const parts = window.location.pathname.split("/").filter(Boolean);
        // cari pola /masjid/:slug/...
        const masjidIdx = parts.indexOf("masjid");
        if (masjidIdx !== -1 && parts[masjidIdx + 1])
            return parts[masjidIdx + 1];
        return ""; // terakhir kalau benar2 ga ketemu
    }, [masjidSlug, slugFromParams]);
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: user, isLoading } = useCurrentUser();
    const isLoggedIn = !!user;
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        if (!hideOnScroll)
            return;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    setVisible(currentScrollY <= lastScrollY.current || currentScrollY < 80);
                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hideOnScroll]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                // setDropdownOpen(false); // kalau pakai state dropdown
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleLoginClick = () => {
        if (resolvedSlug) {
            navigate(`/masjid/${resolvedSlug}/login`);
        }
        else {
            // fallback aman kalau slug belum kebaca → arahkan ke /login umum
            console.warn("[PublicNavbar] masjidSlug unresolved, fallback to /login");
            navigate(`/login`);
        }
    };
    const willDisableLogin = !resolvedSlug || !loginEnabled; // ✅ gabung kondisi
    return (_jsxs("div", { className: `fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-3 shadow max-w-2xl mx-auto transition-transform duration-300 ${hideOnScroll && !visible ? "-translate-y-full" : "translate-y-0"}`, style: { backgroundColor: theme.white1, color: theme.black1 }, children: [_jsx("h2", { className: "text-lg font-semibold", children: masjidName }), _jsx("div", { className: "flex items-center gap-2", ref: dropdownRef, children: !isLoading && isLoggedIn ? (_jsx(PublicUserDropdown, {})) : showLogin ? ( // ✅ hanya render tombol login kalau showLogin = true
                _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: handleLoginClick, disabled: willDisableLogin, "aria-disabled": willDisableLogin, className: "text-sm font-semibold px-4 py-2 rounded-md shadow-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed", style: {
                                backgroundColor: theme.primary,
                                color: theme.white1,
                            }, title: willDisableLogin
                                ? !resolvedSlug
                                    ? "Menyiapkan halaman..."
                                    : "Login dimatikan untuk halaman ini"
                                : "Login", children: "Login" }), _jsx(PublicUserDropdown, { variant: "icon" })] })) : (
                // ✅ kalau showLogin = false, cukup icon menu saja (atau kosong)
                _jsx(PublicUserDropdown, { variant: "icon" })) })] }));
}
