import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/academic/AllClasses.tsx
import { useMemo, useState, useDeferredValue } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { Users, Clock, Search, LayoutList, LayoutGrid, GraduationCap, ArrowLeft, ChevronRight, } from "lucide-react";
import { fetchStudentsByClasses, } from "@/pages/sekolahislamku/dashboard-teacher/class/types/teacherClass";
const QK = {
    LIST: ["all-classes-list"],
    STUDENTS: (ids) => ["all-class-students", ids],
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
/* =============== Fake Data =============== */
const TODAY_FIXED = atLocalNoon(new Date());
const TODAY_ISO = TODAY_FIXED.toISOString();
const CLASSES_FIXED = [
    {
        id: "1",
        name: "Kelas 1A",
        room: "Aula 1",
        homeroom: "Ustadz Abdullah",
        studentsCount: 25,
        todayAttendance: { hadir: 22, sakit: 1, izin: 1, alpa: 1, online: 0 },
        nextSession: {
            dateISO: TODAY_ISO,
            time: "07:30",
            title: "Tahsin & Tajwid",
            room: "Aula 1",
        },
        materialsCount: 10,
        assignmentsCount: 3,
        academicTerm: "2025/2026 — Ganjil",
        cohortYear: 2025,
    },
    {
        id: "2",
        name: "Kelas 2B",
        room: "Ruang 202",
        homeroom: "Ustadzah Maryam",
        studentsCount: 20,
        todayAttendance: { hadir: 17, sakit: 1, izin: 1, alpa: 1, online: 0 },
        nextSession: {
            dateISO: TODAY_ISO,
            time: "09:30",
            title: "Hafalan Juz 30",
            room: "Ruang 202",
        },
        materialsCount: 8,
        assignmentsCount: 2,
        academicTerm: "2025/2026 — Ganjil",
        cohortYear: 2024,
    },
    {
        id: "3",
        name: "Kelas 3A",
        room: "Ruang 301",
        homeroom: "Ustadz Ahmad",
        studentsCount: 23,
        todayAttendance: { hadir: 20, sakit: 2, izin: 0, alpa: 1, online: 0 },
        nextSession: {
            dateISO: TODAY_ISO,
            time: "10:00",
            title: "Fiqih",
            room: "Ruang 301",
        },
        materialsCount: 12,
        assignmentsCount: 4,
        academicTerm: "2025/2026 — Ganjil",
        cohortYear: 2023,
    },
    {
        id: "4",
        name: "Kelas 4B",
        room: "Ruang 402",
        homeroom: "Ustadzah Fatimah",
        studentsCount: 18,
        todayAttendance: { hadir: 15, sakit: 1, izin: 2, alpa: 0, online: 0 },
        nextSession: {
            dateISO: TODAY_ISO,
            time: "13:30",
            title: "Akhlak",
            room: "Ruang 402",
        },
        materialsCount: 9,
        assignmentsCount: 2,
        academicTerm: "2025/2026 — Ganjil",
        cohortYear: 2022,
    },
];
/* =============== Fake API =============== */
async function fetchAllClasses() {
    return Promise.resolve(CLASSES_FIXED.map((x) => ({ ...x })));
}
function useAllClasses() {
    return useQuery({
        queryKey: QK.LIST,
        queryFn: fetchAllClasses,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
function useClassStudents(classIds) {
    return useQuery({
        queryKey: QK.STUDENTS(classIds),
        queryFn: () => fetchStudentsByClasses(classIds),
        enabled: classIds.length > 0,
        staleTime: Infinity,
        gcTime: Infinity,
    });
}
/* =============== Main Page =============== */
const AllClasses = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { data: classes = [], isFetching } = useAllClasses();
    const [viewMode, setViewMode] = useState("simple");
    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearchTerm = useDeferredValue(searchTerm);
    const filteredClasses = useMemo(() => {
        if (!deferredSearchTerm)
            return classes;
        return classes.filter((c) => c.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
            c.homeroom.toLowerCase().includes(deferredSearchTerm.toLowerCase()));
    }, [classes, deferredSearchTerm]);
    const classIds = useMemo(() => classes.map((c) => c.id), [classes]);
    const { data: studentsMap = {} } = useClassStudents(classIds);
    const handleClassClick = (classId) => {
        navigate(`${classId}`);
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Semua Kelas", gregorianDate: TODAY_ISO, hijriDate: hijriLong(TODAY_ISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "font-semibold text-lg", style: { color: palette.black1 }, children: "Semua Kelas" }), _jsxs("p", { className: "text-sm mt-1", style: { color: palette.black2 }, children: [classes.length, " kelas terdaftar"] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-1/2 transform -translate-y-1/2", style: { color: palette.black2 } }), _jsx("input", { type: "text", placeholder: "Cari kelas...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 rounded-lg border text-sm", style: {
                                                                        borderColor: palette.silver1,
                                                                        backgroundColor: palette.white1,
                                                                    } })] }), _jsxs("div", { className: "flex border rounded-lg", style: { borderColor: palette.silver1 }, children: [_jsx("button", { onClick: () => setViewMode("simple"), className: `px-3 py-2 rounded-l-lg text-sm ${viewMode === "simple" ? "font-medium" : ""}`, style: {
                                                                        backgroundColor: viewMode === "simple"
                                                                            ? palette.primary
                                                                            : "transparent",
                                                                        color: viewMode === "simple" ? "white" : palette.black2,
                                                                    }, children: _jsx(LayoutList, { size: 16 }) }), _jsx("button", { onClick: () => setViewMode("detailed"), className: `px-3 py-2 rounded-r-lg text-sm ${viewMode === "detailed" ? "font-medium" : ""}`, style: {
                                                                        backgroundColor: viewMode === "detailed"
                                                                            ? palette.primary
                                                                            : "transparent",
                                                                        color: viewMode === "detailed" ? "white" : palette.black2,
                                                                    }, children: _jsx(LayoutGrid, { size: 16 }) })] })] })] }) }) }), _jsxs("div", { className: `grid gap-4 ${viewMode === "simple"
                                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                        : "grid-cols-1 lg:grid-cols-2"}`, children: [isFetching &&
                                            Array.from({ length: 6 }).map((_, i) => (_jsx(SectionCard, { palette: palette, className: "animate-pulse", children: _jsx("div", { className: "h-32" }) }, i))), !isFetching &&
                                            filteredClasses.map((classItem) => (_jsx(SectionCard, { palette: palette, className: "hover:shadow-sm transition-shadow cursor-pointer", onClick: () => handleClassClick(classItem.id), children: _jsxs("div", { className: "p-5 space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg", style: { color: palette.black1 }, children: classItem.name }), _jsxs("div", { className: "flex items-center gap-2 text-sm mt-1", style: { color: palette.black2 }, children: [_jsx(GraduationCap, { size: 14 }), _jsx("span", { children: classItem.homeroom })] })] }), _jsx(Badge, { palette: palette, variant: "outline", children: classItem.room })] }), viewMode === "detailed" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-between text-sm py-2 border-t border-b", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "flex items-center gap-1", style: { color: palette.black2 }, children: [_jsx(Users, { size: 14 }), _jsxs("span", { children: [classItem.studentsCount, " siswa"] })] }), _jsxs("div", { style: { color: palette.black2 }, children: ["Hadir: ", classItem.todayAttendance.hadir] })] }), classItem.nextSession && (_jsx("div", { className: "text-sm p-2 rounded border", style: {
                                                                        backgroundColor: palette.white1,
                                                                        borderColor: palette.silver1,
                                                                        color: palette.black2,
                                                                    }, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { size: 14 }), _jsxs("span", { children: [classItem.nextSession.time, " \u2022", " ", classItem.nextSession.title] })] }) }))] })), viewMode === "simple" && (_jsx("div", { className: "flex justify-between items-center text-sm", children: _jsxs("div", { className: "flex items-center gap-1", style: { color: palette.black2 }, children: [_jsx(Users, { size: 14 }), _jsxs("span", { children: [classItem.studentsCount, " siswa"] })] }) })), _jsxs("div", { className: "flex justify-between", children: [classItem.nextSession && (_jsxs("div", { className: "flex items-center gap-1", style: { color: palette.black2 }, children: [_jsx(Clock, { size: 14 }), _jsx("span", { className: "text-sm", children: classItem.nextSession.time })] })), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", children: _jsx(ChevronRight, { size: 14 }) })] })] }) }, classItem.id))), !isFetching && filteredClasses.length === 0 && (_jsx("div", { className: "col-span-full", children: _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-8 text-center", children: [_jsx(Users, { size: 32, style: { color: palette.black2 }, className: "mx-auto mb-3" }), _jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: searchTerm
                                                                ? "Tidak ada kelas yang ditemukan"
                                                                : "Belum ada kelas terdaftar" })] }) }) }))] })] })] }) })] }));
};
export default AllClasses;
