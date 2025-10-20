import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/dashboard-teacher/class/components/AllTodaySchedule.tsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Plus, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
// API & Types
import { fetchTeacherHome, TEACHER_HOME_QK, } from "../types/teacher";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import AddSchedule from "../../dashboard/AddSchedule";
/* =========================
   Helpers
========================= */
const startOfDay = (d = new Date()) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};
const addDays = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
};
const toISODate = (d) => startOfDay(d).toISOString();
const fmtShort = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
    })
    : "-";
const fmtLong = (iso) => new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
});
/** Ambil nama lokasi murni dari "DD Mon • Aula 1" → "Aula 1" */
const getPureLocation = (room) => {
    if (!room)
        return "";
    const parts = room.split("•").map((s) => s.trim());
    return parts.length > 1 ? parts.slice(1).join(" • ") : parts[0];
};
/** Buat slug/id untuk navigasi detail (stabil & URL-safe) */
const makeScheduleSlug = (it) => {
    const raw = it.id && String(it.id).trim()
        ? String(it.id).trim()
        : `${it.dateISO}|${it.time}|${it.title}`;
    return encodeURIComponent(raw);
};
/** Normalisasi dari tipe API ke tipe UI (ScheduleItem) */
const normalizeItem = (c, fallback) => {
    const dateISO = c.dateISO
        ? toISODate(new Date(c.dateISO))
        : toISODate(fallback);
    return {
        id: c.id,
        time: c.time,
        title: `${c.className} — ${c.subject}`,
        dateISO,
        room: c.dateISO
            ? `${fmtShort(c.dateISO)} • ${c.room ?? "-"}`
            : c.room,
    };
};
/* =========================
   Component
========================= */
export default function ScheduleSevenDays() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const qc = useQueryClient();
    const navigate = useNavigate();
    const { data } = useQuery({
        queryKey: TEACHER_HOME_QK,
        queryFn: fetchTeacherHome,
        staleTime: 60_000,
    });
    // Ambil 7 hari ke depan (hari ini s/d +6)
    const DAYS = 7;
    const today = startOfDay(new Date());
    const end = startOfDay(addDays(today, DAYS - 1));
    // Sumber data: upcoming (7 hari) → fallback todayClasses
    const rawItems = useMemo(() => {
        const upcoming = (data?.upcomingClasses ?? []).filter((u) => {
            const d = startOfDay(new Date(u.dateISO));
            return d >= today && d <= end;
        });
        const fromUpcoming = upcoming.map((u) => normalizeItem(u, today));
        const fromToday = fromUpcoming.length > 0
            ? []
            : (data?.todayClasses ?? []).map((t) => normalizeItem(t, today));
        return [...fromUpcoming, ...fromToday].sort((a, b) => {
            const da = new Date(a.dateISO).getTime();
            const db = new Date(b.dateISO).getTime();
            if (da !== db)
                return da - db;
            return a.time.localeCompare(b.time);
        });
    }, [data?.upcomingClasses, data?.todayClasses]);
    /* ---------- UI State: search & filter lokasi ---------- */
    const [search, setSearch] = useState("");
    const [locFilter, setLocFilter] = useState("semua");
    const lokasiOptions = useMemo(() => {
        const set = new Set(rawItems
            .map((x) => getPureLocation(x.room))
            .map((s) => s.trim())
            .filter(Boolean));
        return ["semua", ...Array.from(set)];
    }, [rawItems]);
    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return rawItems.filter((j) => {
            const location = getPureLocation(j.room);
            const matchSearch = j.title.toLowerCase().includes(s) ||
                location.toLowerCase().includes(s) ||
                (j.time ?? "").toLowerCase().includes(s);
            const matchLoc = locFilter === "semua" || location === locFilter;
            return matchSearch && matchLoc;
        });
    }, [rawItems, search, locFilter]);
    /* ---------- Bucket per hari (7 kotak) ---------- */
    const dayBuckets = useMemo(() => {
        return Array.from({ length: DAYS }).map((_, i) => {
            const dISO = toISODate(addDays(today, i));
            const items = filtered
                .filter((it) => it.dateISO === dISO)
                .sort((a, b) => a.time.localeCompare(b.time));
            return { dateISO: dISO, items };
        });
    }, [filtered]);
    /* ---------- Tambah / Edit / Hapus ---------- */
    const [showTambahJadwal, setShowTambahJadwal] = useState(false);
    const [targetDateISO, setTargetDateISO] = useState(null);
    const openAdd = (dateISO) => {
        setTargetDateISO(dateISO ?? toISODate(today));
        setShowTambahJadwal(true);
    };
    const handleAddSchedule = (item) => {
        // sinkronisasi cache "teacher-home" → todayClasses (optimistic)
        qc.setQueryData(TEACHER_HOME_QK, (prev) => {
            if (!prev)
                return prev;
            const [classNameRaw = "", subjectRaw = ""] = item.title.split(" — ");
            const newTc = {
                id: `temp-${Date.now()}`,
                time: item.time,
                className: classNameRaw || "Kelas",
                subject: subjectRaw || "Pelajaran",
                room: item.room,
                status: "upcoming",
            };
            return {
                ...prev,
                todayClasses: [...(prev.todayClasses ?? []), newTc].sort((a, b) => a.time.localeCompare(b.time)),
            };
        });
        setShowTambahJadwal(false);
    };
    const [editingId, setEditingId] = useState(null);
    const openEdit = (it) => {
        setEditingId(it.id ?? `${it.dateISO}-${it.time}-${it.title}`);
        setTargetDateISO(it.dateISO);
        setShowTambahJadwal(true);
    };
    const handleDelete = (it) => {
        if (!confirm(`Hapus jadwal "${it.title}" pada ${it.time}?`))
            return;
        qc.setQueryData(TEACHER_HOME_QK, (prev) => {
            if (!prev)
                return prev;
            const sameUpcoming = (u) => (it.id && u.id === it.id) ||
                (toISODate(new Date(u.dateISO)) === it.dateISO &&
                    u.time === it.time &&
                    `${u.className} — ${u.subject}` === it.title);
            const sameToday = (t) => (it.id && t.id === it.id) ||
                (t.time === it.time && `${t.className} — ${t.subject}` === it.title);
            return {
                ...prev,
                upcomingClasses: (prev.upcomingClasses ?? []).filter((u) => !sameUpcoming(u)),
                todayClasses: (prev.todayClasses ?? []).filter((t) => !sameToday(t)),
            };
        });
    };
    /* =========================
       UI
    ========================= */
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: new Date().toISOString(), title: "Jadwal 7 Hari Kedepan", dateFmt: (iso) => new Date(iso).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }) }), _jsx(AddSchedule, { open: showTambahJadwal, onClose: () => setShowTambahJadwal(false), palette: palette, onSubmit: handleAddSchedule }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0 lg:sticky lg:top-16 shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [_jsx("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: _jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("button", { onClick: () => navigate(-1), className: "inline-flex items-center justify-center rounded-full p-1 hover:opacity-80", "aria-label": "Kembali", title: "Kembali", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { children: "Jadwal 7 Hari Kedepan" })] }) }), _jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", placeholder: "Cari kelas/materi/lokasi\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "h-10 w-full rounded-2xl px-3 text-sm", style: {
                                                        background: palette.white1,
                                                        color: palette.black1,
                                                        border: `1px solid ${palette.silver1}`,
                                                    }, "aria-label": "Cari jadwal" }) }), lokasiOptions.length > 1 && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { palette: palette, variant: "outline", children: "Lokasi" }), _jsx("select", { value: locFilter, onChange: (e) => setLocFilter(e.target.value), className: "h-10 rounded-xl px-3 text-sm outline-none", style: {
                                                            background: palette.white1,
                                                            color: palette.black1,
                                                            border: `1px solid ${palette.silver1}`,
                                                        }, "aria-label": "Filter lokasi", children: lokasiOptions.map((o) => (_jsx("option", { value: o, children: o === "semua" ? "Semua" : o }, o))) })] }))] }) }), _jsx("div", { className: "grid gap-3", children: dayBuckets.map(({ dateISO, items }) => (_jsxs(SectionCard, { palette: palette, className: "p-0 overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b font-semibold flex items-center justify-between", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [fmtLong(dateISO), _jsxs(Btn, { palette: palette, size: "sm", variant: "white1", onClick: () => openAdd(dateISO), children: [_jsx(Plus, { size: 16, className: "mr-1" }), " Tambah di Hari Ini"] })] }), items.length === 0 ? (_jsx("div", { className: "px-4 py-3 text-sm", style: {
                                                    color: palette.silver2,
                                                    background: palette.white1,
                                                }, children: "Belum ada jadwal pada hari ini." })) : (_jsx("div", { className: "divide-y", style: { borderColor: palette.silver1 }, children: items.map((s, i) => {
                                                    const slug = makeScheduleSlug(s);
                                                    return (_jsxs("div", { className: "px-4 py-3 flex items-center justify-between gap-4", style: { background: palette.white1 }, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: s.title }), _jsxs("div", { className: "text-sm mt-1 flex flex-wrap gap-3", style: { color: palette.black2 }, children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 16 }), " ", fmtLong(dateISO)] }), getPureLocation(s.room) && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 16 }), " ", getPureLocation(s.room)] })), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 16 }), " ", s.time] })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsx(Btn, { palette: palette, size: "sm", variant: "white1", onClick: () => openEdit(s), children: "Edit" }), _jsx(Link, { to: `./${slug}`, state: { item: s }, children: _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", children: "Detail" }) }), _jsx(Btn, { palette: palette, size: "sm", variant: "destructive", onClick: () => handleDelete(s), children: "Hapus" })] })] }, `${s.id ?? i}-${s.time}`));
                                                }) }))] }, dateISO))) })] })] }) })] }));
}
