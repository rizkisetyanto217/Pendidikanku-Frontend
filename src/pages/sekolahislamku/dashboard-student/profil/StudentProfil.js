import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/student/StudentProfil.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Camera, } from "lucide-react";
/* ===== Helpers ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
/* ===== Data Dummy ===== */
const dummyStudent = {
    fullname: "Ahmad Fauzi",
    nis: "202512345",
    class: "X IPA 1",
    birthDate: "2010-04-15",
    birthPlace: "Jakarta",
    address: "Jl. Merdeka No. 45, Jakarta",
    phone: "+628123456789",
    email: "ahmad.fauzi@student.sekolahislamku.id",
    avatar: "",
    achievements: [
        "Juara 1 Olimpiade Matematika 2024",
        "Juara 2 MTQ Antar Sekolah 2023",
        "Peserta Lomba Cerdas Cermat Nasional 2022",
    ],
    subjects: ["Matematika", "Fisika", "Kimia", "Tahfidz", "Bahasa Arab"],
};
/* ===== Main Component ===== */
const StudentProfil = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const [avatarPreview, setAvatarPreview] = useState(dummyStudent.avatar);
    const getInitials = (name) => name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Profil Siswa", gregorianDate: new Date().toISOString(), showBack: isFromMenuUtama }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-6 flex flex-col md:flex-row gap-6 items-center md:items-start", children: [_jsxs("div", { className: "relative mx-auto md:mx-0", children: [_jsx("div", { className: "w-24 h-24 rounded-full flex items-center justify-center text-lg font-semibold text-white overflow-hidden", style: { backgroundColor: palette.primary }, children: avatarPreview ? (_jsx("img", { src: avatarPreview, alt: dummyStudent.fullname, className: "w-full h-full object-cover" })) : (getInitials(dummyStudent.fullname)) }), _jsx("button", { type: "button", className: "absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md", style: { backgroundColor: palette.primary }, children: _jsx(Camera, { size: 16 }) })] }), _jsxs("div", { className: "flex-1 text-center md:text-left space-y-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-base font-semibold", children: dummyStudent.fullname }), _jsx("p", { className: "text-sm font-medium", style: { color: palette.primary }, children: dummyStudent.class })] }), _jsx(Badge, { palette: palette, variant: "success", children: "Aktif" })] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "NIS:" }), " ", dummyStudent.nis] }), _jsxs("div", { children: [_jsx("strong", { children: "Tanggal Lahir:" }), " ", dateLong(dummyStudent.birthDate)] }), _jsxs("div", { children: [_jsx("strong", { children: "Tempat Lahir:" }), " ", dummyStudent.birthPlace] }), _jsxs("div", { children: [_jsx("strong", { children: "Alamat:" }), " ", dummyStudent.address] }), _jsxs("div", { children: [_jsx("strong", { children: "Telepon:" }), " ", dummyStudent.phone] }), _jsxs("div", { children: [_jsx("strong", { children: "Email:" }), " ", dummyStudent.email] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "font-semibold text-lg mb-3", children: "Mata Pelajaran" }), _jsx("div", { className: "flex flex-wrap gap-2", children: dummyStudent.subjects.map((sub, i) => (_jsx(Badge, { palette: palette, variant: "outline", children: sub }, i))) })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "font-semibold text-lg mb-3", children: "Prestasi" }), _jsx("ul", { className: "space-y-2 text-sm", children: dummyStudent.achievements.map((a, i) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx("span", { className: "w-2 h-2 rounded-full mt-2", style: { backgroundColor: palette.primary } }), a] }, i))) })] }) })] })] }) })] }));
};
export default StudentProfil;
