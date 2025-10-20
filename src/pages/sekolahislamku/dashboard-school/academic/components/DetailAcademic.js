import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { CalendarDays, CheckCircle2, Clock, ArrowLeft, School, Flag, } from "lucide-react";
/* ===== Dummy fallback kalau masuk tanpa state ===== */
const DUMMY_TERM = {
    academic_terms_masjid_id: "e9876a6e-ab91-4226-84f7-cda296ec747e",
    academic_terms_academic_year: "2025/2026",
    academic_terms_name: "Ganjil",
    academic_terms_start_date: "2025-07-15T00:00:00+07:00",
    academic_terms_end_date: "2026-01-10T23:59:59+07:00",
    academic_terms_is_active: true,
    academic_terms_angkatan: 2025,
};
/* ===== Helpers tanggal ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const dateShort = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
    : "-";
const toLocalNoonISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x.toISOString();
};
export default function DetailAcademic() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    // data dikirim dari AcademicSchool via Link state
    const { state } = useLocation();
    const term = useMemo(() => {
        return state?.term ?? DUMMY_TERM;
    }, [state?.term]);
    const topbarISO = toLocalNoonISO(new Date());
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Akademik", gregorianDate: topbarISO, showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex items-center gap-3 hidden", children: [_jsx(Btn, { palette: palette, variant: "ghost", size: "md", onClick: () => navigate(-1), className: "inline-flex items-center gap-2 px-3 py-2 p-5", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Halaman Detail Akademik" })] }), _jsxs(SectionCard, { palette: palette, className: "overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b flex items-center gap-3", style: { borderColor: palette.silver1 }, children: [_jsx(School, { size: 20, color: palette.quaternary }), _jsx("div", { className: "font-semibold", children: "Periode Akademik" }), term.academic_terms_is_active && (_jsx("span", { className: "ml-auto text-sm px-2.5 py-1 rounded-full", style: {
                                                        background: palette.success2,
                                                        color: palette.success1,
                                                    }, children: "Aktif" }))] }), _jsxs("div", { className: "p-5 grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Tahun Ajaran / Semester" }), _jsxs("div", { className: "text-xl font-semibold", children: [term.academic_terms_academic_year, " \u2014", " ", term.academic_terms_name] }), _jsxs("div", { className: "text-sm flex items-center gap-2", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 16 }), dateShort(term.academic_terms_start_date), " s/d", " ", dateShort(term.academic_terms_end_date)] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Angkatan & Status" }), _jsx("div", { className: "text-xl font-semibold", children: term.academic_terms_angkatan }), _jsxs("div", { className: "text-sm flex items-center gap-2", style: { color: palette.black2 }, children: [_jsx(CheckCircle2, { size: 16 }), term.academic_terms_is_active ? "Aktif" : "Tidak Aktif"] })] })] })] }), _jsx(SectionCard, { palette: palette, className: "p-5", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(InfoRow, { palette: palette, icon: _jsx(CalendarDays, { size: 18 }), label: "Tanggal Mulai", value: dateLong(term.academic_terms_start_date) }), _jsx(InfoRow, { palette: palette, icon: _jsx(Clock, { size: 18 }), label: "Tanggal Selesai", value: dateLong(term.academic_terms_end_date) }), _jsx(InfoRow, { palette: palette, icon: _jsx(Flag, { size: 18 }), label: "Status Periode", value: term.academic_terms_is_active ? "Aktif" : "Tidak Aktif" })] }) })] })] }) })] }));
}
/* ===== Small UI ===== */
function InfoRow({ palette, icon, label, value, }) {
    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-lg grid place-items-center shrink-0", style: { background: palette.primary2, color: palette.primary }, children: icon }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsx("div", { className: "text-sm font-medium break-words", children: value })] })] }));
}
