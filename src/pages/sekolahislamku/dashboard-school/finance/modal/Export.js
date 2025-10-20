import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/finance/modal/Export.tsx
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, UploadCloud, File as FileIcon, Trash2 } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const Export = ({ open, onClose, palette, onSubmit, accept = ".xlsx,.csv,.pdf", maxSizeMB = 10, }) => {
    const [month, setMonth] = useState("");
    const [format, setFormat] = useState("xlsx");
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);
    const maxBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);
    if (!open)
        return null;
    const handleFiles = (f) => {
        if (!f)
            return;
        if (f.size > maxBytes) {
            alert(`Ukuran file > ${maxSizeMB}MB`);
            return;
        }
        if (accept &&
            !accept
                .split(",")
                .some((ext) => f.name.toLowerCase().endsWith(ext.trim().toLowerCase()))) {
            alert(`Tipe file tidak didukung. Boleh: ${accept}`);
            return;
        }
        setFile(f);
    };
    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const f = e.dataTransfer?.files?.[0];
        handleFiles(f ?? undefined);
    };
    const submitUIOnly = () => {
        const payload = { month, format, file };
        if (onSubmit)
            onSubmit(payload);
        else
            console.log("Export UI payload:", payload);
        onClose();
    };
    return createPortal(_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-3", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "w-full max-w-md rounded-2xl shadow-xl p-6 space-y-5", style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Export / Upload Data" }), _jsx("button", { onClick: onClose, className: "p-1 rounded hover:opacity-70", "aria-label": "Tutup", style: { background: palette.white3 }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Periode Bulan" }), _jsx("input", { type: "month", value: month, onChange: (e) => setMonth(e.target.value), className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Format Export" }), _jsxs("select", { value: format, onChange: (e) => setFormat(e.target.value), className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                    }, children: [_jsx("option", { value: "xlsx", children: "Excel (.xlsx)" }), _jsx("option", { value: "csv", children: "CSV (.csv)" }), _jsx("option", { value: "pdf", children: "PDF (.pdf)" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm", children: "Upload File (opsional)" }), !file ? (_jsxs("div", { onDragOver: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDragging(true);
                            }, onDragLeave: () => setIsDragging(false), onDrop: onDrop, onClick: () => inputRef.current?.click(), className: `rounded-2xl border px-4 py-6 text-center cursor-pointer transition
                ${isDragging ? "ring-2" : ""}`, style: {
                                borderColor: isDragging ? palette.primary : palette.silver1,
                                background: palette.white2,
                            }, "aria-label": "Drop file di sini atau klik untuk memilih", children: [_jsx("div", { className: "mx-auto mb-2 w-10 h-10 rounded-full grid place-items-center", children: _jsx(UploadCloud, { size: 22 }) }), _jsx("p", { className: "text-sm", children: "Tarik & letakkan file di sini" }), _jsxs("p", { className: "text-xs opacity-70 mt-1", children: ["atau klik untuk memilih. Boleh: ", accept, " \u2022 Maks ", maxSizeMB, "MB"] }), _jsx("input", { ref: inputRef, type: "file", accept: accept, className: "hidden", onChange: (e) => handleFiles(e.target.files?.[0]) })] })) : (_jsxs("div", { className: "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3", style: {
                                borderColor: palette.silver1,
                                background: palette.white2,
                            }, children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx(FileIcon, { size: 18 }), _jsxs("div", { className: "truncate", children: [_jsx("div", { className: "text-sm truncate", children: file.name }), _jsxs("div", { className: "text-xs opacity-70", children: [(file.size / (1024 * 1024)).toFixed(2), " MB"] })] })] }), _jsx("button", { type: "button", onClick: () => setFile(null), className: "p-1 rounded hover:opacity-70", "aria-label": "Hapus file", title: "Hapus file", children: _jsx(Trash2, { size: 16 }) })] }))] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Btn, { palette: palette, variant: "secondary", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: submitUIOnly, children: file ? "Upload & Proses" : "Export" })] })] }) }), document.body);
};
export default Export;
