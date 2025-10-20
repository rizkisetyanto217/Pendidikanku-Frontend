import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/TeacherGrading.tsx
import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Filter, Search, CheckCircle2, Download, Plus, CalendarDays, Users, ClipboardList, BookOpen, Clock, TrendingUp, FileText, Eye, } from "lucide-react";
import ParentTopBar from "../../components/home/ParentTopBar";
import ParentSidebar from "../../components/home/ParentSideBar";
import ModalGrading from "./components/ModalGrading";
import ModalExportResult from "./components/ModalExportResult";
/* ============ Fake API (ganti ke axios bila siap) ============ */
async function fetchTeacherGrading() {
    const now = new Date();
    // semua tanggal dibuat aman (siang lokal)
    const iso = toLocalNoonISO(now);
    const plusDays = (n) => toLocalNoonISO(new Date(now.getTime() + n * 864e5));
    const assignments = [
        {
            id: "a1",
            title: "Evaluasi Wudhu",
            className: "TPA A",
            dueDate: plusDays(1), // ✅
            submitted: 18,
            graded: 10,
            total: 22,
        },
        {
            id: "a2",
            title: "Setoran Hafalan An-Naba 1–10",
            className: "TPA B",
            dueDate: plusDays(2), // ✅
            submitted: 12,
            graded: 7,
            total: 20,
        },
        {
            id: "a3",
            title: "Latihan Makhraj (ba-ta-tha)",
            className: "TPA A",
            dueDate: plusDays(3), // ✅
            submitted: 5,
            graded: 0,
            total: 22,
        },
    ];
    const submissionsA1 = [
        {
            id: "s1",
            studentName: "Ahmad",
            status: "graded",
            score: 88,
            submittedAt: iso,
        },
        {
            id: "s2",
            studentName: "Fatimah",
            status: "graded",
            score: 92,
            submittedAt: iso,
        },
        { id: "s3", studentName: "Hasan", status: "submitted", submittedAt: iso },
        { id: "s4", studentName: "Aisyah", status: "submitted", submittedAt: iso },
        { id: "s5", studentName: "Umar", status: "missing" },
    ];
    const submissionsA2 = [
        {
            id: "b1",
            studentName: "Bilal",
            status: "graded",
            score: 80,
            submittedAt: iso,
        },
        { id: "b2", studentName: "Huda", status: "submitted", submittedAt: iso },
    ];
    return {
        gregorianDate: iso, // ✅ local-noon
        hijriDate: hijriLong(iso), // ✅ konsisten Umm al-Qura
        classes: ["TPA A", "TPA B"],
        summary: {
            assignments: assignments.length,
            toGrade: assignments.reduce((n, a) => n + Math.max(0, a.submitted - a.graded), 0),
            graded: assignments.reduce((n, a) => n + a.graded, 0),
            average: 84,
        },
        assignments,
        submissionsByAssignment: { a1: submissionsA1, a2: submissionsA2, a3: [] },
    };
}
/* ================= Helpers ================ */
/* ================= Date helpers (timezone-safe) ================= */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
const normalizeISOToLocalNoon = (iso) => iso ? toLocalNoonISO(new Date(iso)) : undefined;
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
/** Hijriah (Umm al-Qura) – selalu pakai ISO yang sudah local-noon */
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);
;
/* =============== UI Components =============== */
function StatCard({ palette, icon: Icon, label, value, subtitle, trend, }) {
    return (_jsx("div", { className: "p-4 rounded-xl border transition-all hover:shadow-sm", style: { borderColor: palette.silver1, background: palette.white1 }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: palette.primary2 }, children: _jsx(Icon, { size: 16, style: { color: palette.primary } }) }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-medium", style: { color: palette.silver2 }, children: label }), _jsx("div", { className: "text-xl font-bold", children: value }), subtitle && (_jsx("div", { className: "text-xs", style: { color: palette.silver2 }, children: subtitle }))] })] }), trend && (_jsx(TrendingUp, { size: 14, style: {
                        color: trend === "up"
                            ? "#10B981"
                            : trend === "down"
                                ? "#EF4444"
                                : palette.silver2,
                    } }))] }) }));
}
function ProgressBar({ palette, value, max, showLabel = true, }) {
    const percentage = pct(value, max);
    return (_jsxs("div", { className: "space-y-1", children: [showLabel && (_jsxs("div", { className: "flex justify-between text-xs", style: { color: palette.silver2 }, children: [_jsxs("span", { children: [value, "/", max] }), _jsxs("span", { children: [percentage, "%"] })] })), _jsx("div", { className: "w-full h-2 rounded-full overflow-hidden", style: { backgroundColor: palette.silver1 }, children: _jsx("div", { className: "h-full transition-all duration-300 rounded-full", style: { backgroundColor: palette.primary, width: `${percentage}%` } }) })] }));
}
function FilterChip({ palette, label, active, onClick, count, }) {
    return (_jsxs("button", { onClick: onClick, className: "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105 snap-start", style: {
            background: active ? palette.primary2 : palette.white1,
            color: active ? palette.primary : palette.black1,
            borderColor: active ? palette.primary : palette.silver1,
        }, children: [label, typeof count === "number" && (_jsx("span", { className: "px-2 py-0.5 rounded-full text-xs", style: {
                    background: active ? palette.primary : palette.silver1,
                    color: active ? palette.white1 : palette.silver2,
                }, children: count }))] }));
}
/* ================= Page ================= */
export default function TeacherGrading() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const { data, isLoading } = useQuery({
        queryKey: ["teacher-grading"],
        queryFn: fetchTeacherGrading,
        staleTime: 60_000,
    });
    // filters
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [selectedId, setSelectedId] = useState(null);
    const [submissionSearchQ, setSubmissionSearchQ] = useState("");
    const [mobileTab, setMobileTab] = useState("list");
    // modal grading
    const [gradingOpen, setGradingOpen] = useState(false);
    const [gradingStudent, setGradingStudent] = useState(null);
    // derived data
    const filteredAssignments = useMemo(() => {
        let items = data?.assignments ?? [];
        if (classFilter !== "all")
            items = items.filter((a) => a.className === classFilter);
        if (status !== "all") {
            items = items.filter((a) => {
                const done = a.graded >= a.total;
                const waiting = a.submitted - a.graded > 0;
                if (status === "done")
                    return done;
                if (status === "waiting")
                    return waiting;
                if (status === "inprogress")
                    return !done && a.graded > 0;
                return true;
            });
        }
        if (q.trim())
            items = items.filter((a) => a.title.toLowerCase().includes(q.trim().toLowerCase()));
        return items;
    }, [data?.assignments, classFilter, status, q]);
    const selected = data?.assignments.find((a) => a.id === (selectedId ?? data?.assignments[0]?.id)) ?? filteredAssignments[0];
    const submissions = useMemo(() => {
        const all = selected
            ? (data?.submissionsByAssignment[selected.id] ?? [])
            : [];
        if (!submissionSearchQ.trim())
            return all;
        return all.filter((s) => s.studentName
            .toLowerCase()
            .includes(submissionSearchQ.trim().toLowerCase()));
    }, [data?.submissionsByAssignment, selected, submissionSearchQ]);
    const statusCounts = useMemo(() => {
        const assignments = data?.assignments ?? [];
        return {
            all: assignments.length,
            waiting: assignments.filter((a) => a.submitted - a.graded > 0).length,
            inprogress: assignments.filter((a) => a.graded > 0 && a.graded < a.total)
                .length,
            done: assignments.filter((a) => a.graded >= a.total).length,
        };
    }, [data?.assignments]);
    const emptyAssignments = filteredAssignments.length === 0;
    // handlers
    const openGradeModal = useCallback((s) => {
        setGradingStudent({ id: s.id, name: s.studentName, score: s.score });
        setGradingOpen(true);
    }, []);
    const { slug } = useParams();
    // state modal export
    const [exportOpen, setExportOpen] = useState(false);
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Penilaian", gregorianDate: normalizeISOToLocalNoon(data?.gregorianDate) ??
                    toLocalNoonISO(new Date()), hijriDate: hijriLong(normalizeISOToLocalNoon(data?.gregorianDate) ??
                    toLocalNoonISO(new Date())) }), _jsx(ModalGrading, { open: gradingOpen, onClose: () => setGradingOpen(false), palette: palette, student: gradingStudent ?? undefined, assignmentTitle: selected
                    ? `${selected.title}${selected.className ? ` — (${selected.className})` : ""}`
                    : undefined, onSubmit: (payload) => {
                    alert(`Nilai disimpan: ${payload.id} = ${payload.score}`);
                    // TODO: update state/API
                } }), _jsx(ModalExportResult, { open: exportOpen, onClose: () => setExportOpen(false), palette: palette, defaultName: selected ? `rekap-${selected.title}` : "rekap-penilaian", onExport: (p) => {
                    // TODO: ganti dengan fungsi generate file (XLSX/CSV/PDF)
                    console.log("EXPORT PAYLOAD:", p);
                    setExportOpen(false);
                } }), _jsx("main", { className: "mx-auto max-w-7xl px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-6", children: [_jsx(ParentSidebar, { palette: palette }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsx("section", { children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatCard, { palette: palette, icon: BookOpen, label: "Total Penilaian", value: data?.summary.assignments ?? 0, subtitle: "tugas aktif", trend: "neutral" }), _jsx(StatCard, { palette: palette, icon: Clock, label: "Belum Dinilai", value: data?.summary.toGrade ?? 0, subtitle: "menunggu penilaian", trend: "down" }), _jsx(StatCard, { palette: palette, icon: CheckCircle2, label: "Sudah Dinilai", value: data?.summary.graded ?? 0, subtitle: "telah selesai", trend: "up" }), _jsx(StatCard, { palette: palette, icon: TrendingUp, label: "Rata-rata Nilai", value: `${data?.summary.average ?? 0}`, subtitle: "skor keseluruhan", trend: "up" })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-3 md:p-5", children: [_jsx("div", { className: "flex items-center justify-between mb-3 md:mb-4", children: _jsxs("h2", { className: "text-sm md:text-lg font-semibold flex items-center gap-2", children: [_jsx(Filter, { size: 18 }), " Filter & Kelola Penilaian"] }) }), _jsxs("div", { className: "space-y-3 md:space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 rounded-xl border px-3 py-2.5 md:px-4 md:py-3 w-full", style: {
                                                            borderColor: palette.silver1,
                                                            background: palette.white1,
                                                        }, children: [_jsx(Search, { size: 18, style: { color: palette.silver2 } }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari tugas\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "text-xs font-medium", style: { color: palette.silver2 }, children: "Status" }), _jsx("div", { className: "relative -mx-3 px-3 overflow-x-auto no-scrollbar", style: {
                                                                    WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                                                                    maskImage: "linear-gradient(90deg, transparent 0, #000 16px, #000 calc(100% - 16px), transparent 100%)",
                                                                }, children: _jsxs("div", { className: "flex gap-2 snap-x", children: [_jsx(FilterChip, { palette: palette, label: "Semua", active: status === "all", onClick: () => setStatus("all"), count: statusCounts.all }), _jsx(FilterChip, { palette: palette, label: "Menunggu", active: status === "waiting", onClick: () => setStatus("waiting"), count: statusCounts.waiting }), _jsx(FilterChip, { palette: palette, label: "Progres", active: status === "inprogress", onClick: () => setStatus("inprogress"), count: statusCounts.inprogress }), _jsx(FilterChip, { palette: palette, label: "Selesai", active: status === "done", onClick: () => setStatus("done"), count: statusCounts.done })] }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-medium", style: { color: palette.silver2 }, children: "Kelas" }), _jsxs("select", { value: classFilter, onChange: (e) => setClassFilter(e.target.value), className: "px-3 py-2 rounded-lg border text-sm bg-transparent flex-1", style: {
                                                                    background: palette.white1,
                                                                    color: palette.black1,
                                                                    borderColor: palette.silver1,
                                                                }, children: [_jsx("option", { value: "all", children: "Semua Kelas" }), (data?.classes ?? []).map((c) => (_jsx("option", { value: c, children: c }, c)))] })] })] })] }) }), _jsx("div", { className: "block lg:hidden", children: _jsx(SectionCard, { palette: palette, className: "p-2", children: _jsx("div", { className: "grid grid-cols-2 gap-1 rounded-xl p-1 border", style: {
                                                background: palette.white1,
                                                borderColor: palette.silver1,
                                            }, children: ["list", "detail"].map((t) => (_jsx("button", { onClick: () => setMobileTab(t), className: "h-9 rounded-lg text-sm font-semibold", style: {
                                                    background: mobileTab === t ? palette.primary2 : "transparent",
                                                    color: mobileTab === t ? palette.primary : palette.black1,
                                                    border: `1px solid ${mobileTab === t ? palette.primary : "transparent"}`,
                                                }, children: t === "list" ? "Daftar Tugas" : "Detail Tugas" }, t))) }) }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-6", children: [_jsx(SectionCard, { palette: palette, className: `lg:col-span-5 ${mobileTab === "list" ? "block" : "hidden lg:block"}`, children: _jsxs("div", { className: "p-3 md:p-5", children: [_jsxs("h3", { className: "text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2", children: [_jsx(ClipboardList, { size: 18 }), " Daftar Tugas (", filteredAssignments.length, ")"] }), emptyAssignments && (_jsxs("div", { className: "text-center py-10 rounded-xl border-2 border-dashed", style: {
                                                            borderColor: palette.silver1,
                                                            color: palette.silver2,
                                                            background: palette.white1,
                                                        }, children: [_jsx(ClipboardList, { size: 36, className: "mx-auto mb-2 opacity-60" }), _jsx("p", { className: "text-sm", children: "Belum ada tugas untuk filter saat ini." }), _jsxs("div", { className: "mt-3 flex gap-2 justify-center", children: [_jsxs(Btn, { palette: palette, size: "sm", onClick: () => alert("Buat Penilaian"), children: [_jsx(Plus, { size: 14, className: "mr-1" }), "Buat Tugas"] }), _jsxs(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => alert("Export Rekap"), children: [_jsx(Download, { size: 14, className: "mr-1" }), "Export"] })] })] })), !emptyAssignments && (_jsx("div", { className: "space-y-3 max-h-[600px] overflow-y-auto", children: filteredAssignments.map((a) => {
                                                            const donePct = pct(a.graded, a.total);
                                                            const waiting = Math.max(0, a.submitted - a.graded);
                                                            const active = selected?.id === a.id;
                                                            const isOverdue = new Date(a.dueDate) < new Date();
                                                            return (_jsxs("button", { onClick: () => {
                                                                    setSelectedId(a.id);
                                                                    setMobileTab("detail");
                                                                }, className: "w-full text-left rounded-xl border p-3 md:p-4 transition-all hover:shadow-sm", style: {
                                                                    borderColor: active
                                                                        ? palette.primary
                                                                        : palette.silver1,
                                                                    background: active
                                                                        ? palette.primary2
                                                                        : palette.white1,
                                                                    transform: active ? "translateY(-1px)" : "none",
                                                                }, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "font-semibold text-[13px] md:text-base truncate", children: a.title }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Badge, { palette: palette, variant: "secondary", className: "text-[11px] md:text-xs", children: a.className }), _jsxs("span", { className: "text-[11px] md:text-xs flex items-center gap-1", style: {
                                                                                                    color: isOverdue
                                                                                                        ? "#EF4444"
                                                                                                        : palette.silver2,
                                                                                                }, children: [_jsx(CalendarDays, { size: 12 }), dateShort(a.dueDate)] })] })] }), _jsxs("div", { className: "text-right shrink-0", children: [_jsxs("div", { className: "text-sm md:text-lg font-bold", style: {
                                                                                            color: donePct === 100
                                                                                                ? "#10B981"
                                                                                                : palette.primary,
                                                                                        }, children: [donePct, "%"] }), _jsx("div", { className: "text-[11px] md:text-xs", style: { color: palette.silver2 }, children: "selesai" })] })] }), _jsx("div", { className: "mt-2 md:mt-3", children: _jsx(ProgressBar, { palette: palette, value: a.graded, max: a.total, showLabel: false }) }), _jsxs("div", { className: "mt-2 md:mt-3 flex items-center justify-between text-[11px] md:text-xs", children: [_jsxs("div", { className: "flex items-center gap-3 md:gap-4", style: { color: palette.silver2 }, children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Users, { size: 12 }), a.total, " siswa"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FileText, { size: 12 }), a.submitted, " terkumpul"] })] }), waiting > 0 && (_jsxs(Badge, { palette: palette, variant: "destructive", className: "text-[11px] md:text-xs", children: [waiting, " menunggu"] }))] })] }, a.id));
                                                        }) }))] }) }), _jsx(SectionCard, { palette: palette, className: `lg:col-span-7 ${mobileTab === "list" ? "hidden lg:block" : "block"}`, children: _jsx("div", { className: "p-4 md:p-5", children: !selected ? (_jsxs("div", { className: "text-center py-12 rounded-xl border-2 border-dashed", style: {
                                                        borderColor: palette.silver1,
                                                        color: palette.silver2,
                                                    }, children: [_jsx(BookOpen, { size: 40, className: "mx-auto mb-3 opacity-50" }), _jsx("h3", { className: "text-base md:text-lg font-medium mb-1", children: "Pilih Tugas untuk Melihat Detail" }), _jsx("p", { className: "text-sm", children: "Pilih tugas dari daftar untuk melihat detail penilaian" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-start justify-between gap-4 mb-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "text-lg md:text-xl font-bold truncate", children: selected.title }), _jsxs("div", { className: "flex items-center gap-2 md:gap-3 mt-2", children: [_jsx(Badge, { palette: palette, variant: "outline", children: selected.className }), _jsxs("span", { className: "text-xs md:text-sm truncate", style: { color: palette.silver2 }, children: ["Batas waktu: ", dateLong(selected.dueDate)] })] })] }), _jsxs("div", { className: "text-right shrink-0", children: [_jsxs("div", { className: "text-xl md:text-2xl font-bold", style: { color: palette.primary }, children: [pct(selected.graded, selected.total), "%"] }), _jsx("div", { className: "text-xs md:text-sm", style: { color: palette.silver2 }, children: "selesai dinilai" })] })] }), _jsxs("div", { className: "hidden sm:flex flex-wrap gap-2 mb-5", children: [_jsx(Btn, { palette: palette, variant: "secondary", onClick: () => alert("Tandai selesai"), children: "Tandai Selesai" }), _jsxs(Btn, { type: "button", palette: palette, variant: "outline", onClick: () => setExportOpen(true), children: [_jsx(Download, { size: 16, className: "mr-2" }), "Export Hasil"] }), _jsx(Link, { to: `/${slug}/guru/penilaian/${selected.id}`, state: {
                                                                        assignment: selected,
                                                                        className: selected.className,
                                                                        submissions,
                                                                    }, children: _jsxs(Btn, { palette: palette, size: "sm", variant: "ghost", children: [_jsx(Eye, { size: 14, className: "mr-1" }), "Detail"] }) })] }), _jsx("div", { className: "mb-3", children: _jsxs("div", { className: "flex items-center gap-3 rounded-xl border px-3 py-2.5 md:px-4 md:py-3 max-w-full sm:max-w-sm", style: {
                                                                    borderColor: palette.silver1,
                                                                    background: palette.white1,
                                                                }, children: [_jsx(Search, { size: 16, style: { color: palette.silver2 } }), _jsx("input", { value: submissionSearchQ, onChange: (e) => setSubmissionSearchQ(e.target.value), placeholder: "Cari nama siswa...", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 } })] }) }), _jsx("div", { className: "hidden md:block", children: _jsx("div", { className: "overflow-x-auto rounded-xl border", style: { borderColor: palette.silver1 }, children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { style: { backgroundColor: palette.white2 }, children: _jsxs("tr", { children: [_jsx("th", { className: "text-left py-4 px-4 font-semibold", style: { color: palette.black1 }, children: "Siswa" }), _jsx("th", { className: "text-center py-4 px-3 font-semibold", style: { color: palette.black1 }, children: "Status" }), _jsx("th", { className: "text-center py-4 px-3 font-semibold", style: { color: palette.black1 }, children: "Nilai" }), _jsx("th", { className: "text-right py-4 px-4 font-semibold", style: { color: palette.black1 }, children: "Aksi" })] }) }), _jsxs("tbody", { children: [submissions.map((s, i) => (_jsxs("tr", { style: {
                                                                                        backgroundColor: i % 2 === 0
                                                                                            ? palette.white1
                                                                                            : palette.white2,
                                                                                        borderTop: i === 0
                                                                                            ? "none"
                                                                                            : `1px solid ${palette.silver1}`,
                                                                                    }, children: [_jsxs("td", { className: "py-4 px-4", children: [_jsx("div", { className: "font-medium", children: s.studentName }), s.submittedAt && (_jsxs("div", { className: "text-xs flex items-center gap-1 mt-1", style: { color: palette.silver2 }, children: [_jsx(Clock, { size: 12 }), "Dikumpulkan ", dateShort(s.submittedAt)] }))] }), _jsx("td", { className: "py-4 px-3 text-center", children: _jsx(Badge, { palette: palette, variant: s.status === "graded"
                                                                                                    ? "success"
                                                                                                    : s.status === "submitted"
                                                                                                        ? "info"
                                                                                                        : "destructive", children: s.status === "graded"
                                                                                                    ? "Sudah Dinilai"
                                                                                                    : s.status === "submitted"
                                                                                                        ? "Terkumpul"
                                                                                                        : "Belum Mengumpulkan" }) }), _jsx("td", { className: "py-4 px-3 text-center", children: typeof s.score === "number" ? (_jsx("span", { className: "font-semibold text-lg", children: s.score })) : (_jsx("span", { style: { color: palette.silver2 }, children: "-" })) }), _jsx("td", { className: "py-4 px-4", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", variant: s.status === "submitted"
                                                                                                            ? "default"
                                                                                                            : "outline", onClick: () => openGradeModal(s), children: s.status === "graded"
                                                                                                            ? "Edit Nilai"
                                                                                                            : "Beri Nilai" }), _jsx(Link, { to: `/${slug}/guru/penilaian/${s.id}`, state: {
                                                                                                            assignment: selected,
                                                                                                            className: selected.className,
                                                                                                            submissions,
                                                                                                        }, children: _jsxs(Btn, { palette: palette, size: "sm", variant: "ghost", children: [_jsx(Eye, { size: 14, className: "mr-1" }), "Detail"] }) })] }) })] }, s.id))), submissions.length === 0 && (_jsx("tr", { children: _jsxs("td", { colSpan: 4, className: "py-8 text-center", style: { color: palette.silver2 }, children: [_jsx(Users, { size: 24, className: "mx-auto mb-2 opacity-50" }), _jsx("p", { children: "Belum ada data pengumpulan." })] }) }))] })] }) }) }), _jsxs("div", { className: "md:hidden space-y-2", children: [submissions.length === 0 && (_jsx("div", { className: "text-center py-8 rounded-xl border", style: {
                                                                        borderColor: palette.silver1,
                                                                        color: palette.silver2,
                                                                        background: palette.white1,
                                                                    }, children: "Belum ada data pengumpulan." })), submissions.map((s) => (_jsxs("div", { className: "rounded-xl border p-3", style: {
                                                                        borderColor: palette.silver1,
                                                                        background: palette.white1,
                                                                    }, children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: s.studentName }), _jsx("div", { className: "text-xs mt-0.5 flex items-center gap-1", style: { color: palette.silver2 }, children: s.submittedAt ? (_jsxs(_Fragment, { children: [_jsx(Clock, { size: 12 }), "Dikumpulkan ", dateShort(s.submittedAt)] })) : ("Belum mengumpulkan") })] }), _jsx(Badge, { palette: palette, variant: s.status === "graded"
                                                                                        ? "success"
                                                                                        : s.status === "submitted"
                                                                                            ? "info"
                                                                                            : "destructive", children: s.status === "graded"
                                                                                        ? "Dinilai"
                                                                                        : s.status === "submitted"
                                                                                            ? "Terkumpul"
                                                                                            : "Missing" })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm", children: ["Nilai:", " ", typeof s.score === "number" ? (_jsx("span", { className: "font-semibold", children: s.score })) : (_jsx("span", { style: { color: palette.silver2 }, children: "-" }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", variant: s.status === "submitted"
                                                                                                ? "default"
                                                                                                : "outline", onClick: () => openGradeModal(s), children: s.status === "graded" ? "Edit" : "Nilai" }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: () => alert(`Detail ${s.studentName}`), children: _jsx(Eye, { size: 14 }) })] })] })] }, s.id)))] }), _jsx("div", { className: "sm:hidden sticky bottom-3 z-20", children: _jsxs("div", { className: "mt-3 rounded-xl shadow-md flex gap-2 p-2", style: {
                                                                    background: `${palette.white1}F2`,
                                                                    border: `1px solid ${palette.silver1}`,
                                                                    backdropFilter: "blur(6px)",
                                                                }, children: [_jsx(Btn, { palette: palette, className: "flex-1", onClick: () => alert("Mulai menilai"), children: "Mulai" }), _jsx(Btn, { palette: palette, variant: "secondary", className: "flex-1", onClick: () => alert("Tandai selesai"), children: "Selesai" }), _jsx(Btn, { type: "button", palette: palette, variant: "outline", className: "flex-1", onClick: () => setExportOpen(true), children: "Export" })] }) })] })) }) })] }), isLoading && (_jsx("div", { className: "text-center py-8 rounded-xl border", style: {
                                        borderColor: palette.silver1,
                                        color: palette.silver2,
                                        background: palette.white1,
                                    }, children: _jsx("div", { className: "animate-pulse", children: "Memuat data penilaian..." }) }))] })] }) })] }));
}
