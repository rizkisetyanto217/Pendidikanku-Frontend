import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeOffIcon,
  ArrowRight,
  Building2,
  GraduationCap,
  Users2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import AuthLayout from "@/layout/AuthLayout";
import api, { setTokens } from "@/lib/axios";
import LegalModal from "@/pages/dashboard/auth/components/LegalPrivacyModal";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

type MasjidRole = "dkm" | "admin" | "teacher" | "student" | "user";
type MasjidItem = {
  masjid_id: string;
  masjid_name: string;
  masjid_icon_url?: string;
  roles: MasjidRole[];
};

function ModalSelectRoleMasjid({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (masjidId: string, role: MasjidRole) => void;
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  const [masjids, setMasjids] = useState<MasjidItem[]>([]);
  const [selected, setSelected] = useState<{
    masjid_id: string;
    role: MasjidRole;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .get("/auth/me/simple-context")
      .then((res) => {
        const memberships = res.data?.data?.memberships ?? [];
        const mapped = memberships.map((m: any) => ({
          masjid_id: m.masjid_id,
          masjid_name: m.masjid_name,
          masjid_icon_url: m.masjid_icon_url,
          roles: m.roles ?? [],
        }));
        setMasjids(mapped);
      })
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
            Pilih Masjid & Role
          </h2>
        </div>
        <p className="text-sm mb-6" style={{ color: palette.silver2 }}>
          Pilih masjid dan peran yang ingin kamu gunakan untuk melanjutkan.
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div
              className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3"
              style={{
                borderColor: palette.primary2,
                borderTopColor: palette.primary,
              }}
            ></div>
            <p className="text-sm" style={{ color: palette.silver2 }}>
              Memuat data...
            </p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
            {masjids.map((m) => (
              <div
                key={m.masjid_id}
                onClick={() =>
                  setSelected({
                    masjid_id: m.masjid_id,
                    role: selected?.role || m.roles[0],
                  })
                }
                className="border-2 rounded-2xl p-4 transition-all duration-200 cursor-pointer"
                style={{
                  borderColor:
                    selected?.masjid_id === m.masjid_id
                      ? palette.primary
                      : palette.silver1,
                  background:
                    selected?.masjid_id === m.masjid_id
                      ? palette.primary2
                      : palette.white2,
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={m.masjid_icon_url || "/image/Gambar-Masjid.jpeg"}
                    alt={m.masjid_name}
                    className="w-12 h-12 rounded-xl object-cover border-2 shadow-sm"
                    style={{ borderColor: palette.white3 }}
                  />
                  <span
                    className="font-semibold text-base"
                    style={{ color: palette.black1 }}
                  >
                    {m.masjid_name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {m.roles.map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        setSelected({ masjid_id: m.masjid_id, role: r })
                      }
                      className="px-4 py-1.5 text-xs font-medium rounded-lg border-2 transition-all duration-200"
                      style={{
                        background:
                          selected?.masjid_id === m.masjid_id &&
                          selected?.role === r
                            ? palette.primary
                            : "transparent",
                        color:
                          selected?.masjid_id === m.masjid_id &&
                          selected?.role === r
                            ? palette.white1
                            : palette.black1,
                        borderColor:
                          selected?.masjid_id === m.masjid_id &&
                          selected?.role === r
                            ? palette.primary
                            : palette.silver1,
                      }}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
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
            disabled={!selected}
            onClick={() =>
              selected && onSelect(selected.masjid_id, selected.role)
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

function ModalPilihTujuan({
  open,
  onClose,
  onPilih,
}: {
  open: boolean;
  onClose: () => void;
  onPilih: (tujuan: "dkm" | "teacher" | "student") => void;
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="rounded-3xl p-8 w-full max-w-md text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ background: palette.white1, color: palette.black1 }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{
            background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.quaternary})`,
          }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Apa peran Anda?</h2>
          <p className="text-sm" style={{ color: palette.silver2 }}>
            Pilih tujuan Anda bergabung di SekolahIslamKu
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => onPilih("dkm")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.secondary})`,
              }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Jadi DKM / Admin Masjid</span>
          </button>
          <button
            onClick={() => onPilih("teacher")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to bottom right, ${palette.success1}, ${palette.secondary})`,
              }}
            >
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Gabung Sebagai Guru</span>
          </button>
          <button
            onClick={() => onPilih("student")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to bottom right, ${palette.quaternary}, ${palette.secondary})`,
              }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Gabung Sebagai Murid</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-sm font-medium transition-colors"
          style={{ color: palette.silver2 }}
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
}

function ModalJoinAtauBuat({
  open,
  mode,
  onClose,
  onCreateMasjid,
  onJoinSekolah,
}: {
  open: boolean;
  mode: "dkm" | "teacher" | "student";
  onClose: () => void;
  onCreateMasjid: (data: { name: string; file?: File }) => void;
  onJoinSekolah: (code: string, role: "teacher" | "student") => void;
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  const [masjidName, setMasjidName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ background: palette.white1, color: palette.black1 }}
      >
        {mode === "dkm" ? (
          <>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.quaternary})`,
                }}
              >
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Buat Masjid Baru</h2>
                <p className="text-sm" style={{ color: palette.silver2 }}>
                  Daftarkan masjid Anda ke sistem
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Masjid
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Masjid Al-Ikhlas"
                  value={masjidName}
                  onChange={(e) => setMasjidName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 outline-none transition-all"
                  style={{
                    background: palette.white2,
                    border: `2px solid ${palette.silver1}`,
                    color: palette.black1,
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo Masjid (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
              </div>
            </div>
            <button
              disabled={!masjidName.trim() || loading}
              onClick={() => {
                setLoading(true);
                onCreateMasjid({
                  name: masjidName,
                  file: iconFile || undefined,
                });
              }}
              className="w-full py-3.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                background: `linear-gradient(to right, ${palette.success1}, ${palette.secondary})`,
                color: palette.white1,
                boxShadow: `0 4px 10px ${palette.success2}`,
              }}
            >
              {loading ? "Membuat Masjid..." : "Buat Masjid"}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${palette.quaternary}, ${palette.primary})`,
                }}
              >
                {mode === "teacher" ? (
                  <Users2 className="w-6 h-6 text-white" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">Gabung ke Sekolah</h2>
                <p className="text-sm" style={{ color: palette.silver2 }}>
                  Masukkan kode akses dari admin sekolah
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Kode Akses Sekolah
              </label>
              <input
                type="text"
                placeholder="Masukkan kode akses"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-center font-mono text-lg tracking-wider outline-none transition-all"
                style={{
                  background: palette.white2,
                  border: `2px solid ${palette.silver1}`,
                  color: palette.black1,
                }}
              />
            </div>
            <button
              disabled={!accessCode.trim() || loading}
              onClick={() => {
                setLoading(true);
                onJoinSekolah(accessCode, mode);
              }}
              className="w-full py-3.5 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                background: `linear-gradient(to right, ${palette.quaternary}, ${palette.primary})`,
                color: palette.white1,
                boxShadow: `0 4px 10px ${palette.primary2}`,
              }}
            >
              {loading ? "Memproses..." : "Gabung Sekarang"}
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full text-sm font-medium transition-colors"
          style={{ color: palette.silver2 }}
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openSelectMasjid, setOpenSelectMasjid] = useState(false);
  const [openPilihTujuan, setOpenPilihTujuan] = useState(false);
  const [openJoinAtauBuat, setOpenJoinAtauBuat] = useState(false);
  const [selectedTujuan, setSelectedTujuan] = useState<
    "dkm" | "teacher" | "student" | null
  >(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { identifier, password });
      const { access_token, refresh_token } = res.data.data;
      setTokens(access_token, refresh_token);

      const ctx = await api.get("/auth/me/simple-context");
      const memberships = ctx.data?.data?.memberships ?? [];

      if (memberships.length === 0) return setOpenPilihTujuan(true);
      if (memberships.length === 1) {
        const m = memberships[0];
        const role = m.roles?.[0] ?? "user";
        handleSelectMasjidRole(m.masjid_id, role);
        return;
      }

      setOpenSelectMasjid(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  function handlePilihTujuan(tujuan: "dkm" | "teacher" | "student") {
    setSelectedTujuan(tujuan);
    setOpenPilihTujuan(false);
    setOpenJoinAtauBuat(true);
  }

  async function handleCreateMasjid(data: { name: string; file?: File }) {
    try {
      const fd = new FormData();
      fd.append("masjid_name", data.name);
      if (data.file) fd.append("icon", data.file);

      const res = await api.post("/u/masjids/user", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const item = res.data?.data?.item;
      if (!item) throw new Error("Masjid gagal dibuat.");

      const masjidId = item.masjid_id;
      const name = item.masjid_name || data.name;
      const iconUrl = item.masjid_icon_url || "/image/Gambar-Masjid.jpeg";

      const activeMasjid = {
        masjid_id: masjidId,
        masjid_name: name,
        masjid_icon_url: iconUrl,
      };
      localStorage.setItem("active_masjid", JSON.stringify(activeMasjid));
      localStorage.setItem("active_role", "dkm");

      setOpenJoinAtauBuat(false);
      navigate(`/${masjidId}/sekolah`, { replace: true });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal membuat masjid.");
    }
  }

  async function handleJoinSekolah(code: string, role: "teacher" | "student") {
    try {
      await api.post("/u/student-class-sections/join", { student_code: code });

      const ctx = await api.get("/auth/me/simple-context");
      const memberships = ctx.data?.data?.memberships ?? [];
      if (memberships.length > 0) {
        const m = memberships[0];
        const masjidId = m.masjid_id;
        const masjidData = {
          masjid_id: masjidId,
          masjid_name: m.masjid_name || "Masjid",
          masjid_icon_url: m.masjid_icon_url || "/image/Gambar-Masjid.jpeg",
        };
        localStorage.setItem("active_masjid", JSON.stringify(masjidData));
        localStorage.setItem("active_role", role);

        const path = role === "teacher" ? "guru" : "murid";
        navigate(`/${masjidId}/${path}`, { replace: true });
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal bergabung ke sekolah.");
    }
  }

  function handleSelectMasjidRole(masjidId: string, role: MasjidRole) {
    localStorage.setItem("active_role", role);
    localStorage.setItem(
      "active_masjid",
      JSON.stringify({ masjid_id: masjidId })
    );

    const path =
      role === "teacher" ? "guru" : role === "student" ? "murid" : "sekolah";
    navigate(`/${masjidId}/${path}`, { replace: true });
  }

  return (
    <AuthLayout mode="login" fullWidth contentClassName="max-w-xl mx-auto">
      <div
        className="rounded-3xl p-8 md:p-10 shadow-xl border"
        style={{
          background: palette.white1,
          color: palette.black1,
          borderColor: palette.silver1,
        }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang Kembali</h1>
          <p style={{ color: palette.silver2 }}>
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

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
            >
              <span className="text-xs font-bold">!</span>
            </div>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Email / Username
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-xl px-4 py-3 outline-none transition-all"
              placeholder="Masukkan email atau username"
              required
              style={{
                background: palette.white2,
                border: `2px solid ${palette.silver1}`,
                color: palette.black1,
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl px-4 py-3 pr-12 outline-none transition-all"
                placeholder="Masukkan password"
                required
                style={{
                  background: palette.white2,
                  border: `2px solid ${palette.silver1}`,
                  color: palette.black1,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: palette.silver2 }}
              >
                {showPassword ? (
                  <EyeOffIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-8"
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
                ></div>
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
      </div>

      <ModalSelectRoleMasjid
        open={openSelectMasjid}
        onClose={() => setOpenSelectMasjid(false)}
        onSelect={handleSelectMasjidRole}
      />
      <ModalPilihTujuan
        open={openPilihTujuan}
        onClose={() => setOpenPilihTujuan(false)}
        onPilih={handlePilihTujuan}
      />
      <ModalJoinAtauBuat
        open={openJoinAtauBuat}
        mode={selectedTujuan || "dkm"}
        onClose={() => setOpenJoinAtauBuat(false)}
        onCreateMasjid={handleCreateMasjid}
        onJoinSekolah={handleJoinSekolah}
      />
      <LegalModal open={false} initialTab="tos" onClose={() => {}} />
    </AuthLayout>
  );
}
