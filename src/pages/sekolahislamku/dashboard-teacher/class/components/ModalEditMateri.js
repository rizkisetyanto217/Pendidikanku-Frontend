import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const isoOnlyDate = (iso) => {
    if (!iso)
        return "";
    // jika ada waktu → strip jadi yyyy-mm-dd
    const d = new Date(iso);
    if (Number.isNaN(d.getTime()))
        return iso.slice(0, 10);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
};
export default function ModalEditMateri({ open, onClose, palette, defaultValues, onSubmit, onDelete, }) {
    const [title, setTitle] = useState(defaultValues?.title ?? "");
    const [date, setDate] = useState(isoOnlyDate(defaultValues?.date) ?? "");
    const [attachments, setAttachments] = useState(defaultValues?.attachments ?? 0);
    const [content, setContent] = useState(defaultValues?.content ?? "");
    const titleRef = useRef(null);
    // Reset form saat modal dibuka
    useEffect(() => {
        if (!open)
            return;
        setTitle(defaultValues?.title ?? "");
        setDate(isoOnlyDate(defaultValues?.date) ?? "");
        setAttachments(typeof defaultValues?.attachments === "number"
            ? defaultValues.attachments
            : 0);
        setContent(defaultValues?.content ?? "");
        // fokuskan ke judul
        setTimeout(() => titleRef.current?.focus(), 0);
    }, [
        open,
        defaultValues?.title,
        defaultValues?.date,
        defaultValues?.attachments,
        defaultValues?.content,
    ]);
    // Tutup dengan ESC
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    const isValid = useMemo(() => title.trim().length > 0, [title]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid)
            return;
        onSubmit({
            title: title.trim(),
            date: date || new Date().toISOString().slice(0, 10),
            attachments: attachments === "" ? 0 : Number(attachments),
            content: content?.trim() || undefined,
        });
    };
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-end sm:items-center justify-center", "aria-modal": "true", role: "dialog", onClick: (e) => {
            // klik overlay untuk tutup
            if (e.target === e.currentTarget)
                onClose();
        }, style: { background: "rgba(15, 23, 42, 0.35)" }, children: _jsxs("div", { className: "w-full sm:max-w-lg sm:rounded-2xl sm:shadow-xl sm:mx-4 overflow-hidden", style: {
                background: palette.white1,
                color: palette.black1,
                border: `1px solid ${palette.silver1}`,
            }, children: [_jsxs("div", { className: "px-4 py-3 flex items-center justify-between border-b", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "font-semibold", children: "Edit Materi" }), _jsx("button", { onClick: onClose, className: "p-1 rounded hover:opacity-80", "aria-label": "Tutup", title: "Tutup", children: _jsx(X, { size: 18 }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-4 space-y-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", htmlFor: "materi-title", children: "Judul Materi" }), _jsx("input", { id: "materi-title", ref: titleRef, value: title, onChange: (e) => setTitle(e.target.value), className: "h-10 w-full rounded-xl px-3 text-sm outline-none", placeholder: "Mis. Pengenalan Huruf Hijaiyah", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, required: true })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", htmlFor: "materi-date", children: "Tanggal" }), _jsx("input", { id: "materi-date", type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "h-10 w-full rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", htmlFor: "materi-attachments", children: "Jumlah Lampiran" }), _jsx("input", { id: "materi-attachments", type: "number", min: 0, value: attachments, onChange: (e) => {
                                        const v = e.target.value;
                                        setAttachments(v === "" ? "" : Math.max(0, Number(v)));
                                    }, className: "h-10 w-full rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm", htmlFor: "materi-content", children: "Konten Materi" }), _jsx("textarea", { id: "materi-content", value: content, onChange: (e) => setContent(e.target.value), rows: 6, className: "w-full rounded-xl px-3 py-2 text-sm outline-none resize-y", placeholder: "Tulis ringkasan/poin materi di sini\u2026", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { className: "pt-2 flex items-center justify-between", children: [onDelete ? (_jsx(Btn, { palette: palette, variant: "destructive", type: "button", onClick: onDelete, children: "Hapus" })) : (_jsx("span", {})), _jsxs("div", { className: "flex gap-2", children: [_jsx(Btn, { palette: palette, variant: "white1", type: "button", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, type: "submit", disabled: !isValid, children: "Simpan" })] })] })] })] }) }));
}
