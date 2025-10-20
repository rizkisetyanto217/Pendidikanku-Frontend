import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/teacher/components/ModalAddStudent.tsx
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
function slugify(s) {
    return (s ?? "")
        .toLowerCase()
        .trim()
        .replace(/[_—–]/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}
export default function ModalAddStudent({ open, onClose, palette, onSubmit, initial, title = "Tambah Siswa", }) {
    const [name, setName] = useState(initial?.name ?? "");
    const [nis, setNis] = useState(initial?.nis ?? "");
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState(null);
    const inputRef = useRef(null);
    // Reset saat modal dibuka + fokus input + lock scroll body
    useEffect(() => {
        if (!open)
            return;
        setName(initial?.name ?? "");
        setNis(initial?.nis ?? "");
        setErr(null);
        setTimeout(() => inputRef.current?.focus(), 30);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open, initial?.name, initial?.nis]);
    // ESC untuk menutup
    useEffect(() => {
        const onEsc = (e) => {
            if (open && e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);
    if (!open)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed)
            return setErr("Nama siswa wajib diisi.");
        setErr(null);
        setSaving(true);
        try {
            const payload = {
                id: slugify(trimmed),
                name: trimmed,
                nis: nis.trim() || undefined,
                kelasId: initial?.kelasId,
            };
            await onSubmit(payload);
            onClose();
        }
        catch (error) {
            setErr(error?.message ?? "Gagal menambahkan siswa.");
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50", "aria-modal": true, role: "dialog", children: [_jsx("div", { className: "absolute inset-0", onClick: onClose, style: { background: "#0006" } }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center p-3", children: _jsxs("div", { className: "w-full max-w-lg rounded-2xl border shadow-lg", style: { background: palette.white1, borderColor: palette.silver1 }, children: [_jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between", style: { borderColor: palette.silver1 }, children: [_jsx("div", { className: "font-semibold", children: title }), _jsx("button", { onClick: onClose, className: "h-9 w-9 grid place-items-center rounded-xl", style: { border: `1px solid ${palette.silver1}` }, "aria-label": "Tutup", children: _jsx(X, { size: 18 }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "px-4 py-4 grid gap-3", children: [_jsxs("label", { className: "grid gap-1 text-sm", children: [_jsxs("span", { children: ["Nama Siswa ", _jsx("span", { style: { color: palette.error1 }, children: "*" })] }), _jsx("input", { ref: inputRef, value: name, onChange: (e) => setName(e.target.value), placeholder: "cth: Ahmad", className: "h-10 rounded-lg px-3 border outline-none", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                borderColor: palette.silver1,
                                            } })] }), _jsxs("label", { className: "grid gap-1 text-sm", children: [_jsx("span", { children: "NIS (opsional)" }), _jsx("input", { value: nis, onChange: (e) => setNis(e.target.value), placeholder: "cth: 2025-001", className: "h-10 rounded-lg px-3 border outline-none", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                borderColor: palette.silver1,
                                            } })] }), name && (_jsxs("div", { className: "text-xs", style: { color: palette.silver2 }, children: ["ID otomatis: ", _jsx("code", { children: slugify(name) })] })), err && (_jsx("div", { className: "text-sm rounded-lg px-3 py-2", style: {
                                        color: palette.error1,
                                        background: palette.error2,
                                        border: `1px solid ${palette.error1}`,
                                    }, children: err })), _jsxs("div", { className: "mt-2 flex items-center justify-end gap-2", children: [_jsx(Btn, { palette: palette, type: "button", variant: "ghost", onClick: onClose, disabled: saving, children: "Batal" }), _jsx(Btn, { palette: palette, type: "submit", disabled: saving, children: saving ? "Menyimpan…" : "Simpan" })] })] })] }) })] }));
}
