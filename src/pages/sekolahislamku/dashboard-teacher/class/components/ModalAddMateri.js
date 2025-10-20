import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/components/dashboard/ModalAddMateri.tsx
import { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const ModalAddMateri = ({ open, onClose, onSubmit, palette, }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    if (!open)
        return null;
    return createPortal(_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative", style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Tambah Materi" }), _jsx("button", { onClick: onClose, children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Judul" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "w-full border rounded-lg px-3 py-2 text-sm", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                    }, placeholder: "Masukkan judul materi" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Deskripsi" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), className: "w-full border rounded-lg px-3 py-2 text-sm", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                    }, rows: 4, placeholder: "Masukkan deskripsi singkat" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx(Btn, { variant: "ghost", size: "sm", palette: palette, onClick: onClose, children: "Batal" }), _jsx(Btn, { size: "sm", palette: palette, onClick: () => {
                                onSubmit({ title, description });
                                setTitle("");
                                setDescription("");
                                onClose();
                            }, children: "Simpan" })] })] }) }), document.body);
};
export default ModalAddMateri;
