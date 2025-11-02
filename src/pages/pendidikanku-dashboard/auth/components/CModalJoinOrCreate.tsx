// components/.../CModalJoinOrCreate.tsx
import React, { useState } from "react";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { Building2, GraduationCap, Users2 } from "lucide-react";
import CBaseModal from "@/components/common/main/CBaseModal";

export default function ModalJoinOrCreate(props: {
  open: boolean;
  mode: "dkm" | "teacher" | "student";
  onClose: () => void;
  onCreateschool: (data: { name: string; file?: File }) => Promise<void> | void;
  onJoinSekolah: (
    code: string,
    role: "teacher" | "student"
  ) => Promise<void> | void;
}) {
  const { open, mode, onClose, onCreateschool, onJoinSekolah } = props;

  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);

  const [schoolName, setschoolName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  const isCreate = mode === "dkm";

  return (
    <CBaseModal
      open={open}
      onClose={onClose}
      ariaLabel={isCreate ? "Buat school Baru" : "Gabung ke Sekolah"}
      maxWidthClassName="max-w-md"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            background: isCreate
              ? `linear-gradient(to bottom right, ${palette.primary}, ${palette.quaternary})`
              : `linear-gradient(to bottom right, ${palette.quaternary}, ${palette.primary})`,
          }}
        >
          {isCreate ? (
            <Building2 className="w-6 h-6 text-white" />
          ) : mode === "teacher" ? (
            <Users2 className="w-6 h-6 text-white" />
          ) : (
            <GraduationCap className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold">
            {isCreate ? "Buat school Baru" : "Gabung ke Sekolah"}
          </h2>
          <p className="text-sm" style={{ color: palette.silver2 }}>
            {isCreate
              ? "Daftarkan school Anda ke sistem"
              : "Masukkan kode akses dari admin sekolah"}
          </p>
        </div>
      </div>

      {/* Body */}
      {isCreate ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama school
            </label>
            <input
              type="text"
              placeholder="Contoh: school Al-Ikhlas"
              value={schoolName}
              onChange={(e) => setschoolName(e.target.value)}
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
              Logo school (Opsional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setIconFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>

          <button
            type="button"
            disabled={!schoolName.trim() || loading}
            onClick={async () => {
              setLoading(true);
              try {
                await onCreateschool({
                  name: schoolName.trim(),
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
            {loading ? "Membuat school..." : "Buat school"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
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
                // mode di sini pasti "teacher" | "student"
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
        </div>
      )}

      {/* Footer */}
      <button
        type="button"
        onClick={onClose}
        className="w-full text-sm font-medium mt-4"
        style={{ color: palette.silver2 }}
      >
        Batal
      </button>
    </CBaseModal>
  );
}
