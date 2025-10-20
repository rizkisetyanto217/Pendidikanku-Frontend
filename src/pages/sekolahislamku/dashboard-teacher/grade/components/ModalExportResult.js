import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
export default function ModalExportResult({ open, onClose, palette, defaultName = "rekap-penilaian", onExport, }) {
    const [filename, setFilename] = useState(defaultName);
    const [format, setFormat] = useState("xlsx");
    const [includeScores, setIncludeScores] = useState(true);
    const [file, setFile] = useState(null);
    useEffect(() => {
        if (!open)
            return;
        setFilename(defaultName);
        setFormat("xlsx");
        setIncludeScores(true);
        setFile(null);
    }, [open, defaultName]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center", onClick: (e) => {
            if (e.target === e.currentTarget)
                onClose();
        }, style: { background: "#0006" }, role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "w-full md:max-w-md rounded-t-2xl md:rounded-2xl overflow-hidden shadow-xl", style: {
                background: palette.white1,
                color: palette.black1,
                border: `1px solid ${palette.silver1}`,
            }, children: [_jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "font-semibold", children: "Export Hasil Penilaian" }), _jsx("button", { type: "button", onClick: (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onClose();
                            }, className: "h-9 w-9 grid place-items-center rounded-xl", style: {
                                border: `1px solid ${palette.silver1}`,
                                color: palette.black2,
                            }, "aria-label": "Tutup", children: _jsx(X, { size: 18 }) })] }), _jsxs("form", { encType: "multipart/form-data", onSubmit: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const fd = new FormData();
                        fd.append("filename", (filename || defaultName).trim());
                        fd.append("format", format);
                        fd.append("includeScores", includeScores ? "1" : "0");
                        if (file)
                            fd.append("attachment", file); // key: attachment
                        onExport(fd);
                    }, children: [_jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm mb-1 block", style: { color: palette.black2 }, children: "Nama berkas" }), _jsx("input", { value: filename, onChange: (e) => setFilename(e.target.value), className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            }, placeholder: "rekap-penilaian" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm mb-1 block", style: { color: palette.black2 }, children: "Format" }), _jsxs("select", { value: format, onChange: (e) => setFormat(e.target.value), className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            }, children: [_jsx("option", { value: "xlsx", children: "Excel (.xlsx)" }), _jsx("option", { value: "csv", children: "CSV (.csv)" }), _jsx("option", { value: "pdf", children: "PDF (.pdf)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm mb-1 block", style: { color: palette.black2 }, children: "Lampiran (opsional)" }), _jsx("input", { type: "file", onChange: (e) => setFile(e.target.files?.[0] ?? null), className: "block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border file:cursor-pointer rounded-xl", style: {
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                                background: palette.white2,
                                            }, 
                                            // sesuaikan ekstensi yang diizinkan:
                                            accept: ".xlsx,.csv,.pdf,.png,.jpg,.jpeg" }), file && (_jsxs("div", { className: "mt-1 text-xs", style: { color: palette.silver2 }, children: [file.name, " \u2014 ", (file.size / 1024).toFixed(1), " KB"] }))] }), _jsxs("label", { className: "flex items-center gap-2 text-sm", children: [_jsx("input", { type: "checkbox", checked: includeScores, onChange: (e) => setIncludeScores(e.target.checked) }), "Sertakan nilai siswa"] })] }), _jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-end gap-2", style: { borderColor: palette.silver1 }, children: [_jsx(Btn, { type: "button", palette: palette, variant: "ghost", onClick: (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose();
                                    }, children: "Batal" }), _jsxs(Btn, { type: "submit", palette: palette, children: [_jsx(Download, { size: 16, className: "mr-2" }), "Export"] })] })] })] }) }));
}
