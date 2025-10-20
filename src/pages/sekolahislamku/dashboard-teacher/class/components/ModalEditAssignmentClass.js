import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/assignment/ModalEditAssignmentClass.tsx
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
/* ============== Utils ============== */
const pad = (n) => n.toString().padStart(2, "0");
const isoToLocalInput = (iso) => {
    if (!iso)
        return "";
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const localToISO = (val) => val ? new Date(val).toISOString() : new Date().toISOString();
// heuristik sederhana: tentukan dark/light untuk <input type="datetime-local">
const isDarkPalette = (p) => {
    const hex = p.white1.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128;
};
const themeStyles = (p) => {
    const dark = isDarkPalette(p);
    return {
        dialog: { background: p.white1, color: p.black1 },
        border: { borderColor: p.silver1 },
        closeBtn: { border: `1px solid ${p.silver1}`, color: p.black2 },
        label: { color: p.black2 },
        field: {
            background: p.white2,
            color: p.black1,
            border: `1px solid ${p.silver1}`,
            colorScheme: dark ? "dark" : "light",
        },
    };
};
/* ============== Field (DRY) ============== */
function Field({ id, label, palette, children, }) {
    const s = themeStyles(palette);
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: id, className: "text-sm mb-1 block", style: s.label, children: label }), children({
                id,
                className: "w-full h-10 rounded-xl px-3 text-sm outline-none",
                style: s.field,
            })] }));
}
/* ============== Modal ============== */
export default function ModalEditAssignmentClass({ open, onClose, palette, defaultValues, onSubmit, }) {
    const [title, setTitle] = useState(defaultValues?.title ?? "");
    const [dueLocal, setDueLocal] = useState(isoToLocalInput(defaultValues?.dueDate));
    const [total, setTotal] = useState(defaultValues?.total ?? 0);
    const [submitted, setSubmitted] = useState(defaultValues?.submitted);
    // reset saat buka / ganti defaultValues
    useEffect(() => {
        if (!open)
            return;
        setTitle(defaultValues?.title ?? "");
        setDueLocal(isoToLocalInput(defaultValues?.dueDate));
        setTotal(defaultValues?.total ?? 0);
        setSubmitted(defaultValues?.submitted);
    }, [
        open,
        defaultValues?.title,
        defaultValues?.dueDate,
        defaultValues?.total,
        defaultValues?.submitted,
    ]);
    // ESC to close
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    const disabled = useMemo(() => !title.trim() || !dueLocal || total < 0 || (submitted ?? 0) < 0, [title, dueLocal, total, submitted]);
    const s = themeStyles(palette);
    const onOverlayClick = (e) => {
        if (e.target === e.currentTarget)
            onClose();
    };
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center", style: { background: "#0006" }, onClick: onOverlayClick, "aria-modal": "true", role: "dialog", children: _jsxs("div", { className: "w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden", style: s.dialog, children: [_jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between", style: s.border, children: [_jsx("div", { className: "font-semibold", children: "Edit Tugas" }), _jsx("button", { onClick: onClose, className: "h-9 w-9 grid place-items-center rounded-xl", style: s.closeBtn, "aria-label": "Tutup", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsx(Field, { id: "class-title", label: "Judul Tugas", palette: palette, children: (common) => (_jsx("input", { ...common, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "contoh: Evaluasi Wudhu" })) }), _jsx(Field, { id: "class-due", label: "Batas Pengumpulan", palette: palette, children: (common) => (_jsx("input", { ...common, type: "datetime-local", value: dueLocal, onChange: (e) => setDueLocal(e.target.value) })) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsx(Field, { id: "class-total", label: "Target Total", palette: palette, children: (common) => (_jsx("input", { ...common, type: "number", min: 0, value: total, onChange: (e) => setTotal(Number(e.target.value || 0)) })) }), _jsx(Field, { id: "class-submitted", label: "Terkumpul (opsional)", palette: palette, children: (common) => (_jsx("input", { ...common, type: "number", min: 0, value: submitted ?? "", onChange: (e) => setSubmitted(e.target.value === "" ? undefined : Number(e.target.value)) })) })] })] }), _jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-end gap-2", style: s.border, children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", disabled: disabled, onClick: () => {
                                if (disabled)
                                    return;
                                onSubmit({
                                    title: title.trim(),
                                    dueDate: localToISO(dueLocal),
                                    total: Number.isFinite(total) ? total : 0,
                                    submitted: submitted === undefined || Number.isNaN(submitted)
                                        ? undefined
                                        : submitted,
                                });
                            }, children: "Simpan" })] })] }) }));
}
