import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useResponsive } from "@/hooks/isResponsive";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { ChevronLeft, ChevronRight, MapPin, BookOpen, Share as ShareIcon, Share2, Phone, HeartHandshake, Copy, Link as LinkIcon, ExternalLink, } from "lucide-react";
import PublicNavbar from "@/components/common/public/PublicNavbar";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import BorderLine from "@/components/common/main/Border";
import CartLink from "@/components/common/main/CardLink";
import FormattedDate from "@/constants/formattedDate";
import SholatScheduleCard from "@/components/pages/home/SholatSchedule";
import SocialMediaModal from "@/components/pages/home/SocialMediaModal";
import ShimmerImage from "@/components/common/main/ShimmerImage";
const currentUrl = typeof window !== "undefined" ? window.location.href : "";
function buildSosmedUrl(kind, raw) {
    if (!raw)
        return null;
    const v0 = raw.trim();
    if (!v0)
        return null;
    const isURL = /^https?:\/\//i.test(v0);
    switch (kind) {
        case "instagram": {
            const v = v0.replace(/^@/, "");
            return isURL ? v0 : `https://instagram.com/${v}`;
        }
        case "whatsapp": {
            const digits = v0.replace(/[^\d]/g, "").replace(/^0/, "62");
            return isURL ? v0 : digits ? `https://wa.me/${digits}` : null;
        }
        case "youtube": {
            return isURL ? v0 : `https://${v0}`;
        }
        case "facebook": {
            return isURL ? v0 : `https://facebook.com/${v0}`;
        }
        case "tiktok": {
            const v = v0.replace(/^@/, "");
            return isURL ? v0 : `https://tiktok.com/@${v}`;
        }
        default:
            return null;
    }
}
function buildWhatsAppContact(raw, message) {
    const base = buildSosmedUrl("whatsapp", raw);
    if (!base)
        return null;
    if (!message)
        return base;
    const text = encodeURIComponent(message);
    return base.includes("?") ? `${base}&text=${text}` : `${base}?text=${text}`;
}
function useCopy() {
    const [copied, setCopied] = useState(false);
    const copy = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
        catch { }
    }, []);
    return { copied, copy };
}
function LoadingSkeleton() {
    return (_jsxs("div", { className: "max-w-2xl mx-auto px-4 py-16 animate-pulse", children: [_jsx("div", { className: "h-40 rounded-2xl bg-gray-200 dark:bg-gray-800" }), _jsx("div", { className: "h-4 w-40 mt-4 rounded bg-gray-200 dark:bg-gray-800" }), _jsx("div", { className: "h-4 w-72 mt-2 rounded bg-gray-200 dark:bg-gray-800" }), _jsx("div", { className: "h-10 mt-6 rounded-xl bg-gray-200 dark:bg-gray-800" }), _jsx("div", { className: "h-8 mt-3 rounded-xl bg-gray-200 dark:bg-gray-800" }), _jsx("div", { className: "h-32 mt-8 rounded-2xl bg-gray-200 dark:bg-gray-800" })] }));
}
/* =========================
   Component
========================= */
export default function PublicLinktree() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { isDesktop } = useResponsive();
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareMenuRef = useRef(null);
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [searchParams] = useSearchParams();
    const cacheKey = searchParams.get("k") || "default";
    const sliderRef = useRef(null);
    const { data: user, isLoading: loadingUser } = useCurrentUser();
    const [showSocialModal, setShowSocialModal] = useState(false);
    const { copied, copy } = useCopy();
    const scrollLeft = () => {
        sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
        setTimeout(updateArrowVisibility, 50);
    };
    const scrollRight = () => {
        sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
        setTimeout(updateArrowVisibility, 50);
    };
    const { data: masjidData, isLoading: loadingMasjid, error: masjidError, } = useQuery({
        queryKey: ["masjid", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/masjids/${slug}`);
            return res.data?.data;
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
    const { data: kajianList, isLoading: loadingKajian } = useQuery({
        queryKey: ["kajianListBySlug", slug, cacheKey],
        queryFn: async () => {
            const res = await axios.get(`/public/lecture-sessions-u/mendatang/${slug}`);
            return res.data?.data?.slice(0, 10) ?? [];
        },
        enabled: !!slug,
        staleTime: 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
    const handleShareClick = () => {
        if (!masjidData)
            return;
        if (navigator.share) {
            navigator
                .share({ title: masjidData.masjid_name, url: currentUrl })
                .catch(() => {
                setShowShareMenu((s) => !s);
            });
        }
        else {
            setShowShareMenu((s) => !s);
        }
    };
    const updateArrowVisibility = () => {
        const el = sliderRef.current;
        if (!el)
            return;
        const atStart = Math.floor(el.scrollLeft) <= 0;
        const atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
        setShowLeft(!atStart);
        setShowRight(!atEnd);
    };
    useEffect(() => {
        const el = sliderRef.current;
        if (!el)
            return;
        updateArrowVisibility();
        el.addEventListener("scroll", updateArrowVisibility);
        return () => el.removeEventListener("scroll", updateArrowVisibility);
    }, []);
    useEffect(() => {
        const timeout = setTimeout(updateArrowVisibility, 100);
        return () => clearTimeout(timeout);
    }, [kajianList]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (shareMenuRef.current &&
                !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        }
        if (showShareMenu)
            document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showShareMenu]);
    const waURL = useMemo(() => buildSosmedUrl("whatsapp", masjidData?.masjid_whatsapp_url), [masjidData?.masjid_whatsapp_url]);
    const igURL = useMemo(() => buildSosmedUrl("instagram", masjidData?.masjid_instagram_url), [masjidData?.masjid_instagram_url]);
    const ytURL = useMemo(() => buildSosmedUrl("youtube", masjidData?.masjid_youtube_url), [masjidData?.masjid_youtube_url]);
    const fbURL = useMemo(() => buildSosmedUrl("facebook", masjidData?.masjid_facebook_url), [masjidData?.masjid_facebook_url]);
    const ttURL = useMemo(() => buildSosmedUrl("tiktok", masjidData?.masjid_tiktok_url), [masjidData?.masjid_tiktok_url]);
    const donateURL = masjidData?.masjid_donation_link || undefined;
    const openMapsHref = useMemo(() => {
        const q = masjidData?.masjid_location?.trim();
        if (!q)
            return undefined;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
    }, [masjidData?.masjid_location]);
    if (loadingMasjid || loadingKajian || loadingUser)
        return _jsx(LoadingSkeleton, {});
    if (masjidError || !masjidData)
        return (_jsxs("div", { className: "max-w-2xl mx-auto px-4 pt-24 pb-20 text-center", children: [_jsx("p", { className: "text-lg font-medium", children: "Masjid tidak ditemukan." }), _jsxs("button", { onClick: () => navigate(-1), className: "mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(ChevronLeft, { size: 16 }), " Kembali"] })] }));
    return (_jsxs(_Fragment, { children: [_jsx(PublicNavbar, { masjidName: masjidData.masjid_name }), _jsx("div", { className: "w-full max-w-2xl mx-auto min-h-screen pb-28 overflow-auto bg-no-repeat bg-center pt-16", children: _jsxs("div", { className: "px-4", children: [_jsxs("div", { className: "relative rounded-2xl overflow-hidden border", style: { borderColor: theme.silver1 }, children: [_jsx("div", { className: "h-40 sm:h-52 w-full bg-gray-100 dark:bg-gray-800", children: _jsx(ShimmerImage, { src: masjidData.masjid_image_url || "/images/cover-masjid.jpg", alt: masjidData.masjid_name, className: "w-full h-full object-cover" }) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" }), _jsxs("button", { onClick: handleShareClick, "aria-label": "Bagikan", className: "absolute top-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/70 backdrop-blur text-sm shadow hover:bg-white", children: [_jsx(ShareIcon, { size: 16 }), " Bagikan sekarang"] }), showShareMenu && (_jsxs("div", { ref: shareMenuRef, className: "absolute top-12 right-3 z-20 w-64 rounded-xl border bg-white dark:bg-gray-900 shadow-md p-2", children: [_jsxs("button", { onClick: () => copy(currentUrl), className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(Copy, { size: 16 }), " ", copied ? "Tersalin!" : "Salin tautan"] }), igURL && (_jsxs("a", { href: igURL, target: "_blank", rel: "noreferrer", className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(LinkIcon, { size: 16 }), " Buka Instagram"] })), fbURL && (_jsxs("a", { href: fbURL, target: "_blank", rel: "noreferrer", className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(LinkIcon, { size: 16 }), " Buka Facebook"] })), ttURL && (_jsxs("a", { href: ttURL, target: "_blank", rel: "noreferrer", className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(LinkIcon, { size: 16 }), " Buka TikTok"] }))] })), _jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4", children: _jsxs("div", { className: "flex items-end gap-3", children: [_jsx("div", { className: "w-16 h-16 rounded-xl overflow-hidden border bg-white/40 backdrop-blur", children: _jsx(ShimmerImage, { src: masjidData.masjid_image_url || "/images/masjid-avatar.png", alt: masjidData.masjid_name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h1", { className: "text-white font-bold text-xl leading-tight line-clamp-2", children: masjidData.masjid_name }), masjidData.masjid_bio_short && (_jsx("p", { className: "text-white/90 text-sm line-clamp-1", children: masjidData.masjid_bio_short }))] })] }) })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3", children: [openMapsHref && (_jsxs("a", { href: openMapsHref, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(MapPin, { size: 16 }), " Peta"] })), waURL && (_jsxs("a", { href: buildWhatsAppContact(masjidData.masjid_whatsapp_url, `Assalamualaikum, saya ingin bertanya tentang kegiatan di ${masjidData.masjid_name}.`) || waURL, target: "_blank", rel: "noreferrer", className: "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(Phone, { size: 16 }), " WhatsApp"] })), _jsxs("button", { onClick: handleShareClick, className: "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(Share2, { size: 16 }), " Bagikan"] }), donateURL && (_jsxs("a", { href: donateURL, target: "_blank", rel: "noreferrer", className: "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800", children: [_jsx(HeartHandshake, { size: 16 }), " Donasi"] }))] }), (waURL || igURL || ytURL || fbURL || ttURL) && (_jsxs("div", { className: "flex items-center gap-3 mt-4", children: [waURL && (_jsx("a", { href: waURL, target: "_blank", rel: "noreferrer", className: "p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800", children: _jsx("img", { src: "/icons/whatsapp.svg", alt: "WhatsApp", className: "w-5 h-5" }) })), igURL && (_jsx("a", { href: igURL, target: "_blank", rel: "noreferrer", className: "p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800", children: _jsx("img", { src: "/icons/instagram.svg", alt: "Instagram", className: "w-5 h-5" }) })), ytURL && (_jsx("a", { href: ytURL, target: "_blank", rel: "noreferrer", className: "p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800", children: _jsx("img", { src: "/icons/youtube.svg", alt: "YouTube", className: "w-5 h-5" }) })), fbURL && (_jsx("a", { href: fbURL, target: "_blank", rel: "noreferrer", className: "p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800", children: _jsx("img", { src: "/icons/facebook.svg", alt: "Facebook", className: "w-5 h-5" }) })), ttURL && (_jsx("a", { href: ttURL, target: "_blank", rel: "noreferrer", className: "p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800", children: _jsx("img", { src: "/icons/tiktok.svg", alt: "TikTok", className: "w-5 h-5" }) }))] })), _jsx(BorderLine, {}), _jsxs("div", { className: "relative", children: [_jsx("h2", { className: "text-lg font-semibold mb-3 mt-2", style: { color: theme.black1 }, children: "Kajian Mendatang" }), (!kajianList || kajianList.length === 0) && (_jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children: "Belum ada jadwal kajian." })), kajianList && kajianList.length > 0 && (_jsxs("div", { className: "relative", children: [showLeft && (_jsx("button", { onClick: scrollLeft, className: "absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800/80 hover:bg-white/95 p-1.5 rounded-full shadow", "aria-label": "Scroll kiri", children: _jsx(ChevronLeft, { size: 18 }) })), showRight && (_jsx("button", { onClick: scrollRight, className: "absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800/80 hover:bg-white/95 p-1.5 rounded-full shadow", "aria-label": "Scroll kanan", children: _jsx(ChevronRight, { size: 18 }) })), _jsx("div", { className: "overflow-hidden", children: _jsx("div", { ref: sliderRef, className: "flex overflow-x-auto no-scrollbar gap-3 pr-3 snap-x scroll-smooth", children: kajianList.map((kajian) => (_jsxs("div", { onClick: () => navigate(`/masjid/${slug}/jadwal-kajian/${kajian.lecture_session_id}`), className: "flex-shrink-0 snap-start w-[200px] sm:w-[220px] md:w-[240px] rounded-xl overflow-hidden border cursor-pointer hover:opacity-90 transition", style: {
                                                        backgroundColor: theme.white1,
                                                        borderColor: theme.silver1,
                                                    }, children: [_jsx(ShimmerImage, { src: kajian.lecture_session_image_url || "", alt: kajian.lecture_session_title, className: "w-full aspect-[4/5] object-cover" }), _jsxs("div", { className: "p-2.5", children: [_jsx("h3", { className: "font-semibold text-sm line-clamp-2", style: { color: theme.black1 }, title: kajian.lecture_session_title, children: kajian.lecture_session_title }), _jsx("p", { className: "text-xs mt-1 line-clamp-1", style: { color: theme.black2 }, title: kajian.lecture_session_teacher_name, children: kajian.lecture_session_teacher_name || "-" }), _jsx("p", { className: "text-xs line-clamp-1", style: { color: theme.black2 }, children: kajian.lecture_session_start_time ? (_jsx(FormattedDate, { value: kajian.lecture_session_start_time })) : ("-") })] })] }, kajian.lecture_session_id))) }) }), _jsx("div", { className: "mt-3 text-right", children: _jsx("span", { className: "text-sm underline cursor-pointer hover:opacity-80 transition", style: { color: theme.black2 }, onClick: () => navigate(`/masjid/${slug}/jadwal-kajian`), children: "Lihat semua kajian" }) })] }))] }), _jsx(BorderLine, {}), _jsx(SholatScheduleCard, { location: "DKI Jakarta", slug: slug || "" }), _jsx(BorderLine, {}), _jsxs("div", { className: "mb-4 mt-4", children: [_jsx("h2", { className: "text-lg font-semibold", style: { color: theme.black1 }, children: "Tentang Masjid" }), _jsx("p", { className: "text-sm mt-1", style: { color: theme.black2 }, children: "Dikelola oleh DKM Masjid untuk ummat muslim" }), masjidData.masjid_location && (_jsxs("a", { href: openMapsHref, target: "_blank", rel: "noopener noreferrer", className: "text-base inline-flex flex-col gap-0.5 pb-2 pt-2", style: { color: theme.black2 }, children: [_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(MapPin, { size: 16 }), _jsx("span", { children: masjidData.masjid_location }), _jsx(ExternalLink, { size: 14, className: "opacity-70" })] }), _jsx("span", { className: "underline text-sm mt-0.5", children: "Lihat di Google Maps" })] }))] }), _jsx(BorderLine, {}), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-2", style: { color: theme.black1 }, children: "Menu Utama" }), _jsxs("div", { className: "space-y-2 pt-2", children: [_jsx(CartLink, { label: "Profil Masjid", icon: _jsx(MapPin, { size: 18 }), href: `/masjid/${masjidData.masjid_slug}/profil` }), _jsx(CartLink, { label: "Jadwal Kajian", icon: _jsx(BookOpen, { size: 18 }), href: `/masjid/${masjidData.masjid_slug}/jadwal-kajian` }), _jsx(CartLink, { label: "Grup Masjid & Sosial Media", icon: _jsx(Share2, { size: 18 }), onClick: () => setShowSocialModal(true) }), _jsx(CartLink, { label: "Hubungi Kami", icon: _jsx(Phone, { size: 18 }), href: buildWhatsAppContact(masjidData.masjid_whatsapp_url, `Assalamualaikum, saya ingin bertanya tentang kegiatan di ${masjidData.masjid_name}.`) || `/masjid/${masjidData.masjid_slug}/profil`, internal: false }), donateURL && (_jsx(CartLink, { label: "Donasi", icon: _jsx(HeartHandshake, { size: 18 }), href: donateURL, internal: false }))] })] }), _jsx(SocialMediaModal, { show: showSocialModal, onClose: () => setShowSocialModal(false), data: {
                                masjid_instagram_url: masjidData.masjid_instagram_url,
                                masjid_whatsapp_url: masjidData.masjid_whatsapp_url,
                                masjid_youtube_url: masjidData.masjid_youtube_url,
                                masjid_facebook_url: masjidData.masjid_facebook_url,
                                masjid_tiktok_url: masjidData.masjid_tiktok_url,
                                masjid_whatsapp_group_ikhwan_url: masjidData.masjid_whatsapp_group_ikhwan_url,
                                masjid_whatsapp_group_akhwat_url: masjidData.masjid_whatsapp_group_akhwat_url,
                            } }), _jsx(BottomNavbar, {})] }) })] }));
}
