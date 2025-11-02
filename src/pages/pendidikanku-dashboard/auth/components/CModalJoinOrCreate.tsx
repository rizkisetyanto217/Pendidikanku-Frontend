import { pickTheme } from "@/constants/thema";
import useHtmlThema, { ThemeName } from "@/hooks/useHTMLThema";
import { Building2, GraduationCap, Users2 } from "lucide-react";
import { useState } from "react";

/* =========================
   Modal: Buat / Join Sekolah
========================= */
export default function ModalJoinOrCreate({
  open,
  mode,
  onClose,
  onCreateMasjid,
  onJoinSekolah,
}: {
  open: boolean;
  mode: "dkm" | "teacher" | "student";
  onClose: () => void;
  onCreateMasjid: (data: { name: string; file?: File }) => Promise<void> | void;
  onJoinSekolah: (
    code: string,
    role: "teacher" | "student"
  ) => Promise<void> | void;
}) {
  const { isDark, themeName } = useHtmlThema();
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
      role="dialog"
      aria-modal="true"
      aria-label={mode === "dkm" ? "Buat Masjid Baru" : "Gabung ke Sekolah"}
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
              type="button"
              disabled={!masjidName.trim() || loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await onCreateMasjid({
                    name: masjidName,
                    file: iconFile || undefined,
                  });
                } finally {
                  setLoading(false);
                }
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
              type="button"
              disabled={!accessCode.trim() || loading}
              onClick={async () => {
                setLoading(true);
                try {
                  await onJoinSekolah(accessCode.trim(), mode);
                } finally {
                  setLoading(false);
                }
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
          type="button"
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
