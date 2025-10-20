import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/academic/ClassDetail.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { Users, Clock, MapPin, GraduationCap, ArrowLeft, Calendar, UserCheck, ChevronRight, Phone, } from "lucide-react";
const QK = {
    DETAIL: (id) => ["class-detail", id],
};
/* =============== Helpers =============== */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
const hijriLong = (iso) => new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};
/* =============== Fake Data =============== */
const TODAY_FIXED = atLocalNoon(new Date());
const TODAY_ISO = TODAY_FIXED.toISOString();
const MOCK_CLASS_DETAIL = {
    id: "1",
    name: "Kelas 1A",
    room: "Aula 1",
    homeroom: "Ustadz Abdullah",
    homeroomPhone: "08123456789",
    homeroomEmail: "abdullah@sekolah.id",
    assistants: ["Ustadzah Sarah"],
    studentsCount: 25,
    academicTerm: "2025/2026 — Ganjil",
    cohortYear: 2025,
    students: [
        {
            id: "1",
            name: "Ahmad Faisal",
            nisn: "0051234567",
            parentPhone: "08111111111",
            parentEmail: "faisal.parent@email.com",
            todayStatus: "hadir",
        },
        {
            id: "2",
            name: "Fatimah Zahra",
            nisn: "0051234568",
            parentPhone: "08222222222",
            parentEmail: "fatimah.parent@email.com",
            todayStatus: "hadir",
        },
        {
            id: "3",
            name: "Muhammad Ali",
            nisn: "0051234569",
            parentPhone: "08333333333",
            todayStatus: "sakit",
        },
        {
            id: "4",
            name: "Khadijah Sari",
            nisn: "0051234570",
            parentPhone: "08444444444",
            todayStatus: "izin",
        },
        {
            id: "5",
            name: "Umar Khattab",
            nisn: "0051234571",
            parentPhone: "08555555555",
            todayStatus: "hadir",
        },
    ],
    schedule: [
        {
            id: "1",
            day: "Senin",
            time: "07:30-08:30",
            subject: "Tahsin & Tajwid",
            teacher: "Ustadz Abdullah",
            room: "Aula 1",
        },
        {
            id: "2",
            day: "Senin",
            time: "08:30-09:30",
            subject: "Hafalan Juz 30",
            teacher: "Ustadzah Sarah",
            room: "Aula 1",
        },
        {
            id: "3",
            day: "Selasa",
            time: "07:30-08:30",
            subject: "Fiqih",
            teacher: "Ustadz Ahmad",
            room: "Aula 1",
        },
        {
            id: "4",
            day: "Selasa",
            time: "08:30-09:30",
            subject: "Akhlak",
            teacher: "Ustadzah Maryam",
            room: "Aula 1",
        },
    ],
    assignments: [
        {
            id: "1",
            title: "Hafalan Surah Al-Fatihah",
            subject: "Tahsin & Tajwid",
            dueDate: "2025-09-20",
            submitted: 20,
            total: 25,
        },
        {
            id: "2",
            title: "Menulis Huruf Hijaiyah",
            subject: "Tahsin & Tajwid",
            dueDate: "2025-09-22",
            submitted: 15,
            total: 25,
        },
        {
            id: "3",
            title: "Praktik Wudhu",
            subject: "Fiqih",
            dueDate: "2025-09-25",
            submitted: 18,
            total: 25,
        },
    ],
    materials: [
        {
            id: "1",
            title: "Panduan Tajwid Dasar",
            subject: "Tahsin & Tajwid",
            uploadDate: "2025-09-10",
            fileType: "PDF",
        },
        {
            id: "2",
            title: "Audio Bacaan Surah Al-Fatihah",
            subject: "Tahsin & Tajwid",
            uploadDate: "2025-09-12",
            fileType: "MP3",
        },
        {
            id: "3",
            title: "Tata Cara Wudhu",
            subject: "Fiqih",
            uploadDate: "2025-09-15",
            fileType: "PDF",
        },
    ],
};
/* =============== Fake API =============== */
async function fetchClassDetail(id) {
    // Simulate API call
    return Promise.resolve({ ...MOCK_CLASS_DETAIL, id });
}
function useClassDetail(id) {
    return useQuery({
        queryKey: QK.DETAIL(id),
        queryFn: () => fetchClassDetail(id),
        enabled: !!id,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
/* =============== Components =============== */
const AttendanceStatusBadge = ({ status, palette, }) => {
    const statusConfig = {
        hadir: { label: "Hadir", color: "text-green-600", bg: "bg-green-100" },
        sakit: { label: "Sakit", color: "text-yellow-600", bg: "bg-yellow-100" },
        izin: { label: "Izin", color: "text-blue-600", bg: "bg-blue-100" },
        alpa: { label: "Alpa", color: "text-red-600", bg: "bg-red-100" },
        online: { label: "Online", color: "text-purple-600", bg: "bg-purple-100" },
    };
    const config = statusConfig[status];
    return (_jsx("span", { className: `px-2 py-1 rounded text-sm font-medium ${config.color} ${config.bg}`, children: config.label }));
};
const TabButton = ({ active, onClick, children, palette, }) => (_jsx("button", { onClick: onClick, className: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "text-white" : ""}`, style: {
        backgroundColor: active ? palette.primary : "transparent",
        color: active ? "white" : palette.black2,
    }, children: children }));
/* =============== Main Page =============== */
const ClassDetail = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: classDetail, isFetching } = useClassDetail(id || "");
    const [activeTab, setActiveTab] = useState("students");
    if (!id) {
        return _jsx("div", { children: "Class ID not found" });
    }
    if (isFetching) {
        return (_jsx("div", { className: "min-h-screen w-full flex items-center justify-center", style: { background: palette.white2 }, children: _jsx("div", { children: "Loading..." }) }));
    }
    if (!classDetail) {
        return (_jsx("div", { className: "min-h-screen w-full flex items-center justify-center", style: { background: palette.white2 }, children: _jsx("div", { children: "Class not found" }) }));
    }
    const attendanceSummary = classDetail.students.reduce((acc, student) => {
        acc[student.todayStatus] = (acc[student.todayStatus] || 0) + 1;
        return acc;
    }, {});
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Kelas", gregorianDate: TODAY_ISO, hijriDate: hijriLong(TODAY_ISO) }), _jsx("main", { className: "mx-auto max-w-7xl px-4 py-6 space-y-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-6", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 min-w-0 space-y-6", children: [_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "font-bold text-2xl", style: { color: palette.black1 }, children: classDetail.name }), _jsxs("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: [classDetail.academicTerm, " \u2022 Angkatan", " ", classDetail.cohortYear] })] }), _jsx(Badge, { palette: palette, variant: "outline", children: classDetail.room })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(GraduationCap, { size: 16, style: { color: palette.primary } }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-sm", style: { color: palette.black1 }, children: classDetail.homeroom }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Wali Kelas" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Users, { size: 16, style: { color: palette.primary } }), _jsxs("div", { children: [_jsxs("div", { className: "font-medium text-sm", style: { color: palette.black1 }, children: [classDetail.studentsCount, " Siswa"] }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Total Siswa" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(UserCheck, { size: 16, style: { color: palette.primary } }), _jsxs("div", { children: [_jsxs("div", { className: "font-medium text-sm", style: { color: palette.black1 }, children: [attendanceSummary.hadir || 0, " Hadir"] }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Hari Ini" })] })] })] })] }) }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex gap-2 overflow-x-auto", children: [_jsxs(TabButton, { active: activeTab === "students", onClick: () => setActiveTab("students"), palette: palette, children: ["Siswa (", classDetail.students.length, ")"] }), _jsxs(TabButton, { active: activeTab === "schedule", onClick: () => setActiveTab("schedule"), palette: palette, children: ["Jadwal (", classDetail.schedule.length, ")"] }), _jsxs(TabButton, { active: activeTab === "assignments", onClick: () => setActiveTab("assignments"), palette: palette, children: ["Tugas (", classDetail.assignments.length, ")"] }), _jsxs(TabButton, { active: activeTab === "materials", onClick: () => setActiveTab("materials"), palette: palette, children: ["Materi (", classDetail.materials.length, ")"] })] }) }) }), _jsxs("div", { className: "space-y-4", children: [activeTab === "students" && (_jsx("div", { className: "grid gap-4", children: classDetail.students.map((student) => (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium", style: { color: palette.black1 }, children: student.name }), _jsxs("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: ["NISN: ", student.nisn] }), student.parentPhone && (_jsxs("div", { className: "flex items-center gap-2 text-sm mt-2", style: { color: palette.black2 }, children: [_jsx(Phone, { size: 12 }), _jsx("span", { children: student.parentPhone })] }))] }), _jsx(AttendanceStatusBadge, { status: student.todayStatus, palette: palette })] }) }) }, student.id))) })), activeTab === "schedule" && (_jsx("div", { className: "grid gap-4", children: classDetail.schedule.map((item) => (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4", children: _jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { children: [_jsx("h3", { className: "font-medium", style: { color: palette.black1 }, children: item.subject }), _jsx("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: item.teacher }), _jsxs("div", { className: "flex items-center gap-4 text-sm mt-2", style: { color: palette.black2 }, children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), _jsx("span", { children: item.day })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), _jsx("span", { children: item.time })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 12 }), _jsx("span", { children: item.room })] })] })] }) }) }) }, item.id))) })), activeTab === "assignments" && (_jsx("div", { className: "grid gap-4", children: classDetail.assignments.map((assignment) => (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium", style: { color: palette.black1 }, children: assignment.title }), _jsx("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: assignment.subject }), _jsxs("div", { className: "flex items-center gap-4 text-sm mt-2", style: { color: palette.black2 }, children: [_jsxs("span", { children: ["Deadline: ", formatDate(assignment.dueDate)] }), _jsxs("span", { children: ["Dikumpulkan: ", assignment.submitted, "/", assignment.total] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { palette: palette, variant: assignment.submitted === assignment.total
                                                                            ? "default"
                                                                            : "outline", children: [Math.round((assignment.submitted / assignment.total) * 100), "%"] }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: () => {
                                                                            navigate(`/sekolahislamku/academic/assignment/${assignment.id}`);
                                                                        }, children: _jsx(ChevronRight, { size: 14 }) })] })] }) }) }, assignment.id))) })), activeTab === "materials" && (_jsx("div", { className: "grid gap-4", children: classDetail.materials.map((material) => (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium", style: { color: palette.black1 }, children: material.title }), _jsx("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: material.subject }), _jsxs("div", { className: "flex items-center gap-4 text-sm mt-2", style: { color: palette.black2 }, children: [_jsxs("span", { children: ["Upload: ", formatDate(material.uploadDate)] }), _jsxs("span", { children: ["Format: ", material.fileType] })] })] }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", children: _jsx(ChevronRight, { size: 14 }) })] }) }) }, material.id))) }))] })] })] }) })] }));
};
export default ClassDetail;
