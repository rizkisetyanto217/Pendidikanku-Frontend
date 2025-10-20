import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X, UserPlus } from "lucide-react";
import { Btn, SectionCard, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { useState } from "react";
export default function AddStudent({ open, palette, classes, onClose }) {
    const [form, setForm] = useState({
        nis: "",
        name: "",
        class_name: "",
        gender: "", // "L" | "P"
        parent_name: "",
        phone: "",
        email: "",
        status: "aktif", // "aktif" | "nonaktif" | "alumni"
    });
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4", style: { background: "rgba(0,0,0,0.35)" }, role: "dialog", "aria-modal": "true", children: _jsxs(SectionCard, { palette: palette, className: "w-full max-w-2xl flex flex-col rounded-2xl shadow-2xl overflow-hidden", style: { background: palette.white1 }, children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b", style: { borderColor: palette.white3 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-9 w-9 rounded-xl flex items-center justify-center", style: { background: palette.white3, color: palette.quaternary }, children: _jsx(UserPlus, { size: 18 }) }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", style: { color: palette.quaternary }, children: "Tambah Siswa" }), _jsx("div", { className: "text-xs", style: { color: palette.secondary }, children: "Isi data siswa kemudian simpan." })] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg", "aria-label": "Tutup", style: { color: palette.secondary }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-4 max-h-[70vh]", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsx(Field, { label: "Nama*", value: form.name, onChange: (v) => setForm({ ...form, name: v }), palette: palette }), _jsx(Field, { label: "NIS", value: form.nis, onChange: (v) => setForm({ ...form, nis: v }), palette: palette }), _jsx(Field, { label: "Kelas*", type: "select", options: [
                                        { label: "Pilih Kelas", value: "" },
                                        ...classes.map((c) => ({ label: c, value: c })),
                                    ], value: form.class_name, onChange: (v) => setForm({ ...form, class_name: v }), palette: palette }), _jsx(Field, { label: "Jenis Kelamin", type: "select", options: [
                                        { label: "Tidak dipilih", value: "" },
                                        { label: "Laki-laki", value: "L" },
                                        { label: "Perempuan", value: "P" },
                                    ], value: form.gender, onChange: (v) => setForm({ ...form, gender: v }), palette: palette }), _jsx(Field, { label: "Nama Orang Tua/Wali", value: form.parent_name, onChange: (v) => setForm({ ...form, parent_name: v }), palette: palette }), _jsx(Field, { label: "No. HP", type: "tel", value: form.phone, onChange: (v) => setForm({ ...form, phone: v }), palette: palette }), _jsx(Field, { label: "Email", type: "email", value: form.email, onChange: (v) => setForm({ ...form, email: v }), palette: palette })] }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs", style: { color: palette.secondary }, children: "Status" }), _jsx("div", { className: "flex items-center gap-2 flex-wrap", children: ["aktif", "nonaktif", "alumni"].map((st) => (_jsx("button", { type: "button", onClick: () => setForm({ ...form, status: st }), className: "px-3 py-1 rounded-lg text-sm border", style: {
                                            borderColor: palette.white3,
                                            background: form.status === st ? palette.primary : palette.white1,
                                            color: form.status === st ? palette.white1 : palette.quaternary,
                                        }, children: st }, st))) })] })] }), _jsxs("div", { className: "px-4 py-3 flex items-center justify-end gap-2 border-t", style: { borderColor: palette.white3 }, children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", onClick: () => {
                                console.log("Simpan siswa (dummy):", form);
                                onClose();
                            }, children: "Simpan" })] })] }) }));
}
/* Field helper */
function Field({ label, value, onChange, palette, type = "text", options, }) {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs", style: { color: palette.secondary }, children: label }), type === "select" ? (_jsx("select", { value: value, onChange: (e) => onChange(e.target.value), className: "w-full rounded-xl px-3 py-2 outline-none border bg-transparent", style: {
                    borderColor: palette.white3,
                    background: palette.white1,
                    color: palette.quaternary,
                }, children: (options ?? []).map((op) => (_jsx("option", { value: op.value, children: op.label }, op.value))) })) : (_jsx("input", { value: value, onChange: (e) => onChange(e.target.value), type: type, className: "w-full rounded-xl px-3 py-2 outline-none border", style: {
                    borderColor: palette.white3,
                    background: palette.white1,
                    color: palette.quaternary,
                } }))] }));
}
