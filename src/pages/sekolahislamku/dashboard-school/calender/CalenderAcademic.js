import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/academic/CalenderAcademic.tsx
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI primitives & layout
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, ArrowLeft, } from "lucide-react";
const dateLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const hijriLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID-u-ca-islamic-umalqura", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
    : "-";
const toMonthStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = (month) => {
    const [y, m] = month.split("-").map(Number);
    return new Date(y, (m || 1) - 1, 1).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
    });
};
const toLocalInputValue = (iso) => {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
/* ================= Dummy API (in-memory) ================= */
// Storage per-bulan: key "YYYY-MM" -> EventRow[]
const store = new Map();
function uid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const fakeApi = {
    async list(month) {
        await delay();
        // seed contoh kalau kosong
        if (!store.has(month)) {
            const [y, m] = month.split("-").map(Number);
            store.set(month, [
                {
                    id: uid(),
                    title: "Contoh: Ujian",
                    date: new Date(y, m - 1, 10, 7).toISOString(),
                    category: "Ujian",
                },
                {
                    id: uid(),
                    title: "Contoh: Rapat",
                    date: new Date(y, m - 1, 15, 13).toISOString(),
                    category: "Kegiatan",
                },
            ]);
        }
        return JSON.parse(JSON.stringify(store.get(month)));
    },
    async create(month, payload) {
        await delay();
        const curr = store.get(month) || [];
        const row = { id: uid(), ...payload };
        store.set(month, [...curr, row]);
        return JSON.parse(JSON.stringify(row));
    },
    async update(month, payload) {
        await delay();
        const curr = store.get(month) || [];
        const idx = curr.findIndex((x) => x.id === payload.id);
        if (idx >= 0)
            curr[idx] = { ...payload };
        store.set(month, curr);
        return JSON.parse(JSON.stringify(payload));
    },
    async remove(month, id) {
        await delay();
        const curr = store.get(month) || [];
        store.set(month, curr.filter((x) => x.id !== id));
    },
};
/* ========================================================= */
const CalenderAcademic = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const qc = useQueryClient();
    const [month, setMonth] = useState(toMonthStr());
    const [selectedDay, setSelectedDay] = useState(null);
    const [editing, setEditing] = useState(null);
    // List events (dummy)
    const eventsQ = useQuery({
        queryKey: ["acad-events", month],
        queryFn: () => fakeApi.list(month),
        staleTime: 30_000,
    });
    const byDate = useMemo(() => {
        const map = new Map();
        (eventsQ.data ?? []).forEach((e) => {
            const d = new Date(e.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            map.set(key, [...(map.get(key) || []), e]);
        });
        return map;
    }, [eventsQ.data]);
    // CRUD (dummy)
    const createMut = useMutation({
        mutationFn: (payload) => fakeApi.create(month, payload),
        onSuccess: (row) => {
            qc.invalidateQueries({ queryKey: ["acad-events", month] });
            setSelectedDay(row.date.slice(0, 10));
        },
    });
    const updateMut = useMutation({
        mutationFn: (payload) => fakeApi.update(month, payload),
        onSuccess: (row) => {
            qc.invalidateQueries({ queryKey: ["acad-events", month] });
            setSelectedDay(row.date.slice(0, 10));
        },
    });
    const deleteMut = useMutation({
        mutationFn: (id) => fakeApi.remove(month, id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["acad-events", month] }),
    });
    // Calendar grid
    const days = useMemo(() => {
        const [y, m] = month.split("-").map(Number);
        const first = new Date(y, (m || 1) - 1, 1);
        const firstWeekday = (first.getDay() + 6) % 7; // Mon=0
        const total = new Date(y, m, 0).getDate();
        const cells = [];
        for (let i = 0; i < firstWeekday; i++)
            cells.push({ label: null, dateKey: null });
        for (let d = 1; d <= total; d++) {
            const key = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            cells.push({ label: d, dateKey: key });
        }
        while (cells.length % 7 !== 0)
            cells.push({ label: null, dateKey: null });
        return cells;
    }, [month]);
    const gotoPrev = () => {
        const [y, m] = month.split("-").map(Number);
        setMonth(toMonthStr(new Date(y, m - 2, 1)));
    };
    const gotoNext = () => {
        const [y, m] = month.split("-").map(Number);
        setMonth(toMonthStr(new Date(y, m, 1)));
    };
    const nowISO = new Date().toISOString();
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Kalender Akademik", gregorianDate: nowISO, hijriDate: hijriLong(nowISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("section", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "px-2", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-base font-semibold sm:text-lg", children: "Kalender Akademik" })] }), _jsxs("div", { className: "flex items-center justify-between sm:justify-end gap-2", children: [_jsx(Btn, { palette: palette, variant: "outline", size: "sm", onClick: gotoPrev, children: _jsx(ChevronLeft, { size: 16 }) }), _jsx("div", { className: "px-2 text-sm font-medium", children: monthLabel(month) }), _jsx(Btn, { palette: palette, variant: "outline", size: "sm", onClick: gotoNext, children: _jsx(ChevronRight, { size: 16 }) })] })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-3 sm:p-5", children: [_jsx("div", { className: "grid grid-cols-7 text-[10px] sm:text-xs mb-2", style: { color: palette.black2 }, children: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (_jsx("div", { className: "text-center font-medium", children: d }, d))) }), _jsx("div", { className: "grid grid-cols-7 gap-1 sm:gap-2", children: days.map((c, i) => {
                                                    const events = c.dateKey
                                                        ? byDate.get(c.dateKey)
                                                        : undefined;
                                                    const selected = selectedDay === c.dateKey;
                                                    return (_jsxs("button", { disabled: !c.dateKey, onClick: () => setSelectedDay(c.dateKey), className: "aspect-square rounded-lg border text-left relative p-1 sm:p-2 transition disabled:opacity-50", style: {
                                                            borderColor: palette.silver1,
                                                            background: selected
                                                                ? palette.primary2
                                                                : palette.white1,
                                                        }, children: [_jsx("div", { className: "text-[10px] sm:text-xs font-medium", children: c.label ?? "" }), !!events && events.length > 0 && (_jsx("div", { className: "absolute right-1 top-1 flex gap-0.5", children: events.slice(0, 3).map((_, idx) => (_jsx("span", { className: "h-1.5 w-1.5 rounded-full", style: { background: palette.primary } }, idx))) })), events && events[0] && (_jsx("div", { className: "mt-1 text-[10px] sm:text-[11px] line-clamp-2 leading-snug", style: { color: palette.black2 }, children: events[0].title }))] }, i));
                                                }) })] }) }), selectedDay && (_jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-3 md:p-5", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [_jsxs("div", { className: "font-medium", children: ["Agenda ", new Date(selectedDay).toLocaleDateString("id-ID")] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", onClick: () => setEditing({
                                                                    id: "",
                                                                    title: "",
                                                                    date: new Date(selectedDay + "T07:00:00").toISOString(),
                                                                }), className: "gap-1", children: _jsx(Plus, { size: 16 }) }), _jsx(Btn, { palette: palette, variant: "ghost", size: "sm", onClick: () => setSelectedDay(null), children: _jsx(X, { size: 16 }) })] })] }), _jsxs("div", { className: "mt-3 space-y-2", children: [(byDate.get(selectedDay) ?? []).map((ev) => (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border px-3 py-2 gap-2", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-sm font-medium truncate", children: ev.title }), _jsxs("div", { className: "text-xs", style: { color: palette.black2 }, children: [new Date(ev.date).toLocaleTimeString("id-ID", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            }), ev.category ? ` • ${ev.category}` : "", ev.level ? ` • Kelas ${ev.level}` : ""] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", className: "gap-1", onClick: () => setEditing(ev), children: _jsx(Pencil, { size: 14 }) }), _jsx(Btn, { palette: palette, size: "sm", variant: "destructive", className: "gap-1", onClick: () => deleteMut.mutate(ev.id), disabled: deleteMut.isPending, children: _jsx(Trash2, { size: 14 }) })] })] }, ev.id))), (byDate.get(selectedDay) ?? []).length === 0 && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Belum ada agenda pada tanggal ini." }))] })] }) }))] })] }) }), editing && (_jsx(EditModal, { palette: palette, value: editing, onClose: () => setEditing(null), onSubmit: (val) => {
                    if (!val.title.trim())
                        return;
                    if (val.id) {
                        updateMut.mutate(val, { onSuccess: () => setEditing(null) });
                    }
                    else {
                        const { id, ...payload } = val;
                        createMut.mutate(payload, { onSuccess: () => setEditing(null) });
                    }
                } }))] }));
};
export default CalenderAcademic;
/* =============== Modal Ringkas =============== */
function EditModal({ palette, value, onClose, onSubmit, }) {
    const [form, setForm] = useState(value);
    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
    return (_jsxs("div", { className: "fixed inset-0 z-50 grid place-items-center", children: [_jsx("div", { className: "absolute inset-0", style: { background: "rgba(0,0,0,0.2)" }, onClick: onClose }), _jsxs("div", { className: "relative w-full max-w-md rounded-xl border p-4", style: {
                    borderColor: palette.silver1,
                    background: palette.white1,
                    color: palette.black1,
                }, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "font-semibold text-sm", children: form.id ? "Ubah Agenda" : "Tambah Agenda" }), _jsx("button", { onClick: onClose, className: "p-1", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs mb-1", style: { color: palette.silver2 }, children: "Judul" }), _jsx("input", { value: form.title, onChange: (e) => set("title", e.target.value), className: "w-full h-10 rounded-lg border px-3 bg-transparent", style: { borderColor: palette.silver1 }, placeholder: "Contoh: Ujian Tengah Semester" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs mb-1", style: { color: palette.silver2 }, children: "Tanggal & Waktu" }), _jsx("input", { type: "datetime-local", value: toLocalInputValue(form.date), onChange: (e) => set("date", new Date(e.target.value).toISOString()), className: "w-full h-10 rounded-lg border px-3 bg-transparent", style: { borderColor: palette.silver1 } })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs mb-1", style: { color: palette.silver2 }, children: "Kategori (opsional)" }), _jsx("input", { value: form.category || "", onChange: (e) => set("category", e.target.value), className: "w-full h-10 rounded-lg border px-3 bg-transparent", style: { borderColor: palette.silver1 }, placeholder: "Akademik/Libur/Ujian\u2026" })] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs mb-1", style: { color: palette.silver2 }, children: "Level/Kelas (opsional)" }), _jsx("input", { value: form.level || "", onChange: (e) => set("level", e.target.value), className: "w-full h-10 rounded-lg border px-3 bg-transparent", style: { borderColor: palette.silver1 }, placeholder: "Semua / 1 / 2 / \u2026" })] })] }), _jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, children: "Batal" }), _jsxs(Btn, { palette: palette, onClick: () => onSubmit(form), className: "gap-1", children: [form.id ? _jsx(Pencil, { size: 16 }) : _jsx(Plus, { size: 16 }), " Simpan"] })] })] })] }));
}
