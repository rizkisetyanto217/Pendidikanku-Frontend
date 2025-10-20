import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/auth/Register.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import api from "@/lib/axios";
import { EyeIcon, EyeOffIcon, Mail, User, Lock, CheckCircle2, AlertCircle, ArrowRight, } from "lucide-react";
export default function Register() {
    const [form, setForm] = useState({
        user_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showPw2, setShowPw2] = useState(false);
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
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
        divider: { backgroundColor: theme.white3 },
    }), [theme, loading, isDark]);
    const emailValid = /^\S+@\S+\.\S+$/.test(form.email);
    const usernameValid = form.user_name.trim().length >= 3;
    const passwordValid = form.password.length >= 8;
    const pwdMatch = form.password === form.confirm_password && form.password.length > 0;
    const formValid = usernameValid && emailValid && passwordValid && pwdMatch;
    async function handleSubmit(e) {
        e.preventDefault();
        if (!formValid)
            return;
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const payload = {
                user_name: form.user_name,
                email: form.email,
                password: form.password,
            };
            const res = await api.post("/auth/register", payload);
            if (res.status === 201 || res.data?.success) {
                setSuccess("Pendaftaran berhasil! Silakan login.");
                setTimeout(() => navigate("/login"), 1200);
            }
            else {
                setError(res.data?.message || "Gagal mendaftar. Silakan coba lagi.");
            }
        }
        catch (err) {
            setError(err?.response?.data?.message || err?.message || "Terjadi kesalahan.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs(AuthLayout, { mode: "register", fullWidth: true, contentClassName: "max-w-md mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("img", { src: "https://picsum.photos/200/300", alt: "Logo", className: "h-16 w-16 rounded-2xl mx-auto mb-4 object-cover shadow-md" }), _jsx("h1", { className: "text-2xl font-bold mb-1", style: { color: theme.black1 }, children: "SekolahIslamku Suite" }), _jsx("p", { className: "text-sm", style: styles.muted, children: "Satu platform untuk operasional sekolah yang rapi & efisien" })] }), _jsxs("div", { className: "max-w-md mx-auto rounded-2xl p-8 shadow-lg border transition-shadow hover:shadow-xl", style: styles.card, children: [_jsx("h2", { className: "text-xl font-semibold mb-6", style: { color: theme.black1 }, children: "Buat Akun Baru" }), error && (_jsxs("div", { className: "mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-sm border border-red-200 bg-red-50 text-red-700", children: [_jsx(AlertCircle, { className: "h-5 w-5 flex-shrink-0 mt-0.5" }), _jsx("span", { children: error })] })), success && (_jsxs("div", { className: "mb-6 flex items-start gap-3 rounded-xl px-4 py-3 text-sm border border-green-200 bg-green-50 text-green-700", children: [_jsx(CheckCircle2, { className: "h-5 w-5 flex-shrink-0 mt-0.5" }), _jsx("span", { children: success })] })), _jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [_jsx(InputField, { label: "Username", icon: _jsx(User, { className: "h-5 w-5", style: styles.muted }), value: form.user_name, onChange: (e) => setForm((f) => ({ ...f, user_name: e.target.value })), placeholder: "Minimal 3 karakter", styles: styles, valid: usernameValid || form.user_name.length === 0 }), _jsx(InputField, { label: "Email", type: "email", icon: _jsx(Mail, { className: "h-5 w-5", style: styles.muted }), value: form.email, onChange: (e) => setForm((f) => ({ ...f, email: e.target.value })), placeholder: "nama@email.com", styles: styles, valid: emailValid || form.email.length === 0 }), _jsx(PasswordField, { label: "Password", value: form.password, onChange: (e) => setForm((f) => ({ ...f, password: e.target.value })), show: showPw, toggle: () => setShowPw((s) => !s), styles: styles, helper: "\u22658 karakter, kombinasi huruf & angka" }), _jsx(PasswordField, { label: "Konfirmasi Password", value: form.confirm_password, onChange: (e) => setForm((f) => ({ ...f, confirm_password: e.target.value })), show: showPw2, toggle: () => setShowPw2((s) => !s), styles: styles, valid: pwdMatch || form.confirm_password.length === 0 }), _jsxs("button", { type: "submit", disabled: !formValid || loading, className: "w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all hover:opacity-90 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed", style: styles.primaryBtn, children: [loading ? "Memproses..." : "Daftar", _jsx(ArrowRight, { className: "h-4 w-4" })] })] }), _jsxs("div", { className: "mt-6 text-center text-sm", children: [_jsx("span", { style: styles.muted, children: "Sudah punya akun? " }), _jsx("button", { onClick: () => navigate("/login"), className: "font-semibold hover:underline", style: { color: theme.primary }, children: "Login" })] })] })] }));
}
function InputField({ label, type = "text", value, onChange, placeholder, icon, styles, valid = true, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", style: { color: styles.input.color }, children: label }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute inset-y-0 left-3 flex items-center pointer-events-none", children: icon }), _jsx("input", { type: type, value: value, onChange: onChange, placeholder: placeholder, className: `w-full rounded-xl border pl-10 pr-4 py-3 outline-none transition-all focus:ring-2 ${!valid && value.length > 0 ? "border-red-400" : ""}`, style: {
                            ...styles.input,
                            borderColor: !valid && value.length > 0 ? "#f87171" : styles.input.borderColor,
                        } })] })] }));
}
function PasswordField({ label, value, onChange, show, toggle, styles, helper, valid = true, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold mb-2", style: { color: styles.input.color }, children: label }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5", style: styles.muted }), _jsx("input", { type: show ? "text" : "password", value: value, onChange: onChange, className: `w-full rounded-xl border pl-10 pr-12 py-3 outline-none transition-all focus:ring-2 ${!valid && value.length > 0 ? "border-red-400" : ""}`, style: {
                            ...styles.input,
                            borderColor: !valid && value.length > 0 ? "#f87171" : styles.input.borderColor,
                        } }), _jsx("button", { type: "button", onClick: toggle, className: "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 transition-colors", children: show ? (_jsx(EyeOffIcon, { className: "h-5 w-5", style: styles.muted })) : (_jsx(EyeIcon, { className: "h-5 w-5", style: styles.muted })) })] }), helper && (_jsx("p", { className: "mt-1.5 text-xs", style: styles.muted, children: helper }))] }));
}
