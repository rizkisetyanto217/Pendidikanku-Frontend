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

export type Kind = "sekolah" | "murid" | "guru";
export type AutoKind = Kind | "auto";

export type ParentSidebarProps = {
  palette: Palette;
  kind?: AutoKind;
  className?: string;
  desktopOnly?: boolean;
  mode?: "desktop" | "mobile" | "auto";
  openMobile?: boolean;
  onCloseMobile?: () => void;
};

const normalize = (s: string) => s.replace(/\/+$/, "");
const buildBase = (slug: string | undefined, kind: Kind) =>
  slug ? `/${slug}/${kind}` : `/${kind}`;
const buildTo = (base: string, p: string) => {
  const raw = p === "" || p === "." ? base : `${base}/${p.replace(/^\/+/, "")}`;
  return normalize(raw);
};

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
          background: isActive ? palette.primary2 : palette.white1,
          borderColor: isActive ? palette.tertiary : palette.silver1,
          boxShadow: isActive ? `0 0 0 1px ${palette.tertiary} inset` : "none",
          fontWeight: isActive ? 600 : 400,
        }}
      >
        <span
          className="h-7 w-7 grid place-items-center rounded-lg border"
          style={{
            background: isActive ? palette.tertiary : palette.white1,
            borderColor: isActive ? palette.tertiary : palette.silver1,
            color: isActive ? palette.white1 : palette.silver2,
          }}
        >
          <Icon size={16} />
        </span>
        <span className="truncate font-medium">{label}</span>
      </div>
    </Link>
  );
}

export default function ParentSidebar({
  palette,
  kind = "auto",
  className = "",
  desktopOnly = true,
  mode = "auto",
  openMobile = false,
  onCloseMobile,
}: ParentSidebarProps) {
  const navigate = useNavigate();
  const params = useParams<{ slug?: string }>();
  const match = useMatch("/:slug/*");
  const slug = params.slug ?? match?.params.slug ?? "";

  const [resolvedKind, setResolvedKind] = useState<Kind>("sekolah");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    async function determineRole() {
      try {
        const savedRole = localStorage.getItem("active_role");
        if (savedRole) {
          const r = savedRole.toLowerCase();
          if (["teacher", "guru"].includes(r)) setResolvedKind("guru");
          else if (["student", "murid"].includes(r)) setResolvedKind("murid");
          else setResolvedKind("sekolah");
          setLoading(false);
          return;
        }

        const res = await api.get("/auth/me/simple-context");
        const memberships = res.data?.data?.memberships ?? [];
        let role = "user";

        if (memberships.length > 0) {
          const allRoles = memberships.flatMap((m: any) => m.roles ?? []);
          if (allRoles.includes("dkm") || allRoles.includes("admin"))
            role = "dkm";
          else if (allRoles.includes("teacher")) role = "teacher";
          else if (allRoles.includes("student")) role = "student";
        }

        localStorage.setItem("active_role", role);

        if (["teacher", "guru"].includes(role)) setResolvedKind("guru");
        else if (["student", "murid"].includes(role)) setResolvedKind("murid");
        else setResolvedKind("sekolah");
      } catch (err) {
        console.error("Gagal menentukan role sidebar:", err);
        setResolvedKind("sekolah");
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
        "w-full lg:w-64 xl:w-72 shrink-0 bg-white border-r border-gray-200",
        className,
      ].join(" ")}
      style={{
        position: "sticky",
        top: "5rem",
        height: "calc(100vh - 5rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Scrollable menu area */}
      <div
        className="flex-1 p-2"
        style={{
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        <SectionCard
          palette={palette}
          className="p-2"
          style={{ border: `1px solid ${palette.silver1}` }}
        >
          {loading ? (
            <div className="text-sm text-gray-500 text-center py-6">
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
                    onClick={mode !== "desktop" ? onCloseMobile : undefined}
                  />
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>

      {/* Fixed footer - ALWAYS VISIBLE */}
      <div
        className="p-3 border-t border-gray-200 bg-white"
        style={{
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 rounded-xl border py-2 text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: palette.silver1,
          }}
        >
          <LogOut size={18} />
          <span className="font-medium">
            {loggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}
