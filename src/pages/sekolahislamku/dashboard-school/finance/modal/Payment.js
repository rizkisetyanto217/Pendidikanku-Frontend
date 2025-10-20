import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/sekolahislamku/finance/modal/Pembayaran.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
const Payment = ({ open, onClose, onSubmit, palette, invoiceOptions = [], defaultDate, }) => {
    const todayISO = useMemo(() => {
        if (defaultDate)
            return defaultDate;
        const d = new Date();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${m}-${day}`;
    }, [defaultDate]);
    const [date, setDate] = useState(todayISO);
    const [payer, setPayer] = useState("");
    const [invoiceId, setInvoiceId] = useState("");
    const [invoiceTitle, setInvoiceTitle] = useState("");
    const [method, setMethod] = useState("cash");
    const [amount, setAmount] = useState(0);
    const [notes, setNotes] = useState("");
    const wrapperRef = useRef(null);
    // Reset form setiap kali modal dibuka
    useEffect(() => {
        if (open) {
            setDate(todayISO);
            setPayer("");
            setInvoiceId("");
            setInvoiceTitle("");
            setMethod("cash");
            setAmount(0);
            setNotes("");
            // kunci scroll body saat modal terbuka
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [open, todayISO]);
    // close on ESC
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
    if (!open)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            date,
            payer_name: payer.trim(),
            invoice_id: invoiceId || undefined,
            invoice_title: invoiceId ? undefined : invoiceTitle.trim() || undefined,
            method,
            amount: Number(amount) || 0,
            notes: notes.trim() || undefined,
        };
        onSubmit(payload);
        onClose();
    };
    const node = (_jsx("div", { className: "fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50", role: "dialog", "aria-modal": "true", onClick: (e) => {
            if (e.target === wrapperRef.current)
                onClose();
        }, ref: wrapperRef, children: _jsxs("div", { className: "w-full sm:max-w-lg max-h-[92vh] overflow-auto rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6 space-y-4", style: { background: palette.white1, color: palette.black1 }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("h2", { className: "text-base sm:text-lg font-semibold", children: "Rekam Pembayaran" }), _jsx("button", { onClick: onClose, className: "h-9 w-9 grid place-items-center rounded-full", "aria-label": "Tutup modal", style: { border: `1px solid ${palette.silver1}, background: ${palette.white3}` }, children: _jsx(X, { size: 18 }) })] }), _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Tanggal" }), _jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                                borderColor: palette.silver1,
                                                background: palette.white2,
                                            }, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Metode" }), _jsxs("select", { value: method, onChange: (e) => setMethod(e.target.value), className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                                borderColor: palette.silver1,
                                                background: palette.white2,
                                            }, children: [_jsx("option", { value: "cash", children: "Tunai" }), _jsx("option", { value: "transfer", children: "Transfer" }), _jsx("option", { value: "virtual_account", children: "Virtual Account" }), _jsx("option", { value: "other", children: "Lainnya" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Nama Pembayar" }), _jsx("input", { value: payer, onChange: (e) => setPayer(e.target.value), className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                    }, placeholder: "Nama orang tua / siswa", required: true })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Pilih Tagihan (opsional)" }), _jsxs("select", { value: invoiceId, onChange: (e) => {
                                                setInvoiceId(e.target.value);
                                                if (e.target.value)
                                                    setInvoiceTitle(""); // kosongkan manual jika memilih tagihan
                                            }, className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                                borderColor: palette.silver1,
                                                background: palette.white2,
                                            }, children: [_jsx("option", { value: "", children: "\u2014 Tidak pilih \u2014" }), invoiceOptions.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Judul Tagihan (manual)" }), _jsx("input", { value: invoiceTitle, onChange: (e) => {
                                                setInvoiceTitle(e.target.value);
                                                if (e.target.value)
                                                    setInvoiceId(""); // kosongkan pilihan jika manual
                                            }, className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                                borderColor: palette.silver1,
                                                background: palette.white2,
                                            }, placeholder: "cth: SPP September - 6A" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Jumlah" }), _jsx("input", { type: "number", min: 0, value: Number.isNaN(amount) ? 0 : amount, onChange: (e) => setAmount(Number(e.target.value)), className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                    }, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm mb-1", children: "Catatan (opsional)" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full rounded-xl border px-3 py-2 outline-none", style: {
                                        borderColor: palette.silver1,
                                        background: palette.white2,
                                    }, placeholder: "Nomor referensi/VA, keterangan tambahan\u2026" })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Btn, { type: "button", palette: palette, variant: "outline", onClick: onClose, children: "Batal" }), _jsx(Btn, { type: "submit", palette: palette, variant: "default", children: "Simpan" })] })] })] }) }));
    return typeof document !== "undefined"
        ? createPortal(node, document.body)
        : node;
};
export default Payment;
