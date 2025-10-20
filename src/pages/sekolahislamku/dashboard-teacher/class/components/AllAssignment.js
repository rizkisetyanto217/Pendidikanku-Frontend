import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/assignment/AllAssignment.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Calendar, Clock, CheckCircle2, AlertTriangle, Search, ArrowLeft, Plus, } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ModalAddAssignment from "./ModalAddAssignment";
import ModalEditAssignment from "./ModalEditAssignment";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
/* =========================
   Helpers
========================= */
const dateShort = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
    })
    : "-";
const computeStatus = (a) => {
    const now = new Date();
    const due = new Date(a.dueDateISO);
    if (a.submitted >= a.total)
        return "selesai";
    if (due < now)
        return "terlambat";
    return "terbuka";
};
/* =========================
   Page
========================= */
export default function AllAssignment() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    // Ambil data dari TeacherClassDetail via router state
    const { state } = useLocation();
    const { assignments = [], heading } = (state ?? {});
    // Normalisasi state → item lokal (sekali di awal)
    const initialItems = useMemo(() => (assignments ?? []).map((x) => {
        const base = {
            id: x.id,
            title: x.title,
            kelas: x.kelas,
            dueDateISO: x.dueDate,
            createdISO: undefined, // isi jika ada field created dari API
            submitted: x.submitted,
            total: x.total,
            status: "terbuka",
        };
        return { ...base, status: computeStatus(base) };
    }), [assignments]);
    // Data lokal (agar bisa edit/hapus/tambah tanpa fetch)
    const [items, setItems] = useState(initialItems);
    // Search & Filter
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("semua");
    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        return items.filter((a) => {
            const byStatus = status === "semua" ? true : a.status === status;
            const bySearch = a.title.toLowerCase().includes(s) ||
                (a.kelas ?? "").toLowerCase().includes(s);
            return byStatus && bySearch;
        });
    }, [q, status, items]);
    const statusBadgeTone = (st) => {
        if (st === "terbuka")
            return { text: palette.primary, bg: palette.primary2 };
        if (st === "selesai")
            return { text: palette.success1, bg: palette.success2 };
        return { text: palette.error1, bg: palette.error2 };
    };
    //  state handle submit
    const [showTambah, setShowTambah] = useState(false);
    // state modal edit
    const [showEdit, setShowEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    // cari item yang sedang diedit
    const editingItem = useMemo(() => items.find((it) => it.id === editingId) || null, [items, editingId]);
    // buka modal edit
    const handleEdit = (a) => {
        setEditingId(a.id);
        setShowEdit(true);
    };
    // submit dari modal edit
    const handleEditSubmit = (p) => {
        setItems((prev) => prev.map((it) => it.id === editingId
            ? {
                ...it,
                title: p.title,
                kelas: p.kelas,
                dueDateISO: p.dueDate,
                total: p.total,
                submitted: p.submitted ?? it.submitted,
                // status dihitung ulang:
                status: (p.submitted ?? it.submitted) >= p.total
                    ? "selesai"
                    : new Date(p.dueDate) < new Date()
                        ? "terlambat"
                        : "terbuka",
            }
            : it));
        setShowEdit(false);
        setEditingId(null);
    };
    // hapus dari modal edit
    const handleEditDelete = () => {
        if (!editingItem)
            return;
        if (!confirm(`Hapus tugas "${editingItem.title}"?`))
            return;
        setItems((prev) => prev.filter((x) => x.id !== editingItem.id));
        setShowEdit(false);
        setEditingId(null);
    };
    const handleAddSubmit = (payload) => {
        const newItem = {
            id: `local-${Date.now()}`,
            title: payload.title,
            kelas: payload.kelas,
            dueDateISO: payload.dueDate,
            createdISO: new Date().toISOString(),
            submitted: 0,
            total: payload.total,
            status: "terbuka",
        };
        setItems((prev) => [newItem, ...prev]);
        setShowTambah(false);
    };
    const handleDelete = (a) => {
        if (!confirm(`Hapus tugas "${a.title}"?`))
            return;
        setItems((prev) => prev.filter((x) => x.id !== a.id));
    };
    const fmtDateLong = (iso) => iso
        ? new Date(iso).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "-";
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: new Date().toISOString(), title: heading || "Semua Tugas" }), _jsx(ModalAddAssignment, { open: showTambah, onClose: () => setShowTambah(false), palette: palette, onSubmit: handleAddSubmit }), _jsx(ModalEditAssignment, { open: showEdit, onClose: () => {
                    setShowEdit(false);
                    setEditingId(null);
                }, palette: palette, defaultValues: editingItem
                    ? {
                        title: editingItem.title,
                        kelas: editingItem.kelas,
                        dueDate: editingItem.dueDateISO, // ISO string
                        total: editingItem.total,
                        submitted: editingItem.submitted,
                    }
                    : undefined, onSubmit: handleEditSubmit, onDelete: editingItem ? handleEditDelete : undefined }), _jsx("main", { className: "mx-auto Replace px-4 py-6", children: _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4", children: [_jsx("aside", { className: "lg:w-64 mb-6 lg:mb-0 lg:sticky lg:top-16 shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold text-lg", children: [_jsx("button", { onClick: () => navigate(-1), className: "inline-flex items-center justify-center rounded-full p-1 hover:opacity-80", "aria-label": "Kembali", title: "Kembali", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { children: heading || "Semua Tugas" })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Btn, { palette: palette, size: "sm", onClick: () => setShowTambah(true), children: [_jsx(Plus, { size: 16, className: "mr-1" }), " Tambah Tugas"] }) })] }), _jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: [_jsxs("div", { className: "flex-1 flex items-center gap-2 rounded-2xl border h-10 px-3", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari tugas atau kelas\u2026", className: "bg-transparent outline-none text-sm w-full", style: { color: palette.black1 }, "aria-label": "Cari tugas" })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsx("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "h-10 rounded-xl px-3 text-sm outline-none", style: {
                                                        background: palette.white1,
                                                        color: palette.black1,
                                                        border: `1px solid ${palette.silver1}`,
                                                    }, "aria-label": "Filter status", children: ["semua", "terbuka", "selesai", "terlambat"].map((s) => (_jsx("option", { value: s, children: s[0].toUpperCase() + s.slice(1) }, s))) }) })] }) }), _jsx("div", { className: "grid gap-3", children: filtered.length === 0 ? (_jsx(SectionCard, { palette: palette, className: "p-6 text-center", children: _jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Tidak ada tugas ditemukan." }) })) : (filtered.map((a) => {
                                        const tone = statusBadgeTone(a.status);
                                        return (_jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", style: { background: palette.white1 }, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h2", { className: "font-semibold truncate", children: a.title }), _jsx("span", { className: "text-xs px-2 py-0.5 rounded-full", style: { color: tone.text, background: tone.bg }, children: a.status[0].toUpperCase() + a.status.slice(1) })] }), _jsxs("div", { className: "mt-1 text-sm flex flex-wrap gap-3", style: { color: palette.black2 }, children: [a.createdISO && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 16 }), " Dibuat", " ", dateShort(a.createdISO)] })), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 16 }), " Batas", " ", dateShort(a.dueDateISO)] }), _jsxs("span", { className: "flex items-center gap-1", children: [a.submitted, "/", a.total, " terkumpul", a.status === "selesai" ? (_jsx(CheckCircle2, { size: 16 })) : a.status === "terlambat" ? (_jsx(AlertTriangle, { size: 16 })) : null] }), a.kelas && (_jsx(Badge, { palette: palette, variant: "outline", children: a.kelas }))] })] }), _jsxs("div", { className: "shrink-0 flex items-center gap-2", children: [_jsx(Link, { to: `./${a.id}`, state: {
                                                                    assignment: {
                                                                        id: a.id,
                                                                        title: a.title,
                                                                        dueDate: a.dueDateISO,
                                                                        submitted: a.submitted,
                                                                        total: a.total,
                                                                    },
                                                                }, children: _jsx(Btn, { palette: palette, size: "sm", variant: "white1", children: "Detail" }) }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: () => handleEdit(a), children: "Edit" }), _jsx(Btn, { palette: palette, size: "sm", variant: "destructive", onClick: () => handleDelete(a), children: "Hapus" })] })] }) }, a.id));
                                    })) })] })] }) })] }));
}
