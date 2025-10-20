import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/classes/SchoolDetailClass.tsx
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import { ArrowLeft, BookOpen, Users, User, CalendarDays, Clock4, } from "lucide-react";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* =========================================
   DUMMY SWITCH
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
const scheduleToText = (sch) => {
    if (!sch)
        return "-";
    const days = (sch.days ?? []).join(", ");
    const time = sch.start && sch.end
        ? `${sch.start}–${sch.end}`
        : sch.start || sch.end || "";
    const loc = sch.location ? ` @${sch.location}` : "";
    const left = [days, time].filter(Boolean).join(" ");
    return left ? `${left}${loc}` : "-";
};
/* ========= Dummy Data ========= */
const DUMMY_SECTION = (id) => ({
    class_sections_id: id,
    class_sections_class_id: "1",
    class_sections_slug: "kelas-a",
    class_sections_name: "Kelas A",
    class_sections_code: "A1",
    class_sections_schedule: {
        start: "07:30",
        end: "09:00",
        days: ["Senin", "Rabu"],
        location: "Ruang A",
    },
    class_sections_is_active: true,
    teacher: {
        id: "t1",
        user_name: "Ridla Agustiawan",
        email: "ridla@example.com",
        is_active: true,
    },
});
const DUMMY_PARTICIPANTS = [
    {
        id: "s1",
        student_name: "Ahmad Fikri",
        nis: "2025-001",
        gender: "L",
        phone: "0812-1111-2222",
        email: "ahmad@example.com",
        status: "aktif",
    },
    {
        id: "s2",
        student_name: "Siti Maryam",
        nis: "2025-002",
        gender: "P",
        phone: "0812-3333-4444",
        email: "siti@example.com",
        status: "aktif",
    },
];
const DUMMY_LESSONS = [
    {
        id: "l1",
        title: "Tahsin",
        date: new Date().toISOString().slice(0, 10),
        start: "07:30",
        end: "09:00",
        teacher_name: "Ridla",
        note: "Makharijul huruf",
    },
];
const DUMMY_QUIZZES = [
    {
        id: "qz-1",
        subjectId: "sbj-1", // Matematika
        title: "Quiz Aljabar Dasar",
        status: "open",
    },
    {
        id: "qz-2",
        subjectId: "sbj-1",
        title: "Quiz Geometri",
        status: "closed",
    },
];
const DUMMY_SUBJECTS = [
    { id: "sbj-1", name: "Matematika", teacher: "Budi Santoso" },
    { id: "sbj-2", name: "Bahasa Indonesia", teacher: "Siti Nurhaliza" },
];
const DUMMY_TASKS = [
    {
        id: "tsk-1",
        subjectId: "sbj-1",
        title: "PR Aljabar",
        dueDate: "2025-09-30",
        status: "pending",
    },
    {
        id: "tsk-2",
        subjectId: "sbj-2",
        title: "Ringkasan Cerpen",
        dueDate: "2025-09-25",
        status: "submitted",
    },
];
/* ========= Fetchers ========= */
async function fetchSection(id) {
    if (USE_DUMMY)
        return DUMMY_SECTION(id);
    try {
        const r = await axios.get(`/api/a/class-sections/${id}`);
        return r.data.data;
    }
    catch {
        return null;
    }
}
async function fetchParticipants(id) {
    if (USE_DUMMY)
        return DUMMY_PARTICIPANTS;
    return [];
}
async function fetchLessons(id) {
    if (USE_DUMMY)
        return DUMMY_LESSONS;
    return [];
}
/* ========= UI mappers ========= */
function mapParticipant(x) {
    return {
        id: x.class_student_id || x.student_id || x.id || crypto.randomUUID(),
        name: x.student_name || x.name || "-",
        nis: x.nis,
        gender: x.gender,
        phone: x.phone,
        email: x.email,
        status: x.status,
    };
}
function mapLesson(x) {
    return {
        id: x.class_lesson_id || x.id || crypto.randomUUID(),
        title: x.title || x.topic || x.subject_name || "Materi",
        date: x.date,
        time: x.start && x.end ? `${x.start}–${x.end}` : x.start || x.end,
        teacher: x.teacher_name,
        note: x.note,
    };
}
const SEMESTER_RANGES = {
    "2025-Ganjil": { start: "2025-07-01", end: "2025-12-31" },
    "2025-Genap": { start: "2026-01-01", end: "2026-06-30" },
};
const inRange = (iso, s, e) => iso >= s && iso <= e;
/* ========= Page ========= */
export default function SchoolDetailClass() {
    const { id = "" } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [semester, setSemester] = useState("2025-Ganjil");
    const sectionQ = useQuery({
        queryKey: ["section", id],
        enabled: !!id,
        queryFn: () => fetchSection(id),
    });
    const participantsQ = useQuery({
        queryKey: ["participants", id],
        enabled: !!id,
        queryFn: () => fetchParticipants(id),
    });
    const lessonsQ = useQuery({
        queryKey: ["lessons", id],
        enabled: !!id,
        queryFn: () => fetchLessons(id),
    });
    const section = sectionQ.data ?? undefined;
    const participants = useMemo(() => (participantsQ.data ?? []).map(mapParticipant), [participantsQ.data]);
    const lessons = useMemo(() => (lessonsQ.data ?? []).map(mapLesson), [lessonsQ.data]);
    const semesterRange = SEMESTER_RANGES[semester];
    const lessonsInSemester = lessons.filter((l) => l.date && inRange(l.date, semesterRange.start, semesterRange.end));
    return (_jsxs("div", { className: "h-full w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Kelas", gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "px-4  md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-6", children: [_jsxs("section", { className: "flex items-center justify-between ", children: [_jsxs("div", { className: " md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: "Detail Kelas" })] }), _jsxs("select", { value: semester, onChange: (e) => setSemester(e.target.value), className: "border rounded px-2 py-1", children: [_jsx("option", { value: "2025-Ganjil", children: "2025 Ganjil" }), _jsx("option", { value: "2025-Genap", children: "2025 Genap" })] })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-4 grid gap-4 md:grid-cols-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                            background: palette.primary2,
                                                            color: palette.primary,
                                                        }, children: _jsx(User, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Wali Kelas" }), _jsx("div", { className: "font-medium", children: section?.teacher?.user_name ?? "-" }), section?.teacher?.email && (_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: _jsxs("h1", { className: "text-sm", children: [" ", section.teacher.email] }) }))] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                            background: palette.primary2,
                                                            color: palette.primary,
                                                        }, children: _jsx(CalendarDays, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Hari & Lokasi" }), _jsx("div", { className: "font-medium", children: (section?.class_sections_schedule?.days ?? []).join(", ") || "-" }), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: section?.class_sections_schedule?.location ?? "-" })] })] }), _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "h-10 w-10 grid place-items-center rounded-xl", style: {
                                                            background: palette.primary2,
                                                            color: palette.primary,
                                                        }, children: _jsx(Clock4, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Waktu" }), _jsx("div", { className: "font-medium", children: scheduleToText(section?.class_sections_schedule) })] })] })] }) }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 font-medium flex items-center gap-2", children: [_jsx(Users, { size: 18 }), " Peserta"] }), _jsx("div", { className: "p-4 overflow-x-auto", children: _jsxs("table", { className: "min-w-full table-auto text-sm border-collapse", children: [_jsx("thead", { className: "border-b", style: {
                                                            borderColor: palette.silver1,
                                                            color: palette.black2,
                                                        }, children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left", children: "NIS" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Nama" }), _jsx("th", { className: "px-4 py-2 text-center", children: "JK" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Kontak" }), _jsx("th", { className: "px-4 py-2 text-center", children: "Status" })] }) }), _jsx("tbody", { children: participants.map((p) => (_jsxs("tr", { className: "border-b", style: { borderColor: palette.silver1 }, children: [_jsx("td", { className: "px-4 py-2", children: p.nis ?? "-" }), _jsx("td", { className: "px-4 py-2 font-medium", children: p.name }), _jsx("td", { className: "px-4 py-2 text-center", children: p.gender ?? "-" }), _jsx("td", { className: "px-4 py-2", children: _jsxs("div", { className: "flex flex-col", children: [p.phone && _jsx("span", { children: p.phone }), p.email && (_jsx("a", { href: `mailto:${p.email}`, className: "text-sm underline", style: { color: palette.primary }, children: p.email }))] }) }), _jsx("td", { className: "px-4 py-2 text-center", children: _jsx(Badge, { palette: palette, variant: p.status === "aktif" ? "success" : "outline", children: p.status ?? "Aktif" }) })] }, p.id))) })] }) })] }), _jsxs(SectionCard, { palette: palette, children: [_jsxs("div", { className: "p-4 md:p-5 pb-2 flex items-center justify-between", children: [_jsxs("div", { className: "font-medium flex items-center gap-2", children: [_jsx(BookOpen, { size: 18 }), " Mata Pelajaran"] }), _jsx(Btn, { palette: palette, variant: "ghost", children: "+ Tambah Mapel" })] }), _jsx("div", { className: "px-4 md:px-5 pb-4 space-y-4", children: DUMMY_SUBJECTS.map((subj) => (_jsxs("div", { className: "border rounded-lg p-4", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: subj.name }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["Guru: ", subj.teacher] })] }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", children: "Tambah Tugas" })] }), _jsx("div", { className: "mt-3 overflow-x-auto", children: _jsxs("table", { className: "min-w-[500px] w-full text-sm", children: [_jsx("thead", { className: "text-left border-b", style: {
                                                                        color: palette.black2,
                                                                        borderColor: palette.silver1,
                                                                    }, children: _jsxs("tr", { children: [_jsx("th", { className: "py-2 pr-4", children: "Judul" }), _jsx("th", { className: "py-2 pr-4", children: "Deadline" }), _jsx("th", { className: "py-2 pr-4", children: "Status" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: DUMMY_TASKS.filter((t) => t.subjectId === subj.id).map((t) => (_jsxs("tr", { children: [_jsx("td", { className: "py-3 pr-4 text-sm", children: t.title }), _jsx("td", { className: "py-3 pr-4", children: dateLong(t.dueDate) }), _jsx("td", { className: "py-3 pr-4 text-sm", children: _jsx(Badge, { palette: palette, variant: t.status === "graded"
                                                                                        ? "success"
                                                                                        : t.status === "submitted"
                                                                                            ? "secondary"
                                                                                            : "outline", children: t.status }) })] }, t.id))) })] }) }), _jsxs("div", { className: "mt-5", children: [_jsx("div", { className: "font-medium mb-2", children: "Quiz" }), _jsxs("table", { className: "min-w-[400px] w-full text-sm", children: [_jsx("thead", { className: "text-left border-b", style: {
                                                                            color: palette.black2,
                                                                            borderColor: palette.silver1,
                                                                        }, children: _jsxs("tr", { children: [_jsx("th", { className: "py-2 pr-4", children: "Judul" }), _jsx("th", { className: "py-2 pr-4", children: "Status" }), _jsx("th", { className: "py-2 pr-4", children: "Aksi" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: palette.silver1 }, children: DUMMY_QUIZZES.filter((q) => q.subjectId === subj.id).map((q) => (_jsxs("tr", { children: [_jsx("td", { className: "py-3 pr-4", children: q.title }), _jsx("td", { className: "py-3 pr-4", children: _jsx(Badge, { palette: palette, variant: q.status === "graded"
                                                                                            ? "success"
                                                                                            : q.status === "open"
                                                                                                ? "secondary"
                                                                                                : "outline", children: q.status }) }), _jsx("td", { className: "py-3 pr-4", children: _jsx(Btn, { palette: palette, size: "sm", variant: "default", onClick: () => navigate(`../quiz/${q.id}`), children: "Detail" }) })] }, q.id))) })] })] })] }, subj.id))) })] })] })] }) })] }));
}
