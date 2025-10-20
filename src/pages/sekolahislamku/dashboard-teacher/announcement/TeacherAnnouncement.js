import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/TeacherAnnouncements.tsx
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import { Filter, Search, Plus, } from "lucide-react";
import AnnouncementsListCard from "../../components/card/AnnouncementsListCard";
import ParentSidebar from "../../components/home/ParentSideBar";
/* ============ Fake API (replace with axios) ============ */
async function fetchTeacherAnnouncements() {
    const now = new Date();
    const iso = now.toISOString();
    const tomorrow = new Date(now.getTime() + 864e5).toISOString();
    const items = [
        {
            id: "n1",
            title: "Tryout Ujian Tahfiz Kamis",
            date: iso,
            body: "Tryout internal Kamis, mohon hadir 10 menit lebih awal.",
            type: "info",
            status: "published",
            audience: "Semua",
            author: "Admin",
            pinned: true,
        },
        {
            id: "n2",
            title: "Rapat Kurikulum",
            date: iso,
            body: "Rapat pekan depan. Draft silabus ada di folder bersama.",
            type: "success",
            status: "published",
            audience: "TPA A",
            author: "Ustadz Abdullah",
        },
        {
            id: "n3",
            title: "Pengumpulan Seragam Gelombang 2",
            date: tomorrow,
            body: "Jadwal pengumpulan seragam gelombang 2 hari Jumat.",
            type: "warning",
            status: "scheduled",
            audience: "TPA B",
            author: "TU",
        },
        {
            id: "n4",
            title: "Catatan Kebersihan Kelas",
            date: iso,
            body: "Mohon evaluasi kebersihan kelas setiap akhir sesi.",
            type: "info",
            status: "draft",
            audience: "TPA A",
            author: "Ustadzah Amina",
        },
    ];
    // ✅ definisikan dan pakai di return
    const announcements = [
        {
            id: "a1",
            title: "Tryout Ujian Tahfiz",
            date: iso,
            body: "Tryout internal hari Kamis. Mohon siapkan rubrik penilaian makhraj & tajwid.",
            type: "info",
        },
        {
            id: "a2",
            title: "Rapat Kurikulum",
            date: iso,
            body: "Rapat kurikulum pekan depan. Draft silabus sudah di folder bersama.",
            type: "success",
        },
    ];
    return {
        gregorianDate: iso,
        hijriDate: "16 Muharram 1447 H",
        classes: ["TPA A", "TPA B"],
        summary: {
            total: items.length,
            published: items.filter((i) => i.status === "published").length,
            draft: items.filter((i) => i.status === "draft").length,
            scheduled: items.filter((i) => i.status === "scheduled").length,
        },
        items,
        announcements, // ⬅️ ditambahkan
    };
}
/* ================= Helpers ================ */
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
/* ================= Page ================= */
export default function TeacherAnnouncements() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const { data, isLoading } = useQuery({
        queryKey: ["teacher-announcements"],
        queryFn: fetchTeacherAnnouncements,
        staleTime: 60_000,
    });
    // filters
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [classFilter, setClassFilter] = useState("all");
    const [selectedId, setSelectedId] = useState(null);
    const [showComposer, setShowComposer] = useState(false);
    const itemsFiltered = useMemo(() => {
        let items = data?.items ?? [];
        if (classFilter !== "all")
            items = items.filter((i) => i.audience === classFilter || i.audience === "Semua");
        if (status !== "all")
            items = items.filter((i) => i.status === status);
        if (q.trim()) {
            const qq = q.trim().toLowerCase();
            items = items.filter((i) => i.title.toLowerCase().includes(qq) ||
                i.body.toLowerCase().includes(qq));
        }
        // pinned first
        items = [...items].sort((a, b) => Number(b.pinned) - Number(a.pinned));
        return items;
    }, [data?.items, classFilter, status, q]);
    const selected = itemsFiltered.find((i) => i.id === selectedId) || itemsFiltered[0] || null;
    /* ====== Composer state (simple) ====== */
    const [newTitle, setNewTitle] = useState("");
    const [newAudience, setNewAudience] = useState("Semua");
    const [newType, setNewType] = useState("info");
    const [newBody, setNewBody] = useState("");
    const resetComposer = () => {
        setNewTitle("");
        setNewAudience("Semua");
        setNewType("info");
        setNewBody("");
    };
    // --- tambahkan helper ini di sekitar blok hooks (setelah itemsFiltered) ---
    const announcementsFiltered = useMemo(() => {
        return (itemsFiltered ?? []).map((i) => ({
            id: i.id,
            title: i.title,
            date: i.date,
            body: i.body,
            type: i.type,
        }));
    }, [itemsFiltered]);
    function isoToInput(iso) {
        if (!iso)
            return "";
        const d = new Date(iso);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }
    function inputToIso(v) {
        if (!v)
            return new Date().toISOString();
        // asumsikan zona lokal, pakai tengah hari agar aman
        const d = new Date(`${v}T12:00:00`);
        return d.toISOString();
    }
    // ===== Modal state =====
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [draft, setDraft] = useState({
        title: "",
        date: new Date().toISOString(),
        body: "",
        type: "info",
        audience: "Semua",
        status: "draft",
        pinned: false,
    });
    function openCreate() {
        setModalMode("create");
        setDraft({
            title: "",
            date: new Date().toISOString(),
            body: "",
            type: "info",
            audience: "Semua",
            status: "draft",
            pinned: false,
        });
        setIsModalOpen(true);
    }
    function openEdit(a) {
        const full = (data?.items ?? []).find((i) => i.id === a.id);
        setModalMode("edit");
        setDraft({
            id: a.id,
            title: a.title,
            date: a.date,
            body: a.body,
            type: a.type ?? "info", // fallback saat undefined
            audience: full?.audience ?? "Semua",
            status: full?.status ?? "draft",
            pinned: Boolean(full?.pinned),
        });
        setIsModalOpen(true);
    }
    function handleSave() {
        // Dummy save — kamu bisa ganti dengan call API
        const payload = { ...draft };
        alert(`${modalMode === "create" ? "Create" : "Edit"} (dummy):\n` +
            JSON.stringify(payload, null, 2));
        setIsModalOpen(false);
    }
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Pengumuman", gregorianDate: data?.gregorianDate, hijriDate: data?.hijriDate, showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6  md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 space-y-6", children: [_jsx("section", { className: "grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch", children: _jsx(SectionCard, { palette: palette, className: "lg:col-span-6", children: _jsxs("div", { className: "p-4 md:p-5", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [_jsx(Filter, { size: 16 }), _jsx("span", { children: "Filter & Aksi" })] }), _jsx("div", { className: "flex gap-2 self-start lg:self-auto", children: _jsxs(Btn, { palette: palette, onClick: openCreate, children: [_jsx(Plus, { className: "mr-2", size: 16 }), "Buat Pengumuman"] }) })] }), _jsxs("div", { className: "mt-4 grid gap-3 lg:grid-cols-12", children: [_jsxs("label", { className: "flex items-center gap-2 rounded-xl border px-3 h-11 lg:col-span-5", style: {
                                                                borderColor: palette.silver1,
                                                                background: palette.white1,
                                                                color: palette.black1,
                                                            }, children: [_jsx(Search, { size: 16 }), _jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Cari pengumuman\u2026", className: "bg-transparent outline-none text-sm flex-1 placeholder:opacity-70", style: { color: palette.black1 } })] }), _jsxs("div", { className: "flex items-center justify-between lg:justify-start gap-3 lg:col-span-3", children: [_jsx("div", { className: "shrink-0 text-xs md:text-sm", style: { color: palette.silver2 }, children: "Audience" }), _jsxs("select", { value: classFilter, onChange: (e) => setClassFilter(e.target.value), className: "h-11 rounded-xl border px-3 text-sm w-full lg:w-[220px]", style: {
                                                                        background: palette.white1,
                                                                        color: palette.black1,
                                                                        borderColor: palette.silver1,
                                                                    }, children: [_jsx("option", { value: "all", children: "Semua" }), (data?.classes ?? []).map((c) => (_jsx("option", { value: c, children: c }, c)))] })] }), _jsx("div", { className: "lg:col-span-4 flex lg:justify-end", children: _jsx("div", { className: "inline-flex rounded-xl overflow-hidden border whitespace-nowrap", style: {
                                                                    borderColor: palette.silver1,
                                                                    background: palette.white1,
                                                                }, role: "tablist", "aria-label": "Status", children: ["all", "published", "draft"].map((s) => {
                                                                    const active = status === s;
                                                                    return (_jsx("button", { onClick: () => setStatus(s), role: "tab", "aria-selected": active, className: "px-4 h-11 text-sm transition-colors border-r last:border-r-0", style: {
                                                                            background: active
                                                                                ? palette.primary2
                                                                                : "transparent",
                                                                            color: active
                                                                                ? palette.primary
                                                                                : palette.black1,
                                                                            borderColor: palette.silver1,
                                                                        }, children: s === "all"
                                                                            ? "Semua"
                                                                            : s === "published"
                                                                                ? "Terbit"
                                                                                : "Draft" }, s));
                                                                }) }) })] }), showComposer && (_jsx("div", { className: "mt-4 rounded-xl border p-3 md:p-4", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                    }, children: _jsxs("div", { className: "grid gap-3", children: [_jsx("input", { className: "h-11 rounded-lg border px-3 text-sm", placeholder: "Judul pengumuman", value: newTitle, onChange: (e) => setNewTitle(e.target.value), style: {
                                                                    background: "transparent",
                                                                    color: palette.black1,
                                                                    borderColor: palette.silver1,
                                                                } }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [_jsxs("select", { className: "h-11 rounded-lg border px-3 text-sm", value: newAudience, onChange: (e) => setNewAudience(e.target.value), style: {
                                                                            background: "transparent",
                                                                            color: palette.black1,
                                                                            borderColor: palette.silver1,
                                                                        }, children: [_jsx("option", { children: "Semua" }), (data?.classes ?? []).map((c) => (_jsx("option", { children: c }, c)))] }), _jsxs("select", { className: "h-11 rounded-lg border px-3 text-sm", value: newType, onChange: (e) => setNewType(e.target.value), style: {
                                                                            background: "transparent",
                                                                            color: palette.black1,
                                                                            borderColor: palette.silver1,
                                                                        }, children: [_jsx("option", { value: "info", children: "Info" }), _jsx("option", { value: "success", children: "Sukses" }), _jsx("option", { value: "warning", children: "Peringatan" })] })] }), _jsx("textarea", { rows: 4, className: "rounded-lg border p-3 text-sm", placeholder: "Tulis isi pengumuman\u2026", value: newBody, onChange: (e) => setNewBody(e.target.value), style: {
                                                                    background: "transparent",
                                                                    color: palette.black1,
                                                                    borderColor: palette.silver1,
                                                                } }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Btn, { palette: palette, onClick: () => {
                                                                            alert("Publish pengumuman");
                                                                            resetComposer();
                                                                            setShowComposer(false);
                                                                        }, children: "Publikasikan" }), _jsx(Btn, { palette: palette, variant: "secondary", onClick: () => {
                                                                            alert("Simpan sebagai draft");
                                                                            resetComposer();
                                                                            setShowComposer(false);
                                                                        }, children: "Simpan Draft" })] })] }) }))] }) }) }), _jsx("section", { children: _jsx(AnnouncementsListCard, { palette: palette, items: announcementsFiltered, seeAllPath: "/guru/pengumuman", getDetailHref: (a) => `/guru/pengumuman/detail/${a.id}`, onEdit: openEdit, onDelete: (a) => {
                                            // ✅ handler hapus milikmu: panggil API lalu refresh query
                                            if (confirm(`Yakin hapus "${a.title}"?`)) {
                                                // TODO: await api.delete(a.id);
                                                alert(`(mock) terhapus: ${a.title}`);
                                                // contoh refresh: queryClient.invalidateQueries({queryKey:["teacher-announcements"]})
                                            }
                                        } }) }), isLoading && (_jsx("div", { className: "text-sm", style: { color: palette.silver2 }, children: "Memuat data\u2026" }))] })] }) }), isModalOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.35)" }, role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "w-full max-w-2xl rounded-2xl border shadow-xl", style: {
                        background: palette.white1,
                        borderColor: palette.silver1,
                        color: palette.black1,
                    }, children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b", style: { borderColor: palette.silver1 }, children: [_jsx("h3", { className: "text-base font-semibold", children: modalMode === "create" ? "Buat Pengumuman" : "Edit Pengumuman" }), _jsx("button", { onClick: () => setIsModalOpen(false), className: "text-sm rounded-lg px-3 h-9", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, children: "Tutup" })] }), _jsxs("div", { className: "px-5 py-4 space-y-3", children: [_jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.silver2 }, children: "Judul" }), _jsx("input", { className: "h-10 rounded-lg border px-3 text-sm w-full", value: draft.title, onChange: (e) => setDraft((d) => ({ ...d, title: e.target.value })), placeholder: "Judul pengumuman", style: {
                                                        background: "transparent",
                                                        color: palette.black1,
                                                        borderColor: palette.silver1,
                                                    } })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.silver2 }, children: "Tanggal" }), _jsx("input", { type: "date", className: "h-10 rounded-lg border px-3 text-sm w-full", value: isoToInput(draft.date), onChange: (e) => setDraft((d) => ({
                                                        ...d,
                                                        date: inputToIso(e.target.value),
                                                    })), style: {
                                                        background: "transparent",
                                                        color: palette.black1,
                                                        borderColor: palette.silver1,
                                                    } })] })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.silver2 }, children: "Audience" }), _jsxs("select", { className: "h-10 rounded-lg border px-3 text-sm w-full", value: draft.audience, onChange: (e) => setDraft((d) => ({ ...d, audience: e.target.value })), style: {
                                                        background: "transparent",
                                                        color: palette.black1,
                                                        borderColor: palette.silver1,
                                                    }, children: [_jsx("option", { children: "Semua" }), (data?.classes ?? []).map((c) => (_jsx("option", { children: c }, c)))] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.silver2 }, children: "Tipe" }), _jsxs("select", { className: "h-10 rounded-lg border px-3 text-sm w-full", value: draft.type, onChange: (e) => setDraft((d) => ({ ...d, type: e.target.value })), style: {
                                                        background: "transparent",
                                                        color: palette.black1,
                                                        borderColor: palette.silver1,
                                                    }, children: [_jsx("option", { value: "info", children: "Info" }), _jsx("option", { value: "success", children: "Sukses" }), _jsx("option", { value: "warning", children: "Peringatan" })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.silver2 }, children: "Status" }), _jsxs("select", { className: "h-10 rounded-lg border px-3 text-sm w-full", value: draft.status, onChange: (e) => setDraft((d) => ({
                                                        ...d,
                                                        status: e.target.value,
                                                    })), style: {
                                                        background: "transparent",
                                                        color: palette.black1,
                                                        borderColor: palette.silver1,
                                                    }, children: [_jsx("option", { value: "published", children: "Terbit" }), _jsx("option", { value: "draft", children: "Draft" })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { id: "pinned", type: "checkbox", checked: draft.pinned, onChange: (e) => setDraft((d) => ({ ...d, pinned: e.target.checked })) }), _jsx("label", { htmlFor: "pinned", className: "text-sm", children: "Pinned" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", style: { color: palette.silver2 }, children: "Isi Pengumuman" }), _jsx("textarea", { rows: 5, className: "rounded-lg border p-3 text-sm w-full", placeholder: "Tulis isi pengumuman\u2026", value: draft.body, onChange: (e) => setDraft((d) => ({ ...d, body: e.target.value })), style: {
                                                background: "transparent",
                                                color: palette.black1,
                                                borderColor: palette.silver1,
                                            } })] })] }), _jsxs("div", { className: "px-5 py-4 border-t flex justify-end gap-2", style: { borderColor: palette.silver1 }, children: [_jsx(Btn, { palette: palette, variant: "secondary", onClick: () => setIsModalOpen(false), children: "Batal" }), _jsx(Btn, { palette: palette, onClick: handleSave, style: {
                                        background: palette.primary,
                                        color: palette.white1,
                                        borderColor: palette.primary,
                                    }, children: modalMode === "create"
                                        ? "Simpan & Publikasikan"
                                        : "Simpan Perubahan" })] })] }) }))] }));
}
