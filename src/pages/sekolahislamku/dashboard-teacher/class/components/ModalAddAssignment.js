import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/assignment/ModalAddAssignment.tsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const ModalAddAssignment = ({ open, onClose, onSubmit, palette, }) => {
    const [title, setTitle] = useState("");
    const [kelas, setKelas] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [total, setTotal] = useState(0);
    if (!open)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !dueDate) {
            alert("Judul dan batas waktu wajib diisi.");
            return;
        }
        onSubmit({
            title: title.trim(),
            kelas: kelas.trim() || undefined,
            dueDate: new Date(dueDate).toISOString(),
            total,
        });
        // reset form
        setTitle("");
        setKelas("");
        setDueDate("");
        setTotal(0);
    };
    return createPortal(_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative", style: { color: palette.black1 }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Tambah Tugas" }), _jsx("button", { onClick: onClose, className: "p-1 rounded-full hover:bg-gray-100", "aria-label": "Tutup", children: _jsx(X, { size: 20 }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Judul Tugas" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full rounded-lg border px-3 h-10 text-sm", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                        color: palette.black1,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Kelas (opsional)" }), _jsx("input", { type: "text", value: kelas, onChange: (e) => setKelas(e.target.value), className: "w-full rounded-lg border px-3 h-10 text-sm", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                        color: palette.black1,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Batas Waktu" }), _jsx("input", { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value), className: "w-full rounded-lg border px-3 h-10 text-sm", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                        color: palette.black1,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Total Siswa" }), _jsx("input", { type: "number", min: 0, value: total, onChange: (e) => setTotal(Number(e.target.value)), className: "w-full rounded-lg border px-3 h-10 text-sm", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                        color: palette.black1,
                                    } })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-3", children: [_jsx(Btn, { palette: palette, variant: "ghost", size: "sm", onClick: onClose, type: "button", children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", type: "submit", children: "Simpan" })] })] })] }) }), document.body);
};
export default ModalAddAssignment;
