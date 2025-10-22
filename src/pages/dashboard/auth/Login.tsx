import React, { useState } from "react";
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
import api from "@/lib/axios";
import { setTokens } from "@/lib/axios";
import LegalModal from "@/pages/dashboard/auth/components/LegalPrivacyModal";

/* =======================
   Types
======================= */
type MasjidRole = "dkm" | "admin" | "teacher" | "student" | "user";
type MasjidItem = {
  masjid_id: string;
  masjid_name: string;
  masjid_icon_url?: string;
  roles: MasjidRole[];
};

/* =======================
   Modal Pilih Masjid & Role
======================= */
function ModalSelectRoleMasjid({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (masjidId: string, role: MasjidRole) => void;
}) {
  const [masjids, setMasjids] = useState<MasjidItem[]>([]);
  const [selected, setSelected] = useState<{
    masjid_id: string;
    role: MasjidRole;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Pilih Masjid & Role
          </h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Pilih masjid dan peran yang ingin kamu gunakan untuk melanjutkan.
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Memuat data...</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
            {masjids.map((m) => (
              <div
                key={m.masjid_id}
                className={`border-2 rounded-2xl p-4 transition-all duration-200 ${
                  selected?.masjid_id === m.masjid_id
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={m.masjid_icon_url || "/image/Gambar-Masjid.jpeg"}
                    alt={m.masjid_name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                  />
                  <span className="font-semibold text-gray-800 text-base">
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
                      className={`px-4 py-1.5 text-xs font-medium rounded-lg border-2 transition-all duration-200 ${
                        selected?.masjid_id === m.masjid_id &&
                        selected?.role === r
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
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
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            disabled={!selected}
            onClick={() =>
              selected && onSelect(selected.masjid_id, selected.role)
            }
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
          >
            <CheckCircle2 className="w-4 h-4" /> Pilih & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   Modal Pilih Tujuan
======================= */
function ModalPilihTujuan({
  open,
  onClose,
  onPilih,
}: {
  open: boolean;
  onClose: () => void;
  onPilih: (tujuan: "dkm" | "teacher" | "student") => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Apa peran Anda?
          </h2>
          <p className="text-sm text-gray-600">
            Pilih tujuan Anda bergabung di SekolahIslamKu
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => onPilih("dkm")}
            className="w-full py-4 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">
              Jadi DKM / Admin Masjid
            </span>
          </button>
          <button
            onClick={() => onPilih("teacher")}
            className="w-full py-4 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">
              Gabung Sebagai Guru
            </span>
          </button>
          <button
            onClick={() => onPilih("student")}
            className="w-full py-4 border-2 border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">
              Gabung Sebagai Murid
            </span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
}

/* =======================
   Modal Gabung / Buat Masjid
======================= */
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
  const [masjidName, setMasjidName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {mode === "dkm" ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Buat Masjid Baru
                </h2>
                <p className="text-sm text-gray-600">
                  Daftarkan masjid Anda ke sistem
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Masjid
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Masjid Al-Ikhlas"
                  value={masjidName}
                  onChange={(e) => setMasjidName(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Masjid (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:font-medium"
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
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-500/30"
            >
              {loading ? "Membuat Masjid..." : "Buat Masjid"}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                {mode === "teacher" ? (
                  <Users2 className="w-6 h-6 text-white" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Gabung ke Sekolah
                </h2>
                <p className="text-sm text-gray-600">
                  Masukkan kode akses dari admin sekolah
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Akses Sekolah
              </label>
              <input
                type="text"
                placeholder="Masukkan kode akses"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all font-mono text-center text-lg tracking-wider"
              />
            </div>
            <button
              disabled={!accessCode.trim() || loading}
              onClick={() => {
                setLoading(true);
                onJoinSekolah(accessCode, mode);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/30"
            >
              {loading ? "Memproses..." : "Gabung Sekarang"}
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

/* =======================
   MAIN COMPONENT
======================= */
export default function Login() {
  const navigate = useNavigate();
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
      await api.post("/u/user-class-sections/join", { student_code: code });

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
      const msg = err?.response?.data?.message || "Gagal bergabung ke sekolah.";
      alert(msg);
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
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang Kembali
          </h1>
          <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        {error && (
          <div className="mb-6 text-red-700 text-sm bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
            <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-700 text-xs font-bold">!</span>
            </div>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email / Username
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              placeholder="Masukkan email atau username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 mt-8"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

      {/* MODALS */}
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
