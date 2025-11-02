import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { NavLink, useMatch, useParams, useNavigate } from "react-router-dom";
import {
  LogOut,
  X,
  Building2,
  ChevronDown,
  Loader2,
  CheckCircle,
} from "lucide-react";
import api, { fetchSimpleContext, setActiveMasjidContext } from "@/lib/axios";
import { SectionCard } from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import { NAVS, type NavItem } from "./navsConfig";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { pickTheme, ThemeName, type Palette } from "@/constants/thema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useActiveMasjidInfo } from "@/hooks/useActiveMasjidInfo";
import { DeleteConfirmModal } from "@/pages/pendidikanku-dashboard/components/common/CDeleteConfirmModal";

/* ================= helpers & types ================= */
type Kind = "sekolah" | "murid" | "guru";
type UserProfile = {
  name: string;
  email?: string;
  avatar?: string;
  role: string;
};
export type MasjidRole = "dkm" | "admin" | "teacher" | "student" | "user";

type ParentSidebarProps = {
  kind?: Kind | "auto";
  className?: string;
  desktopOnly?: boolean;
  mode?: "desktop" | "mobile" | "auto";
  open?: boolean;
  onCloseMobile?: () => void;
};

type Membership = {
  masjid_id: string;
  masjid_name: string;
  masjid_icon_url?: string | null;
  roles: MasjidRole[];
};

type SimpleContext = {
  memberships: Membership[];
  user_id?: string;
  user_name?: string;
  name?: string;
  email?: string;
  avatar?: string;
  user_avatar_url?: string;
  profile_photo_url?: string;
};

/* ============== DEBUG ============== */
const DEBUG = true;
const DBG = {
  log: (...a: any[]) => DEBUG && console.log("[Sidebar]", ...a),
};

/* ---- API normalize ---- */
const getSimpleContext: () => Promise<SimpleContext> = async () => {
  const resp: any = await fetchSimpleContext();
  const raw: any = resp?.data?.data ?? resp?.data ?? resp ?? {};

  const memberships: Membership[] = (raw?.memberships ?? []).map((m: any) => ({
    masjid_id: m.masjid_id,
    masjid_name: m.masjid_name,
    masjid_icon_url: m.masjid_icon_url ?? null,
    roles: (m.roles ?? []) as MasjidRole[],
  }));

  const ctx: SimpleContext = {
    memberships,
    user_id: raw?.user_id,
    user_name: raw?.user_name,
    name: raw?.name,
    email: raw?.email,
    user_avatar_url: raw?.user_avatar_url,
    avatar: raw?.avatar,
    profile_photo_url: raw?.profile_photo_url,
  };

  DBG.log("normalized simple-context:", ctx);
  return ctx;
};

function normalizePath(p: string) {
  return p.replace(/\/+$/, "");
}
function looksLikeOrgId(s?: string) {
  return (
    !!s &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      s
    )
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
  return normalizePath(`${base}/${path.replace(/^\/+/, "")}`);
}
const getInitials = (n?: string) =>
  n?.trim()
    ? n
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";
export const translateRole = (r?: string): string =>
  (
    ({
      teacher: "Guru",
      student: "Murid",
      dkm: "Admin",
      admin: "Admin",
    }) as Record<string, string>
  )[(r ?? "").toLowerCase()] ?? "User";

/* ===================================================================
   MODAL SWITCH CONTEXT
   =================================================================== */
function ModalSwitchContext({
  open,
  onClose,
  onSelect,
  current,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (
    masjidId: string,
    role: MasjidRole,
    display: { name?: string; icon?: string | null }
  ) => void;
  current?: { masjidId?: string | null; role?: MasjidRole };
}) {
  const { isDark, themeName } = useHtmlDarkMode();
  const palette = pickTheme(themeName as ThemeName, isDark);
  const qc = useQueryClient();

  const initial = qc.getQueryData<SimpleContext>(["me", "simple-context"]);
  const { data, isLoading } = useQuery<SimpleContext, Error>({
    queryKey: ["me", "simple-context"],
    queryFn: getSimpleContext,
    initialData: initial,
    enabled: open && !initial,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  const memberships: Membership[] = (data?.memberships ?? []).map((m) => ({
    masjid_id: m.masjid_id,
    masjid_name: m.masjid_name,
    masjid_icon_url: m.masjid_icon_url ?? undefined,
    roles: (m.roles ?? []) as MasjidRole[],
  }));
  const isSingleMode =
    memberships.length === 1 && (memberships[0].roles?.length || 0) === 1;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Ganti Masjid / Role"
    >
      <div
        className="rounded-3xl w-full max-w-md p-6 shadow-2xl"
        style={{ background: palette.white1, color: palette.black1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl grid place-items-center"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.quaternary})`,
            }}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold">
            {isSingleMode ? "Konteks Saat Ini" : "Pilih Masjid & Role"}
          </h3>
        </div>

        {isLoading ? (
          <div className="py-10 text-center flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm" style={{ color: palette.silver2 }}>
              Memuat data...
            </p>
          </div>
        ) : memberships.length === 0 ? (
          <p className="text-sm" style={{ color: palette.silver2 }}>
            Belum ada keanggotaan.
          </p>
        ) : isSingleMode ? (
          (() => {
            const m = memberships[0];
            const r = m.roles[0];
            const isActive =
              current?.masjidId === m.masjid_id && current?.role === r;
            return (
              <>
                <div
                  className="rounded-2xl border p-4 mb-4"
                  style={{
                    borderColor: isActive ? palette.primary : palette.silver1,
                    background: isActive ? palette.primary2 : palette.white2,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={m.masjid_icon_url || "/image/Gambar-Masjid.jpeg"}
                      alt={m.masjid_name}
                      className="w-12 h-12 rounded-lg object-cover border"
                      style={{ borderColor: palette.white3 }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">
                        {m.masjid_name}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: palette.silver2 }}
                      >
                        Role: {r.toUpperCase()}
                      </div>
                    </div>
                    {isActive && (
                      <span
                        className="ml-auto text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{
                          background: palette.primary,
                          color: palette.white1,
                          border: `1px solid ${palette.primary}`,
                        }}
                      >
                        <CheckCircle className="w-3 h-3" /> Aktif
                      </span>
                    )}
                  </div>
                  {!isActive && (
                    <button
                      type="button"
                      onClick={() =>
                        onSelect(m.masjid_id, r, {
                          name: m.masjid_name,
                          icon: m.masjid_icon_url ?? undefined,
                        })
                      }
                      className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
                      style={{
                        background: `linear-gradient(90deg, ${palette.primary}, ${palette.quaternary})`,
                        color: palette.white1,
                      }}
                    >
                      Pakai
                    </button>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm rounded-lg"
                    style={{
                      border: `1px solid ${palette.silver1}`,
                      background: palette.white2,
                    }}
                  >
                    Tutup
                  </button>
                </div>
              </>
            );
          })()
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
              {memberships.map((m) => {
                const isActiveMasjid = !!(
                  current?.masjidId && m.masjid_id === current.masjidId
                );
                return (
                  <div
                    key={m.masjid_id}
                    className="rounded-2xl border p-3"
                    style={{
                      borderColor: isActiveMasjid
                        ? palette.primary
                        : palette.silver1,
                      background: isActiveMasjid
                        ? palette.primary2
                        : palette.white2,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={m.masjid_icon_url || "/image/Gambar-Masjid.jpeg"}
                        alt={m.masjid_name}
                        className="w-10 h-10 rounded-lg object-cover border"
                        style={{ borderColor: palette.white3 }}
                      />
                      <div className="font-medium flex items-center gap-2 min-w-0">
                        <span className="truncate">{m.masjid_name}</span>
                        {isActiveMasjid && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{
                              background: palette.primary,
                              color: palette.white1,
                              border: `1px solid ${palette.primary}`,
                            }}
                          >
                            Aktif
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(m.roles?.length
                        ? m.roles
                        : (["user"] as MasjidRole[])
                      ).map((r) => {
                        const isActiveRole =
                          isActiveMasjid && r === current?.role;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() =>
                              onSelect(m.masjid_id, r, {
                                name: m.masjid_name,
                                icon: m.masjid_icon_url ?? undefined,
                              })
                            }
                            className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
                            style={{
                              borderColor: isActiveRole
                                ? palette.primary
                                : palette.silver1,
                              background: isActiveRole
                                ? palette.primary
                                : palette.white1,
                              color: isActiveRole
                                ? palette.white1
                                : palette.black1,
                            }}
                            aria-pressed={isActiveRole}
                          >
                            {r.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-lg"
                style={{
                  border: `1px solid ${palette.silver1}`,
                  background: palette.white2,
                }}
              >
                Tutup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= Small component: User Options Menu ================= */
function UserOptionsMenu({
  palette,
  onLogout,
  onSwitchContext,
  loggingOut,
  className = "",
}: {
  palette: Palette;
  onLogout: () => void;
  onSwitchContext: () => void;
  loggingOut: boolean;
  className?: string;
}) {
  return (
    <div
      id="sidebar-user-menu"
      role="menu"
      aria-label="Menu pengguna"
      className={`z-50 rounded-2xl shadow-xl ${className}`}
      style={{
        background: palette.white1,
        border: `1px solid ${palette.silver1}`,
      }}
    >
      <ul className="py-1">
        <li>
          <button
            type="button"
            onClick={onSwitchContext}
            className="w-full text-left px-4 py-2 rounded-xl"
            style={{ color: palette.black1 }}
          >
            Ganti Masjid / Role
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="w-full text-left px-4 py-2 rounded-xl font-medium"
            style={{
              color: "#DC2626",
              opacity: loggingOut ? 0.7 : 1,
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

/* ================= SIDEBAR ================= */
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
  const qc = useQueryClient();
  const [logoutOpen, setLogoutOpen] = useState(false);

  // URL params
  const params = useParams<{ id?: string }>();
  const matchAnyId = useMatch("/:id/*");
  const possibleId = params.id ?? matchAnyId?.params.id;
  const safeOrgIdFromUrl = looksLikeOrgId(possibleId) ? possibleId : undefined;

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

  // Active context
  const active = useActiveMasjidInfo();
  useEffect(() => {
    DBG.log("useActiveMasjidInfo()", active);
  }, [active]);

  // Simple-context
  const { data: ctxData } = useQuery<SimpleContext, Error>({
    queryKey: ["me", "simple-context"],
    queryFn: getSimpleContext,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  const userName = ctxData?.user_name || ctxData?.name || "User";
  const userEmail = ctxData?.email || "";
  const avatarUrl =
    ctxData?.user_avatar_url ||
    ctxData?.avatar ||
    ctxData?.profile_photo_url ||
    undefined;

  useEffect(() => {
    DBG.log("Avatar chosen", avatarUrl);
  }, [avatarUrl]);

  const storedRole =
    (typeof window !== "undefined"
      ? localStorage.getItem("active_role")
      : null) || undefined;
  const roles = (active.roles ?? []) as string[];
  const derivedRole: MasjidRole =
    (storedRole as MasjidRole) ||
    (roles.includes("teacher")
      ? "teacher"
      : roles.includes("student")
        ? "student"
        : roles.includes("dkm") || roles.includes("admin")
          ? "dkm"
          : "user");

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [resolvedKind, setResolvedKind] = useState<Kind>("sekolah");
  const [loggingOut, setLoggingOut] = useState(false);
  const [openSwitcher, setOpenSwitcher] = useState(false);

  // dropdown user
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (kind !== "auto") setResolvedKind(kind);
    else if (urlKind) setResolvedKind(urlKind);
    else if (derivedRole === "teacher") setResolvedKind("guru");
    else if (derivedRole === "student") setResolvedKind("murid");
    else setResolvedKind("sekolah");
  }, [kind, urlKind, derivedRole]);

  useEffect(() => {
    const next: UserProfile = {
      name: userName,
      email: userEmail,
      role: derivedRole,
      avatar: avatarUrl,
    };
    setUserProfile(next);
    DBG.log("Set userProfile", next);
  }, [userName, userEmail, derivedRole, avatarUrl]);

  // click-outside + Esc
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!userBtnRef.current) return;
      const menu = document.getElementById("sidebar-user-menu");
      const target = e.target as Node;
      if (
        !userBtnRef.current.contains(target) &&
        !(menu && menu.contains(target))
      ) {
        setUserMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const effectiveOrgId = active.id ?? safeOrgIdFromUrl;
  const base = useMemo(
    () => buildBase(effectiveOrgId, kindToRouteSegment[resolvedKind]),
    [effectiveOrgId, resolvedKind]
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
      window.dispatchEvent(new Event("auth:logout"));
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleCloseMobile = useCallback(() => {
    if (mode !== "desktop") onCloseMobile?.();
  }, [mode, onCloseMobile]);

  const handleSwitch = useCallback(
    async (
      masjidId: string,
      role: MasjidRole,
      display: { name?: string; icon?: string | null }
    ) => {
      DBG.log("handleSwitch", { masjidId, role, display });
      try {
        localStorage.setItem("active_role", role);
      } catch {}
      await setActiveMasjidContext(masjidId, role, {
        name: display?.name,
        icon: display?.icon ?? undefined,
      });
      window.dispatchEvent(new Event("masjid:changed"));

      const seg =
        role === "teacher" ? "guru" : role === "student" ? "murid" : "sekolah";
      setOpenSwitcher(false);

      await Promise.allSettled([
        qc.invalidateQueries({ queryKey: ["me", "simple-context"] }),
        qc.prefetchQuery({
          queryKey: ["me", "simple-context"],
          queryFn: getSimpleContext,
        }),
      ]);

      navigate(`/${masjidId}/${seg}`, { replace: true });
    },
    [navigate, qc]
  );

  // helper rail item
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

  // ===== aside class (fix layout) =====
  const asideBase = desktopOnly
    ? "hidden lg:flex"
    : `fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      } flex`; // penting: flex

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
        className={`${asideBase} relative flex-col shrink-0 ${className}`}
        style={{
          width: desktopOnly ? (open ? "16rem" : "3.5rem") : "16rem",
          background: palette.white1,
          color: palette.black1,
        }}
        aria-label="Sidebar navigasi"
      >
        {/* ====== COLLAPSED RAIL ====== */}
        {desktopOnly && !open && (
          <div className="flex h-full w-14 flex-col py-3 overflow-hidden">
            <div className="space-y-2 overflow-y-auto">
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

            {/* Avatar rail (selalu di paling bawah) */}
            <div className="mt-auto relative">
              <button
                ref={userBtnRef}
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="w-10 h-10 rounded-xl grid place-items-center mx-auto"
                style={{
                  background: palette.white1,
                  boxShadow: `inset 0 0 0 1px ${palette.silver1}`,
                }}
                title="User menu"
                aria-label="User menu"
              >
                {userProfile?.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="h-10 w-10 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs font-semibold">
                    {getInitials(userProfile?.name)}
                  </span>
                )}
              </button>

              {userMenuOpen && (
                <UserOptionsMenu
                  palette={palette}
                  loggingOut={loggingOut}
                  onLogout={() => setLogoutOpen(true)} // <-- buka modal
                  onSwitchContext={() => {
                    setUserMenuOpen(false);
                    setOpenSwitcher(true);
                  }}
                  className="absolute left-16 bottom-0 w-56"
                />
              )}
            </div>
          </div>
        )}

        {/* ====== EXPANDED ====== */}
        {(!desktopOnly || open) && (
          <div className="flex h-full flex-col">
            {/* Mobile header */}
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

            {/* Active Masjid header card */}
            <div className="p-2">
              <SectionCard palette={palette} className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={active.icon || "/image/Gambar-Masjid.jpeg"}
                    alt={active.name || "Masjid"}
                    className="w-10 h-10 rounded-xl object-cover border"
                    style={{ borderColor: palette.white3 }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">
                      {active.name || "Masjid Aktif"}
                    </div>
                    <div className="text-xs" style={{ color: palette.silver2 }}>
                      {translateRole(derivedRole)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenSwitcher(true)}
                    className="px-2.5 py-1.5 text-xs rounded-lg border flex items-center gap-1"
                    style={{
                      borderColor: palette.silver1,
                      background: palette.white2,
                    }}
                  >
                    Ganti <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Nav list */}
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

            {/* Footer: user (selalu paling bawah, non-scroll) */}
            <div
              className="p-3 relative mt-auto"
              style={{
                borderTop: `1px solid ${palette.silver1}`,
                background: palette.white2,
              }}
            >
              {userProfile && (
                <button
                  ref={userBtnRef}
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className="w-full p-3 rounded-2xl flex items-center gap-3 text-left"
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
                        referrerPolicy="no-referrer"
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
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {userMenuOpen && (
                <UserOptionsMenu
                  palette={palette}
                  loggingOut={loggingOut}
                  onLogout={() => setLogoutOpen(true)} // <-- buka modal
                  onSwitchContext={() => {
                    setUserMenuOpen(false);
                    setOpenSwitcher(true);
                  }}
                  className="absolute bottom-16 left-3 right-3"
                />
              )}
            </div>
          </div>
        )}
      </aside>

      <DeleteConfirmModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={goLogout} // <-- benar-benar logout di sini
        palette={palette}
        title="Konfirmasi Logout"
        message="Keluar dari sesi ini? Kamu bisa login lagi kapan saja."
        confirmLabel="Logout"
        cancelLabel="Batal"
        loading={loggingOut}
      />

      {/* Switcher Modal */}
      <ModalSwitchContext
        open={openSwitcher}
        onClose={() => setOpenSwitcher(false)}
        onSelect={handleSwitch}
        current={{ masjidId: active.id, role: derivedRole }}
      />
    </>
  );
}
