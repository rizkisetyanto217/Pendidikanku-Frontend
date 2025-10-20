import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/academic/SchoolSubject.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// Theme & utils
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
// UI
import { SectionCard, Badge, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import ParentTopBar from "@/pages/sekolahislamku/components/home/ParentTopBar";
import ParentSidebar from "@/pages/sekolahislamku/components/home/ParentSideBar";
// Icons
import { ArrowLeft, Plus, Pencil, Trash2, Eye, X, } from "lucide-react";
/* ================== Utils ================== */
const atLocalNoon = (d) => {
    const x = new Date(d);
    x.setHours(12, 0, 0, 0);
    return x;
};
const toLocalNoonISO = (d) => atLocalNoon(d).toISOString();
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
/* ================= Modal Form ================= */
function SubjectFormModal({ open, palette, onClose, initial, onSave, }) {
    const isEdit = Boolean(initial);
    const [form, setForm] = useState({
        id: "",
        code: "",
        name: "",
        level: "",
        hours_per_week: 0,
        teacher_name: "",
        status: "active",
    });
    useEffect(() => {
        if (initial)
            setForm(initial);
        else
            setForm({
                id: "",
                code: "",
                name: "",
                level: "",
                hours_per_week: 0,
                teacher_name: "",
                status: "active",
            });
    }, [initial, open]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", style: { background: "rgba(0,0,0,.35)" }, children: _jsxs(SectionCard, { palette: palette, className: "w-full max-w-lg flex flex-col rounded-2xl shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b", children: [_jsx("h3", { className: "font-semibold", children: isEdit ? "Edit Mapel" : "Tambah Mapel" }), _jsx("button", { onClick: onClose, className: "p-1", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-[70vh]", children: [_jsx(Field, { label: "Kode", value: form.code, onChange: (v) => setForm({ ...form, code: v }) }), _jsx(Field, { label: "Nama Mapel", value: form.name, onChange: (v) => setForm({ ...form, name: v }) }), _jsx(Field, { label: "Level", value: form.level || "", onChange: (v) => setForm({ ...form, level: v }) }), _jsx(Field, { label: "Jam / Minggu", type: "number", value: String(form.hours_per_week ?? 0), onChange: (v) => setForm({ ...form, hours_per_week: Number(v) }) }), _jsx(Field, { label: "Pengampu", value: form.teacher_name || "", onChange: (v) => setForm({ ...form, teacher_name: v }) }), _jsxs("div", { children: [_jsx("label", { className: "text-sm", children: "Status" }), _jsxs("select", { value: form.status, onChange: (e) => setForm({ ...form, status: e.target.value }), className: "w-full rounded-lg border px-2 py-2 text-sm", children: [_jsx("option", { value: "active", children: "Aktif" }), _jsx("option", { value: "inactive", children: "Nonaktif" })] })] })] }), _jsxs("div", { className: "px-4 py-3 flex items-center justify-end gap-2 border-t", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: () => onSave({
                                ...form,
                                id: isEdit ? form.id : `sub-${Date.now()}`,
                            }), children: isEdit ? "Simpan" : "Tambah" })] })] }) }));
}
/* ================= Modal Detail ================= */
function SubjectDetailModal({ open, palette, subject, onClose, }) {
    if (!open || !subject)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[90] flex items-center justify-center p-4", style: { background: "rgba(0,0,0,.35)" }, children: _jsxs(SectionCard, { palette: palette, className: "w-full max-w-md rounded-2xl shadow-2xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b", children: [_jsx("h3", { className: "font-semibold", children: "Detail Mapel" }), _jsx("button", { onClick: onClose, className: "p-1", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "px-4 py-4 space-y-2 text-sm", children: [_jsx(InfoRow, { label: "Kode", value: subject.code }), _jsx(InfoRow, { label: "Nama", value: subject.name }), _jsx(InfoRow, { label: "Level", value: subject.level ?? "-" }), _jsx(InfoRow, { label: "Jam/Minggu", value: subject.hours_per_week ?? "-" }), _jsx(InfoRow, { label: "Pengampu", value: subject.teacher_name ?? "-" }), _jsx(InfoRow, { label: "Status", value: subject.status === "active" ? "Aktif" : "Nonaktif" })] })] }) }));
}
function InfoRow({ label, value }) {
    return (_jsxs("div", { className: "flex justify-between border-b py-1 text-sm", children: [_jsx("span", { className: "opacity-90", children: label }), _jsx("span", { children: value })] }));
}
function Field({ label, value, onChange, type = "text", }) {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-sm", children: label }), _jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), className: "w-full rounded-lg border px-3 py-2 text-sm" })] }));
}
/* ================== Page ================== */
const SchoolSubject = () => {
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const gregorianISO = toLocalNoonISO(new Date());
    // State modal
    const [openForm, setOpenForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [detailData, setDetailData] = useState(null);
    const [rows, setRows] = useState([]);
    // Dummy load
    const subjectsQ = useQuery({
        queryKey: ["subjects"],
        queryFn: async () => {
            const dummy = {
                list: [
                    { id: "1", code: "SBJ01", name: "Matematika", status: "active" },
                    {
                        id: "2",
                        code: "SBJ02",
                        name: "Bahasa Indonesia",
                        status: "inactive",
                    },
                ],
            };
            return dummy;
        },
    });
    useEffect(() => {
        if (subjectsQ.data) {
            setRows(subjectsQ.data.list);
        }
    }, [subjectsQ.data]);
    // Handlers
    const handleSave = (subject) => {
        setRows((prev) => {
            const exists = prev.find((x) => x.id === subject.id);
            if (exists)
                return prev.map((x) => (x.id === subject.id ? subject : x));
            return [...prev, subject];
        });
        setOpenForm(false);
        setEditData(null);
    };
    const handleDelete = (id) => {
        if (!confirm("Yakin hapus mapel ini?"))
            return;
        setRows((prev) => prev.filter((x) => x.id !== id));
    };
    return (_jsxs("div", { className: "min-h-screen w-full", style: { background: palette.white2 }, children: [_jsx(ParentTopBar, { palette: palette, title: "Mata Pelajaran", gregorianDate: gregorianISO, hijriDate: hijriLong(gregorianISO), showBack: true }), _jsx("main", { className: "w-full px-4 md:px-6 py-4 md:py-8", children: _jsxs("div", { className: "max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6", children: [_jsx("aside", { className: "w-full lg:w-64 xl:w-72 flex-shrink-0", children: _jsx(ParentSidebar, { palette: palette }) }), _jsxs("section", { className: "flex-1 flex flex-col space-y-6", children: [_jsxs("div", { className: " flex items-center justify-between", children: [_jsxs("div", { className: "  md:flex hidden items-center gap-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => navigate(-1), children: _jsx(ArrowLeft, { className: "cursor-pointer", size: 20 }) }), _jsx("h1", { className: "font-semibold text-lg", children: "Daftar Pelajaran" })] }), _jsxs(Btn, { palette: palette, size: "sm", className: "gap-1", onClick: () => setOpenForm(true), children: [_jsx(Plus, { size: 16 }), " Tambah"] })] }), _jsx(SectionCard, { palette: palette, children: _jsx("div", { className: "overflow-x-auto px-4 pb-4", children: _jsxs("table", { className: "w-full text-sm min-w-[820px]", children: [_jsx("thead", { style: { color: palette.silver2 }, children: _jsxs("tr", { className: "border-b", style: { borderColor: palette.silver1 }, children: [_jsx("th", { className: "py-2 pr-3", children: "Kode" }), _jsx("th", { className: "py-2 pr-3", children: "Nama" }), _jsx("th", { className: "py-2 pr-3", children: "Level" }), _jsx("th", { className: "py-2 pr-3", children: "Jam/Minggu" }), _jsx("th", { className: "py-2 pr-3", children: "Pengampu" }), _jsx("th", { className: "py-2 pr-3", children: "Status" }), _jsx("th", { className: "py-2 text-right", children: "Aksi" })] }) }), _jsxs("tbody", { children: [rows.map((r) => (_jsxs("tr", { className: "border-b", style: { borderColor: palette.silver1 }, children: [_jsx("td", { className: "py-2 pr-3", children: r.code }), _jsx("td", { className: "py-2 pr-3", children: r.name }), _jsx("td", { className: "py-2 pr-3", children: r.level }), _jsx("td", { className: "py-2 pr-3", children: r.hours_per_week }), _jsx("td", { className: "py-2 pr-3", children: r.teacher_name }), _jsx("td", { className: "py-2 pr-3", children: _jsx(Badge, { palette: palette, variant: r.status === "active" ? "success" : "outline", children: r.status === "active" ? "Aktif" : "Nonaktif" }) }), _jsx("td", { className: "py-2 text-right", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => setDetailData(r), children: _jsx(Eye, { size: 14 }) }), _jsx(Btn, { palette: palette, size: "sm", variant: "outline", onClick: () => {
                                                                                    setEditData(r);
                                                                                    setOpenForm(true);
                                                                                }, children: _jsx(Pencil, { size: 14 }) }), _jsx(Btn, { palette: palette, size: "sm", variant: "quaternary", onClick: () => handleDelete(r.id), children: _jsx(Trash2, { size: 14 }) })] }) })] }, r.id))), rows.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "py-6 text-center text-silver-500", children: "Tidak ada data." }) }))] })] }) }) })] })] }) }), _jsx(SubjectFormModal, { open: openForm, palette: palette, onClose: () => {
                    setOpenForm(false);
                    setEditData(null);
                }, initial: editData, onSave: handleSave }), _jsx(SubjectDetailModal, { open: !!detailData, palette: palette, subject: detailData, onClose: () => setDetailData(null) })] }));
};
export default SchoolSubject;
