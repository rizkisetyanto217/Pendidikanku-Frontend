import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/DetailClass.tsx
import { useMemo } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { Users, CalendarDays, Clock, ClipboardList, BookOpen, ChevronRight, ArrowLeft, } from "lucide-react";
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
    : "-";
const dateShort = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
    })
    : "-";
const hijriLong = (iso) => new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
/* ========= Ambil data siswa per kelas dari shared types ========= */
import { fetchStudentsByClasses, } from "../types/teacherClass";
/* ========= Dummy fetch kelas (tetap sama; ganti dengan API nyata jika ada) ========= */
async function fetchTeacherClasses() {
    const now = new Date();
    const mk = (d, addDay = 0) => {
        const x = new Date(d);
        x.setDate(x.getDate() + addDay);
        return x.toISOString();
    };
    return Promise.resolve([
        {
            id: "tpa-a",
            name: "TPA A",
            room: "Aula 1",
            homeroom: "Ustadz Abdullah",
            assistants: ["Ustadzah Amina"],
            studentsCount: 22,
            todayAttendance: { hadir: 18, online: 1, sakit: 1, izin: 1, alpa: 1 },
            nextSession: {
                dateISO: mk(now, 0),
                time: "07:30",
                title: "Tahsin — Tajwid & Makhraj",
                room: "Aula 1",
            },
            materialsCount: 12,
            assignmentsCount: 4,
            academicTerm: "2025/2026 — Ganjil",
            cohortYear: 2025,
        },
        {
            id: "tpa-b",
            name: "TPA B",
            room: "R. Tahfiz",
            homeroom: "Ustadz Salman",
            assistants: ["Ustadzah Maryam"],
            studentsCount: 20,
            todayAttendance: { hadir: 15, online: 2, sakit: 1, izin: 1, alpa: 1 },
            nextSession: {
                dateISO: mk(now, 1),
                time: "09:30",
                title: "Hafalan Juz 30",
                room: "R. Tahfiz",
            },
            materialsCount: 9,
            assignmentsCount: 3,
            academicTerm: "2025/2026 — Ganjil",
            cohortYear: 2025,
        },
        {
            id: "tpa-c",
            name: "TPA C",
            room: "Aula 2",
            homeroom: "Ustadz Abu Bakar",
            assistants: [],
            studentsCount: 18,
            todayAttendance: { hadir: 14, online: 0, sakit: 2, izin: 1, alpa: 1 },
            nextSession: {
                dateISO: mk(now, 2),
                time: "08:00",
                title: "Latihan Makhraj",
                room: "Aula 2",
            },
            materialsCount: 7,
            assignmentsCount: 2,
            academicTerm: "2024/2025 — Genap",
            cohortYear: 2024,
        },
        // ...dst (tetap)
    ]);
}
/* ========= Query Keys ========= */
const QK = {
    CLASSES: ["teacher-classes-list"],
    CLASS_STUDENTS: (id) => ["teacher-class-students", id],
};
/* =================== Page =================== */
export default function DetailClass() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    // 1) Kelas (pakai cache sama dgn list)
    const { data: classes = [], isLoading: isLoadingClasses, isFetching: isFetchingClasses, } = useQuery({
        queryKey: QK.CLASSES,
        queryFn: fetchTeacherClasses,
        staleTime: 5 * 60_000,
    });
    const cls = useMemo(() => classes.find((c) => c.id === id), [classes, id]);
    // 2) Siswa per kelas (id aktif)
    const { data: studentsMap = {}, isFetching: isFetchingStudents, isLoading: isLoadingStudents, } = useQuery({
        queryKey: QK.CLASS_STUDENTS(id),
        queryFn: () => fetchStudentsByClasses(id ? [id] : []),
        enabled: !!id,
        staleTime: 5 * 60_000,
    });
    const students = studentsMap[id] ?? [];
    // 3) Hitung angka
    const todayISO = toLocalNoonISO(new Date());
    const fallbackTotal = cls?.studentsCount ?? 0;
    const total = students.length || fallbackTotal;
    const hadir = cls?.todayAttendance.hadir ?? 0;
    const pct = total > 0 ? Math.round((hadir / total) * 100) : 0;
    const loadingAny = isLoadingClasses || isLoadingStudents;
    const fetchingAny = isFetchingClasses || isFetchingStudents;
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: cls ? `Kelas: ${cls.name}` : "Kelas", gregorianDate: todayISO, hijriDate: hijriLong(todayISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "gap-1", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Detai Kelas" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5 flex flex-col gap-2 md:flex-row md:items-start md:justify-between", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-lg md:text-xl font-semibold", style: { color: palette.black2 }, children: cls?.name ?? (loadingAny ? "Memuat…" : "—") }), _jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(Badge, { variant: "outline", palette: palette, children: cls?.room ?? "-" }), _jsxs("span", { children: ["Wali Kelas: ", cls?.homeroom ?? "-"] }), _jsxs("span", { children: ["\u2022", " ", cls?.academicTerm ?? location.state?.academicTerm ?? "-"] }), _jsxs("span", { children: ["\u2022 Angkatan", " ", cls?.cohortYear ?? location.state?.cohortYear ?? "-"] })] })] }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Link, { to: "absensi", children: _jsxs(Btn, { palette: palette, size: "sm", variant: "secondary", children: ["Absensi ", _jsx(ChevronRight, { size: 16, className: "ml-1" })] }) }), _jsx(Link, { to: "materi", children: _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", children: [_jsx(BookOpen, { size: 16, className: "mr-1" }), "Materi"] }) }), _jsx(Link, { to: "tugas", children: _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", children: [_jsx(ClipboardList, { size: 16, className: "mr-1" }), "Tugas"] }) })] })] }) }), _jsxs("section", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Jumlah Siswa" }), _jsx("div", { className: "text-xl font-semibold", children: fetchingAny ? "…" : total || "—" }), students.length === 0 && fallbackTotal > 0 && (_jsxs("div", { className: "text-sm mt-0.5", style: { color: palette.black2 }, children: ["(fallback: ", fallbackTotal, ")"] }))] }), _jsx(Users, { size: 18 })] }) }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Kehadiran Hari Ini" }), _jsxs("div", { className: "text-xl font-semibold", children: [hadir, "/", total || 0] })] }), _jsx(ClipboardList, { size: 18 })] }) }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Materi \u2022 Tugas" }), _jsxs("div", { className: "text-xl font-semibold", children: [cls?.materialsCount ?? 0, " \u2022 ", cls?.assignmentsCount ?? 0] })] }), _jsx(BookOpen, { size: 18 })] }) })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsxs("div", { className: "text-sm font-medium mb-2 flex items-center gap-2", children: [_jsx(CalendarDays, { size: 16 }), " Jadwal Terdekat"] }), cls?.nextSession ? (_jsxs("div", { className: "rounded-xl border p-3", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Clock, { size: 14 }), _jsxs("span", { children: [dateShort(cls.nextSession.dateISO), " \u2022", " ", cls.nextSession.time] })] }), _jsxs("div", { className: "mt-1 text-sm", children: [cls.nextSession.title, cls.nextSession.room ? ` • ${cls.nextSession.room}` : ""] })] })) : (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Belum ada jadwal." }))] }) }), loadingAny && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Memuat detail kelas\u2026" })), !loadingAny && !cls && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6 text-sm", style: { color: palette.silver2 }, children: "Kelas tidak ditemukan." }) }))] })] }) })] }));
}
