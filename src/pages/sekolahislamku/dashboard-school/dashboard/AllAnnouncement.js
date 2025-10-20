import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pengumuman/AllAnnouncement.tsx
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import Swal from "sweetalert2";
import InputField from "@/components/common/main/InputField";
/* =============== Badges kecil =============== */
const PriorityBadge = ({ prioritas, }) => {
    const style = prioritas === "Urgent"
        ? "bg-red-100 text-red-800 border-red-300 animate-pulse"
        : prioritas === "Tinggi"
            ? "bg-orange-100 text-orange-800 border-orange-300"
            : prioritas === "Sedang"
                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                : "bg-green-100 text-green-800 border-green-300";
    const icon = prioritas === "Urgent"
        ? "🚨"
        : prioritas === "Tinggi"
            ? "⚠️"
            : prioritas === "Sedang"
                ? "📌"
                : "📝";
    return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold border ${style}`, children: [_jsx("span", { children: icon }), prioritas] }));
};
const CategoryBadge = ({ kategori }) => {
    const style = kategori === "Tahfidz"
        ? "bg-green-100 text-green-800 border-green-300"
        : kategori === "Tahsin"
            ? "bg-blue-100 text-blue-800 border-blue-300"
            : kategori === "Kajian"
                ? "bg-purple-100 text-purple-800 border-purple-300"
                : "bg-gray-100 text-gray-800 border-gray-300";
    const icon = kategori === "Tahfidz"
        ? "📖"
        : kategori === "Tahsin"
            ? "🎵"
            : kategori === "Kajian"
                ? "🕌"
                : "📢";
    return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium border ${style}`, children: [_jsx("span", { children: icon }), kategori] }));
};
const StatusBadge = ({ status }) => {
    const style = status === "Aktif"
        ? "bg-green-100 text-green-800 border-green-300"
        : status === "Draft"
            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
            : "bg-gray-100 text-gray-800 border-gray-300";
    return (_jsx("span", { className: `px-2 py-1 rounded-full text-sm font-medium border ${style}`, children: status }));
};
const AnnouncementModal = ({ open, onClose, palette, title, defaultValue, onSubmit, }) => {
    const [judul, setJudul] = useState(defaultValue?.judul ?? "");
    const [konten, setKonten] = useState(defaultValue?.konten ?? "");
    const [kategori, setKategori] = useState(defaultValue?.kategori ?? "Umum");
    const [prioritas, setPrioritas] = useState(defaultValue?.prioritas ?? "Rendah");
    const [status, setStatus] = useState(defaultValue?.status ?? "Draft");
    const [tanggalPublish, setTanggalPublish] = useState(defaultValue?.tanggalPublish
        ? defaultValue.tanggalPublish.slice(0, 10)
        : new Date().toISOString().slice(0, 10));
    const [tanggalBerakhir, setTanggalBerakhir] = useState(defaultValue?.tanggalBerakhir
        ? defaultValue.tanggalBerakhir.slice(0, 10)
        : "");
    const [penulis, setPenulis] = useState(defaultValue?.penulis ?? "");
    const [target, setTarget] = useState((defaultValue?.target ?? []).join(", "));
    const [tags, setTags] = useState((defaultValue?.tags ?? []).join(", "));
    const [isPinned, setIsPinned] = useState(defaultValue?.isPinned ?? false);
    const [lampiran, setLampiran] = useState((defaultValue?.lampiran ?? []).join(", "));
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!open)
            return;
        setJudul(defaultValue?.judul ?? "");
        setKonten(defaultValue?.konten ?? "");
        setKategori(defaultValue?.kategori ?? "Umum");
        setPrioritas(defaultValue?.prioritas ?? "Rendah");
        setStatus(defaultValue?.status ?? "Draft");
        setTanggalPublish(defaultValue?.tanggalPublish
            ? defaultValue.tanggalPublish.slice(0, 10)
            : new Date().toISOString().slice(0, 10));
        setTanggalBerakhir(defaultValue?.tanggalBerakhir
            ? defaultValue.tanggalBerakhir.slice(0, 10)
            : "");
        setPenulis(defaultValue?.penulis ?? "");
        setTarget((defaultValue?.target ?? []).join(", "));
        setTags((defaultValue?.tags ?? []).join(", "));
        setIsPinned(defaultValue?.isPinned ?? false);
        setLampiran((defaultValue?.lampiran ?? []).join(", "));
    }, [open, defaultValue]);
    if (!open)
        return null;
    const submit = async (e) => {
        e.preventDefault();
        if (!judul || !konten) {
            Swal.fire({
                icon: "warning",
                title: "Lengkapi data",
                text: "Judul dan konten wajib diisi.",
            });
            return;
        }
        setLoading(true);
        try {
            await onSubmit({
                id: defaultValue?.id,
                judul,
                konten,
                kategori,
                prioritas,
                status,
                tanggalPublish: new Date(tanggalPublish).toISOString(),
                tanggalBerakhir: tanggalBerakhir
                    ? new Date(tanggalBerakhir).toISOString()
                    : undefined,
                penulis,
                target: target
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                lampiran: lampiran
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                views: defaultValue?.views ?? 0,
                isPinned,
                tags: tags
                    .split(",")
                    .map((s) => s.trim().replace(/^#/, ""))
                    .filter(Boolean),
            });
            onClose();
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.35)" }, "aria-modal": true, role: "dialog", children: _jsxs("div", { className: "w-full max-w-3xl max-h-[90vh] rounded-2xl", style: {
                background: palette.white2,
                color: palette.black1,
                border: `1px solid ${palette.silver1}`,
            }, children: [_jsx("div", { className: "sticky top-0 z-10 p-4 border-b rounded-xl", style: { background: palette.white2, borderColor: palette.silver1 }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: title }), _jsx(Btn, { variant: "white1", palette: palette, onClick: onClose, children: _jsx(X, {}) })] }) }), _jsx("form", { onSubmit: submit, className: "flex flex-col max-h-[calc(90vh-64px)]", children: _jsxs("div", { className: "flex-1 overflow-y-auto p-4 md:p-5 [-webkit-overflow-scrolling:touch]", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { className: "md:col-span-2", children: _jsx(InputField, { label: "Judul", name: "judul", value: judul, placeholder: "Judul pengumuman", onChange: (e) => setJudul(e.currentTarget.value) }) }), _jsx("div", { className: "md:col-span-2", children: _jsx(InputField, { label: "Konten", name: "konten", as: "textarea", rows: 5, value: konten, placeholder: "Isi pengumuman\u2026", onChange: (e) => setKonten(e.target.value) }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Kategori" }), _jsxs("select", { className: "w-full text-sm px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500", style: {
                                                    background: palette.white1,
                                                    borderColor: palette.silver1,
                                                    color: palette.black1,
                                                }, value: kategori, onChange: (e) => setKategori(e.target.value), children: [_jsx("option", { value: "Umum", children: "Umum" }), _jsx("option", { value: "Tahfidz", children: "Tahfidz" }), _jsx("option", { value: "Tahsin", children: "Tahsin" }), _jsx("option", { value: "Kajian", children: "Kajian" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Prioritas" }), _jsxs("select", { className: "w-full text-sm px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500", style: {
                                                    background: palette.white1,
                                                    borderColor: palette.silver1,
                                                    color: palette.black1,
                                                }, value: prioritas, onChange: (e) => setPrioritas(e.target.value), children: [_jsx("option", { value: "Rendah", children: "Rendah" }), _jsx("option", { value: "Sedang", children: "Sedang" }), _jsx("option", { value: "Tinggi", children: "Tinggi" }), _jsx("option", { value: "Urgent", children: "Urgent" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Status" }), _jsxs("select", { className: "w-full text-sm px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500", style: {
                                                    background: palette.white1,
                                                    borderColor: palette.silver1,
                                                    color: palette.black1,
                                                }, value: status, onChange: (e) => setStatus(e.target.value), children: [_jsx("option", { value: "Draft", children: "Draft" }), _jsx("option", { value: "Aktif", children: "Aktif" }), _jsx("option", { value: "Berakhir", children: "Berakhir" })] })] }), _jsx(InputField, { label: "Tanggal Publish", name: "tanggalPublish", type: "date", value: tanggalPublish, onChange: (e) => setTanggalPublish(e.currentTarget.value) }), _jsx(InputField, { label: "Tanggal Berakhir", name: "tanggalBerakhir", type: "date", value: tanggalBerakhir, onChange: (e) => setTanggalBerakhir(e.currentTarget.value) }), _jsx(InputField, { label: "Penulis", name: "penulis", value: penulis, placeholder: "Nama penulis", onChange: (e) => setPenulis(e.currentTarget.value) }), _jsxs("div", { className: "flex items-center gap-2 mt-6", children: [_jsx("input", { id: "isPinned", type: "checkbox", checked: isPinned, onChange: (e) => setIsPinned(e.target.checked) }), _jsx("label", { htmlFor: "isPinned", className: "text-sm", children: "Sematkan (Pinned)" })] }), _jsx("div", { className: "md:col-span-2", children: _jsx(InputField, { label: "Target (pisahkan dengan koma)", name: "target", value: target, placeholder: "Contoh: Wali Murid, Santri Kelas 7", onChange: (e) => setTarget(e.currentTarget.value) }) }), _jsx("div", { className: "md:col-span-2", children: _jsx(InputField, { label: "Tags (pisahkan dengan koma)", name: "tags", value: tags, placeholder: "contoh: ujian, tahfidz", onChange: (e) => setTags(e.currentTarget.value) }) }), _jsx("div", { className: "md:col-span-2", children: _jsx(InputField, { label: "Lampiran (opsional, pisahkan dengan koma atau unggah file)", name: "lampiran", value: lampiran, placeholder: "file1.pdf, link-gdrive, ...", onChange: (e) => setLampiran(e.currentTarget.value) }) })] }), _jsxs("div", { className: "sticky bottom-0 z-10 p-4 border-t flex justify-end gap-2\n                   pb-[env(safe-area-inset-bottom)] bg-clip-padding", style: {
                                    background: palette.white2,
                                    borderColor: palette.silver1,
                                    boxShadow: "0 -4px 10px rgba(0,0,0,0.04)",
                                }, children: [_jsx(Btn, { type: "button", variant: "white1", palette: palette, onClick: onClose, children: "Batal" }), _jsx(Btn, { type: "submit", palette: palette, disabled: loading, children: loading ? "Menyimpan..." : "Simpan" })] })] }) })] }) }));
};
/* =============== Card Pengumuman (dengan Aksi) =============== */
function PengumumanCard({ pengumuman, palette, onDetailClick, onEdit, onDelete, }) {
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("id-ID", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
    const truncate = (s, n = 150) => s.length <= n ? s : s.slice(0, n) + "…";
    const expSoon = (() => {
        if (!pengumuman.tanggalBerakhir)
            return false;
        const diffDays = Math.ceil((+new Date(pengumuman.tanggalBerakhir) - +new Date()) / 86400000);
        return diffDays <= 7 && diffDays > 0;
    })();
    return (_jsx(SectionCard, { palette: palette, className: `p-0 overflow-hidden transition-all duration-200 hover:shadow-lg ${pengumuman.isPinned ? "ring-2 ring-blue-200 bg-blue-50/50" : ""}`, children: _jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [pengumuman.isPinned && (_jsx("div", { className: "text-blue-600", title: "Disematkan", children: _jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M4 3a1 1 0 000 2h1.22l.305 1.222.01.042 1.358 5.43-.893.892C3.74 14.846 4.632 17 6.414 17H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l2-4A1 1 0 0016 9H6.28l-.22-.89A1 1 0 005 8H4a1 1 0 01-1-1V3z" }) }) })), _jsx(CategoryBadge, { kategori: pengumuman.kategori }), _jsx(PriorityBadge, { prioritas: pengumuman.prioritas }), _jsx(StatusBadge, { status: pengumuman.status })] }), expSoon && (_jsx("div", { className: "text-orange-600 text-sm font-medium px-2 py-1 bg-orange-100 rounded", children: "Akan berakhir" }))] }), _jsxs("div", { className: "mb-3", children: [_jsx("h3", { className: "text-lg font-semibold mb-1 line-clamp-2", children: pengumuman.judul }), _jsxs("div", { className: "flex items-center gap-4 text-sm opacity-70 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z", clipRule: "evenodd" }) }), _jsx("span", { children: pengumuman.penulis })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z", clipRule: "evenodd" }) }), _jsx("span", { children: formatDate(pengumuman.tanggalPublish) })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: [_jsx("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }), _jsx("path", { fillRule: "evenodd", d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z", clipRule: "evenodd" })] }), _jsxs("span", { children: [pengumuman.views, " views"] })] })] })] }), _jsx("p", { className: "text-sm leading-relaxed opacity-90 mb-4", children: truncate(pengumuman.konten) }), _jsxs("div", { className: "space-y-3 mb-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold opacity-60 mb-1", children: "TARGET PESERTA" }), _jsx("div", { className: "flex flex-wrap gap-1", children: pengumuman.target.map((t, i) => (_jsx("span", { className: "px-2 py-1 rounded text-sm", style: {
                                            background: palette.white1,
                                            border: `1px solid ${palette.silver1}`,
                                            color: palette.black1,
                                        }, children: t }, i))) })] }), pengumuman.tags.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold opacity-60 mb-1", children: "TAGS" }), _jsx("div", { className: "flex flex-wrap gap-1", children: pengumuman.tags.map((tag, i) => (_jsxs("span", { className: "px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800", children: ["#", tag] }, i))) })] }))] }), pengumuman.lampiran?.length ? (_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm font-semibold opacity-60 mb-2", children: "LAMPIRAN" }), _jsx("div", { className: "flex flex-wrap gap-2", children: pengumuman.lampiran.map((f, i) => (_jsxs("div", { className: "flex items-center gap-1 px-2 py-1 rounded text-sm", style: {
                                    background: palette.white1,
                                    border: `1px solid ${palette.silver1}`,
                                }, children: [_jsx("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z", clipRule: "evenodd" }) }), _jsx("span", { children: f })] }, i))) })] })) : null, _jsxs("div", { className: "flex items-center justify-between pt-4 border-t", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "text-sm opacity-60", children: pengumuman.tanggalBerakhir && (_jsxs("span", { children: ["Berakhir: ", formatDate(pengumuman.tanggalBerakhir)] })) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Btn, { size: "sm", variant: "white1", palette: palette, onClick: () => onEdit(pengumuman), children: "Edit" }), _jsx(Btn, { size: "sm", variant: "destructive", palette: palette, onClick: () => onDelete(pengumuman), children: "Hapus" }), _jsx("button", { onClick: () => onDetailClick(pengumuman), className: "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-80", style: { background: palette.black1, color: palette.white1 }, children: "Baca Selengkapnya" })] })] })] }) }));
}
/* =============== Search & Filter card =============== */
function SearchFilter({ palette, filters, onFiltersChange, }) {
    return (_jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-4 w-4 opacity-50", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", placeholder: "Cari pengumuman\u2026", value: filters.searchQuery, onChange: (e) => onFiltersChange({ searchQuery: e.target.value }), className: "w-full pl-10 pr-4 py-2 rounded-lg text-sm border focus:outline-none", style: {
                                background: palette.white1,
                                borderColor: palette.silver1,
                                color: palette.black1,
                            } })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-3", children: [_jsxs("select", { value: filters.kategori, onChange: (e) => onFiltersChange({ kategori: e.target.value }), className: "px-3 py-2 rounded-lg text-sm border outline-none", style: {
                                background: palette.white1,
                                borderColor: palette.silver1,
                                color: palette.black1,
                            }, children: [_jsx("option", { value: "", children: "Semua Kategori" }), _jsx("option", { value: "Tahfidz", children: "\uD83D\uDCD6 Tahfidz" }), _jsx("option", { value: "Tahsin", children: "\uD83C\uDFB5 Tahsin" }), _jsx("option", { value: "Kajian", children: "\uD83D\uDD4C Kajian" }), _jsx("option", { value: "Umum", children: "\uD83D\uDCE2 Umum" })] }), _jsxs("select", { value: filters.prioritas, onChange: (e) => onFiltersChange({ prioritas: e.target.value }), className: "px-3 py-2 rounded-lg text-sm border outline-none", style: {
                                background: palette.white1,
                                borderColor: palette.silver1,
                                color: palette.black1,
                            }, children: [_jsx("option", { value: "", children: "Semua Prioritas" }), _jsx("option", { value: "Urgent", children: "\uD83D\uDEA8 Urgent" }), _jsx("option", { value: "Tinggi", children: "\u26A0\uFE0F Tinggi" }), _jsx("option", { value: "Sedang", children: "\uD83D\uDCCC Sedang" }), _jsx("option", { value: "Rendah", children: "\uD83D\uDCDD Rendah" })] }), _jsxs("select", { value: filters.status, onChange: (e) => onFiltersChange({ status: e.target.value }), className: "px-3 py-2 rounded-lg text-sm border outline-none", style: {
                                background: palette.white1,
                                borderColor: palette.silver1,
                                color: palette.black1,
                            }, children: [_jsx("option", { value: "", children: "Semua Status" }), _jsx("option", { value: "Aktif", children: "Aktif" }), _jsx("option", { value: "Berakhir", children: "Berakhir" }), _jsx("option", { value: "Draft", children: "Draft" })] })] })] }) }));
}
/* =================== Main Page =================== */
const AllAnnouncement = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        kategori: "",
        prioritas: "",
        status: "",
        searchQuery: "",
    });
    // --- Sample data (silakan ganti dengan data asli)
    const pengumumanList = [
    // ... (data contohmu tetap sama persis) ...
    ];
    // State lokal untuk Add/Edit/Delete
    const [items, setItems] = useState(pengumumanList);
    // Jika pengumumanList dari luar berubah (mis: fetch), sinkronkan
    useEffect(() => setItems(pengumumanList), [
    /* tambahkan dep kalau sumbernya berubah */
    ]);
    const filteredPengumuman = useMemo(() => {
        return items
            .filter((p) => {
            const matchKat = !filters.kategori ||
                p.kategori === filters.kategori;
            const matchPri = !filters.prioritas ||
                p.prioritas === filters.prioritas;
            const matchSta = !filters.status || p.status === filters.status;
            const q = filters.searchQuery.toLowerCase();
            const matchQ = !q ||
                p.judul.toLowerCase().includes(q) ||
                p.konten.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q));
            return matchKat && matchPri && matchSta && matchQ;
        })
            .sort((a, b) => {
            if (a.isPinned !== b.isPinned)
                return a.isPinned ? -1 : 1;
            const order = {
                Urgent: 4,
                Tinggi: 3,
                Sedang: 2,
                Rendah: 1,
            };
            if (order[a.prioritas] !== order[b.prioritas])
                return order[b.prioritas] - order[a.prioritas];
            return +new Date(b.tanggalPublish) - +new Date(a.tanggalPublish);
        });
    }, [items, filters]);
    const handleFiltersChange = (f) => setFilters((prev) => ({ ...prev, ...f }));
    const handleDetailClick = (p) => console.log("Detail pengumuman:", p);
    const currentDate = new Date().toISOString();
    const stats = useMemo(() => ({
        total: items.length,
        aktif: items.filter((p) => p.status === "Aktif").length,
        tahfidz: items.filter((p) => p.kategori === "Tahfidz").length,
        tahsin: items.filter((p) => p.kategori === "Tahsin").length,
        kajian: items.filter((p) => p.kategori === "Kajian").length,
        urgent: items.filter((p) => p.prioritas === "Urgent").length,
    }), [items]);
    /* ========== Add / Edit / Delete Handlers ========== */
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selected, setSelected] = useState(null);
    const handleAddAnnouncement = async (payload) => {
        // API nyata:
        // const res = await axios.post<{ data: Pengumuman }>("/api/a/announcements", payload, { withCredentials: true });
        // const created = res.data.data;
        // Fallback lokal:
        const created = {
            ...payload,
            id: payload.id ?? Date.now(),
            views: payload.views ?? 0,
        };
        setItems((prev) => [created, ...prev]);
        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Pengumuman ditambahkan.",
            timer: 1400,
            showConfirmButton: false,
        });
    };
    const openEditAnnouncement = (p) => {
        setSelected(p);
        setOpenEdit(true);
    };
    const handleEditAnnouncement = async (payload) => {
        if (!selected)
            return;
        const id = selected.id;
        // API nyata:
        // const res = await axios.put<{ data: Pengumuman }>(`/api/a/announcements/${id}`, payload, { withCredentials: true });
        // const updated = res.data.data;
        // Fallback lokal:
        const updated = {
            ...payload,
            id,
            views: selected.views,
        };
        setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
        Swal.fire({
            icon: "success",
            title: "Tersimpan",
            text: "Pengumuman diperbarui.",
            timer: 1200,
            showConfirmButton: false,
        });
    };
    const handleDeleteAnnouncement = async (p) => {
        const res = await Swal.fire({
            title: "Hapus pengumuman?",
            text: `"${p.judul}" akan dihapus permanen.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#d33",
        });
        if (!res.isConfirmed)
            return;
        try {
            // API nyata:
            // await axios.delete(`/api/a/announcements/${p.id}`, { withCredentials: true });
            setItems((prev) => prev.filter((x) => x.id !== p.id));
            Swal.fire({
                icon: "success",
                title: "Terhapus",
                text: "Pengumuman telah dihapus.",
                timer: 1200,
                showConfirmButton: false,
            });
        }
        catch (e) {
            Swal.fire({
                icon: "error",
                title: "Gagal menghapus",
                text: e?.message ?? "Terjadi kesalahan.",
            });
        }
    };
    return (_jsxs("div", { className: "min-h-screen w-full transition-colors duration-200", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: currentDate, title: "Semua Pengumuman", showBack: true }), _jsx(AnnouncementModal, { open: openAdd, onClose: () => setOpenAdd(false), palette: palette, title: "Tambah Pengumuman", onSubmit: handleAddAnnouncement }), _jsx(AnnouncementModal, { open: openEdit, onClose: () => {
                    setOpenEdit(false);
                    setSelected(null);
                }, palette: palette, title: `Edit Pengumuman${selected ? `: ${selected.judul}` : ""}`, defaultValue: selected ?? undefined, onSubmit: handleEditAnnouncement }), _jsx("main", { className: "w-full px-4 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("div", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex items-start md:justify-between justify-start gap-6", children: [_jsx("div", { className: "text-left flex items-center gap-3", children: _jsxs("div", { className: "md:flex hidden items-center gap-3 mb-2", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), className: "inline-flex items-center ", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h1", { className: "text-lg font-semibold", children: "Pengumuman" })] }) }), _jsx(Btn, { className: "-ml-5 md:-ml-0", palette: palette, onClick: () => setOpenAdd(true), children: _jsx(Plus, { size: 20 }) })] }), _jsx(SearchFilter, { palette: palette, filters: filters, onFiltersChange: handleFiltersChange }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm opacity-90", style: { color: palette.black2 }, children: ["Menampilkan ", filteredPengumuman.length, " dari ", items.length, " ", "pengumuman"] }), (filters.kategori ||
                                            filters.prioritas ||
                                            filters.status ||
                                            filters.searchQuery) && (_jsx("button", { onClick: () => setFilters({
                                                kategori: "",
                                                prioritas: "",
                                                status: "",
                                                searchQuery: "",
                                            }), className: "text-sm text-blue-600 hover:text-blue-800 underline", children: "Reset Filter" }))] }), _jsx("div", { className: "space-y-4", children: filteredPengumuman.length ? (filteredPengumuman.map((p) => (_jsx(PengumumanCard, { pengumuman: p, palette: palette, onDetailClick: handleDetailClick, onEdit: openEditAnnouncement, onDelete: handleDeleteAnnouncement }, p.id)))) : (_jsx(SectionCard, { palette: palette, className: "p-12 text-center", children: _jsxs("div", { className: "opacity-60", children: [_jsx("svg", { className: "w-16 h-16 mx-auto mb-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("h3", { className: "text-lg font-semibold mb-2", style: { color: palette.black2 }, children: "Tidak Ada Pengumuman" }), _jsx("p", { className: "text-sm", style: { color: palette.black2 }, children: "Tidak ada pengumuman yang sesuai dengan filter yang dipilih." })] }) })) }), _jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsx("h3", { className: "font-semibold mb-3", children: "Aksi Cepat" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx("button", { className: "p-3 rounded-lg text-left transition-colors duration-200 hover:opacity-80", style: {
                                                        color: palette.black2,
                                                        background: palette.white1,
                                                        border: `1px solid ${palette.silver1}`,
                                                    }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-green-600", children: _jsx("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsxs("div", { style: { color: palette.black2 }, children: [_jsx("p", { className: "font-medium text-sm", style: { color: palette.black2 }, children: "Arsip Pengumuman" }), _jsx("p", { className: "text-sm opacity-90", style: { color: palette.black2 }, children: "Lihat pengumuman lama" })] })] }) }), _jsx("button", { className: "p-3 rounded-lg text-left transition-colors duration-200 hover:opacity-90", style: {
                                                        background: palette.white1,
                                                        border: `1px solid ${palette.silver1}`,
                                                    }, children: _jsxs("div", { className: "flex items-center gap-3", style: { color: palette.black2 }, children: [_jsx("div", { className: "text-blue-600", children: _jsx("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 001 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", style: { color: palette.black2 }, children: "Kategori Favorit" }), _jsx("p", { className: "text-sm opacity-90", style: { color: palette.black2 }, children: "Atur preferensi" })] })] }) }), _jsx("button", { className: "p-3 rounded-lg text-left transition-colors duration-200 hover:opacity-80", style: {
                                                        background: palette.white1,
                                                        border: `1px solid ${palette.silver1}`,
                                                    }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-purple-600", children: _jsx("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z", clipRule: "evenodd" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "Hubungi Admin" }), _jsx("p", { className: "text-sm opacity-90", style: { color: palette.black2 }, children: "Ada pertanyaan?" })] })] }) })] })] }), _jsx(SectionCard, { palette: palette, className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "text-blue-500 mt-1", children: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-1", children: "Informasi Penting" }), _jsx("p", { className: "text-sm opacity-90 leading-relaxed", children: "Pastikan Anda selalu memeriksa pengumuman terbaru setiap hari. Pengumuman dengan prioritas \"Urgent\" memerlukan perhatian segera. Untuk notifikasi lewat WhatsApp/email, hubungi administrasi." })] })] }) })] })] }) })] }));
};
export default AllAnnouncement;
