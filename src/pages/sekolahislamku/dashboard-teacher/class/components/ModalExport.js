import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/components/ModalExport.tsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const ModalExport = ({ open, onClose, onSubmit, palette, }) => {
    const [file, setFile] = useState(null);
    if (!open)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsxs("div", { className: "relative bg-white rounded-xl p-6 w-full max-w-md z-10 shadow-lg", style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "font-semibold text-lg", children: "Upload CSV" }), _jsx("button", { onClick: onClose, children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("input", { type: "file", accept: ".csv", onChange: (e) => {
                                    if (e.target.files?.[0]) {
                                        setFile(e.target.files[0]);
                                    }
                                }, className: "w-full border rounded-lg p-2 text-sm", style: { borderColor: palette.silver1 } }), file && (_jsxs("div", { className: "text-xs text-gray-500", children: ["File dipilih: ", file.name] }))] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", onClick: () => {
                                    if (file) {
                                        onSubmit(file);
                                        setFile(null);
                                    }
                                    else {
                                        alert("Pilih file terlebih dahulu!");
                                    }
                                }, children: "Upload" })] })] })] }), document.body);
};
export default ModalExport;
