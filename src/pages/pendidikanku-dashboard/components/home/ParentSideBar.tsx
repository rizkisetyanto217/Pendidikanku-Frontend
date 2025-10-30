import { useEffect, useMemo, useState, useCallback } from "react";
import { NavLink, useMatch, useParams, useNavigate } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import api from "@/lib/axios";
import { SectionCard } from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import { NAVS, type NavItem } from "./navsConfig";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";

type Kind = "sekolah" | "murid" | "guru";
type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
  role: string;
};

type ParentSidebarProps = {
  kind?: Kind | "auto";
  className?: string;
  desktopOnly?: boolean;
  mode?: "desktop" | "mobile" | "auto";
  open?: boolean; // true: expanded, false: collapsed (rail 56px)
  onCloseMobile?: () => void;
};

/* helpers */
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
export const translateRole = (r?: string): string =>
  (
    ({
      teacher: "Guru",
      student: "Murid",
      dkm: "Admin",
      admin: "Admin",
    }) as Record<string, string>
  )[(r ?? "").toLowerCase()] ?? "User";

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

  // detect :id & url-kind
  const params = useParams<{ id?: string }>();
  const matchAnyId = useMatch("/:id/*");
  const possibleId = params.id ?? matchAnyId?.params.id;
  const safeOrgId = looksLikeOrgId(possibleId) ? possibleId : undefined;

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

  useEffect(() => {
    let mounted = true;
    if (kind !== "auto") {
      setResolvedKind(kind);
      return () => {
        mounted = false;
      };
    }
    if (urlKind) {
      setResolvedKind(urlKind);
      return () => {
        mounted = false;
      };
    }

    api
      .get("/auth/me/simple-context")
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data ?? {};
        const memberships = data.memberships ?? [];
        let role: UserProfile["role"] =
          (localStorage.getItem("active_role") as any) || "user";
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

  const base = useMemo(
    () => buildBase(safeOrgId, kindToRouteSegment[resolvedKind]),
    [safeOrgId, resolvedKind]
  );
  const navsWithTo = useMemo(
    () =>
      (NAVS[resolvedKind] ?? []).map((n: NavItem) => ({
        ...n,
        to: buildTo(base, n.path),
      })),
    [resolvedKind, base]
  );

  const goLogout = useCallback(async () => {
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

  // item untuk rail (ikon saja)
  const RailItem = ({
    to,
    Icon,
    label,
    end = false,
  }: {
    to: string;
    Icon: any;
    label: string;
    end?: boolean;
  }) => (
    <NavLink
      to={to}
      end={end}
      onClick={handleCloseMobile}
      className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all"
      style={({ isActive }) => ({
        background: isActive ? palette.primary2 : "transparent",
        boxShadow: `inset 0 0 0 1px ${isActive ? palette.primary : palette.silver1}`,
        color: palette.black1,
      })}
      title={label}
      aria-label={label}
    >
      <Icon size={18} />
    </NavLink>
  );

  return (
    <>
      {/* backdrop mobile */}
      {!desktopOnly && open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
          onClick={onCloseMobile}
          aria-hidden
        />
      )}

      <aside
        className={`${
          desktopOnly
            ? "hidden lg:flex"
            : `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`
        } flex-col ${className}`}
        style={{
          width: desktopOnly ? (open ? "16rem" : "3.5rem") : "16rem", // 56px rail
          background: palette.white1,
          color: palette.black1,
        }}
        aria-label="Sidebar navigasi"
      >
        {/* ====== COLLAPSED RAIL (desktopOnly && !open) ====== */}
        {desktopOnly && !open && (
          <div className="flex h-full w-14 flex-col items-center justify-between py-3">
            <div className="space-y-2">
              {navsWithTo.map(({ to, icon: Icon, label, end }) => (
                <RailItem
                  key={to}
                  to={to}
                  Icon={Icon}
                  label={label}
                  end={end}
                />
              ))}
            </div>

            <button
              onClick={goLogout}
              className="w-10 h-10 rounded-xl grid place-items-center mx-auto"
              style={{
                background: palette.white1,
                boxShadow: `inset 0 0 0 1px ${palette.silver1}`,
                color: "#DC2626",
                opacity: loggingOut ? 0.7 : 1,
              }}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}

        {/* ====== EXPANDED ====== */}
        {(!desktopOnly || open) && (
          <>
            {!desktopOnly && (
              <div
                className="flex items-center justify-between p-3 lg:hidden"
                style={{
                  borderBottom: `1px solid ${palette.silver1}`,
                  background: palette.white1,
                }}
              >
                <h2 className="font-semibold text-sm">Menu</h2>
                <button
                  onClick={onCloseMobile}
                  className="p-2 rounded-lg"
                  style={{ background: palette.white1 }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = palette.white2)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = palette.white1)
                  }
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
                        className="flex items-center gap-3 rounded-2xl px-3 py-2 transition-all duration-200"
                        style={({ isActive }) => ({
                          border: `1px solid ${isActive ? palette.primary : palette.silver1}`,
                          background: isActive
                            ? palette.primary2
                            : palette.white1,
                          color: palette.black1,
                          outline: isActive
                            ? `2px solid ${palette.primary2}`
                            : "none",
                        })}
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
              className="p-3"
              style={{
                borderTop: `1px solid ${palette.silver1}`,
                background: palette.white2,
              }}
            >
              {userProfile && (
                <div
                  className="mb-3 p-3 rounded-2xl flex items-center gap-3"
                  style={{
                    background: palette.white1,
                    boxShadow: `inset 0 0 0 1px ${palette.silver1}`,
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
                onClick={goLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-2 rounded-2xl py-2.5 font-medium transition-all"
                style={{
                  background: palette.white1,
                  boxShadow: `inset 0 0 0 1px ${palette.silver1}`,
                  color: "#DC2626",
                  opacity: loggingOut ? 0.7 : 1,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = palette.white2)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = palette.white1)
                }
                aria-label="Logout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}