import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/StudentAbsenceDetail.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Filter, Percent } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Badge, Btn, ProgressBar, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { useMemo } from "react";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* =============== Constants/Helpers =============== */
const STATUS_LABEL = {
    hadir: "Hadir",
    online: "Online",
    izin: "Izin",
    sakit: "Sakit",
    alpa: "Alpa",
};
const STATUS_BADGE = {
    hadir: "success",
    online: "info",
    izin: "secondary",
    sakit: "warning",
    alpa: "destructive",
};
const dateLong = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
});
const dateShort = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
});
const topbarDateFmt = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});
/* ================= Dummy API ================= */
const toIso = (d) => d.toISOString();
const makeDay = (dOffset) => new Date(Date.now() - dOffset * 864e5);
function statusFor(i) {
    if (i % 9 === 2)
        return "izin";
    if (i % 9 === 4)
        return "sakit";
    if (i % 11 === 6)
        return "alpa";
    if (i % 5 === 1)
        return "online";
    return "hadir";
}
function timeFor(status) {
    if (status === "hadir" || status === "online") {
        const hh = 7;
        const mm = 25 + Math.floor(Math.random() * 10);
        return `${hh.toString().padStart(2, "0")}:${mm}`;
    }
    return undefined;
}
function modeFor(status) {
    if (status === "hadir")
        return "onsite";
    if (status === "online")
        return "online";
    return undefined;
}
async function fetchAbsence(childId, days = 30) {
    const logs = Array.from({ length: days }).map((_, idx) => {
        const st = statusFor(idx);
        return {
            date: toIso(makeDay(idx)),
            status: st,
            mode: modeFor(st),
            time: timeFor(st),
        };
    });
    const stats = logs.reduce((acc, l) => {
        acc.total += 1;
        acc[l.status] += 1;
        return acc;
    }, { total: 0, hadir: 0, online: 0, izin: 0, sakit: 0, alpa: 0 });
    return {
        student: { id: childId ?? "c1", name: "Ahmad", className: "TPA A" },
        stats,
        logs,
    };
}
/* ================= Page ================= */
export default function StudentAbsence() {
    const [sp, setSp] = useSearchParams();
    const navigate = useNavigate();
    const childId = sp.get("child") ?? undefined;
    // Parse query params safely
    const rawPeriod = sp.get("period");
    const period = rawPeriod === "7" || rawPeriod === "all" ? rawPeriod : "30";
    const asStatusFilter = (v) => v === "all" ||
        v === "hadir" ||
        v === "online" ||
        v === "izin" ||
        v === "sakit" ||
        v === "alpa"
        ? v
        : "all";
    const asModeFilter = (v) => v === "all" || v === "onsite" || v === "online" ? v : "all";
    const status = asStatusFilter(sp.get("status"));
    const mode = asModeFilter(sp.get("mode"));
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const { data: s } = useQuery({
        queryKey: ["student-absence", childId, period],
        queryFn: () => fetchAbsence(childId, period === "all" ? 60 : Number(period)),
        staleTime: 60_000,
    });
    const filtered = useMemo(() => {
        if (!s)
            return [];
        return s.logs.filter((l) => {
            const matchStatus = status === "all" ? true : l.status === status;
            const matchMode = mode === "all" ? true : l.mode === mode;
            return matchStatus && matchMode;
        });
    }, [s, status, mode]);
    const handleChange = (key, value) => {
        const next = new URLSearchParams(sp);
        next.set(key, value);
        setSp(next, { replace: true });
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Riwayat Absensi", gregorianDate: new Date().toISOString() }), _jsx("main", { className: "w-full px-4 md:px-6 py-4   md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, onClick: () => navigate(-1), variant: "ghost", className: "cursor-pointer flex items-center gap-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Absensi Kehadiran" })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), " Ringkasan"] }), s && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-6 gap-3", children: [[
                                                    { key: "hadir", label: "Hadir" },
                                                    { key: "online", label: "Online" },
                                                    { key: "izin", label: "Izin" },
                                                    { key: "sakit", label: "Sakit" },
                                                    { key: "alpa", label: "Alpa" },
                                                ].map(({ key, label }) => {
                                                    const value = s.stats[key];
                                                    const pct = s.stats.total === 0
                                                        ? 0
                                                        : Math.round((value / s.stats.total) * 100);
                                                    return (_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: label }), _jsxs("div", { className: "mt-1 flex items-center gap-2", children: [_jsx(Badge, { variant: STATUS_BADGE[key], palette: palette, children: value }), _jsxs("span", { className: "text-sm inline-flex items-center gap-1", style: { color: palette.black2 }, children: [_jsx(Percent, { size: 12 }), " ", pct, "%"] })] }), _jsx("div", { className: "mt-2", children: _jsx(ProgressBar, { value: pct, palette: palette }) })] }, key));
                                                }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: "Total Sesi" }), _jsx("div", { className: "mt-1", children: _jsx(Badge, { variant: "outline", palette: palette, children: _jsx("p", { style: { color: palette.black2 }, children: s.stats.total }) }) })] })] }))] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(Filter, { size: 18, color: palette.quaternary }), " Filter"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.black2 }, children: "Periode" }), _jsxs("select", { value: period, onChange: (e) => handleChange("period", e.target.value), className: "rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "7", children: "7 hari terakhir" }), _jsx("option", { value: "30", children: "30 hari terakhir" }), _jsx("option", { value: "all", children: "Semua (60 hari)" })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.black2 }, children: "Status" }), _jsxs("select", { value: status, onChange: (e) => handleChange("status", e.target.value), className: "rounded-lg border px-3 py-2 bg-transparent", style: { borderColor: palette.silver1 }, children: [_jsx("option", { value: "all", children: "Semua" }), _jsx("option", { value: "hadir", children: "Hadir" }), _jsx("option", { value: "online", children: "Online" }), _jsx("option", { value: "izin", children: "Izin" }), _jsx("option", { value: "sakit", children: "Sakit" }), _jsx("option", { value: "alpa", children: "Alpa" })] })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.black2 }, children: "Mode" }), _jsxs("select", { value: mode, onChange: (e) => handleChange("mode", e.target.value), className: "rounded-lg border px-3 py-2 bg-transparent", style: {
                                                                borderColor: palette.silver1,
                                                                color: palette.black2,
                                                            }, children: [_jsx("option", { value: "all", children: "Semua" }), _jsx("option", { value: "onsite", children: "Tatap muka" }), _jsx("option", { value: "online", children: "Online" })] })] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-4 md:p-5", children: [_jsxs("div", { className: "font-medium mb-3 flex items-center gap-2", children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), " Daftar Absensi"] }), _jsxs("div", { className: "grid grid-cols-1 gap-2", children: [filtered.length === 0 && (_jsx("div", { className: "rounded-xl border px-3 py-3 text-sm", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white2,
                                                        color: palette.black2,
                                                    }, children: "Tidak ada data untuk filter saat ini." })), filtered.map((a) => (_jsxs("div", { className: "flex items-center justify-between rounded-xl border px-3 py-2", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white2,
                                                    }, children: [_jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-medium", children: dateShort(a.date) }), _jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: [a.mode
                                                                            ? a.mode === "onsite"
                                                                                ? "Tatap muka"
                                                                                : "Online"
                                                                            : "", " ", a.time ? `• ${a.time}` : ""] }), _jsx("div", { className: "text-sm mt-1", style: { color: palette.black2 }, children: dateLong(a.date) })] }), _jsx(Badge, { variant: STATUS_BADGE[a.status], palette: palette, children: STATUS_LABEL[a.status] })] }, a.date)))] })] })] })] }) })] }));
}
