// src/pages/auth/Register.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layout/CAuthLayout";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import api from "@/lib/axios";
// import GoogleIdentityButton from "@/pages/dashboard/auth/components/GoogleIdentityButton";
import {
  EyeIcon,
  EyeOffIcon,
  Mail,
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Check,
  X,
  Sparkles,
} from "lucide-react";

type FormState = {
  user_name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export default function Register() {
  const [form, setForm] = useState<FormState>({
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
  const theme = pickTheme(themeName as ThemeName, isDark);

  const styles = useMemo(
    () => ({
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
    }),
    [theme, loading, isDark]
  );

  const emailValid = /^\S+@\S+\.\S+$/.test(form.email);
  const usernameValid = form.user_name.trim().length >= 3;
  const passwordValid = form.password.length >= 8;
  const pwdMatch =
    form.password === form.confirm_password && form.password.length > 0;
  const formValid = usernameValid && emailValid && passwordValid && pwdMatch;

  // Password strength indicators
  const hasUpperCase = /[A-Z]/.test(form.password);
  const hasLowerCase = /[a-z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const hasMinLength = form.password.length >= 8;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formValid) return;
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
      } else {
        setError(res.data?.message || "Gagal mendaftar. Silakan coba lagi.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout mode="register" fullWidth contentClassName="max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20"></div>
          <img
            src="https://picsum.photos/200/300"
            alt="Logo"
            className="relative h-20 w-20 rounded-2xl mx-auto object-cover shadow-xl border-2 border-white"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          SekolahIslamku Suite
        </h1>
        <p className="text-sm max-w-sm mx-auto" style={styles.muted}>
          Satu platform untuk operasional sekolah yang rapi & efisien
        </p>
      </div>

      {/* Main Card */}
      <div
        className="max-w-md mx-auto rounded-3xl p-8 shadow-2xl border transition-all hover:shadow-3xl animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={styles.card}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: theme.black1 }}>
            Buat Akun Baru
          </h2>
        </div>

        {/* <div className="mb-6">
          <GoogleIdentityButton
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            onSuccess={() => navigate("/register-detail-sekolah")}
            theme={isDark ? "outline" : "filled_blue"}
            size="large"
            text="signup_with"
            className="w-full rounded-xl"
          />
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={styles.divider} />
            <span className="text-xs font-medium" style={styles.muted}>
              atau daftar manual
            </span>
            <div className="h-px flex-1" style={styles.divider} />
          </div>
        </div> */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl px-4 py-4 text-sm border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 text-red-700 animate-in slide-in-from-top-2 duration-300">
            <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="h-3.5 w-3.5" />
            </div>
            <span className="flex-1">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl px-4 py-4 text-sm border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 text-green-700 animate-in slide-in-from-top-2 duration-300">
            <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <span className="flex-1">{success}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputField
            label="Username"
            icon={<User className="h-5 w-5" style={styles.muted} />}
            value={form.user_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, user_name: e.target.value }))
            }
            placeholder="Minimal 3 karakter"
            styles={styles}
            valid={usernameValid || form.user_name.length === 0}
            showValidation={form.user_name.length > 0}
            validationMessage={
              usernameValid ? "Username tersedia" : "Minimal 3 karakter"
            }
          />

          <InputField
            label="Email"
            type="email"
            icon={<Mail className="h-5 w-5" style={styles.muted} />}
            value={form.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
            placeholder="nama@email.com"
            styles={styles}
            valid={emailValid || form.email.length === 0}
            showValidation={form.email.length > 0}
            validationMessage={
              emailValid ? "Format email valid" : "Format email tidak valid"
            }
          />

          <PasswordField
            label="Password"
            value={form.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            show={showPw}
            toggle={() => setShowPw((s) => !s)}
            styles={styles}
          />

          {/* Password Strength Indicator */}
          {form.password.length > 0 && (
            <div className="space-y-2 -mt-2 animate-in slide-in-from-top-2 duration-300">
              <div className="flex gap-1">
                {[hasMinLength, hasLowerCase, hasUpperCase, hasNumber].map(
                  (met, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        met
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <PasswordRequirement
                  met={hasMinLength}
                  text="Min. 8 karakter"
                />
                <PasswordRequirement met={hasLowerCase} text="Huruf kecil" />
                <PasswordRequirement met={hasUpperCase} text="Huruf besar" />
                <PasswordRequirement met={hasNumber} text="Angka" />
              </div>
            </div>
          )}

          <PasswordField
            label="Konfirmasi Password"
            value={form.confirm_password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((f) => ({ ...f, confirm_password: e.target.value }))
            }
            show={showPw2}
            toggle={() => setShowPw2((s) => !s)}
            styles={styles}
            valid={pwdMatch || form.confirm_password.length === 0}
            showValidation={form.confirm_password.length > 0}
            validationMessage={
              pwdMatch ? "Password cocok" : "Password tidak cocok"
            }
          />

          <button
            type="submit"
            disabled={!formValid || loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-8 shadow-lg relative overflow-hidden group"
            style={{
              background:
                formValid && !loading
                  ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
                  : styles.primaryBtn.backgroundColor,
              color: styles.primaryBtn.color,
            }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (
              <>
                Buat Akun
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Login Link - Outside Card */}
      <div className="mt-6 text-center text-sm">
        <span style={styles.muted}>Sudah punya akun? </span>
        <button
          onClick={() => navigate("/login")}
          className="font-semibold hover:underline inline-flex items-center gap-1 transition-all hover:gap-2"
          style={{ color: theme.primary }}
        >
          Login
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </AuthLayout>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 ${met ? "text-green-600" : "text-gray-400"}`}
    >
      {met ? (
        <Check className="h-3.5 w-3.5 flex-shrink-0" />
      ) : (
        <X className="h-3.5 w-3.5 flex-shrink-0" />
      )}
      <span>{text}</span>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  styles,
  valid = true,
  showValidation = false,
  validationMessage = "",
}: any) {
  return (
    <div>
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: styles.input.color }}
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border-2 pl-11 pr-4 py-3 outline-none transition-all ${
            !valid && value.length > 0
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          }`}
          style={{
            ...styles.input,
            borderColor:
              !valid && value.length > 0 ? "#f87171" : styles.input.borderColor,
          }}
        />
        {showValidation && (
          <span
            className={`absolute inset-y-0 right-3 flex items-center ${
              valid ? "text-green-500" : "text-red-500"
            }`}
          >
            {valid ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </span>
        )}
      </div>
      {showValidation && validationMessage && (
        <p
          className={`mt-1.5 text-xs flex items-center gap-1 ${
            valid ? "text-green-600" : "text-red-600"
          }`}
        >
          {validationMessage}
        </p>
      )}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggle,
  styles,
  valid = true,
  showValidation = false,
  validationMessage = "",
}: any) {
  return (
    <div>
      <label
        className="block text-sm font-semibold mb-2"
        style={{ color: styles.input.color }}
      >
        {label}
      </label>
      <div className="relative">
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 z-10"
          style={styles.muted}
        />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border-2 pl-11 pr-12 py-3 outline-none transition-all ${
            !valid && value.length > 0
              ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          }`}
          style={{
            ...styles.input,
            borderColor:
              !valid && value.length > 0 ? "#f87171" : styles.input.borderColor,
          }}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {show ? (
            <EyeOffIcon className="h-5 w-5" style={styles.muted} />
          ) : (
            <EyeIcon className="h-5 w-5" style={styles.muted} />
          )}
        </button>
      </div>
      {showValidation && validationMessage && (
        <p
          className={`mt-1.5 text-xs flex items-center gap-1 ${
            valid ? "text-green-600" : "text-red-600"
          }`}
        >
          {validationMessage}
        </p>
      )}
    </div>
  );
}
