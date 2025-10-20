import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { useNavigate } from "react-router-dom";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Award, Download, CalendarDays, ArrowLeft } from "lucide-react";
/* ===== Dummy Data ===== */
const dummyCertificates = [
    {
        id: "c1",
        title: "Sertifikat Juara 1 Olimpiade Matematika",
        date: "2024-05-15",
        issuer: "Kementerian Pendidikan",
    },
    {
        id: "c2",
        title: "Sertifikat MTQ Antar Sekolah",
        date: "2023-11-10",
        issuer: "Yayasan Al-Hikmah",
    },
    {
        id: "c3",
        title: "Sertifikat Peserta Cerdas Cermat Nasional",
        date: "2022-08-20",
        issuer: "Kemendikbud",
    },
];
/* ===== Helpers ===== */
const dateLong = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
/* ===== Main Component ===== */
const StudentCertificate = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Sertifikat", gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "w-full px-4 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "hidden md:flex items-center gap-3 mb-2", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Daftar Sertifikat" })] }), dummyCertificates.map((cert) => (_jsxs(SectionCard, { palette: palette, className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full flex items-center justify-center", style: {
                                                        background: palette.primary2,
                                                        color: palette.primary,
                                                    }, children: _jsx(Award, { size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-base", children: cert.title }), _jsxs("p", { className: "text-sm", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 14, className: "inline mr-1" }), dateLong(cert.date), " \u2022 ", cert.issuer] })] })] }), _jsxs(Btn, { palette: palette, variant: "outline", size: "sm", children: [_jsx(Download, { size: 16, className: "mr-1" }), " Unduh"] })] }, cert.id))), dummyCertificates.length === 0 && (_jsx(SectionCard, { palette: palette, className: "p-6 text-center text-sm", children: "Belum ada sertifikat yang tersedia." }))] })] }) })] }));
};
export default StudentCertificate;
