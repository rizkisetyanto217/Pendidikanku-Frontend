import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const isoToInput = (iso) => (iso ? iso.slice(0, 10) : "");
const inputToIsoUTC = (ymd) => ymd ? new Date(`${ymd}T00:00:00.000Z`).toISOString() : "";
export default function TeacherAddEditAnnouncement({ palette, open, onClose, initial, onSubmit, saving, error, }) {
    const isEdit = !!initial?.id;
    const [title, setTitle] = useState("");
    const [dateYmd, setDateYmd] = useState("");
    const [body, setBody] = useState("");
    const [themeId, setThemeId] = useState("");
    useEffect(() => {
        if (!open)
            return;
        if (initial) {
            setTitle(initial.title ?? "");
            setDateYmd(isoToInput(initial.date));
            setBody(initial.body ?? "");
            setThemeId(initial.themeId ?? "");
        }
        else {
            setTitle("");
            setDateYmd("");
            setBody("");
            setThemeId("");
        }
    }, [open, initial]);
    if (!open)
        return null;
    const disabled = saving || !title.trim() || !dateYmd;
    return (_jsx("div", { className: "fixed inset-0 z-[60] grid place-items-center", style: { background: "rgba(0,0,0,.35)" }, children: _jsxs(SectionCard, { palette: palette, className: "w-[min(720px,94vw)] p-4 md:p-5 rounded-2xl shadow-xl", style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold", children: isEdit ? "Edit Pengumuman" : "Tambah Pengumuman" }), _jsx("button", { className: "text-sm opacity-70 hover:opacity-100", onClick: onClose, "aria-label": "Tutup", children: "Tutup" })] }), _jsxs("div", { className: "grid gap-3", children: [_jsxs("div", { className: "grid gap-1", children: [_jsx("label", { className: "text-sm opacity-80", children: "Judul" }), _jsx("input", { className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                        borderColor: palette.silver2,
                                        background: palette.white2,
                                    }, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Judul pengumuman" })] }), _jsxs("div", { className: "grid gap-1", children: [_jsx("label", { className: "text-sm opacity-80", children: "Tanggal" }), _jsx("input", { type: "date", className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                        borderColor: palette.silver2,
                                        background: palette.white2,
                                    }, value: dateYmd, onChange: (e) => setDateYmd(e.target.value) })] }), _jsxs("div", { className: "grid gap-1", children: [_jsx("label", { className: "text-sm opacity-80", children: "Isi" }), _jsx("textarea", { rows: 5, className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                        borderColor: palette.silver2,
                                        background: palette.white2,
                                    }, value: body, onChange: (e) => setBody(e.target.value), placeholder: "Konten pengumuman" })] }), !!error && (_jsx("div", { className: "text-sm", style: { color: palette.error1 }, children: error }))] }), _jsxs("div", { className: "mt-4 flex items-center justify-end gap-2", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: !!saving, children: "Batal" }), _jsx(Btn, { palette: palette, onClick: () => onSubmit({
                                id: initial?.id,
                                title: title.trim(),
                                date: inputToIsoUTC(dateYmd),
                                body: body.trim(),
                                themeId: (themeId || "").trim() || undefined,
                            }), disabled: disabled, children: saving ? "Menyimpan…" : isEdit ? "Simpan" : "Tambah" })] })] }) }));
}
