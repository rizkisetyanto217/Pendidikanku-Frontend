import { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import {
  useLocation,
  useMatch,
  useParams,
  useNavigate,
} from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import PublicUserDropdown from "@/components/common/public/UserDropDown";
import { type Palette } from "@/pages/pendidikanku-dashboard/components/ui/Primitives";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { NAVS, type NavItem } from "./navsConfig";
import api from "@/lib/axios";

/* ======================================================
   TYPES & HELPERS
====================================================== */
interface ParentTopBarProps {
  palette: Palette;
  title?: ReactNode;
  hijriDate?: string;
  gregorianDate?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  onMenuClick?: () => void; // 👈 tambahkan agar bisa buka sidebar mobile
  dateFmt?: (iso: string) => string;
}

const defaultFormatHijri = (d: Date) =>
  new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);

const getLocalMasjid = () => {
  try {
    return JSON.parse(localStorage.getItem("active_masjid") || "{}");
  } catch {
    return {};
  }
};

/* ======================================================
   COMPONENT
====================================================== */
export default function ParentTopBar({
  palette,
  hijriDate,
  gregorianDate,
  title,
  showBack = false,
  onBackClick,
  onMenuClick,
  dateFmt,
}: ParentTopBarProps) {
  const { isDark } = useHtmlDarkMode();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useParams<{ id?: string }>();
  const match = useMatch("/:id/*");
  const id = params.id ?? match?.params.id ?? "";

  const [masjidName, setMasjidName] = useState(
    getLocalMasjid().masjid_name || "SekolahIslamKu"
  );
  const [masjidIcon, setMasjidIcon] = useState(
    getLocalMasjid().masjid_icon_url || "/image/Gambar-Masjid.jpeg"
  );
  const isFetching = useRef(false);
  const lastFetchedId = useRef<string>("");

  /* ======================================================
     FETCH MASJID CONTEXT
  ====================================================== */
  useEffect(() => {
    if (!id || isFetching.current || lastFetchedId.current === id) return;
    isFetching.current = true;

    async function fetchContext() {
      try {
        const res = await api.get("/auth/me/simple-context");
        const userData = res.data?.data;
        const memberships = userData?.memberships ?? [];
        const current =
          memberships.find((m: any) => m.masjid_id === id) || memberships[0];
        if (!current) return;

        const newMasjid = {
          masjid_id: current.masjid_id,
          masjid_name: current.masjid_name || "Tanpa Nama",
          masjid_icon_url:
            current.masjid_icon_url || "/image/Gambar-Masjid.jpeg",
        };

        localStorage.setItem("active_masjid", JSON.stringify(newMasjid));
        setMasjidName(newMasjid.masjid_name);
        setMasjidIcon(newMasjid.masjid_icon_url);

        const role = (
          localStorage.getItem("active_role") || "user"
        ).toLowerCase();
        const isRoot = pathname === `/${id}` || pathname === `/${id}/`;
        if (isRoot) {
          const target =
            role === "teacher"
              ? "guru"
              : role === "student"
                ? "murid"
                : "sekolah";
          navigate(`/${id}/${target}`, { replace: true });
        }

        lastFetchedId.current = id;
      } catch (err) {
        console.error("Gagal fetch context:", err);
      } finally {
        isFetching.current = false;
      }
    }

    fetchContext();
  }, [id, pathname, navigate]);

  /* ======================================================
     PAGE TITLE
  ====================================================== */
  const pageKind: "sekolah" | "murid" | "guru" = pathname.includes("/sekolah")
    ? "sekolah"
    : pathname.includes("/guru")
      ? "guru"
      : "murid";

  const base = id ? `/${id}/${pageKind}` : `/${pageKind}`;
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

  /* ======================================================
     HIJRI DATE
  ====================================================== */
  const [hijriLabel, setHijriLabel] = useState<string>("");

  useEffect(() => {
    if (hijriDate) return setHijriLabel(hijriDate);
    if (gregorianDate && dateFmt) return setHijriLabel(dateFmt(gregorianDate));
    setHijriLabel(defaultFormatHijri(new Date()));
  }, [hijriDate, gregorianDate, dateFmt]);

  const handleBack = () => (onBackClick ? onBackClick() : navigate(-1));

  /* ======================================================
     RENDER
  ====================================================== */
  return (
    <div
      className="sticky top-0 z-40 backdrop-blur border-b transition-all duration-200"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
    >
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        {/* === DESKTOP === */}
        <div className="hidden md:flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="h-9 w-9 grid place-items-center rounded-xl border"
              style={{ borderColor: palette.silver1 }}
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <img
            src={masjidIcon}
            alt="Logo Masjid"
            className="w-12 h-12 rounded-full object-cover border"
            style={{ borderColor: palette.primary }}
            onError={(e) => (e.currentTarget.src = "/image/Gambar-Masjid.jpeg")}
          />
          <span
            className="text-base font-semibold"
            style={{ color: palette.primary }}
          >
            {masjidName}
          </span>
        </div>

        {/* === RIGHT SIDE === */}
        <div className="hidden md:flex items-center gap-3 text-sm">
          {hijriLabel && (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
              style={{
                background: palette.secondary,
                color: isDark ? palette.black1 : palette.white1,
              }}
            >
              {hijriLabel}
            </span>
          )}
          <PublicUserDropdown variant="icon" withBg={false} />
        </div>

        {/* === MOBILE === */}
        <div className="flex md:hidden items-center justify-between w-full">
          {showBack ? (
            <button
              onClick={handleBack}
              className="h-9 w-9 grid place-items-center rounded-xl border"
              style={{ borderColor: palette.silver1 }}
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <button
              onClick={onMenuClick}
              className="h-9 w-9 grid place-items-center rounded-xl border"
              style={{ borderColor: palette.silver1 }}
            >
              <Menu size={18} />
            </button>
          )}
          <span className="font-semibold text-base truncate flex-1 text-center">
            {activeLabel}
          </span>
          <PublicUserDropdown variant="icon" withBg={false} />
        </div>
      </div>
    </div>
  );
}
