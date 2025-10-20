import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useMatch, useParams, useNavigate, } from "react-router-dom";
import { Menu, ArrowLeft } from "lucide-react";
import PublicUserDropdown from "@/components/common/public/UserDropDown";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { NAVS } from "./navsConfig";
import api from "@/lib/axios";
const defaultFormatHijri = (d) => new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    weekday: "long",
}).format(d);
const getLocalMasjid = () => {
    try {
        return JSON.parse(localStorage.getItem("active_masjid") || "{}");
    }
    catch {
        return {};
    }
};
/* ======================================================
   COMPONENT
====================================================== */
export default function ParentTopBar({ palette, hijriDate, gregorianDate, title, showBack = false, onBackClick, dateFmt, }) {
    const { isDark } = useHtmlDarkMode();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const params = useParams();
    const match = useMatch("/:id/*");
    const masjidId = params.id ?? match?.params.id ?? "";
    /* ---------- STATE ---------- */
    const [masjidName, setMasjidName] = useState(getLocalMasjid().masjid_name || "SekolahIslamKu");
    const [masjidIcon, setMasjidIcon] = useState(getLocalMasjid().masjid_icon_url || "/image/Gambar-Masjid.jpeg");
    // Ref untuk mencegah double fetch
    const isFetching = useRef(false);
    const lastFetchedId = useRef("");
    /* ======================================================
       SYNC LOCAL STORAGE + EVENT (REALTIME)
    ====================================================== */
    useEffect(() => {
        const syncFromStorage = (e) => {
            const m = e?.detail || getLocalMasjid();
            if (m.masjid_name)
                setMasjidName(m.masjid_name);
            if (m.masjid_icon_url)
                setMasjidIcon(m.masjid_icon_url);
        };
        window.addEventListener("activeMasjidUpdated", syncFromStorage);
        window.addEventListener("storage", syncFromStorage);
        syncFromStorage();
        return () => {
            window.removeEventListener("activeMasjidUpdated", syncFromStorage);
            window.removeEventListener("storage", syncFromStorage);
        };
    }, []);
    /* ======================================================
       FETCH MASJID CONTEXT (Background - Tanpa Loading UI)
    ====================================================== */
    useEffect(() => {
        // Skip jika tidak ada masjidId atau sedang fetch atau sudah fetch ID ini
        if (!masjidId || isFetching.current || lastFetchedId.current === masjidId) {
            return;
        }
        isFetching.current = true;
        let isMounted = true;
        async function fetchMasjidContext() {
            try {
                const [ctxRes, ownedRes] = await Promise.allSettled([
                    api.get("/auth/me/simple-context"),
                    api.get("/u/masjids/user"),
                ]);
                if (!isMounted)
                    return;
                const memberships = ctxRes.status === "fulfilled"
                    ? (ctxRes.value.data?.data?.memberships ?? [])
                    : [];
                const owned = ownedRes.status === "fulfilled"
                    ? (ownedRes.value.data?.data?.items ?? [])
                    : [];
                const current = memberships.find((m) => m.masjid_id === masjidId) ||
                    owned.find((m) => m.masjid_id === masjidId) ||
                    memberships[0] ||
                    owned[0] ||
                    null;
                if (!current) {
                    lastFetchedId.current = masjidId;
                    return;
                }
                const newMasjid = {
                    masjid_id: current.masjid_id,
                    masjid_name: current.masjid_name || current.name || "Tanpa Nama",
                    masjid_icon_url: current.masjid_icon_url ||
                        current.icon_url ||
                        "/image/Gambar-Masjid.jpeg",
                };
                // Cek apakah data sudah sama
                const existing = getLocalMasjid();
                const isSame = existing.masjid_id === newMasjid.masjid_id &&
                    existing.masjid_name === newMasjid.masjid_name &&
                    existing.masjid_icon_url === newMasjid.masjid_icon_url;
                // Update hanya jika berbeda
                if (!isSame) {
                    localStorage.setItem("active_masjid", JSON.stringify(newMasjid));
                    window.dispatchEvent(new CustomEvent("activeMasjidUpdated", { detail: newMasjid }));
                }
                setMasjidName(newMasjid.masjid_name);
                setMasjidIcon(newMasjid.masjid_icon_url);
                // Tentukan role aktif
                let role = (localStorage.getItem("active_role") || "").toLowerCase();
                if (!role && current.roles?.length) {
                    const roles = current.roles.map((r) => r.toLowerCase());
                    if (roles.includes("dkm") || roles.includes("admin"))
                        role = "dkm";
                    else if (roles.includes("teacher"))
                        role = "teacher";
                    else if (roles.includes("student"))
                        role = "student";
                    else
                        role = "user";
                    localStorage.setItem("active_role", role);
                }
                // Redirect hanya jika benar-benar di root path
                const isRootPath = pathname === `/${masjidId}` || pathname === `/${masjidId}/`;
                if (isRootPath) {
                    const target = role === "teacher"
                        ? "guru"
                        : role === "student"
                            ? "murid"
                            : "sekolah";
                    navigate(`/${masjidId}/${target}`, { replace: true });
                }
                // Tandai ID ini sudah di-fetch
                lastFetchedId.current = masjidId;
            }
            catch (err) {
                console.error("❌ Gagal mengambil data masjid:", err);
                if (isMounted) {
                    lastFetchedId.current = masjidId;
                }
            }
            finally {
                if (isMounted) {
                    isFetching.current = false;
                }
            }
        }
        fetchMasjidContext();
        return () => {
            isMounted = false;
            isFetching.current = false;
        };
    }, [masjidId, pathname, navigate]);
    /* ======================================================
       NAVIGATION LOGIC
    ====================================================== */
    const pageKind = pathname.includes("/sekolah")
        ? "sekolah"
        : pathname.includes("/guru")
            ? "guru"
            : "murid";
    const base = masjidId ? `/${masjidId}/${pageKind}` : `/${pageKind}`;
    const navs = useMemo(() => NAVS[pageKind].map((n) => ({
        ...n,
        path: n.path === "." ? base : `${base}/${n.path}`,
    })), [pageKind, base]);
    const activeLabel = useMemo(() => {
        if (title && typeof title === "string")
            return title;
        const found = navs.find((n) => pathname === n.path || pathname.startsWith(n.path + "/"));
        return found?.label ?? "";
    }, [pathname, navs, title]);
    /* ======================================================
       DATE FORMATTING
    ====================================================== */
    const now = new Date();
    // Gunakan custom dateFmt jika tersedia, atau gunakan default
    const hijriLabel = useMemo(() => {
        if (hijriDate)
            return hijriDate;
        if (dateFmt && gregorianDate)
            return dateFmt(gregorianDate);
        return defaultFormatHijri(now);
    }, [hijriDate, gregorianDate, dateFmt, now]);
    const handleBackClick = () => (onBackClick ? onBackClick() : navigate(-1));
    /* ======================================================
       RENDER
    ====================================================== */
    return (_jsx("div", { className: "sticky top-0 z-40 backdrop-blur border-b transition-all duration-200", style: { borderColor: palette.silver1 }, children: _jsxs("div", { className: "mx-auto px-4 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3 md:hidden flex-1", children: [showBack && (_jsx("button", { onClick: handleBackClick, className: "h-9 w-9 grid place-items-center rounded-xl border", style: { borderColor: palette.silver1 }, children: _jsx(ArrowLeft, { size: 18 }) })), _jsx("span", { className: "font-semibold text-lg truncate flex-1 text-start", children: activeLabel }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "h-9 w-9 grid place-items-center rounded-xl border", style: { borderColor: palette.silver1 }, children: _jsx(Menu, { size: 18 }) }), _jsx(PublicUserDropdown, { variant: "icon", withBg: false })] })] }), _jsxs("div", { className: "hidden md:flex items-center gap-3 transition-all duration-300", children: [_jsx("img", { src: masjidIcon, alt: "Logo Masjid", className: "w-12 h-12 rounded-full object-cover border transition-all duration-300", style: { borderColor: palette.primary }, onError: (e) => {
                                e.currentTarget.src = "/image/Gambar-Masjid.jpeg";
                            } }, masjidIcon), _jsx("span", { className: "text-base font-semibold transition-opacity duration-300", style: { color: palette.primary }, children: masjidName }, masjidName)] }), _jsxs("div", { className: "hidden md:flex items-center gap-3 text-sm", children: [_jsx("span", { className: "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", style: {
                                background: palette.secondary,
                                color: isDark ? palette.black1 : palette.silver1,
                            }, children: hijriLabel }), _jsx(PublicUserDropdown, { variant: "icon", withBg: false })] })] }) }));
}
