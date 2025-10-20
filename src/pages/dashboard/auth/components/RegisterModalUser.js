import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/auth/components/ModalRegister.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { Btn, } from "@/pages/sekolahislamku/components/ui/Primitives";
import InputField from "@/components/common/main/InputField";
const DEFAULT_ANGKATAN = [
    "2025/2026",
    "2026/2027",
    "2027/2028",
];
const DEFAULT_PROGRAMS = {
    "2025/2026": ["Kelas 1", "Kelas 2", "Kelas 3"],
    "2026/2027": ["Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4"],
    "2027/2028": ["Kelas 1", "Kelas 2"],
};
const DEFAULT_DONE_TEMPLATE = "/:slug/murid";
function resolveSlug(propSlug, urlSlug) {
    return propSlug || urlSlug || "sekolahku";
}
function fillPathTemplate(tpl, slug) {
    return tpl.replace(":slug", slug);
}
function isEmail(v) {
    return /.+@.+\..+/.test(v);
}
function isPhoneID(v) {
    const digits = (v.match(/\d/g) || []).length;
    return digits >= 8;
}
export function ModalRegister({ initialOpen = false, onClose, onSubmit, angkatanOptions = DEFAULT_ANGKATAN, programByAngkatan = DEFAULT_PROGRAMS, slug: propSlug, donePathTemplate = DEFAULT_DONE_TEMPLATE, }) {
    const navigate = useNavigate();
    const { slug: urlSlug } = useParams();
    const { isDark, themeName } = useHtmlDarkMode();
    const palette = pickTheme(themeName, isDark);
    const [open, setOpen] = useState(initialOpen);
    const [step, setStep] = useState(0); // 0: Angkatan, 1: Program, 2: Form, 3: Konfirmasi
    const [loading, setLoading] = useState(false);
    const [angkatan, setAngkatan] = useState("");
    const [program, setProgram] = useState("");
    const [form, setForm] = useState({
        nama: "",
        email: "",
        phone: "",
        alamat: "",
        orangTua: "",
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    useEffect(() => setOpen(initialOpen), [initialOpen]);
    // Lock scroll saat modal terbuka
    useEffect(() => {
        if (!open)
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);
    // Focus trap + auto focus
    const modalRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const first = modalRef.current?.querySelector("input,select,textarea,button");
        first?.focus();
        function onFocus(e) {
            if (!modalRef.current)
                return;
            if (!modalRef.current.contains(e.target)) {
                modalRef.current.focus();
            }
        }
        document.addEventListener("focusin", onFocus);
        return () => document.removeEventListener("focusin", onFocus);
    }, [open, step]);
    // Shortcuts
    useEffect(() => {
        if (!open)
            return;
        function onKey(e) {
            if (e.key === "Escape")
                handleClose();
            if (e.key === "Enter") {
                if (step === 0 && canNextAngkatan)
                    setStep(1);
                else if (step === 1 && canNextProgram)
                    setStep(2);
                else if (step === 2 && canSubmitForm && !loading)
                    void handleSubmit();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, step, angkatan, program, form, loading]);
    const percent = [25, 50, 75, 100][Math.min(step, 3)];
    const programs = useMemo(() => (angkatan ? programByAngkatan[angkatan] || [] : []), [angkatan, programByAngkatan]);
    const canNextAngkatan = Boolean(angkatan);
    const canNextProgram = Boolean(program);
    const canSubmitForm = Boolean(form.nama && form.email && form.phone);
    function resetAll() {
        setStep(0);
        setAngkatan("");
        setProgram("");
        setForm({ nama: "", email: "", phone: "", alamat: "", orangTua: "" });
        setErrors({});
        setSubmitError("");
        setLoading(false);
    }
    function handleClose() {
        setOpen(false);
        onClose?.();
    }
    function validateForm() {
        const e = {};
        if (!isEmail(form.email))
            e.email = "Format email tidak valid";
        if (!isPhoneID(form.phone))
            e.phone = "Nomor HP kurang valid";
        setErrors(e);
        return Object.keys(e).length === 0;
    }
    async function handleSubmit() {
        if (!canSubmitForm || loading)
            return;
        if (!validateForm())
            return;
        setSubmitError("");
        try {
            setLoading(true);
            const payload = { angkatan, program, ...form };
            await onSubmit?.(payload);
            setStep(3);
        }
        catch (err) {
            const msg = err?.response?.data?.message ||
                err?.message ||
                "Gagal mengirim pendaftaran. Coba lagi.";
            setSubmitError(msg);
        }
        finally {
            setLoading(false);
        }
    }
    function goToDashboard() {
        const resolvedSlug = resolveSlug(propSlug, urlSlug);
        const target = fillPathTemplate(donePathTemplate, resolvedSlug);
        resetAll();
        setOpen(false);
        navigate(target);
    }
    return (_jsxs(_Fragment, { children: [_jsx(Btn, { palette: palette, onClick: () => setOpen(true), children: "Buka Form Pendaftaran" }), open && (_jsxs("div", { role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-register-title", className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0", style: { background: "rgba(0,0,0,.5)" }, onClick: handleClose }), _jsxs("div", { ref: modalRef, tabIndex: -1, className: "relative z-10 w-full max-w-lg rounded-2xl p-5 shadow-lg outline-none", style: {
                            background: palette.white1,
                            color: palette.black1,
                            boxShadow: "0 10px 40px rgba(0,0,0,.2)",
                        }, children: [_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { id: "modal-register-title", className: "text-xl font-semibold", children: "Pendaftaran Peserta Baru" }), _jsx("p", { className: "text-sm", style: { color: palette.silver2 }, children: "Lengkapi langkah-langkah berikut untuk mendaftar." })] }), _jsx(Btn, { palette: palette, variant: "ghost", onClick: handleClose, className: "h-8 w-8 p-0 grid place-items-center", "aria-label": "Tutup", title: "Tutup", children: "\u2715" })] }), _jsxs("div", { className: "mt-4", children: [_jsx("div", { className: "h-2 w-full overflow-hidden rounded-full", style: { background: palette.white2 }, "aria-label": "Progres pendaftaran", children: _jsx("div", { className: "h-full transition-all", style: { width: `${percent}%`, background: palette.primary } }) }), _jsxs("div", { className: "mt-1 text-xs", style: { color: palette.silver2 }, children: ["Langkah ", Math.min(step + 1, 4), " dari 4"] })] }), _jsxs("div", { className: "mt-5 space-y-4", children: [submitError && (_jsx("div", { className: "text-sm rounded-xl px-3 py-2 border", style: {
                                            borderColor: palette.error1 ?? "#ef4444",
                                            color: palette.error1 ?? "#ef4444",
                                            background: palette.error2 ?? "rgba(239,68,68,0.08)",
                                        }, children: submitError })), step === 0 && (_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-medium", children: "Angkatan" }), _jsxs("select", { value: angkatan, onChange: (e) => {
                                                    setAngkatan(e.target.value);
                                                    setProgram("");
                                                }, className: "w-full rounded-lg border px-3 py-2 text-sm", style: {
                                                    borderColor: palette.silver2,
                                                    background: palette.white2,
                                                    color: palette.black1,
                                                }, children: [_jsx("option", { value: "", children: "Pilih angkatan" }), angkatanOptions.map((opt) => (_jsx("option", { value: opt, children: opt }, opt)))] }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx("span", {}), _jsx(Btn, { palette: palette, onClick: () => setStep(1), disabled: !canNextAngkatan, children: "Lanjut \u2192" })] })] })), step === 1 && (_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-medium", children: "Program/Kelas" }), _jsxs("select", { value: program, onChange: (e) => setProgram(e.target.value), disabled: !angkatan, className: "w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-60", style: {
                                                    borderColor: palette.silver2,
                                                    background: palette.white2,
                                                    color: palette.black1,
                                                }, children: [_jsx("option", { value: "", children: angkatan ? "Pilih program" : "Pilih angkatan dulu" }), programs.map((p) => (_jsx("option", { value: p, children: p }, p)))] }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => setStep(0), children: "\u2190 Kembali" }), _jsx(Btn, { palette: palette, onClick: () => setStep(2), disabled: !canNextProgram, children: "Lanjut \u2192" })] })] })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsx(InputField, { label: "Nama Lengkap", name: "nama", value: form.nama, onChange: (e) => setForm({ ...form, nama: e.target.value }), placeholder: "Nama sesuai KTP/KK" }), _jsxs("div", { children: [_jsx(InputField, { label: "Email", name: "email", type: "email", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), placeholder: "nama@email.com" }), errors.email && (_jsx("p", { className: "mt-1 text-xs", style: { color: palette.error1 }, children: errors.email }))] }), _jsxs("div", { children: [_jsx(InputField, { label: "No. HP", name: "phone", type: "tel", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }), placeholder: "08xxxxxxxxxx" }), errors.phone && (_jsx("p", { className: "mt-1 text-xs", style: { color: palette.error1 }, children: errors.phone }))] }), _jsx(InputField, { label: "Alamat", name: "alamat", value: form.alamat, onChange: (e) => setForm({ ...form, alamat: e.target.value }), placeholder: "Alamat lengkap" }), _jsx(InputField, { label: "Nama Orang Tua/Wali", name: "orangTua", value: form.orangTua, onChange: (e) => setForm({ ...form, orangTua: e.target.value }), placeholder: "Nama orang tua/wali" })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between", children: [_jsx(Btn, { palette: palette, variant: "ghost", onClick: () => setStep(1), children: "\u2190 Kembali" }), _jsx(Btn, { palette: palette, onClick: handleSubmit, disabled: !canSubmitForm || loading, children: loading ? "Mengirim..." : "Daftar Sekarang" })] })] })), step === 3 && (_jsxs("div", { className: "py-4 text-center", children: [_jsx("div", { className: "mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full text-2xl", style: {
                                                    background: palette.success2 ?? "#dcfce7",
                                                    color: palette.success1 ?? "#16a34a",
                                                }, children: "\u2713" }), _jsx("h3", { className: "text-lg font-semibold", children: "Pendaftaran Terkirim" }), _jsxs("p", { className: "mt-1 text-sm", style: { color: palette.silver2 }, children: ["Terima kasih, data Anda sudah kami terima untuk ", angkatan, " \u2014", " ", program, ". Silakan menunggu verifikasi dari Admin Sekolah."] }), _jsx("div", { className: "mt-4", children: _jsx(Btn, { palette: palette, onClick: goToDashboard, children: "Selesai" }) })] }))] })] })] }))] }));
}
export function PendaftaranButtonWithModal(props) {
    return _jsx(ModalRegister, { ...props });
}
