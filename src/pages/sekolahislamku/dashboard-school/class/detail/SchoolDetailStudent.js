import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/students/SchoolDetailStudent.tsx
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import { ArrowLeft, User, BookOpen, Users, CalendarDays, FileDown, ClipboardList, } from "lucide-react";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* =========================================
   DUMMY SWITCH
   - Set true untuk tampilkan dummy bila API belum siap
========================================= */
const USE_DUMMY = true;
/* ========= Helpers ========= */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "";
const shortDate = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
    : "";
const SEMESTER_RANGES = {
    "2025-Ganjil": { start: "2025-07-01", end: "2025-12-31" },
    "2025-Genap": { start: "2026-01-01", end: "2026-06-30" },
    "2026-Ganjil": { start: "2026-07-01", end: "2026-12-31" },
    "2026-Genap": { start: "2027-01-01", end: "2027-06-30" },
};
const inRange = (iso, start, end) => iso >= start && iso <= end;
/* ========= DUMMY ========= */
const DUMMY_STUDENT = {
    id: "stu-1",
    nis: "2025-001",
    name: "Ahmad Fikri",
    gender: "L",
    phone: "0812-1111-2222",
    email: "ahmad@example.com",
    class_name: "Kelas A",
    join_date: "2025-07-15",
    status: "aktif",
};
const DUMMY_GRADES = [
    {
        id: "g1",
        subject: "Al-Qur'an",
        assessment: "UH",
        score: 88,
        date: "2025-08-01",
        teacher_name: "Ust. Ridla",
        semester: "2025-Ganjil",
        note: "Makharij cukup baik.",
    },
    {
        id: "g2",
        subject: "Al-Qur'an",
        assessment: "PTS",
        score: 92,
        date: "2025-09-20",
        teacher_name: "Ust. Ridla",
        semester: "2025-Ganjil",
    },
    {
        id: "g3",
        subject: "Aqidah",
        assessment: "UH",
        score: 76,
        date: "2025-08-10",
        teacher_name: "Ust. Fulan",
        semester: "2025-Ganjil",
    },
    {
        id: "g4",
        subject: "Fiqih",
        assessment: "Tugas",
        score: 95,
        date: "2025-08-25",
        teacher_name: "Ust. Fulan",
        semester: "2025-Ganjil",
        note: "Tugas lengkap & rapi.",
    },
];
const DUMMY_ATTENDS = [
    {
        id: "a1",
        date: "2025-08-01",
        status: "H",
        lesson_title: "Tahsin",
        section_name: "Kelas A",
        teacher_name: "Ust. Ridla",
        semester: "2025-Ganjil",
    },
    {
        id: "a2",
        date: "2025-08-03",
        status: "I",
        lesson_title: "Tahfizh",
        section_name: "Kelas A",
        teacher_name: "Ust. Ridla",
        semester: "2025-Ganjil",
        note: "Sakit",
    },
    {
        id: "a3",
        date: "2025-08-07",
        status: "H",
        lesson_title: "Adab",
        section_name: "Kelas A",
        teacher_name: "Ust. Ridla",
        semester: "2025-Ganjil",
    },
    {
        id: "a4",
        date: "2025-08-10",
        status: "A",
        lesson_title: "Fiqih",
        section_name: "Kelas A",
        teacher_name: "Ust. Fulan",
        semester: "2025-Ganjil",
    },
];
const DUMMY_NOTES = [
    {
        id: "n1",
        date: "2025-08-05",
        note_type: "akademik",
        content: "Perlu memperbanyak latihan bacaan huruf qalqalah.",
        author_name: "Ust. Ridla",
        section_name: "Kelas A",
        semester: "2025-Ganjil",
    },
    {
        id: "n2",
        date: "2025-08-12",
        note_type: "sikap",
        content: "Sangat membantu teman, aktif bertanya.",
        author_name: "Ust. Fulan",
        section_name: "Kelas A",
        semester: "2025-Ganjil",
    },
];
/* ========= Fetchers (fallback ke dummy) ========= */
async function fetchStudent(studentId) {
    if (USE_DUMMY)
        return DUMMY_STUDENT;
    const tries = [
        `/api/a/students/${studentId}`,
        `/api/a/student/${studentId}`,
        `/api/a/students?id=${studentId}`,
    ];
    for (const url of tries) {
        try {
            const r = await axios.get(url);
            if (r.data?.data)
                return r.data.data;
        }
        catch { }
    }
    return null;
}
async function fetchStudentGrades(studentId) {
    if (USE_DUMMY)
        return DUMMY_GRADES;
    const tries = [
        { url: "/api/a/student-grades", params: { student_id: studentId } },
        { url: "/api/a/grades", params: { student_id: studentId } },
    ];
    for (const t of tries) {
        try {
            const r = await axios.get(t.url, { params: t.params });
            const d = r.data?.data;
            if (Array.isArray(d))
                return d;
            if (d?.items && Array.isArray(d.items))
                return d.items;
        }
        catch { }
    }
    return [];
}
async function fetchStudentAttendance(studentId) {
    if (USE_DUMMY)
        return DUMMY_ATTENDS;
    const tries = [
        { url: "/api/a/student-attendances", params: { student_id: studentId } },
        { url: "/api/a/attendances", params: { student_id: studentId } },
    ];
    for (const t of tries) {
        try {
            const r = await axios.get(t.url, { params: t.params });
            const d = r.data?.data;
            if (Array.isArray(d))
                return d;
            if (d?.items && Array.isArray(d.items))
                return d.items;
        }
        catch { }
    }
    return [];
}
async function fetchStudentNotes(studentId) {
    if (USE_DUMMY)
        return DUMMY_NOTES;
    const tries = [
        { url: "/api/a/student-notes", params: { student_id: studentId } },
        { url: "/api/a/notes", params: { student_id: studentId, type: "student" } },
    ];
    for (const t of tries) {
        try {
            const r = await axios.get(t.url, { params: t.params });
            const d = r.data?.data;
            if (Array.isArray(d))
                return d;
            if (d?.items && Array.isArray(d.items))
                return d.items;
        }
        catch { }
    }
    return [];
}
/* ========= CSV helper ========= */
function toCsv(rows, headers) {
    const cols = Object.keys(headers);
    const head = cols.map((c) => JSON.stringify(headers[c] ?? c)).join(",");
    const body = rows
        .map((r) => cols
        .map((c) => {
        const v = r?.[c] ?? "";
        return JSON.stringify(String(v ?? ""));
    })
        .join(","))
        .join("\n");
    return head + "\n" + body;
}
function downloadCsv(filename, csv) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
/* ========= Page ========= */
export default function SchoolDetailStudent() {
    const { id: studentId = "" } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const nav = useNavigate();
    const [semester, setSemester] = useState("ALL");
    const [subjectFilter, setSubjectFilter] = useState("");
    const studentQ = useQuery({
        queryKey: ["student", studentId, USE_DUMMY],
        enabled: !!studentId,
        queryFn: () => fetchStudent(studentId),
        staleTime: 60_000,
    });
    const gradesQ = useQuery({
        queryKey: ["student-grades", studentId, USE_DUMMY],
        enabled: !!studentId,
        queryFn: () => fetchStudentGrades(studentId),
        staleTime: 30_000,
    });
    const attendsQ = useQuery({
        queryKey: ["student-attendance", studentId, USE_DUMMY],
        enabled: !!studentId,
        queryFn: () => fetchStudentAttendance(studentId),
        staleTime: 30_000,
    });
    const notesQ = useQuery({
        queryKey: ["student-notes", studentId, USE_DUMMY],
        enabled: !!studentId,
        queryFn: () => fetchStudentNotes(studentId),
        staleTime: 30_000,
    });
    const student = studentQ.data ?? undefined;
    const rawGrades = useMemo(() => gradesQ.data ?? [], [gradesQ.data]);
    const rawAttends = useMemo(() => attendsQ.data ?? [], [attendsQ.data]);
    const rawNotes = useMemo(() => notesQ.data ?? [], [notesQ.data]);
    // Filter by semester (and subject for grades)
    const grades = useMemo(() => {
        let rows = rawGrades;
        if (semester !== "ALL") {
            const range = SEMESTER_RANGES[semester];
            rows = rows.filter((g) => {
                if (g.date)
                    return inRange(g.date, range.start, range.end);
                if (g.semester)
                    return g.semester === semester;
                return true;
            });
        }
        if (subjectFilter.trim()) {
            const q = subjectFilter.trim().toLowerCase();
            rows = rows.filter((g) => (g.subject ?? "").toLowerCase().includes(q));
        }
        return rows.sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? -1 : 1));
    }, [rawGrades, semester, subjectFilter]);
    const attends = useMemo(() => {
        if (semester === "ALL") {
            return [...rawAttends].sort((a, b) => (a.date ?? "") < (b.date ?? "") ? -1 : 1);
        }
        const range = SEMESTER_RANGES[semester];
        const rows = rawAttends.filter((a) => {
            if (a.date)
                return inRange(a.date, range.start, range.end);
            if (a.semester)
                return a.semester === semester;
            return true;
        });
        return rows.sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? -1 : 1));
    }, [rawAttends, semester]);
    const notes = useMemo(() => {
        if (semester === "ALL") {
            return [...rawNotes].sort((a, b) => (a.date ?? "") < (b.date ?? "") ? -1 : 1);
        }
        const range = SEMESTER_RANGES[semester];
        const rows = rawNotes.filter((n) => {
            if (n.date)
                return inRange(n.date, range.start, range.end);
            if (n.semester)
                return n.semester === semester;
            return true;
        });
        return rows.sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? -1 : 1));
    }, [rawNotes, semester]);
    // Stats
    const stats = useMemo(() => {
        const countGrades = grades.length;
        const avg = countGrades > 0
            ? Math.round((grades.reduce((s, g) => s + (g.score ?? 0), 0) / countGrades) * 10) / 10
            : 0;
        const totalAttend = attends.length;
        let h = 0, i = 0, a = 0;
        attends.forEach((x) => {
            if (x.status === "H")
                h++;
            else if (x.status === "I")
                i++;
            else if (x.status === "A")
                a++;
        });
        const presentPct = totalAttend > 0 ? Math.round((h / totalAttend) * 1000) / 10 : 0;
        return { countGrades, avg, totalAttend, h, i, a, presentPct };
    }, [grades, attends]);
    const exportGradesCsv = () => {
        const csv = toCsv(grades.map((g) => ({
            date: g.date ?? "",
            subject: g.subject ?? "",
            assessment: g.assessment ?? "",
            score: g.score ?? "",
            weight: g.weight ?? "",
            teacher: g.teacher_name ?? "",
            semester: g.semester ?? "",
            note: g.note ?? "",
        })), {
            date: "Tanggal",
            subject: "Mata Pelajaran",
            assessment: "Jenis",
            score: "Nilai",
            weight: "Bobot",
            teacher: "Pengajar",
            semester: "Semester",
            note: "Catatan",
        });
        downloadCsv(`nilai_${student?.name ?? "siswa"}_${semester}.csv`, csv);
    };
    const exportAttendCsv = () => {
        const csv = toCsv(attends.map((a) => ({
            date: a.date ?? "",
            status: a.status ?? "",
            lesson: a.lesson_title ?? "",
            section: a.section_name ?? "",
            teacher: a.teacher_name ?? "",
            semester: a.semester ?? "",
            note: a.note ?? "",
        })), {
            date: "Tanggal",
            status: "Status",
            lesson: "Materi/Pertemuan",
            section: "Kelas",
            teacher: "Pengajar",
            semester: "Semester",
            note: "Catatan",
        });
        downloadCsv(`absensi_${student?.name ?? "siswa"}_${semester}.csv`, csv);
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Detail Siswa", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6 min-w-0 lg:p-4", children: [_jsxs("section", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Btn, { palette: palette, variant: "outline", onClick: () => nav(-1), children: [_jsx(ArrowLeft, { className: "mr-2", size: 16 }), "Kembali"] }), _jsxs("div", { className: "ml-2", children: [_jsx("div", { className: "text-lg font-semibold", children: student?.name ?? "Siswa" }), _jsxs("div", { className: "text-sm", style: { color: palette.silver2 }, children: ["NIS: ", student?.nis ?? "-", " \u2022 ", student?.class_name ?? "-", " \u2022", " ", student?.status ?? "-"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm", style: { color: palette.silver2 }, children: "Semester" }), _jsxs("select", { className: "text-sm rounded-md border px-2 py-1", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                        color: palette.black1,
                                                    }, value: semester, onChange: (e) => setSemester(e.target.value), children: [_jsx("option", { value: "ALL", children: "Semua Semester" }), _jsx("option", { value: "2025-Ganjil", children: "2025 \u2022 Ganjil" }), _jsx("option", { value: "2025-Genap", children: "2025 \u2022 Genap" }), _jsx("option", { value: "2026-Ganjil", children: "2026 \u2022 Ganjil" }), _jsx("option", { value: "2026-Genap", children: "2026 \u2022 Genap" })] })] })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 grid gap-3 md:grid-cols-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                            background: palette.primary2,
                                                            color: palette.primary,
                                                        }, children: _jsx(User, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Biodata" }), _jsx("div", { className: "font-medium", children: student?.name ?? "-" }), _jsxs("div", { className: "text-sm", style: { color: palette.silver2 }, children: [student?.gender ?? "-", " \u2022 ", student?.phone ?? "-", " ", student?.email ? (_jsxs(_Fragment, { children: ["\u2022", " ", _jsx("a", { href: `mailto:${student.email}`, className: "underline", style: { color: palette.primary }, children: "Email" })] })) : null] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                            background: palette.primary2,
                                                            color: palette.primary,
                                                        }, children: _jsx(CalendarDays, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Kelas & Mulai Belajar" }), _jsx("div", { className: "font-medium", children: student?.class_name ?? "-" }), _jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: student?.join_date ? shortDate(student.join_date) : "-" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                            background: palette.primary2,
                                                            color: palette.primary,
                                                        }, children: _jsx(ClipboardList, { size: 18 }) }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm", style: { color: palette.silver2 }, children: ["Ringkasan (", semester === "ALL" ? "Semua" : semester, ")"] }), _jsxs("div", { className: "text-sm", style: { color: palette.silver2 }, children: ["Nilai:", " ", _jsx("span", { className: "font-medium", style: { color: palette.black1 }, children: stats.avg }), " ", "(", stats.countGrades, " penilaian)"] }), _jsxs("div", { className: "text-sm", style: { color: palette.silver2 }, children: ["Absensi:", " ", _jsxs("span", { className: "font-medium", style: { color: palette.black1 }, children: [stats.h, " H \u2022 ", stats.i, " I \u2022 ", stats.a, " A"] }), " ", "(", stats.presentPct, "% hadir dari ", stats.totalAttend, " ", "pertemuan)"] })] })] })] }) }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 flex items-center justify-between", children: [_jsxs("div", { className: "font-medium flex items-center gap-2", children: [_jsx(BookOpen, { size: 18 }), " Nilai Siswa"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { placeholder: "Filter mata pelajaran\u2026", value: subjectFilter, onChange: (e) => setSubjectFilter(e.target.value), className: "text-sm rounded-md border px-2 py-1", style: {
                                                                borderColor: palette.silver1,
                                                                background: palette.white1,
                                                                color: palette.black1,
                                                            } }), _jsxs(Btn, { palette: palette, variant: "outline", onClick: exportGradesCsv, children: [_jsx(FileDown, { className: "mr-2", size: 16 }), " Unduh CSV"] })] })] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 overflow-x-auto", children: [_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-left border-b", style: {
                                                                color: palette.silver2,
                                                                borderColor: palette.silver1,
                                                            }, children: _jsxs("tr", { children: [_jsx("th", { className: "py-2 pr-4", children: "Tanggal" }), _jsx("th", { className: "py-2 pr-4", children: "Mata Pelajaran" }), _jsx("th", { className: "py-2 pr-4", children: "Jenis" }), _jsx("th", { className: "py-2 pr-4", children: "Nilai" }), _jsx("th", { className: "py-2 pr-4", children: "Pengajar" }), _jsx("th", { className: "py-2 pr-4", children: "Semester" }), _jsx("th", { className: "py-2 pr-4", children: "Catatan" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: grades.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "py-6 text-center", style: { color: palette.silver2 }, children: "Belum ada data nilai." }) })) : (grades.map((g) => (_jsxs("tr", { className: "align-middle", children: [_jsx("td", { className: "py-3 pr-4", children: g.date ? shortDate(g.date) : "-" }), _jsx("td", { className: "py-3 pr-4 font-medium", children: g.subject ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: g.assessment ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: _jsx(Badge, { palette: palette, variant: g.score !== undefined && g.score >= 90
                                                                                ? "success"
                                                                                : "outline", children: g.score ?? "-" }) }), _jsx("td", { className: "py-3 pr-4", children: g.teacher_name ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: g.semester ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: g.note ?? "-" })] }, g.id ?? crypto.randomUUID())))) })] }), _jsxs("div", { className: "pt-3 text-sm", style: { color: palette.black2 }, children: ["Menampilkan ", grades.length, " baris nilai"] })] })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 flex items-center justify-between", children: [_jsxs("div", { className: "font-medium flex items-center gap-2", children: [_jsx(Users, { size: 18 }), " Absensi Siswa"] }), _jsxs(Btn, { palette: palette, variant: "outline", onClick: exportAttendCsv, children: [_jsx(FileDown, { className: "mr-2", size: 16 }), " Unduh CSV"] })] }), _jsxs("div", { className: "px-4 md:px-5 pb-4 overflow-x-auto", children: [_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "text-left border-b", style: {
                                                                color: palette.silver2,
                                                                borderColor: palette.silver1,
                                                            }, children: _jsxs("tr", { children: [_jsx("th", { className: "py-2 pr-4", children: "Tanggal" }), _jsx("th", { className: "py-2 pr-4", children: "Status" }), _jsx("th", { className: "py-2 pr-4", children: "Materi/Pertemuan" }), _jsx("th", { className: "py-2 pr-4", children: "Kelas" }), _jsx("th", { className: "py-2 pr-4", children: "Pengajar" }), _jsx("th", { className: "py-2 pr-4", children: "Semester" }), _jsx("th", { className: "py-2 pr-4", children: "Catatan" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: attends.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "py-6 text-center", style: { color: palette.silver2 }, children: "Belum ada data absensi." }) })) : (attends.map((a) => (_jsxs("tr", { className: "align-middle", children: [_jsx("td", { className: "py-3 pr-4", children: a.date ? dateLong(a.date) : "-" }), _jsx("td", { className: "py-3 pr-4", children: _jsx(Badge, { palette: palette, variant: a.status === "H"
                                                                                ? "success"
                                                                                : a.status === "I"
                                                                                    ? "outline"
                                                                                    : "outline", children: a.status ?? "-" }) }), _jsx("td", { className: "py-3 pr-4", children: a.lesson_title ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: a.section_name ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: a.teacher_name ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: a.semester ?? "-" }), _jsx("td", { className: "py-3 pr-4", children: a.note ?? "-" })] }, a.id ?? crypto.randomUUID())))) })] }), _jsxs("div", { className: "pt-3 text-sm", style: { color: palette.silver2 }, children: ["Menampilkan ", attends.length, " baris absensi"] })] })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 font-medium flex items-center gap-2", children: [_jsx(ClipboardList, { size: 18 }), " Catatan Pembelajaran"] }), _jsxs("div", { className: "px-4 md:px-5 pb-4", children: [notes.length === 0 ? (_jsx("div", { className: "py-6 text-center text-sm", style: { color: palette.silver2 }, children: "Belum ada catatan." })) : (_jsx("ul", { className: "space-y-3", children: notes.map((n) => (_jsxs("li", { className: "rounded-xl border p-3", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white1,
                                                        }, children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { palette: palette, variant: "outline", children: n.note_type ?? "catatan" }), _jsxs("span", { className: "text-sm", style: { color: palette.silver2 }, children: [n.date ? shortDate(n.date) : "-", " \u2022", " ", n.section_name ?? "-"] })] }), _jsx("span", { className: "text-sm", style: { color: palette.silver2 }, children: n.author_name ?? "-" })] }), _jsx("div", { className: "mt-2 text-sm", children: n.content ?? "-" })] }, n.id ?? crypto.randomUUID()))) })), _jsxs("div", { className: "pt-3 text-sm", style: { color: palette.silver2 }, children: ["Menampilkan ", notes.length, " catatan"] })] })] })] })] }) })] }));
}
