import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/TeacherClassesList.tsx
import { useMemo, useState, useDeferredValue } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { Users, CalendarDays, Clock, Search, Filter, ChevronRight, LayoutList, LayoutGrid, MapPin, GraduationCap, ArrowLeft, } from "lucide-react";
import { fetchStudentsByClasses, } from "./types/teacherClass";
const QK = {
    LIST: ["teacher-classes-list"],
    STUDENTS: (ids) => ["teacher-class-students", ids],
};
/* ==============================
   Helpers (format & dates)
============================== */
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
/* ==============================
   FIXED DATA - Dibekukan secara statis
============================== */
// Bekukan tanggal hari ini
const TODAY_FIXED = atLocalNoon(new Date("2025-09-02")); // Tanggal statis untuk konsistensi
const TODAY_ISO = TODAY_FIXED.toISOString();
// Bekukan tanggal-tanggal untuk jadwal
const TOMORROW_ISO = (() => {
    const tomorrow = new Date(TODAY_FIXED);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString();
})();
const DAY_AFTER_TOMORROW_ISO = (() => {
    const dayAfter = new Date(TODAY_FIXED);
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter.toISOString();
})();
const THREE_DAYS_LATER_ISO = (() => {
    const threeDays = new Date(TODAY_FIXED);
    threeDays.setDate(threeDays.getDate() + 3);
    return threeDays.toISOString();
})();
// Data kelas yang dibekukan sepenuhnya
const TEACHER_CLASSES_FIXED = [
    {
        id: "tpa-a",
        name: "TPA A",
        room: "Aula 1",
        homeroom: "Ustadz Abdullah",
        assistants: ["Ustadzah Amina"],
        studentsCount: 22,
        todayAttendance: { hadir: 18, online: 1, sakit: 1, izin: 1, alpa: 1 },
        nextSession: {
            dateISO: TODAY_ISO,
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
            dateISO: TOMORROW_ISO,
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
            dateISO: DAY_AFTER_TOMORROW_ISO,
            time: "08:00",
            title: "Latihan Makhraj",
            room: "Aula 2",
        },
        materialsCount: 7,
        assignmentsCount: 2,
        academicTerm: "2024/2025 — Genap",
        cohortYear: 2024,
    },
    {
        id: "pra-tahfiz",
        name: "Pra-Tahfiz",
        room: "R. 101",
        homeroom: "Ustadzah Khadijah",
        assistants: ["Ustadzah Siti"],
        studentsCount: 25,
        todayAttendance: { hadir: 20, online: 1, sakit: 1, izin: 2, alpa: 1 },
        nextSession: {
            dateISO: TODAY_ISO,
            time: "10:30",
            title: "Pengenalan Hafalan",
            room: "R. 101",
        },
        materialsCount: 5,
        assignmentsCount: 1,
        academicTerm: "2025/2026 — Ganjil",
        cohortYear: 2025,
    },
    {
        id: "tahsin-lanjutan",
        name: "Tahsin Lanjutan",
        room: "Lab Bahasa",
        homeroom: "Ustadz Zaid",
        assistants: [],
        studentsCount: 16,
        todayAttendance: { hadir: 12, online: 1, sakit: 0, izin: 2, alpa: 1 },
        nextSession: {
            dateISO: THREE_DAYS_LATER_ISO,
            time: "13:00",
            title: "Mad Thabi'i (contoh & latihan)",
            room: "Lab Bahasa",
        },
        materialsCount: 14,
        assignmentsCount: 5,
        academicTerm: "2024/2025 — Genap",
        cohortYear: 2023,
    },
    {
        id: "tahfiz-juz-29",
        name: "Tahfiz Juz 29",
        room: "R. Tahfiz",
        homeroom: "Ustadz Umar",
        assistants: ["Ustadz Ali"],
        studentsCount: 19,
        todayAttendance: { hadir: 16, online: 0, sakit: 1, izin: 1, alpa: 1 },
        nextSession: {
            dateISO: TOMORROW_ISO,
            time: "15:30",
            title: "Setoran An-Naba 1–10",
            room: "R. Tahfiz",
        },
        materialsCount: 11,
        assignmentsCount: 3,
        academicTerm: "2025/2026 — Ganjil",
        cohortYear: 2024,
    },
];
/* ==============================
   Fake API (pure & deterministic)
============================== */
async function fetchTeacherClasses() {
    // Kembalikan salinan yang sama setiap kali
    return Promise.resolve(TEACHER_CLASSES_FIXED.map((x) => ({ ...x })));
}
/* ==============================
   Hooks
============================== */
function useTeacherClasses() {
    return useQuery({
        queryKey: QK.LIST,
        queryFn: fetchTeacherClasses,
        // Bekukan data di cache (tidak pernah refetch otomatis)
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}
function useClassStudents(classIds) {
    return useQuery({
        queryKey: QK.STUDENTS(classIds),
        queryFn: () => fetchStudentsByClasses(classIds),
        enabled: classIds.length > 0,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}
function useClassFilters(classes) {
    const [q, setQ] = useState("");
    const deferredQ = useDeferredValue(q);
    const [room, setRoom] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [term, setTerm] = useState("all");
    const [cohort, setCohort] = useState("all");
    const rooms = useMemo(() => {
        const r = Array.from(new Set(classes.map((c) => c.room).filter(Boolean)));
        return ["all", ...r];
    }, [classes]);
    const terms = useMemo(() => {
        const t = Array.from(new Set(classes.map((c) => c.academicTerm)));
        return ["all", ...t];
    }, [classes]);
    const cohorts = useMemo(() => {
        const ys = Array.from(new Set(classes.map((c) => c.cohortYear))).sort((a, b) => b - a);
        return ["all", ...ys.map(String)];
    }, [classes]);
    const filtered = useMemo(() => {
        let list = classes;
        if (room !== "all") {
            list = list.filter((c) => (c.room ?? "") === room);
        }
        if (term !== "all") {
            list = list.filter((c) => c.academicTerm === term);
        }
        if (cohort !== "all") {
            const y = Number(cohort);
            list = list.filter((c) => c.cohortYear === y);
        }
        const qq = deferredQ.trim().toLowerCase();
        if (qq) {
            list = list.filter((c) => c.name.toLowerCase().includes(qq) ||
                c.homeroom.toLowerCase().includes(qq) ||
                c.academicTerm.toLowerCase().includes(qq) ||
                String(c.cohortYear).includes(qq));
        }
        list = [...list].sort((a, b) => {
            if (sortBy === "name")
                return a.name.localeCompare(b.name);
            if (sortBy === "students")
                return b.studentsCount - a.studentsCount;
            const at = a.nextSession?.dateISO && a.nextSession?.time
                ? new Date(`${a.nextSession.dateISO}`).getTime() +
                    Number(a.nextSession.time.replace(":", ""))
                : Number.MAX_SAFE_INTEGER;
            const bt = b.nextSession?.dateISO && b.nextSession?.time
                ? new Date(`${b.nextSession.dateISO}`).getTime() +
                    Number(b.nextSession.time.replace(":", ""))
                : Number.MAX_SAFE_INTEGER;
            return at - bt;
        });
        return list;
    }, [classes, deferredQ, room, sortBy, term, cohort]);
    return {
        q,
        setQ,
        room,
        setRoom,
        sortBy,
        setSortBy,
        term,
        setTerm,
        cohort,
        setCohort,
        rooms,
        terms,
        cohorts,
        filtered,
    };
}
/* ==============================
   Small UI Components (UI tetap sama)
============================== */
function ViewModeToggle({ palette, value, onChange, }) {
    return (_jsxs("div", { className: "rounded-xl border p-1 flex shadow-sm", style: {
            borderColor: palette.silver1,
            background: palette.white1,
        }, "aria-label": "Mode tampilan", children: [_jsxs("button", { onClick: () => onChange("detailed"), className: "px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105", style: {
                    background: value === "detailed" ? palette.primary : "transparent",
                    color: value === "detailed" ? palette.white1 : palette.black1,
                    boxShadow: value === "detailed" ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                }, title: "Tampilan Detail", children: [_jsx(LayoutGrid, { size: 16 }), "Detail"] }), _jsxs("button", { onClick: () => onChange("simple"), className: "px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105", style: {
                    background: value === "simple" ? palette.primary : "transparent",
                    color: value === "simple" ? palette.white1 : palette.black1,
                    boxShadow: value === "simple" ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                }, title: "Tampilan Simple", children: [_jsx(LayoutList, { size: 16 }), "Simple"] })] }));
}
function AttendanceBar({ pct, total, hadir, palette, }) {
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm font-medium", style: { color: palette.black1 }, children: "Kehadiran Hari Ini" }), _jsxs("div", { className: "text-sm font-semibold", style: { color: palette.primary }, children: [pct, "%"] })] }), _jsx("div", { className: "h-3 w-full rounded-full overflow-hidden shadow-inner", style: { background: palette.white2 }, children: _jsx("div", { className: "h-full rounded-full transition-all duration-500 ease-out", style: {
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${palette.secondary}, ${palette.primary})`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    } }) }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: [_jsx("span", { className: "font-medium", children: hadir }), " dari ", total, " siswa hadir"] })] }));
}
/* ==============================
   Class Card Component (UI tetap)
============================== */
function ClassCard({ c, students, palette, viewMode, }) {
    const totalFromStudents = students.length;
    const total = totalFromStudents || c.studentsCount || 0;
    const hadir = c.todayAttendance.hadir ?? 0;
    const pct = total ? Math.round((hadir / total) * 100) : 0;
    const isUpcomingToday = c.nextSession &&
        new Date(c.nextSession.dateISO).toDateString() ===
            TODAY_FIXED.toDateString();
    return (_jsx(SectionCard, { palette: palette, className: `transition-all duration-300 ${viewMode === "simple"
            ? "hover:shadow-lg hover:-translate-y-1"
            : "hover:shadow-xl hover:-translate-y-2"} ${isUpcomingToday ? "ring-2 ring-opacity-90" : ""}`, children: _jsxs("div", { className: `p-5 md:p-6 flex flex-col gap-4 h-full ${viewMode === "simple" ? "gap-3" : "gap-4"}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "font-bold text-lg md:text-xl mb-2", style: { color: palette.black2 }, children: c.name }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(GraduationCap, { size: 14 }), _jsxs("span", { className: "truncate", children: ["Wali Kelas: ", c.homeroom] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 14 }), _jsx("span", { className: "truncate", children: c.academicTerm })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(Users, { size: 14 }), _jsxs("span", { children: ["Angkatan ", c.cohortYear] })] })] })] }), _jsx("div", { className: "flex flex-col gap-2 items-end", children: _jsxs(Badge, { palette: palette, variant: "outline", className: "flex items-center gap-1.5", children: [_jsx(MapPin, { size: 12, style: { color: palette.black2 } }), _jsx("h1", { style: { color: palette.black2 }, children: c.room ?? "Belum ditentukan" })] }) })] }), viewMode === "simple" ? (_jsx("div", { className: "space-y-3", children: _jsxs("div", { className: "flex items-center gap-3 p-3 rounded-lg", style: {
                            background: isUpcomingToday ? palette.primary2 : palette.white2,
                            border: `1px solid ${palette.silver1}`,
                        }, children: [_jsx("div", { style: { color: palette.primary }, children: _jsx(Clock, { size: 18 }) }), _jsx("div", { className: "flex-1 min-w-0", children: c.nextSession ? (_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium truncate", style: { color: palette.black2 }, children: c.nextSession.title }), _jsxs("div", { className: "text-sm mt-0.5", style: { color: palette.black2 }, children: [dateShort(c.nextSession.dateISO), " \u2022 ", c.nextSession.time, c.nextSession.room && ` • ${c.nextSession.room}`] })] })) : (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Belum ada jadwal" })) })] }) })) : (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "rounded-xl border p-4 space-y-3", style: {
                            borderColor: isUpcomingToday ? palette.white1 : palette.silver1,
                            background: isUpcomingToday ? palette.primary2 : palette.white1,
                        }, children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", style: { color: palette.black1 }, children: [_jsx(CalendarDays, { size: 16, style: { color: palette.primary } }), "Jadwal Terdekat", isUpcomingToday && (_jsx(Badge, { palette: palette, variant: "secondary", className: "text-sm", children: "Hari ini" }))] }), c.nextSession ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(Clock, { size: 14, style: { color: palette.primary } }), _jsxs("span", { className: "font-medium", children: [dateLong(c.nextSession.dateISO), " \u2022 ", c.nextSession.time] })] }), _jsx("div", { className: "text-sm font-medium", style: { color: palette.black2 }, children: c.nextSession.title }), c.nextSession.room && (_jsxs("div", { className: "flex items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(MapPin, { size: 14 }), _jsx("span", { children: c.nextSession.room })] }))] })) : (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Belum ada jadwal yang terjadwal." }))] }) })), _jsx("div", { className: "mt-auto pt-4", children: _jsx("div", { className: "flex items-center justify-end gap-3", children: _jsx(Link, { to: `${c.id}`, state: {
                                academicTerm: c.academicTerm,
                                cohortYear: c.cohortYear,
                            }, className: "flex-shrink-0", children: _jsxs(Btn, { palette: palette, size: "sm", className: "flex items-center gap-2 hover:gap-3 transition-all duration-200", children: ["Buka Kelas", _jsx(ChevronRight, { size: 16 })] }) }) }) })] }) }));
}
/* ==============================
   Filter Component (UI tetap)
============================== */
function FilterControls({ palette, q, setQ, room, setRoom, term, setTerm, cohort, setCohort, sortBy, setSortBy, rooms, terms, cohorts, }) {
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm", style: {
                    borderColor: palette.silver1,
                    background: palette.white1,
                }, children: [_jsx(Search, { size: 20, style: { color: palette.primary } }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari berdasarkan nama kelas, wali kelas, tahun ajaran, atau angkatan...", className: "bg-transparent outline-none text-sm w-full placeholder:text-opacity-60", style: {
                            color: palette.black2,
                            fontSize: "14px",
                        } })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 ", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", style: { color: palette.black2 }, children: "Ruang Kelas" }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 py-2.5  ", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsx(MapPin, { size: 16, style: { color: palette.primary } }), _jsx("select", { value: room, onChange: (e) => setRoom(e.target.value), className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black2 }, children: rooms.map((r) => (_jsx("option", { value: r, children: r === "all" ? "Semua" : r }, r))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", style: { color: palette.black2 }, children: "Tahun Ajaran" }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 py-2.5", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsx(CalendarDays, { size: 16, style: { color: palette.primary } }), _jsx("select", { value: term, onChange: (e) => setTerm(e.target.value), className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 }, children: terms.map((t) => (_jsx("option", { value: t, children: t === "all" ? "Semua" : t }, t))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", style: { color: palette.black2 }, children: "Angkatan" }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 py-2", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsx(GraduationCap, { size: 16, style: { color: palette.primary } }), _jsx("select", { value: cohort, onChange: (e) => setCohort(e.target.value), className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 }, children: cohorts.map((y) => (_jsx("option", { className: "capitalize", value: y, children: y === "all" ? "Semua" : `Angkatan ${y}` }, y))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", style: { color: palette.black2 }, children: "Urutkan" }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 py-2.5", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsx(Filter, { size: 16, style: { color: palette.primary } }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 }, children: [_jsx("option", { value: "name", children: "Nama Kelas" }), _jsx("option", { value: "students", children: "Jumlah Siswa" }), _jsx("option", { value: "time", children: "Jadwal Terdekat" })] })] })] })] })] }));
}
/* ==============================
   Loading State Component (UI tetap)
============================== */
function LoadingCard({ palette, viewMode, }) {
    return (_jsx(SectionCard, { palette: palette, className: "animate-pulse", children: _jsxs("div", { className: `p-5 md:p-6 space-y-4 ${viewMode === "simple" ? "space-y-3" : "space-y-4"}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 space-y-2", children: [_jsx("div", { className: "h-6 rounded-lg w-32", style: { background: palette.silver1 } }), _jsx("div", { className: "h-4 rounded w-48", style: { background: palette.silver1 } })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "h-6 rounded-lg w-20", style: { background: palette.silver1 } }), _jsx("div", { className: "h-6 rounded-lg w-16", style: { background: palette.silver1 } })] })] }), viewMode === "detailed" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-16 rounded-xl", style: { background: palette.silver1 } }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("div", { className: "h-12 rounded-xl", style: { background: palette.silver1 } }), _jsx("div", { className: "h-12 rounded-xl", style: { background: palette.silver1 } })] })] })), _jsxs("div", { className: "flex items-center justify-between pt-4", children: [_jsx("div", { className: "h-4 rounded w-24", style: { background: palette.silver1 } }), _jsx("div", { className: "h-8 rounded-lg w-20", style: { background: palette.silver1 } })] })] }) }));
}
/* ==============================
   Main Page Component
============================== */
const TeacherClassesList = ({ showBack = false, backTo, backLabel = "Kembali", }) => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { data: classes = [], isFetching: isFetchingClasses } = useTeacherClasses();
    const [viewMode, setViewMode] = useState("detailed");
    const { q, setQ, room, setRoom, sortBy, setSortBy, term, setTerm, cohort, setCohort, rooms, terms, cohorts, filtered, } = useClassFilters(classes);
    // siswa per kelas — juga dibekukan (no auto-refetch)
    const classIds = useMemo(() => filtered.map((c) => c.id), [filtered]);
    const { data: studentsMap = {}, isFetching: isFetchingStudents } = useClassStudents(classIds);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Daftar Kelas Saya", gregorianDate: TODAY_ISO, hijriDate: hijriLong(TODAY_ISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-6", style: { color: palette.black2 }, children: [_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-5 md:p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [_jsxs("div", { className: "flex items-center gap-5", children: [_jsx("div", { className: "mx-auto Replace flex gap-4 items-center", children: showBack && (_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "inline-flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) })) }), _jsx("div", { children: _jsx("h2", { className: "font-semibold text-lg  mb-1", style: { color: palette.black1 }, children: "Kelas yang Saya Ajar" }) })] }), _jsx(ViewModeToggle, { palette: palette, value: viewMode, onChange: setViewMode })] }), _jsx(FilterControls, { palette: palette, q: q, setQ: setQ, room: room, setRoom: setRoom, term: term, setTerm: setTerm, cohort: cohort, setCohort: setCohort, sortBy: sortBy, setSortBy: setSortBy, rooms: rooms, terms: terms, cohorts: cohorts })] }) }), _jsxs("div", { children: [!isFetchingClasses && (_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["Menampilkan ", filtered.length, " dari ", classes.length, " kelas"] }), filtered.length > 0 && (_jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["Diurutkan berdasarkan:", " ", sortBy === "name"
                                                            ? "Nama Kelas"
                                                            : sortBy === "students"
                                                                ? "Jumlah Siswa"
                                                                : "Jadwal Terdekat"] }))] })), _jsxs("div", { className: `grid gap-6 ${viewMode === "simple"
                                                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                                                : "grid-cols-1 lg:grid-cols-2"}`, children: [isFetchingClasses && filtered.length === 0 && (_jsx(_Fragment, { children: Array.from({ length: 4 }).map((_, i) => (_jsx(LoadingCard, { palette: palette, viewMode: viewMode }, i))) })), filtered.map((c) => (_jsx(ClassCard, { c: c, students: studentsMap[c.id] ?? [], palette: palette, viewMode: viewMode }, c.id)))] }), filtered.length === 0 && !isFetchingClasses && (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-8 md:p-12 text-center space-y-4", children: [_jsx("div", { className: "mx-auto w-16 h-16 rounded-full flex items-center justify-center", style: { background: palette.white2 }, children: _jsx(Search, { size: 24, style: { color: palette.black2 } }) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-lg mb-2", style: { color: palette.black1 }, children: "Tidak ada kelas ditemukan" }), _jsx("div", { className: "text-sm max-w-md mx-auto", style: { color: palette.black2 }, children: "Tidak ada kelas yang cocok dengan filter yang dipilih. Coba ubah kriteria pencarian atau filter untuk melihat lebih banyak kelas." })] }), _jsx(Btn, { palette: palette, variant: "outline", onClick: () => {
                                                            setQ("");
                                                            setRoom("all");
                                                            setTerm("all");
                                                            setCohort("all");
                                                        }, children: "Reset Filter" })] }) }))] })] })] }) })] }));
};
export default TeacherClassesList;
