import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/components/dashboard/ModalEditSchedule.tsx
import { useEffect, useRef, useState } from "react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const fmtLong = (iso) => iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
    })
    : undefined;
const timeOk = (t) => /^\d{2}:\d{2}$/.test(t);
const ModalEditSchedule = ({ open, onClose, palette, defaultTitle = "", defaultTime = "", defaultRoom = "", defaultDateISO, onSubmit, onDelete, }) => {
    const [title, setTitle] = useState(defaultTitle);
    const [time, setTime] = useState(defaultTime);
    const [room, setRoom] = useState(defaultRoom);
    const [touched, setTouched] = useState(false);
    const dialogRef = useRef(null);
    // Reset form ketika modal dibuka
    useEffect(() => {
        if (open) {
            setTitle(defaultTitle);
            setTime(defaultTime);
            setRoom(defaultRoom);
            setTouched(false);
        }
    }, [open, defaultTitle, defaultTime, defaultRoom]);
    // ESC untuk close
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
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget)
            onClose();
    };
    const invalidTime = touched && !timeOk(time);
    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (!title.trim())
            return;
        if (!timeOk(time))
            return;
        onSubmit({ title: title.trim(), time, room: room.trim() || undefined });
    };
    if (!open)
        return null;
    return (_jsx("div", { onClick: handleOverlayClick, className: "fixed inset-0 z-[60] flex items-center justify-center px-4", style: { background: "rgba(0,0,0,0.35)" }, "aria-modal": true, role: "dialog", children: _jsxs("div", { ref: dialogRef, className: "w-full max-w-lg rounded-2xl shadow-xl overflow-hidden", style: {
                background: palette.white1,
                color: palette.black1,
                border: `1px solid ${palette.silver1}`,
            }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "px-5 py-4 border-b", style: { borderColor: palette.silver1, background: palette.white2 }, children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg", children: "Edit Jadwal" }), defaultDateISO && (_jsx("p", { className: "text-xs mt-0.5", style: { color: palette.silver2 }, children: fmtLong(defaultDateISO) }))] }), _jsx("button", { onClick: onClose, className: "px-3 py-1 rounded-lg text-sm hover:opacity-80", style: {
                                    background: palette.white1,
                                    border: `1px solid ${palette.silver1}`,
                                    color: palette.black1,
                                }, "aria-label": "Tutup", children: "Tutup" })] }) }), _jsxs("form", { onSubmit: submit, className: "px-5 py-4 space-y-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Judul" }), _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Contoh: TPA A \u2014 Tahsin", className: "w-full rounded-xl px-3 h-10 outline-none text-sm", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, required: true })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Waktu (HH:MM)" }), _jsx("input", { value: time, onChange: (e) => setTime(e.target.value), placeholder: "07:30", className: "w-full rounded-xl px-3 h-10 outline-none text-sm", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${invalidTime ? palette.error1 : palette.silver1}`,
                                            }, onBlur: () => setTouched(true) }), invalidTime && (_jsx("p", { className: "text-xs mt-1", style: { color: palette.error1 }, children: "Format waktu harus HH:MM (mis. 07:30)" }))] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Lokasi / Ruang" }), _jsxs("select", { value: room, onChange: (e) => setRoom(e.target.value), className: "w-full rounded-xl px-3 h-10 outline-none text-sm", style: {
                                                background: palette.white2,
                                                color: palette.black1,
                                                border: `1px solid ${palette.silver1}`,
                                            }, children: [_jsx("option", { value: "", children: "Pilih Ruang" }), _jsx("option", { value: "aula-1", children: "Aula 1" }), _jsx("option", { value: "aula-2", children: "Aula 2" }), _jsx("option", { value: "kelas-1a", children: "Kelas 1A" }), _jsx("option", { value: "kelas-1b", children: "Kelas 1B" }), _jsx("option", { value: "perpustakaan", children: "Perpustakaan" }), _jsx("option", { value: "lapangan", children: "Lapangan" })] })] })] })] }), _jsx("div", { className: "px-5 py-4 flex items-center justify-between border-t", style: { borderColor: palette.silver1, background: palette.white2 }, children: _jsxs("div", { className: "flex gap-2", children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", onClick: submit, disabled: !title.trim() || !timeOk(time), children: "Simpan" })] }) })] }) }));
};
export default ModalEditSchedule;
