// src/pages/sekolahislamku/components/home/ParentTopBar.tsx
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  NavLink,
  useLocation,
  useMatch,
  useParams,
  useNavigate,
} from "react-router-dom";
import { Menu, X, ArrowLeft } from "lucide-react";
import PublicUserDropdown from "@/components/common/public/UserDropDown";
import type { Palette } from "@/pages/sekolahislamku/components/ui/Primitives";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { NAVS, type NavItem } from "./navsConfig";
import api from "@/lib/axios";

/* ================= Props ================= */
interface ParentTopBarProps {
  palette: Palette;
  title?: ReactNode;
  hijriDate?: string;
  gregorianDate?: string;
  dateFmt?: (iso: string) => string;
  showBack?: boolean;
  onBackClick?: () => void;
}

/* ================= Helpers ================= */
const formatIDGregorian = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

const formatHijriLocal = (d: Date) =>
  new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    weekday: "long",
  }).format(new Date(d));

const buildBase = (
  slug: string | undefined,
  root: "sekolah" | "murid" | "guru"
) => (slug ? `/${slug}/${root}` : `/${root}`);

/* ================= Component ================= */
export default function ParentTopBar({
  palette,
  hijriDate,
  gregorianDate,
  dateFmt,
  title,
  showBack = false,
  onBackClick,
}: ParentTopBarProps) {
  const { isDark } = useHtmlDarkMode();
  const [open, setOpen] = useState(false);
  const [schoolName, setSchoolName] = useState<string>("Memuat...");
  const [schoolIcon, setSchoolIcon] = useState<string>(
    "/image/Gambar-Masjid.jpeg"
  );
  const [loadingRedirect, setLoadingRedirect] = useState(true);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ slug?: string }>();
  const match = useMatch("/:slug/*");
  const slug = params.slug ?? match?.params.slug ?? "";

  /* ======== Ambil Nama & Icon + Redirect Sesuai Role ======== */
useEffect(() => {
  async function fetchSchoolData() {
    try {
      const [ctxRes, myMasjidsRes] = await Promise.allSettled([
        api.get("/auth/me/simple-context"),
        api.get("/u/masjids/user"),
      ]);

      const memberships =
        ctxRes.status === "fulfilled"
          ? (ctxRes.value.data?.data?.memberships ?? [])
          : [];
      const ownedMasjids =
        myMasjidsRes.status === "fulfilled"
          ? (myMasjidsRes.value.data?.data?.items ?? [])
          : [];

      let activeRole = localStorage.getItem("active_role");
      let activeMasjidId: string | null = null;

      const savedMasjid = localStorage.getItem("active_masjid");
      if (savedMasjid) {
        try {
          activeMasjidId = JSON.parse(savedMasjid)?.masjid_id ?? null;
        } catch {}
      }

      // cari masjid dari dua sumber
      let current: any =
        memberships.find((m: any) => m.masjid_id === activeMasjidId) ||
        ownedMasjids.find((m: any) => m.masjid_id === activeMasjidId) ||
        memberships.find((m: any) => m.masjid_slug === slug) ||
        ownedMasjids[0] ||
        memberships[0] ||
        null;

      if (!current) {
        setSchoolName("SekolahIslamKu");
        setLoadingRedirect(false);
        return;
      }

      // simpan ke localStorage
      localStorage.setItem(
        "active_masjid",
        JSON.stringify({
          masjid_id: current.masjid_id,
          masjid_slug: current.masjid_slug ?? current.slug ?? "",
        })
      );

      if (!activeRole && current.roles?.length) {
        const roles = current.roles.map((r: string) => r.toLowerCase());
        if (roles.includes("dkm") || roles.includes("admin"))
          activeRole = "dkm";
        else if (roles.includes("teacher")) activeRole = "teacher";
        else if (roles.includes("student")) activeRole = "student";
        else activeRole = "user";
        localStorage.setItem("active_role", activeRole);
      }

      // redirect sesuai role
      if (activeRole) {
        const baseSlug = current.masjid_slug ?? current.slug;
        const normalizedRole = activeRole.toLowerCase();

        if (["dkm", "admin"].includes(normalizedRole)) {
          if (!pathname.includes("/sekolah"))
            navigate(`/${baseSlug}/sekolah`, { replace: true });
        } else if (["teacher", "guru"].includes(normalizedRole)) {
          if (!pathname.includes("/guru"))
            navigate(`/${baseSlug}/guru`, { replace: true });
        } else if (["student", "murid"].includes(normalizedRole)) {
          if (!pathname.includes("/murid"))
            navigate(`/${baseSlug}/murid`, { replace: true });
        } else {
          if (!pathname.includes("/sekolah"))
            navigate(`/${baseSlug}/sekolah`, { replace: true });
        }
      }

      // update UI
      setSchoolName(
        current.masjid_name || current.name || "Sekolah Tanpa Nama"
      );
      if (current.masjid_icon_url || current.icon_url)
        setSchoolIcon(current.masjid_icon_url || current.icon_url);
    } catch (err) {
      console.error("Gagal ambil sekolah:", err);
      setSchoolName("SekolahIslamKu");
    } finally {
      setLoadingRedirect(false);
    }
  }

  fetchSchoolData();
}, [slug, pathname, navigate]);

  /* ======== Page Kind / Navigasi ======== */
  const pageKind: "sekolah" | "murid" | "guru" = pathname.includes("/sekolah")
    ? "sekolah"
    : pathname.includes("/guru")
      ? "guru"
      : "murid";

  const base = buildBase(slug, pageKind);
  const navs: NavItem[] = useMemo(
    () =>
      NAVS[pageKind].map((n) => ({
        ...n,
        path: n.path === "." ? base : `${base}/${n.path}`,
      })),
    [pageKind, base]
  );

  const activeLabel = useMemo(() => {
    if (title && typeof title === "string") return title;
    const found = navs.find(
      (n) => pathname === n.path || pathname.startsWith(n.path + "/")
    );
    return found?.label ?? "";
  }, [pathname, navs, title]);

  const now = new Date();
  const gIso = gregorianDate ?? now.toISOString();
  const formattedGregorian = dateFmt ? dateFmt(gIso) : formatIDGregorian(gIso);
  const hijriLabel = hijriDate || formatHijriLocal(now);
  const handleBackClick = () => (onBackClick ? onBackClick() : navigate(-1));

  if (loadingRedirect) {
    return (
      <div className="w-full flex items-center justify-center py-10 text-gray-500 text-sm">
        Memuat data sekolah...
      </div>
    );
  }

  return (
    <>
      <div
        className="sticky top-0 z-40 backdrop-blur border-b"
        style={{ borderColor: palette.silver1 }}
      >
        <div className="mx-auto px-4 py-3 flex items-center justify-between">
          {/* Mobile Header */}
          <div className="flex items-center gap-3 md:hidden flex-1">
            {showBack && (
              <button
                className="h-9 w-9 grid place-items-center rounded-xl border"
                onClick={handleBackClick}
                style={{ borderColor: palette.silver1 }}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <span className="font-semibold text-lg truncate flex-1 text-start">
              {activeLabel}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="h-9 w-9 grid place-items-center rounded-xl border"
                onClick={() => setOpen(true)}
                style={{ borderColor: palette.silver1 }}
              >
                <Menu size={18} />
              </button>
              <PublicUserDropdown variant="icon" withBg={false} />
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-3">
            <img
              src={schoolIcon}
              alt="Logo Sekolah"
              className="w-12 h-12 rounded-full object-cover border"
              style={{ borderColor: palette.primary }}
            />
            <span
              className="text-base font-semibold"
              style={{ color: palette.primary }}
            >
              {schoolName}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-sm">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: palette.secondary,
                color: isDark ? palette.black1 : palette.silver1,
              }}
            >
              {hijriLabel}
            </span>
            <PublicUserDropdown variant="icon" withBg={false} />
          </div>
        </div>
      </div>
    </>
  );
}
