import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/attendance/AttendanceDetail.tsx
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, GraduationCap, MapPin, } from "lucide-react";
import { useMemo } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
export default function AttendanceDetail() {
    const { id } = useParams(); // id kelas dari URL
    const { state } = useLocation();
    const navigate = useNavigate();
    // tema
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // dukung state lama (classRow) & baru (classInfo)
    const classInfo = useMemo(() => {
        // @ts-expect-error kompat untuk dua bentuk state
        return state?.classInfo ?? state?.classRow ?? undefined;
    }, [state]);
    const effectiveDateISO = state?.dateISO ?? new Date().toISOString();
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Kehadiran Kelas", gregorianDate: effectiveDateISO }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsx("div", { children: _jsxs(Btn, { palette: palette, variant: "white1", size: "sm", onClick: () => navigate(-1), children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "Kembali"] }) }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-3 flex items-center justify-between", children: [_jsxs("h2", { className: "text-base md:text-lg font-semibold flex items-center gap-2", children: [_jsx(GraduationCap, { size: 18, color: palette.quaternary }), classInfo?.name ?? "Kelas"] }), _jsxs(Badge, { variant: "outline", palette: palette, children: [_jsx(CalendarDays, { size: 14, className: "mr-1" }), dateLong(effectiveDateISO)] })] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { className: "rounded-xl border p-3", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: [_jsx("div", { className: "text-xs", style: { color: palette.silver2 }, children: "ID Kelas" }), _jsx("div", { className: "font-semibold", children: classInfo?.id ?? id ?? "-" })] }), _jsxs("div", { className: "rounded-xl border p-3", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: [_jsxs("div", { className: "text-xs flex items-center gap-1", style: { color: palette.silver2 }, children: [_jsx(MapPin, { size: 14 }), "Ruangan"] }), _jsx("div", { className: "font-semibold", children: classInfo?.room ?? "-" })] }), _jsxs("div", { className: "rounded-xl border p-3", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: [_jsxs("div", { className: "text-xs flex items-center gap-1", style: { color: palette.silver2 }, children: [_jsx(Clock, { size: 14 }), "Jam"] }), _jsx("div", { className: "font-semibold", children: classInfo?.time ?? "-" })] })] })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4 md:p-5", children: _jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Konten detail kehadiran (daftar siswa, editor, dan aksi) bisa diletakkan di sini." }) }) })] })] }) })] }));
}
