import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/assignment/ModalEditAssignment.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
/** Helper: ISO -> value input type="datetime-local" (tanpa timezone) */
const isoToLocalInput = (iso) => {
    if (!iso)
        return "";
    const d = new Date(iso);
    const pad = (n) => n.toString().padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};
/** Helper: value input "yyyy-MM-ddTHH:mm" -> ISO */
const localInputToISO = (val) => {
    // treat as local time
    if (!val)
        return new Date().toISOString();
    const d = new Date(val);
    // menjaga agar dianggap local; new Date(val) sudah local
    return d.toISOString();
};
export default function ModalEditAssignment({ open, onClose, palette, defaultValues, onSubmit, onDelete, }) {
    const [title, setTitle] = useState(defaultValues?.title ?? "");
    const [kelas, setKelas] = useState(defaultValues?.kelas ?? "");
    const [dueLocal, setDueLocal] = useState(isoToLocalInput(defaultValues?.dueDate));
    const [total, setTotal] = useState(defaultValues?.total ?? 0);
    const [submitted, setSubmitted] = useState(defaultValues?.submitted);
    // Reset saat open berubah (prefill ulang ketika edit item berbeda)
    useEffect(() => {
        if (!open)
            return;
        setTitle(defaultValues?.title ?? "");
        setKelas(defaultValues?.kelas ?? "");
        setDueLocal(isoToLocalInput(defaultValues?.dueDate));
        setTotal(defaultValues?.total ?? 0);
        setSubmitted(defaultValues?.submitted);
    }, [
        open,
        defaultValues?.title,
        defaultValues?.kelas,
        defaultValues?.dueDate,
        defaultValues?.total,
        defaultValues?.submitted,
    ]);
    // Esc to close
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    const dialogRef = useRef(null);
    const onOverlayClick = (e) => {
        if (e.target === e.currentTarget)
            onClose();
    };
    const disabled = useMemo(() => {
        return !title.trim() || !dueLocal || total < 0 || (submitted ?? 0) < 0;
    }, [title, dueLocal, total, submitted]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center", onClick: onOverlayClick, style: { background: "#0006" }, "aria-modal": "true", role: "dialog", children: _jsxs("div", { ref: dialogRef, className: "w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden shadow-xl", style: {
                background: palette.white1,
                color: palette.black1,
            }, children: [_jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between", style: {
                        borderColor: palette.silver2 ?? palette.silver1,
                    }, children: [_jsx("div", { className: "font-semibold", children: "Edit Tugas" }), _jsx("button", { "aria-label": "Tutup", onClick: onClose, className: "h-9 w-9 grid place-items-center rounded-xl", style: {
                                border: `1px solid ${palette.silver1}`,
                                color: palette.black2,
                            }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "p-4 space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm mb-1 block", style: { color: palette.black2 }, children: "Judul Tugas" }), _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "contoh: Evaluasi Wudhu", className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm mb-1 block", style: { color: palette.black2 }, children: "Kelas (opsional)" }), _jsx("input", { value: kelas, onChange: (e) => setKelas(e.target.value), placeholder: "contoh: TPA A", className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm mb-1 block", style: { color: palette.black2 }, children: "Batas Pengumpulan" }), _jsx("input", { type: "datetime-local", value: dueLocal, onChange: (e) => setDueLocal(e.target.value), className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    } })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm mb-1 block", style: { color: palette.black2 }, children: "Total (target pengumpulan)" }), _jsx("input", { type: "number", min: 0, value: total, onChange: (e) => setTotal(Number(e.target.value || 0)), className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm mb-1 block", style: { color: palette.black2 }, children: "Terkumpul (opsional)" }), _jsx("input", { type: "number", min: 0, value: submitted ?? "", onChange: (e) => setSubmitted(e.target.value === "" ? undefined : Number(e.target.value)), className: "w-full h-10 rounded-xl px-3 text-sm outline-none", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            } })] })] })] }), _jsxs("div", { className: "px-4 py-3 border-t flex items-center justify-between gap-2", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "flex gap-2", children: onDelete ? (_jsx(Btn, { palette: palette, size: "sm", variant: "quaternary", onClick: onDelete, children: "Hapus" })) : null }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", onClick: () => {
                                        if (disabled)
                                            return;
                                        onSubmit({
                                            title: title.trim(),
                                            kelas: kelas.trim() || undefined,
                                            dueDate: localInputToISO(dueLocal),
                                            total: Number.isFinite(total) ? total : 0,
                                            submitted: submitted === undefined || Number.isNaN(submitted)
                                                ? undefined
                                                : submitted,
                                        });
                                    }, children: "Simpan Perubahan" })] })] })] }) }));
}
