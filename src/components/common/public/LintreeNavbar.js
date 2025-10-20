import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PublicUserDropdown from "@/components/common/public/UserDropDown";
export default function LinktreeNavbar({ brandName = "sekolahislamku", brandIconSrc, onBrandClick, coverOverlap = true, showMenu = true, menuSlot, maxWidthClass = "max-w-screen-xl", }) {
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [solid, setSolid] = useState(!coverOverlap);
    const ticking = useRef(false);
    useEffect(() => {
        if (!coverOverlap)
            return;
        const onScroll = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    setSolid(y > 8);
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [coverOverlap]);
    const containerClass = useMemo(() => {
        if (!coverOverlap)
            return "bg-white dark:bg-zinc-900 border-b";
        return solid
            ? "bg-white/90 dark:bg-zinc-900/70 border-b backdrop-blur-md"
            : "bg-transparent";
    }, [coverOverlap, solid]);
    const borderColor = theme.white3;
    const handleBrandClick = () => {
        if (onBrandClick)
            return onBrandClick();
        try {
            navigate("/");
        }
        catch {
            /* noop */
        }
    };
    return (_jsx("div", { className: "fixed top-0 left-0 right-0 z-50", children: _jsx("div", { className: `mx-auto w-full ${maxWidthClass} px-3 sm:px-4`, children: _jsxs("nav", { className: `mt-2 sm:mt-3 h-12 sm:h-14 grid grid-cols-[1fr_auto] items-center rounded-2xl transition-all ${containerClass}`, style: { borderColor }, "aria-label": "Linktree navbar", children: [_jsxs("button", { onClick: handleBrandClick, className: "flex items-center gap-2 pl-1 sm:pl-1.5 group", "aria-label": "Beranda sekolahislamku", title: brandName, style: { color: theme.black1 }, children: [brandIconSrc ? (_jsx("img", { src: brandIconSrc, alt: brandName, className: "h-8 w-8 rounded-full object-cover border", style: { borderColor } })) : (_jsx("div", { className: "h-8 w-8 rounded-full grid place-items-center text-xs font-bold border", style: {
                                    backgroundColor: theme.primary,
                                    color: theme.white1,
                                    borderColor: theme.primary,
                                }, children: "SI" })), _jsx("span", { className: "text-sm sm:text-base font-semibold", children: brandName })] }), _jsx("div", { className: "pr-1 sm:pr-1.5 flex items-center gap-1.5", children: showMenu
                            ? (menuSlot ?? _jsx(PublicUserDropdown, { variant: "icon" }))
                            : null })] }) }) }));
}
