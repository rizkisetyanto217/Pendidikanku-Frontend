import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SekolahIslamkuAbout.tsx
import { useMemo } from "react";
import { ShieldCheck, Target, Rocket, Users, BookOpen, Calendar, Wallet, Mail, Phone, MapPin, ChevronRight, BarChart3, Heart, Handshake, Leaf, Globe2, } from "lucide-react";
import WebsiteNavbar from "@/components/common/public/WebsiteNavbar";
import WebsiteFooter from "../website/components/MasjidkuWebFooter"; // sesuaikan jika path kamu beda
import useHtmlThema from "@/hooks/useHTMLThema"; // ✅ gunakan file yang kamu kirim
import { pickTheme } from "@/constants/thema"; // ✅ gunakan colorsThema
/** ===== Helpers ===== */
const FullBleed = ({ className = "", children, }) => (_jsx("div", { className: `relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`, children: children }));
const Section = ({ id, className = "", children }) => (_jsx("section", { id: id, className: `px-4 sm:px-6 lg:px-8 ${className}`, children: _jsx("div", { className: "w-full", children: children }) }));
/** ===== Page ===== */
export default function SekolahIslamkuAbout() {
    const { isDark, themeName } = useHtmlThema();
    const theme = pickTheme(themeName, isDark);
    const bg = useMemo(() => isDark
        ? `linear-gradient(180deg, ${theme.white1} 0%, ${theme.white2} 100%)`
        : `linear-gradient(180deg, ${theme.white2} 0%, ${theme.white1} 100%)`, [isDark, theme]);
    const cardStyle = useMemo(() => ({
        backgroundColor: theme.white1,
        borderColor: theme.white3,
        color: theme.black1,
    }), [theme]);
    const muted = useMemo(() => ({ color: theme.silver2 }), [theme]);
    const primaryBtn = useMemo(() => ({
        backgroundColor: theme.primary,
        borderColor: theme.primary,
        color: "#FFFFFF",
    }), [theme]);
    const ghostBtn = useMemo(() => ({
        color: theme.black1,
        borderColor: theme.white3,
        backgroundColor: isDark ? theme.white2 : "transparent",
    }), [theme, isDark]);
    const kpis = [
        { label: "Sekolah Terbantu", value: "250+" },
        { label: "Guru & Staf", value: "8.5k+" },
        { label: "Siswa Tercatat", value: "150k+" },
        { label: "Integrasi Aktif", value: "50+" },
    ];
    const values = [
        {
            icon: ShieldCheck,
            title: "Amanah",
            desc: "Keamanan & privasi data jadi prioritas utama.",
        },
        {
            icon: BarChart3,
            title: "Transparan",
            desc: "Semua proses terukur & dapat diaudit.",
        },
        {
            icon: Heart,
            title: "Empati",
            desc: "Didesain bersama kebutuhan guru & orang tua.",
        },
        {
            icon: Leaf,
            title: "Sederhana",
            desc: "UI ringan, cepat dipelajari, hemat waktu.",
        },
        {
            icon: Handshake,
            title: "Kolaboratif",
            desc: "Berkolaborasi dengan sekolah & komunitas.",
        },
        {
            icon: Globe2,
            title: "Skalabel",
            desc: "Siap tumbuh mengikuti skala institusi Anda.",
        },
    ];
    const timeline = [
        {
            year: "2019",
            title: "Riset Kebutuhan",
            desc: "Memetakan pain point administrasi sekolah & madrasah.",
        },
        {
            year: "2021",
            title: "Pilot Project",
            desc: "Uji coba di beberapa sekolah untuk modul PPDB & Absensi.",
        },
        {
            year: "2023",
            title: "Suite Terintegrasi",
            desc: "Rilis dashboard terpadu: akademik, keuangan, komunikasi.",
        },
        {
            year: "2025",
            title: "Ekspansi & Integrasi",
            desc: "Payment gateway, WhatsApp gateway, & analitik KPI lanjutan.",
        },
    ];
    return (_jsx(FullBleed, { children: _jsxs("div", { className: "min-h-screen w-screen overflow-x-hidden", style: { background: bg, color: theme.black1 }, children: [_jsx(WebsiteNavbar, {}), _jsx("div", { style: { height: "5.5rem" } }), _jsxs("div", { className: "relative overflow-hidden", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=2400&auto=format&fit=crop", alt: "Tentang SekolahIslamku Suite", className: "absolute inset-0 h-full w-full object-cover", style: { opacity: isDark ? 0.28 : 0.22 } }), _jsx(Section, { className: "relative py-16 sm:py-20 lg:py-28", children: _jsxs("div", { className: "max-w-5xl", children: [_jsxs("span", { className: "inline-flex items-center gap-2 text-xs font-medium rounded-full border px-3 py-1", style: {
                                            backgroundColor: isDark ? theme.white2 : theme.white1,
                                            borderColor: theme.white3,
                                            color: theme.black1,
                                        }, children: [_jsx(Target, { className: "h-3.5 w-3.5" }), " Tentang Kami"] }), _jsx("h1", { className: "mt-4 text-4xl md:text-5xl font-bold leading-tight", style: { color: theme.black1 }, children: "Misi Kami: Menyederhanakan Administrasi, Memperkuat Pembelajaran" }), _jsx("p", { className: "mt-3 max-w-3xl", style: muted, children: "SekolahIslamku Suite membantu institusi pendidikan mengelola proses akademik, keuangan, dan komunikasi secara terintegrasi\u2014agar guru fokus pada yang paling penting: membimbing murid." }), _jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [_jsxs("a", { href: "/register", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: primaryBtn, children: [_jsx(ChevronRight, { className: "h-4 w-4" }), " Mulai Sekarang"] }), _jsx("a", { href: "/#demo", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition hover:opacity-90", style: ghostBtn, children: "Lihat Demo" })] })] }) })] }), _jsx(Section, { id: "visi-misi", className: "py-14 md:py-20", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "rounded-3xl border p-6 sm:p-8", style: cardStyle, children: [_jsx("div", { className: "h-11 w-11 rounded-2xl grid place-items-center", style: {
                                            backgroundColor: theme.primary2,
                                            color: theme.primary,
                                        }, children: _jsx(ShieldCheck, { className: "h-5 w-5" }) }), _jsx("h3", { className: "mt-4 text-2xl font-bold", children: "Misi" }), _jsx("p", { className: "mt-2", style: muted, children: "Menghadirkan platform yang aman, sederhana, dan terukur untuk meningkatkan efisiensi operasional sekolah serta memperkuat kolaborasi guru\u2013orang tua\u2013siswa." })] }), _jsxs("div", { className: "rounded-3xl border p-6 sm:p-8", style: cardStyle, children: [_jsx("div", { className: "h-11 w-11 rounded-2xl grid place-items-center", style: {
                                            backgroundColor: theme.primary2,
                                            color: theme.primary,
                                        }, children: _jsx(Rocket, { className: "h-5 w-5" }) }), _jsx("h3", { className: "mt-4 text-2xl font-bold", children: "Visi" }), _jsx("p", { className: "mt-2", style: muted, children: "Menjadi ekosistem digital pendidikan Islam yang terpercaya, transparan, dan berdampak luas bagi kemajuan pendidikan di Indonesia." })] })] }) }), _jsxs(Section, { id: "cerita", className: "py-14 md:py-20", children: [_jsxs("header", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", children: "Perjalanan Kami" }), _jsx("p", { className: "mt-2", style: muted, children: "Dari riset kebutuhan hingga menjadi suite terintegrasi yang digunakan banyak sekolah." })] }), _jsx("ol", { className: "relative border-s pl-6", style: { borderColor: theme.white3 }, children: timeline.map((t) => (_jsxs("li", { className: "mb-8 ms-4", children: [_jsx("div", { className: "absolute w-3 h-3 rounded-full -start-1.5", style: { backgroundColor: theme.primary } }), _jsx("time", { className: "text-xs uppercase tracking-wide", style: { color: theme.silver2 }, children: t.year }), _jsx("h3", { className: "text-lg font-semibold mt-1", children: t.title }), _jsx("p", { className: "text-sm mt-1", style: muted, children: t.desc })] }, t.year))) })] }), _jsxs(Section, { id: "nilai", className: "py-14 md:py-20", children: [_jsxs("header", { className: "mb-8 md:mb-10 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", children: "Nilai yang Kami Pegang" }), _jsx("p", { className: "mt-2", style: muted, children: "Prinsip kerja yang membimbing setiap keputusan & rilis fitur." })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8", children: values.map((v) => (_jsxs("div", { className: "rounded-3xl border p-5 sm:p-6 hover:shadow transition", style: cardStyle, children: [_jsx("div", { className: "h-10 w-10 rounded-2xl grid place-items-center", style: {
                                            backgroundColor: theme.primary2,
                                            color: theme.primary,
                                        }, children: _jsx(v.icon, { className: "h-5 w-5" }) }), _jsx("div", { className: "mt-3 font-semibold", children: v.title }), _jsx("p", { className: "text-sm mt-1", style: muted, children: v.desc })] }, v.title))) })] }), _jsxs(Section, { id: "yang-kami-lakukan", className: "py-14 md:py-20", children: [_jsxs("header", { className: "mb-8 md:mb-10 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", children: "Apa yang Kami Lakukan" }), _jsx("p", { className: "mt-2", style: muted, children: "Modul-modul inti yang memudahkan operasional sekolah Anda." })] }), _jsx("div", { className: "grid md:grid-cols-4 gap-6 xl:gap-8", children: [
                                { icon: Users, title: "PPDB Online" },
                                { icon: BookOpen, title: "Akademik & Rapor" },
                                { icon: Calendar, title: "Absensi & Jadwal" },
                                { icon: Wallet, title: "Keuangan & SPP" },
                            ].map((m) => (_jsxs("div", { className: "rounded-3xl border p-6 text-center", style: cardStyle, children: [_jsx("div", { className: "mx-auto h-12 w-12 rounded-2xl grid place-items-center", style: {
                                            backgroundColor: theme.primary2,
                                            color: theme.primary,
                                        }, children: _jsx(m.icon, { className: "h-6 w-6" }) }), _jsx("div", { className: "mt-3 font-semibold", children: m.title }), _jsx("p", { className: "text-sm mt-1", style: muted, children: "Terintegrasi dalam satu dashboard yang aman & ringan." })] }, m.title))) })] }), _jsx(Section, { id: "dampak", className: "py-14 md:py-20", children: _jsxs("div", { className: "rounded-3xl border p-6 sm:p-8", style: {
                            ...cardStyle,
                            backgroundImage: "radial-gradient(80% 100% at 50% 0%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 70%)",
                        }, children: [_jsx("h2", { className: "text-2xl md:text-3xl font-bold", children: "Angka & Dampak" }), _jsx("p", { className: "mt-2", style: muted, children: "Pertumbuhan ekosistem SekolahIslamku Suite di berbagai daerah." }), _jsx("div", { className: "mt-6 grid grid-cols-2 md:grid-cols-4 gap-4", children: kpis.map((k) => (_jsxs("div", { className: "rounded-2xl border p-4 text-center", style: {
                                        borderColor: theme.white3,
                                        backgroundColor: theme.white1,
                                    }, children: [_jsx("div", { className: "text-2xl md:text-3xl font-bold", style: { color: theme.primary }, children: k.value }), _jsx("div", { className: "text-xs mt-1", style: muted, children: k.label })] }, k.label))) })] }) }), _jsxs(Section, { id: "tim", className: "py-14 md:py-20", children: [_jsxs("header", { className: "mb-8 md:mb-10 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", children: "Tim Inti" }), _jsx("p", { className: "mt-2", style: muted, children: "Tim kecil, misi besar \u2014 berfokus pada dampak nyata bagi sekolah." })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8", children: [
                                { name: "Aulia Rahman", role: "Product & Research" },
                                { name: "Siti Kharisma", role: "Customer Success" },
                                { name: "Fathur Rizky", role: "Engineering" },
                                { name: "Nadia Putri", role: "Operations" },
                            ].map((m) => (_jsxs("figure", { className: "rounded-3xl overflow-hidden border text-center", style: cardStyle, children: [_jsx("img", { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop", alt: m.name, className: "h-44 w-full object-cover", loading: "lazy" }), _jsxs("figcaption", { className: "p-4", children: [_jsx("div", { className: "font-semibold", children: m.name }), _jsx("div", { className: "text-xs mt-0.5", style: muted, children: m.role })] })] }, m.name))) })] }), _jsxs("div", { className: "relative overflow-hidden", style: {
                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.quaternary} 100%)`,
                    }, children: [_jsx("img", { src: "https://images.unsplash.com/photo-1544717305-996b815c338c?q=80&w=2000&auto=format&fit=crop", alt: "CTA", className: "pointer-events-none absolute inset-0 h-full w-full object-cover", style: { opacity: 0.1 }, loading: "lazy" }), _jsx(Section, { className: "py-14 md:py-20", children: _jsxs("div", { className: "rounded-3xl border backdrop-blur-sm p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center", style: {
                                    borderColor: "rgba(255,255,255,0.2)",
                                    color: "#FFFFFF",
                                }, children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold", children: "Siap Bergerak Bersama?" }), _jsx("p", { className: "mt-2", style: { opacity: 0.9 }, children: "Jadwalkan demo atau hubungi tim kami untuk konsultasi kebutuhan sekolah Anda." }), _jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [_jsxs("a", { href: "/#demo", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow transition hover:opacity-90", style: {
                                                            backgroundColor: "#FFFFFF",
                                                            color: theme.primary,
                                                            borderColor: "#FFFFFF",
                                                        }, children: [_jsx(Calendar, { className: "h-4 w-4" }), " Booking Demo"] }), _jsxs("a", { href: "#kontak", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                                            backgroundColor: "transparent",
                                                            color: "#FFFFFF",
                                                            borderColor: "rgba(255,255,255,0.6)",
                                                        }, children: [_jsx(Phone, { className: "h-4 w-4" }), " Hubungi Kami"] })] })] }), _jsxs("ul", { className: "space-y-3 text-sm", children: [_jsxs("li", { className: "flex items-center gap-3", children: [_jsx(MapPin, { className: "h-5 w-5" }), " Jakarta \u2022 Bandung \u2022 Surabaya (remote-first)"] }), _jsxs("li", { className: "flex items-center gap-3", children: [_jsx(Mail, { className: "h-5 w-5" }), " sales@sekolahislamku.id"] }), _jsxs("li", { className: "flex items-center gap-3", children: [_jsx(Phone, { className: "h-5 w-5" }), " +62 812-3456-7890"] })] })] }) })] }), _jsx(WebsiteFooter, {})] }) }));
}
