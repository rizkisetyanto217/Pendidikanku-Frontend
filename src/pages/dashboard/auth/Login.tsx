// src/pages/auth/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeOffIcon,
  Mail,
  Lock,
  ArrowRight,
  Building2,
  GraduationCap,
  Users2,
  CheckCircle2,
} from "lucide-react";

import AuthLayout from "@/layout/AuthLayout";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName } from "@/constants/thema";
import api, { setAuthToken } from "@/lib/axios";
import LegalModal from "@/pages/dashboard/auth/components/LegalPrivacyModal";

/* =======================
   Types
======================= */
type MasjidRole = "dkm" | "teacher" | "student" | "user";
type MasjidRoleItem = {
  masjid_id: string;
  masjid_name?: string;
  roles: MasjidRole[];
};

type User = {
  id: string;
  full_name: string;
  masjid_roles?: MasjidRoleItem[];
};

type LoginApiResponse = {
  data: {
    user: User;
    access_token: string;
  };
};

/* =======================
   Modal: Pilih Role + Masjid
======================= */
function ModalSelectRoleMasjid({
  open,
  onClose,
  masjidRoles,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  masjidRoles: MasjidRoleItem[];
  onSelect: (masjidId: string, role: MasjidRole) => void;
}) {
  const [selected, setSelected] = useState<{
    masjid_id: string;
    role: MasjidRole;
  } | null>(null);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-3">Pilih Role dan Masjid</h2>
        <p className="text-sm text-gray-500 mb-4">
          Kamu memiliki beberapa peran di berbagai masjid. Silakan pilih salah
          satu kombinasi.
        </p>

        <div className="max-h-72 overflow-y-auto space-y-4">
          {masjidRoles.map((m) => (
            <div key={m.masjid_id} className="border rounded-xl p-3">
              <div className="font-semibold mb-2 text-gray-800">
                {m.masjid_name ?? m.masjid_id}
              </div>
              <div className="flex flex-wrap gap-2">
                {m.roles.map((r) => {
                  const isActive =
                    selected?.masjid_id === m.masjid_id && selected?.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() =>
                        setSelected({ masjid_id: m.masjid_id, role: r })
                      }
                      className={`px-3 py-1.5 text-sm rounded-lg border ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {r.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            Batal
          </button>

          <button
            disabled={!selected}
            onClick={() =>
              selected && onSelect(selected.masjid_id, selected.role)
            }
            className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" /> Masuk
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   Modal: Pilih Tujuan Awal (3 opsi)
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 text-center">
        <h2 className="text-lg font-semibold mb-2">Apa peran Anda?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Pilih tujuan Anda bergabung di SekolahIslamKu:
        </p>

        <div className="space-y-3">
          <button
            onClick={() => onPilih("dkm")}
            className="w-full py-3 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Building2 className="w-4 h-4" /> Jadi DKM / Admin Masjid
          </button>
          <button
            onClick={() => onPilih("teacher")}
            className="w-full py-3 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <Users2 className="w-4 h-4" /> Gabung Sebagai Guru
          </button>
          <button
            onClick={() => onPilih("student")}
            className="w-full py-3 border rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <GraduationCap className="w-4 h-4" /> Gabung Sebagai Murid
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:underline mt-4"
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
}

/* =======================
   Modal: Buat Masjid / Join Sekolah
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
        {mode === "dkm" ? (
          <>
            <h2 className="text-lg font-semibold mb-2">Buat Masjid Baru</h2>
            <p className="text-sm text-gray-500">
              Sebagai DKM / Admin, kamu akan membuat masjid baru di sistem.
            </p>

            <input
              type="text"
              placeholder="Nama Masjid"
              value={masjidName}
              onChange={(e) => setMasjidName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setIconFile(e.target.files ? e.target.files[0] : null)
              }
              className="w-full text-sm"
            />

            <button
              disabled={!masjidName.trim() || loading}
              onClick={() => {
                setLoading(true);
                onCreateMasjid({ name: masjidName, file: iconFile! });
                setTimeout(() => setLoading(false), 1000);
              }}
              className="w-full py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? "Membuat..." : "Buat Masjid"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-2">Gabung ke Sekolah</h2>
            <p className="text-sm text-gray-500">
              Masukkan kode akses yang diberikan oleh sekolah Anda.
            </p>
            <input
              type="text"
              placeholder="Kode Akses Sekolah"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <button
              disabled={!accessCode.trim() || loading}
              onClick={() => {
                setLoading(true);
                onJoinSekolah(accessCode, mode);
                setTimeout(() => setLoading(false), 1000);
              }}
              className="w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Memproses..." : "Gabung Sekarang"}
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:underline mt-3"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

/* =======================
   Komponen Utama
======================= */
export default function Login() {
  const navigate = useNavigate();
  const { isDark, themeName } = useHtmlDarkMode();
  const theme = pickTheme(themeName as ThemeName, isDark);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openLegal, setOpenLegal] = useState<false | "tos" | "privacy">(false);

  // Modals
  const [openSelectMasjid, setOpenSelectMasjid] = useState(false);
  const [openPilihTujuan, setOpenPilihTujuan] = useState(false);
  const [openJoinAtauBuat, setOpenJoinAtauBuat] = useState(false);

  const [masjidRoles, setMasjidRoles] = useState<MasjidRoleItem[]>([]);
  const [selectedTujuan, setSelectedTujuan] = useState<
    "dkm" | "teacher" | "student" | null
  >(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<LoginApiResponse>("/auth/login", {
        identifier,
        password,
      });
      const { user, access_token } = res.data.data;
      setAuthToken(access_token);

      const roles = user.masjid_roles ?? [];

      if (roles.length === 1 && roles[0].roles.length === 1) {
        navigate(`/${roles[0].masjid_id}/sekolah`, { replace: true });
      } else if (roles.length > 0) {
        setMasjidRoles(roles);
        setOpenSelectMasjid(true);
      } else {
        setOpenPilihTujuan(true);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateMasjid(data: { name: string; file?: File }) {
    try {
      const formData = new FormData();
      formData.append("masjid_name", data.name);
      if (data.file) formData.append("icon", data.file);
      const res = await api.post("/u/masjids/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const id = res.data?.data?.item?.masjid_id;
      if (id) navigate(`/${id}/sekolah`, { replace: true });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal membuat masjid.");
    } finally {
      setOpenJoinAtauBuat(false);
    }
  }

  function handleJoinSekolah(code: string, role: "teacher" | "student") {
    setOpenJoinAtauBuat(false);
    navigate(`/join?role=${role}&code=${encodeURIComponent(code)}`);
  }

  function handlePilihTujuan(tujuan: "dkm" | "teacher" | "student") {
    setSelectedTujuan(tujuan);
    setOpenPilihTujuan(false);
    setOpenJoinAtauBuat(true);
  }

  function handleSelectMasjidRole(masjidId: string, role: MasjidRole) {
    setOpenSelectMasjid(false);
    navigate(`/${masjidId}/sekolah`, { replace: true });
  }

  return (
    <AuthLayout mode="login" fullWidth contentClassName="max-w-xl mx-auto">
      {/* Card */}
      <div className="w-full rounded-2xl p-6 md:p-8 border bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Masuk ke Akun Anda</h1>

        {error && (
          <div className="mb-4 p-2 text-sm border border-red-300 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Email / Username
            </label>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                Masuk <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Modal */}
      <ModalSelectRoleMasjid
        open={openSelectMasjid}
        onClose={() => setOpenSelectMasjid(false)}
        masjidRoles={masjidRoles}
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

      <LegalModal
        open={!!openLegal}
        initialTab={openLegal === "privacy" ? "privacy" : "tos"}
        onClose={() => setOpenLegal(false)}
      />
    </AuthLayout>
  );
}
