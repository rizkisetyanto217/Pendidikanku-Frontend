import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/DukungKami.tsx
import { useMemo } from "react";
import { Heart, Handshake, Users, School, BookOpen, Database, CreditCard, QrCode, Repeat, ShieldCheck, FileText, ChevronRight, Mail, Phone, } from "lucide-react";
import WebsiteNavbar from "@/components/common/public/WebsiteNavbar";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import WebsiteFooter from "../components/MasjidkuWebFooter";
/* =====================================================================
 * Utilities (follow SekolahIslamkuHome style)
 * ===================================================================== */
const FullBleed = ({ className = "", children, }) => (_jsx("div", { className: `relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`, children: children }));
const Section = ({ id, className = "", children }) => (_jsx("section", { id: id, className: `px-4 sm:px-6 lg:px-8 ${className}`, children: _jsx("div", { className: "w-full", children: children }) }));
/* =====================================================================
 * Page
 * ===================================================================== */
export default function MasjidkuWebSupportUs() {
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
            }, children: [_jsx(WebsiteNavbar, {}), _jsx("div", { style: { height: "5.5rem" } }), _jsxs("div", { className: "relative overflow-hidden", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2400&auto=format&fit=crop", alt: "Komunitas pendidikan berkolaborasi", className: "absolute inset-0 h-full w-full object-cover", style: { opacity: isDark ? 0.25 : 0.2, filter: "saturate(0.9)" }, loading: "eager" }), _jsx(Section, { className: "relative py-14 sm:py-20 lg:py-24", children: _jsxs("div", { className: "text-center max-w-3xl mx-auto", children: [_jsxs("span", { className: "inline-flex items-center gap-2 text-xs font-medium rounded-full border px-3 py-1", style: {
                                            backgroundColor: isDark ? theme.white2 : theme.white1,
                                            borderColor: theme.white3,
                                            color: theme.black1,
                                        }, children: [_jsx(Heart, { className: "h-3.5 w-3.5" }), " Gerakan Berbagi Akses Teknologi Pendidikan"] }), _jsx("h1", { className: "mt-4 text-4xl md:text-5xl font-bold", style: { color: theme.black1 }, children: "Dukung Kami" }), _jsxs("p", { className: "mt-3", style: { color: theme.silver2 }, children: ["Visi kami:", " ", _jsx("strong", { children: "setiap madrasah, pesantren, dan sekolah Islam" }), " ", "bisa memakai SekolahIslamku", _jsx("strong", { children: " secara gratis" }), "\u2014dengan bantuan para donatur yang peduli pendidikan."] }), _jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [_jsxs("a", { href: "#donasi", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: primaryBtn, children: [_jsx(CreditCard, { className: "h-4 w-4" }), " Donasi Sekarang"] }), _jsxs("a", { href: "#ajukan", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                                    color: theme.black1,
                                                    borderColor: theme.white3,
                                                    backgroundColor: isDark ? theme.white2 : "transparent",
                                                }, children: [_jsx(ChevronRight, { className: "h-4 w-4" }), " Ajukan Beasiswa Lisensi"] })] })] }) })] }), _jsx(Section, { id: "visi-misi", className: "py-12 md:py-16", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "rounded-3xl p-6 border", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.white3,
                                }, children: [_jsxs("div", { className: "flex items-center gap-2 text-lg font-semibold", style: { color: theme.black1 }, children: [_jsx(School, { className: "h-5 w-5" }), " Visi"] }), _jsxs("p", { className: "mt-3 text-sm", style: { color: theme.silver2 }, children: ["Akses teknologi pendidikan yang ", _jsx("strong", { children: "merata" }), ",", " ", _jsx("strong", { children: "aman" }), ", dan ", _jsx("strong", { children: "berdampak" }), " bagi seluruh lembaga pendidikan Islam di Indonesia."] })] }), _jsxs("div", { className: "rounded-3xl p-6 border", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.white3,
                                }, children: [_jsxs("div", { className: "flex items-center gap-2 text-lg font-semibold", style: { color: theme.black1 }, children: [_jsx(Handshake, { className: "h-5 w-5" }), " Misi"] }), _jsx("ul", { className: "mt-3 space-y-2 text-sm", style: { color: theme.silver2 }, children: [
                                            "Mensubsidi lisensi platform bagi lembaga yang membutuhkan",
                                            "Menyediakan pelatihan dan pendampingan untuk guru & operator",
                                            "Menjaga keberlanjutan infrastruktur (server, backup, keamanan)",
                                            "Mendorong kolaborasi donatur, yayasan, dan komunitas",
                                        ].map((x) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(Heart, { className: "h-4 w-4 mt-0.5" }), " ", x] }, x))) })] })] }) }), _jsxs(Section, { id: "program", className: "py-12 md:py-16", children: [_jsxs("header", { className: "mb-8 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Ke Mana Donasi Anda Dialokasikan" }), _jsx("p", { className: "mt-3", style: { color: theme.silver2 }, children: "Kami fokus pada dampak langsung bagi sekolah." })] }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-6", children: [
                                {
                                    icon: BookOpen,
                                    title: "Beasiswa Lisensi",
                                    desc: "Membiayai penggunaan platform untuk sekolah membutuhkan.",
                                },
                                {
                                    icon: Database,
                                    title: "Infrastruktur",
                                    desc: "Server, backup harian, monitoring, dan keamanan data.",
                                },
                                {
                                    icon: Users,
                                    title: "Pelatihan Guru",
                                    desc: "Sesi onboarding, materi, dan pendampingan operasional.",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Kepatuhan & Audit",
                                    desc: "Kebijakan, SOP, dan jejak audit demi transparansi.",
                                },
                            ].map((i) => (_jsx("div", { className: "rounded-2xl p-5 border", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.white3,
                                }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(i.icon, { className: "h-5 w-5" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", style: { color: theme.black1 }, children: i.title }), _jsx("div", { className: "text-sm mt-1", style: { color: theme.silver2 }, children: i.desc })] })] }) }, i.title))) })] }), _jsxs(Section, { id: "dampak", className: "py-12", children: [_jsx("div", { className: "grid md:grid-cols-3 gap-4", children: [
                                { label: "Sekolah Terbantu", value: "250+" },
                                { label: "Guru & Staf Terlatih", value: "8.5k+" },
                                { label: "Siswa Terlayani", value: "150k+" },
                            ].map((k) => (_jsxs("div", { className: "rounded-2xl p-4 border text-center", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.white3,
                                }, children: [_jsx("div", { className: "text-2xl font-bold", style: { color: theme.black1 }, children: k.value }), _jsx("div", { className: "text-xs mt-1", style: { color: theme.silver2 }, children: k.label })] }, k.label))) }), _jsx("div", { className: "mt-6 rounded-2xl border p-4", style: {
                                backgroundColor: theme.white2,
                                borderColor: theme.white3,
                                color: theme.black1,
                            }, children: _jsxs("div", { className: "text-sm", style: { color: theme.silver2 }, children: ["*Estimasi biaya berjenjang untuk lisensi & infrastruktur akan dipublikasikan pada laporan triwulan. Donatur dapat memilih skema", " ", _jsx("strong", { children: "sekali donasi" }), " atau", " ", _jsx("strong", { children: "berkala (recurring)" }), " sesuai preferensi."] }) })] }), _jsxs(Section, { id: "donasi", className: "py-12 md:py-16", children: [_jsxs("header", { className: "mb-8 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Cara Berdonasi" }), _jsx("p", { className: "mt-3", style: { color: theme.silver2 }, children: "Pilih metode yang paling nyaman untuk Anda." })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6 items-start", children: [_jsxs("div", { className: "rounded-3xl p-6 border", style: {
                                        backgroundColor: theme.white1,
                                        borderColor: theme.white3,
                                    }, children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold", style: { color: theme.black1 }, children: [_jsx(CreditCard, { className: "h-5 w-5" }), " Transfer Bank (Contoh)"] }), _jsxs("ul", { className: "mt-3 text-sm space-y-2", style: { color: theme.silver2 }, children: [_jsx("li", { children: "Bank Syariah Indonesia (BSI)" }), _jsxs("li", { children: ["No. Rek: ", _jsx("strong", { children: "123 456 7890" })] }), _jsxs("li", { children: ["a/n: ", _jsx("strong", { children: "Yayasan SekolahIslamku" })] })] })] }), _jsxs("div", { className: "rounded-3xl p-6 border", style: {
                                        backgroundColor: theme.white1,
                                        borderColor: theme.white3,
                                    }, children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold", style: { color: theme.black1 }, children: [_jsx(QrCode, { className: "h-5 w-5" }), " QRIS (Contoh)"] }), _jsx("div", { className: "mt-3 aspect-square rounded-xl border flex items-center justify-center text-xs", style: { borderColor: theme.white3, color: theme.silver2 }, children: "Tempat QRIS \u2014 ganti dengan gambar resmi" })] }), _jsxs("div", { className: "rounded-3xl p-6 border", style: {
                                        backgroundColor: theme.white1,
                                        borderColor: theme.white3,
                                    }, children: [_jsxs("div", { className: "flex items-center gap-2 font-semibold", style: { color: theme.black1 }, children: [_jsx(Repeat, { className: "h-5 w-5" }), " Donasi Berkala"] }), _jsx("p", { className: "mt-3 text-sm", style: { color: theme.silver2 }, children: "Dukung sekolah secara berkelanjutan setiap bulan. Anda akan menerima ringkasan dampak melalui email." }), _jsx("div", { className: "mt-4 flex flex-wrap gap-2 text-sm", children: ["Rp100k", "Rp250k", "Rp500k", "Rp1jt"].map((x) => (_jsxs("span", { className: "rounded-full px-3 py-1 border", style: { borderColor: theme.white3, color: theme.black1 }, children: [x, "/bulan"] }, x))) })] })] }), _jsxs("div", { className: "mt-6 flex flex-wrap items-center justify-center gap-3", children: [_jsxs("a", { href: "https://wa.me/6281234567890", target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: primaryBtn, children: [_jsx(Phone, { className: "h-4 w-4" }), " Konfirmasi via WhatsApp"] }), _jsxs("a", { href: "mailto:donasi@sekolahislamku.id", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                        color: theme.black1,
                                        borderColor: theme.white3,
                                        backgroundColor: isDark ? theme.white2 : "transparent",
                                    }, children: [_jsx(Mail, { className: "h-4 w-4" }), " donasi@sekolahislamku.id"] })] })] }), _jsx(Section, { id: "transparansi", className: "py-12 md:py-16", children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-center", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold", style: { color: theme.black1 }, children: "Transparansi & Akuntabilitas" }), _jsx("ul", { className: "mt-3 space-y-2 text-sm", style: { color: theme.silver2 }, children: [
                                            "Laporan triwulan: alokasi dana & jumlah sekolah terbantu",
                                            "Rangkuman dampak: guru terlatih, siswa terlayani, progres fitur",
                                            "Audit internal & jejak audit sistem untuk setiap perubahan kebijakan",
                                        ].map((x) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(ShieldCheck, { className: "h-4 w-4 mt-0.5" }), " ", x] }, x))) }), _jsx("div", { className: "mt-4", children: _jsxs("a", { href: "#", className: "inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                                color: theme.black1,
                                                borderColor: theme.white3,
                                                backgroundColor: isDark ? theme.white2 : "transparent",
                                            }, children: [_jsx(FileText, { className: "h-4 w-4" }), " Contoh Laporan (PDF)"] }) })] }), _jsxs("div", { className: "rounded-3xl p-6 border", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.white3,
                                }, children: [_jsxs("div", { className: "font-semibold flex items-center gap-2", style: { color: theme.black1 }, children: [_jsx(Users, { className: "h-5 w-5" }), " Sponsor Perusahaan / CSR"] }), _jsx("p", { className: "mt-2 text-sm", style: { color: theme.silver2 }, children: "Perusahaan dapat bermitra untuk mensubsidi lisensi sekolah sasaran (daerah 3T/TPK, pesantren kecil, dll). Kami sediakan paket branding, laporan dampak, dan pelibatan karyawan." }), _jsxs("a", { href: "mailto:partnership@sekolahislamku.id", className: "mt-4 inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm transition", style: {
                                            color: theme.black1,
                                            borderColor: theme.white3,
                                            backgroundColor: isDark ? theme.white2 : "transparent",
                                        }, children: [_jsx(Mail, { className: "h-4 w-4" }), " partnership@sekolahislamku.id"] })] })] }) }), _jsx(Section, { id: "ajukan", className: "py-12 md:py-16", children: _jsx("div", { className: "rounded-3xl border p-6 md:p-8", style: { backgroundColor: theme.white2, borderColor: theme.white3 }, children: _jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl md:text-3xl font-bold", style: { color: theme.black1 }, children: "Ajukan Beasiswa Lisensi" }), _jsx("p", { className: "mt-2 text-sm", style: { color: theme.silver2 }, children: "Lembaga Anda membutuhkan subsidi lisensi? Ajukan di sini. Tim kami akan menyeleksi berdasarkan kriteria kebutuhan dan dampak." }), _jsx("ul", { className: "mt-3 space-y-2 text-sm", style: { color: theme.silver2 }, children: [
                                                "Prioritas: madrasah/pesantren kecil, daerah 3T/TPK, atau biaya operasional terbatas",
                                                "Komitmen minimal: satu PIC operasional & kesediaan mengikuti pelatihan",
                                                "Pelaporan dampak sederhana tiap semester",
                                            ].map((x) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckIcon, {}), " ", x] }, x))) })] }), _jsxs("form", { onSubmit: (e) => e.preventDefault(), className: "rounded-2xl border p-4 md:p-6", style: {
                                        backgroundColor: theme.white1,
                                        borderColor: theme.white3,
                                    }, children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Nama Lembaga" }), _jsx("input", { required: true, className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                backgroundColor: theme.white1,
                                                                borderColor: theme.white3,
                                                                color: theme.black1,
                                                            } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Jenjang" }), _jsx("input", { placeholder: "MI/MTs/MA/SD/SMP/SMA/SMK/Pesantren", className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                backgroundColor: theme.white1,
                                                                borderColor: theme.white3,
                                                                color: theme.black1,
                                                            } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Kontak PIC" }), _jsx("input", { placeholder: "Nama & No. HP", className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                backgroundColor: theme.white1,
                                                                borderColor: theme.white3,
                                                                color: theme.black1,
                                                            } })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Email" }), _jsx("input", { type: "email", required: true, className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                backgroundColor: theme.white1,
                                                                borderColor: theme.white3,
                                                                color: theme.black1,
                                                            } })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Kota/Kabupaten" }), _jsx("input", { className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                backgroundColor: theme.white1,
                                                                borderColor: theme.white3,
                                                                color: theme.black1,
                                                            } })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Link Website/Media Sosial" }), _jsx("input", { className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                backgroundColor: theme.white1,
                                                                borderColor: theme.white3,
                                                                color: theme.black1,
                                                            } })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-xs", style: { color: theme.silver2 }, children: "Cerita Singkat Kebutuhan" }), _jsx("textarea", { rows: 4, className: "mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2", style: {
                                                                backgroundColor: theme.white1,
                                                                borderColor: theme.white3,
                                                                color: theme.black1,
                                                            } })] })] }), _jsxs("button", { className: "mt-4 inline-flex items-center gap-2 rounded-full ring-1 px-5 py-2.5 text-sm shadow-sm transition hover:shadow-md", style: primaryBtn, children: [_jsx(ChevronRight, { className: "h-4 w-4" }), " Ajukan"] })] })] }) }) }), _jsxs(Section, { id: "faq", className: "py-12 md:py-16", children: [_jsxs("header", { className: "mb-8 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "FAQ Donatur" }), _jsx("p", { className: "mt-3", style: { color: theme.silver2 }, children: "Pertanyaan umum tentang program dukungan." })] }), _jsx("div", { className: "grid lg:grid-cols-2 gap-6", children: [
                                {
                                    q: "Apakah donasi saya bisa ditujukan ke sekolah tertentu?",
                                    a: "Bisa. Kami akan menghubungi sekolah sasaran untuk verifikasi & kesiapan implementasi.",
                                },
                                {
                                    q: "Apakah ada bukti penggunaan dana?",
                                    a: "Ada. Donatur menerima ringkasan triwulan & tautan ke laporan lengkap.",
                                },
                                {
                                    q: "Bisakah donasi dilakukan berkala otomatis?",
                                    a: "Bisa. Kami mendukung skema berkala (bulanan/kuartalan).",
                                },
                                {
                                    q: "Apakah donasi bisa atas nama perusahaan?",
                                    a: "Bisa. Tersedia paket CSR/sponsorship dengan benefit pelaporan & branding.",
                                },
                            ].map((f) => (_jsxs("div", { className: "rounded-2xl p-5 border", style: {
                                    backgroundColor: theme.white1,
                                    borderColor: theme.white3,
                                }, children: [_jsx("div", { className: "font-semibold", style: { color: theme.black1 }, children: f.q }), _jsx("div", { className: "text-sm mt-2", style: { color: theme.silver2 }, children: f.a })] }, f.q))) })] }), _jsx(WebsiteFooter, {})] }) }));
}
// Simple check icon (to avoid extra import)
function CheckIcon() {
    return (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "mt-0.5", children: _jsx("path", { d: "M20 6L9 17l-5-5", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
