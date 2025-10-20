import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/assignment/ModalAddAssignmentClass.tsx
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
export default function ModalAddAssignmentClass({ open, onClose, palette, onSubmit, }) {
    const [title, setTitle] = useState("");
    const [kelas, setKelas] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [total, setTotal] = useState(0);
    const dialogRef = useRef(null);
    // tutup dengan ESC
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center", style: { background: "#0006" }, onClick: (e) => e.target === e.currentTarget && onClose(), children: _jsxs("div", { ref: dialogRef, className: "w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden shadow-xl", style: {
                background: palette.white1,
                color: palette.black1,
            }, children: [_jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "font-semibold", children: "Tambah Tugas Kelas" }), _jsx("button", { onClick: onClose, className: "h-9 w-9 grid place-items-center rounded-xl", style: { border: `1px solid ${palette.silver1}` }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm block mb-1", children: "Judul Tugas" }), _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "contoh: Evaluasi Tajwid", className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm block mb-1", children: "Kelas (opsional)" }), _jsx("input", { value: kelas, onChange: (e) => setKelas(e.target.value), placeholder: "contoh: TPA A", className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm block mb-1", children: "Batas Pengumpulan" }), _jsx("input", { type: "datetime-local", value: dueDate, onChange: (e) => setDueDate(e.target.value), className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm block mb-1", children: "Total Target" }), _jsx("input", { type: "number", min: 0, value: total, onChange: (e) => setTotal(Number(e.target.value)), className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] })] }), _jsxs("div", { className: "px-4 py-3 border-t flex justify-end gap-2", style: { borderColor: palette.silver1 }, children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", onClick: () => {
                                if (!title.trim() || !dueDate)
                                    return;
                                onSubmit({
                                    title: title.trim(),
                                    kelas: kelas.trim() || undefined,
                                    dueDate: new Date(dueDate).toISOString(),
                                    total,
                                });
                                onClose();
                            }, children: "Simpan" })] })] }) }));
}
