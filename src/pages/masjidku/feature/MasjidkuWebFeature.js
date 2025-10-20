import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/SekolahIslamkuFeatures.tsx
import { useMemo, memo } from "react";
import { CheckCircle2, ShieldCheck, Lock, Cloud, Database, Sparkles, Calendar, BarChart3, ChevronRight, Plug, } from "lucide-react";
import WebsiteNavbar from "@/components/common/public/WebsiteNavbar";
import WebsiteFooter from "../website/components/MasjidkuWebFooter";
import useHtmlThema from "@/hooks/useHTMLThema";
import { pickTheme } from "@/constants/thema";
/* =====================================================================
 * Utilities
 * ===================================================================== */
const FullBleed = ({ className = "", children, }) => (_jsx("div", { className: `relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`, children: children }));
const Section = ({ id, className = "", children }) => (_jsx("section", { id: id, className: `px-4 sm:px-6 lg:px-8 ${className}`, children: _jsx("div", { className: "w-full", children: children }) }));
const FEATURE_SUMMARY_10 = [
    {
        title: "PPDB Online",
        desc: "Formulir, seleksi, verifikasi otomatis.",
        img: "https://images.unsplash.com/photo-1601935111741-a8da1e5b0534?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Akademik",
        desc: "RPP, jadwal, nilai, rapor digital.",
        img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Absensi",
        desc: "QR/ID, izin, rekap real-time.",
        img: "https://images.unsplash.com/photo-1596495578065-8fe1800a2a4b?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Keuangan",
        desc: "Tagihan & pembayaran online.",
        img: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "LMS",
        desc: "Materi, tugas, ujian, bank soal.",
        img: "https://images.unsplash.com/photo-1584697964199-10c09b6b29a3?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Komunikasi",
        desc: "WA/Email gateway, portal orang tua.",
        img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Inventaris",
        desc: "Kelola sarana, prasarana, aset.",
        img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Perpustakaan",
        desc: "Peminjaman, katalog, stok buku.",
        img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Pelaporan KPI",
        desc: "Analitik & ekspor Excel/PDF.",
        img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop",
    },
    {
        title: "Integrasi",
        desc: "SSO, payment, LMS eksternal.",
        img: "https://images.unsplash.com/photo-1604147706281-ec95a711b24c?q=80&w=600&auto=format&fit=crop",
    },
];
/* =====================================================================
 * Small Card (reusable)
 * ===================================================================== */
const MiniFeatureCard = memo(({ title, desc, img, bg, fg, border, muted }) => (_jsxs("figure", { className: "rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition", style: { backgroundColor: bg, borderColor: border }, children: [_jsx("img", { src: img, alt: title, className: "h-28 w-full object-cover", loading: "lazy" }), _jsxs("figcaption", { className: "p-3", children: [_jsx("div", { className: "font-semibold text-sm", style: { color: fg }, children: title }), _jsx("div", { className: "text-xs mt-1", style: { color: muted ?? border }, children: desc })] })] })));
MiniFeatureCard.displayName = "MiniFeatureCard";
/* =====================================================================
 * Page Content
 * ===================================================================== */
export default function SekolahIslamkuFeatures() {
    const { isDark, themeName } = useHtmlThema();
    const theme = pickTheme(themeName, isDark);
    const pageBg = useMemo(() => isDark
        ? `linear-gradient(180deg, ${theme.white1} 0%, ${theme.white2} 100%)`
        : `linear-gradient(180deg, ${theme.white2} 0%, ${theme.white1} 100%)`, [isDark, theme]);
    const primaryBtnStyle = useMemo(() => ({
        backgroundColor: theme.primary,
        borderColor: theme.primary,
        color: "#FFFFFF",
    }), [theme]);
    return (_jsx(FullBleed, { children: _jsxs("div", { className: "min-h-screen overflow-x-hidden w-screen", style: { background: pageBg, color: theme.black1 }, children: [_jsx(WebsiteNavbar, {}), _jsx("div", { style: { height: "5.5rem" } }), _jsxs("div", { className: "relative overflow-hidden", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2400&auto=format&fit=crop", alt: "Background", className: "absolute inset-0 h-full w-full object-cover", style: { opacity: isDark ? 0.25 : 0.2, filter: "saturate(0.9)" }, loading: "eager" }), _jsx(Section, { className: "relative py-14 sm:py-20 lg:py-28", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-center", children: [_jsxs("div", { children: [_jsxs("span", { className: "inline-flex items-center gap-2 text-xs font-medium rounded-full border px-3 py-1", style: {
                                                    backgroundColor: isDark ? theme.white2 : theme.white1,
                                                    borderColor: theme.white3,
                                                    color: theme.black1,
                                                }, children: [_jsx(Sparkles, { className: "h-3.5 w-3.5" }), " Fitur Lengkap, Siap Pakai"] }), _jsxs("h1", { className: "mt-4 text-4xl md:text-5xl xl:text-6xl font-bold leading-tight", style: { color: theme.black1 }, children: ["Semua yang Dibutuhkan Sekolah, dalam", " ", _jsx("span", { style: { color: theme.primary }, children: "Satu Platform" })] }), _jsx("p", { className: "mt-4 max-w-3xl", style: { color: theme.silver2 }, children: "Kelola PPDB, akademik, keuangan, absensi, komunikasi orang tua, hingga pelaporan KPI\u2014tanpa perlu gonta-ganti aplikasi." }), _jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-3", children: [_jsxs("a", { href: "#demo", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: primaryBtnStyle, children: [_jsx(ChevronRight, { className: "h-4 w-4" }), " Minta Demo Fitur"] }), _jsxs("a", { href: "#faq", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                                            color: theme.black1,
                                                            borderColor: theme.white3,
                                                            backgroundColor: isDark ? theme.white2 : "transparent",
                                                        }, children: [_jsx(ShieldCheck, { className: "h-4 w-4" }), " Lihat FAQ"] })] })] }), _jsx("div", { children: _jsxs("div", { className: "relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl ring-1", style: { borderColor: theme.white3 }, children: [_jsx("img", { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop", alt: "Tangkapan layar fitur", className: "h-full w-full object-cover", loading: "lazy" }), _jsxs("div", { className: "absolute bottom-3 left-3 right-3 rounded-2xl p-3 flex items-center gap-3", style: {
                                                        backdropFilter: "blur(6px)",
                                                        backgroundColor: `${theme.white2}cc`,
                                                        color: theme.black1,
                                                    }, children: [_jsx(BarChart3, { className: "h-4 w-4" }), _jsx("p", { className: "text-xs", children: "Pantau KPI sekolah, progres kurikulum, keuangan, dan kehadiran\u2014real-time." })] })] }) })] }) })] }), _jsxs(Section, { id: "ringkas", className: "py-16 md:py-20", children: [_jsxs("header", { className: "mb-8 md:mb-12 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Ringkasan Fitur Utama" }), _jsx("p", { className: "mt-3", style: { color: theme.silver2 }, children: "10 modul inti\u2014ringkas, praktis, siap dipakai dari hari pertama." })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-8", children: FEATURE_SUMMARY_10.map((f) => (_jsx(MiniFeatureCard, { ...f, bg: theme.white1, fg: theme.black1, border: theme.white3, muted: theme.silver2 }, f.title))) })] }), _jsxs(Section, { id: "detail", className: "py-16 md:py-20", children: [_jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold", style: { color: theme.black1 }, children: "PPDB & Penempatan Kelas" }), _jsx("ul", { className: "mt-4 space-y-2 text-sm", style: { color: theme.silver2 }, children: [
                                                "Form pendaftaran online (multi-gelombang)",
                                                "Verifikasi berkas & validasi NISN/NIK",
                                                "Pembayaran biaya pendaftaran/SPP via payment gateway",
                                                "Algoritma penempatan kelas otomatis dengan kuota & preferensi",
                                                "Surat keputusan & kartu siswa otomatis (PDF)",
                                            ].map((x) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckCircle2, { className: "mt-0.5 h-4 w-4" }), " ", x] }, x))) })] }), _jsx("div", { className: "rounded-3xl overflow-hidden border", style: { borderColor: theme.white3 }, children: _jsx("img", { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1600&auto=format&fit=crop", alt: "PPDB", className: "w-full h-full object-cover", loading: "lazy" }) })] }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-start mt-14", children: [_jsx("div", { className: "order-2 lg:order-1 rounded-3xl overflow-hidden border", style: { borderColor: theme.white3 }, children: _jsx("img", { src: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600&auto=format&fit=crop", alt: "Akademik", className: "w-full h-full object-cover", loading: "lazy" }) }), _jsxs("div", { className: "order-1 lg:order-2", children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold", style: { color: theme.black1 }, children: "Akademik, Nilai & Rapor Digital" }), _jsx("ul", { className: "mt-4 space-y-2 text-sm", style: { color: theme.silver2 }, children: [
                                                "Pemetaan kurikulum & kalender akademik",
                                                "Penjadwalan kelas, guru pengampu, dan ruang",
                                                "Input nilai (kompetensi pengetahuan & keterampilan)",
                                                "Rapor digital lengkap dengan deskripsi sikap",
                                                "Rekap kelulusan & arsip per tahun ajaran",
                                            ].map((x) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckCircle2, { className: "mt-0.5 h-4 w-4" }), " ", x] }, x))) })] })] }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-start mt-14", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold", style: { color: theme.black1 }, children: "Absensi, Perizinan & Rekap Kehadiran" }), _jsx("ul", { className: "mt-4 space-y-2 text-sm", style: { color: theme.silver2 }, children: [
                                                "Scan QR/ID untuk siswa & guru",
                                                "Permohonan izin/sakit beserta lampiran",
                                                "Alarm keterlambatan & notifikasi ke orang tua",
                                                "Analitik kehadiran per kelas/guru/bulan",
                                                "Ekspor Excel/PDF untuk pelaporan",
                                            ].map((x) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckCircle2, { className: "mt-0.5 h-4 w-4" }), " ", x] }, x))) })] }), _jsx("div", { className: "rounded-3xl overflow-hidden border", style: { borderColor: theme.white3 }, children: _jsx("img", { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop", alt: "Absensi", className: "w-full h-full object-cover", loading: "lazy" }) })] })] }), _jsx(Section, { id: "keamanan", className: "py-16 md:py-20", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-10 items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Keamanan & Kepatuhan" }), _jsx("p", { className: "mt-3", style: { color: theme.silver2 }, children: "Data sekolah Anda diproteksi berlapis\u2014enkripsi, kontrol akses bertingkat, dan jejak audit menyeluruh." }), _jsx("div", { className: "mt-6 grid sm:grid-cols-2 gap-4", children: [
                                            {
                                                icon: Lock,
                                                title: "Kontrol Akses",
                                                desc: "Role-based & granular permission.",
                                            },
                                            {
                                                icon: Database,
                                                title: "Backup Harian",
                                                desc: "Snapshot & retention terkelola.",
                                            },
                                            {
                                                icon: ShieldCheck,
                                                title: "Audit Trail",
                                                desc: "Aktivitas terekam per pengguna.",
                                            },
                                            {
                                                icon: Cloud,
                                                title: "Reliabilitas",
                                                desc: "Hosting cloud dengan SLA tinggi.",
                                            },
                                        ].map((i) => (_jsx("div", { className: "rounded-2xl p-4 border", style: {
                                                backgroundColor: theme.white1,
                                                borderColor: theme.white3,
                                            }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(i.icon, { className: "h-5 w-5" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", style: { color: theme.black1 }, children: i.title }), _jsx("div", { className: "text-sm", style: { color: theme.silver2 }, children: i.desc })] })] }) }, i.title))) })] }), _jsxs("div", { children: [_jsx("div", { className: "rounded-3xl overflow-hidden border", style: { borderColor: theme.white3 }, children: _jsx("img", { src: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1600&auto=format&fit=crop", alt: "Keamanan data", className: "w-full h-full object-cover", loading: "lazy" }) }), _jsx("p", { className: "text-xs mt-3", style: { color: theme.silver2 }, children: "*Dukungan kebijakan keamanan & SOP implementasi disediakan saat onboarding." })] })] }) }), _jsx(Section, { id: "integrasi", className: "py-12 md:py-14", children: _jsx("div", { className: "rounded-3xl border p-6 md:p-8", style: { backgroundColor: theme.white2, borderColor: theme.white3 }, children: _jsxs("div", { className: "flex items-center justify-between flex-wrap gap-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold", style: { color: theme.black1 }, children: [_jsx(Plug, { className: "h-4 w-4" }), " Integrasi Populer:"] }), _jsx("div", { className: "flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center", children: [
                                        {
                                            name: "WhatsApp Gateway",
                                            img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop",
                                        },
                                        {
                                            name: "Email SMTP",
                                            img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop",
                                        },
                                        {
                                            name: "Payment Gateway",
                                            img: "https://images.unsplash.com/photo-1556742400-b5b7c5121f2a?q=80&w=600&auto=format&fit=crop",
                                        },
                                        {
                                            name: "Spreadsheet Export",
                                            img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
                                        },
                                        {
                                            name: "SSO Sekolah",
                                            img: "https://images.unsplash.com/photo-1604147706281-ec95a711b24c?q=80&w=600&auto=format&fit=crop",
                                        },
                                        {
                                            name: "LMS Eksternal",
                                            img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
                                        },
                                    ].map((x) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("img", { src: x.img, alt: x.name, className: "h-8 w-8 rounded-lg object-cover", loading: "lazy" }), _jsx("div", { className: "text-xs md:text-sm", style: { color: theme.black1 }, children: x.name })] }, x.name))) })] }) }) }), _jsxs(Section, { id: "perbandingan", className: "py-16 md:py-20", children: [_jsxs("header", { className: "mb-8 md:mb-12 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Perbandingan Singkat" }), _jsx("p", { className: "mt-3", style: { color: theme.silver2 }, children: "Mengapa SekolahIslamku lebih efisien dibanding cara lama." })] }), _jsx("div", { className: "overflow-x-auto rounded-3xl border", style: { borderColor: theme.white3 }, children: _jsxs("table", { className: "min-w-[720px] w-full text-sm", children: [_jsx("thead", { style: { backgroundColor: theme.white2 }, children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-4", style: { color: theme.black1 }, children: "Aspek" }), _jsx("th", { className: "text-left p-4", style: { color: theme.black1 }, children: "Manual/Spreadsheet" }), _jsx("th", { className: "text-left p-4", style: { color: theme.black1 }, children: "SekolahIslamku" })] }) }), _jsx("tbody", { children: [
                                            {
                                                a: "PPDB",
                                                b: "Form fisik, verifikasi lama",
                                                c: "Online, verifikasi cepat, penempatan otomatis",
                                            },
                                            {
                                                a: "Akademik",
                                                b: "Input terpisah, rapor manual",
                                                c: "Terpadu, rapor digital siap cetak",
                                            },
                                            {
                                                a: "Absensi",
                                                b: "Manual, rawan salah hitung",
                                                c: "QR/ID, rekap otomatis & analitik",
                                            },
                                            {
                                                a: "Keuangan",
                                                b: "Catatan tersebar, rekonsiliasi sulit",
                                                c: "Tagih-bayar online, laporan sekali klik",
                                            },
                                            {
                                                a: "Komunikasi",
                                                b: "Chat grup acak, arsip tidak rapi",
                                                c: "Gateway WA/Email, portal orang tua",
                                            },
                                        ].map((row) => (_jsxs("tr", { className: "border-t", style: { borderColor: theme.white3 }, children: [_jsx("td", { className: "p-4", style: { color: theme.black1 }, children: row.a }), _jsx("td", { className: "p-4", style: { color: theme.silver2 }, children: row.b }), _jsx("td", { className: "p-4", style: { color: theme.silver2 }, children: row.c })] }, row.a))) })] }) })] }), _jsx(Section, { id: "kpi", className: "py-12", children: _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                            { label: "Sekolah Terbantu", value: "250+" },
                            { label: "Guru & Staff", value: "8.5k+" },
                            { label: "Siswa Tercatat", value: "150k+" },
                            { label: "Integrasi Aktif", value: "50+" },
                        ].map((k) => (_jsxs("div", { className: "rounded-2xl p-4 border text-center", style: {
                                backgroundColor: theme.white1,
                                borderColor: theme.white3,
                            }, children: [_jsx("div", { className: "text-2xl font-bold", style: { color: theme.black1 }, children: k.value }), _jsx("div", { className: "text-xs mt-1", style: { color: theme.silver2 }, children: k.label })] }, k.label))) }) }), _jsxs(Section, { id: "faq", className: "py-16 md:py-20", children: [_jsxs("header", { className: "mb-8 md:mb-12 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Pertanyaan yang Sering Diajukan" }), _jsx("p", { className: "mt-3", style: { color: theme.silver2 }, children: "Ringkas dan langsung ke poinnya." })] }), _jsx("div", { className: "grid lg:grid-cols-2 gap-6", children: [
                                {
                                    q: "Apakah butuh server sendiri?",
                                    a: "Tidak. Kami menyediakan hosting cloud dengan SLA tinggi, backup harian, serta pemantauan kesehatan sistem.",
                                },
                                {
                                    q: "Bisakah migrasi dari sistem lama?",
                                    a: "Bisa. Kami siapkan template impor data (siswa, guru, kelas, histori nilai/absensi).",
                                },
                                {
                                    q: "Apa saja metode pembayaran SPP?",
                                    a: "Transfer bank/VA, e-wallet, QRIS—tergantung payment gateway yang diaktifkan oleh sekolah.",
                                },
                                {
                                    q: "Apakah modul bisa dipilih?",
                                    a: "Bisa. Sekolah dapat mengaktifkan modul sesuai prioritas dan bertahap.",
                                },
                                {
                                    q: "Apakah ada pelatihan?",
                                    a: "Ada. Onboarding 1-3 sesi sesuai kebutuhan, termasuk dokumentasi & video panduan.",
                                },
                                {
                                    q: "Bagaimana keamanan data?",
                                    a: "Kontrol akses peran, enkripsi, audit trail, dan kebijakan SOP implementasi.",
                                },
                            ].map((f) => (_jsxs("div", { className: "rounded-2xl p-5 border", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.white3,
                                }, children: [_jsx("div", { className: "font-semibold", style: { color: theme.black1 }, children: f.q }), _jsx("div", { className: "text-sm mt-2", style: { color: theme.silver2 }, children: f.a })] }, f.q))) })] }), _jsxs("div", { id: "demo", className: "relative overflow-hidden", style: {
                        background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.quaternary} 100%)`,
                    }, children: [_jsx("img", { src: "https://images.unsplash.com/photo-1544717305-996b815c338c?q=80&w=2000&auto=format&fit=crop", alt: "CTA Demo", className: "pointer-events-none absolute inset-0 h-full w-full object-cover", style: { opacity: 0.12 }, loading: "lazy" }), _jsx(Section, { className: "py-16 md:py-20", children: _jsxs("div", { className: "rounded-3xl border backdrop-blur-sm p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center", style: {
                                    borderColor: "rgba(255,255,255,0.2)",
                                    color: "#FFFFFF",
                                }, children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold", children: "Ingin Lihat Fitur dalam Aksi?" }), _jsx("p", { className: "mt-2", style: { opacity: 0.9 }, children: "Jadwalkan demo bersama tim kami. Tanyakan apa pun tentang kebutuhan sekolah Anda." }), _jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [_jsxs("a", { href: "#kontak", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow transition hover:opacity-90", style: {
                                                            backgroundColor: "#FFFFFF",
                                                            color: theme.primary,
                                                            borderColor: "#FFFFFF",
                                                        }, children: [_jsx(Calendar, { className: "h-4 w-4" }), " Booking Slot Demo"] }), _jsxs("a", { href: "#kontak", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                                            backgroundColor: "transparent",
                                                            color: "#FFFFFF",
                                                            borderColor: "rgba(255,255,255,0.6)",
                                                        }, children: [_jsx(ChevronRight, { className: "h-4 w-4" }), " Tanya Tim Sales"] })] })] }), _jsx("ul", { className: "space-y-3 text-sm", children: [
                                            "Tanpa biaya setup",
                                            "Bisa migrasi data",
                                            "Bebas kontrak panjang",
                                            "Garansi bantuan implementasi",
                                        ].map((x) => (_jsxs("li", { className: "flex items-center gap-3", children: [_jsx(CheckCircle2, { className: "h-5 w-5" }), " ", x] }, x))) })] }) })] }), _jsx(WebsiteFooter, {})] }) }));
}
