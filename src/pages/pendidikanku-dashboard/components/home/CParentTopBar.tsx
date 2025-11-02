import { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import {
  useLocation,
  useMatch,
  useParams,
  useNavigate,
} from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import PublicUserDropdown from "@/components/common/public/CUserDropDown";
import { type Palette } from "@/pages/pendidikanku-dashboard/components/ui/CPrimitives";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { NAVS, type NavItem } from "./navsConfig";
import api from "@/lib/axios";

/* ================== TYPES & HELPERS ================== */
interface ParentTopBarProps {
  palette: Palette;
  title?: ReactNode;
  hijriDate?: string;
  gregorianDate?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  onMenuClick?: () => void; // mobile hamburger
  dateFmt?: (iso: string) => string;

  // 🔽 baru untuk toggle sidebar desktop
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const defaultFormatHijri = (d: Date) =>
  new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);

const getLocalschool = () => {
  try {
    return JSON.parse(localStorage.getItem("active_school") || "{}");
  } catch {
    return {};
  }
};

/* ================== COMPONENT ================== */
export default function ParentTopBar({
  palette,
  hijriDate,
  gregorianDate,
  title,
  showBack = false,
  onBackClick,
  onMenuClick,
  dateFmt,
  sidebarOpen = true, // 👈 default open
  onToggleSidebar, // 👈 handler dari MainLayout
}: ParentTopBarProps) {
  const { isDark } = useHtmlDarkMode();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useParams<{ id?: string }>();
  const match = useMatch("/:id/*");
  const id = params.id ?? match?.params.id ?? "";

  const [schoolName, setschoolName] = useState(
    getLocalschool().school_name || "SekolahIslamKu"
  );
  const [schoolIcon, setschoolIcon] = useState(
    getLocalschool().school_icon_url || "/image/Gambar-school.jpeg"
  );
  const isFetching = useRef(false);
  const lastFetchedId = useRef<string>("");

  /* ================== FETCH school CONTEXT ================== */
  useEffect(() => {
    if (!id || isFetching.current || lastFetchedId.current === id) return;
    isFetching.current = true;

    (async () => {
      try {
        const res = await api.get("/auth/me/simple-context");
        const userData = res.data?.data;
        const memberships = userData?.memberships ?? [];
        const current =
          memberships.find((m: any) => m.school_id === id) || memberships[0];
        if (!current) return;

        const newschool = {
          school_id: current.school_id,
          school_name: current.school_name || "Tanpa Nama",
          school_icon_url:
            current.school_icon_url || "/image/Gambar-school.jpeg",
        };

        localStorage.setItem("active_school", JSON.stringify(newschool));
        setschoolName(newschool.school_name);
        setschoolIcon(newschool.school_icon_url);

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
    })();
  }, [id, pathname, navigate]);

  /* ================== PAGE TITLE ================== */
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

  /* ================== HIJRI DATE ================== */
  const [hijriLabel, setHijriLabel] = useState<string>("");
  useEffect(() => {
    if (hijriDate) return setHijriLabel(hijriDate);
    if (gregorianDate && dateFmt) return setHijriLabel(dateFmt(gregorianDate));
    setHijriLabel(defaultFormatHijri(new Date()));
  }, [hijriDate, gregorianDate, dateFmt]);

  const handleBack = () => (onBackClick ? onBackClick() : navigate(-1));

  /* ================== RENDER ================== */
  return (
    <div
      className="sticky top-0 z-50 backdrop-blur border-b transition-all duration-200"
      style={{ borderColor: palette.silver1, background: palette.white1 }}
    >
      <div className="mx-auto px-4 py-3 flex items-center justify-between">
        {/* === DESKTOP LEFT === */}
        <div className="hidden md:flex items-center gap-3">
          {/* 👉 Toggle Sidebar diletakkan di sebelah nama lembaga */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="ml-1 h-9 w-9 grid place-items-center rounded-xl border"
              style={{
                borderColor: palette.silver1,
                background: palette.white1,
                color: palette.black1,
              }}
              title={sidebarOpen ? "Sembunyikan sidebar" : "Tampilkan sidebar"}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = palette.white2)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = palette.white1)
              }
            >
              <Menu
                size={18}
                className={`transition-transform duration-300 ${sidebarOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
          )}
          {showBack && (
            <button
              onClick={handleBack}
              className="h-9 w-9 grid place-items-center rounded-xl border"
              style={{ borderColor: palette.silver1 }}
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <img
            src={schoolIcon}
            alt="Logo school"
            className="w-12 h-12 rounded-full object-cover border"
            style={{ borderColor: palette.primary }}
            onError={(e) => (e.currentTarget.src = "/image/Gambar-school.jpeg")}
          />

          <span
            className="text-base font-semibold"
            style={{ color: palette.primary }}
          >
            {schoolName}
          </span>
        </div>

        {/* === DESKTOP RIGHT === */}
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

        {/* === MOBILE BAR === */}
        {/* === MOBILE BAR === */}
        <div className="flex md:hidden items-center justify-between w-full">
          {/* Kiri: back kalau ada; kalau tidak, tampilkan menu */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <button
                onClick={handleBack}
                className="h-9 w-9 grid place-items-center rounded-xl border"
                style={{ borderColor: palette.silver1 }}
                title="Kembali"
                aria-label="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <button
                onClick={onMenuClick}
                className="h-9 w-9 grid place-items-center rounded-xl border"
                style={{ borderColor: palette.silver1 }}
                title="Buka menu"
                aria-label="Buka menu"
              >
                <Menu size={18} />
              </button>
            )}
          </div>

          {/* Tengah: judul */}
          <span className="font-semibold text-base truncate flex-1 text-center">
            {activeLabel}
          </span>

          {/* Kanan: jika showBack true, tetap sediakan hamburger di kanan */}
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={onMenuClick}
                className="h-9 w-9 grid place-items-center rounded-xl border"
                style={{ borderColor: palette.silver1 }}
                title="Buka menu"
                aria-label="Buka menu"
              >
                <Menu size={18} />
              </button>
            )}
            <PublicUserDropdown variant="icon" withBg={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
