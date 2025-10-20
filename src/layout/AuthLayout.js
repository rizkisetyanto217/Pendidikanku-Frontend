import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/layout/AuthLayout.tsx
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// ⬇️ Import modal pilihan pendaftaran (bukan role)
import RegisterChoiceModal from "@/pages/dashboard/auth/components/RegisterModalChoice";
export default function AuthLayout({ children, mode = "login", fullWidth = false, contentClassName = "", }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const isLogin = mode === "login";
    const navigate = useNavigate();
    const [openChoice, setOpenChoice] = useState(false);
    const handleOpenChoice = useCallback((e) => {
        e.preventDefault(); // cegah Link langsung pindah halaman
        setOpenChoice(true);
    }, []);
    // ⬇️ Handler netral: map pilihan ke rute register
    const handleSelectChoice = useCallback((choice) => {
        setOpenChoice(false);
        if (choice === "school") {
            navigate("/register-sekolah");
        }
        else {
            navigate("/register-user");
        }
    }, [navigate]);
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center w-full", style: {
            background: isDark
                ? `linear-gradient(180deg, ${theme.white1} 0%, ${theme.white2} 100%)`
                : `linear-gradient(180deg, ${theme.white2} 0%, ${theme.white1} 100%)`,
            color: theme.black1,
        }, children: [_jsxs("div", { className: [
                    "rounded-xl shadow-md w-full border",
                    fullWidth ? "max-w-none px-4 sm:px-6 lg:px-8 py-8" : "max-w-md p-8",
                    contentClassName,
                ].join(" "), style: { backgroundColor: theme.white1, borderColor: theme.white3 }, children: [children, _jsx("div", { className: "mt-6 text-center", children: _jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: isLogin ? (_jsxs(_Fragment, { children: ["Belum punya akun?", " ", _jsx(Link, { to: "/register", onClick: handleOpenChoice, className: "hover:underline", style: { color: theme.primary }, children: "Daftar" })] })) : (_jsxs(_Fragment, { children: ["Sudah punya akun?", " ", _jsx(Link, { to: "/login", className: "hover:underline", style: { color: theme.primary }, children: "Login" })] })) }) })] }), isLogin && (_jsx(RegisterChoiceModal, { open: openChoice, onClose: () => setOpenChoice(false), onSelect: handleSelectChoice }))] }));
}
