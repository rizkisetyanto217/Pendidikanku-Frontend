import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// =============================
// File: src/pages/sekolahislamku/pages/schedule/modal/TambahJadwal.tsx
// =============================
import { useEffect, useRef, useState } from "react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const generateSlug = (text) => (text || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
export default function AddSchedule({ open, onClose, onSubmit, palette, defaultTime, }) {
    const [time, setTime] = useState(defaultTime || "");
    const [title, setTitle] = useState("");
    const [room, setRoom] = useState("");
    const [error, setError] = useState("");
    const dialogRef = useRef(null);
    const firstFieldRef = useRef(null);
    // Reset form when opened/closed
    useEffect(() => {
        if (open) {
            setTime(defaultTime || "");
            setTitle("");
            setRoom("");
            setError("");
            // Focus first input on open
            setTimeout(() => firstFieldRef.current?.focus(), 0);
        }
    }, [open, defaultTime]);
    // Close on ESC
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
    // Close when clicking outside dialog
    useEffect(() => {
        if (!open)
            return;
        const onClick = (e) => {
            if (dialogRef.current && !dialogRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [open, onClose]);
    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!time || !title.trim()) {
            setError("Jam dan Judul wajib diisi");
            return;
        }
        const payload = {
            time: time.trim(),
            title: title.trim(),
            room: room.trim() || undefined,
            slug: generateSlug(title),
        };
        onSubmit(payload);
        onClose();
    };
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.3)" }, "aria-modal": "true", role: "dialog", children: _jsxs("div", { ref: dialogRef, className: "w-full max-w-md rounded-2xl shadow-xl border", style: { background: palette.white1, borderColor: palette.silver1 }, children: [_jsx("div", { className: "px-5 pt-4 pb-3 border-b", style: { borderColor: palette.silver1 }, children: _jsx("h3", { className: "text-base font-semibold", children: "Tambah Jadwal" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "px-5 py-4 space-y-3", children: [error ? (_jsx("div", { className: "text-sm rounded-lg px-3 py-2", style: { background: palette.white2, color: palette.quaternary }, children: error })) : null, _jsxs("div", { className: "grid gap-1.5", children: [_jsx("label", { className: "text-sm font-medium", children: "Jam *" }), _jsx("input", { ref: firstFieldRef, type: "time", value: time, onChange: (e) => setTime(e.target.value), className: "rounded-xl border px-3 py-2 outline-none", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white1,
                                        color: palette.black1,
                                    }, required: true })] }), _jsxs("div", { className: "grid gap-1.5", children: [_jsx("label", { className: "text-sm font-medium", children: "Judul / Kegiatan *" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Contoh: TPA A \u2014 Tahsin", className: "rounded-xl border px-3 py-2 outline-none", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white1,
                                        color: palette.black1,
                                    }, required: true })] }), _jsxs("div", { className: "grid gap-1.5", children: [_jsx("label", { className: "text-sm font-medium", children: "Ruangan (opsional)" }), _jsx("input", { type: "text", value: room, onChange: (e) => setRoom(e.target.value), placeholder: "Aula 1 / R. Tahfiz", className: "rounded-xl border px-3 py-2 outline-none", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white1,
                                        color: palette.black1,
                                    } })] }), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-2", children: [_jsx(Btn, { type: "button", variant: "outline", palette: palette, onClick: onClose, children: "Batal" }), _jsx(Btn, { type: "submit", palette: palette, children: "Simpan" })] })] })] }) }));
}
