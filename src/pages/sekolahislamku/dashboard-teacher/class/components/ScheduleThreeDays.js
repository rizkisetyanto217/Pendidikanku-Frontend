import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"; // ⬅️ pastikan CSS swal ter-load
import { SectionCard, Btn, Badge, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Calendar, Clock, MapPin, Plus, ArrowLeft } from "lucide-react";
import { fetchTeacherHome } from "../types/teacher";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import AddSchedule from "../../dashboard/AddSchedule";
/* ================ SweetAlert utilities (inline) ================ */
const SWAL_CONTAINER_Z = "z-[2000]"; // pastikan berada paling atas
async function confirmDelete({ title = "Yakin hapus data?", text = "Tindakan ini tidak bisa dibatalkan.", confirmText = "Ya, hapus", cancelText = "Batal", } = {}) {
    const res = await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        heightAuto: false,
        backdrop: true,
        buttonsStyling: false,
        customClass: {
            container: SWAL_CONTAINER_Z,
            popup: "rounded-2xl",
            confirmButton: "swal2-confirm bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg",
            cancelButton: "swal2-cancel bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg ml-2",
        },
    });
    return res.isConfirmed;
}
function toastSuccess(msg = "Berhasil.") {
    return Swal.fire({
        title: "Sukses",
        text: msg,
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
        heightAuto: false,
        customClass: { container: SWAL_CONTAINER_Z, popup: "rounded-2xl" },
    });
}
function toastError(msg = "Terjadi kesalahan.") {
    return Swal.fire({
        title: "Gagal",
        text: msg,
        icon: "error",
        timer: 1800,
        showConfirmButton: true,
        heightAuto: false,
        customClass: { container: SWAL_CONTAINER_Z, popup: "rounded-2xl" },
    });
}
/* ================= Date helpers ================= */
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
/** Ekstrak nama lokasi murni dari field room yang mungkin “DD Mon • Ruang” */
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
/** Normalisasi from API object → UI ScheduleItem (sertakan id fallback stabil) */
const normalizeItem = (c, fallback) => {
    const dateISO = c.dateISO
        ? toISODate(new Date(c.dateISO))
        : toISODate(fallback);
    const title = `${c.className} — ${c.subject}`;
    const id = c.id ?? `${dateISO}|${c.time}|${title}`;
    return {
        id,
        time: c.time,
        title,
        dateISO,
        room: c.dateISO ? `${fmtShort(c.dateISO)} • ${c.room ?? "-"}` : c.room,
    };
};
/* ================= Component ================= */
export default function ScheduleThreeDays() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    // optional preload dari router state
    const location = useLocation();
    const preload = location.state?.items;
    const { data } = useQuery({
        queryKey: ["teacher-home"],
        queryFn: fetchTeacherHome,
        staleTime: 60_000,
    });
    // Ambil 3 hari ke depan (hari ini s/d +2)
    const DAYS = 3;
    const today = startOfDay(new Date());
    const end = startOfDay(addDays(today, DAYS - 1));
    // Susun sumber data
    const rawItems = useMemo(() => {
        if (Array.isArray(preload) && preload.length) {
            return preload
                .map((p) => ({
                ...p,
                id: p.id ??
                    `${toISODate(new Date(p.dateISO ?? today))}|${p.time}|${p.title}`,
                dateISO: p.dateISO
                    ? toISODate(new Date(p.dateISO))
                    : toISODate(today),
            }))
                .sort((a, b) => {
                const da = new Date(a.dateISO).getTime();
                const db = new Date(b.dateISO).getTime();
                if (da !== db)
                    return da - db;
                return a.time.localeCompare(b.time);
            });
        }
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
    }, [preload, data?.upcomingClasses, data?.todayClasses]);
    /* ====== Lokal state supaya bisa Add/Edit/Delete tanpa reload ====== */
    const [localItems, setLocalItems] = useState(rawItems);
    useEffect(() => setLocalItems(rawItems), [rawItems]);
    /* ====== Search & Filter lokasi ====== */
    const [search, setSearch] = useState("");
    const [locFilter, setLocFilter] = useState("semua");
    const lokasiOptions = useMemo(() => {
        const set = new Set(localItems
            .map((x) => getPureLocation(x.room))
            .map((s) => s.trim())
            .filter(Boolean));
        return ["semua", ...Array.from(set)];
    }, [localItems]);
    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        return localItems.filter((j) => {
            const location = getPureLocation(j.room);
            const matchSearch = j.title.toLowerCase().includes(s) ||
                location.toLowerCase().includes(s) ||
                j.time.toLowerCase().includes(s);
            const matchLoc = locFilter === "semua" || location === locFilter;
            return matchSearch && matchLoc;
        });
    }, [localItems, search, locFilter]);
    /* ====== Bucket per hari (3 kotak) ====== */
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
    const [editingId, setEditingId] = useState(null);
    const [targetDateISO, setTargetDateISO] = useState(null);
    const openAdd = (dateISO) => {
        setEditingId(null);
        setTargetDateISO(dateISO ?? toISODate(today));
        setShowTambahJadwal(true);
    };
    const openEdit = (it) => {
        setEditingId(it.id ?? `${it.dateISO}|${it.time}|${it.title}`);
        setTargetDateISO(it.dateISO);
        setShowTambahJadwal(true);
    };
    const handleSubmitSchedule = (payload) => {
        const baseDateISO = targetDateISO ?? toISODate(today);
        if (editingId) {
            // Edit: replace item yang cocok
            setLocalItems((prev) => prev
                .map((x) => (x.id ?? `${x.dateISO}|${x.time}|${x.title}`) === editingId
                ? {
                    ...x,
                    time: payload.time,
                    title: payload.title,
                    room: payload.room
                        ? `${fmtShort(baseDateISO)} • ${payload.room}`
                        : x.room,
                }
                : x)
                .sort((a, b) => {
                const da = new Date(a.dateISO).getTime();
                const db = new Date(b.dateISO).getTime();
                if (da !== db)
                    return da - db;
                return a.time.localeCompare(b.time);
            }));
        }
        else {
            // Add: masuk ke tanggal target (default: hari ini)
            const newItem = {
                id: `local-${Date.now()}`,
                dateISO: baseDateISO,
                time: payload.time,
                title: payload.title,
                room: payload.room
                    ? `${fmtShort(baseDateISO)} • ${payload.room}`
                    : undefined,
            };
            setLocalItems((prev) => [...prev, newItem].sort((a, b) => {
                const da = new Date(a.dateISO).getTime();
                const db = new Date(b.dateISO).getTime();
                if (da !== db)
                    return da - db;
                return a.time.localeCompare(b.time);
            }));
        }
        setShowTambahJadwal(false);
    };
    const handleDelete = async (it) => {
        const ok = await confirmDelete({
            title: "Yakin hapus jadwal?",
            text: `Jadwal "${it.title}" akan dihapus permanen.`,
            confirmText: "Ya, hapus",
            cancelText: "Batal",
        });
        if (!ok)
            return;
        try {
            // TODO: panggil API delete bila sudah ada:
            // await axios.delete(`/api/schedules/${encodeURIComponent(it.id!)}`);
            const key = it.id ?? `${it.dateISO}|${it.time}|${it.title}`;
            setLocalItems((prev) => prev.filter((x) => (x.id ?? `${x.dateISO}|${x.time}|${x.title}`) !== key));
            await toastSuccess("Jadwal berhasil dihapus.");
        }
        catch (e) {
            await toastError(e?.response?.data?.message ?? "Gagal menghapus jadwal.");
        }
    };
    /* ================= Render ================= */
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: new Date().toISOString(), title: "Jadwal 3 Hari Kedepan", showBack: true, dateFmt: (iso) => new Date(iso).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }) }), _jsx(AddSchedule, { open: showTambahJadwal, onClose: () => setShowTambahJadwal(false), palette: palette, onSubmit: handleSubmitSchedule }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [_jsx("div", { className: "md:flex hidden items-center justify-between gap-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("div", { className: "font-semibold text-lg", children: "Jadwal 3 Hari Kedepan" })] }) }), _jsx(SectionCard, { palette: palette, className: "p-3 md:p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-3", children: [_jsx("div", { className: "flex-1", children: _jsx("input", { type: "text", placeholder: "Cari kelas/materi/lokasi\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "h-10 w-full rounded-2xl px-3 text-sm", style: {
                                                        background: palette.white1,
                                                        color: palette.black1,
                                                        border: `1px solid ${palette.silver1}`,
                                                    } }) }), lokasiOptions.length > 1 && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { palette: palette, variant: "outline", children: "Lokasi" }), _jsx("select", { value: locFilter, onChange: (e) => setLocFilter(e.target.value), className: "h-10 rounded-xl px-3 text-sm outline-none", style: {
                                                            background: palette.white1,
                                                            color: palette.black1,
                                                            border: `1px solid ${palette.silver1}`,
                                                        }, children: lokasiOptions.map((o) => (_jsx("option", { value: o, children: o === "semua" ? "Semua" : o }, o))) })] }))] }) }), _jsx("div", { className: "grid gap-3", children: dayBuckets.map(({ dateISO, items }) => (_jsxs(SectionCard, { palette: palette, className: "p-0 overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b font-semibold flex items-center justify-between", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white1,
                                                }, children: [fmtLong(dateISO), _jsxs(Btn, { palette: palette, size: "sm", variant: "white1", onClick: () => openAdd(dateISO), children: [_jsx(Plus, { size: 16, className: "mr-1" }), " Tambah di Hari Ini"] })] }), items.length === 0 ? (_jsx("div", { className: "px-4 py-3 text-sm", style: {
                                                    color: palette.black2,
                                                    background: palette.white1,
                                                }, children: "Belum ada jadwal pada hari ini." })) : (_jsx("div", { className: "divide-y", style: { borderColor: palette.silver1 }, children: items.map((s, i) => {
                                                    const slug = makeScheduleSlug(s);
                                                    return (_jsxs("div", { className: "px-4 py-3 flex items-center justify-between gap-4", style: { background: palette.white1 }, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "font-medium truncate", children: s.title }), _jsxs("div", { className: "text-sm mt-1 flex flex-wrap gap-3", style: { color: palette.black2 }, children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 16 }), " ", fmtLong(dateISO)] }), getPureLocation(s.room) && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 16 }), " ", getPureLocation(s.room)] })), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 16 }), " ", s.time] })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsx(Link, { to: `./${slug}`, state: { item: s }, children: _jsx(Btn, { palette: palette, size: "sm", variant: "white1", children: "Detail" }) }), _jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: () => openEdit(s), children: "Edit" }), _jsx(Btn, { palette: palette, size: "sm", variant: "destructive", onClick: () => handleDelete(s), children: "Hapus" })] })] }, s.id ?? `${s.dateISO}-${s.time}-${i}`));
                                                }) }))] }, dateISO))) })] })] }) })] }));
}
