import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import { Upload, X, FileSpreadsheet } from "lucide-react";
const ALLOWED = [
    ".csv",
    ".xls",
    ".xlsx",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const UploadFileTeacher = ({ open, onClose, palette }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const inputRef = useRef(null);
    if (!open)
        return null;
    const handlePick = (f) => {
        if (!f) {
            setFile(null);
            setError("");
            return;
        }
        const ext = "." + (f.name.split(".").pop() || "").toLowerCase();
        const mimeOk = ALLOWED.includes(f.type);
        const extOk = ALLOWED.includes(ext);
        if (!mimeOk && !extOk) {
            setError("Format tidak didukung. Gunakan CSV atau Excel (xls/xlsx).");
            setFile(null);
            return;
        }
        setError("");
        setFile(f);
    };
    return (_jsx("div", { className: "fixed inset-0 z-[120] flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.35)" }, role: "dialog", "aria-modal": "true", children: _jsxs(SectionCard, { palette: palette, className: "w-full max-w-md p-0 overflow-hidden rounded-2xl", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b", style: { borderColor: palette.white3, background: palette.white1 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-8 w-8 rounded-xl flex items-center justify-center", style: { background: palette.white3, color: palette.black2 }, children: _jsx(Upload, { size: 16 }) }), _jsx("div", { className: "font-semibold", style: { color: palette.black2 }, children: "Import Guru" })] }), _jsx("button", { onClick: () => {
                                setFile(null);
                                setError("");
                                onClose();
                            }, className: "p-2 rounded-lg", "aria-label": "Tutup", style: { color: palette.black2 }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "px-4 py-5 space-y-4", children: [_jsxs("div", { className: "text-sm", style: { color: palette.black2 }, children: ["Format yang didukung: ", _jsx("b", { children: "CSV" }), " / ", _jsx("b", { children: "Excel" }), " (xls, xlsx)"] }), _jsxs("div", { className: "border rounded-xl px-4 py-8 text-center cursor-pointer", style: {
                                borderColor: palette.white3,
                                background: palette.white1,
                                color: palette.secondary,
                            }, onClick: () => inputRef.current?.click(), children: [_jsx("input", { ref: inputRef, type: "file", accept: ALLOWED.filter((x) => x.startsWith(".")).join(","), className: "hidden", onChange: (e) => handlePick(e.target.files?.[0] ?? null) }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(FileSpreadsheet, {}), _jsx("div", { className: "text-sm", style: { color: palette.black2 }, children: file ? file.name : "Klik untuk pilih file CSV/XLS/XLSX" })] })] }), error && (_jsx("div", { className: "text-xs p-2 rounded-lg", style: { background: palette.warning1, color: palette.warning1 }, children: error })), file && !error && (_jsxs("div", { className: "text-xs p-2 rounded-lg", style: { background: palette.white2, color: palette.quaternary }, children: [_jsxs("div", { children: [_jsx("b", { children: "Nama:" }), " ", file.name] }), _jsxs("div", { children: [_jsx("b", { children: "Ukuran:" }), " ", (file.size / 1024).toFixed(1), " KB"] }), _jsx("button", { className: "underline mt-1", onClick: () => handlePick(null), style: { color: palette.primary }, children: "Ganti file" })] }))] }), _jsxs("div", { className: "px-4 py-3 flex items-center justify-end gap-2 border-t", style: { borderColor: palette.white3, background: palette.white1 }, children: [_jsx(Btn, { palette: palette, variant: "ghost", size: "sm", onClick: () => {
                                setFile(null);
                                setError("");
                                onClose();
                            }, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", disabled: !file || !!error, onClick: () => {
                                // TODO: ganti dengan upload API sesungguhnya
                                console.log("Upload GURU (dummy):", file);
                                setFile(null);
                                onClose();
                            }, children: "Upload (dummy)" })] })] }) }));
};
export default UploadFileTeacher;
