import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/student/StudentAttandenceClass.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { ArrowLeft, CalendarDays, CheckCircle2, Stethoscope, CalendarX, } from "lucide-react";
/* ===== Helpers ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
/* ===== Dummy mapping kelas (sesuai MyClass) ===== */
const CLASS_INFO = {
    tahsin: { name: "Tahsin", room: "Aula 1", homeroom: "Ustadz Abdullah" },
    tahfidz: { name: "Tahfidz", room: "R. Tahfiz", homeroom: "Ustadz Salman" },
};
const StudentAttandenceClass = () => {
    const { slug, id } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const cls = useMemo(() => CLASS_INFO[id ?? ""] ?? { name: id ?? "Kelas" }, [id]);
    const [status, setStatus] = useState(null);
    const [submittedAt, setSubmittedAt] = useState(null);
    const todayISO = new Date().toISOString();
    const handlePick = (s) => {
        setStatus(s);
        setSubmittedAt(new Date().toISOString());
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: `Kehadiran • ${cls.name}`, gregorianDate: todayISO, showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Kehadiran Kelas" })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4 md:p-5 flex items-start justify-between gap-4", children: _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-lg md:text-xl font-semibold", children: cls.name }), _jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-sm", style: { color: palette.black2 }, children: [cls.room && (_jsx(Badge, { palette: palette, variant: "outline", children: cls.room })), cls.homeroom && _jsxs("span", { children: ["Wali Kelas: ", cls.homeroom] })] }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 14 }), _jsxs("span", { children: ["Hari ini: ", dateLong(todayISO)] })] })] }) }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 space-y-4", children: [_jsx("div", { className: "font-semibold", children: "Pilih status kehadiran:" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs(Btn, { palette: palette, onClick: () => handlePick("hadir"), className: "w-full h-12 justify-center", children: [_jsx(CheckCircle2, { size: 18, className: "mr-2" }), "Hadir"] }), _jsxs(Btn, { palette: palette, variant: "outline", onClick: () => handlePick("izin"), className: "w-full h-12 justify-center", children: [_jsx(CalendarX, { size: 18, className: "mr-2" }), "Izin"] }), _jsxs(Btn, { palette: palette, variant: "outline", onClick: () => handlePick("sakit"), className: "w-full h-12 justify-center", children: [_jsx(Stethoscope, { size: 18, className: "mr-2" }), "Sakit"] })] }), status && (_jsxs("div", { className: "mt-3 rounded-xl border px-4 py-3 text-sm", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx("span", { className: "font-medium", children: "Terkirim!" }), " Status kehadiran kamu untuk", " ", _jsx("span", { className: "font-medium", children: cls.name }), " hari ini tercatat sebagai", " ", _jsx(Badge, { palette: palette, variant: status === "hadir"
                                                            ? "success"
                                                            : status === "izin"
                                                                ? "warning"
                                                                : "info", className: "ml-1", children: status.toUpperCase() }), submittedAt && (_jsxs("span", { style: { color: palette.black2 }, children: [" ", "\u2022", " ", new Date(submittedAt).toLocaleTimeString("id-ID", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })] }))] }))] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 text-sm", style: { color: palette.black2 }, children: [_jsx("div", { className: "font-semibold mb-2", children: "Catatan" }), _jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [_jsx("li", { children: "Pilihan yang kamu klik langsung tersimpan (dummy/local)." }), _jsx("li", { children: "Jika salah pilih, klik tombol lain untuk memperbarui." }), _jsx("li", { children: "Admin/guru bisa melihat status ini pada sistem guru." })] })] }) })] })] }) })] }));
};
export default StudentAttandenceClass;
