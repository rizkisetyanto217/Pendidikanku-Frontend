import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/StudentReport.tsx
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Award, CalendarDays, ClipboardList, FileText, GraduationCap, LineChart, Percent, User2, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, ProgressBar, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* ============== Fake API (dummy rapor) ============= */
async function fetchReport() {
    const today = new Date();
    const iso = (d) => d.toISOString();
    const start = new Date(today.getFullYear(), 6, 15);
    const end = new Date(today.getFullYear(), 11, 15);
    const scores = {
        tajwid: 88,
        tilawah: 91,
        hafalan: 86,
        fikih: 84,
        akhlak: 92,
    };
    const vals = Object.values(scores);
    const average = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
    return {
        student: { id: "c1", name: "Ahmad", className: "TPA A" },
        period: {
            label: "Semester Ganjil 2025/2026",
            start: iso(start),
            end: iso(end),
        },
        attendance: {
            totalSessions: 20,
            hadir: 18,
            sakit: 1,
            izin: 1,
            alpa: 0,
            online: 2,
        },
        scores: {
            ...scores,
            average,
            min: Math.min(...vals),
            max: Math.max(...vals),
        },
        memorization: {
            juzProgress: 0.6,
            iqraLevel: "Iqra 2",
            latest: [
                {
                    date: new Date().toISOString(),
                    item: "An-Naba 1–10",
                    type: "setoran",
                    score: 90,
                    note: "Makhraj bagus, perhatikan mad thabi'i.",
                },
                {
                    date: new Date(Date.now() - 864e5 * 2).toISOString(),
                    item: "Al-Baqarah 255–257",
                    type: "murajaah",
                    score: 88,
                },
            ],
        },
        remarks: {
            homeroom: "Alhamdulillah, progress sangat baik. Fokus meningkat, bacaan lebih tartil. Pertahankan adab ketika teman mendapat giliran.",
            recommendations: [
                "Latihan mad thabi'i 5 menit/hari.",
                "PR: An-Naba 11–15 (lanjutan).",
            ],
        },
    };
}
/* ============== Helpers ============= */
const toID = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
const topbarDateFmt = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
// --- timezone-safe helpers (pakai “siang lokal”)
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const hijriWithWeekday = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
function grade(num) {
    if (num >= 90)
        return { label: "A", variant: "success" };
    if (num >= 80)
        return { label: "B", variant: "info" };
    if (num >= 70)
        return { label: "C", variant: "secondary" };
    if (num >= 60)
        return { label: "D", variant: "warning" };
    return { label: "E", variant: "destructive" };
}
/* ============== Page ============= */
export default function StudentRaport() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { data: s } = useQuery({
        queryKey: ["student-report"],
        queryFn: fetchReport,
        staleTime: 60_000,
    });
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Rapor Nilai", gregorianDate: new Date().toISOString(), hijriDate: hijriWithWeekday(new Date().toISOString()) }), _jsx("main", { className: "w-full px-4 md:px-6 py-4   md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Raport Siswa" })] }), _jsx(SectionCard, { palette: palette, className: "p-4 md:p-5", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Siswa" }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx(User2, { size: 16 }), _jsx("div", { className: "font-medium", children: s?.student.name })] }), _jsxs("div", { className: "text-sm mt-1", style: { color: palette.black2 }, children: ["Kelas: ", s?.student.className] })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Periode" }), _jsx("div", { className: "mt-1 font-medium", children: s?.period.label }), _jsx("div", { className: "text-sm mt-1", style: { color: palette.black2 }, children: s ? `${toID(s.period.start)} — ${toID(s.period.end)}` : "" })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Rata-rata Nilai" }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx("span", { className: "text-2xl font-semibold", children: s?.scores.average ?? "-" }), s && (_jsxs(Badge, { variant: grade(s.scores.average).variant, palette: palette, children: [_jsx(Award, { size: 14, className: "mr-1" }), grade(s.scores.average).label] }))] }), s && (_jsxs("div", { className: "text-sm mt-1", style: { color: palette.black2 }, children: ["Min ", s.scores.min, " \u2022 Max ", s.scores.max] }))] })] }) }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18 }), " Rekap Absensi"] }), s && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-3", children: [
                                                {
                                                    label: "Hadir",
                                                    value: s.attendance.hadir,
                                                    variant: "success",
                                                },
                                                {
                                                    label: "Online",
                                                    value: s.attendance.online,
                                                    variant: "info",
                                                },
                                                {
                                                    label: "Izin",
                                                    value: s.attendance.izin,
                                                    variant: "secondary",
                                                },
                                                {
                                                    label: "Sakit",
                                                    value: s.attendance.sakit,
                                                    variant: "warning",
                                                },
                                                {
                                                    label: "Alpa",
                                                    value: s.attendance.alpa,
                                                    variant: "destructive",
                                                },
                                            ].map((it) => {
                                                const pct = s.attendance.totalSessions > 0
                                                    ? Math.round((it.value / s.attendance.totalSessions) * 100)
                                                    : 0;
                                                return (_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: it.label }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx(Badge, { variant: it.variant, palette: palette, children: it.value }), _jsxs("span", { className: "text-sm", style: { color: palette.black2 }, children: ["/ ", s.attendance.totalSessions, " sesi"] })] }), _jsxs("div", { className: "mt-2 flex items-center gap-2 text-sm", children: [_jsx(Percent, { size: 12 }), " ", pct, "%"] }), _jsx("div", { className: "mt-2", children: _jsx(ProgressBar, { value: pct, palette: palette }) })] }, it.label));
                                            }) }))] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(GraduationCap, { size: 18 }), " Nilai Per Aspek"] }), s && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-3", children: [
                                                { k: "tajwid", label: "Tajwid", val: s.scores.tajwid },
                                                { k: "tilawah", label: "Tilawah", val: s.scores.tilawah },
                                                { k: "hafalan", label: "Hafalan", val: s.scores.hafalan },
                                                { k: "fikih", label: "Fikih/Praktik", val: s.scores.fikih },
                                                { k: "akhlak", label: "Akhlak/Adab", val: s.scores.akhlak },
                                            ].map((a) => {
                                                const g = grade(a.val);
                                                return (_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: a.label }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx("span", { className: "text-xl font-semibold", children: a.val }), _jsx(Badge, { variant: g.variant, palette: palette, children: g.label })] }), _jsx("div", { className: "mt-2", children: _jsx(ProgressBar, { value: a.val, palette: palette }) })] }, a.k));
                                            }) }))] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(LineChart, { size: 18 }), " Progres Hafalan & Iqra"] }), s && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Progres Juz (\u2248)" }), _jsxs("div", { className: "mt-2", children: [_jsx(ProgressBar, { value: (Math.min(2, s.memorization.juzProgress) / 2) * 100, palette: palette }), _jsxs("div", { className: "mt-1 text-sm", style: { color: palette.black2 }, children: ["~ ", s.memorization.juzProgress, " Juz"] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Level Iqra" }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx(ClipboardList, { size: 16 }), _jsx("span", { className: "font-medium", children: s.memorization.iqraLevel ?? "-" })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Setoran Terakhir" }), _jsx("div", { className: "mt-1 text-sm space-y-1", children: s.memorization.latest.map((m, i) => (_jsxs("div", { className: "rounded-lg border p-2", style: {
                                                                    borderColor: palette.silver1,
                                                                    background: palette.white1,
                                                                }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: toID(m.date) }), _jsxs("div", { className: "flex items-center gap-2", style: { color: palette.black2 }, children: [_jsx(Badge, { variant: "outline", palette: palette, children: _jsx("p", { style: { color: palette.black2 }, children: m.type }) }), _jsx("span", { className: "font-medium", children: m.item }), typeof m.score === "number" && (_jsx(Badge, { variant: "secondary", palette: palette, children: m.score }))] }), m.note && (_jsx("div", { className: "text-sm mt-1", style: { color: palette.black2 }, children: _jsx("p", { style: { color: palette.black2 }, children: m.note }) }))] }, i))) })] })] }))] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(FileText, { size: 18 }), " Catatan Wali Kelas"] }), s && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Catatan" }), _jsx("p", { className: "mt-1 text-sm", children: s.remarks.homeroom })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Rekomendasi / PR" }), _jsx("ul", { className: "mt-1 list-disc pl-5 text-sm", children: (s.remarks.recommendations ?? []).map((r, i) => (_jsx("li", { children: r }, i))) })] })] }))] }), _jsx("div", { className: "flex items-center justify-end", children: _jsxs(Btn, { variant: "secondary", palette: palette, children: [_jsx(FileText, { size: 16, className: "mr-1" }), " Cetak / Unduh"] }) })] })] }) })] }));
}
