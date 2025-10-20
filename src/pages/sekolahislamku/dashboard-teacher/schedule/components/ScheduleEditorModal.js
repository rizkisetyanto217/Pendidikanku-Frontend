import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/schedule/components/ScheduleEditorModal.tsx
import { useEffect, useState } from "react";
import EditModal from "@/pages/sekolahislamku/components/common/EditModal";
const idDate = (d) => d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
});
export default function ScheduleEditorModal({ open, onClose, palette, dateISO, initial, onSubmit, loading = false, }) {
    const [data, setData] = useState({
        time: initial?.time ?? "07:30",
        title: initial?.title ?? "",
        room: initial?.room ?? "",
        teacher: initial?.teacher ?? "",
        type: initial?.type ?? "class",
        note: initial?.note ?? "",
        description: initial?.description ?? "",
    });
    useEffect(() => {
        if (!open)
            return;
        setData({
            time: initial?.time ?? "07:30",
            title: initial?.title ?? "",
            room: initial?.room ?? "",
            teacher: initial?.teacher ?? "",
            type: initial?.type ?? "class",
            note: initial?.note ?? "",
            description: initial?.description ?? "",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        open,
        initial?.time,
        initial?.title,
        initial?.room,
        initial?.teacher,
        initial?.type,
        initial?.note,
        initial?.description,
    ]);
    const prettyDate = idDate(new Date(dateISO));
    const submit = async () => {
        if (!data.title.trim())
            return;
        await onSubmit(data);
    };
    return (_jsx(EditModal, { open: open, onClose: onClose, onSubmit: submit, palette: palette, title: _jsxs("span", { className: "flex flex-col", children: [_jsx("span", { children: initial ? "Edit Jadwal" : "Tambah Jadwal" }), _jsx("span", { className: "text-xs font-normal", style: { color: palette.black2 }, children: prettyDate })] }), submitLabel: "Simpan", cancelLabel: "Batal", loading: loading, children: _jsxs("div", { className: "grid gap-3", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: "Waktu" }), _jsx("input", { type: "time", value: data.time, onChange: (e) => setData((s) => ({ ...s, time: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: "Jenis" }), _jsxs("select", { value: data.type, onChange: (e) => setData((s) => ({ ...s, type: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, children: [_jsx("option", { value: "class", children: "Kelas" }), _jsx("option", { value: "exam", children: "Ujian" }), _jsx("option", { value: "event", children: "Kegiatan" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: "Judul" }), _jsx("input", { value: data.title, onChange: (e) => setData((s) => ({ ...s, title: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                background: palette.white2,
                                color: palette.black1,
                                border: `1px solid ${palette.silver1}`,
                            }, placeholder: "Contoh: Tahfiz Setoran", required: true })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: "Ruang/Tempat" }), _jsx("input", { value: data.room, onChange: (e) => setData((s) => ({ ...s, room: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, placeholder: "Aula 1" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: "Pengajar" }), _jsx("input", { value: data.teacher, onChange: (e) => setData((s) => ({ ...s, teacher: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                        background: palette.white2,
                                        color: palette.black1,
                                        border: `1px solid ${palette.silver1}`,
                                    }, placeholder: "Ust. Ali" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: "Catatan Singkat" }), _jsx("input", { value: data.note, onChange: (e) => setData((s) => ({ ...s, note: e.target.value })), className: "h-9 w-full rounded-xl px-3 text-sm", style: {
                                background: palette.white2,
                                color: palette.black1,
                                border: `1px solid ${palette.silver1}`,
                            }, placeholder: "Target hafalan 5 ayat per siswa" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: palette.black2 }, children: "Deskripsi" }), _jsx("textarea", { value: data.description, onChange: (e) => setData((s) => ({ ...s, description: e.target.value })), className: "min-h-[110px] w-full rounded-xl px-3 py-2 text-sm", style: {
                                background: palette.white2,
                                color: palette.black1,
                                border: `1px solid ${palette.silver1}`,
                            }, placeholder: "Deskripsi panjang (opsional)" })] })] }) }));
}
