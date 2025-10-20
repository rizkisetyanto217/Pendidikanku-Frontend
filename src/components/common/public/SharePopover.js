import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import { Share } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function SharePopover({ title, url, position = "right", customClassName = "", forceCustom = false, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [showMenu, setShowMenu] = useState(false);
    const ref = useRef(null);
    const handleClick = () => {
        if (!forceCustom && navigator.share) {
            navigator.share({ title, url });
        }
        else {
            setShowMenu(!showMenu);
        }
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        alert("Link berhasil disalin!");
    };
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);
    return (_jsxs("div", { className: `relative ${customClassName}`, ref: ref, children: [_jsxs("button", { onClick: handleClick, className: "flex items-center space-x-1 text-sm", style: { color: theme.quaternary }, children: [_jsx(Share, { size: 16 }), _jsx("span", { children: "Bagikan" })] }), showMenu && (_jsxs("div", { className: `absolute z-50 mt-2 p-3 border rounded shadow w-64 ${position === "left" ? "left-0" : "right-0"}`, style: {
                    backgroundColor: theme.white1,
                    borderColor: theme.silver1,
                    zIndex: 9999, // Penting!
                }, children: [_jsx("p", { className: "text-xs mb-2", style: { color: theme.black2 }, children: "Bagikan link:" }), _jsx("input", { type: "text", readOnly: true, value: url, className: "w-full text-xs p-1 border rounded mb-2", style: {
                            backgroundColor: theme.white3,
                            borderColor: theme.silver1,
                            color: theme.black1,
                        } }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: handleCopy, className: "text-sm font-semibold hover:underline", style: { color: theme.success1 }, children: "Salin Link" }), _jsx("a", { href: `https://wa.me/?text=${encodeURIComponent(`Assalamualaikum! Lihat ini yuk: ${title} — ${url}`)}`, target: "_blank", rel: "noopener noreferrer", className: "text-sm font-semibold hover:underline", style: { color: theme.success1 }, children: "WhatsApp" })] })] }))] }));
}
