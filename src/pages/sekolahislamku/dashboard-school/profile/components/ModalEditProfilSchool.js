import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { X, Building2 } from "lucide-react";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
/* ===================== Utils ===================== */
const toInputDate = (iso) => (iso ? iso.slice(0, 10) : "");
const strToLines = (s) => s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
const linesToStr = (arr) => arr?.length ? arr.join("\n") : "";
/* ===================== Small UI ===================== */
const BlockTitle = ({ children }) => (_jsx("div", { className: "font-semibold text-base opacity-90 mb-3", children: children }));
const FieldLabel = ({ children }) => (_jsx("label", { className: "text-sm font-medium", children: children }));
const FieldWrap = ({ children }) => (_jsx("div", { className: "grid gap-2", children: children }));
function FieldText({ label, value, onChange, palette, placeholder, type = "text", required, }) {
    return (_jsxs(FieldWrap, { children: [_jsxs(FieldLabel, { children: [label, " ", required ? _jsx("span", { className: "text-red-500", children: "*" }) : null] }), _jsx("input", { type: type, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "w-full rounded-xl border outline-none focus:ring-2 transition-all", style: {
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingTop: ".625rem",
                    paddingBottom: ".625rem",
                    borderColor: palette.silver1,
                    background: palette.white2,
                } })] }));
}
function FieldTextarea({ label, value, onChange, palette, rows = 5, placeholder, }) {
    return (_jsxs(FieldWrap, { children: [_jsx(FieldLabel, { children: label }), _jsx("textarea", { rows: rows, value: value, onChange: (e) => onChange(e.target.value), className: "w-full rounded-xl border outline-none focus:ring-2 transition-all resize-none \n        ", style: {
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingTop: ".625rem",
                    paddingBottom: ".625rem",
                    borderColor: palette.silver1,
                    background: palette.white2,
                }, placeholder: placeholder })] }));
}
function FieldSelect({ label, value, onChange, palette, children, }) {
    return (_jsxs("div", { className: "grid gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: label }), _jsxs("div", { className: "relative", children: [_jsx("select", { value: value, onChange: (e) => onChange(e.target.value), 
                        // Padding kiri/kanan BESAR supaya tidak mepet
                        className: "w-full rounded-xl border outline-none focus:ring-2 transition-all pl-4 pr-12 py-2.5 min-h-[44px] appearance-none", style: {
                            borderColor: palette.silver1,
                            background: palette.white2,
                        }, children: children }), _jsx("span", { "aria-hidden": true, className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm", style: { color: palette.silver2 }, children: "\u25BC" })] })] }));
}
/* ===================== Modal ===================== */
export default function ModalEditProfilSchool({ open, onClose, palette, initial, onSubmit, saving = false, error = null, }) {
    const [form, setForm] = useState(initial);
    const [missionText, setMissionText] = useState(linesToStr(initial.mission));
    const canSubmit = useMemo(() => !!form.name && !saving, [form.name, saving]);
    const closeBtnRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        setForm(initial);
        setMissionText(linesToStr(initial.mission));
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeBtnRef.current?.focus();
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open, initial]);
    useEffect(() => {
        if (!open)
            return;
        const h = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [open, onClose]);
    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
    const setAddr = (k, v) => setForm((s) => ({ ...s, address: { ...(s.address ?? {}), [k]: v } }));
    const setContact = (k, v) => setForm((s) => ({ ...s, contact: { ...(s.contact ?? {}), [k]: v } }));
    const setHead = (k, v) => setForm((s) => ({ ...s, headmaster: { ...(s.headmaster ?? {}), [k]: v } }));
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-[80] flex items-center justify-center p-4", style: { background: "rgba(0,0,0,.4)" }, onClick: (e) => {
            if (e.target === e.currentTarget)
                onClose();
        }, role: "dialog", "aria-modal": "true", "aria-labelledby": "school-edit-title", children: _jsxs(SectionCard, { palette: palette, className: "w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col", style: { background: palette.white1, color: palette.black1 }, children: [_jsxs("div", { className: "px-6 py-4 flex items-center justify-between border-b shrink-0", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Building2, { size: 20, color: palette.quaternary }), _jsx("h2", { id: "school-edit-title", className: "text-lg font-semibold", children: "Edit Profil Sekolah" })] }), _jsx("button", { ref: closeBtnRef, "aria-label": "Tutup", onClick: onClose, className: "h-10 w-10 grid place-items-center rounded-full hover:bg-opacity-10 hover:bg-black transition-colors", style: {
                                border: `1px solid ${palette.silver1}`,
                                background: palette.white2,
                            }, children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto px-6 py-6", style: { scrollBehavior: "smooth" }, children: _jsxs("div", { className: "space-y-8", children: [!!error && (_jsx("div", { className: "rounded-lg px-4 py-3 text-sm", style: { background: palette.error2, color: palette.error1 }, children: error })), _jsxs("section", { children: [_jsx(BlockTitle, { children: "Identitas Sekolah" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FieldText, { label: "Nama Sekolah", value: form.name, onChange: (v) => set("name", v), palette: palette, required: true }), _jsx(FieldText, { label: "NPSN", value: form.npsn ?? "", onChange: (v) => set("npsn", v), palette: palette }), _jsxs(FieldSelect, { label: "Akreditasi", value: form.accreditation ?? "", onChange: (v) => set("accreditation", (v || null)), palette: palette, children: [_jsx("option", { value: "", children: "\u2014" }), _jsx("option", { value: "A", children: "A" }), _jsx("option", { value: "B", children: "B" }), _jsx("option", { value: "C", children: "C" }), _jsx("option", { value: "-", children: "-" })] }), _jsx(FieldText, { label: "Tahun Berdiri", value: toInputDate(form.foundedAt), onChange: (v) => set("foundedAt", v), palette: palette, type: "date" })] })] }), _jsxs("section", { children: [_jsx(BlockTitle, { children: "Alamat" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FieldText, { label: "Alamat", value: form.address?.line ?? "", onChange: (v) => setAddr("line", v), palette: palette }), _jsx(FieldText, { label: "Kelurahan / Desa", value: form.address?.village ?? "", onChange: (v) => setAddr("village", v), palette: palette }), _jsx(FieldText, { label: "Kecamatan", value: form.address?.district ?? "", onChange: (v) => setAddr("district", v), palette: palette }), _jsx(FieldText, { label: "Kota / Kabupaten", value: form.address?.city ?? "", onChange: (v) => setAddr("city", v), palette: palette }), _jsx(FieldText, { label: "Provinsi", value: form.address?.province ?? "", onChange: (v) => setAddr("province", v), palette: palette }), _jsx(FieldText, { label: "Kode Pos", value: form.address?.postal ?? "", onChange: (v) => setAddr("postal", v), palette: palette })] })] }), _jsxs("section", { children: [_jsx(BlockTitle, { children: "Kontak" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FieldText, { label: "Telepon", value: form.contact?.phone ?? "", onChange: (v) => setContact("phone", v), palette: palette }), _jsx(FieldText, { label: "Email", type: "email", value: form.contact?.email ?? "", onChange: (v) => setContact("email", v), palette: palette }), _jsx(FieldText, { label: "Website", value: form.contact?.website ?? "", onChange: (v) => setContact("website", v), palette: palette, placeholder: "https://\u2026" }), _jsx(FieldText, { label: "URL Logo (opsional)", value: form.logoUrl ?? "", onChange: (v) => set("logoUrl", v), palette: palette })] })] }), _jsxs("section", { children: [_jsx(BlockTitle, { children: "Kepala Sekolah" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FieldText, { label: "Nama", value: form.headmaster?.name ?? "", onChange: (v) => setHead("name", v), palette: palette }), _jsx(FieldText, { label: "Telepon", value: form.headmaster?.phone ?? "", onChange: (v) => setHead("phone", v), palette: palette }), _jsx(FieldText, { label: "Email", type: "email", value: form.headmaster?.email ?? "", onChange: (v) => setHead("email", v), palette: palette })] })] }), _jsxs("section", { children: [_jsx(BlockTitle, { children: "Visi & Misi" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsx(FieldTextarea, { label: "Visi", value: form.vision ?? "", onChange: (v) => set("vision", v), palette: palette, placeholder: "Tulis visi sekolah\u2026" }), _jsx(FieldTextarea, { label: "Misi (satu baris satu poin)", value: missionText, onChange: setMissionText, palette: palette, placeholder: "Tulis misi 1\nTulis misi 2\n…" })] })] })] }) }), _jsxs("div", { className: "px-6 py-4 flex items-center justify-end gap-3 border-t shrink-0", style: { borderColor: palette.silver1, background: palette.white1 }, children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: onClose, disabled: saving, className: "px-6", children: "Batal" }), _jsx(Btn, { palette: palette, disabled: !canSubmit, onClick: () => onSubmit({
                                ...form,
                                mission: strToLines(missionText),
                            }), className: "px-6", children: saving ? "Menyimpan…" : "Simpan" })] })] }) }));
}
