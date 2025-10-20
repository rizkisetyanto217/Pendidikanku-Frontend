import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/sekolahislamku/components/common/DeleteConfirm.tsx
import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
/* ========== Modal Konfirmasi Hapus ========== */
export function DeleteConfirmModal({ open, onClose, onConfirm, palette, title = "Konfirmasi Hapus", message = "Hapus item ini? Tindakan tidak dapat dibatalkan.", confirmLabel = "Hapus", cancelLabel = "Batal", loading = false, }) {
    // Esc to close + lock scroll
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50", onClick: onClose, style: { background: "rgba(0,0,0,0.35)" }, role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "mx-auto mt-24 w-[92%] max-w-md rounded-2xl shadow-lg", onClick: (e) => e.stopPropagation(), style: {
                background: palette.white1,
                color: palette.black1,
                border: `1px solid ${palette.silver1}`,
            }, children: [_jsxs("div", { className: "p-4 md:p-5 border-b flex items-center justify-between", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "font-semibold", children: title }), _jsx("button", { onClick: onClose, className: "rounded-xl p-2 hover:opacity-80", "aria-label": "Tutup", children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "p-4 md:p-5 text-sm", style: { color: palette.black2 }, children: message }), _jsxs("div", { className: "p-4 md:p-5 pt-0 flex items-center justify-end gap-2", children: [_jsx(Btn, { palette: palette, variant: "white1", size: "sm", onClick: onClose, disabled: loading, children: cancelLabel }), _jsxs(Btn, { palette: palette, variant: "destructive", size: "sm", onClick: onConfirm, disabled: loading, children: [_jsx(Trash2, { size: 16, className: "mr-1" }), loading ? "Menghapus…" : confirmLabel] })] })] }) }));
}
/* ========== Tombol + Modal Sekaligus ========== */
export function DeleteConfirmButton({ palette, onConfirm, title, message = "Hapus item ini? Tindakan tidak dapat dibatalkan.", confirmLabel = "Hapus", cancelLabel = "Batal", size = "sm", variant = "destructive", ariaLabel, children, }) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const handleConfirm = async () => {
        try {
            setBusy(true);
            await onConfirm();
            setOpen(false);
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Btn, { palette: palette, variant: variant, size: size, "aria-label": ariaLabel, onClick: () => setOpen(true), children: children ?? (_jsxs(_Fragment, { children: [_jsx(Trash2, { size: size === "icon" ? 16 : 14, className: size === "icon" ? "" : "mr-1" }), size === "icon" ? null : "Hapus"] })) }), _jsx(DeleteConfirmModal, { open: open, onClose: () => !busy && setOpen(false), onConfirm: handleConfirm, palette: palette, title: title, message: message, confirmLabel: confirmLabel, cancelLabel: cancelLabel, loading: busy })] }));
}
