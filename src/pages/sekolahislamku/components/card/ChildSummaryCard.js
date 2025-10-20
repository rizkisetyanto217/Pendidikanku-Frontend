import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/child/ChildSummaryCard.tsx
import { Link } from "react-router-dom";
import { User2, CheckCircle2, Clock, ChevronRight, CalendarDays, } from "lucide-react";
import { Badge, Btn, ProgressBar, SectionCard, } from "@/pages/sekolahislamku/components/ui/Primitives";
export default function ChildSummaryCard({ child, today, palette, detailPath = "/anak", 
// ⬅️ terima state dari parent
detailState, progressPath = "/anak/progress", todayDisplay = "compact", attendanceAgg, }) {
    const quickStatus = today
        ? today.attendance.status
        : child?.attendanceToday === "present"
            ? "hadir"
            : child?.attendanceToday === "online"
                ? "online"
                : child?.attendanceToday === "absent"
                    ? "alpa"
                    : "unknown";
    const renderStatusBadge = (s) => {
        if (s === "hadir")
            return (_jsxs(Badge, { variant: "success", palette: palette, children: [_jsx(CheckCircle2, { className: "mr-1", size: 12 }), " Hadir"] }));
        if (s === "online")
            return (_jsxs(Badge, { variant: "info", palette: palette, children: [_jsx(Clock, { className: "mr-1", size: 12 }), " Online"] }));
        if (s === "sakit")
            return (_jsx(Badge, { variant: "warning", palette: palette, children: "Sakit" }));
        if (s === "izin")
            return (_jsx(Badge, { variant: "secondary", palette: palette, children: "Izin" }));
        return (_jsx(Badge, { variant: "destructive", palette: palette, children: "Alpa" }));
    };
    const quickPresent = attendanceAgg?.present ?? 0;
    const quickTotal = attendanceAgg?.total ?? 0;
    const quickRate = quickTotal
        ? Math.round((quickPresent / quickTotal) * 100)
        : 0;
    return (_jsxs(SectionCard, { palette: palette, children: [_jsx("div", { className: "p-4 md:p-5 pb-2", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-base font-semibold tracking-tight flex items-center gap-2", children: [_jsx(User2, { size: 20, color: palette.quaternary }), _jsx("span", { children: child?.name ?? "—" }), _jsx(Badge, { variant: "secondary", className: "ml-1", palette: palette, children: child?.className ?? "Kelas" })] }), _jsx(Link, { to: detailPath, 
                            // ⬅️ pass state ke halaman detail
                            state: detailState, className: "inline-flex items-center", children: _jsxs(Btn, { size: "sm", variant: "ghost", palette: palette, children: ["Detail ", _jsx(ChevronRight, { className: "ml-1", size: 16 })] }) })] }) }), _jsx("div", { className: "p-4 pt-2 sm:p-4 lg:px-3 lg:py-0 lg:mb-4 space-y-3", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("div", { children: _jsx("div", { style: { fontSize: 12, color: palette.black2 }, children: "Kehadiran" }) }), _jsx("div", { className: "text-right", children: _jsxs("div", { className: "font-semibold", style: { color: palette.quaternary }, children: [quickPresent, "/", quickTotal] }) })] }), _jsxs("div", { className: "mt-2", children: [_jsx(ProgressBar, { value: quickRate, palette: palette }), _jsxs("div", { className: "mt-1 text-sm", style: { color: palette.black2 }, children: [quickRate, "% hadir"] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { style: { fontSize: 12, color: palette.black2 }, children: "Hafalan" }), _jsxs("div", { className: "mt-2", children: [_jsx(ProgressBar, { value: (Math.max(0, Math.min(2, child?.memorizationJuz ?? 0)) / 2) *
                                                100, palette: palette }), _jsxs("div", { className: "mt-1", style: { fontSize: 12, color: palette.black2 }, children: ["~ ", child?.memorizationJuz ?? 0, " Juz"] })] })] }), _jsxs(SectionCard, { palette: palette, className: "p-3", style: { background: palette.white2 }, children: [_jsx("div", { style: { fontSize: 12, color: palette.black2 }, children: "Nilai Terakhir" }), _jsx("div", { className: "mt-1 text-lg font-semibold", children: typeof child?.lastScore === "number" ? child.lastScore : "-" })] })] }) }), today && todayDisplay !== "hidden" && (_jsx("div", { className: "px-4 pb-4", children: _jsxs(SectionCard, { palette: palette, className: todayDisplay === "compact" ? "p-3 md:p-4" : "p-4 md:p-5", style: { background: palette.white2 }, children: [_jsx("div", { className: "font-medium mb-3 flex items-center justify-between gap-2", children: _jsxs("span", { className: "inline-flex items-center gap-2", style: { fontSize: 12, color: palette.black2 }, children: [_jsx(CalendarDays, { size: 18, color: palette.quaternary }), "Ringkasan Hari Ini"] }) }), todayDisplay === "compact" ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 text-sm", children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [renderStatusBadge(today.attendance.status), today.attendance.time && (_jsxs("span", { style: { color: palette.black2 }, children: ["\u2022 ", today.attendance.time] }))] }), typeof today.nilai === "number" && (_jsxs(Badge, { variant: "white1", palette: palette, children: ["Nilai: ", today.nilai] })), today.hafalan && (_jsxs(Badge, { variant: "white1", palette: palette, children: ["Hafalan: ", today.hafalan] })), today.pr && (_jsxs(Badge, { variant: "white1", palette: palette, children: ["PR: ", today.pr] }))] }), _jsx("p", { className: "mt-3 text-sm truncate", style: { color: palette.black2 }, title: today.informasiUmum, children: today.informasiUmum })] })) : (_jsx(_Fragment, {}))] }) }))] }));
}
