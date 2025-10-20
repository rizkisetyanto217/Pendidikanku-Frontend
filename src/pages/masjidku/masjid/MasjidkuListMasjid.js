import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { MapPin, CheckCircle2, Instagram, Youtube, Music2, ExternalLink, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
const isValid = (v) => {
    if (!v)
        return false;
    const s = v.trim().toLowerCase();
    if (!s || s === "update" || s === "fb")
        return false;
    return (s.startsWith("http") || s.startsWith("wa.me") || s.startsWith("maps.app"));
};
const fmtDate = (iso) => {
    if (!iso)
        return "";
    try {
        return new Date(iso).toLocaleDateString("id-ID", { dateStyle: "medium" });
    }
    catch {
        return "";
    }
};
/** helper ikon dari public/icons */
const SvgIcon = ({ name, size = 16, alt }) => (_jsx("img", { src: `/icons/${name}.svg`, alt: alt || name, width: size, height: size, loading: "lazy", style: { display: "inline-block" } }));
export default function MasjidkuListMasjid() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const navigate = useNavigate();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["public-masjids"],
        queryFn: async () => (await axios.get("/public/masjids")).data,
        staleTime: 5 * 60 * 1000,
    });
    const list = data?.data ?? [];
    const openExternal = (url) => window.open(url, "_blank", "noopener,noreferrer");
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Masjid yang Sudah Terdaftar", onBackClick: () => navigate(`/`), withPaddingTop: true }), _jsxs("div", { className: "pb-24 max-w-2xl mx-auto", children: [isLoading && (_jsx("div", { className: "text-sm", style: { color: theme.silver2 }, children: "Memuat daftar masjid\u2026" })), isError && (_jsx("div", { className: "text-sm", style: { color: theme.error1 }, children: "Gagal memuat data. Coba lagi." })), !isLoading && !list.length && (_jsx("div", { className: "text-sm", style: { color: theme.silver2 }, children: "Belum ada data masjid." })), _jsx("div", { className: "space-y-3", children: list.map((m) => {
                            const socials = [
                                {
                                    icon: _jsx(SvgIcon, { name: "facebook", alt: "Facebook" }),
                                    url: m.masjid_facebook_url,
                                    label: "Facebook",
                                },
                                {
                                    icon: _jsx(Instagram, { size: 16 }),
                                    url: m.masjid_instagram_url,
                                    label: "Instagram",
                                },
                                {
                                    icon: _jsx(Youtube, { size: 16 }),
                                    url: m.masjid_youtube_url,
                                    label: "Youtube",
                                },
                                {
                                    icon: _jsx(SvgIcon, { name: "whatsapp", alt: "WhatsApp" }),
                                    url: m.masjid_whatsapp_url,
                                    label: "WhatsApp",
                                },
                                {
                                    icon: _jsx(Music2, { size: 16 }),
                                    url: m.masjid_tiktok_url,
                                    label: "Tiktok",
                                },
                            ].filter((s) => isValid(s.url));
                            const website = m.masjid_domain && m.masjid_domain.startsWith("http")
                                ? m.masjid_domain
                                : m.masjid_domain
                                    ? `https://${m.masjid_domain}`
                                    : undefined;
                            const handleCardClick = () => {
                                if (website)
                                    openExternal(website);
                                else
                                    navigate(`/masjid/${m.masjid_slug}`);
                            };
                            const joined = fmtDate(m.masjid_created_at);
                            return (_jsxs("div", { role: "button", tabIndex: 0, onClick: handleCardClick, onKeyDown: (e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleCardClick();
                                    }
                                }, className: "rounded-xl border p-3 flex gap-3 cursor-pointer hover:opacity-95 transition", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.silver1,
                                    color: theme.black1,
                                }, children: [_jsx("div", { className: "w-20 h-20 rounded-lg overflow-hidden shrink-0", children: _jsx("img", { src: m.masjid_image_url || "", alt: m.masjid_name, className: "w-full h-full object-cover", onError: (e) => (e.currentTarget.src =
                                                "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==") }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-semibold truncate", style: { color: theme.black1 }, children: m.masjid_name }), _jsxs("div", { className: "mt-1 flex items-center gap-2 pt-2", children: [m.masjid_is_verified && (_jsxs("span", { className: "inline-flex items-center gap-1 text-base px-2 py-0.5 rounded-full", style: {
                                                            backgroundColor: theme.primary2,
                                                            color: theme.primary,
                                                        }, children: [_jsx(CheckCircle2, { size: 14 }), " Terverifikasi"] })), joined && (_jsxs("span", { className: "text-sm", style: { color: theme.silver2 }, children: ["Bergabung ", joined] }))] }), m.masjid_location && (_jsxs("div", { className: "flex items-start gap-1.5 mt-2 text-base", children: [_jsx(MapPin, { size: 20, style: { color: theme.black2, marginTop: 2 } }), _jsx("span", { className: "line-clamp-2", style: { color: theme.black2 }, children: m.masjid_location })] })), _jsxs("div", { className: "flex items-center flex-wrap gap-2 mt-3", children: [isValid(m.masjid_google_maps_url) && (_jsxs("a", { href: m.masjid_google_maps_url, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: "inline-flex items-center gap-1.5 text-base px-2 py-1 rounded ring-1", style: {
                                                            color: theme.black2,
                                                            borderColor: theme.black2,
                                                        }, children: [_jsx(SvgIcon, { name: "gmaps", alt: "Google Maps" }), "Maps", _jsx(ExternalLink, { size: 12 })] })), socials.map((s) => (_jsxs("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", onClick: (e) => e.stopPropagation(), className: "inline-flex items-center gap-1.5 text-base px-2 py-1 rounded ring-1", style: {
                                                            color: theme.black2,
                                                            borderColor: theme.silver1,
                                                        }, children: [s.icon, s.label, _jsx(ExternalLink, { size: 12 })] }, s.label)))] }), _jsx("div", { className: "flex gap-2 mt-3", children: _jsx("button", { onClick: (e) => {
                                                        e.stopPropagation();
                                                        navigate(`/masjid/${m.masjid_slug}`);
                                                    }, className: "px-3 py-1.5 rounded-md text-base font-medium hover:opacity-90 transition", style: {
                                                        backgroundColor: theme.primary,
                                                        color: theme.white1,
                                                    }, children: "Kunjungi Profil" }) })] })] }, m.masjid_id));
                        }) })] })] }));
}
