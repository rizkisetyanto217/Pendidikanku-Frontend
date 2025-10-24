import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useMatch,
  useParams,
  useResolvedPath,
  useNavigate,
} from "react-router-dom";
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
  role: string;
};

function normalize(path: string) {
  return path.replace(/\/+$/, "");
}

function buildBase(id: string | undefined, kind: Kind) {
  return id ? `/${id}/${kind}` : `/${kind}`;
}

function buildTo(base: string, path: string) {
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
  ({ teacher: "Guru", student: "Murid", dkm: "Admin", admin: "Admin" })[
    r?.toLowerCase()
  ] ?? "User";

export default function ParentSidebar({
  kind = "auto",
  className = "",
  desktopOnly = true,
  mode = "auto",
  open = true,
  onCloseMobile,
}: {
  kind?: Kind | "auto";
  className?: string;
  desktopOnly?: boolean;
  mode?: "desktop" | "mobile" | "auto";
  open?: boolean;
  onCloseMobile?: () => void;
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const match = useMatch("/:id/*");
  const id = params.id ?? match?.params.id ?? "";
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resolvedKind, setResolvedKind] = useState<Kind>("sekolah");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me/simple-context")
      .then((res) => {
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
      .catch(() => setUserProfile({ name: "User", email: "", role: "user" }));
  }, []);

  const base = buildBase(id, resolvedKind);
  const navs: (NavItem & { to: string })[] = useMemo(
    () => NAVS[resolvedKind].map((n) => ({ ...n, to: buildTo(base, n.path) })),
    [resolvedKind, base]
  );

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout").catch(() => {});
    } finally {
      localStorage.clear();
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      {/* Overlay Mobile */}
      {!desktopOnly && open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
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
      >
        {/* Header Mobile */}
        {!desktopOnly && (
          <div
            className="flex items-center justify-between p-3 border-b lg:hidden"
            style={{ borderColor: palette.silver1 }}
          >
            <h2 className="font-semibold text-sm">Menu</h2>
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Scroll area */}
        <div className="flex-1 overflow-y-auto p-2">
          <SectionCard palette={palette} className="p-2">
            <ul className="space-y-2">
              {navs.map(({ to, icon: Icon, label, end }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={mode !== "desktop" ? onCloseMobile : undefined}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 border transition-all duration-200"
                    style={{
                      borderColor: palette.silver1,
                      color: palette.black1,
                    }}
                  >
                    <Icon size={16} />
                    <span className="truncate font-medium">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        {/* Footer */}
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
    </>
  );
}
