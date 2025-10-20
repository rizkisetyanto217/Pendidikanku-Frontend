import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SekolahIslamkuRegister.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, BookOpen, Calendar, ArrowRight, PlayCircle, X, } from "lucide-react";
import WebsiteNavbar from "@/components/common/public/WebsiteNavbar";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import WebsiteFooter from "../components/MasjidkuWebFooter";
/* Helpers layout */
const FullBleed = ({ className = "", children, }) => (_jsx("div", { className: `relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`, children: children }));
const Section = ({ id, className = "", children }) => (_jsx("section", { id: id, className: `px-4 sm:px-6 lg:px-8 ${className}`, children: _jsx("div", { className: "w-full", children: children }) }));
/* Intro Modal */
const IntroModal = ({ open, onClose, onProceed }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [agree, setAgree] = useState(false);
    // lock scroll + esc
    useEffect(() => {
        if (!open)
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0", style: {
                    backgroundColor: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(3px)",
                }, onClick: onClose }), _jsxs("div", { role: "dialog", "aria-modal": "true", className: "relative w-[92%] max-w-2xl rounded-3xl p-5 ring-1 shadow-xl", style: {
                    backgroundColor: theme.white1,
                    borderColor: theme.white3,
                    color: theme.black1,
                }, children: [_jsx("button", { onClick: onClose, "aria-label": "Tutup", className: "absolute top-3 right-3 p-2 rounded-xl transition hover:opacity-80", style: { color: theme.black1 }, children: _jsx(X, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "h-11 w-11 rounded-2xl grid place-items-center shrink-0", style: { backgroundColor: theme.primary2, color: theme.primary }, children: _jsx(ShieldCheck, { className: "h-5 w-5" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "text-xl font-bold", children: "Selamat Datang di SekolahIslamku Suite" }), _jsxs("p", { className: "mt-1 text-sm", style: { color: theme.silver2 }, children: ["Platform end-to-end untuk digitalisasi sekolah:", " ", _jsx("strong", { children: "PPDB" }), ", ", _jsx("strong", { children: "Akademik" }), ",", " ", _jsx("strong", { children: "Absensi" }), ", ", _jsx("strong", { children: "Keuangan" }), ", hingga", " ", _jsx("strong", { children: "Komunikasi" }), " orang tua\u2014terpusat dan aman."] }), _jsx("div", { className: "mt-4 grid sm:grid-cols-3 gap-2", children: [
                                            { icon: Users, text: "PPDB Online" },
                                            { icon: BookOpen, text: "Rapor Digital" },
                                            { icon: Calendar, text: "Jadwal & Presensi" },
                                        ].map((x) => (_jsxs("div", { className: "rounded-2xl px-3 py-2 ring-1 text-sm flex items-center gap-2", style: {
                                                borderColor: theme.white3,
                                                backgroundColor: theme.white2,
                                            }, children: [_jsx(x.icon, { className: "h-4 w-4" }), x.text] }, x.text))) }), _jsxs("label", { className: "mt-4 flex items-start gap-2 text-sm select-none", children: [_jsx("input", { type: "checkbox", className: "mt-1", checked: agree, onChange: (e) => setAgree(e.target.checked) }), _jsxs("span", { style: { color: theme.black1 }, children: ["Saya telah membaca & menyetujui", " ", _jsx("a", { href: "/terms", target: "_blank", rel: "noreferrer", className: "underline", children: "Ketentuan Layanan" }), " ", "dan", " ", _jsx("a", { href: "/privacy", target: "_blank", rel: "noreferrer", className: "underline", children: "Kebijakan Privasi" }), "."] })] }), _jsxs("div", { className: "mt-5 flex flex-col sm:flex-row gap-2", children: [_jsxs("button", { disabled: !agree, onClick: onProceed, className: "inline-flex items-center justify-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md disabled:opacity-60", style: {
                                                    backgroundColor: theme.primary,
                                                    color: theme.white1,
                                                    borderColor: theme.primary,
                                                }, children: [_jsx(ArrowRight, { className: "h-4 w-4" }), "Lanjut ke Login/Register"] }), _jsxs("a", { href: "/demo", className: "inline-flex items-center justify-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition hover:opacity-90", style: {
                                                    color: theme.black1,
                                                    borderColor: theme.white3,
                                                    backgroundColor: isDark ? theme.white2 : "transparent",
                                                }, children: [_jsx(PlayCircle, { className: "h-4 w-4" }), "Lihat Demo"] })] })] })] })] })] }));
};
/* PAGE: Intro only → redirect to login/register */
export default function MasjidkuRegisterNow() {
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const bg = useMemo(() => isDark
        ? `linear-gradient(180deg, ${theme.white1} 0%, ${theme.white2} 100%)`
        : `linear-gradient(180deg, ${theme.white2} 0%, ${theme.white1} 100%)`, [isDark, theme]);
    const proceed = () => {
        // arahkan ke halaman login/register milikmu
        // ganti ke route yang kamu pakai (mis. "/auth/register" atau "/login?tab=register")
        navigate("/login?register=1");
    };
    // modal selalu tampil saat halaman dibuka
    const [open, setOpen] = useState(true);
    return (_jsx(FullBleed, { children: _jsxs("div", { className: "min-h-screen w-screen overflow-x-hidden", style: { background: bg, color: theme.black1 }, children: [_jsx(WebsiteNavbar, {}), _jsx("div", { style: { height: "5.5rem" } }), _jsxs("div", { className: "relative overflow-hidden", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2400&auto=format&fit=crop", alt: "Sekolah digital", className: "absolute inset-0 h-full w-full object-cover", style: { opacity: isDark ? 0.22 : 0.18 }, loading: "eager" }), _jsx(Section, { className: "relative py-20 sm:py-24 lg:py-28", children: _jsxs("div", { className: "max-w-3xl", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold", style: { color: theme.black1 }, children: "Mulai Digitalisasi Sekolah Anda" }), _jsxs("p", { className: "mt-3 text-sm md:text-base", style: { color: theme.silver2 }, children: ["Halaman ini hanya pengantar. Klik ", _jsx("strong", { children: "Lanjut" }), " di modal untuk menuju halaman ", _jsx("em", { children: "login/register" }), ", lalu selesaikan pendaftaran di sana."] }), _jsxs("button", { onClick: () => setOpen(true), className: "mt-6 inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: {
                                            backgroundColor: theme.primary,
                                            color: theme.white1,
                                            borderColor: theme.primary,
                                        }, children: [_jsx(ArrowRight, { className: "h-4 w-4" }), "Buka Modal Perkenalan"] })] }) })] }), _jsx(IntroModal, { open: open, onClose: () => setOpen(false), onProceed: proceed }), _jsx(WebsiteFooter, {})] }) }));
}
