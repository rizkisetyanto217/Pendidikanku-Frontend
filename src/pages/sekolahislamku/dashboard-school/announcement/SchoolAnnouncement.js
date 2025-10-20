import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/announcements/AnnouncementsPage.tsx
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import axios from "@/lib/axios";
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import { Megaphone, Plus, Search, AlertTriangle, CalendarClock, Send, X, CheckCircle2, PauseCircle, Trash2, Eye, Users, MoreVertical, Edit, } from "lucide-react";
import ParentSidebar from "../../components/home/ParentSideBar";
/* =============== Components =============== */
const ActionModal = ({ isOpen, onClose, announcement, onPublish, onUnpublish, onDelete, palette, }) => {
    if (!isOpen || !announcement)
        return null;
    const handleAction = (action) => {
        switch (action) {
            case "publish":
                onPublish(announcement.id);
                break;
            case "unpublish":
                onUnpublish(announcement.id);
                break;
            case "delete":
                if (confirm("Yakin ingin menghapus pengumuman ini?")) {
                    onDelete(announcement.id);
                }
                break;
        }
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-2xl p-6 max-w-md w-full mx-4 relative shadow-2xl", style: { backgroundColor: palette.white1, borderColor: palette.white3 }, children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 rounded-full hover:bg-opacity-10 transition-colors", style: { color: palette.secondary, backgroundColor: palette.white3 }, children: _jsx(X, { size: 18 }) }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", style: { color: palette.quaternary }, children: "Aksi Pengumuman" }), _jsx("p", { className: "text-sm line-clamp-2", style: { color: palette.secondary }, children: announcement.title })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { onClick: () => handleAction("view"), className: "w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all duration-200 hover:bg-opacity-50", style: {
                                backgroundColor: palette.white3,
                                color: palette.quaternary,
                            }, children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: palette.primary, color: "white" }, children: _jsx(Eye, { size: 16 }) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Lihat Detail" }), _jsx("div", { className: "text-sm", style: { color: palette.secondary }, children: "Buka halaman detail pengumuman" })] })] }), announcement.status !== "published" ? (_jsxs("button", { onClick: () => handleAction("publish"), className: "w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all duration-200 hover:bg-opacity-50", style: {
                                backgroundColor: palette.white3,
                                color: palette.quaternary,
                            }, children: [_jsx("div", { className: "p-2 rounded-lg bg-green-600", children: _jsx(CheckCircle2, { size: 16, className: "text-white" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Publish" }), _jsx("div", { className: "text-sm", style: { color: palette.secondary }, children: "Terbitkan pengumuman ini" })] })] })) : (_jsxs("button", { onClick: () => handleAction("unpublish"), className: "w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all duration-200 hover:bg-opacity-50", style: {
                                backgroundColor: palette.white3,
                                color: palette.quaternary,
                            }, children: [_jsx("div", { className: "p-2 rounded-lg bg-orange-500", children: _jsx(PauseCircle, { size: 16, className: "text-white" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Unpublish" }), _jsx("div", { className: "text-sm", style: { color: palette.secondary }, children: "Batalkan publikasi pengumuman" })] })] })), _jsxs("button", { onClick: () => handleAction("delete"), className: "w-full flex items-center gap-3 p-3 text-left rounded-xl transition-all duration-200 hover:bg-opacity-50", style: {
                                backgroundColor: palette.white3,
                                color: palette.quaternary,
                            }, children: [_jsx("div", { className: "p-2 rounded-lg bg-red-600", children: _jsx(Trash2, { size: 16, className: "text-white" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: "Hapus" }), _jsx("div", { className: "text-sm", style: { color: palette.secondary }, children: "Hapus pengumuman secara permanen" })] })] })] }), _jsx("div", { className: "mt-6 pt-4 border-t", style: { borderColor: palette.white3 }, children: _jsx("button", { onClick: onClose, className: "w-full py-2 text-center rounded-lg transition-colors", style: {
                            color: palette.secondary,
                            backgroundColor: palette.white3,
                        }, children: "Tutup" }) })] }) }));
};
/* =============== Helpers =============== */
const formatDate = (iso) => iso
    ? new Date(iso).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
    : "-";
const getAudienceLabel = (audience) => {
    switch (audience) {
        case "all":
            return "Semua";
        case "students":
            return "Siswa";
        case "teachers":
            return "Guru";
        default:
            return audience;
    }
};
/* =============== Main Component =============== */
export default function SchoolAnnouncement() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const qc = useQueryClient();
    // State management
    const [filters, setFilters] = useState({
        q: "",
        audience: "semua",
        status: "semua",
    });
    const [newForm, setNewForm] = useState({
        show: false,
        title: "",
        content: "",
        audience: "all",
        scheduleType: "now",
        scheduleAt: "",
    });
    const [actionModal, setActionModal] = useState({
        show: false,
        announcement: null,
    });
    // Queries
    const listQuery = useQuery({
        queryKey: ["announcements", filters],
        queryFn: async () => {
            const params = {};
            if (filters.q)
                params.q = filters.q;
            if (filters.audience !== "semua")
                params.audience = filters.audience;
            if (filters.status !== "semua")
                params.status = filters.status;
            const res = await axios.get("/api/a/announcements", { params });
            return res.data;
        },
    });
    const items = listQuery.data?.list ?? [];
    const stats = useMemo(() => {
        const total = listQuery.data?.total ?? items.length;
        const published = items.filter((i) => i.status === "published").length;
        const scheduled = items.filter((i) => i.status === "scheduled").length;
        const draft = items.filter((i) => i.status === "draft").length;
        return { total, published, scheduled, draft };
    }, [listQuery.data, items]);
    // Mutations
    const createMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                title: newForm.title,
                content: newForm.content,
                audience: newForm.audience,
            };
            if (newForm.scheduleType === "later" && newForm.scheduleAt) {
                payload.scheduled_at = newForm.scheduleAt;
            }
            return axios.post("/api/a/announcements", payload);
        },
        onSuccess: () => {
            setNewForm({
                show: false,
                title: "",
                content: "",
                audience: "all",
                scheduleType: "now",
                scheduleAt: "",
            });
            qc.invalidateQueries({ queryKey: ["announcements"] });
        },
    });
    const publishMutation = useMutation({
        mutationFn: async (id) => axios.post(`/api/a/announcements/${id}/publish`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
    });
    const unpublishMutation = useMutation({
        mutationFn: async (id) => axios.post(`/api/a/announcements/${id}/unpublish`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
    });
    const deleteMutation = useMutation({
        mutationFn: async (id) => axios.delete(`/api/a/announcements/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
    });
    // Event handlers
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    const handleNewFormChange = (key, value) => {
        setNewForm((prev) => ({ ...prev, [key]: value }));
    };
    const openActionModal = (announcement) => {
        setActionModal({ show: true, announcement });
    };
    const closeActionModal = () => {
        setActionModal({ show: false, announcement: null });
    };
    return (_jsxs(_Fragment, { children: [_jsx(ParentTopBar, { palette: palette, title: "Pengumuman" }), _jsxs("div", { className: "lg:flex lg:items-start lg:gap-4 lg:p-4 lg:pt-6", children: [_jsx(ParentSidebar, { palette: palette, className: "hidden lg:block" }), _jsxs("main", { className: "flex-1 mx-auto Replace px-4 py-6 space-y-6", children: [_jsxs("div", { className: "flex items-start justify-between flex-wrap gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "h-12 w-12 rounded-xl grid place-items-center", style: {
                                                    background: palette.white3,
                                                    color: palette.quaternary,
                                                }, children: _jsx(Megaphone, { size: 24 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", style: { color: palette.quaternary }, children: "Pengumuman Sekolah" }), _jsx("p", { className: "text-sm", style: { color: palette.secondary }, children: "Kelola dan publikasikan pengumuman untuk siswa dan guru" })] })] }), _jsxs(Btn, { palette: palette, variant: "default", className: "flex items-center gap-2", onClick: () => handleNewFormChange("show", true), children: [_jsx(Plus, { size: 18 }), " Buat Pengumuman"] })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm mb-1", style: { color: palette.secondary }, children: "Total" }), _jsx("p", { className: "text-2xl font-bold", style: { color: palette.quaternary }, children: stats.total })] }), _jsx(Users, { className: "opacity-60", style: { color: palette.secondary } })] }) }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm mb-1", style: { color: palette.secondary }, children: "Published" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.published })] }), _jsx(CheckCircle2, { className: "opacity-60 text-green-600" })] }) }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm mb-1", style: { color: palette.secondary }, children: "Scheduled" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: stats.scheduled })] }), _jsx(CalendarClock, { className: "opacity-60 text-blue-600" })] }) }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm mb-1", style: { color: palette.secondary }, children: "Draft" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: stats.draft })] }), _jsx(Edit, { className: "opacity-60 text-orange-600" })] }) })] }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center gap-4", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-3 rounded-xl px-4 py-3 border", style: {
                                                    borderColor: palette.white3,
                                                    background: palette.white1,
                                                }, children: [_jsx(Search, { size: 18, style: { color: palette.secondary } }), _jsx("input", { value: filters.q, onChange: (e) => handleFilterChange("q", e.target.value), placeholder: "Cari pengumuman...", className: "w-full bg-transparent outline-none", style: { color: palette.quaternary } })] }) }), _jsxs("div", { className: "flex gap-3 ", children: [_jsxs("select", { value: filters.audience, onChange: (e) => handleFilterChange("audience", e.target.value), className: "px-4 py-3 rounded-xl border bg-transparent outline-none", style: {
                                                        borderColor: palette.white3,
                                                        backgroundColor: palette.white1,
                                                        color: palette.quaternary,
                                                    }, children: [_jsx("option", { value: "semua", children: "Semua Audiens" }), _jsx("option", { value: "all", children: "Semua (Siswa+Guru)" }), _jsx("option", { value: "students", children: "Siswa" }), _jsx("option", { value: "teachers", children: "Guru" })] }), _jsxs("select", { value: filters.status, onChange: (e) => handleFilterChange("status", e.target.value), className: "px-4 py-3 rounded-xl border bg-transparent outline-none", style: {
                                                        borderColor: palette.white3,
                                                        backgroundColor: palette.white1,
                                                        color: palette.quaternary,
                                                    }, children: [_jsx("option", { value: "semua", children: "Semua Status" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "scheduled", children: "Scheduled" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "archived", children: "Archived" })] })] })] }) }), newForm.show && (_jsxs(SectionCard, { palette: palette, className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h3", { className: "text-lg font-semibold", style: { color: palette.quaternary }, children: "Buat Pengumuman Baru" }), _jsx("button", { onClick: () => handleNewFormChange("show", false), className: "p-2 rounded-full transition-colors", style: {
                                                    color: palette.secondary,
                                                    backgroundColor: palette.white3,
                                                }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: palette.secondary }, children: "Judul Pengumuman" }), _jsx("input", { value: newForm.title, onChange: (e) => handleNewFormChange("title", e.target.value), className: "w-full rounded-xl px-4 py-3 border bg-transparent outline-none", style: {
                                                            borderColor: palette.white3,
                                                            color: palette.quaternary,
                                                        }, placeholder: "Masukkan judul pengumuman..." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: palette.secondary }, children: "Isi Pengumuman" }), _jsx("textarea", { value: newForm.content, onChange: (e) => handleNewFormChange("content", e.target.value), rows: 6, className: "w-full rounded-xl px-4 py-3 border bg-transparent outline-none resize-none", style: {
                                                            borderColor: palette.white3,
                                                            color: palette.quaternary,
                                                        }, placeholder: "Tulis isi pengumuman di sini..." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: palette.secondary }, children: "Audiens" }), _jsxs("select", { value: newForm.audience, onChange: (e) => handleNewFormChange("audience", e.target.value), className: "w-full px-4 py-3 rounded-xl border bg-transparent outline-none", style: {
                                                                    borderColor: palette.white3,
                                                                    color: palette.quaternary,
                                                                }, children: [_jsx("option", { value: "all", children: "Semua (Siswa & Guru)" }), _jsx("option", { value: "students", children: "Siswa Saja" }), _jsx("option", { value: "teachers", children: "Guru Saja" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: palette.secondary }, children: "Jadwal Publikasi" }), _jsxs("div", { className: "flex gap-4", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", name: "schedule", checked: newForm.scheduleType === "now", onChange: () => handleNewFormChange("scheduleType", "now"), className: "text-blue-600" }), _jsx("span", { style: { color: palette.quaternary }, children: "Sekarang" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "radio", name: "schedule", checked: newForm.scheduleType === "later", onChange: () => handleNewFormChange("scheduleType", "later"), className: "text-blue-600" }), _jsx("span", { style: { color: palette.quaternary }, children: "Jadwalkan" })] })] })] })] }), newForm.scheduleType === "later" && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: palette.secondary }, children: "Waktu Publikasi" }), _jsx("input", { type: "datetime-local", value: newForm.scheduleAt, onChange: (e) => handleNewFormChange("scheduleAt", e.target.value), className: "px-4 py-3 rounded-xl border bg-transparent outline-none", style: {
                                                            borderColor: palette.white3,
                                                            color: palette.quaternary,
                                                        } })] })), _jsxs("div", { className: "flex items-center gap-3 pt-2", children: [_jsxs(Btn, { palette: palette, variant: "default", className: "flex items-center gap-2", onClick: () => createMutation.mutate(), disabled: !newForm.title ||
                                                            !newForm.content ||
                                                            (newForm.scheduleType === "later" && !newForm.scheduleAt), children: [_jsx(Send, { size: 16 }), newForm.scheduleType === "now"
                                                                ? "Publikasikan"
                                                                : "Jadwalkan"] }), _jsx(Btn, { palette: palette, variant: "outline", onClick: () => handleNewFormChange("show", false), children: "Batal" }), createMutation.isError && (_jsxs("div", { className: "flex items-center gap-2 text-red-600", children: [_jsx(AlertTriangle, { size: 16 }), _jsx("span", { className: "text-sm", children: "Gagal membuat pengumuman" })] }))] })] })] })), _jsxs(SectionCard, { palette: palette, className: "p-6", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[800px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left border-b", style: { borderColor: palette.white3 }, children: [_jsx("th", { className: "pb-3 font-medium", style: { color: palette.secondary }, children: "Judul" }), _jsx("th", { className: "pb-3 font-medium", style: { color: palette.secondary }, children: "Audiens" }), _jsx("th", { className: "pb-3 font-medium", style: { color: palette.secondary }, children: "Status" }), _jsx("th", { className: "pb-3 font-medium", style: { color: palette.secondary }, children: "Dijadwalkan" }), _jsx("th", { className: "pb-3 font-medium", style: { color: palette.secondary }, children: "Dibuat" }), _jsx("th", { className: "pb-3 font-medium text-right", style: { color: palette.secondary }, children: "Aksi" })] }) }), _jsxs("tbody", { children: [listQuery.isLoading && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-12 text-center", style: { color: palette.secondary }, children: "Memuat data pengumuman..." }) })), listQuery.isError && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-12", children: _jsxs("div", { className: "text-center space-y-2", children: [_jsxs("div", { className: "flex items-center justify-center gap-2 text-red-600", children: [_jsx(AlertTriangle, { size: 20 }), _jsx("span", { children: "Terjadi kesalahan saat memuat data" })] }), _jsx("button", { onClick: () => listQuery.refetch(), className: "text-sm underline", style: { color: palette.primary }, children: "Coba lagi" })] }) }) })), !listQuery.isLoading && items.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "py-12 text-center", style: { color: palette.secondary }, children: "Belum ada pengumuman. Buat pengumuman pertama Anda!" }) })), items.map((announcement) => (_jsxs("tr", { className: "border-b", style: { borderColor: palette.white3 }, children: [_jsx("td", { className: "py-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-medium mb-1", style: { color: palette.quaternary }, children: announcement.title }), announcement.content && (_jsxs("div", { className: "text-sm line-clamp-2", style: { color: palette.secondary }, children: [announcement.content.substring(0, 100), announcement.content.length > 100 && "..."] }))] }) }), _jsx("td", { className: "py-4", style: { color: palette.quaternary }, children: getAudienceLabel(announcement.audience) }), _jsxs("td", { className: "py-4", children: [announcement.status === "published" && (_jsx(Badge, { variant: "success", palette: palette, children: "Published" })), announcement.status === "scheduled" && (_jsx(Badge, { variant: "info", palette: palette, children: "Scheduled" })), announcement.status === "draft" && (_jsx(Badge, { variant: "outline", palette: palette, children: "Draft" })), announcement.status === "archived" && (_jsx(Badge, { variant: "secondary", palette: palette, children: "Archived" }))] }), _jsx("td", { className: "py-4 text-sm", style: { color: palette.quaternary }, children: formatDate(announcement.scheduled_at) }), _jsx("td", { className: "py-4 text-sm", style: { color: palette.quaternary }, children: formatDate(announcement.created_at) }), _jsx("td", { className: "py-4 text-right", children: _jsx("button", { onClick: () => openActionModal(announcement), className: "p-2 rounded-full transition-colors hover:bg-opacity-50", style: {
                                                                            backgroundColor: palette.white3,
                                                                            color: palette.secondary,
                                                                        }, children: _jsx(MoreVertical, { size: 16 }) }) })] }, announcement.id)))] })] }) }), _jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t", style: { borderColor: palette.white3 }, children: [_jsx("div", { className: "text-sm", style: { color: palette.secondary }, children: listQuery.isFetching
                                                    ? "Memperbarui..."
                                                    : `Menampilkan ${items.length} pengumuman` }), _jsx("button", { onClick: () => listQuery.refetch(), className: "text-sm underline", style: { color: palette.primary }, children: "Refresh" })] })] })] })] }), _jsx(ActionModal, { isOpen: actionModal.show, onClose: closeActionModal, announcement: actionModal.announcement, onPublish: publishMutation.mutate, onUnpublish: unpublishMutation.mutate, onDelete: deleteMutation.mutate, palette: palette })] }));
}
