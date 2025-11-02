import { useEffect, useMemo, useRef, useState, useCallback, JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LogOut,
  Settings,
  HelpCircle,
  MoreVertical,
  Moon,
  Sun,
  MonitorCog,
  User,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useHtmlThema from "@/hooks/useHTMLThema"; // ⬅️ versi hook terbaru
import { useQueryClient } from "@tanstack/react-query";
import SharePopover from "./CSharePopover";
import { useResponsive } from "@/hooks/isResponsive";
import { apiLogout } from "@/lib/axios";

import MyProfile, { MyProfileData } from "./CMyProfile";
import ModalEditProfile, { EditProfileData } from "./CModalEditProfile";
import { pickTheme, ThemeName } from "@/constants/thema";

/* ================= Helpers ================= */
const buildMyProfileData = (u: any): MyProfileData | undefined => {
  if (!u) return undefined;
  const p = u.profile || {};
  return {
    user: {
      full_name: u.full_name ?? u.name ?? "",
      email: u.email ?? "",
    },
    profile: {
      donation_name: p.donation_name ?? u.donation_name,
      photo_url: p.photo_url ?? u.avatar_url ?? u.avatarUrl,
      date_of_birth: p.date_of_birth,
      gender: p.gender,
      location: p.location,
      occupation: p.occupation,
      phone_number: p.phone_number,
      bio: p.bio,
    },
  };
};

const buildInitialEdit = (u: any): EditProfileData | undefined => {
  if (!u) return undefined;
  const p = u.profile || {};
  return {
    user: {
      full_name: u.full_name ?? u.name ?? "",
      email: u.email ?? "",
    },
    profile: {
      donation_name: p.donation_name,
      photo_url: p.photo_url,
      date_of_birth: p.date_of_birth,
      gender: p.gender,
      location: p.location,
      occupation: p.occupation,
      phone_number: p.phone_number,
      bio: p.bio,
    },
  };
};

type ModeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: JSX.Element;
};

/* ================= Component ================= */
interface PublicUserDropdownProps {
  variant?: "default" | "icon";
  withBg?: boolean;
}

export default function PublicUserDropdown({
  variant = "default",
  withBg = true,
}: PublicUserDropdownProps) {
  // ===== THEME / MODE =====
  const {
    isDark,
    setDarkMode,
    mode,
    setMode,
    themeName,
    setThemeName,
    themeNames,
  } = useHtmlThema();

  const theme = pickTheme(themeName as ThemeName, isDark);

  // ===== USER / ROUTER =====
  const { data: user } = useCurrentUser();
  const isLoggedIn = !!user;
  const profileData = useMemo(() => buildMyProfileData(user as any), [user]);

  const navigate = useNavigate();
  const { slug } = useParams();
  const { isMobile } = useResponsive();
  const queryClient = useQueryClient();

  const base = slug ? `/school/${slug}` : "";

  // ===== UI STATE =====
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Modals
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editInitial, setEditInitial] = useState<EditProfileData | undefined>();

  // converter dari MyProfileData -> EditProfileData
  const fromMyProfileToEdit = (d: MyProfileData): EditProfileData => ({
    user: { full_name: d.user?.full_name, email: d.user?.email },
    profile: d.profile ? { ...d.profile } : undefined,
  });

  const close = useCallback(() => setOpen(false), []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    close();
    try {
      await apiLogout();
      queryClient.removeQueries({ queryKey: ["currentUser"], exact: true });
      navigate(slug ? `${base}/login` : "/login", { replace: true });
    } catch {
      navigate(slug ? `${base}/login` : "/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // close dropdown when clicking outside / pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [close]);

  const menuItemClass =
    "w-full flex items-center gap-2 px-4 py-2 text-left transition rounded-md";
  const hoverStyle = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.backgroundColor = theme.white2);
  const outStyle = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.backgroundColor = "transparent");

  const modeOptions: ModeOption[] = [
    { value: "light", label: "Mode Terang", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Mode Gelap", icon: <Moon className="w-4 h-4" /> },
    {
      value: "system",
      label: "Ikuti Sistem",
      icon: <MonitorCog className="w-4 h-4" />,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`h-9 ${variant === "default" ? "w-9" : "w-9"} grid place-items-center rounded-xl transition`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Buka menu pengguna"
        style={{
          backgroundColor: withBg ? theme.white3 : "transparent",
          color: theme.black1,
        }}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-lg border z-50 p-1"
          role="menu"
          aria-label="Menu pengguna"
          style={{
            backgroundColor: theme.white1,
            borderColor: theme.silver1,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <ul className="py-1 text-sm" style={{ color: theme.black1 }}>
            {/* Login / Pengaturan */}
            {!isLoggedIn ? (
              <li>
                <button
                  onClick={() => {
                    close();
                    navigate("/login");
                  }}
                  className={menuItemClass}
                  onMouseEnter={hoverStyle}
                  onMouseLeave={outStyle}
                >
                  <LogOut className="w-4 h-4" /> Login
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => {
                    close();
                    const url = isMobile
                      ? `${base}/aktivitas/pengaturan/menu`
                      : `${base}/aktivitas/pengaturan/profil-saya`;
                    navigate(url);
                  }}
                  className={menuItemClass}
                  onMouseEnter={hoverStyle}
                  onMouseLeave={outStyle}
                >
                  <Settings className="w-4 h-4" /> Pengaturan
                </button>
              </li>
            )}

            {/* Bantuan */}
            <li>
              <button
                onClick={() => {
                  close();
                  navigate(`${base || ""}/bantuan`);
                }}
                className={menuItemClass}
                onMouseEnter={hoverStyle}
                onMouseLeave={outStyle}
              >
                <HelpCircle className="w-4 h-4" /> Bantuan
              </button>
            </li>

            {/* Profil Saya */}
            <li>
              <button
                onClick={() => {
                  close();
                  setProfileOpen(true);
                }}
                className={menuItemClass}
                onMouseEnter={hoverStyle}
                onMouseLeave={outStyle}
              >
                <User className="w-4 h-4" /> Profil Saya
              </button>
            </li>

            {/* ===== Mode (Light / Dark / System) ===== */}
            <li className="px-3 pt-2">
              <p className="text-xs mb-1" style={{ color: theme.silver2 }}>
                Mode Tampilan
              </p>
              <div className="grid grid-cols-3 gap-1">
                {modeOptions.map((m) => {
                  const active = mode === m.value;
                  return (
                    <button
                      key={m.value}
                      onClick={() => {
                        setMode(m.value);
                        // jika user klik mode terang/gelap langsung reflect
                        if (m.value !== "system")
                          setDarkMode(m.value === "dark");
                      }}
                      className="flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs border"
                      aria-pressed={active}
                      style={{
                        backgroundColor: active ? theme.primary2 : theme.white2,
                        borderColor: active ? theme.primary : theme.silver1,
                        color: active ? theme.black1 : theme.black1,
                      }}
                    >
                      {m.icon}
                      {m.label.replace("Mode ", "")}
                    </button>
                  );
                })}
              </div>
            </li>

            {/* ===== Pilih Tema (dinamis) ===== */}
            <li className="px-3 pt-3">
              <p className="text-xs mb-1" style={{ color: theme.silver2 }}>
                Pilih Tema
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={themeName}
                  onChange={(e) => {
                    setThemeName(e.target.value as ThemeName);
                    close();
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                  style={{
                    backgroundColor: theme.white2,
                    color: theme.black1,
                    borderColor: theme.silver1,
                  }}
                >
                  {themeNames.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
                {/* dot preview */}
                <span
                  className="inline-block w-6 h-6 rounded-md border"
                  title="Preview warna utama"
                  style={{
                    background:
                      "linear-gradient(135deg, " +
                      `${pickTheme(themeName, isDark).primary}, ${pickTheme(themeName, isDark).quaternary}` +
                      ")",
                    borderColor: theme.silver1,
                  }}
                />
              </div>
            </li>

            {/* Share */}
            <li className="px-3 py-2">
              <SharePopover
                title={document.title}
                url={window.location.href}
                forceCustom
              />
            </li>

            {/* Logout */}
            {isLoggedIn && (
              <li className="px-1 pb-1">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`${menuItemClass} disabled:opacity-60 disabled:cursor-not-allowed`}
                  style={{ color: theme.error1 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.error2)
                  }
                  onMouseLeave={outStyle}
                >
                  {isLoggingOut ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ color: theme.error1 }}
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 11-8 8z"
                        />
                      </svg>
                      <span>Keluar...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" /> Keluar
                    </>
                  )}
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* ===== Modals ===== */}
      <MyProfile
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        data={profileData}
        onEdit={(mp) => {
          setProfileOpen(false);
          setEditInitial(fromMyProfileToEdit(mp));
          setEditOpen(true);
        }}
      />
      {editInitial && (
        <ModalEditProfile
          open={editOpen}
          onClose={() => setEditOpen(false)}
          initial={editInitial}
          loading={isSaving}
          onSave={async (payload, opts = {}) => {
            const { photoFile } = opts;
            try {
              setIsSaving(true);
              // TODO: kirim ke API…
            } finally {
              setIsSaving(false);
              setEditOpen(false);
            }
          }}
        />
      )}
    </div>
  );
}
