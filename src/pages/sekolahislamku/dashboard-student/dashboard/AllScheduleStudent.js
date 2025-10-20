import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/student/AllScheduleStudent.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// 🔗 ambil tipe & data helper
import { mockTodaySchedule, } from "@/pages/sekolahislamku/dashboard-school/types/TodaySchedule";
const topbarDateFmt = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
export default function AllScheduleStudent() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // Ambil data hanya untuk hari ini
    const items = state?.items && state.items.length > 0 ? state.items : mockTodaySchedule;
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: state?.title ?? "Jadwal Hari Ini", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "w-full px-4 md:px-6 py-4   md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Daftar Jadwal Hari Ini" })] }), _jsx(SectionCard, { palette: palette, className: "p-4 md:p-5", children: items.length === 0 ? (_jsx("div", { className: "rounded-xl border p-4 text-sm text-center", style: {
                                            borderColor: palette.silver1,
                                            color: palette.silver2,
                                        }, children: "Tidak ada jadwal hari ini." })) : (_jsx("div", { className: "space-y-3", children: items.map((it, idx) => {
                                            const id = encodeURIComponent(it.slug ?? it.title ?? String(idx));
                                            return (_jsxs(Link, { to: `detail/${id}`, state: { item: it }, className: "block rounded-xl border p-3 md:p-4 hover:shadow-sm transition", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx("div", { className: "font-semibold", children: it.title }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-4 text-sm", children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Clock, { size: 14 }), _jsx(Badge, { palette: palette, variant: "outline", children: _jsx("p", { style: { color: palette.black2 }, children: it.time }) })] }), it.room && (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(MapPin, { size: 14 }), _jsx(Badge, { palette: palette, variant: "outline", children: _jsx("p", { style: { color: palette.black2 }, children: it.room }) })] }))] })] }, id));
                                        }) })) })] })] }) })] }));
}
