import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useMatch,
  useParams,
  useResolvedPath,
  useNavigate,
} from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "@/lib/axios";
import { SectionCard } from "@/pages/sekolahislamku/components/ui/Primitives";
import { NAVS, type NavItem } from "./navsConfig";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";

/* ======================================================
   TYPES & HELPERS
====================================================== */
type Kind = "sekolah" | "murid" | "guru";
type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
  role: string;
};

function normalize(path: string) {
  return path.replace(/\/+$/, "");
}

function buildBase(id: string | undefined, kind: "sekolah" | "murid" | "guru") {
  // ✅ sesuai struktur route di TeacherRoutes
  return id ? `/${id}/${kind}` : `/${kind}`;
}

function buildTo(base: string, path: string) {
  // ✅ gunakan '.' atau '' untuk dashboard
  return normalize(path === "." || path === "" ? base : `${base}/${path}`);
}


const getInitials = (n?: string) =>
  n
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

const translateRole = (r: string) =>
  ({
    teacher: "Guru",
    student: "Murid",
    dkm: "Admin Sekolah",
    admin: "Admin Sekolah",
  })[r?.toLowerCase()] ?? "User";

/* ======================================================
   SIDEBAR ITEM
====================================================== */
function SidebarItem({
  palette,
  to,
  end,
  icon: Icon,
  label,
  onClick,
}: {
  palette: Palette;
  to: string;
  end?: boolean;
  icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
}) {
  const resolved = useResolvedPath(to);
  const location = window.location.pathname;
  const current = normalize(location);
  const target = normalize(resolved.pathname);
  const isActive = end ? current === target : current.startsWith(target);

  return (
    <Link to={to} onClick={onClick} className="block focus:outline-none">
      <div
  className="flex items-center gap-3 rounded-xl px-3 py-2 border transition-all duration-200"
  style={{
    background: palette.white1,
    borderColor: isActive ? palette.primary : palette.silver1,
    color: palette.black1,
  }}
>
  <span
    className="h-7 w-7 grid place-items-center rounded-lg border"
    style={{
      background: "transparent",
      borderColor: isActive ? palette.primary : palette.silver1,
      color: isActive ? palette.primary : palette.black1,
    }}
  >
    <Icon size={16} />
  </span>
  <span
    className={`truncate font-medium transition-colors ${
      isActive ? "text-primary" : ""
    }`}
    style={{
      color: isActive ? palette.primary : palette.black1,
    }}
  >
    {label}
  </span>
</div>

    </Link>
  );
}

/* ======================================================
   MAIN COMPONENT
====================================================== */
export default function ParentSidebar({
  kind = "auto",
  className = "",
  desktopOnly = true,
  mode = "auto",
  onCloseMobile,
}: {
  kind?: Kind | "auto";
  className?: string;
  desktopOnly?: boolean;
  mode?: "desktop" | "mobile" | "auto";
  onCloseMobile?: () => void;
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const match = useMatch("/:id/*"); // ✅ perbaikan match pattern
  const id = params.id ?? match?.params.id ?? "";

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resolvedKind, setResolvedKind] = useState<Kind>("sekolah");
  const [loggingOut, setLoggingOut] = useState(false);

  /* ======================================================
     FETCH USER ROLE (tanpa loading UI)
  ====================================================== */
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/me/simple-context");
        const data = res.data?.data ?? {};
        const memberships = data.memberships ?? [];

        let role = localStorage.getItem("active_role") || "user";
        if (memberships.length) {
          const roles = memberships.flatMap((m: any) => m.roles ?? []);
          if (roles.includes("teacher")) role = "teacher";
          else if (roles.includes("student")) role = "student";
          else if (roles.includes("dkm") || roles.includes("admin"))
            role = "dkm";
        }

        localStorage.setItem("active_role", role);
        setUserProfile({
          name: data.user_name || data.name || "User",
          email: data.email || "",
          avatar: data.avatar || data.profile_photo_url,
          role,
        });

        if (["teacher", "guru"].includes(role)) setResolvedKind("guru");
        else if (["student", "murid"].includes(role)) setResolvedKind("murid");
        else setResolvedKind("sekolah");
      } catch {
        setUserProfile({ name: "User", email: "", role: "user" });
      }
    }
    fetchUser();
  }, []);

  /* ======================================================
     LOGOUT
  ====================================================== */
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout").catch(() => {});
    } finally {
      localStorage.clear();
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      navigate("/login", { replace: true });
      setLoggingOut(false);
    }
  };

  /* ======================================================
     NAVIGATION
  ====================================================== */
  const base = buildBase(id, resolvedKind);
  const navs: (NavItem & { to: string })[] = useMemo(
    () => NAVS[resolvedKind].map((n) => ({ ...n, to: buildTo(base, n.path) })),
    [resolvedKind, base]
  );

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <aside
      className={`${desktopOnly ? "hidden lg:flex" : "flex"} flex-col border-r transition-colors duration-300 ${className}`}
      style={{
        width: "16rem",
        background: palette.white1,
        borderColor: palette.silver1,
        color: palette.black1,
      }}
    >
      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto p-2">
        <SectionCard
          palette={palette}
          className="p-2 transition-colors duration-300"
        >
          <ul className="space-y-2">
            {navs.map(({ to, icon, label, end }) => (
              <li key={to}>
                <SidebarItem
                  palette={palette}
                  to={to}
                  end={end}
                  icon={icon}
                  label={label}
                  onClick={mode !== "desktop" ? onCloseMobile : undefined}
                />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Footer */}
      <div
        className="p-3 border-t transition-colors duration-300"
        style={{ borderColor: palette.silver1, background: palette.white2 }}
      >
        {userProfile && (
          <div
            className="mb-3 p-3 rounded-xl border flex items-center gap-3 transition-colors duration-300"
            style={{ borderColor: palette.silver1, background: palette.white1 }}
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden text-white font-semibold"
              style={{ background: palette.primary }}
            >
              {userProfile.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                getInitials(userProfile.name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {userProfile.name}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: palette.silver2 }}
              >
                {translateRole(userProfile.role)}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 rounded-xl border py-2.5 font-medium transition-all"
          style={{
            borderColor: palette.silver1,
            color: "#DC2626",
            background: palette.white1,
            opacity: loggingOut ? 0.7 : 1,
          }}
        >
          <LogOut size={18} />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
