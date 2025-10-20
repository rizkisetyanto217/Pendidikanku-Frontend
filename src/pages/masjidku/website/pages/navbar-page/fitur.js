import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BookOpen, Users, Clock, Calendar, DollarSign, MessageSquare, Layers, Library, CheckCircle2, } from "lucide-react";
import WebsiteNavbar from "@/components/common/public/WebsiteNavbar";
const FullBleed = ({ children, className = "" }) => (_jsx("div", { className: `relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`, children: children }));
export default function Fitur() {
    return (_jsxs("div", { className: "min-h-screen  dark:bg-gray-900", children: [_jsx(WebsiteNavbar, {}), _jsx("div", { className: "h-16" }), _jsx(FullBleed, { children: _jsxs("section", { className: "bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20 px-4 sm:px-6 lg:px-8 text-center", children: [_jsx(Layers, { className: "mx-auto h-12 w-12 mb-4 text-yellow-300" }), _jsx("h1", { className: "text-3xl md:text-4xl font-bold mb-4", children: "Fitur SekolahIslamKu" }), _jsx("p", { className: "text-lg opacity-90 mb-6 max-w-2xl mx-auto", children: "Semua modul penting untuk operasional sekolah\u2014akademik, administrasi, keuangan, dan komunikasi\u2014tersedia dalam satu platform." })] }) }), _jsx(FullBleed, { children: _jsx("section", { className: "w-full px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [
                        {
                            icon: Users,
                            title: "Penerimaan Siswa Baru (PPDB)",
                            desc: "Form online, seleksi, verifikasi berkas, pembayaran, hingga penetapan kelas otomatis.",
                        },
                        {
                            icon: BookOpen,
                            title: "Akademik & Kurikulum",
                            desc: "RPP, penjadwalan, penilaian, rapor digital, kelulusan—semuanya tersentral.",
                        },
                        {
                            icon: Clock,
                            title: "Absensi & Kehadiran",
                            desc: "Scan QR/ID, izin/surat sakit, rekap kehadiran real-time untuk guru & siswa.",
                        },
                        {
                            icon: DollarSign,
                            title: "Keuangan & SPP",
                            desc: "Tagihan otomatis, pembayaran online, laporan keuangan transparan.",
                        },
                        {
                            icon: MessageSquare,
                            title: "Komunikasi & Notifikasi",
                            desc: "Kirim pengumuman via WhatsApp, email, dan notifikasi aplikasi.",
                        },
                        {
                            icon: Calendar,
                            title: "Kalender Akademik",
                            desc: "Atur jadwal ujian, libur, kegiatan sekolah dalam satu kalender digital.",
                        },
                        {
                            icon: Library,
                            title: "Inventaris & Perpustakaan",
                            desc: "Kelola buku, inventaris kelas, hingga peminjaman dan pengembalian.",
                        },
                    ].map((f) => (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6", children: [_jsx(f.icon, { className: "h-10 w-10 text-green-500 mb-3" }), _jsx("h3", { className: "font-semibold text-lg mb-2", children: f.title }), _jsx("p", { className: "text-sm opacity-80", children: f.desc })] }, f.title))) }) }), _jsx(FullBleed, { children: _jsx("section", { className: "w-full px-4 sm:px-6 lg:px-8 pb-12", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6", children: [_jsx("h3", { className: "font-semibold text-lg mb-4 text-center", children: "Keunggulan Platform" }), _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm", children: [
                                    "Implementasi cepat < 7 hari",
                                    "Satu dashboard terintegrasi",
                                    "Fleksibel & mudah digunakan",
                                    "Keamanan data terjamin",
                                ].map((adv) => (_jsxs("div", { className: "flex items-center gap-2 rounded-xl border px-3 py-2", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }), _jsx("span", { children: adv })] }, adv))) })] }) }) }), _jsx(FullBleed, { children: _jsx("footer", { className: "w-full bg-white dark:bg-gray-800 border-t border-black/5", children: _jsxs("div", { className: "w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4", children: [_jsx("p", { className: "text-sm opacity-80 text-center md:text-left", children: "Ingin tahu lebih banyak tentang fitur kami? Hubungi tim sales untuk demo gratis." }), _jsx("a", { href: "tel:+628123456789", className: "rounded-full px-4 py-2 text-sm font-medium bg-green-600 text-white hover:opacity-90 transition", children: "Hubungi Sales" })] }) }) })] }));
}
