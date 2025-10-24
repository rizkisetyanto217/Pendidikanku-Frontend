import { useEffect, useMemo, useState, useCallback } from "react";
import { NavLink, useMatch, useParams, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import api from "@/lib/axios";
import { SectionCard } from "@/pages/sekolahislamku/components/ui/Primitives";
import { NAVS, type NavItem } from "./navsConfig";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";

type Kind = "sekolah" | "murid" | "guru";

type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
  role: string; // "teacher" | "student" | "dkm" | "admin" | "user"
};

type ParentSidebarProps = {
  kind?: Kind | "auto";
  className?: string;
  desktopOnly?: boolean;
  mode?: "desktop" | "mobile" | "auto";
  open?: boolean;
  onCloseMobile?: () => void;
};

/* ===================== Helpers ===================== */
function normalizePath(path: string) {
  return path.replace(/\/+$/, "");
}
function looksLikeOrgId(s?: string) {
  if (!s) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    s
  );
}
const kindToRouteSegment: Record<Kind, string> = {
  sekolah: "sekolah",
  murid: "murid",
  guru: "guru",
};
function buildBase(id: string | undefined, segment: string) {
  return id ? `/${id}/${segment}` : `/${segment}`;
}
function buildTo(base: string, path: string) {
  if (path === "." || path === "") return normalizePath(base);
  const cleaned = path.replace(/^\/+/, "");
  return normalizePath(`${base}/${cleaned}`);
}
const getInitials = (n?: string) =>
  n
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";
const translateRole = (r: string) =>
  ({ teacher: "Guru", student: "Murid", dkm: "Admin", admin: "Admin" })[
    r?.toLowerCase()
  ] ?? "User";

/* ===================== Component ===================== */
export default function ParentSidebar({
  kind = "auto",
  className = "",
  desktopOnly = true,
  mode = "auto",
  open = true,
  onCloseMobile,
}: ParentSidebarProps) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette: Palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();

  // deteksi :id dan segmen url
  const params = useParams<{ id?: string }>();
  const matchAnyId = useMatch("/:id/*");
  const possibleId = params.id ?? matchAnyId?.params.id;
  const safeOrgId = looksLikeOrgId(possibleId) ? possibleId : undefined;

  // URL-kind (prioritas)
  const matchSekolah = useMatch("/:id/sekolah/*") || useMatch("/sekolah/*");
  const matchMurid = useMatch("/:id/murid/*") || useMatch("/murid/*");
  const matchGuru = useMatch("/:id/guru/*") || useMatch("/guru/*");

  const urlKind: Kind | null = matchSekolah
    ? "sekolah"
    : matchMurid
      ? "murid"
      : matchGuru
        ? "guru"
        : null;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resolvedKind, setResolvedKind] = useState<Kind>("sekolah");
  const [loggingOut, setLoggingOut] = useState(false);

  // === penentuan kind ===
  useEffect(() => {
    let mounted = true;

    // 1) Jika prop kind eksplisit → pakai itu
    if (kind !== "auto") {
      setResolvedKind(kind);
      return () => {
        mounted = false;
      };
    }

    // 2) Jika URL jelas (/:id/sekolah|murid|guru) → utamakan URL
    if (urlKind) {
      setResolvedKind(urlKind);
      return () => {
        mounted = false;
      };
    }

    // 3) Fallback: role-based (seperti sebelumnya)
    api
      .get("/auth/me/simple-context")
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data ?? {};
        const memberships = data.memberships ?? [];
        let role: UserProfile["role"] =
          (localStorage.getItem("active_role") as UserProfile["role"]) ||
          "user";

        if (memberships.length) {
          const roles = memberships.flatMap((m: any) => m?.roles ?? []);
          if (roles.includes("teacher")) role = "teacher";
          else if (roles.includes("student")) role = "student";
          else if (roles.includes("dkm") || roles.includes("admin"))
            role = "dkm";
        }

        setUserProfile({
          name: data.user_name || data.name || "User",
          email: data.email || "",
          avatar: data.avatar || data.profile_photo_url,
          role,
        });

        if (role === "teacher") setResolvedKind("guru");
        else if (role === "student") setResolvedKind("murid");
        else setResolvedKind("sekolah");
      })
      .catch(() => {
        if (!mounted) return;
        setUserProfile({ name: "User", email: "", role: "user" });
        setResolvedKind("sekolah");
      });

    return () => {
      mounted = false;
    };
  }, [kind, urlKind]);

  const base = useMemo(() => {
    const segment = kindToRouteSegment[resolvedKind];
    return buildBase(safeOrgId, segment);
  }, [safeOrgId, resolvedKind]);

  const navsWithTo = useMemo(
    () =>
      (NAVS[resolvedKind] ?? []).map((n: NavItem) => ({
        ...n,
        to: buildTo(base, n.path),
      })),
    [resolvedKind, base]
  );

  const handleLogout = useCallback(async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout").catch(() => {});
    } finally {
      try {
        localStorage.clear();
      } catch {}
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleCloseMobile = useCallback(() => {
    if (mode !== "desktop") onCloseMobile?.();
  }, [mode, onCloseMobile]);

  return (
    <>
      {!desktopOnly && open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={`${
          desktopOnly
            ? "hidden lg:flex"
            : `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
                open ? "translate-x-0" : "-translate-x-full"
              }`
        } flex-col border-r ${className}`}
        style={{
          width: "16rem",
          background: palette.white1,
          borderColor: palette.silver1,
          color: palette.black1,
        }}
        aria-label="Sidebar navigasi"
      >
        {!desktopOnly && (
          <div
            className="flex items-center justify-between p-3 border-b lg:hidden"
            style={{ borderColor: palette.silver1 }}
          >
            <h2 className="font-semibold text-sm">Menu</h2>
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Tutup menu"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-2">
          <SectionCard palette={palette} className="p-2">
            <ul className="space-y-2">
              {navsWithTo.map(({ to, icon: Icon, label, end }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={handleCloseMobile}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-3 py-2 border transition-all duration-200",
                        isActive ? "ring-1 ring-offset-0" : "",
                      ].join(" ")
                    }
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black1,
                      background: palette.white1,
                    }}
                    aria-label={`Buka ${label}`}
                  >
                    <Icon size={16} />
                    <span className="truncate font-medium">{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div
          className="p-3 border-t"
          style={{ borderColor: palette.silver1, background: palette.white2 }}
        >
          {userProfile && (
            <div
              className="mb-3 p-3 rounded-xl border flex items-center gap-3"
              style={{
                borderColor: palette.silver1,
                background: palette.white1,
              }}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden text-white font-semibold"
                style={{ background: palette.primary }}
                aria-hidden={!!userProfile.avatar}
              >
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
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
            aria-label="Logout"
          >
            <LogOut size={18} />
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
