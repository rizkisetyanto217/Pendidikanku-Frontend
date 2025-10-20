import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/StudentNotesDetail.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Filter, Search, NotebookPen, Star, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* ===== Dummy API ===== */
const iso = (d) => d.toISOString();
const dminus = (n) => new Date(Date.now() - n * 864e5);
function makeNotes(days = 30) {
    const res = [];
    for (let i = 0; i < days; i++) {
        const base = {
            date: iso(dminus(i)),
            informasiUmum: i % 3 === 0
                ? "Latihan tajwid: mad thabi'i."
                : i % 3 === 1
                    ? "Praktik adab di kelas."
                    : "Praktik wudhu dan tartil surat pendek.",
        };
        if (i % 2 === 0)
            base.materiPersonal = "Muroja'ah Iqra 2 halaman 10–12";
        if (i % 4 === 0)
            base.penilaianPersonal = "Fokus meningkat, makhraj membaik.";
        if (i % 5 === 0)
            base.nilai = 85 + (i % 3) * 3;
        if (i % 3 === 0)
            base.hafalan = i % 6 === 0 ? "An-Naba 1–10" : "Al-Fatihah 1–7";
        if (i % 4 === 2)
            base.pr = "Latihan bacaan mad pada Iqra 2 halaman 13–14";
        res.push(base);
    }
    return res;
}
async function fetchNotes(childId, days = 30) {
    const notes = makeNotes(days);
    const withScore = notes.filter((n) => typeof n.nilai === "number");
    const avg = withScore.length > 0
        ? Math.round((withScore.reduce((a, b) => a + (b.nilai ?? 0), 0) /
            withScore.length) *
            10) / 10
        : undefined;
    return {
        student: { id: childId ?? "c1", name: "Ahmad", className: "TPA A" },
        stats: {
            total: notes.length,
            withHafalan: notes.filter((n) => !!n.hafalan).length,
            withPR: notes.filter((n) => !!n.pr).length,
            withScore: withScore.length,
            avgScore: avg,
        },
        notes,
    };
}
/* ===== Helpers ===== */
const dateLong = (isoStr) => new Date(isoStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
const dateShort = (isoStr) => new Date(isoStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
});
const topbarDateFmt = (isoStr) => new Date(isoStr).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
/* ===== Page ===== */
export default function StudentNotesSummary() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const [sp, setSp] = useSearchParams();
    const childId = sp.get("child") ?? undefined;
    const period = sp.get("period") ?? "30"; // 7 | 30 | all
    const category = sp.get("cat") ?? "all"; // all | hafalan | pr | nilai | materi | penilaian
    const q = sp.get("q") ?? "";
    const { data: s } = useQuery({
        queryKey: ["student-notes", childId, period],
        queryFn: () => fetchNotes(childId, period === "all" ? 60 : Number(period)),
        staleTime: 60_000,
    });
    const filtered = s?.notes.filter((n) => {
        const matchCat = category === "all"
            ? true
            : category === "hafalan"
                ? !!n.hafalan
                : category === "pr"
                    ? !!n.pr
                    : category === "nilai"
                        ? typeof n.nilai === "number"
                        : category === "materi"
                            ? !!n.materiPersonal
                            : category === "penilaian"
                                ? !!n.penilaianPersonal
                                : true;
        const text = [
            n.informasiUmum,
            n.materiPersonal,
            n.penilaianPersonal,
            n.hafalan,
            n.pr,
            n.nilai?.toString(),
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        const matchQ = q ? text.includes(q.toLowerCase()) : true;
        return matchCat && matchQ;
    }) ?? [];
    const change = (key, value) => {
        const next = new URLSearchParams(sp);
        if (value)
            next.set(key, value);
        else
            next.delete(key);
        setSp(next, { replace: true });
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Catatan & Hafalan", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "w-full px-4 md:px-6 py-4   md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Catatan" })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), " Ringkasan"] }), s && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Total Catatan" }), _jsx("div", { className: "mt-1 font-semibold", children: s.stats.total })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Ada Hafalan" }), _jsx(Badge, { className: "mt-1", variant: "info", palette: palette, children: s.stats.withHafalan })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Ada PR" }), _jsx(Badge, { className: "mt-1", variant: "secondary", palette: palette, children: s.stats.withPR })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Ada Nilai" }), _jsx(Badge, { className: "mt-1", variant: "outline", palette: palette, children: _jsxs("p", { style: { color: palette.black2 }, children: [" ", s.stats.withScore] }) })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Rata-rata Nilai" }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx("span", { className: "text-xl font-semibold", children: s.stats.avgScore ?? "-" }), typeof s.stats.avgScore === "number" && (_jsxs(Badge, { variant: "success", palette: palette, children: [_jsx(Star, { size: 14, className: "mr-1" }), "Baik"] }))] })] })] }))] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(Filter, { size: 18, color: palette.quaternary }), " Filter"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.black2 }, children: "Periode" }), _jsxs("select", { value: period, onChange: (e) => change("period", e.target.value), className: "rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "7", children: "7 hari terakhir" }), _jsx("option", { value: "30", children: "30 hari terakhir" }), _jsx("option", { value: "all", children: "Semua (60 hari)" })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.black2 }, children: "Kategori" }), _jsxs("select", { value: category, onChange: (e) => change("cat", e.target.value), className: "rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "all", children: "Semua" }), _jsx("option", { value: "hafalan", children: "Hafalan" }), _jsx("option", { value: "pr", children: "PR" }), _jsx("option", { value: "nilai", children: "Nilai" }), _jsx("option", { value: "materi", children: "Materi" }), _jsx("option", { value: "penilaian", children: "Penilaian" })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.black2 }, children: "Cari" }), _jsxs("div", { className: "flex items-center rounded-lg border px-2", style: { borderColor: palette.silver1 }, children: [_jsx(Search, { size: 16, className: "mr-1" }), _jsx("input", { value: q, onChange: (e) => change("q", e.target.value), placeholder: "kata kunci\u2026", className: "w-full bg-transparent py-2 outline-none" })] })] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(NotebookPen, { size: 18, color: palette.quaternary }), " Daftar Catatan"] }), _jsxs("div", { className: "grid grid-cols-1 gap-3", children: [filtered.length === 0 && (_jsx("div", { className: "rounded-xl border px-3 py-3 text-sm", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white2,
                                                        color: palette.silver2,
                                                    }, children: "Tidak ada catatan untuk filter saat ini." })), filtered.map((n, i) => (_jsxs("div", { className: "rounded-xl border p-3", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white2,
                                                    }, children: [_jsxs("div", { className: "text-sm mb-2", style: { color: palette.black2 }, children: [dateShort(n.date), " \u2022 ", dateLong(n.date)] }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Info Umum:" }), " ", n.informasiUmum] }), n.materiPersonal && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Materi:" }), " ", n.materiPersonal] })), n.hafalan && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Hafalan:" }), " ", n.hafalan] })), n.penilaianPersonal && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Penilaian:" }), " ", n.penilaianPersonal] })), typeof n.nilai === "number" && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium", children: "Nilai:" }), " ", n.nilai, _jsx(Badge, { variant: n.nilai >= 90
                                                                                ? "success"
                                                                                : n.nilai >= 80
                                                                                    ? "info"
                                                                                    : "secondary", palette: palette, children: n.nilai >= 90 ? "A" : n.nilai >= 80 ? "B" : "C" })] })), n.pr && (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "PR:" }), " ", n.pr] }))] })] }, `${n.date}-${i}`)))] })] })] })] }) })] }));
}
