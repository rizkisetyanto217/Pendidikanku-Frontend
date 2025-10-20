import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import CartLink from "@/components/common/main/CardLink";
import ShimmerImage from "@/components/common/main/ShimmerImage";
import { MapPin, BookOpen, CreditCard, FileText, Phone, Share2, X, Copy, MessageCircle, ExternalLink, ChevronRight, } from "lucide-react";
import MasjidkuHomePrayerCard from "@/components/pages/home/MasjidkuHomePrayerCard";
import LinktreeNavbar from "@/components/common/public/LintreeNavbar";
/* =========================================================
   Helpers
========================================================= */
const isMobileUA = () => /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
async function robustCopy(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    }
    catch { }
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-999999px";
        ta.style.top = "-999999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok)
            return true;
    }
    catch { }
    try {
        const result = window.prompt("Salin teks berikut:", text);
        return result !== null;
    }
    catch {
        return false;
    }
}
function openWhatsAppNumber(phoneDigits, message) {
    const digits = phoneDigits.replace(/[^\d]/g, "");
    const txt = message ? `&text=${encodeURIComponent(message)}` : "";
    if (isMobileUA()) {
        // native app (fallback ke web jika gagal)
        const deep = `whatsapp://send?phone=${digits}${txt}`;
        try {
            window.location.href = deep;
        }
        catch {
            window.open(`https://web.whatsapp.com/send?phone=${digits}${txt}`, "_blank");
        }
    }
    else {
        window.open(`https://web.whatsapp.com/send?phone=${digits}${txt}`, "_blank", "noopener,noreferrer");
    }
}
async function shareViaNative(title, text, url) {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
            return true;
        }
        catch {
            return false;
        }
    }
    return false;
}
/* =========================================================
   Component
========================================================= */
export default function MasjidkuHome() {
    const { slug } = useParams();
    const [openShare, setOpenShare] = useState(false);
    const [copiedText, setCopiedText] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    // Demo data — gantikan dari API jika sudah tersedia
    const masjidku = {
        masjidku_name: "MasjidKu",
        masjidku_description: "Lembaga untuk Digitalisasi Masjid dan Lembaga Islam Indonesia",
        masjidku_image_url: "/image/Gambar-Masjid.jpeg",
        masjidku_instagram_url: "https://instagram.com/masjidbaitussalam",
        masjidku_whatsapp_url: "https://wa.me/6281234567890",
        masjidku_youtube_url: "https://youtube.com/@masjidbaitussalam",
        // Optional
        masjidku_donation_url: "",
    };
    const shareUrl = useMemo(() => (typeof window !== "undefined" ? window.location.href : ""), []);
    const shareTitle = masjidku.masjidku_name;
    const shareText = useMemo(() => `${masjidku.masjidku_name} — ${masjidku.masjidku_description}`, [masjidku.masjidku_name, masjidku.masjidku_description]);
    // ====== Share handlers ======
    const onShareClick = async () => {
        const ok = await shareViaNative(shareTitle, shareText, shareUrl);
        if (!ok)
            setOpenShare(true);
    };
    const onShareCopyText = async () => {
        const ok = await robustCopy(`${shareText}\n${shareUrl}`);
        if (ok) {
            setCopiedText(true);
            setTimeout(() => setCopiedText(false), 1800);
        }
    };
    const onShareCopyLink = async () => {
        const ok = await robustCopy(shareUrl);
        if (ok) {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 1800);
        }
    };
    const onShareViaWA = () => {
        const text = `${shareText}\n${shareUrl}`;
        if (isMobileUA()) {
            try {
                window.location.href = `whatsapp://send?text=${encodeURIComponent(text)}`;
            }
            catch {
                window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
            }
        }
        else {
            window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
        }
    };
    // UX: lock scroll & ESC close ketika modal share terbuka
    useEffect(() => {
        if (!openShare)
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && setOpenShare(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [openShare]);
    return (_jsxs(_Fragment, { children: [_jsx(LinktreeNavbar
            // title={masjidku.masjidku_name}
            // subtitle={masjidku.masjidku_description}
            // coverOverlap
            // showBack
            // onShare={() => setOpenShare(true)} // kalau mau pakai modal share kamu sendiri
            , {}), _jsxs("section", { className: "relative w-full mt-24", children: [_jsx("div", { className: "h-44 sm:h-56 w-full overflow-hidden", children: _jsx("div", { className: "h-full w-full bg-center bg-cover", style: { backgroundImage: `url(${masjidku.masjidku_image_url})` } }) }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent" }), _jsx("div", { className: "max-w-2xl mx-auto px-4", children: _jsxs("div", { className: "-mt-10 sm:-mt-14 flex items-end gap-3", children: [_jsx("div", { className: "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shadow-md", style: {
                                        borderColor: isDark ? theme.black1 : theme.white1, // terang di dark-mode, putih di light
                                        backgroundColor: isDark ? theme.white3 : theme.white1, // fallback bg kalau gambar belum load
                                    }, children: _jsx(ShimmerImage, { src: masjidku.masjidku_image_url, alt: "Logo / Foto Masjid", className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "pb-1", children: [_jsx("h1", { className: "text-xl sm:text-2xl font-semibold drop-shadow", style: {
                                                // teks terang di atas cover: gunakan warna terang di kedua mode
                                                color: isDark ? theme.black1 : theme.black1,
                                            }, children: masjidku.masjidku_name }), _jsx("p", { className: "text-xs sm:text-sm line-clamp-2 drop-shadow", style: {
                                                // sedikit lebih redup dari title
                                                color: isDark ? theme.black2 : theme.black1,
                                                opacity: 0.9,
                                            }, children: masjidku.masjidku_description })] })] }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 mt-4", children: _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [_jsxs("button", { onClick: () => openWhatsAppNumber("6281234567890", `Assalamualaikum, saya ingin bertanya tentang kegiatan di ${masjidku.masjidku_name}.`), className: "flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium shadow-sm hover:shadow transition ring-1", style: {
                                        backgroundColor: theme.success1,
                                        color: theme.white1,
                                        borderColor: theme.success1,
                                    }, children: [_jsx("img", { src: "/icons/whatsapp.svg", alt: "WA", className: "w-4 h-4" }), "WhatsApp"] }), _jsxs("button", { onClick: onShareClick, className: "flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium shadow-sm hover:shadow transition ring-1", style: {
                                        backgroundColor: theme.primary,
                                        color: theme.white1,
                                        borderColor: theme.primary,
                                    }, children: [_jsx(Share2, { size: 16 }), " Bagikan"] }), _jsxs("a", { href: "/masjid", className: "flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium shadow-sm hover:shadow transition ring-1", style: {
                                        backgroundColor: theme.white1,
                                        color: theme.black1,
                                        borderColor: theme.white3,
                                    }, children: [_jsx(ExternalLink, { size: 16 }), " Eksplor Masjid"] }), _jsxs("a", { href: masjidku.masjidku_instagram_url, target: "_blank", rel: "noreferrer", className: "flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium shadow-sm hover:shadow transition ring-1", style: {
                                        backgroundColor: theme.white1,
                                        color: theme.black1,
                                        borderColor: theme.white3,
                                    }, children: [_jsx("img", { src: "/icons/instagram.svg", alt: "IG", className: "w-4 h-4" }), " IG"] })] }) })] }), _jsxs("main", { className: "w-full max-w-2xl mx-auto pb-28 px-4", children: [_jsx("div", { className: "pt-6" }), _jsx(MasjidkuHomePrayerCard, { location: "DKI Jakarta", slug: slug || "" }), _jsxs("section", { className: "mt-6", children: [_jsx("h2", { className: "text-lg font-semibold mb-3", style: { color: theme.black1 }, children: "Menu Utama" }), _jsxs("div", { className: "space-y-2", children: [_jsx(CartLink, { label: "Profil Kami", icon: _jsx(MapPin, { size: 18 }), href: "/profil" }), _jsx(CartLink, { label: "Website", icon: _jsx(MapPin, { size: 18 }), href: "/website" }), _jsx(CartLink, { label: "Masjid yang telah bekerjasama", icon: _jsx(BookOpen, { size: 18 }), href: "/masjid" }), _jsx(CartLink, { label: "Ikut Program Digitalisasi 100 Masjid", icon: _jsx(CreditCard, { size: 18 }), href: "/program" }), _jsx(CartLink, { label: "Laporan Keuangan", icon: _jsx(FileText, { size: 18 }), href: "/finansial" }), _jsx(CartLink, { label: "Kontak Kami", icon: _jsx(Phone, { size: 18 }), onClick: () => openWhatsAppNumber("6281234567890") })] })] }), masjidku.masjidku_donation_url && (_jsx("section", { className: "mt-6", children: _jsxs("a", { href: masjidku.masjidku_donation_url, target: "_blank", rel: "noreferrer", className: "w-full inline-flex items-center justify-between gap-3 rounded-xl px-4 py-3 ring-1 transition hover:shadow", style: {
                                backgroundColor: theme.white1,
                                borderColor: theme.white3,
                                color: theme.black1,
                            }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(CreditCard, { size: 18 }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: "Dukung Program" }), _jsx("div", { className: "text-sm opacity-80", children: "Klik untuk berdonasi" })] })] }), _jsx(ChevronRight, { size: 18 })] }) }))] }), openShare && (_jsxs("div", { className: "fixed inset-0 z-[1000] flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0", style: {
                            backgroundColor: "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(2px)",
                        }, onClick: () => setOpenShare(false) }), _jsxs("div", { role: "dialog", "aria-modal": "true", className: "relative w-[92%] max-w-md rounded-xl p-4 ring-1 shadow-lg space-y-3", style: {
                            backgroundColor: theme.white1,
                            borderColor: theme.white3,
                            color: theme.black1,
                        }, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-base font-semibold", style: { color: theme.primary }, children: "Bagikan Halaman Ini" }), _jsx("button", { onClick: () => setOpenShare(false), className: "p-1 rounded hover:opacity-80", "aria-label": "Tutup modal", style: { color: theme.black1 }, children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "rounded-md p-3 text-sm ring-1 max-h-60 overflow-auto whitespace-pre-wrap", style: {
                                    backgroundColor: theme.white2,
                                    borderColor: theme.white3,
                                    color: theme.black1,
                                }, children: [shareText, "\\n", shareUrl] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("button", { onClick: onShareCopyText, className: "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium hover:opacity-90 transition", style: { backgroundColor: theme.primary, color: theme.white1 }, children: [_jsx(Copy, { size: 16 }), _jsx("span", { children: copiedText ? "Teks Tersalin!" : "Salin Teks" })] }), _jsxs("button", { onClick: onShareCopyLink, className: "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium ring-1 hover:opacity-90 transition", style: {
                                            backgroundColor: theme.white2,
                                            color: theme.black1,
                                            borderColor: theme.white3,
                                        }, children: [_jsx(Copy, { size: 16 }), _jsx("span", { children: copiedLink ? "Link Tersalin!" : "Salin Link" })] }), _jsxs("button", { onClick: onShareViaWA, className: "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium hover:opacity-90 transition", style: {
                                            backgroundColor: theme.secondary,
                                            color: theme.white1,
                                        }, children: [_jsx(MessageCircle, { size: 16 }), _jsx("span", { children: "Bagikan via WhatsApp" })] })] })] })] }))] }));
}
