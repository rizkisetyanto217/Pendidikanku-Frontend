import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import { useNavigate } from "react-router-dom";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { MapPin, Plus, Edit3, Trash2, Loader2, Eye, ArrowLeft, } from "lucide-react";
/* ===================== CONFIG ===================== */
const USE_DUMMY = true;
/* ===================== QK ========================= */
const QK = {
    ROOMS: (q, limit, offset) => ["rooms", q, limit, offset],
    ROOM: (id) => ["room", id],
    ROOM_STATS: ["room-stats"],
};
/* ===================== UTILS ====================== */
const atLocalNoonISO = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x.toISOString();
};
const emptyRooms = (limit, offset) => ({
    data: [],
    pagination: { limit, offset, total: 0 },
});
const ensureRoomsResponse = (x, limit, offset) => x ?? emptyRooms(limit, offset);
/* ============== DUMMY IN-MEMORY STORE ============= */
export const seed = [
    {
        id: "d44c6e58-5a6a-4f76-9d2e-8e3f2f5b1c11",
        masjid_id: "3a7f5b8e-2f20-4a81-9d04-6a7d1b7d9c22",
        name: "Virtual Room — Kelas 7",
        code: "V-7",
        slug: "virtual-room-kelas-7",
        location: "Online",
        capacity: 90,
        description: "Ruang virtual untuk Kelas 7.",
        is_virtual: true,
        is_active: true,
        features: ["virtual", "recording", "waiting-room"],
        platform: "zoom",
        join_url: "https://zoom.us/j/111?pwd=pg",
        meeting_id: "111-111-111",
        passcode: "pg07",
        schedule: [
            {
                label: "Kelas 7A - Pagi",
                day: "mon",
                from: "07:00",
                to: "09:00",
                group: "7A",
            },
            {
                label: "Kelas 7B - Siang",
                day: "wed",
                from: "13:00",
                to: "15:00",
                group: "7B",
            },
            {
                label: "Tryout Spesial",
                date: "2025-10-03",
                from: "08:00",
                to: "10:00",
                group: "7C",
            },
        ],
        notes: [
            {
                ts: "2025-09-25T10:00:00Z",
                text: "Uji bandwidth berhasil (100 Mbps up/down).",
            },
            {
                ts: "2025-09-26T02:00:00Z",
                text: "Host pindah ke akun Zoom baru.",
                author_id: "b1a2c3d4",
            },
        ],
        created_at: "2025-09-10T03:30:00Z",
        updated_at: "2025-09-27T03:30:00Z",
    },
    {
        id: "8b9c2fcb-7c0c-4a7c-a2b3-3d7c1d9e2a10",
        masjid_id: "3a7f5b8e-2f20-4a81-9d04-6a7d1b7d9c22",
        name: "Ruang Kelas A1",
        code: "A1",
        slug: "ruang-kelas-a1",
        location: "Lantai 2, Gedung Utama",
        capacity: 30,
        description: "Ruang kelas utama.",
        is_virtual: false,
        is_active: true,
        features: ["ac", "whiteboard"],
        schedule: [
            {
                label: "Tahfizh Pagi",
                day: "mon",
                from: "06:30",
                to: "08:00",
                group: "A1",
            },
            { label: "Fiqih", day: "thu", from: "09:00", to: "10:30", group: "A1" },
        ],
        notes: [],
        created_at: "2025-09-20T02:00:00Z",
        updated_at: "2025-09-27T02:00:00Z",
    },
];
function useDummyRooms() {
    const [rooms, setRooms] = useState(seed);
    const list = (q, limit, offset) => {
        const kw = q.trim().toLowerCase();
        const filtered = kw
            ? rooms.filter((r) => r.name.toLowerCase().includes(kw) ||
                (r.location ?? "").toLowerCase().includes(kw))
            : rooms;
        const total = filtered.length;
        const data = filtered.slice(offset, offset + limit);
        return { data, pagination: { limit, offset, total } };
    };
    const create = (v) => {
        const now = new Date().toISOString();
        const item = {
            ...v,
            id: `r-${Date.now()}`,
            created_at: now,
            updated_at: now,
        };
        setRooms((prev) => [item, ...prev]);
        return item;
    };
    const update = (id, v) => {
        const now = new Date().toISOString();
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...v, updated_at: now } : r)));
    };
    const remove = (id) => setRooms((prev) => prev.filter((r) => r.id !== id));
    const stats = () => {
        const total = rooms.length;
        const active = rooms.filter((r) => r.is_active).length;
        const inUseNow = Math.min(active, Math.floor(active / 3));
        const availableToday = Math.max(0, active - inUseNow);
        return { total, active, inUseNow, availableToday };
    };
    return { list, create, update, remove, stats };
}
/* ================== API QUERIES =================== */
function useRoomsQuery(search, limit, offset) {
    return useQuery({
        queryKey: QK.ROOMS(search, limit, offset),
        queryFn: async () => {
            const res = await axios.get("/api/a/rooms", {
                params: { q: search || undefined, limit, offset },
                withCredentials: true,
            });
            return ensureRoomsResponse(res.data, limit, offset);
        },
        enabled: !USE_DUMMY,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}
function useRoomStatsQuery() {
    return useQuery({
        queryKey: QK.ROOM_STATS,
        queryFn: async () => {
            const res = await axios.get("/api/a/rooms/stats", { withCredentials: true });
            return res.data?.found
                ? res.data.data
                : { total: 0, active: 0, inUseNow: 0, availableToday: 0 };
        },
        enabled: !USE_DUMMY,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 0,
    });
}
function Flash({ palette, flash }) {
    if (!flash)
        return null;
    const isOk = flash.type === "success";
    return (_jsx("div", { className: "mx-auto px-4", children: _jsx("div", { className: "mb-3 rounded-lg px-3 py-2 text-sm", style: {
                background: isOk ? palette.success2 : palette.error2,
                color: isOk ? palette.success1 : palette.error1,
            }, children: flash.msg }) }));
}
function RoomModal({ open, onClose, initial, onSubmit, saving = false, error = null, palette, }) {
    const isEdit = Boolean(initial);
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState(30);
    const [location, setLocation] = useState("");
    const [active, setActive] = useState(true);
    const [touched, setTouched] = useState(false);
    useEffect(() => {
        if (!open)
            return;
        setTouched(false);
        if (initial) {
            setName(initial.name);
            setCapacity(initial.capacity);
            setLocation(initial.location ?? "");
            setActive(initial.is_active);
        }
        else {
            setName("");
            setCapacity(30);
            setLocation("");
            setActive(true);
        }
    }, [open, initial]);
    if (!open)
        return null;
    const nameErr = touched && !name.trim() ? "Nama wajib diisi." : "";
    const capErr = touched && capacity <= 0 ? "Kapasitas harus > 0." : "";
    const disabled = saving || !name.trim() || capacity <= 0;
    const handleSubmit = () => {
        if (disabled)
            return;
        onSubmit({
            id: initial?.id,
            name: name.trim(),
            capacity,
            location: location.trim() || undefined,
            is_active: active,
        });
    };
    return (_jsx("div", { className: "fixed inset-0 z-[70] grid place-items-center", style: { background: "rgba(0,0,0,.35)" }, children: _jsxs(SectionCard, { palette: palette, className: "w-[min(720px,94vw)] p-4 md:p-5 rounded-2xl shadow-xl", style: { background: palette.white1, color: palette.black1 }, children: [_jsx("div", { className: "flex items-center justify-between mb-3", children: _jsx("h3", { className: "text-lg font-semibold", children: isEdit ? "Edit Ruangan" : "Tambah Ruangan" }) }), _jsxs("div", { className: "grid gap-3", children: [_jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { className: "opacity-80", children: "Nama Ruangan" }), _jsx("input", { className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                        borderColor: palette.black2,
                                        background: palette.white2,
                                    }, value: name, onChange: (e) => setName(e.target.value), onBlur: () => setTouched(true), placeholder: "Mis. 'Ruang Kelas 3B'" }), nameErr && (_jsx("span", { className: "text-xs", style: { color: palette.error1 }, children: nameErr }))] }), _jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { className: "opacity-80", children: "Kapasitas" }), _jsx("input", { type: "number", min: 1, className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                        borderColor: palette.black2,
                                        background: palette.white2,
                                    }, value: capacity, onChange: (e) => setCapacity(Number(e.target.value)), onBlur: () => setTouched(true), placeholder: "30" }), capErr && (_jsx("span", { className: "text-xs", style: { color: palette.error1 }, children: capErr }))] }), _jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { className: "opacity-80", children: "Lokasi (opsional)" }), _jsxs("div", { className: "relative", children: [_jsxs("select", { className: "w-full h-10 rounded-lg border px-3 pr-8 text-sm outline-none appearance-none", style: {
                                                borderColor: palette.black2,
                                                background: palette.white2,
                                                color: palette.black1,
                                            }, value: location, onChange: (e) => setLocation(e.target.value), children: [_jsx("option", { value: "", children: "Pilih Lokasi" }), _jsx("option", { value: "Lantai 1", children: "Lantai 1" }), _jsx("option", { value: "Lantai 2", children: "Lantai 2" }), _jsx("option", { value: "Gedung A", children: "Gedung A" }), _jsx("option", { value: "Gedung B", children: "Gedung B" }), _jsx("option", { value: "Perpustakaan", children: "Perpustakaan" }), _jsx("option", { value: "Lab Komputer", children: "Lab Komputer" })] }), _jsx("span", { className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500", children: "\u25BC" })] })] }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: active, onChange: (e) => setActive(e.target.checked) }), _jsx("span", { children: "Aktif digunakan" })] }), error && !USE_DUMMY && (_jsx("div", { className: "text-sm", style: { color: palette.error1 }, children: error }))] }), _jsxs("div", { className: "mt-4 flex items-center justify-end gap-2", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: saving, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: handleSubmit, disabled: disabled, children: saving ? "Menyimpan…" : isEdit ? "Simpan" : "Tambah" })] })] }) }));
}
/* ===================== PAGE ======================= */
export default function RoomSchool() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const qc = useQueryClient();
    const navigate = useNavigate();
    const [flash, setFlash] = useState(null);
    useEffect(() => {
        if (flash) {
            const t = setTimeout(() => setFlash(null), 3000);
            return () => clearTimeout(t);
        }
    }, [flash]);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const dummy = useDummyRooms();
    const roomsQ = useRoomsQuery(search, limit, offset);
    const statsQ = useRoomStatsQuery();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInitial, setModalInitial] = useState(null);
    const upsertMutation = useMutation({
        mutationFn: async (form) => {
            if (USE_DUMMY) {
                if (form.id) {
                    dummy.update(form.id, {
                        name: form.name,
                        capacity: form.capacity,
                        location: form.location ?? null,
                        is_active: form.is_active,
                    });
                }
                else {
                    dummy.create({
                        name: form.name,
                        capacity: form.capacity,
                        location: form.location ?? null,
                        is_active: form.is_active,
                    });
                }
                return;
            }
            const payload = {
                room_name: form.name,
                room_capacity: form.capacity,
                room_location: form.location ?? null,
                room_is_active: form.is_active,
            };
            if (form.id) {
                await axios.put(`/api/a/rooms/${form.id}`, payload, {
                    withCredentials: true,
                });
            }
            else {
                await axios.post(`/api/a/rooms`, payload, { withCredentials: true });
            }
        },
        onSuccess: async (_d, vars) => {
            setFlash({
                type: "success",
                msg: vars.id ? "Ruangan diperbarui." : "Ruangan ditambahkan.",
            });
            setModalOpen(false);
            setModalInitial(null);
            if (!USE_DUMMY) {
                await Promise.all([
                    qc.invalidateQueries({ queryKey: QK.ROOMS(search, limit, offset) }),
                    qc.invalidateQueries({ queryKey: QK.ROOM_STATS }),
                ]);
            }
        },
        onError: () => setFlash({ type: "error", msg: "Gagal menyimpan ruangan." }),
    });
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            if (USE_DUMMY) {
                dummy.remove(id);
                return;
            }
            await axios.delete(`/api/a/rooms/${id}`, { withCredentials: true });
        },
        onSuccess: async () => {
            setFlash({ type: "success", msg: "Ruangan dihapus." });
            if (!USE_DUMMY) {
                await Promise.all([
                    qc.invalidateQueries({ queryKey: QK.ROOMS(search, limit, offset) }),
                    qc.invalidateQueries({ queryKey: QK.ROOM_STATS }),
                ]);
            }
        },
        onError: () => setFlash({ type: "error", msg: "Gagal menghapus ruangan." }),
    });
    const listResp = USE_DUMMY
        ? dummy.list(search, limit, offset)
        : ensureRoomsResponse(roomsQ.data, limit, offset);
    const topbarGregorianISO = useMemo(() => atLocalNoonISO(new Date()), []);
    const total = listResp.pagination.total;
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const page = Math.min(Math.floor(offset / limit) + 1, pageCount);
    const isFromMenuUtama = location.pathname.includes("/menu-utama/");
    const gotoPage = (p) => {
        const np = Math.min(Math.max(1, p), pageCount);
        setOffset((np - 1) * limit);
    };
    const handleSearchChange = (value) => {
        setSearch(value);
        setOffset(0);
    };
    const handleLimitChange = (value) => {
        setLimit(value);
        setOffset(0);
    };
    const handleAddRoom = () => {
        setModalInitial(null);
        setModalOpen(true);
    };
    const handleEditRoom = (room) => {
        setModalInitial(room);
        setModalOpen(true);
    };
    const handleDeleteRoom = (room) => {
        if (deleteMutation.isPending)
            return;
        const ok = confirm(`Hapus ruangan "${room.name}"?`);
        if (!ok)
            return;
        deleteMutation.mutate(room.id);
    };
    const closeModal = () => {
        setModalOpen(false);
        setModalInitial(null);
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Manajemen Ruangan", showBack: isFromMenuUtama, gregorianDate: topbarGregorianISO, hijriDate: new Date(topbarGregorianISO).toLocaleDateString("id-ID-u-ca-islamic-umalqura", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }), dateFmt: (iso) => iso
                    ? new Date(iso).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                    : "-" }), _jsx(Flash, { palette: palette, flash: flash }), _jsx("main", { className: "w-full px-4 md:px-6 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 min-w-0 space-y-6", children: [_jsxs("div", { className: "mx-auto md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: "Ruangan" })] }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-3", children: [_jsxs("div", { className: "flex-1 flex gap-2", children: [_jsx("input", { className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                                            borderColor: palette.black2,
                                                            background: palette.white2,
                                                            color: palette.black1,
                                                        }, placeholder: "Cari ruangan\u2026 (nama/lokasi)", value: search, onChange: (e) => handleSearchChange(e.target.value) }), _jsx("select", { className: "rounded-lg border px-2 py-2 text-sm", style: {
                                                            borderColor: palette.black2,
                                                            background: palette.white2,
                                                        }, value: limit, onChange: (e) => handleLimitChange(Number(e.target.value)), children: [10, 20, 50].map((n) => (_jsxs("option", { value: n, children: [n, "/hal"] }, n))) })] }), _jsx(Btn, { palette: palette, onClick: handleAddRoom, children: _jsx(Plus, { size: 16, className: "mr-2" }) })] }) }), _jsx(SectionCard, { palette: palette, children: _jsxs("div", { className: "p-3 md:p-4", children: [_jsx("div", { className: "mb-3 font-medium", children: "Daftar Ruangan" }), !USE_DUMMY && roomsQ.isLoading && (_jsxs("div", { className: "text-sm opacity-70 flex items-center gap-2", children: [_jsx(Loader2, { className: "animate-spin", size: 16 }), " Memuat ruangan\u2026"] })), !USE_DUMMY && roomsQ.isError && (_jsx("div", { className: "text-sm opacity-70", children: "Gagal memuat ruangan." })), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left", style: { color: palette.black2 }, children: [_jsx("th", { className: "py-2 pr-3", children: "Nama" }), _jsx("th", { className: "py-2 pr-3", children: "Kapasitas" }), _jsx("th", { className: "py-2 pr-3", children: "Lokasi" }), _jsx("th", { className: "py-2 pr-3", children: "Status" }), _jsx("th", { className: "py-2 pr-3 text-right", children: "Aksi" })] }) }), _jsxs("tbody", { children: [listResp.data.map((r) => (_jsxs("tr", { className: "border-t", style: { borderColor: palette.silver1 }, children: [_jsx("td", { className: "py-2 pr-3", children: r.name }), _jsx("td", { className: "py-2 pr-3", children: r.capacity }), _jsx("td", { className: "py-2 pr-3", children: r.location ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(MapPin, { size: 14 }), " ", r.location] })) : (_jsx("span", { className: "opacity-60", children: "\u2014" })) }), _jsx("td", { className: "py-2 pr-3", children: _jsx(Badge, { palette: palette, variant: r.is_active ? "success" : "outline", children: r.is_active ? "Aktif" : "Nonaktif" }) }), _jsx("td", { className: "py-2 pr-3", children: _jsxs("div", { className: "flex items-center gap-2 justify-end", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(`./${r.id}`), title: "Detail", children: _jsx(Eye, { size: 16 }) }), _jsx(Btn, { palette: palette, variant: "ghost", onClick: () => handleEditRoom(r), title: "Edit", children: _jsx(Edit3, { size: 16 }) }), _jsx(Btn, { palette: palette, variant: "ghost", onClick: () => handleDeleteRoom(r), title: "Hapus", disabled: deleteMutation.isPending, children: _jsx(Trash2, { size: 16 }) })] }) })] }, r.id))), listResp.data.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "py-6 text-center opacity-70", children: "Belum ada ruangan yang cocok." }) }))] })] }) }), total > 0 && (_jsxs("div", { className: "mt-3 flex items-center justify-between text-sm", children: [_jsxs("div", { className: "opacity-90", children: ["Total: ", total, " \u2022 Halaman ", page, "/", pageCount] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Btn, { palette: palette, variant: "default", onClick: () => gotoPage(page - 1), disabled: page <= 1, children: "\u2039 Prev" }), _jsx(Btn, { palette: palette, variant: "default", onClick: () => gotoPage(page + 1), disabled: page >= pageCount, children: "Next \u203A" })] })] }))] }) })] })] }) }), _jsx(RoomModal, { open: modalOpen, onClose: closeModal, initial: modalInitial, palette: palette, onSubmit: (form) => upsertMutation.mutate(form), saving: upsertMutation.isPending && !USE_DUMMY, error: upsertMutation.error?.response?.data?.message ??
                    upsertMutation.error?.message ??
                    null })] }));
}
