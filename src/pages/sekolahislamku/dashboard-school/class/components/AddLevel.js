import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/pages/classes/components/TambahLevel.tsx
import { useState } from "react";
import axios from "@/lib/axios";
import { X, Layers } from "lucide-react";
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
export default function AddLevel({ open, palette, onClose, onCreated }) {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [saving, setSaving] = useState(false);
    if (!open)
        return null;
    const canSave = name.trim().length >= 1 && !saving;
    const slugify = (s) => s
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    async function handleSave() {
        if (!canSave)
            return;
        setSaving(true);
        try {
            // Backend umumnya auto-tenant dari token; kirim field minimal
            const payload = {
                classes_name: name.trim(),
                classes_code: code.trim() || null,
                classes_slug: slugify(name),
                classes_is_active: true,
            };
            await axios.post("/api/a/classes", payload);
            onCreated?.();
            onClose();
        }
        catch (e) {
            console.error("Gagal membuat level:", e);
            alert("Gagal membuat level");
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsx("div", { className: "fixed inset-0 z-[120] flex items-center justify-center p-4", style: { background: "rgba(0,0,0,0.35)" }, role: "dialog", "aria-modal": "true", children: _jsxs(SectionCard, { palette: palette, className: "w-full max-w-md overflow-hidden rounded-2xl", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b", style: { borderColor: palette.white3, background: palette.white1 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "h-9 w-9 rounded-xl grid place-items-center", style: { background: palette.white3, color: palette.quaternary }, children: _jsx(Layers, { size: 18 }) }), _jsx("div", { className: "font-semibold", style: { color: palette.black2 }, children: "Tambah Level / Tingkat" })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg", "aria-label": "Tutup", style: { color: palette.secondary, background: palette.white3 }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "px-4 py-4 space-y-3", children: [_jsx(Field, { label: "Nama Level*", placeholder: "Contoh: Kelas 1", value: name, onChange: setName, palette: palette }), _jsx(Field, { label: "Kode (opsional)", placeholder: "Contoh: 1", value: code, onChange: setCode, palette: palette }), _jsx("div", { className: "text-xs", style: { color: palette.secondary }, children: "Satu level dapat memiliki banyak kelas/section (mis. Kelas 1A, 1B)." })] }), _jsxs("div", { className: "px-4 py-3 flex items-center justify-end gap-2 border-t", style: { borderColor: palette.white3, background: palette.white1 }, children: [_jsx(Btn, { palette: palette, size: "sm", variant: "ghost", onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, size: "sm", disabled: !canSave, onClick: handleSave, children: saving ? "Menyimpan…" : "Simpan" })] })] }) }));
}
function Field({ label, value, onChange, palette, placeholder, }) {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("label", { className: "text-xs", style: { color: palette.secondary }, children: label }), _jsx("input", { value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, className: "w-full rounded-xl px-3 py-2 outline-none border", style: {
                    borderColor: palette.white3,
                    background: palette.white1,
                    color: palette.quaternary,
                } })] }));
}
