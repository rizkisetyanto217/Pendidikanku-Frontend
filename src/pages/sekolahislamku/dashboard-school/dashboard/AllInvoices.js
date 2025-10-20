import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/tagihan/AllInvoices.tsx
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
import { ArrowLeft, Plus } from "lucide-react";
import Swal from "sweetalert2";
function toTagihan(b) {
    return {
        id: b.id,
        nama: b.title,
        jumlah: b.amount,
        status: b.status === "paid" ? "Lunas" : "Belum Lunas",
        tanggalJatuhTempo: new Date(b.dueDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }),
    };
}
const InvoiceModal = ({ open, onClose, palette, defaultValue, onSubmit, title, }) => {
    const [nama, setNama] = useState(defaultValue?.title ?? "");
    const [jumlah, setJumlah] = useState(defaultValue?.amount ?? 0);
    const [jatuhTempo, setJatuhTempo] = useState(defaultValue?.dueDate ? defaultValue.dueDate.slice(0, 10) : "");
    const [status, setStatus] = useState(defaultValue?.status ?? "unpaid");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setNama(defaultValue?.title ?? "");
        setJumlah(defaultValue?.amount ?? 0);
        setJatuhTempo(defaultValue?.dueDate ? defaultValue.dueDate.slice(0, 10) : "");
        setStatus(defaultValue?.status ?? "unpaid");
    }, [defaultValue, open]);
    if (!open)
        return null;
    const submit = async (e) => {
        e.preventDefault();
        if (!nama || !jatuhTempo) {
            Swal.fire({
                icon: "warning",
                title: "Lengkapi data",
                text: "Nama dan tanggal jatuh tempo wajib diisi.",
            });
            return;
        }
        setLoading(true);
        try {
            await onSubmit({
                id: defaultValue?.id,
                title: nama,
                amount: Number(jumlah) || 0,
                dueDate: new Date(jatuhTempo).toISOString(),
                status,
            });
            onClose();
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.35)" }, children: _jsxs("div", { className: "w-full max-w-lg rounded-2xl p-4 md:p-5", style: {
                background: palette.white2,
                color: palette.black1,
                border: `1px solid ${palette.silver1}`,
            }, children: [_jsx("div", { className: "mb-4", children: _jsx("h3", { className: "text-lg font-semibold", children: title }) }), _jsxs("form", { onSubmit: submit, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm", children: "Nama Tagihan" }), _jsx("input", { className: "mt-1 w-full h-10 rounded-xl px-3 text-sm", style: {
                                        background: palette.white1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, value: nama, onChange: (e) => setNama(e.target.value), placeholder: "Contoh: SPP September" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm", children: "Jumlah (Rp)" }), _jsx("input", { type: "number", className: "mt-1 w-full h-10 rounded-xl px-3 text-sm", style: {
                                        background: palette.white1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, value: jumlah, onChange: (e) => setJumlah(Number(e.target.value)), min: 0 })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm", children: "Jatuh Tempo" }), _jsx("input", { type: "date", className: "mt-1 w-full h-10 rounded-xl px-3 text-sm", style: {
                                        background: palette.white1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, value: jatuhTempo, onChange: (e) => setJatuhTempo(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm", children: "Status" }), _jsxs("select", { className: "mt-1 w-full h-10 rounded-xl px-3 text-sm", style: {
                                        background: palette.white1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, value: status, onChange: (e) => setStatus(e.target.value), children: [_jsx("option", { value: "unpaid", children: "Belum Lunas" }), _jsx("option", { value: "paid", children: "Lunas" }), _jsx("option", { value: "overdue", children: "Terlambat" })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [_jsx(Btn, { type: "button", variant: "white1", palette: palette, onClick: onClose, children: "Batal" }), _jsx(Btn, { type: "submit", palette: palette, disabled: loading, children: loading ? "Menyimpan..." : "Simpan" })] })] })] }) }));
};
/* ===== Table Header & Row ===== */
const TableHeader = ({ palette }) => (_jsx("thead", { children: _jsx("tr", { style: {
            background: palette.white1,
            borderBottom: `2px solid ${palette.silver1}`,
        }, children: ["No", "Nama Tagihan", "Jumlah", "Status", "Jatuh Tempo", "Aksi"].map((h, i) => (_jsx("th", { className: `p-3 border font-semibold ${i === 0 || i >= 3
                ? "text-center"
                : i === 2
                    ? "text-right"
                    : "text-left"}`, style: { borderColor: palette.silver1 }, children: h }, h))) }) }));
const Row = ({ tagihan, index, palette, onEdit, onDelete, }) => (_jsxs("tr", { style: { background: index % 2 === 0 ? palette.white1 : palette.white2 }, children: [_jsx("td", { className: "p-3 border text-center", style: { borderColor: palette.silver1 }, children: index + 1 }), _jsx("td", { className: "p-3 border font-medium", style: { borderColor: palette.silver1 }, children: tagihan.nama }), _jsxs("td", { className: "p-3 border text-right font-semibold", style: { borderColor: palette.silver1 }, children: ["Rp ", tagihan.jumlah.toLocaleString("id-ID")] }), _jsx("td", { className: "p-3 border text-center", style: { borderColor: palette.silver1 }, children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${tagihan.status === "Lunas"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"}`, children: tagihan.status }) }), _jsx("td", { className: "p-3 border text-center", style: { borderColor: palette.silver1 }, children: tagihan.tanggalJatuhTempo }), _jsx("td", { className: "p-3 border text-center", style: { borderColor: palette.silver1 }, children: _jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Btn, { size: "sm", variant: "ghost", palette: palette, onClick: () => onEdit(tagihan.id), children: "Edit" }), _jsx(Btn, { size: "sm", variant: "destructive", palette: palette, onClick: () => onDelete(tagihan.id), children: "Hapus" })] }) })] }));
/* ===== Ringkasan ===== */
const Total = ({ data, palette }) => {
    const totalBelum = data
        .filter((d) => d.status !== "Lunas")
        .reduce((n, d) => n + d.jumlah, 0);
    const totalSemua = data.reduce((n, d) => n + d.jumlah, 0);
    return (_jsxs(SectionCard, { palette: palette, className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Ringkasan Tagihan" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [_jsxs("div", { className: "p-3 rounded-lg", style: { background: palette.white1 }, children: [_jsx("p", { className: "text-sm opacity-90", style: { color: palette.black2 }, children: "Total Tagihan" }), _jsxs("p", { className: "text-xl font-bold", children: ["Rp ", totalSemua.toLocaleString("id-ID")] })] }), _jsxs("div", { className: "p-3 rounded-lg bg-red-50 text-center", children: [_jsx("p", { className: "text-sm text-red-600", children: "Belum Lunas" }), _jsxs("p", { className: "text-xl font-bold text-red-700", children: ["Rp ", totalBelum.toLocaleString("id-ID")] })] }), _jsxs("div", { className: "p-3 rounded-lg text-center", children: [_jsx("p", { className: "text-sm opacity-70", children: "Jumlah Tagihan" }), _jsxs("p", { className: "text-xl font-bold", children: [data.length, " item"] })] })] })] }));
};
/* ===== Page ===== */
export default function AllInvoices() {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const { state } = useLocation();
    const navigate = useNavigate();
    const initialBills = state?.bills ?? [];
    const [items, setItems] = useState(initialBills);
    useEffect(() => setItems(initialBills), [initialBills]);
    const tagihanList = useMemo(() => items.map(toTagihan), [items]);
    const currentDate = new Date().toISOString();
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selected, setSelected] = useState(null);
    const handleAdd = async (payload) => {
        const created = {
            id: payload.id ?? String(Date.now()),
            title: payload.title,
            amount: payload.amount,
            dueDate: payload.dueDate,
            status: payload.status,
        };
        setItems((prev) => [...prev, created]);
        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Tagihan berhasil ditambahkan.",
            timer: 1400,
            showConfirmButton: false,
        });
    };
    const openEditById = (id) => {
        const found = items.find((x) => x.id === id) ?? null;
        setSelected(found);
        setOpenEdit(true);
    };
    const handleEdit = async (payload) => {
        if (!selected)
            return;
        const id = selected.id;
        const updated = {
            id,
            title: payload.title,
            amount: payload.amount,
            dueDate: payload.dueDate,
            status: payload.status,
        };
        setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
        Swal.fire({
            icon: "success",
            title: "Tersimpan",
            text: "Perubahan tagihan berhasil disimpan.",
            timer: 1200,
            showConfirmButton: false,
        });
    };
    const handleDelete = async (id) => {
        const target = items.find((x) => x.id === id);
        if (!target)
            return;
        const res = await Swal.fire({
            title: "Hapus tagihan?",
            text: `Tagihan "${target.title}" akan dihapus.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#d33",
        });
        if (!res.isConfirmed)
            return;
        setItems((prev) => prev.filter((x) => x.id !== id));
        Swal.fire({
            icon: "success",
            title: "Terhapus",
            text: `Tagihan "${target.title}" telah dihapus.`,
            timer: 1200,
            showConfirmButton: false,
        });
    };
    return (_jsxs("div", { className: "min-h-screen w-full transition-colors duration-200", style: { background: palette.white2, color: palette.black1 }, children: [_jsx(ParentTopBar, { palette: palette, gregorianDate: currentDate, title: state?.heading ?? "Semua Tagihan", showBack: true }), _jsx(InvoiceModal, { open: openAdd, onClose: () => setOpenAdd(false), palette: palette, title: "Tambah Tagihan", onSubmit: handleAdd }), _jsx(InvoiceModal, { open: openEdit, onClose: () => {
                    setOpenEdit(false);
                    setSelected(null);
                }, palette: palette, defaultValue: selected ?? undefined, title: `Edit Tagihan${selected ? `: ${selected.title}` : ""}`, onSubmit: handleEdit }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "  md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: "Tagihan" })] }), _jsx("div", { className: "flex items-center justify-between", children: _jsx(Btn, { palette: palette, onClick: () => setOpenAdd(true), children: _jsx(Plus, {}) }) })] }), _jsx(Total, { data: tagihanList, palette: palette }), _jsxs(SectionCard, { palette: palette, className: "p-0 overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b", style: { borderColor: palette.silver1 }, children: [_jsx("h2", { className: "text-xl font-semibold", children: "Daftar Tagihan" }), _jsx("p", { className: "text-sm opacity-90 mt-1", children: "Berikut adalah daftar semua tagihan sekolah" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx(TableHeader, { palette: palette }), _jsx("tbody", { children: tagihanList.length > 0 ? (tagihanList.map((t, i) => (_jsx(Row, { tagihan: t, index: i, palette: palette, onEdit: openEditById, onDelete: handleDelete }, t.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "p-8 text-center opacity-60", style: { borderColor: palette.silver1 }, children: "Tidak ada tagihan yang ditemukan" }) })) })] }) })] })] })] }) })] }));
}
