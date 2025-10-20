import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/NotFound.tsx
import { useState, useEffect } from "react";
import { Home, Search, ArrowLeft, Zap, Star } from "lucide-react";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { colors } from "@/constants/thema";
export default function NotFound() {
    const { isDark, themeName } = useHtmlDarkMode();
    // pilih palet sesuai themeName + mode
    const variant = colors[themeName] ?? colors.default;
    const theme = isDark ? variant.dark : variant.light;
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [glitchActive, setGlitchActive] = useState(false);
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        const glitchInterval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);
        }, 3000);
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", handleMouseMove);
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("mousemove", handleMouseMove);
            }
            clearInterval(glitchInterval);
        };
    }, []);
    const floatingElements = Array.from({ length: 6 }, (_, i) => (_jsx("div", { className: "absolute w-2 h-2 rounded-full animate-bounce opacity-70", style: {
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: "3s",
            background: `linear-gradient(90deg, ${theme.tertiary}, ${theme.quaternary})`,
            boxShadow: `0 0 10px ${theme.quaternary}55`,
        } }, i)));
    return (_jsxs("div", { className: "min-h-screen flex items-center justify-center relative overflow-hidden", style: {
            background: `linear-gradient(135deg, ${theme.white1}, ${theme.white2})`,
        }, children: [_jsx("div", { className: "absolute inset-0 pointer-events-none", style: {
                    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${theme.primary2}, transparent 50%)`,
                    opacity: 0.6,
                } }), floatingElements, _jsx("div", { className: "absolute inset-0 pointer-events-none", style: {
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                    mixBlendMode: isDark ? "overlay" : "multiply",
                    opacity: isDark ? 0.22 : 0.12,
                } }), _jsxs("div", { className: "text-center z-10 max-w-2xl mx-auto px-6", children: [_jsxs("div", { className: "relative mb-8 select-none", children: [_jsx("h1", { className: `text-9xl md:text-[12rem] font-black ${glitchActive ? "animate-pulse" : ""}`, style: {
                                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.tertiary}, ${theme.quaternary})`,
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                    textShadow: `0 6px 18px ${theme.quaternary}33`,
                                }, children: "404" }), glitchActive && (_jsxs(_Fragment, { children: [_jsx("h1", { className: "absolute top-0 left-0 text-9xl md:text-[12rem] font-black opacity-70", style: { color: theme.error1, filter: "blur(0.5px)" }, children: "404" }), _jsx("h1", { className: "absolute top-1 left-1 text-9xl md:text-[12rem] font-black opacity-60", style: { color: theme.quaternary }, children: "404" })] }))] }), _jsxs("div", { className: "mb-8 space-y-4", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4", style: { color: theme.black1 }, children: "Halaman Tidak Ditemukan" }), _jsx("p", { className: "text-lg max-w-md mx-auto leading-relaxed", style: { color: theme.silver2 }, children: "Sepertinya Anda tersesat di ruang digital. Jangan khawatir, mari kita bawa Anda kembali ke jalur yang benar!" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center", children: [_jsxs("button", { onClick: () => {
                                    if (typeof window !== "undefined" && window.history) {
                                        window.history.back();
                                    }
                                }, className: "group flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105", style: {
                                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.quaternary})`,
                                    color: theme.white1,
                                    boxShadow: `0 10px 25px ${theme.primary}33`,
                                }, children: [_jsx(ArrowLeft, { className: "w-5 h-5 transition-transform group-hover:-translate-x-0.5" }), "Kembali"] }), _jsxs("button", { onClick: () => {
                                    if (typeof window !== "undefined") {
                                        window.location.href = "/";
                                    }
                                }, className: "group flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105", style: {
                                    background: "transparent",
                                    color: theme.quaternary,
                                    border: `2px solid ${theme.quaternary}`,
                                }, children: [_jsx(Home, { className: "w-5 h-5 transition-transform group-hover:rotate-6" }), "Beranda"] }), _jsxs("button", { onClick: () => {
                                    if (typeof window !== "undefined") {
                                        window.location.href = "/search";
                                    }
                                }, className: "group flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105", style: {
                                    background: "transparent",
                                    color: theme.tertiary,
                                    border: `2px solid ${theme.tertiary}`,
                                }, children: [_jsx(Search, { className: "w-5 h-5 transition-transform group-hover:scale-110" }), "Cari"] })] }), _jsxs("div", { className: "mt-12 flex justify-center items-center gap-2", children: [_jsx(Zap, { className: "w-4 h-4 animate-pulse", style: { color: theme.specialColor } }), _jsx("span", { className: "text-sm", style: { color: theme.silver2 }, children: "Tip: Gunakan navigasi untuk menjelajah" })] }), _jsx("div", { className: "mt-8 flex justify-center gap-4", children: [...Array(5)].map((_, i) => (_jsx(Star, { className: "w-4 h-4 animate-pulse", style: {
                                color: theme.specialColor,
                                opacity: 0.7,
                                animationDelay: `${i * 0.2}s`,
                            } }, i))) })] }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 pointer-events-none", style: {
                    background: `linear-gradient(0deg, ${theme.white3}88, transparent)`,
                } })] }));
}
