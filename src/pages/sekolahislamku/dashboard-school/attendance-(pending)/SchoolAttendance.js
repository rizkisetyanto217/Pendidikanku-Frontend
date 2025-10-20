import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/attendance/AttendancePage.tsx
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import { CalendarDays, Users, UserCog, Search } from "lucide-react";
import ParentSidebar from "../../components/home/ParentSideBar";
/* ================= Helper mapping warna ================ */
const C = (p) => ({
    heading: p.black1,
    text: p.black2,
    muted: p.secondary,
    accent: p.primary,
    border: p.white3,
    surface: p.white1,
    chip: p.white3,
});
/* =============== Main Page =============== */
export default function SchoolAttendance() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const c = C(palette);
    const qc = useQueryClient();
    // filters
    const todayISO = new Date().toISOString().slice(0, 10);
    const [tanggal, setTanggal] = useState(todayISO);
    const [tipe, setTipe] = useState("siswa");
    const [kelas, setKelas] = useState(undefined);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("semua");
    const [selected, setSelected] = useState({});
    // ====== Fetch list
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["attendance", { tanggal, tipe, kelas, q, status }],
        queryFn: async () => {
            const params = { date: tanggal, type: tipe };
            if (kelas)
                params.class = kelas;
            if (q)
                params.q = q;
            if (status !== "semua")
                params.status = status;
            const res = await axios.get("/api/a/attendance", { params });
            return res.data;
        },
    });
    const rows = data?.list ?? [];
    const stats = useMemo(() => {
        const total = data?.total ?? rows.length;
        const present = data?.present ?? rows.filter((r) => r.status === "hadir").length;
        const late = data?.late ?? rows.filter((r) => r.status === "terlambat").length;
        const absent = data?.absent ?? rows.filter((r) => r.status === "alfa").length;
        const rate = total ? Math.round((present / total) * 100) : 0;
        return { total, present, late, absent, rate };
    }, [data, rows]);
    // ====== Mutations
    const markMutation = useMutation({
        mutationFn: async (payload) => {
            return axios.post("/api/a/attendance/mark", {
                date: tanggal,
                type: tipe,
                status: payload.status,
                ids: payload.ids,
            });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["attendance"] }),
    });
    const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);
    const handleBulk = (s) => {
        if (selectedIds.length === 0)
            return;
        markMutation.mutate({ ids: selectedIds, status: s });
    };
    const toggleAll = (checked) => {
        const next = {};
        rows.forEach((r) => (next[r.id] = checked));
        setSelected(next);
    };
    const toggleOne = (id, checked) => setSelected((p) => ({ ...p, [id]: checked }));
    return (_jsxs(_Fragment, { children: [_jsx(ParentTopBar, { palette: palette, title: "Kehadiran" }), _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4 lg:p-4 lg:pt-6", children: [_jsx(ParentSidebar, { palette: palette, className: "hidden lg:block" }), _jsxs("main", { className: "flex-1 mx-auto max-w-5xl py-6 space-y-5 px-4 lg:px-0", children: [_jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-10 w-10 rounded-xl grid place-items-center", style: { background: c.chip, color: c.accent }, children: _jsx(CalendarDays, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold", style: { color: c.heading }, children: "Absensi" }), _jsx("p", { className: "text-sm", style: { color: c.muted }, children: "Cek & tandai kehadiran harian." })] })] }), _jsx(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => refetch(), children: "Refresh" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-3", children: [_jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsx("p", { className: "text-sm", style: { color: c.muted }, children: "Kehadiran Hari Ini saja" }), _jsxs("p", { className: "text-2xl font-semibold", style: { color: c.heading }, children: [stats.rate, "%"] })] }), _jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsx("p", { className: "text-sm", style: { color: c.muted }, children: "Hadir" }), _jsx("p", { className: "text-2xl font-semibold", style: { color: c.heading }, children: stats.present })] }), _jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsx("p", { className: "text-sm", style: { color: c.muted }, children: "Terlambat" }), _jsx("p", { className: "text-2xl font-semibold", style: { color: c.heading }, children: stats.late })] }), _jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsx("p", { className: "text-sm", style: { color: c.muted }, children: "Alfa" }), _jsx("p", { className: "text-2xl font-semibold", style: { color: c.heading }, children: stats.absent })] })] }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsx("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: _jsxs("div", { className: "flex items-center gap-2 flex-1 rounded-xl px-3 py-2 border", style: { borderColor: c.border, background: c.surface }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: `Cari nama, ${tipe === "siswa" ? "NIS" : "NIP"}, email…`, className: "w-full bg-transparent outline-none text-sm", style: { color: c.heading } })] }) }) }), _jsx(SectionCard, { palette: palette, className: "p-2 md:p-4", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-[800px] w-full text-xs sm:text-sm", children: [_jsx("thead", { style: { background: palette.white2 }, children: _jsxs("tr", { className: "text-left", style: { color: c.muted }, children: [_jsx("th", { className: "py-3 w-10", children: _jsx("input", { type: "checkbox", onChange: (e) => toggleAll(e.target.checked) }) }), _jsx("th", { children: "Nama" }), _jsx("th", { children: tipe === "siswa" ? "Kelas" : "Mapel" }), _jsx("th", { children: "Tipe" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Waktu" }), _jsx("th", { className: "text-right pr-2", children: "Aksi" })] }) }), _jsxs("tbody", { children: [isLoading && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "py-8 text-center", style: { color: c.muted }, children: "Memuat data\u2026" }) })), rows.map((r) => (_jsxs("tr", { className: "border-t", style: { borderColor: c.border }, children: [_jsx("td", { children: _jsx("input", { type: "checkbox", checked: !!selected[r.id], onChange: (e) => toggleOne(r.id, e.target.checked) }) }), _jsx("td", { className: "whitespace-nowrap", children: r.name }), _jsx("td", { className: "whitespace-nowrap", style: { color: c.accent }, children: r.class_or_subject ?? "-" }), _jsx("td", { className: "whitespace-nowrap", style: { color: c.text }, children: r.role === "siswa" ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Users, { size: 14 }), " Siswa"] })) : (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(UserCog, { size: 14 }), " Guru"] })) }), _jsxs("td", { children: [r.status === "hadir" && (_jsx(Badge, { variant: "success", palette: palette, children: "Hadir" })), r.status === "terlambat" && (_jsx(Badge, { variant: "warning", palette: palette, children: "Terlambat" })), r.status === "izin" && (_jsx(Badge, { variant: "info", palette: palette, children: "Izin" })), r.status === "sakit" && (_jsx(Badge, { variant: "secondary", palette: palette, children: "Sakit" })), r.status === "alfa" && (_jsx(Badge, { variant: "destructive", palette: palette, children: "Alfa" }))] }), _jsx("td", { className: "whitespace-nowrap", children: r.time ?? "-" }), _jsx("td", { children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-2 justify-end", children: [_jsx(NavLink, { to: `/sekolah/${r.role === "siswa" ? "murid" : "guru"}/${r.id}`, className: "underline text-xs sm:text-sm", style: { color: c.accent }, children: "Lihat Profil" }), _jsx(Btn, { size: "sm", palette: palette, variant: "outline", onClick: () => markMutation.mutate({
                                                                                ids: [r.id],
                                                                                status: "hadir",
                                                                            }), children: "Tandai Hadir" })] }) })] }, r.id)))] })] }) }) })] })] })] }));
}
