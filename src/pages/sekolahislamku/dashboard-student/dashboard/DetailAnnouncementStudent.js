import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
const dateFmt = (iso) => (iso ? new Date(iso) : new Date()).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
});
export default function DetailAnnouncementStudent() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const item = state?.item;
    // kalau tidak ada data sama sekali, kembali (atau di sini tempatmu fetch by id)
    useEffect(() => {
        if (!item)
            navigate(-1);
    }, [item, navigate]);
    if (!item)
        return null;
    const badgeVariant = item.type === "warning"
        ? "warning"
        : item.type === "success"
            ? "success"
            : "info";
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Pengumuman", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsxs(Btn, { palette: palette, variant: "ghost", size: "sm", onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { size: 16, className: "mr-1" }), "Kembali"] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-6", children: [_jsx("div", { className: "flex flex-col gap-2 md:flex-row md:items-start md:justify-between", children: _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Bell, { size: 18, color: palette.quaternary }), _jsx(Badge, { palette: palette, variant: badgeVariant, children: item.type ?? "info" })] }), _jsx("h1", { className: "mt-2 text-xl md:text-2xl font-bold break-words", children: item.title }), _jsx("div", { className: "mt-1 text-sm", style: { color: palette.black2 }, children: dateFmt(item.date) })] }) }), _jsx("div", { className: "mt-5 leading-relaxed whitespace-pre-line", style: { color: palette.black2 }, children: item.body })] })] })] }) })] }));
}
