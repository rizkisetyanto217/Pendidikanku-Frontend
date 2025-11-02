import React, { useState, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  EyeIcon,
  EyeOffIcon,
  ArrowRight,
  Building2,
  GraduationCap,
  Users2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ChevronRight,
  Apple,
} from "lucide-react";

import AuthLayout from "@/layout/CAuthLayout";
import api, { setTokens, setActiveschoolContext } from "@/lib/axios";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import ModalJoinOrCreate from "./components/CModalJoinOrCreate";
import ModalChooseRole from "./components/CModalChoose";
import ModalDemoAccounts from "./components/CModalDemoAccount";

type schoolRole = "dkm" | "admin" | "teacher" | "student" | "user";
type schoolItem = {
  school_id: string;
  school_name: string;
  school_icon_url?: string;
  roles: schoolRole[];
};

/* =========================
   Modal: Pilih school & Role
========================= */
function ModalSelectRoleschool({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (schoolId: string, role: schoolRole) => void;
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  const [schools, setschools] = React.useState<schoolItem[]>([]);
  const [selected, setSelected] = React.useState<{
    school_id: string;
    role: schoolRole;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    if (!open) return;
    setLoading(true);
    api
      .get("/auth/me/simple-context")
      .then((res) => {
        if (!mounted) return;
        const memberships = res.data?.data?.memberships ?? [];
        const mapped: schoolItem[] = memberships.map((m: any) => ({
          school_id: m.school_id,
          school_name: m.school_name,
          school_icon_url: m.school_icon_url,
          roles: (m.roles ?? []) as schoolRole[],
        }));
        setschools(mapped);
      })
      .catch(() => {
        if (!mounted) return;
        setschools([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Pilih school dan Role"
    >
      <div
        className="rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ background: palette.white1, color: palette.black1 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.quaternary})`,
            }}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: palette.black1 }}>
            Pilih school & Role
          </h2>
        </div>
        <p className="text-sm mb-6" style={{ color: palette.silver2 }}>
          Pilih school dan peran yang ingin kamu gunakan untuk melanjutkan.
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div
              className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3"
              style={{
                borderColor: palette.primary2,
                borderTopColor: palette.primary,
              }}
            />
            <p className="text-sm" style={{ color: palette.silver2 }}>
              Memuat data...
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
            {schools.map((m) => (
              <div
                key={m.school_id}
                onClick={() =>
                  setSelected((prev) => {
                    const keepCurrentRole =
                      prev?.school_id === m.school_id && prev?.role
                        ? prev.role
                        : undefined;
                    const fallbackRole: schoolRole =
                      keepCurrentRole ?? (m.roles?.[0] as schoolRole) ?? "user";
                    return { school_id: m.school_id, role: fallbackRole };
                  })
                }
                className="border-2 rounded-2xl p-4 transition-all duration-200 cursor-pointer"
                style={{
                  borderColor:
                    selected?.school_id === m.school_id
                      ? palette.primary
                      : palette.silver1,
                  background:
                    selected?.school_id === m.school_id
                      ? palette.primary2
                      : palette.white2,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={m.school_icon_url || "/image/Gambar-school.jpeg"}
                    alt={m.school_name}
                    className="w-12 h-12 rounded-xl object-cover border-2 shadow-sm"
                    style={{ borderColor: palette.white3 }}
                  />
                  <span
                    className="font-semibold text-base"
                    style={{ color: palette.black1 }}
                  >
                    {m.school_name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(m.roles?.length ? m.roles : (["user"] as schoolRole[])).map(
                    (r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected({ school_id: m.school_id, role: r });
                        }}
                        className="px-4 py-1.5 text-xs font-medium rounded-lg border-2 transition-all duration-200"
                        style={{
                          background:
                            selected?.school_id === m.school_id &&
                            selected?.role === r
                              ? palette.primary
                              : "transparent",
                          color:
                            selected?.school_id === m.school_id &&
                            selected?.role === r
                              ? palette.white1
                              : palette.black1,
                          borderColor:
                            selected?.school_id === m.school_id &&
                            selected?.role === r
                              ? palette.primary
                              : palette.silver1,
                        }}
                        aria-pressed={
                          selected?.school_id === m.school_id &&
                          selected?.role === r
                        }
                      >
                        {r.toUpperCase()}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
            style={{
              background: palette.white2,
              color: palette.black1,
              border: `1px solid ${palette.silver1}`,
            }}
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={() =>
              selected && onSelect(selected.school_id, selected.role)
            }
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              background: `linear-gradient(to right, ${palette.primary}, ${palette.quaternary})`,
              color: palette.white1,
              boxShadow: `0 4px 10px ${palette.primary2}`,
            }}
          >
            <CheckCircle2 className="w-4 h-4" /> Pilih & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Halaman Login (polished)
========================= */
export default function Login() {
  const navigate = useNavigate();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false); // NEW
  const [remember, setRemember] = useState(false); // NEW
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openSelectschool, setOpenSelectschool] = useState(false);
  const [openPilihTujuan, setOpenPilihTujuan] = useState(false);
  const [openJoinAtauBuat, setOpenJoinAtauBuat] = useState(false);
  const [selectedTujuan, setSelectedTujuan] = useState<
    "dkm" | "teacher" | "student" | null
  >(null);

  // NEW: strength meter (0-4)
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  }, [password]);
  const strengthLabel = [
    "Sangat lemah",
    "Lemah",
    "Cukup",
    "Kuat",
    "Sangat kuat",
  ][strength];

  // di dalam Login component (state):
  const [openDemo, setOpenDemo] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", {
        identifier,
        password,
        remember_me: remember,
      });
      const { access_token } = res.data?.data ?? {};
      if (!access_token) throw new Error("Token tidak ditemukan.");

      setTokens(access_token);

      const ctx = await api.get("/auth/me/simple-context");
      const memberships = ctx.data?.data?.memberships ?? [];

      if (memberships.length === 0) {
        setOpenPilihTujuan(true);
        return;
      }

      if (memberships.length === 1) {
        const m = memberships[0];
        const role: schoolRole = (m.roles?.[0] as schoolRole) ?? "user";
        await handleSelectschoolRole(m.school_id, role);
        return;
      }

      setOpenSelectschool(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  function handleChooseRole(tujuan: "dkm" | "teacher" | "student") {
    setSelectedTujuan(tujuan);
    setOpenPilihTujuan(false);
    setOpenJoinAtauBuat(true);
  }

  async function handleCreateschool(data: { name: string; file?: File }) {
    try {
      const fd = new FormData();
      fd.append("school_name", data.name);
      if (data.file) fd.append("icon", data.file);

      const res = await api.post("/u/schools/user", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const item = res.data?.data?.item;
      if (!item) throw new Error("school gagal dibuat.");

      const schoolId = item.school_id;
      await setActiveschoolContext(schoolId, "dkm");

      setOpenJoinAtauBuat(false);
      navigate(`/${schoolId}/sekolah`, { replace: true });
    } catch (err: any) {
      alert(
        err?.response?.data?.message || err?.message || "Gagal membuat school."
      );
    }
  }

  async function handleJoinSekolah(code: string, role: "teacher" | "student") {
    try {
      await api.post("/u/student-class-sections/join", { student_code: code });

      const ctx = await api.get("/auth/me/simple-context");
      const memberships = ctx.data?.data?.memberships ?? [];
      if (memberships.length > 0) {
        const m = memberships[0];
        await setActiveschoolContext(m.school_id, role);
        const path = role === "teacher" ? "guru" : "murid";
        navigate(`/${m.school_id}/${path}`, { replace: true });
      }
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal bergabung ke sekolah."
      );
    }
  }

  async function handleSelectschoolRole(schoolId: string, role: schoolRole) {
    try {
      const res = await api.get("/auth/me/simple-context");
      const m = (res.data?.data?.memberships ?? []).find(
        (x: any) => x.school_id === schoolId
      );
      try {
        localStorage.setItem("active_role", role);
      } catch {}
      await setActiveschoolContext(schoolId, role, {
        name: m?.school_name ?? undefined,
        icon: m?.school_icon_url ?? undefined,
      });
      const path =
        role === "teacher" ? "guru" : role === "student" ? "murid" : "sekolah";
      navigate(`/${schoolId}/${path}`, { replace: true });
    } catch (err) {
      console.error(err);
    }
  }

  // Quick-fill demo helper
  const quickFill = (who: "admin" | "teacher" | "student") => {
    setIdentifier(`${who}@demo.id`);
    setPassword("Demo@12345");
  };

  return (
    <AuthLayout mode="login" fullWidth contentClassName="max-w-xl mx-auto">
      {/* Brand header mini */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl grid place-items-center"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.quaternary})`,
            }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">Pendidikanku</h1>
            <p className="text-xs" style={{ color: palette.silver2 }}>
              Satu akun untuk sekolah, guru, dan murid.
            </p>
          </div>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 text-xs px-2 py-1 rounded-full"
          style={{
            border: `1px solid ${palette.silver1}`,
            background: palette.white2,
          }}
        >
          <ShieldCheck className="w-4 h-4" />
          Aman & terenkripsi
        </div>
      </div>
      {/* Alert error */}
      {error && (
        <div
          className="mb-6 text-sm rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300"
          style={{
            color: palette.error1,
            background: palette.error2,
            border: `2px solid ${palette.error1}`,
          }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: palette.error1, color: palette.white1 }}
            aria-hidden
          >
            <span className="text-xs font-bold">!</span>
          </div>
          <span role="alert">{error}</span>
        </div>
      )}
      {/* SSO buttons */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => (window.location.href = "/auth/oauth/google")}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: palette.white1,
            border: `1px solid ${palette.silver1}`,
            color: palette.black1,
          }}
        >
          <img src="/google.svg" alt="" className="w-5 h-5" />
          Lanjut dengan Google
        </button>
        <button
          type="button"
          onClick={() => alert("Apple SSO coming soon")}
          className="rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          style={{
            background: palette.white1,
            border: `1px solid ${palette.silver1}`,
            color: palette.black1,
          }}
        >
          <Apple className="w-5 h-5" />
          Lanjut dengan Apple
        </button>
      </div> */}
      {/* Divider */}
      {/* <div className="flex items-center gap-3 mb-6">
        <div
          className="flex-1"
          style={{ height: 1, background: palette.white3 || palette.silver1 }}
        />
        <span className="text-xs" style={{ color: palette.silver2 }}>
          atau masuk dengan email
        </span>
        <div
          className="flex-1"
          style={{ height: 1, background: palette.white3 || palette.silver1 }}
        />
      </div> */}
      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Email / Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Mail className="w-4 h-4" style={{ color: palette.silver2 }} />
            </span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-xl pl-10 pr-3 py-3 outline-none transition-all"
              placeholder="Masukkan email atau username"
              required
              autoComplete="username"
              style={{
                background: palette.white2,
                border: `2px solid ${palette.silver1}`,
                color: palette.black1,
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <KeyRound
                className="w-4 h-4"
                style={{ color: palette.silver2 }}
              />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) =>
                setCapsLockOn((e as any).getModifierState?.("CapsLock"))
              }
              className="w-full rounded-xl pl-10 pr-12 py-3 outline-none transition-all"
              placeholder="Masukkan password"
              required
              autoComplete="current-password"
              style={{
                background: palette.white2,
                border: `2px solid ${palette.silver1}`,
                color: palette.black1,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1"
              style={{
                color: palette.silver2,
                background: palette.white1,
                border: `1px solid ${palette.silver1}`,
              }}
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* CapsLock hint */}
          {capsLockOn && (
            <div
              className="mt-2 flex items-center gap-2 text-xs"
              style={{ color: palette.error1 }}
            >
              <Lock className="w-3.5 h-3.5" />
              Caps Lock aktif
            </div>
          )}

          {/* Strength meter */}
          <div className="mt-3">
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: palette.white3 || palette.silver1 }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${(strength / 4) * 100}%`,
                  background:
                    strength >= 3
                      ? palette.success1 || "#16a34a"
                      : strength === 2
                        ? palette.quaternary
                        : palette.error1,
                }}
              />
            </div>
            <div
              className="mt-1 text-xs"
              style={{
                color:
                  strength >= 3
                    ? palette.success1 || "#16a34a"
                    : palette.silver2,
              }}
            >
              Kekuatan password: {strengthLabel}
            </div>
          </div>
        </div>

        {/* Remember + forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-current"
              style={{ accentColor: palette.primary as any }}
            />
            Ingat saya
          </label>
          <Link
            to="/forgot-password"
            className="text-sm hover:underline"
            style={{ color: palette.primary }}
          >
            Lupa password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
          style={{
            background: `linear-gradient(to right, ${palette.primary}, ${palette.quaternary})`,
            color: palette.white1,
            boxShadow: `0 4px 10px ${palette.primary2}`,
          }}
        >
          {loading ? (
            <>
              <div
                className="w-5 h-5 border-2 rounded-full animate-spin"
                style={{
                  borderColor: `${palette.white1}40`,
                  borderTopColor: palette.white1,
                }}
              />
              Memproses...
            </>
          ) : (
            <>
              Masuk ke Akun
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
      {/* Quick actions */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpenDemo(true)}
          className="w-full text-sm rounded-lg px-3 py-2 flex items-center justify-center gap-2"
          style={{
            background: palette.white2,
            border: `1px solid ${palette.silver1}`,
            color: palette.black1,
          }}
        >
          <Sparkles className="w-4 h-4" />
          Coba akun demo
        </button>
      </div>
      <ModalDemoAccounts
        open={openDemo}
        onClose={() => setOpenDemo(false)}
        onPick={(who) => {
          quickFill(who); // set identifier & password
          setOpenDemo(false);
        }}
      />
      {/* Foot microcopy */}
      <div
        className="mt-6 text-[11px] flex items-center justify-between"
        style={{ color: palette.silver2 }}
      >
        <span>
          Dengan masuk, kamu menyetujui{" "}
          <Link to="/terms" className="underline">
            Ketentuan
          </Link>{" "}
          &{" "}
          <Link to="/privacy" className="underline">
            Privasi
          </Link>
          .
        </span>
        <span className="hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Akses cepat ke fitur terbaru
        </span>
      </div>
      {/* Modals */}
      <ModalSelectRoleschool
        open={openSelectschool}
        onClose={() => setOpenSelectschool(false)}
        onSelect={handleSelectschoolRole}
      />
      <ModalChooseRole
        open={openPilihTujuan}
        onClose={() => setOpenPilihTujuan(false)}
        onPilih={handleChooseRole}
      />
      <ModalJoinOrCreate
        open={openJoinAtauBuat}
        mode={selectedTujuan || "dkm"}
        onClose={() => setOpenJoinAtauBuat(false)}
        onCreateschool={handleCreateschool}
        onJoinSekolah={handleJoinSekolah}
      />
    </AuthLayout>
  );
}
