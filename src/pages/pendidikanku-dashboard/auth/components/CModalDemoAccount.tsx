// components/CModalDemoAccounts.tsx
import React from "react";
import { Building2, GraduationCap, Users2, Sparkles } from "lucide-react";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import CBaseModal from "@/components/common/main/CBaseModal";

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

  const Btn = ({
    label,
    gradientFrom,
    gradientTo,
    icon,
    onClick,
  }: {
    label: string;
    gradientFrom: string;
    gradientTo: string;
    icon: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-4 border-2 rounded-2xl flex items-center justify-center gap-3 transition-all group focus:outline-none"
      style={{
        borderColor: palette.silver1,
        background: palette.white2,
        color: palette.black1,
        boxShadow: `0 2px 0 0 ${palette.primary2}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget.style.background as any) = palette.white3;
        (e.currentTarget.style.borderColor as any) = palette.quaternary;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.background as any) = palette.white2;
        (e.currentTarget.style.borderColor as any) = palette.silver1;
      }}
      onFocus={(e) => {
        (e.currentTarget.style.boxShadow as any) =
          `0 0 0 3px ${palette.primary2}`;
        (e.currentTarget.style.borderColor as any) = palette.quaternary;
      }}
      onBlur={(e) => {
        (e.currentTarget.style.boxShadow as any) =
          `0 2px 0 0 ${palette.primary2}`;
        (e.currentTarget.style.borderColor as any) = palette.silver1;
      }}
    >
      <div
        className="w-10 h-10 rounded-xl grid place-items-center group-hover:scale-110 transition-transform"
        style={{
          background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
          boxShadow: `0 6px 14px ${palette.primary2}`,
        }}
      >
        {icon}
      </div>
      <span className="font-semibold" style={{ color: palette.black1 }}>
        {label}
      </span>
    </button>
  );

  return (
    <CBaseModal
      open={open}
      onClose={onClose}
      ariaLabel="Pilih akun demo"
      maxWidthClassName="max-w-md"
      contentClassName="p-8"
      contentStyle={{ background: palette.white1, color: palette.black1 }}
    >
      <div className="text-center space-y-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{
            background: `linear-gradient(to bottom right, ${palette.primary}, ${palette.quaternary})`,
            boxShadow: `0 8px 20px ${palette.primary2}`,
          }}
        >
          <Sparkles className="w-8 h-8" style={{ color: palette.white1 }} />
        </div>

        <div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: palette.black1 }}
          >
            Coba akun demo
          </h2>
          <p className="text-sm" style={{ color: palette.silver2 }}>
            Pilih profil demo untuk auto-isi email & password.
          </p>
        </div>

        <div className="space-y-3">
          <Btn
            label="Admin Demo"
            gradientFrom={palette.primary}
            gradientTo={palette.secondary}
            icon={
              <Building2
                className="w-5 h-5"
                style={{ color: palette.white1 }}
              />
            }
            onClick={() => onPick("admin")}
          />
          <Btn
            label="Guru Demo"
            gradientFrom={palette.success1}
            gradientTo={palette.secondary}
            icon={
              <Users2 className="w-5 h-5" style={{ color: palette.white1 }} />
            }
            onClick={() => onPick("teacher")}
          />
          <Btn
            label="Murid Demo"
            gradientFrom={palette.quaternary}
            gradientTo={palette.secondary}
            icon={
              <GraduationCap
                className="w-5 h-5"
                style={{ color: palette.white1 }}
              />
            }
            onClick={() => onPick("student")}
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: palette.silver2 }}
        >
          Tutup
        </button>
      </div>
    </CBaseModal>
  );
}
