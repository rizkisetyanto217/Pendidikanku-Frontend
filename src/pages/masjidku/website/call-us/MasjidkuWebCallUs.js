import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/ContactUs.tsx
import { useMemo } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Instagram, Youtube, Facebook, } from "lucide-react";
import WebsiteNavbar from "@/components/common/public/WebsiteNavbar";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import WebsiteFooter from "../components/MasjidkuWebFooter";
const FullBleed = ({ className = "", children, }) => (_jsx("div", { className: `relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`, children: children }));
const Section = ({ id, className = "", children }) => (_jsx("section", { id: id, className: `px-4 sm:px-6 lg:px-8 ${className}`, children: _jsx("div", { className: "w-full", children: children }) }));
export default function MasjidkuWebCallUs() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const primaryBtn = useMemo(() => ({
        backgroundColor: theme.primary,
        borderColor: theme.primary,
        color: theme.white1,
    }), [theme]);
    return (_jsx(FullBleed, { children: _jsxs("div", { className: "min-h-screen overflow-x-hidden w-screen", style: {
                background: isDark
                    ? `linear-gradient(180deg, ${theme.white1} 0%, ${theme.white2} 100%)`
                    : `linear-gradient(180deg, ${theme.white2} 0%, ${theme.white1} 100%)`,
                color: theme.black1,
            }, children: [_jsx(WebsiteNavbar, {}), _jsx("div", { style: { height: "5.5rem" } }), _jsxs("div", { className: "relative overflow-hidden", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1544717305-996b815c338c?q=80&w=2400&auto=format&fit=crop", alt: "Hero background", className: "absolute inset-0 h-full w-full object-cover", style: { opacity: 0.14 }, loading: "eager" }), _jsx(Section, { className: "relative py-14 sm:py-20 lg:py-24", children: _jsxs("div", { className: "text-center max-w-3xl mx-auto", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold", style: { color: theme.black1 }, children: "Hubungi Kami" }), _jsx("p", { className: "mt-3", style: { color: theme.silver2 }, children: "Tim SekolahIslamku siap membantu. Pilih kanal komunikasi yang paling nyaman untuk Anda." }), _jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [_jsxs("a", { href: "tel:+6281234567890", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: primaryBtn, children: [_jsx(Phone, { className: "h-4 w-4" }), " Telepon Sekarang"] }), _jsxs("a", { href: "mailto:sales@sekolahislamku.id", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                                    color: theme.black1,
                                                    borderColor: theme.white3,
                                                    backgroundColor: isDark ? theme.white2 : "transparent",
                                                }, children: [_jsx(Mail, { className: "h-4 w-4" }), " Kirim Email"] })] })] }) })] }), _jsx(Section, { className: "py-12 md:py-16", children: _jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-1 space-y-4", children: [[
                                        {
                                            icon: _jsx(Phone, { className: "h-5 w-5" }),
                                            title: "Telepon",
                                            value: "+62 812-3456-7890",
                                            href: "tel:+6281234567890",
                                        },
                                        {
                                            icon: _jsx(Mail, { className: "h-5 w-5" }),
                                            title: "Email",
                                            value: "sales@sekolahislamku.id",
                                            href: "mailto:sales@sekolahislamku.id",
                                        },
                                        {
                                            icon: _jsx(MapPin, { className: "h-5 w-5" }),
                                            title: "Alamat",
                                            value: "Jl. Pendidikan No. 123, Indonesia",
                                        },
                                        {
                                            icon: _jsx(Clock, { className: "h-5 w-5" }),
                                            title: "Jam Operasional",
                                            value: "Senin–Jumat 09.00–17.00 WIB",
                                        },
                                    ].map((c, idx) => (_jsx("a", { href: c.href, className: "block rounded-2xl p-4 border hover:shadow-sm transition", style: {
                                            backgroundColor: theme.white1,
                                            borderColor: theme.white3,
                                        }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "mt-0.5", children: c.icon }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", style: { color: theme.black1 }, children: c.title }), _jsx("div", { className: "text-sm", style: { color: theme.silver2 }, children: c.value })] })] }) }, idx))), _jsxs("div", { className: "rounded-2xl p-4 border", style: {
                                            backgroundColor: theme.white1,
                                            borderColor: theme.white3,
                                        }, children: [_jsx("div", { className: "font-semibold mb-3", style: { color: theme.black1 }, children: "Ikuti Kami" }), _jsxs("div", { className: "flex items-center gap-3", style: { color: theme.silver2 }, children: [_jsx("a", { href: "#", "aria-label": "Instagram", className: "p-2 rounded-xl ring-1 transition hover:opacity-80", style: { borderColor: theme.white3 }, children: _jsx(Instagram, { className: "h-4 w-4" }) }), _jsx("a", { href: "#", "aria-label": "YouTube", className: "p-2 rounded-xl ring-1 transition hover:opacity-80", style: { borderColor: theme.white3 }, children: _jsx(Youtube, { className: "h-4 w-4" }) }), _jsx("a", { href: "#", "aria-label": "Facebook", className: "p-2 rounded-xl ring-1 transition hover:opacity-80", style: { borderColor: theme.white3 }, children: _jsx(Facebook, { className: "h-4 w-4" }) })] })] })] }), _jsxs("div", { className: "lg:col-span-2 space-y-8", children: [_jsxs("form", { onSubmit: (e) => e.preventDefault(), className: "rounded-3xl border p-6 md:p-8", style: {
                                            backgroundColor: theme.white1,
                                            borderColor: theme.white3,
                                        }, children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(MessageSquare, { className: "h-5 w-5" }), _jsx("div", { className: "font-semibold", style: { color: theme.black1 }, children: "Kirim Pesan" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Nama Lengkap" }), _jsx("input", { type: "text", required: true, className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                    backgroundColor: theme.white1,
                                                                    borderColor: theme.white3,
                                                                    color: theme.black1,
                                                                } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Email" }), _jsx("input", { type: "email", required: true, className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                    backgroundColor: theme.white1,
                                                                    borderColor: theme.white3,
                                                                    color: theme.black1,
                                                                } })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Subjek" }), _jsx("input", { type: "text", required: true, className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                    backgroundColor: theme.white1,
                                                                    borderColor: theme.white3,
                                                                    color: theme.black1,
                                                                } })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Pesan" }), _jsx("textarea", { required: true, rows: 5, className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                    backgroundColor: theme.white1,
                                                                    borderColor: theme.white3,
                                                                    color: theme.black1,
                                                                } })] })] }), _jsxs("div", { className: "mt-5 flex items-center gap-3", children: [_jsxs("button", { className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: primaryBtn, children: [_jsx(Send, { className: "h-4 w-4" }), " Kirim Pesan"] }), _jsx("a", { href: "https://wa.me/6281234567890", target: "_blank", rel: "noreferrer", className: "text-sm underline", style: { color: theme.black1 }, children: "atau chat via WhatsApp" })] })] }), _jsxs("div", { className: "rounded-3xl border overflow-hidden", style: {
                                            borderColor: theme.white3,
                                            backgroundColor: theme.white1,
                                        }, children: [_jsx("img", { src: "https://images.unsplash.com/photo-1496568816309-51d7c20e2b18?q=80&w=1600&auto=format&fit=crop", alt: "Lokasi kantor", className: "w-full h-72 object-cover", loading: "lazy" }), _jsx("div", { className: "p-4 text-sm", style: { color: theme.silver2 }, children: "*Silakan ganti gambar ini dengan embed peta lokasi sekolah/kantor Anda." })] })] })] }) }), _jsx(WebsiteFooter, {})] }) }));
}
