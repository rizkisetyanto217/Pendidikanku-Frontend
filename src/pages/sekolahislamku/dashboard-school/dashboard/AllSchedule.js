import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/jadwal/AllSchedule.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { ArrowLeft, Clock, MapPin, Plus } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import Swal from "sweetalert2";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import { mockTodaySchedule, } from "../types/TodaySchedule";
// Edit (ubah item yang ada)
import ModalEditSchedule from "./ModalEditSchedule";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import AddSchedule from "@/pages/sekolahislamku/dashboard-teacher/dashboard/AddSchedule";
const isTime = (t) => !!t && /^\d{2}:\d{2}$/.test(t);
const keyOf = (it) => `${it.title}__${it.time || ""}__${it.room || ""}`;
// detailschedule
const makeScheduleId = (it) => encodeURIComponent(keyOf(it));
export default function AllSchedule() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { state } = useLocation();
    const { items: incoming, heading } = (state ?? {});
    /* ===== sumber awal (state router atau mock) ===== */
    const initial = useMemo(() => {
        const base = Array.isArray(incoming) && incoming.length > 0
            ? incoming
            : mockTodaySchedule;
        return base.slice().sort((a, b) => {
            const ta = isTime(a.time) ? a.time : "99:99";
            const tb = isTime(b.time) ? b.time : "99:99";
            return ta.localeCompare(tb);
        });
    }, [incoming]);
    /* ===== state lokal untuk Add/Edit/Delete ===== */
    const [items, setItems] = useState(initial);
    useEffect(() => setItems(initial), [initial]);
    /* ===== Search & Filter ===== */
    const [search, setSearch] = useState("");
    const [locFilter, setLocFilter] = useState("semua");
    const lokasiOptions = useMemo(() => {
        const set = new Set(items.map((x) => (x.room ?? "").trim()).filter(Boolean));
        return ["semua", ...Array.from(set)];
    }, [items]);
    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return items.filter((j) => {
            const matchSearch = j.title.toLowerCase().includes(s) ||
                (j.room ?? "").toLowerCase().includes(s) ||
                (j.time ?? "").toLowerCase().includes(s);
            const matchLoc = locFilter === "semua" || (j.room ?? "") === locFilter;
            return matchSearch && matchLoc;
        });
    }, [items, search, locFilter]);
    /* ===== Tambah Jadwal ===== */
    const [showTambahJadwal, setShowTambahJadwal] = useState(false);
    const openAdd = () => {
        setShowTambahJadwal(true);
    };
    const handleSubmitAdd = (payload) => {
        const newItem = {
            title: payload.title,
            time: payload.time,
            room: payload.room,
        };
        setItems((prev) => [...prev, newItem].sort((a, b) => {
            const ta = isTime(a.time) ? a.time : "99:99";
            const tb = isTime(b.time) ? b.time : "99:99";
            return ta.localeCompare(tb);
        }));
        setShowTambahJadwal(false);
    };
    /* ===== Edit Jadwal (ModalEditSchedule) ===== */
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const openEdit = (it) => {
        setSelected(it);
        setEditOpen(true);
    };
    const handleSubmitEdit = (p) => {
        if (!selected)
            return;
        const k = keyOf(selected);
        setItems((prev) => prev
            .map((x) => keyOf(x) === k
            ? { ...x, title: p.title, time: p.time, room: p.room }
            : x)
            .sort((a, b) => {
            const ta = isTime(a.time) ? a.time : "99:99";
            const tb = isTime(b.time) ? b.time : "99:99";
            return ta.localeCompare(tb);
        }));
        setEditOpen(false);
        setSelected(null);
    };
    const handleDeleteFromEdit = () => {
        if (!selected)
            return;
        const k = keyOf(selected);
        setItems((prev) => prev.filter((x) => keyOf(x) !== k));
        setEditOpen(false);
        setSelected(null);
    };
    /* ===== Hapus & Detail (dari list) ===== */
    const handleDelete = (it) => {
        Swal.fire({
            title: "Yakin hapus?",
            text: `Jadwal "${it.title}" akan dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                const k = keyOf(it);
                setItems((prev) => prev.filter((x) => keyOf(x) !== k));
                Swal.fire({
                    title: "Terhapus!",
                    text: `Jadwal "${it.title}" berhasil dihapus.`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };
    const handleDetail = (it) => {
        const id = makeScheduleId(it);
        navigate(`detail/${id}`, { state: { item: it } }); // relative ke /jadwal
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: new Date().toISOString(), title: heading || "Jadwal Hari Ini", showBack: true }), _jsx(ModalEditSchedule, { open: editOpen, onClose: () => {
                    setEditOpen(false);
                    setSelected(null);
                }, palette: palette, defaultTitle: selected?.title || "", defaultTime: selected?.time || "", defaultRoom: selected?.room || "", onSubmit: handleSubmitEdit, onDelete: handleDeleteFromEdit }), _jsx(AddSchedule, { open: showTambahJadwal, onClose: () => setShowTambahJadwal(false), palette: palette, onSubmit: handleSubmitAdd }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [_jsxs("div", { className: "md:flex hidden items-center gap-3 font-semibold text-lg", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("span", { children: heading || "Jadwal Hari Ini" })] }), _jsx("div", { className: "flex gap-2", children: _jsx(Btn, { palette: palette, size: "sm", onClick: openAdd, children: _jsx(Plus, { size: 16, className: "mr-1" }) }) })] }), _jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", placeholder: "Cari judul, waktu, atau lokasi\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "h-10 w-full rounded-2xl px-3 text-sm", style: {
                                                        background: palette.white1,
                                                        color: palette.black1,
                                                        border: `1px solid ${palette.silver1}`,
                                                    } }) }), lokasiOptions.length > 1 && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { palette: palette, variant: "outline", children: "Lokasi" }), _jsx("select", { value: locFilter, onChange: (e) => setLocFilter(e.target.value), className: "h-10 rounded-xl px-3 text-sm outline-none", style: {
                                                            background: palette.white1,
                                                            color: palette.black1,
                                                            border: `1px solid ${palette.silver1}`,
                                                        }, children: lokasiOptions.map((o) => (_jsx("option", { value: o, children: o === "semua" ? "Semua" : o }, o))) })] }))] }) }), _jsx("div", { className: "grid gap-3", children: filtered.length === 0 ? (_jsx(SectionCard, { palette: palette, className: "p-6 text-center", children: _jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Tidak ada jadwal hari ini." }) })) : (filtered.map((j) => (_jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", style: { background: palette.white1 }, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: j.title }), _jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm", style: { color: palette.black2 }, children: [j.room && (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(MapPin, { size: 16 }), " ", j.room] })), _jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(Clock, { size: 16 }), " ", isTime(j.time) ? "Terjadwal" : j.time] })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2", children: [_jsx(Badge, { variant: "white1", palette: palette, children: j.time }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", variant: "white1", onClick: () => handleDetail(j), children: "Detail" }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: () => openEdit(j), children: "Edit" }), _jsx(Btn, { palette: palette, size: "sm", variant: "destructive", onClick: () => handleDelete(j), children: "Hapus" })] })] })] }) }, keyOf(j))))) })] })] }) })] }));
}
