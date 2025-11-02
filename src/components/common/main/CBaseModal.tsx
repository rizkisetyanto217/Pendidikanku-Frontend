// components/ui/CBaseModal.tsx
import React from "react";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  /** opsional: max width container, default md (28rem) */
  maxWidthClassName?: string; // e.g. "max-w-md", "max-w-lg"
  /** opsional: tambahan className & style untuk konten */
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  /** kalau true: klik backdrop menutup modal (default true) */
  closeOnBackdrop?: boolean;
};

export default function CBaseModal({
  open,
  onClose,
  ariaLabel,
  children,
  maxWidthClassName = "max-w-md",
  contentClassName = "",
  contentStyle,
  closeOnBackdrop = true,
}: BaseModalProps) {
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
      aria-label={ariaLabel}
      onMouseDown={(e) => {
        if (!closeOnBackdrop) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${maxWidthClassName} rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 ${contentClassName}`}
        style={{
          background: palette.white1,
          color: palette.black1,
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
