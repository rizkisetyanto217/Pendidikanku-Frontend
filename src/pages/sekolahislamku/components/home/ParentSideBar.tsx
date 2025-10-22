import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useMatch,
  useParams,
  useResolvedPath,
  useNavigate,
} from "react-router-dom";
import {
  SectionCard,
  type Palette,
} from "@/pages/sekolahislamku/components/ui/Primitives";
import { NAVS, type NavItem } from "./navsConfig";
import api from "@/lib/axios";
import { LogOut } from "lucide-react";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { colors } from "@/constants/colorsThema";

/* ------------ Types ------------ */
export type Kind = "sekolah" | "murid" | "guru";
export type AutoKind = Kind | "auto";

export type ParentSidebarProps = {
  palette: Palette; // <- pakai palette dari parent (JANGAN override!)
  kind?: AutoKind;
  className?: string;
  desktopOnly?: boolean;
  mode?: "desktop" | "mobile" | "auto";
  openMobile?: boolean;
  onCloseMobile?: () => void;
};

type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
  role: string;
};

/* ------------ Helpers ------------ */
const normalize = (s: string) => s.replace(/\/+$/, "");
const buildBase = (slug: string | undefined, kind: Kind) =>
  slug ? `/masjid/${slug}/${kind}` : `/masjid/default/${kind}`;
const buildTo = (base: string, p: string) => {
  const raw = p === "" || p === "." ? base : `${base}/${p.replace(/^\/+/, "")}`;
  return normalize(raw);
};
const getInitials = (name: string) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
const translateRole = (role: string) =>
  (
    ({
      teacher: "Guru",
      guru: "Guru",
      student: "Murid",
      murid: "Murid",
      dkm: "Admin Sekolah",
      admin: "Admin Sekolah",
      sekolah: "Admin Sekolah",
    }) as Record<string, string>
  )[role?.toLowerCase()] || "User";

/* ------------ Surfaces by mode (pakai palette yang dikirim) ------------ */
function surfaces(p: Palette, isDark: boolean) {
  return {
    base: isDark ? p.black1 : p.white1,
    card: isDark ? p.black2 : p.white2,
    hover: isDark ? p.black2 : p.white3,
    border: isDark ? p.black1 : p.silver1,
    text: isDark ? p.white1 : p.black1,
    subText: isDark ? p.silver2 : p.silver1,
  };
}

/* ------------ Item ------------ */
function SidebarItem({
  palette,
  to,
  end,
  icon: Icon,
  label,
  onClick,
  isDark,
}: {
  palette: Palette;
  to: string;
  end?: boolean;
  icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
  isDark: boolean;
}) {
  const s = surfaces(palette, isDark);
  const location = useLocation();
  const resolved = useResolvedPath(to);
  const current = normalize(location.pathname);
  const target = normalize(resolved.pathname);
  const isActive = end
    ? current === target
    : current === target || current.startsWith(target + "/");

  return (
    <Link to={to} onClick={onClick} className="block focus:outline-none">
      <div
        className="flex items-center gap-3 rounded-xl px-3 py-2 border transition-all hover:translate-x-px"
        style={{
          background: isActive ? palette.primary2 : s.base,
          borderColor: isActive ? palette.primary : s.border,
          color: isActive ? palette.white1 : s.text,
        }}
        onMouseEnter={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLDivElement).style.background = s.hover;
        }}
        onMouseLeave={(e) => {
          if (!isActive)
            (e.currentTarget as HTMLDivElement).style.background = s.base;
        }}
      >
        <span
          className="h-7 w-7 grid place-items-center rounded-lg border"
          style={{
            background: isActive ? palette.primary : "transparent",
            borderColor: isActive ? palette.primary : s.border,
            color: isActive ? palette.white1 : s.text,
          }}
        >
          <Icon size={16} />
        </span>
        <span className="truncate font-medium">{label}</span>
      </div>
    </Link>
  );
}

/* ------------ Main ------------ */
export default function ParentSidebar({
  palette, // <- TERIMA apa adanya dari parent
  kind = "auto",
  className = "",
  desktopOnly = true,
  mode = "auto",
  openMobile = false,
  onCloseMobile,
}: ParentSidebarProps) {
  const { isDark } = useHtmlDarkMode(); // mode nyata (html.dark)
  const isPaletteDark = palette === colors.dark; // mode dari palette yang dikirim
  const dark = isDark || isPaletteDark; // jaga-jaga kalau parent kirim light padahal html dark

  const s = surfaces(palette, dark);

  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const match = useMatch("/masjid/:id/*");
  const slug = params.id ?? match?.params.id ?? "";

  const [resolvedKind, setResolvedKind] = useState<Kind>("sekolah");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout").catch(() => {});
    } finally {
      localStorage.clear();
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie =
        "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    async function determineRole() {
      try {
        const savedRole = localStorage.getItem("active_role");
        const res = await api.get("/auth/me/simple-context");
        const userData = res.data?.data;
        const memberships = userData?.memberships ?? [];

        const name =
          userData?.user_name ||
          userData?.name ||
          userData?.full_name ||
          userData?.display_name ||
          userData?.username ||
          userData?.email?.split("@")[0] ||
          "User";

        let role = savedRole || "user";
        if (memberships.length > 0) {
          const allRoles = memberships.flatMap((m: any) => m.roles ?? []);
          if (allRoles.includes("dkm") || allRoles.includes("admin"))
            role = "dkm";
          else if (allRoles.includes("teacher")) role = "teacher";
          else if (allRoles.includes("student")) role = "student";
        }

        localStorage.setItem("active_role", role);
        setUserProfile({
          name,
          email: userData?.email || "",
          avatar:
            userData?.avatar ||
            userData?.profile_picture ||
            userData?.profile_photo_url ||
            userData?.image,
          role,
        });

        if (["teacher", "guru"].includes(role)) setResolvedKind("guru");
        else if (["student", "murid"].includes(role)) setResolvedKind("murid");
        else setResolvedKind("sekolah");
      } catch {
        setResolvedKind("sekolah");
        setUserProfile({
          name: "User",
          email: "",
          role: localStorage.getItem("active_role") || "user",
        });
      } finally {
        setLoading(false);
      }
    }
    determineRole();
  }, []);

  const base = buildBase(slug, resolvedKind);
  const navs: (NavItem & { to: string })[] = useMemo(
    () => NAVS[resolvedKind].map((n) => ({ ...n, to: buildTo(base, n.path) })),
    [resolvedKind, base]
  );

  return (
    <aside
      className={[
        desktopOnly ? "hidden lg:block" : "block",
        "w-full lg:w-64 xl:w-72 shrink-0 border-r transition-colors duration-300",
        className,
      ].join(" ")}
      style={{
        position: "sticky",
        top: "5rem",
        height: "calc(100vh - 5rem)",
        display: "flex",
        flexDirection: "column",
        background: s.base,
        borderColor: s.border,
        color: s.text,
      }}
    >
      {/* Scroll area */}
      <div className="flex-1 p-2" style={{ overflowY: "auto", minHeight: 0 }}>
        <SectionCard
          palette={palette}
          className="p-2"
          style={{ background: s.card, borderColor: s.border }}
        >
          {loading ? (
            <div
              className="text-sm text-center py-6"
              style={{ color: s.subText }}
            >
              Memuat menu...
            </div>
          ) : (
            <ul className="space-y-2">
              {navs.map(({ to, label, icon, end }) => (
                <li key={to}>
                  <SidebarItem
                    palette={palette}
                    to={to}
                    end={end}
                    icon={icon}
                    label={label}
                    isDark={dark}
                    onClick={mode !== "desktop" ? onCloseMobile : undefined}
                  />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Footer */}
      <div
        className="p-3 border-t"
        style={{ flexShrink: 0, borderColor: s.border, background: s.card }}
      >
        {userProfile && (
          <div
            className="mb-3 p-3 rounded-xl border"
            style={{ borderColor: s.border, background: s.base }}
          >
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-full border-2 flex items-center justify-center overflow-hidden"
                style={{ borderColor: palette.primary }}
              >
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div
                    className="h-full w-full flex items-center justify-center font-semibold text-white text-base"
                    style={{ background: palette.primary }}
                  >
                    {getInitials(userProfile.name)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{ color: s.text }}
                >
                  {userProfile.name}
                </p>
                <p className="text-xs truncate" style={{ color: s.text}}>
                  {translateRole(userProfile.role)}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 rounded-xl border py-2.5 transition-all font-medium"
          style={{
            borderColor: s.border,
            color: "#DC2626",
            background: s.base,
            opacity: loggingOut ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loggingOut)
              e.currentTarget.style.background = dark ? "#7F1D1D" : "#FEE2E2";
          }}
          onMouseLeave={(e) => {
            if (!loggingOut) e.currentTarget.style.background = s.base;
          }}
        >
          <LogOut size={18} />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
