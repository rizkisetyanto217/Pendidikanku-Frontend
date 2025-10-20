import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/teacher/Certificate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Award, ExternalLink, ArrowLeft, Plus, Calendar, Building, Eye, Star, BookOpen, } from "lucide-react";
/* ===== Helpers ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
const hijriWithWeekday = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const TODAY_ISO = new Date().toISOString();
/* ===== Fake Data Sertifikat ===== */
const certificates = [
    {
        id: "1",
        name: "Sertifikat Pendidik Profesional",
        issuer: "Kementerian Agama RI",
        year: 2023,
        category: "Profesi",
        has_credential: true,
        credential_url: "https://sertifikat-kemenag.id/prof123",
        description: "Sertifikat kompetensi sebagai pendidik profesional di lembaga pendidikan Islam",
    },
    {
        id: "2",
        name: "Pelatihan Kurikulum Merdeka",
        issuer: "Kemendikbud Ristek",
        year: 2024,
        category: "Pelatihan",
        has_credential: true,
        credential_url: "https://guru.kemdikbud.id/merdeka456",
        description: "Pelatihan implementasi kurikulum merdeka untuk pendidikan dasar",
    },
    {
        id: "3",
        name: "Workshop Pembelajaran Berbasis IT",
        issuer: "LPMP Jawa Timur",
        year: 2024,
        category: "Workshop",
        has_credential: false,
        description: "Workshop pengintegrasian teknologi informasi dalam pembelajaran",
    },
    {
        id: "4",
        name: "Sertifikat Tahfidz Al-Quran",
        issuer: "Pondok Modern Gontor",
        year: 2022,
        category: "Keagamaan",
        has_credential: true,
        credential_url: "https://gontor.ac.id/tahfidz789",
        description: "Sertifikat hafalan Al-Quran 30 Juz dengan sanad yang jelas",
    },
    {
        id: "5",
        name: "Pelatihan Metodologi Mengajar",
        issuer: "Universitas Islam Negeri",
        year: 2023,
        category: "Pelatihan",
        has_credential: false,
        description: "Pelatihan metodologi pengajaran modern untuk pendidik Muslim",
    },
];
const TeacherCertificate = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const [filter, setFilter] = useState("all");
    const filteredCertificates = certificates.filter((cert) => filter === "all" || cert.category.toLowerCase() === filter);
    const getCategoryVariant = (category) => {
        switch (category.toLowerCase()) {
            case "profesi":
                return "success";
            case "keagamaan":
                return "outline";
            case "pelatihan":
                return "outline";
            case "workshop":
                return "outline";
            default:
                return "outline";
        }
    };
    const getCategoryIcon = (category) => {
        switch (category.toLowerCase()) {
            case "profesi":
                return Star;
            case "keagamaan":
                return BookOpen;
            default:
                return Award;
        }
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Sertifikat & Kompetensi", gregorianDate: TODAY_ISO, hijriDate: hijriWithWeekday(TODAY_ISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "md:flex  hidden items-center gap-4", children: [_jsx(Btn, { palette: palette, onClick: () => (backTo ? navigate(backTo) : navigate(-1)), variant: "ghost", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "font-semibold text-xl", children: "Sertifikat Saya" }), _jsxs("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: [certificates.length, " sertifikat terdaftar"] })] })] }), _jsx(Btn, { palette: palette, children: _jsx(Plus, { size: 16 }) })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4", children: _jsx("div", { className: "flex gap-1 overflow-x-auto", children: [
                                                { key: "all", label: "Semua" },
                                                { key: "profesi", label: "Profesi" },
                                                { key: "keagamaan", label: "Keagamaan" },
                                                { key: "pelatihan", label: "Pelatihan" },
                                                { key: "workshop", label: "Workshop" },
                                            ].map(({ key, label }) => (_jsx("button", { className: `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === key ? "text-white" : ""}`, style: {
                                                    backgroundColor: filter === key ? palette.primary : "transparent",
                                                    color: filter === key ? "white" : palette.black2,
                                                }, onClick: () => setFilter(key), children: label }, key))) }) }) }), _jsx("div", { className: "grid gap-4 md:grid-cols-2", children: filteredCertificates.length === 0 ? (_jsx("div", { className: "md:col-span-2", children: _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-12 text-center", children: [_jsx(Award, { size: 48, style: { color: palette.silver1 }, className: "mx-auto mb-4" }), _jsx("h3", { className: "font-medium text-lg mb-2", children: "Belum Ada Sertifikat" }), _jsx("p", { className: "text-sm mb-4", style: { color: palette.black2 }, children: "Mulai tambahkan sertifikat untuk melengkapi profil profesional Anda" }), _jsxs(Btn, { palette: palette, children: [_jsx(Plus, { size: 16 }), "Tambah Sertifikat Pertama"] })] }) }) })) : (filteredCertificates.map((cert) => {
                                        const CategoryIcon = getCategoryIcon(cert.category);
                                        return (_jsx(SectionCard, { palette: palette, className: "hover:shadow-md transition-all duration-200", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0", style: { backgroundColor: palette.primary + "20" }, children: _jsx(CategoryIcon, { size: 20, style: { color: palette.primary } }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("h3", { className: "font-semibold text-base line-clamp-2 mb-1", children: cert.name }), _jsx(Badge, { palette: palette, variant: getCategoryVariant(cert.category), children: cert.category })] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(Building, { size: 14 }), _jsx("span", { children: cert.issuer })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(Calendar, { size: 14 }), _jsx("span", { children: cert.year })] })] }), _jsx("p", { className: "text-sm line-clamp-2 mb-4", style: { color: palette.black2 }, children: cert.description }), _jsx("div", { className: "flex items-center gap-2", children: cert.has_credential ? (_jsxs(_Fragment, { children: [_jsxs(Btn, { palette: palette, size: "sm", variant: "outline", children: [_jsx(Eye, { size: 14 }), "Lihat"] }), cert.credential_url && (_jsx("a", { href: cert.credential_url, target: "_blank", rel: "noopener noreferrer", children: _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", children: [_jsx(ExternalLink, { size: 14 }), "Verifikasi"] }) }))] })) : (_jsx(Badge, { palette: palette, variant: "outline", children: "Tidak tersedia digital" })) })] })] }) }) }, cert.id));
                                    })) }), certificates.length > 0 && (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "font-semibold text-lg mb-4", children: "Ringkasan Sertifikat" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold mb-1", style: { color: palette.primary }, children: certificates.length }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Total Sertifikat" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold mb-1", style: { color: palette.primary }, children: certificates.filter((c) => c.has_credential).length }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Tersedia Digital" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold mb-1", style: { color: palette.primary }, children: certificates.filter((c) => c.category === "Keagamaan")
                                                                    .length }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Sertifikat Agama" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold mb-1", style: { color: palette.primary }, children: new Date().getFullYear() -
                                                                    Math.min(...certificates.map((c) => c.year)) }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Tahun Pengalaman" })] })] })] }) }))] })] }) })] }));
};
export default TeacherCertificate;
