import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/ModalEditClassMateri.tsx
import { useEffect, useMemo, useState } from "react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const defaultInput = {
    id: "",
    title: "",
    description: "",
    type: "pdf",
    attachments: [],
    author: "",
};
export default function ModalEditClassMateri({ open, onClose, onSubmit, palette, initial, }) {
    const [form, setForm] = useState(defaultInput);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (open) {
            setForm({
                ...defaultInput,
                ...(initial ?? {}),
                // safety: attachments paling tidak array
                attachments: Array.isArray(initial?.attachments)
                    ? initial.attachments
                    : [],
            });
            setErrors({});
        }
    }, [open, initial]);
    const disabled = useMemo(() => !form.title.trim(), [form.title]);
    const handleChange = (key, value) => {
        setForm((f) => ({ ...f, [key]: value }));
    };
    const handleAttachmentChange = (idx, key, value) => {
        setForm((f) => {
            const next = [...(f.attachments ?? [])];
            next[idx] = { ...next[idx], [key]: value };
            return { ...f, attachments: next };
        });
    };
    const handleAddAttachment = () => {
        setForm((f) => ({
            ...f,
            attachments: [...(f.attachments ?? []), { name: "", url: "" }],
        }));
    };
    const handleRemoveAttachment = (idx) => {
        setForm((f) => {
            const next = [...(f.attachments ?? [])];
            next.splice(idx, 1);
            return { ...f, attachments: next };
        });
    };
    const validate = () => {
        const e = {};
        if (!form.title.trim())
            e.title = "Judul tidak boleh kosong.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate())
            return;
        onSubmit({
            id: form.id, // penting untuk replace item
            title: form.title.trim(),
            description: form.description?.trim(),
            type: form.type,
            attachments: form.attachments?.map((a) => ({
                name: (a.name ?? "").trim(),
                url: (a.url ?? "").trim() || undefined,
            })),
            author: form.author?.trim(),
        });
    };
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", children: [_jsx("div", { className: "absolute inset-0", style: { background: "rgba(0,0,0,0.4)" }, onClick: onClose }), _jsx("div", { className: "relative w-full max-w-xl rounded-2xl shadow-xl overflow-hidden", style: {
                    background: palette.white1,
                    border: `1px solid ${palette.silver1}`,
                }, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "px-5 py-4 border-b flex items-center justify-between", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "font-semibold text-lg", style: { color: palette.black1 }, children: "Edit Materi" }), _jsx("button", { type: "button", onClick: onClose, className: "text-sm p-2 rounded-xl border ", style: { color: palette.black2, borderColor: palette.silver1 }, children: "Tutup" })] }), _jsxs("div", { className: "px-5 py-4 space-y-4 max-h-[70vh] overflow-auto", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-sm font-medium", style: { color: palette.black1 }, children: ["Judul ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { value: form.title, onChange: (e) => handleChange("title", e.target.value), placeholder: "Judul materi\u2026", className: "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none", style: {
                                                borderColor: errors.title ? "#ef4444" : palette.silver1,
                                                background: palette.white1,
                                                color: palette.black1,
                                            } }), errors.title && (_jsx("div", { className: "mt-1 text-xs", style: { color: "#ef4444" }, children: errors.title }))] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", style: { color: palette.black1 }, children: "Deskripsi" }), _jsx("textarea", { value: form.description ?? "", onChange: (e) => handleChange("description", e.target.value), placeholder: "Deskripsi singkat materi\u2026", className: "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none", rows: 3, style: {
                                                borderColor: palette.silver1,
                                                background: palette.white1,
                                                color: palette.black2,
                                            } })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", style: { color: palette.black1 }, children: "Tipe Materi" }), _jsxs("select", { value: form.type, onChange: (e) => handleChange("type", e.target.value), className: "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                        color: palette.black1,
                                                    }, children: [_jsx("option", { value: "pdf", children: "PDF" }), _jsx("option", { value: "doc", children: "Dokumen" }), _jsx("option", { value: "ppt", children: "Presentasi" }), _jsx("option", { value: "video", children: "Video" }), _jsx("option", { value: "link", children: "Tautan" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", style: { color: palette.black1 }, children: "Penulis / Pengunggah" }), _jsx("input", { value: form.author ?? "", onChange: (e) => handleChange("author", e.target.value), placeholder: "Nama pengunggah\u2026", className: "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none", style: {
                                                        borderColor: palette.silver1,
                                                        background: palette.white1,
                                                        color: palette.black1,
                                                    } })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm font-medium", style: { color: palette.black1 }, children: "Lampiran" }), _jsx(Btn, { type: "button", 
                                                    //   size="xs"
                                                    variant: "outline", palette: palette, onClick: handleAddAttachment, children: "+ Tambah Lampiran" })] }), _jsxs("div", { className: "mt-2 space-y-2", children: [(form.attachments ?? []).length === 0 && (_jsx("div", { className: "text-xs", style: { color: palette.silver2 }, children: "Belum ada lampiran." })), (form.attachments ?? []).map((att, idx) => (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-2 items-center", children: [_jsx("input", { value: att.name ?? "", onChange: (e) => handleAttachmentChange(idx, "name", e.target.value), placeholder: "Nama file/tautan", className: "md:col-span-2 rounded-lg border px-3 py-2 text-sm outline-none", style: {
                                                                borderColor: palette.silver1,
                                                                background: palette.white1,
                                                                color: palette.black1,
                                                            } }), _jsx("input", { value: att.url ?? "", onChange: (e) => handleAttachmentChange(idx, "url", e.target.value), placeholder: "URL (opsional)", className: "md:col-span-3 rounded-lg border px-3 py-2 text-sm outline-none", style: {
                                                                borderColor: palette.silver1,
                                                                background: palette.white1,
                                                                color: palette.black1,
                                                            } })] }, idx)))] })] })] }), _jsxs("div", { className: "px-5 py-4 border-t flex items-center justify-end gap-2", style: { borderColor: palette.silver1 }, children: [_jsx(Btn, { type: "button", variant: "outline", size: "sm", palette: palette, onClick: onClose, children: "Batal" }), _jsx(Btn, { type: "submit", size: "sm", palette: palette, disabled: disabled, children: "Simpan Perubahan" })] })] }) })] }));
}
