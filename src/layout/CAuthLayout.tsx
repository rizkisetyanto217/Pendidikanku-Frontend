import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { pickTheme, ThemeName } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import RegisterChoiceModal from "@/pages/pendidikanku-dashboard/auth/components/RegisterModalChoice";

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

  return (
    <div
      className="min-h-[100svh] flex items-center justify-center w-full overflow-hidden"
      style={{
        background: isDark
          ? `linear-gradient(180deg, ${theme.white1} 0%, ${theme.white2} 100%)`
          : `linear-gradient(180deg, ${theme.white2} 0%, ${theme.white1} 100%)`,
        color: theme.black1,
      }}
    >
      <div
        className={[
          "rounded-xl shadow-md w-full border",
          fullWidth ? "max-w-none px-4 sm:px-6 lg:px-8 py-8" : "max-w-md p-8",
          contentClassName,
        ].join(" ")}
        style={{ backgroundColor: theme.white1, borderColor: theme.white3 }}
      >
        {children}

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: theme.silver2 }}>
            {isLogin ? (
              <>
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  onClick={handleOpenChoice}
                  className="hover:underline"
                  style={{ color: theme.primary }}
                >
                  Daftar
                </Link>
              </>
            ) : (
              <>
                Sudah punya?{" "}
                <Link
                  to="/login"
                  className="hover:underline"
                  style={{ color: theme.primary }}
                >
                  Login
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
