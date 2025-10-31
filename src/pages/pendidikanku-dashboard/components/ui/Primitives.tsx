import React from "react";
import { colors } from "@/constants/colorsThema";
import { Link, To } from "react-router-dom";

export type Palette = typeof colors.light;

/* ======================================================
   SectionCard — FIXED dark/light detection
====================================================== */
// --- gunakan tipe ini ---
type SectionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  palette: Palette;
  /** Paksa bg di semua mode: "white1" | "black1" | "auto" (default) */
  bg?: "auto" | "white1" | "black1";
  /** Override bg khusus saat dark mode: "white1" | "black1" */
  bgOnDark?: "white1" | "black1";
};

// --- implementasinya pakai SectionCardProps & forward props ---
export function SectionCard({
  children,
  palette,
  className = "",
  style,
  bg = "auto",
  bgOnDark,
  ...rest
}: SectionCardProps) {
  const bgClass =
    bg === "auto"
      ? "bg-white dark:bg-neutral-900"
      : bg === "white1"
        ? "bg-white"
        : "bg-black";

  return (
    <div
      {...rest}
      className={`rounded-xl shadow ${bgClass} overflow-x-visible overflow-y-visible ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ======================================================
   Badge
====================================================== */
export function Badge({
  children,
  variant = "default",
  palette,
  className = "",
}: {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "black1"
    | "white1";
  palette: Palette;
  className?: string;
}) {
  const styleMap: Record<string, React.CSSProperties> = {
    default: { background: palette.primary, color: palette.white1 },
    secondary: { background: palette.secondary, color: palette.white1 },
    outline: { border: `1px solid ${palette.silver1}`, color: palette.silver2 },
    destructive: { background: palette.error1, color: palette.white1 },
    success: { background: palette.success1, color: palette.white1 },
    warning: { background: palette.warning1, color: palette.white1 },
    info: { background: palette.quaternary, color: palette.white1 },
    black1: {
      background: palette.black1,
      color: palette.white1,
      border: `1px solid ${palette.white3}`,
    },
    white1: {
      background: palette.white1,
      color: palette.black1,
      border: `1px solid ${palette.silver1}`,
    },
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${className}`}
      style={styleMap[variant]}
    >
      {children}
    </span>
  );
}

/* ======================================================
   Button
====================================================== */
type BtnVariant =
  | "default"
  | "secondary"
  | "outline"
  | "quaternary"
  | "ghost"
  | "destructive"
  | "success"
  | "black1"
  | "white1"
  | "silver";

type BtnSize = "sm" | "md" | "lg" | "icon";

export function Btn({
  children,
  variant = "default",
  size = "md",
  palette,
  className = "",
  style,
  tone = "normal",
  block = false,
  loading = false,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: BtnSize;
  palette: Palette;
  tone?: "normal" | "inverted";
  block?: boolean;
  loading?: boolean;
}) {
  const sizeCls =
    size === "sm"
      ? "h-8 px-3 text-sm"
      : size === "lg"
        ? "h-12 px-5 text-base"
        : size === "icon"
          ? "h-10 w-10 p-0"
          : "h-10 px-4 text-sm";

  const base: React.CSSProperties = {
    borderRadius: 16,
    fontWeight: 600,
    transition: "all 0.2s ease",
  };

  const variants: Record<BtnVariant, React.CSSProperties> = {
    default: {
      background: palette.primary,
      color: palette.white1,
      border: `1px solid ${palette.primary}`,
    },
    secondary: {
      background: palette.white2,
      color: palette.black1,
      border: `1px solid ${palette.silver1}`,
    },
    outline: {
      background: "transparent",
      color: palette.black1,
      border: `1px solid ${palette.silver1}`,
    },
    quaternary: {
      background: palette.quaternary,
      color: palette.white1,
      border: `1px solid ${palette.silver1}`,
    },
    ghost: {
      background: palette.primary2,
      color: palette.black1,
      border: `1px solid ${palette.primary2}`,
    },
    destructive: {
      background: palette.error1,
      color: palette.white1,
      border: `1px solid ${palette.error1}`,
    },
    success: {
      background: palette.success1,
      color: palette.white1,
      border: `1px solid ${palette.success1}`,
    },
    black1: {
      background: palette.black1,
      color: palette.white1,
      border: `1px solid ${palette.white3}`,
    },
    white1: {
      background: palette.white1,
      color: palette.black1,
      border: `1px solid ${palette.silver1}`,
    },
    silver: {
      background: palette.silver1,
      color: palette.black1,
      border: `1px solid ${palette.silver1}`,
    },
  };

  const invertedOverrides: Partial<Record<BtnVariant, React.CSSProperties>> = {
    outline: { color: palette.white1, border: `1px solid ${palette.white3}` },
    secondary: {
      background: palette.black1,
      color: palette.white1,
      border: `1px solid ${palette.white3}`,
    },
    ghost: {
      background: "transparent",
      color: palette.white1,
      border: `1px solid ${palette.black1}`,
    },
  };

  const computedStyle: React.CSSProperties = {
    ...base,
    ...variants[variant],
    ...(tone === "inverted" ? invertedOverrides[variant] : {}),
    ...(disabled || loading ? { opacity: 0.6, cursor: "not-allowed" } : {}),
    ...style,
  };

  return (
    <button
      className={`${block ? "w-full" : ""} inline-flex items-center justify-center gap-1.5 ${sizeCls} ${className}`}
      style={computedStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          style={{ color: "currentColor" }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            opacity="0.25"
          />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

/* ======================================================
   ProgressBar
====================================================== */
export function ProgressBar({
  value,
  palette,
}: {
  value: number;
  palette: Palette;
}) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div
      className="h-2 w-full overflow rounded-full"
      style={{ background: palette.white3 }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${v}%`, background: palette.black1 }}
      />
    </div>
  );
}

/* ======================================================
   Link Button
====================================================== */
export function LinkBtn({
  to,
  children,
  palette,
  variant = "default",
  size = "md",
  className = "",
  style,
  tone = "normal",
  block = false,
  state,
  replace,
  disabled = false,
  ...rest
}: {
  to: To;
  children: React.ReactNode;
  palette: Palette;
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "quaternary"
    | "ghost"
    | "destructive"
    | "success"
    | "black1"
    | "white1"
    | "silver";
  size?: "sm" | "md" | "lg" | "icon";
  tone?: "normal" | "inverted";
  block?: boolean;
  className?: string;
  style?: React.CSSProperties;
  state?: any;
  replace?: boolean;
  disabled?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const sizeCls =
    size === "sm"
      ? "h-8 px-3 text-sm"
      : size === "lg"
        ? "h-12 px-5 text-base"
        : size === "icon"
          ? "h-10 w-10 p-0"
          : "h-10 px-4 text-sm";

  const btnStyle = {
    borderRadius: 16,
    fontWeight: 600,
    ...(variant === "ghost"
      ? {
          background: palette.primary2,
          color: palette.black1,
          border: `1px solid ${palette.primary2}`,
        }
      : variant === "outline"
        ? {
            background: "transparent",
            color: palette.black1,
            border: `1px solid ${palette.silver1}`,
          }
        : variant === "secondary"
          ? {
              background: palette.white2,
              color: palette.black1,
              border: `1px solid ${palette.silver1}`,
            }
          : variant === "black1"
            ? {
                background: palette.black1,
                color: palette.white1,
                border: `1px solid ${palette.white3}`,
              }
            : variant === "white1"
              ? {
                  background: palette.white1,
                  color: palette.black1,
                  border: `1px solid ${palette.silver1}`,
                }
              : {
                  background: palette.primary,
                  color: palette.white1,
                  border: `1px solid ${palette.primary}`,
                }),
    ...(tone === "inverted" && variant === "outline"
      ? { color: palette.white1, border: `1px solid ${palette.white3}` }
      : {}),
    ...(disabled ? { opacity: 0.6, cursor: "not-allowed" } : {}),
    ...style,
  } as React.CSSProperties;

  return (
    <Link
      to={to}
      state={state}
      replace={replace}
      aria-disabled={disabled || undefined}
      className={`${block ? "w-full" : ""} inline-flex items-center justify-center gap-1.5 transition-all hover:brightness-95 focus-visible:outline-none ${sizeCls} ${className}`}
      style={btnStyle}
      {...rest}
    >
      {children}
    </Link>
  );
}
