import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SekolahIslamkuHome.tsx
import { useMemo } from "react";
import { BookOpen, Users, Award, Clock, Calendar, ChevronRight, CheckCircle2, Phone, Star, } from "lucide-react";
import sekolah1 from "@/assets/sekolah1.jpeg";
import sekolah3 from "@/assets/sekolah3.jpg";
import sekolah4 from "@/assets/sekolah4.webp";
import sekolah5 from "@/assets/sekolah5.png";
import keuangan from "@/assets/keuangan.jpg";
import WebsiteNavbar from "@/components/common/public/WebsiteNavbar";
import WebsiteFooter from "./components/MasjidkuWebFooter";
import useHtmlThema from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
import TestimonialSlider from "./components/MasjidkuTestimonialSlider";
import { Link } from "react-router-dom";
/** =================== Data =================== */
const modules = [
    {
        title: "Penerimaan Siswa Baru (PPDB)",
        desc: "Form online, seleksi, verifikasi berkas, pembayaran, hingga penetapan kelas otomatis.",
        icon: Users,
        img: sekolah4,
    },
    {
        title: "Akademik & Kurikulum",
        desc: "RPP, penjadwalan, penilaian, rapor digital, kelulusan—semuanya tersentral.",
        icon: BookOpen,
        img: sekolah5,
    },
    {
        title: "Absensi & Kehadiran",
        desc: "Scan QR/ID, izin/surat sakit, rekap kehadiran real-time untuk guru & siswa.",
        icon: Clock,
        img: sekolah3,
    },
];
const features = [
    {
        title: "Keuangan & SPP",
        img: keuangan,
    },
    {
        title: "Komunikasi & Notifikasi",
        img: sekolah4,
    },
    {
        title: "LMS & E-Learning",
        img: sekolah5,
    },
    {
        title: "Inventaris & Perpustakaan",
        img: sekolah3,
    },
];
const advantages = [
    {
        label: "Implementasi Cepat",
        points: [
            "Onboarding < 7 hari",
            "Template data siap pakai",
            "Tim support responsif",
        ],
    },
    {
        label: "Satu Dashboard",
        points: ["360° data sekolah", "KPI & analitik", "Ekspor ke Excel/PDF"],
    },
    {
        label: "Integrasi Fleksibel",
        points: [
            "WhatsApp/Email gateway",
            "Payment gateway",
            "Siapkan SSO sekolah",
        ],
    },
    {
        label: "Keamanan Data",
        points: ["Backup harian", "Kontrol akses role-based", "Jejak audit"],
    },
];
const testimonials = [
    {
        name: "Nurhandayani",
        role: "Kepala Sekolah SMP Nurul Fajar",
        quote: "Administrasi jauh lebih tertib. Orang tua bisa pantau nilai & SPP dari rumah, guru fokus mengajar.",
        img: sekolah4,
    },
    {
        name: "Fajar Nugraha",
        role: "Wakasek Kurikulum SMK Cendekia",
        quote: "Penjadwalan & rapor digital mempercepat pekerjaan hingga 60%. Laporan kepala sekolah real-time.",
        img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop",
    },
    {
        name: "Hj. Rahmawati",
        role: "Kepala Madrasah Aliyah",
        quote: "Absensi digital mempermudah monitoring kehadiran siswa, rekap otomatis tanpa manual.",
        img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
    },
    {
        name: "Budi Santoso",
        role: "Guru Matematika",
        quote: "Input nilai cepat, rapor online bisa diakses orang tua kapan pun.",
        img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop",
    },
    {
        name: "Siti Aminah",
        role: "Wali Murid",
        quote: "Saya mudah memantau kehadiran, nilai, dan tagihan SPP dari satu aplikasi.",
        img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=800&auto=format&fit=crop",
    },
    {
        name: "Hendri Pratama",
        role: "Kepala TU",
        quote: "Transaksi SPP transparan, rekonsiliasi tinggal ekspor laporan.",
        img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop",
    },
];
const kpis = [
    { label: "Sekolah Terbantu", value: "250+" },
    { label: "Guru & Staff", value: "8.5k+" },
    { label: "Siswa Tercatat", value: "150k+" },
    { label: "Integrasi Aktif", value: "50+" },
];
/** ========= Utilities ========= */
const FullBleed = ({ className = "", children }) => (_jsx("div", { className: `relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`, children: children }));
const Section = ({ id, className = "", children }) => (_jsx("section", { id: id, className: `px-4 sm:px-6 lg:px-8 ${className}`, children: _jsx("div", { className: "w-full", children: children }) }));
export default function SekolahIslamkuHome() {
    const { isDark, themeName } = useHtmlThema();
    const theme = pickTheme(themeName, isDark);
    const primaryBtnStyle = useMemo(() => ({
        backgroundColor: theme.primary,
        borderColor: theme.primary,
        color: "#FFFFFF",
    }), [theme]);
    const supportBtnStyle = useMemo(() => ({
        color: theme.quaternary,
        borderColor: theme.quaternary,
        backgroundColor: isDark ? theme.white2 : "transparent",
    }), [theme, isDark]);
    const pageBg = useMemo(() => isDark
        ? `linear-gradient(180deg, ${theme.white1} 0%, ${theme.white2} 100%)`
        : `linear-gradient(180deg, ${theme.white2} 0%, ${theme.white1} 100%)`, [isDark, theme]);
    return (_jsx(FullBleed, { children: _jsxs("div", { id: "home", className: "min-h-screen overflow-x-hidden w-screen", children: [_jsx(WebsiteNavbar, {}), _jsx("div", {}), _jsxs("div", { className: "relative overflow-hidden", children: [_jsx("img", { src: sekolah1, alt: "Hero background", className: "absolute inset-0 h-full w-full object-cover", style: { opacity: isDark ? 0.3 : 0.25, filter: "saturate(0.9)" }, loading: "eager" }), _jsx(Section, { className: "relative py-20 sm:py-20 lg:py-28", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-center", children: [_jsxs("div", { children: [_jsxs("span", { className: "inline-flex items-center gap-2 text-xs font-medium rounded-full border px-3 py-1", style: {
                                                    backgroundColor: isDark ? theme.white2 : theme.white1,
                                                    borderColor: theme.white3,
                                                    color: theme.black1,
                                                }, children: [_jsx(Star, { className: "h-3.5 w-3.5" }), " Solusi End-to-End untuk Administrasi Sekolah"] }), _jsxs("h1", { className: "mt-4 text-4xl md:text-5xl xl:text-6xl font-bold leading-tight", style: { color: theme.black1 }, children: ["Kelola Sekolah", " ", _jsx("span", { style: { color: theme.primary }, children: "Lebih Mudah" }), ", Cepat, & Transparan"] }), _jsx("p", { className: "mt-4 max-w-3xl", style: { color: theme.black2 }, children: "Dari PPDB, akademik, kehadiran, keuangan, hingga komunikasi orang tua\u2014semua terintegrasi dalam satu platform yang ringan dan aman." }), _jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-3", children: [_jsxs(Link, { to: "/website/daftar-sekarang", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: primaryBtnStyle, children: [_jsx(ChevronRight, { className: "h-4 w-4" }), "Daftar Sekarang Gratis"] }), _jsx(Link, { to: "dukungan", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition hover:opacity-90", style: supportBtnStyle, children: "\uD83E\uDD1D Dukung Kami" })] })] }), _jsx("div", { children: _jsxs("div", { className: "relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl ring-1", style: { borderColor: theme.white3 }, children: [_jsx("img", { src: sekolah4, alt: "Dashboard Sekolah", className: "h-full w-full object-cover", loading: "lazy" }), _jsxs("div", { className: "absolute bottom-3 left-3 right-3 rounded-2xl p-3 flex items-center gap-3", style: {
                                                        backdropFilter: "blur(6px)",
                                                        backgroundColor: `${theme.white2}cc`,
                                                        color: theme.black1,
                                                    }, children: [_jsx(Award, { className: "h-4 w-4" }), _jsx("p", { className: "text-xs", children: "Dashboard menyatukan akademik, keuangan, absensi, & komunikasi dalam satu layar." })] })] }) })] }) })] }), _jsxs(Section, { id: "program", className: "py-16 md:py-20", children: [_jsxs("header", { className: "mb-8 md:mb-12 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black2 }, children: "Modul Inti Platform" }), _jsx("p", { className: "mt-3", style: { color: theme.black2 }, children: "Tersedia lengkap\u2014siap digunakan dari hari pertama implementasi." })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-6 xl:gap-8", children: modules.map((m) => (_jsxs("article", { className: "group rounded-3xl overflow-hidden border shadow-sm hover:shadow-md transition", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.white3,
                                }, children: [_jsxs("div", { className: "relative aspect-video overflow-hidden", children: [_jsx("img", { src: m.img, alt: m.title, className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105", loading: "lazy" }), _jsxs("div", { className: "absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs", style: {
                                                    backgroundColor: `${theme.white2}dd`,
                                                    color: theme.black1,
                                                }, children: [_jsx(m.icon, { className: "h-4 w-4" }), " ", m.title] })] }), _jsx("div", { className: "p-4", children: _jsx("p", { style: { color: theme.black2 }, className: "text-sm", children: m.desc }) })] }, m.title))) })] }), _jsxs(Section, { id: "fasilitas", className: "py-16 md:py-20", children: [_jsxs("header", { className: "mb-8 md:mb-12 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Fitur Tambahan yang Kuat" }), _jsx("p", { className: "mt-3", style: { color: theme.black2 }, children: "Sesuaikan kebutuhan sekolah\u2014aktifkan modul sesuai prioritas." })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8", children: features.map((f) => (_jsxs("figure", { className: "rounded-3xl overflow-hidden border shadow-sm transition hover:shadow", style: {
                                    borderColor: theme.white3,
                                    backgroundColor: theme.white1,
                                }, children: [_jsx("img", { src: f.img, alt: f.title, className: "h-48 w-full object-cover", loading: "lazy" }), _jsx("figcaption", { className: "p-4 text-sm font-medium", style: { color: theme.black1 }, children: f.title })] }, f.title))) })] }), _jsx(Section, { id: "keunggulan", className: "py-16 md:py-20", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Mengapa Memilih Kami" }), _jsx("p", { className: "mt-3 max-w-prose", style: { color: theme.black2 }, children: "Tim kami berpengalaman membantu sekolah negeri & swasta meningkatkan efisiensi operasional tanpa mengubah budaya kerja inti." }), _jsx("ul", { className: "mt-6 space-y-3", children: advantages.map((k) => (_jsxs("li", { className: "rounded-2xl border p-4 transition", style: {
                                                backgroundColor: theme.white2,
                                                borderColor: theme.white3,
                                            }, children: [_jsx("div", { className: "font-semibold mb-2", style: { color: theme.black1 }, children: k.label }), _jsx("div", { className: "flex flex-wrap gap-2", children: k.points.map((p) => (_jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs rounded-full border px-3 py-1", style: {
                                                            borderColor: theme.white3,
                                                            color: theme.black1,
                                                            backgroundColor: theme.white1,
                                                        }, children: [_jsx(CheckCircle2, { className: "h-3.5 w-3.5" }), " ", p] }, p))) })] }, k.label))) })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "rounded-3xl overflow-hidden shadow-xl ring-1", style: { borderColor: theme.white3 }, children: _jsx("img", { src: sekolah4, alt: "Tim implementasi", className: "w-full h-full object-cover", loading: "lazy" }) }), _jsx("div", { className: "absolute -bottom-6 -right-6 hidden md:block rounded-2xl px-4 py-3 shadow-lg", style: { backgroundColor: theme.primary, color: "#FFFFFF" }, children: "Fokus: Efisiensi \u2022 Transparansi \u2022 Data-Driven" })] })] }) }), _jsxs(Section, { id: "testimoni", className: "py-16 md:py-28", children: [_jsxs("header", { className: "mb-8 md:mb-12 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Kata Mereka" }), _jsx("p", { className: "mt-3", style: { color: theme.black2 }, children: "Dampak nyata di sekolah pengguna layanan kami." })] }), _jsx(TestimonialSlider, { items: testimonials, theme: theme, autoplayDelayMs: 4000, showArrows: true })] }), _jsxs("div", { id: "demo", className: "relative overflow-hidden", style: {
                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.quaternary} 100%)`,
                    }, children: [_jsx("img", { src: sekolah5, alt: "CTA Demo", className: "pointer-events-none absolute inset-0 h-full w-full object-cover", style: { opacity: 0.1 }, loading: "lazy" }), _jsx(Section, { className: "py-16 md:py-20", children: _jsxs("div", { className: "rounded-3xl border backdrop-blur-sm p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center", style: {
                                    borderColor: "rgba(255,255,255,0.2)",
                                    color: "#FFFFFF",
                                }, children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold", children: "Jadwalkan Demo Gratis" }), _jsx("p", { className: "mt-2", style: { opacity: 0.9 }, children: "Lihat bagaimana platform kami menyederhanakan operasional sekolah Anda\u2014langsung bersama tim kami." }), _jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [_jsxs("a", { href: "#kontak", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow transition hover:opacity-90", style: {
                                                            backgroundColor: "#FFFFFF",
                                                            color: theme.primary,
                                                            borderColor: "#FFFFFF",
                                                        }, children: [_jsx(Calendar, { className: "h-4 w-4" }), " Booking Slot Demo"] }), _jsxs("a", { href: "#kontak", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                                            backgroundColor: "transparent",
                                                            color: "#FFFFFF",
                                                            borderColor: "rgba(255,255,255,0.6)",
                                                        }, children: [_jsx(Phone, { className: "h-4 w-4" }), " Hubungi Sales"] })] })] }), _jsx("ul", { className: "space-y-3 text-sm", children: [
                                            "Tanpa biaya setup",
                                            "Bisa migrasi data",
                                            "Bebas kontrak panjang",
                                            "Garansi bantuan implementasi",
                                        ].map((x) => (_jsxs("li", { className: "flex items-center gap-3", children: [_jsx(CheckCircle2, { className: "h-5 w-5" }), " ", x] }, x))) })] }) })] }), _jsx(Section, { className: "py-16 md:py-20", children: _jsx("div", { className: "rounded-3xl border p-6 md:p-10", style: { backgroundColor: theme.white2, borderColor: theme.white3 }, children: _jsxs("div", { className: "grid md:grid-cols-2 gap-8 items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold", style: { color: theme.black1 }, children: "Dapatkan Update Fitur & Studi Kasus" }), _jsx("p", { className: "mt-2", style: { color: theme.black2 }, children: "Kami kirim ringkas\u2014insight dan rilis terbaru ke email Anda." })] }), _jsxs("form", { onSubmit: (e) => e.preventDefault(), className: "flex flex-col sm:flex-row gap-3", children: [_jsx("input", { type: "email", required: true, placeholder: "Email sekolah Anda", className: "flex-1 rounded-2xl border px-4 py-3 outline-none focus:ring-2", style: {
                                                backgroundColor: theme.white1,
                                                borderColor: theme.white3,
                                                color: theme.black1,
                                            } }), _jsx("button", { className: "rounded-2xl px-6 py-3 transition hover:opacity-90", style: primaryBtnStyle, children: "Langganan" })] })] }) }) }), _jsx(WebsiteFooter, {})] }) }));
}
