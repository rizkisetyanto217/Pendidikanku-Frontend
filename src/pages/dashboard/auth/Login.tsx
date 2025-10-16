// src/pages/auth/Login.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeOffIcon,
  ArrowRight,
  Building2,
  GraduationCap,
  Users2,
  CheckCircle2,
} from "lucide-react";

import AuthLayout from "@/layout/AuthLayout";
import api, { setAuthToken } from "@/lib/axios";
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

type LoginApiResponse = {
  data: {
    user: { id: string; full_name: string };
    access_token: string;
  };
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
  const [error, setError] = useState("");

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
      .catch(() => setError("Gagal mengambil data masjid."))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-3">Pilih Masjid & Role</h2>
        <p className="text-sm text-gray-500 mb-4">
          Pilih masjid dan peran yang ingin kamu gunakan.
        </p>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Memuat...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-sm py-3">{error}</div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-3">
            {masjids.length > 0 ? (
              masjids.map((m) => (
                <div
                  key={m.masjid_id}
                  className={`border rounded-xl p-3 ${
                    selected?.masjid_id === m.masjid_id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {m.masjid_icon_url ? (
                      <img
                        src={m.masjid_icon_url}
                        alt={m.masjid_name}
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center border rounded-lg">
                        🕌
                      </div>
                    )}
                    <span className="font-semibold text-gray-800">
                      {m.masjid_name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {m.roles.map((r) => (
                      <button
                        key={r}
                        onClick={() =>
                          setSelected({ masjid_id: m.masjid_id, role: r })
                        }
                        className={`px-3 py-1 text-xs rounded-lg border ${
                          selected?.masjid_id === m.masjid_id &&
                          selected?.role === r
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-700"
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-6">
                Tidak ada masjid.
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex justify-between">
          <button onClick={onClose} className="text-sm text-gray-500">
            Batal
          </button>
          <button
            disabled={!selected}
            onClick={() =>
              selected && onSelect(selected.masjid_id, selected.role)
            }
            className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" /> Pilih
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   Modal Pilih Tujuan Awal
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
      <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center space-y-4">
        <h2 className="text-lg font-semibold">Apa peran Anda?</h2>
        <p className="text-sm text-gray-500">
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
        {mode === "dkm" ? (
          <>
            <h2 className="text-lg font-semibold">Buat Masjid Baru</h2>
            <p className="text-sm text-gray-500">
              Sebagai DKM / Admin, kamu akan membuat masjid baru di sistem.
            </p>
            <input
              type="text"
              placeholder="Nama Masjid"
              value={masjidName}
              onChange={(e) => setMasjidName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setIconFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
            <button
              disabled={!masjidName.trim() || loading}
              onClick={() => {
                setLoading(true);
                onCreateMasjid({
                  name: masjidName,
                  file: iconFile || undefined,
                });
                setTimeout(() => setLoading(false), 1000);
              }}
              className="w-full py-2 bg-green-600 text-white rounded-lg"
            >
              {loading ? "Membuat..." : "Buat Masjid"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Gabung ke Sekolah</h2>
            <p className="text-sm text-gray-500">
              Masukkan kode akses dari sekolah Anda.
            </p>
            <input
              type="text"
              placeholder="Kode Akses Sekolah"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
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
          className="text-sm text-gray-500 hover:underline"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

/* =======================
   Komponen Utama Login
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
      const res = await api.post<LoginApiResponse>("/auth/login", {
        identifier,
        password,
      });
      const { access_token } = res.data.data;
      setAuthToken(access_token);

      const ctx = await api.get("/auth/me/simple-context");
      const memberships = ctx.data?.data?.memberships ?? [];

      if (memberships.length === 0) {
        setOpenPilihTujuan(true);
        return;
      }

      if (memberships.length === 1) {
        const m = memberships[0];
        const role = m.roles?.[0] ?? "user";
        handleSelectMasjidRole(m.masjid_id, role);
        return;
      }

      setOpenSelectMasjid(true);
    } catch (err: any) {
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
      const id = res.data?.data?.item?.masjid_id;
      if (id) navigate(`/${id}/sekolah`, { replace: true });
    } catch {
      alert("Gagal membuat masjid.");
    } finally {
      setOpenJoinAtauBuat(false);
    }
  }

  function handleJoinSekolah(code: string, role: "teacher" | "student") {
    setOpenJoinAtauBuat(false);
    navigate(`/join?role=${role}&code=${encodeURIComponent(code)}`);
  }

  function handleSelectMasjidRole(masjidId: string, role: MasjidRole) {
    setOpenSelectMasjid(false);

    localStorage.setItem("active_role", role);
    localStorage.setItem(
      "active_masjid",
      JSON.stringify({ masjid_id: masjidId })
    );

    switch (role) {
      case "dkm":
      case "admin":
        navigate(`/${masjidId}/sekolah`, { replace: true });
        break;
      case "teacher":
        navigate(`/${masjidId}/guru`, { replace: true });
        break;
      case "student":
        navigate(`/${masjidId}/murid`, { replace: true });
        break;
      default:
        navigate(`/${masjidId}/sekolah`, { replace: true });
        break;
    }
  }

  return (
    <AuthLayout mode="login" fullWidth contentClassName="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-8 border shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Masuk ke Akun Anda</h1>
        {error && (
          <div className="mb-4 text-red-600 text-sm border border-red-300 rounded-lg p-2">
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
