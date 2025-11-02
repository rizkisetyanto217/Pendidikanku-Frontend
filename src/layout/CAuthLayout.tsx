import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import RegisterChoiceModal from "@/pages/pendidikanku-dashboard/auth/components/CRegisterModalChoice";

type AuthLayoutProps = {
  children: React.ReactNode;
  mode?: "login" | "register";
  fullWidth?: boolean;
  contentClassName?: string;
};

export default function AuthLayout({
  children,
  mode = "login",
  fullWidth = false,
  contentClassName = "",
}: AuthLayoutProps) {
  const { isDark, themeName } = useHtmlDarkMode();
  const theme = pickTheme(themeName as ThemeName, isDark);
  const isLogin = mode === "login";

  const navigate = useNavigate();
  const [openChoice, setOpenChoice] = useState(false);

  const handleOpenChoice = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setOpenChoice(true);
  }, []);

  const handleSelectChoice = useCallback(
    (choice: "school" | "user") => {
      setOpenChoice(false);
      if (choice === "school") navigate("/register-sekolah");
      else navigate("/register-user");
    },
    [navigate]
  );

  const alpha = (hex: string, a = 0.08) =>
    hex.startsWith("#")
      ? `${hex}${Math.round(a * 255)
          .toString(16)
          .padStart(2, "0")}`
      : hex;

  return (
    <div
      className="min-h-[100svh] w-full flex items-center justify-center overflow-hidden px-4 py-8 sm:py-12 relative"
      style={{
        background: `
          radial-gradient(1200px 600px at 50% -10%, ${alpha(theme.primary, 0.12)} 0%, transparent 60%),
          linear-gradient(180deg, ${isDark ? theme.white1 : theme.white2} 0%, ${
            isDark ? theme.white2 : theme.white1
          } 100%)
        `,
        color: theme.black1,
      }}
    >
      {/* soft blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full blur-[90px]"
        style={{ background: alpha(theme.quaternary || theme.primary, 0.25) }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full blur-[90px]"
        style={{ background: alpha(theme.primary, 0.25) }}
      />

      <div
        className={[
          "relative rounded-2xl w-full",
          fullWidth ? "max-w-none px-4 sm:px-6 lg:px-8 py-8" : "max-w-md p-8",
          contentClassName,
        ].join(" ")}
        style={{
          backgroundColor: theme.white1,
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.18), inset 0 0 0 0.5px rgba(0,0,0,0.06)",
          borderRadius: 16,
        }}
      >
        {/* Accent top bar */}
        <div
          className="absolute left-6 right-6 top-0 h-[3px] rounded-b-full"
          style={{
            background: `linear-gradient(90deg, ${alpha(theme.primary, 0.6)} 0%, ${alpha(
              theme.secondary || theme.primary,
              0.4
            )} 100%)`,
            transform: "translateY(-1.5px)",
          }}
        />

        {children}

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: theme.silver2 }}>
            {isLogin ? (
              <>
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  onClick={handleOpenChoice}
                  className="hover:underline font-semibold"
                  style={{ color: theme.primary }}
                >
                  Daftar sekarang
                </Link>
              </>
            ) : (
              <>
                Sudah punya?{" "}
                <Link
                  to="/login"
                  className="hover:underline font-semibold"
                  style={{ color: theme.primary }}
                >
                  Masuk
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      {isLogin && (
        <RegisterChoiceModal
          open={openChoice}
          onClose={() => setOpenChoice(false)}
          onSelect={handleSelectChoice}
        />
      )}
    </div>
  );
}
