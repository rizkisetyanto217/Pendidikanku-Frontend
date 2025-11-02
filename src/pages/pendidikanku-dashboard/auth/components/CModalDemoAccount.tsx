// components/CModalDemoAccounts.tsx
import { Building2, GraduationCap, Users2, Sparkles } from "lucide-react";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName } from "@/constants/thema";
import React from "react";

type DemoRole = "admin" | "teacher" | "student";

export default function ModalDemoAccounts({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (who: DemoRole) => void;
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Pilih akun demo"
      onMouseDown={(e) => {
        // klik backdrop untuk tutup (hindari klik konten)
        if (e.target === e.currentTarget) onClose();
      }}
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
          <h2 className="text-2xl font-bold mb-2">Coba akun demo</h2>
          <p className="text-sm" style={{ color: palette.silver2 }}>
            Pilih profil demo untuk auto-isi email & password.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onPick("admin")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl grid place-items-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to br, ${palette.primary}, ${palette.secondary || palette.quaternary})`,
              }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Admin Demo</span>
          </button>

          <button
            type="button"
            onClick={() => onPick("teacher")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl grid place-items-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to br, ${palette.success1 || "#16a34a"}, ${palette.secondary || palette.primary})`,
              }}
            >
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Guru Demo</span>
          </button>

          <button
            type="button"
            onClick={() => onPick("student")}
            className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group"
            style={{
              borderColor: palette.silver1,
              background: palette.white2,
              color: palette.black1,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl grid place-items-center group-hover:scale-110 transition-transform"
              style={{
                background: `linear-gradient(to br, ${palette.quaternary}, ${palette.secondary || palette.primary})`,
              }}
            >
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Murid Demo</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium transition-colors"
          style={{ color: palette.silver2 }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
