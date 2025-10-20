import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/student/AnnouncementsStudent.tsx
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* ---------- Helpers ---------- */
const dateFmt = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
});
/* ---------- Page ---------- */
export default function AnnouncementsStudent() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    // ⬇️ sumber data HANYA dari state yang dikirim StudentDashboard
    const sourceItems = state?.items ?? [];
    // UI state: search + filter
    const [q, setQ] = useState("");
    const [type, setType] = useState("all");
    const items = useMemo(() => {
        let arr = sourceItems;
        if (type !== "all")
            arr = arr.filter((a) => (a.type ?? "info") === type);
        if (q.trim()) {
            const s = q.trim().toLowerCase();
            arr = arr.filter((a) => a.title.toLowerCase().includes(s) || a.body.toLowerCase().includes(s));
        }
        return [...arr].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }, [sourceItems, q, type]);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: state?.heading ?? "Semua Pengumuman", gregorianDate: new Date().toISOString(), showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Semua Pengumuman" })] }), _jsxs(SectionCard, { palette: palette, children: [_jsx("div", { className: "p-4 md:p-5 pb-3 border-b", style: { borderColor: palette.silver1 }, children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("h1", { className: "text-base md:text-lg font-semibold flex items-center gap-2", children: [_jsx(Bell, { size: 20, color: palette.quaternary }), "Pengumuman"] }) }) }), _jsxs("div", { className: "p-4 md:p-5 pt-4 space-y-3", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: ["all", "info", "warning", "success"].map((t) => (_jsx("button", { onClick: () => setType(t), className: "px-3 py-1.5 rounded-lg border text-sm", style: {
                                                            background: type === t ? palette.primary2 : palette.white1,
                                                            color: type === t ? palette.primary : palette.black1,
                                                            borderColor: type === t ? palette.primary : palette.silver1,
                                                        }, children: t === "all" ? "Semua" : t }, t))) }), _jsx("div", { className: "flex items-center gap-3 rounded-xl border px-3 py-2.5 md:px-4 md:py-3 max-w-lg", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari judul atau isi pengumuman\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } }) })] }), _jsx("div", { className: "px-4 pb-5 space-y-3", children: items.length === 0 ? (_jsx("div", { className: "rounded-xl border p-4 text-sm", style: {
                                                    borderColor: palette.silver1,
                                                    color: palette.silver2,
                                                }, children: "Tidak ada pengumuman. (Buka dari dashboard agar data ikut terkirim.)" })) : (items.map((a) => (_jsx(Link, { to: `${a.id}`, state: { item: a }, className: "block rounded-xl border p-4 hover:shadow-sm transition", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: a.title }), _jsx("div", { className: "text-sm mt-0.5", style: { color: palette.black2 }, children: dateFmt(a.date) }), _jsx("p", { className: "text-sm mt-2 line-clamp-3", style: { color: palette.black2 }, children: a.body })] }), _jsx(Badge, { palette: palette, variant: a.type === "warning"
                                                                ? "warning"
                                                                : a.type === "success"
                                                                    ? "success"
                                                                    : "info", children: a.type ?? "info" })] }) }, a.id)))) })] })] })] }) })] }));
}
