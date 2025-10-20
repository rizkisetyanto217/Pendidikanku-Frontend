import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import { X } from "lucide-react";
/* --- fungsi biasa: aman untuk hooks order --- */
function toHref(conf, rawValue) {
    const v = conf.normalize ? conf.normalize(rawValue.trim()) : rawValue.trim();
    const isURL = /^https?:\/\//i.test(v);
    if (isURL)
        return v;
    if (conf.customHref)
        return conf.customHref(v);
    if (conf.prefix)
        return `${conf.prefix}${v}`;
    return `https://${v}`;
}
export default function SocialMediaModal({ show, onClose, data, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const modalRef = useRef(null);
    const items = [
        {
            key: "masjid_instagram_url",
            label: "Instagram",
            prefix: "https://instagram.com/",
            iconSrc: "/icons/instagram.svg",
            normalize: (v) => v.replace(/^@/, ""),
        },
        {
            key: "masjid_whatsapp_url",
            label: "WhatsApp",
            prefix: "https://wa.me/",
            iconSrc: "/icons/whatsapp.svg",
            normalize: (v) => v.replace(/[^\d]/g, "").replace(/^0/, "62"),
        },
        {
            key: "masjid_youtube_url",
            label: "YouTube",
            iconSrc: "/icons/youtube.svg",
        },
        {
            key: "masjid_facebook_url",
            label: "Facebook",
            prefix: "https://facebook.com/",
            iconSrc: "/icons/facebook.svg",
        },
        {
            key: "masjid_tiktok_url",
            label: "TikTok",
            prefix: "https://tiktok.com/@",
            iconSrc: "/icons/tiktok.svg",
            normalize: (v) => v.replace(/^@/, ""),
        },
        // ✅ Grup WhatsApp Ikhwan
        {
            key: "masjid_whatsapp_group_ikhwan_url",
            label: "Grup WhatsApp Ikhwan",
            iconSrc: "/icons/whatsapp.svg",
            customHref: (v) => /^https?:\/\//i.test(v) ? v : `https://chat.whatsapp.com/${v}`,
        },
        // ✅ Grup WhatsApp Akhwat
        {
            key: "masjid_whatsapp_group_akhwat_url",
            label: "Grup WhatsApp Akhwat",
            iconSrc: "/icons/whatsapp.svg",
            customHref: (v) => /^https?:\/\//i.test(v) ? v : `https://chat.whatsapp.com/${v}`,
        },
    ];
    // Tutup saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target))
                onClose();
        };
        if (show)
            document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [show, onClose]);
    // Tutup saat ESC
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        if (show)
            document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [show, onClose]);
    if (!show)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4", role: "dialog", "aria-modal": "true", "aria-label": "Sosial Media Masjid", children: _jsxs("div", { ref: modalRef, className: "w-full max-w-xl rounded-lg p-6 relative", style: {
                backgroundColor: theme.white1,
                color: theme.black1,
                border: `1px solid ${theme.silver1}`,
            }, children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 rounded p-1 hover:opacity-80 transition", "aria-label": "Tutup", title: "Tutup", style: { color: theme.silver2 }, children: _jsx(X, { size: 22 }) }), _jsx("h2", { className: "text-lg font-semibold mb-5", children: "Sosial Media Masjid" }), _jsx("div", { className: "space-y-3", children: items.map((item) => {
                        const raw = data[item.key];
                        if (!raw || !raw.trim())
                            return null;
                        const href = toHref(item, raw);
                        return (_jsxs("a", { href: href, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-3 px-5 py-3 rounded text-base font-medium transition-all", style: {
                                backgroundColor: theme.white2,
                                color: theme.black1,
                                border: `1px solid ${theme.silver1}`,
                            }, children: [_jsx("img", { src: item.iconSrc, alt: "", "aria-hidden": "true", className: "w-5 h-5" }), _jsx("span", { children: item.label })] }, item.key));
                    }) }), _jsx("div", { className: "flex justify-end mt-8", children: _jsx("button", { onClick: onClose, className: "text-base px-5 py-2 rounded hover:opacity-80 transition", style: { color: theme.silver2 }, children: "Tutup" }) })] }) }));
}
