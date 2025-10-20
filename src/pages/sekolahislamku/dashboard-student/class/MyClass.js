import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/student/MyClass.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { ArrowLeft, CalendarDays, BookOpen, FileText, ClipboardList, GraduationCap, ChevronDown, Search, Activity, Video, Info, } from "lucide-react";
/* ===== Helpers ===== */
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const ENROLLED = [
    {
        id: "tahsin",
        name: "Tahsin",
        room: "Aula 1",
        homeroom: "Ustadz Abdullah",
        nextSession: {
            dateISO: new Date().toISOString(),
            time: "07:30",
            title: "Tahsin — Tajwid & Makhraj",
        },
        progress: 68,
        pendingAssignments: 2,
        activeQuizzes: 1,
        lastScore: 88,
    },
    {
        id: "tahfidz",
        name: "Tahfidz",
        room: "R. Tahfiz",
        homeroom: "Ustadz Salman",
        nextSession: {
            dateISO: new Date(Date.now() + 864e5).toISOString(),
            time: "09:30",
            title: "Hafalan Juz 30",
        },
        progress: 42,
        pendingAssignments: 1,
        activeQuizzes: 0,
        lastScore: 92,
    },
];
/* ===== Zoom per-kelas (dummy) ===== */
const ZOOM_INFO = {
    tahsin: {
        url: "https://us04web.zoom.us/j/74836152611?pwd=28Lxo5tjoNgArUWEEFZenOsxaDBuSk.1",
        topic: "Sumini's Zoom Meeting",
        meetingId: "748 3615 2611",
        passcode: "4pj4qt",
        startAtLabel: "Kamis, 9 Okt 2025 • 13:00 WIB",
    },
    tahfidz: {
        url: "https://us04web.zoom.us/j/74836152611?pwd=28Lxo5tjoNgArUWEEFZenOsxaDBuSk.1",
        topic: "Sumini's Zoom Meeting",
        meetingId: "748 3615 2611",
        passcode: "4pj4qt",
        startAtLabel: "Kamis, 9 Okt 2025 • 13:00 WIB",
    },
};
const MyClass = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const base = `/${slug}/murid`;
    const [q, setQ] = useState("");
    const list = useMemo(() => {
        const key = q.trim().toLowerCase();
        if (!key)
            return ENROLLED;
        return ENROLLED.filter((c) => c.name.toLowerCase().includes(key) ||
            c.homeroom.toLowerCase().includes(key) ||
            (c.room ?? "").toLowerCase().includes(key));
    }, [q]);
    const go = (path) => navigate(`${base}${path}`);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Kelas Saya (Murid)", gregorianDate: new Date().toISOString(), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden gap-3 items-center", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "textlg font-semibold", children: "Daftar Kelas" })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-4 md:p-5", children: _jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 h-10 w-full md:w-96", style: {
                                                borderColor: palette.silver1,
                                                background: palette.white1,
                                            }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari kelas / wali kelas / ruangan\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] }) }) }), _jsxs("div", { className: "grid gap-3", children: [list.map((c) => {
                                            const z = ZOOM_INFO[c.id];
                                            return (_jsxs(SectionCard, { palette: palette, className: "p-0", children: [_jsx("div", { className: "p-4 md:p-5", children: _jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("div", { className: "text-base md:text-lg font-semibold", children: c.name }), c.room && (_jsx(Badge, { palette: palette, variant: "outline", className: "h-6", children: c.room }))] }), _jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-sm", style: { color: palette.black2 }, children: [_jsxs("span", { children: ["Wali Kelas: ", c.homeroom] }), _jsxs("span", { children: ["\u2022 Progres: ", c.progress ?? 0, "%"] }), _jsxs("span", { children: ["\u2022 Tugas menunggu: ", c.pendingAssignments ?? 0] }), _jsxs("span", { children: ["\u2022 Quiz aktif: ", c.activeQuizzes ?? 0] }), typeof c.lastScore === "number" && (_jsxs("span", { children: ["\u2022 Nilai terakhir: ", c.lastScore] }))] }), c.nextSession && (_jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-sm", style: { color: palette.black2 }, children: [_jsx(CalendarDays, { size: 14 }), _jsxs("span", { children: [dateLong(c.nextSession.dateISO), " \u2022", " ", c.nextSession.time] }), _jsxs("span", { children: ["\u2014 ", c.nextSession.title] })] }))] }) }) }), _jsx("div", { className: "px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t", style: { borderColor: palette.silver1 }, children: _jsxs("details", { className: "group", children: [_jsxs("summary", { className: "flex items-center justify-between cursor-pointer select-none rounded-lg px-3 py-2", style: { background: palette.white1 }, children: [_jsx("span", { className: "text-sm", style: { color: palette.black2 }, children: "Aksi cepat" }), _jsx(ChevronDown, { size: 18, className: "transition-transform group-open:rotate-180" })] }), z && (_jsxs("div", { className: "mt-3 rounded-lg border p-3 text-xs md:text-sm", style: {
                                                                        borderColor: palette.silver1,
                                                                        background: palette.white1,
                                                                        color: palette.black2,
                                                                    }, children: [_jsxs("div", { className: "flex items-center gap-2 font-medium", children: [_jsx(Info, { size: 14 }), z.topic, " \u2022 ", z.startAtLabel] }), _jsxs("div", { className: "mt-1", children: ["ID:", " ", _jsx("span", { className: "font-semibold", children: z.meetingId }), " • ", "Passcode:", " ", _jsx("span", { className: "font-semibold", children: z.passcode })] })] })), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [z && (_jsx("a", { href: z.url, target: "_blank", rel: "noopener noreferrer", className: "shrink-0", children: _jsxs(Btn, { palette: palette, size: "sm", children: [_jsx(Video, { size: 16, className: "mr-1" }), "Masuk Kelas (Zoom)"] }) })), _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => go(`/menu-utama/my-class/${c.id}/kehadiran`), children: [_jsx(Activity, { size: 16, className: "mr-1" }), "Kehadiran"] }), _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => go(`/menu-utama/my-class/${c.id}/materi`), children: [_jsx(BookOpen, { size: 16, className: "mr-1" }), "Materi"] }), _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => go(`/menu-utama/my-class/${c.id}/tugas`), children: [_jsx(FileText, { size: 16, className: "mr-1" }), "Tugas"] }), _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => go(`/menu-utama/my-class/${c.id}/quiz`), children: [_jsx(ClipboardList, { size: 16, className: "mr-1" }), "Quiz"] }), _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => go(`/menu-utama/my-class/${c.id}/ujian`), children: [_jsx(ClipboardList, { size: 16, className: "mr-1" }), "Ujian"] }), _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => go(`/kelas/${c.id}/score`), children: [_jsx(GraduationCap, { size: 16, className: "mr-1" }), "Nilai"] })] })] }) })] }, c.id));
                                        }), list.length === 0 && (_jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "p-6 text-sm text-center", style: { color: palette.silver2 }, children: "Belum ada kelas yang diikuti." }) }))] })] })] }) })] }));
};
export default MyClass;
