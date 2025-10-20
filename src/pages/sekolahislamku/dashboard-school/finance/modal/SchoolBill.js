import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// External
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Calendar as CalendarIcon, PlusCircle } from "lucide-react";
// Internal UI
import { SectionCard, Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
/** ===================== Utils ===================== */
function usePortalNode(id = "portal-root") {
    const [node, setNode] = useState(null);
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        let el = document.getElementById(id);
        if (!el) {
            el = document.createElement("div");
            el.id = id;
            document.body.appendChild(el);
        }
        setNode(el);
    }, [id]);
    return node;
}
/** ===================== Component ===================== */
export default function CreateInvoiceModal({ open, onClose, palette, classOptions = [], typeOptions = [], studentOptions = [], onSubmit, loading = false, error = null, defaultValues = {}, }) {
    // ⬇️ penting: kalau tidak open, jangan render apa pun
    if (!open)
        return null;
    const portalNode = usePortalNode();
    const [form, setForm] = useState({
        title: defaultValues.title ?? "",
        amount: defaultValues.amount ?? "",
        due_date: defaultValues.due_date ?? new Date().toISOString().slice(0, 10),
        class_name: defaultValues.class_name ?? "",
        type: defaultValues.type ?? "",
        student_id: defaultValues.student_id ?? "",
        description: defaultValues.description ?? "",
    });
    // lock scroll + ESC untuk menutup
    useEffect(() => {
        if (open) {
            document.body.classList.add("lock-scroll");
        }
        else {
            document.body.classList.remove("lock-scroll");
        }
        return () => {
            document.body.classList.remove("lock-scroll");
        };
    }, [open]);
    const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));
    const canSubmit = !!form.title &&
        !!form.due_date &&
        form.amount !== "" &&
        Number(form.amount) > 0;
    const body = (_jsx("div", { className: "fixed inset-0 grid place-items-center px-3", style: { background: "rgba(0,0,0,.35)", zIndex: 999999 }, role: "dialog", "aria-modal": "true", "aria-labelledby": "create-invoice-title", onClick: (e) => {
            if (e.target === e.currentTarget)
                onClose();
        }, children: _jsx("div", { className: "w-full max-w-[700px]", children: _jsxs(SectionCard, { palette: palette, className: "rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden", style: { background: palette.white1, color: palette.black1 }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "p-4 md:p-5 flex items-center justify-between border-b", style: { borderColor: palette.silver1 }, children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx(PlusCircle, { size: 20, color: palette.quaternary }), _jsx("h3", { id: "create-invoice-title", className: "text-lg font-semibold truncate", children: "Buat Tagihan" })] }), _jsx("button", { "aria-label": "Tutup", onClick: onClose, className: "ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full", style: {
                                    border: `1px solid ${palette.silver1}`,
                                    background: palette.white2,
                                }, children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 md:p-6 space-y-4", children: [!!error && (_jsx("div", { className: "rounded-lg px-3 py-2 text-sm", style: { background: palette.error2, color: palette.error1 }, children: error })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Judul" }), _jsx("input", { value: form.title, onChange: (e) => set("title", e.target.value), className: "w-full rounded-xl px-3 py-2 border outline-none", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                }, placeholder: "Contoh: SPP September" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Nominal" }), _jsx("input", { type: "number", min: 0, value: form.amount, onChange: (e) => set("amount", e.target.value === "" ? "" : Number(e.target.value)), className: "w-full rounded-xl px-3 py-2 border outline-none", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                }, placeholder: "cth: 150000" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Jatuh Tempo" }), _jsxs("div", { className: "flex items-center gap-2 rounded-xl px-3 py-2 border", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                }, children: [_jsx(CalendarIcon, { size: 16 }), _jsx("input", { type: "date", value: form.due_date, onChange: (e) => set("due_date", e.target.value), className: "bg-transparent outline-none w-full" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Jenis" }), _jsxs("select", { value: form.type ?? "", onChange: (e) => set("type", e.target.value || ""), className: "w-full rounded-xl px-3 py-2 border outline-none", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                }, children: [_jsx("option", { value: "", children: "Pilih jenis\u2026" }), typeOptions.map((t) => (_jsx("option", { value: t, children: t }, t)))] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Kelas" }), _jsxs("select", { value: form.class_name ?? "", onChange: (e) => set("class_name", e.target.value || ""), className: "w-full rounded-xl px-3 py-2 border outline-none", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                }, children: [_jsx("option", { value: "", children: "Semua / umum" }), classOptions.map((c) => (_jsx("option", { value: c, children: c }, c)))] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Siswa (opsional)" }), _jsxs("select", { value: form.student_id ?? "", onChange: (e) => set("student_id", e.target.value || ""), className: "w-full rounded-xl px-3 py-2 border outline-none", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                }, children: [_jsx("option", { value: "", children: "\u2014" }), studentOptions.map((s) => (_jsx("option", { value: s.value, children: s.label }, s.value)))] })] }), _jsxs("div", { className: "md:col-span-2 space-y-1.5", children: [_jsx("label", { className: "text-sm", children: "Deskripsi (opsional)" }), _jsx("textarea", { value: form.description ?? "", onChange: (e) => set("description", e.target.value), className: "w-full rounded-xl px-3 py-2 border outline-none", style: {
                                                    borderColor: palette.silver1,
                                                    background: palette.white2,
                                                }, rows: 3, placeholder: "Keterangan tambahan\u2026" })] })] }), _jsxs("div", { className: "flex items-center justify-end gap-2 pt-1", children: [_jsx(Btn, { variant: "ghost", palette: palette, onClick: onClose, children: "Batal" }), _jsx(Btn, { palette: palette, disabled: !canSubmit || loading, loading: loading, onClick: () => onSubmit({
                                            ...form,
                                            amount: Number(form.amount || 0),
                                        }), children: "Simpan Tagihan" })] }), !canSubmit && (_jsx("div", { className: "text-xs", style: { color: palette.secondary }, children: "* Wajib isi: Judul, Nominal & Jatuh Tempo" }))] })] }) }) }));
    return portalNode ? createPortal(body, portalNode) : body;
}
