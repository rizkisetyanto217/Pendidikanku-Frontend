import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/auth/Register.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import api from "@/lib/axios";
import GoogleIdentityButton from "@/pages/dashboard/auth/components/GoogleIdentityButton"; // ⬅️
import { EyeIcon, EyeOffIcon, Mail, User, Lock, HelpCircle, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, } from "lucide-react";
/* =======================
   Consts & Types
======================= */
const securityQuestions = [
    "Sebutkan nama orang",
    "Sebutkan istilah dalam islam",
    "Sebutkan sesuatu hal tentang dirimu",
];
/* =======================
   Component
======================= */
export default function RegisterUser() {
    const [form, setForm] = useState({
        user_name: "",
        email: "",
        password: "",
        confirm_password: "",
        security_question: "",
        security_answer: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    // ⬅️ pakai env agar gak 403 di GSI (Authorized JavaScript origins)
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "330051036041-8src8un315p823ap640hv70vp3448ruh.apps.googleusercontent.com";
    const styles = useMemo(() => ({
        card: {
            backgroundColor: theme.white1,
            borderColor: theme.white3,
            color: theme.black1,
        },
        input: {
            backgroundColor: theme.white1,
            color: theme.black1,
            borderColor: theme.white3,
        },
        muted: { color: theme.silver2 },
        primaryBtn: {
            backgroundColor: loading ? theme.primary2 : theme.primary,
            color: theme.white1,
        },
        ghostBtn: {
            backgroundColor: isDark ? theme.white2 : theme.white1,
            borderColor: theme.white3,
            color: theme.black1,
        },
        ringFocus: `0 0 0 3px ${theme.primary}33`,
    }), [theme, loading, isDark]);
    /* =======================
       Form helpers & validation
    ======================= */
    const onChange = (key) => (e) => {
        setForm((s) => ({ ...s, [key]: e.target.value }));
        setError("");
    };
    const emailValid = /^\S+@\S+\.\S+$/.test(form.email);
    const usernameValid = form.user_name.trim().length >= 3;
    const pwdLen = form.password.length;
    const pwdHasNum = /\d/.test(form.password);
    const pwdHasLetter = /[A-Za-z]/.test(form.password);
    const pwdStrongPoints = Number(pwdLen >= 8) + Number(pwdHasNum) + Number(pwdHasLetter);
    const pwdMatch = form.password === form.confirm_password;
    const step1Valid = usernameValid && emailValid && pwdStrongPoints >= 2 && pwdMatch;
    const step2Valid = !!form.security_question && form.security_answer.trim().length > 0;
    /* =======================
       Navigation (steps)
    ======================= */
    const handleNext = () => {
        if (!step1Valid) {
            setError("Mohon lengkapi data pada Langkah 1 dengan benar.");
            return;
        }
        setError("");
        setStep(2);
    };
    const handleBack = () => {
        setError("");
        setStep(1);
    };
    /* =======================
       Google Sign Up / Sign In
    ======================= */
    const handleGoogleSignup = async (credential) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            // Prefer endpoint register jika ada, fallback ke login
            let res;
            try {
                res = await api.post("/auth/register-google", { id_token: credential });
            }
            catch {
                res = await api.post("/auth/login-google", { id_token: credential });
            }
            const token = res.data?.data?.access_token ?? res.data?.access_token;
            if (token)
                localStorage.setItem("access_token", token);
            setSuccess("Berhasil menggunakan Google. Mengarahkan…");
            setTimeout(() => navigate("/"), 800);
        }
        catch (err) {
            if (err?.response?.status === 403) {
                setError("Origin tidak diizinkan untuk Client ID ini. Tambahkan origin frontend di Google Cloud Console (Authorized JavaScript origins).");
            }
            else {
                setError("Gagal menggunakan Google. Silakan coba lagi.");
            }
        }
        finally {
            setLoading(false);
        }
    };
    /* =======================
       Submit manual (Langkah 2)
    ======================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!step2Valid) {
            setError("Mohon isi pertanyaan & jawaban keamanan.");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                user_name: form.user_name.trim(),
                email: form.email.trim(),
                password: form.password,
                security_question: form.security_question,
                security_answer: form.security_answer.trim(),
            };
            const res = await api.post("/auth/register", payload);
            if (res.data?.status === "success") {
                setSuccess("Registrasi berhasil! Mengarahkan ke halaman login…");
                setTimeout(() => navigate("/login"), 1200);
            }
            else {
                setError(res.data?.message || "Registrasi gagal, coba lagi.");
            }
        }
        catch (err) {
            if (err.response)
                setError(err.response.data?.message || "Registrasi gagal.");
            else if (err.request)
                setError("Tidak ada respon dari server.");
            else
                setError("Terjadi kesalahan saat mendaftar.");
        }
        finally {
            setLoading(false);
        }
    };
    /* =======================
       UI
    ======================= */
    return (_jsxs(AuthLayout, { mode: "register", fullWidth: true, contentClassName: "max-w-xl mx-auto", children: [_jsx("div", { className: "text-center mb-6", children: _jsxs("div", { className: "inline-flex items-center gap-2", children: [_jsx("img", { src: "https://picsum.photos/200/300", alt: "Logo", className: "h-10 w-10 rounded object-cover" }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-bold text-lg", style: { color: theme.black1 }, children: "SekolahIslamku Suite" }), _jsx("div", { className: "text-xs", style: styles.muted, children: "Satu platform untuk operasional sekolah yang rapi & efisien" })] })] }) }), _jsxs("div", { className: "w-full rounded-2xl p-6 md:p-8", style: styles.card, children: [_jsxs("div", { className: "mb-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h1", { className: "text-2xl font-bold", style: { color: theme.black1 }, children: "Buat Akun Baru" }), _jsxs("span", { className: "text-xs px-2 py-1 rounded-full", style: {
                                            backgroundColor: theme.white2,
                                            border: `1px solid ${theme.white3}`,
                                            color: theme.black1,
                                        }, children: ["Langkah ", step, " dari 2"] })] }), _jsx("div", { className: "h-1.5 w-full rounded-full overflow-hidden", style: { backgroundColor: theme.white2 }, children: _jsx("div", { className: "h-full transition-all", style: {
                                        width: step === 1 ? "50%" : "100%",
                                        backgroundColor: theme.primary,
                                    } }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "w-full flex justify-center", children: _jsx(GoogleIdentityButton, { clientId: GOOGLE_CLIENT_ID, onSuccess: handleGoogleSignup, theme: isDark ? "outline" : "filled_blue", size: "large", text: "signup_with", className: "w-full max-w-sm" }) }), _jsxs("div", { className: "my-6 flex items-center gap-3", children: [_jsx("div", { className: "h-px flex-1", style: { backgroundColor: theme.white3 } }), _jsx("div", { className: "text-xs", style: styles.muted, children: "atau daftar secara manual" }), _jsx("div", { className: "h-px flex-1", style: { backgroundColor: theme.white3 } })] })] }), error && (_jsxs("div", { className: "mb-5 rounded-xl px-3 py-2 text-sm border flex items-center gap-2", style: {
                            backgroundColor: isDark
                                ? `${theme.error1}10`
                                : `${theme.error1}0D`,
                            borderColor: `${theme.error1}33`,
                            color: theme.error1,
                        }, children: [_jsx(AlertCircle, { className: "h-4 w-4" }), " ", error] })), success && (_jsxs("div", { className: "mb-5 rounded-xl px-3 py-2 text-sm border flex items-center gap-2", style: {
                            backgroundColor: isDark
                                ? `${theme.success1}10`
                                : `${theme.success1}0D`,
                            borderColor: `${theme.success1}33`,
                            color: theme.success1,
                        }, children: [_jsx(CheckCircle2, { className: "h-4 w-4" }), " ", success] })), _jsx("form", { onSubmit: handleSubmit, className: "space-y-4", "aria-busy": loading ? true : undefined, children: step === 1 ? (_jsxs(_Fragment, { children: [_jsx(Field, { label: "Username", icon: _jsx(User, { className: "h-5 w-5", style: styles.muted }), children: _jsx("input", { type: "text", name: "user_name", value: form.user_name, onChange: onChange("user_name"), required: true, autoComplete: "username", className: "w-full rounded-xl border px-10 py-3 outline-none", style: {
                                            ...styles.input,
                                            boxShadow: `0 0 0 0px transparent`,
                                        }, onFocus: (e) => (e.currentTarget.style.boxShadow = styles.ringFocus), onBlur: (e) => (e.currentTarget.style.boxShadow = "none") }) }), !usernameValid && form.user_name && (_jsx(SmallError, { children: "Minimal 3 karakter." })), _jsx(Field, { label: "Email", icon: _jsx(Mail, { className: "h-5 w-5", style: styles.muted }), children: _jsx("input", { type: "email", name: "email", value: form.email, onChange: onChange("email"), required: true, autoComplete: "email", className: "w-full rounded-xl border px-10 py-3 outline-none", style: {
                                            ...styles.input,
                                            boxShadow: `0 0 0 0px transparent`,
                                        }, onFocus: (e) => (e.currentTarget.style.boxShadow = styles.ringFocus), onBlur: (e) => (e.currentTarget.style.boxShadow = "none") }) }), !emailValid && form.email && (_jsx(SmallError, { children: "Format email tidak valid." })), _jsxs(Field, { label: "Password", icon: _jsx(Lock, { className: "h-5 w-5", style: styles.muted }), children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: showPw ? "text" : "password", name: "password", value: form.password, onChange: onChange("password"), required: true, autoComplete: "new-password", className: "w-full rounded-xl border px-10 py-3 outline-none", style: {
                                                        ...styles.input,
                                                        boxShadow: `0 0 0 0px transparent`,
                                                    }, onFocus: (e) => (e.currentTarget.style.boxShadow = styles.ringFocus), onBlur: (e) => (e.currentTarget.style.boxShadow = "none") }), _jsx("button", { type: "button", onClick: () => setShowPw((s) => !s), className: "absolute right-3 top-1/2 -translate-y-1/2 rounded p-1", "aria-label": showPw ? "Sembunyikan password" : "Tampilkan password", style: { color: theme.silver2 }, children: showPw ? (_jsx(EyeOffIcon, { className: "w-5 h-5" })) : (_jsx(EyeIcon, { className: "w-5 h-5" })) })] }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [[0, 1, 2].map((i) => (_jsx("span", { className: "h-1.5 w-1/3 rounded-full", style: {
                                                        backgroundColor: pwdStrongPoints > i ? theme.primary : theme.white3,
                                                        opacity: pwdStrongPoints > i ? 1 : 0.6,
                                                    } }, i))), _jsxs("span", { className: "text-xs", style: styles.muted, children: [_jsx(HelpCircle, { className: "inline h-3.5 w-3.5 mr-1" }), "\u22658 karakter, kombinasi huruf & angka"] })] })] }), _jsx(Field, { label: "Konfirmasi Password", icon: _jsx(Lock, { className: "h-5 w-5", style: styles.muted }), children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPw2 ? "text" : "password", name: "confirm_password", value: form.confirm_password, onChange: onChange("confirm_password"), required: true, autoComplete: "new-password", className: "w-full rounded-xl border px-10 py-3 outline-none", style: {
                                                    ...styles.input,
                                                    boxShadow: `0 0 0 0px transparent`,
                                                }, onFocus: (e) => (e.currentTarget.style.boxShadow = styles.ringFocus), onBlur: (e) => (e.currentTarget.style.boxShadow = "none") }), _jsx("button", { type: "button", onClick: () => setShowPw2((s) => !s), className: "absolute right-3 top-1/2 -translate-y-1/2 rounded p-1", "aria-label": showPw2 ? "Sembunyikan password" : "Tampilkan password", style: { color: theme.silver2 }, children: showPw2 ? (_jsx(EyeOffIcon, { className: "w-5 h-5" })) : (_jsx(EyeIcon, { className: "w-5 h-5" })) })] }) }), !pwdMatch && form.confirm_password && (_jsx(SmallError, { children: "Password tidak sama." })), _jsx("div", { className: "pt-2 flex justify-end", children: _jsxs("button", { type: "button", onClick: handleNext, disabled: !step1Valid || loading, className: "inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium disabled:opacity-60 disabled:cursor-not-allowed", style: styles.primaryBtn, children: ["Lanjutkan", _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", style: { color: theme.black1 }, children: "Pertanyaan Keamanan" }), _jsxs("select", { name: "security_question", value: form.security_question, onChange: onChange("security_question"), required: true, className: "w-full rounded-xl border px-4 py-3 mt-2 outline-none", style: {
                                                ...styles.input,
                                                boxShadow: `0 0 0 0px transparent`,
                                            }, onFocus: (e) => (e.currentTarget.style.boxShadow = styles.ringFocus), onBlur: (e) => (e.currentTarget.style.boxShadow = "none"), children: [_jsx("option", { value: "", children: "Pilih pertanyaan\u2026" }), securityQuestions.map((q) => (_jsx("option", { value: q, children: q }, q)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", style: { color: theme.black1 }, children: "Jawaban Keamanan" }), _jsx("input", { type: "text", name: "security_answer", value: form.security_answer, onChange: onChange("security_answer"), required: true, className: "w-full rounded-xl border px-4 py-3 mt-2 outline-none", style: {
                                                ...styles.input,
                                                boxShadow: `0 0 0 0px transparent`,
                                            }, onFocus: (e) => (e.currentTarget.style.boxShadow = styles.ringFocus), onBlur: (e) => (e.currentTarget.style.boxShadow = "none") })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs", style: styles.muted, children: [_jsx(ShieldCheck, { className: "h-4 w-4" }), "Data Anda disimpan dan dienkripsi sesuai kebijakan kami."] }), _jsxs("div", { className: "pt-2 flex items-center justify-between", children: [_jsxs("button", { type: "button", onClick: handleBack, className: "inline-flex items-center gap-2 rounded-xl px-4 py-2 border", style: styles.ghostBtn, children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " Kembali"] }), _jsx("button", { type: "submit", disabled: !step2Valid || loading, className: "inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium disabled:opacity-60 disabled:cursor-not-allowed", style: styles.primaryBtn, children: loading ? (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" })] }), "Mendaftar\u2026"] })) : (_jsxs(_Fragment, { children: ["Selesaikan Pendaftaran", " ", _jsx(CheckCircle2, { className: "h-4 w-4" })] })) })] })] })) })] })] }));
}
/* =======================
   Small Presentational Bits
======================= */
function Field({ label, icon, children, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium", children: label }), _jsxs("div", { className: "relative mt-2", children: [_jsx("span", { className: "absolute inset-y-0 left-3 flex items-center", children: icon }), children] })] }));
}
function SmallError({ children }) {
    return _jsx("p", { className: "mt-1 text-xs text-red-500", children: children });
}
