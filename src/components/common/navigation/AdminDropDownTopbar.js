import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
// ⬇️ ganti import: pakai helper logout dari axios
import { apiLogout } from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useCurrentUser } from "@/hooks/useCurrentUser";
export default function UserDropdown() {
    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: user } = useCurrentUser();
    const userName = user?.user_name || "User";
    // const userRole = user?.role || "Role";
    const handleLogout = async () => {
        setIsLoggingOut(true);
        setOpen(false); // tutup dropdown lebih cepat untuk UX
        try {
            // ⬇️ ini saja cukup; helper akan coba call /api/logout dan tetap clear token meski 403
            await apiLogout();
            console.log("✅ Logout selesai (best-effort)");
        }
        catch (err) {
            console.error("Logout error (diabaikan, token sudah dibersihkan):", err);
        }
        finally {
            // ⛔️ tidak perlu `localStorage.clear()`/`sessionStorage.clear()` (terlalu agresif)
            // apiLogout() sudah membersihkan token & broadcast event.
            navigate("/login", { replace: true });
        }
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsxs("button", { onClick: () => setOpen(!open), className: "flex items-center gap-2 p-2 rounded-md transition", style: { backgroundColor: open ? theme.white2 : "transparent" }, children: [_jsx("img", { src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><circle cx='16' cy='16' r='16' fill='%23CCCCCC' /></svg>", alt: "Profile", className: "w-8 h-8 rounded-full" }), _jsx("div", { className: "text-left text-sm hidden sm:block", children: _jsx("div", { className: "font-semibold", style: { color: theme.black1 }, children: userName }) })] }), open && (_jsx("div", { className: "absolute right-0 mt-2 w-48 rounded-lg border z-50", style: {
                    backgroundColor: theme.white1,
                    borderColor: theme.silver1,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }, children: _jsxs("ul", { className: "py-2 text-sm", style: { color: theme.black1 }, children: [_jsx("li", { children: _jsxs("button", { onClick: () => navigate("/profil"), className: "w-full flex items-center gap-2 px-4 py-2 text-left transition", style: { backgroundColor: "transparent" }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = theme.white2), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = "transparent"), children: [_jsx(User, { className: "w-4 h-4" }), " Profil"] }) }), _jsx("li", { children: _jsxs("button", { onClick: () => navigate("/dkm/profil-saya"), className: "w-full flex items-center gap-2 px-4 py-2 text-left transition", style: { backgroundColor: "transparent" }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = theme.white2), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = "transparent"), children: [_jsx(Settings, { className: "w-4 h-4" }), " Pengaturan"] }) }), _jsx("li", { children: _jsxs("button", { onClick: () => navigate("/bantuan"), className: "w-full flex items-center gap-2 px-4 py-2 text-left transition", style: { backgroundColor: "transparent" }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = theme.white2), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = "transparent"), children: [_jsx(HelpCircle, { className: "w-4 h-4" }), " Bantuan"] }) }), _jsx("li", { children: _jsx("button", { onClick: handleLogout, disabled: isLoggingOut, className: "w-full flex items-center gap-2 px-4 py-2 text-left transition disabled:opacity-60 disabled:cursor-not-allowed", style: { color: theme.error1, backgroundColor: "transparent" }, onMouseOver: (e) => (e.currentTarget.style.backgroundColor = theme.error2), onMouseOut: (e) => (e.currentTarget.style.backgroundColor = "transparent"), children: isLoggingOut ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", fill: "none", style: { color: theme.error1 }, children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 11-8 8z" })] }), _jsx("span", { children: "Keluar..." })] })) : (_jsxs(_Fragment, { children: [_jsx(LogOut, { className: "w-4 h-4" }), " Keluar"] })) }) })] }) }))] }));
}
