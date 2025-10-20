import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Award, User } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
export default function StudentDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const child = state?.child;
    const today = state?.today;
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Siswa", gregorianDate: new Date().toISOString(), dateFmt: (iso) => new Date(iso).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }) }), _jsx("main", { className: "w-full px-4 md:px-6 py-4   md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Detail Murid" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-6 flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center", children: _jsx(User, { size: 32, style: { color: palette.silver2 } }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold", children: child?.name ?? "-" }), _jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: child?.className ?? "-" })] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-6 space-y-3", children: [_jsxs("h3", { className: "text-base font-semibold flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18 }), " Ringkasan Hari Ini"] }), _jsxs("ul", { className: "text-sm space-y-2", children: [_jsxs("li", { children: ["Kehadiran:", " ", _jsx(Badge, { palette: palette, variant: today?.attendance.status === "hadir"
                                                                    ? "success"
                                                                    : today?.attendance.status === "online"
                                                                        ? "info"
                                                                        : "destructive", children: today?.attendance.status ?? "-" }), " ", today?.attendance.time && `(${today.attendance.time})`] }), _jsxs("li", { children: ["Informasi: ", today?.informasiUmum ?? "-"] }), today?.materiPersonal && (_jsxs("li", { children: ["Materi: ", today.materiPersonal] })), today?.penilaianPersonal && (_jsxs("li", { children: ["Catatan: ", today.penilaianPersonal] })), today?.hafalan && _jsxs("li", { children: ["Hafalan: ", today.hafalan] }), today?.pr && _jsxs("li", { children: ["PR: ", today.pr] })] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-6 space-y-3", children: [_jsxs("h3", { className: "text-base font-semibold flex items-center gap-2", children: [_jsx(Award, { size: 18 }), " Perkembangan"] }), _jsxs("ul", { className: "text-sm space-y-2", children: [_jsxs("li", { children: ["Juz Hafalan: ", child?.memorizationJuz ?? 0] }), _jsxs("li", { children: ["Tingkat Iqra: ", child?.iqraLevel ?? "-"] }), _jsxs("li", { children: ["Nilai Terakhir: ", child?.lastScore ?? "-"] }), today?.nilai !== undefined && (_jsxs("li", { children: ["Nilai Hari Ini: ", today.nilai] }))] })] }) })] })] }) })] }));
}
