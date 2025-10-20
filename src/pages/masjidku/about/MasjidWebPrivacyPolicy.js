import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/website/PrivacyPolicy.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import WebsiteFooter from "../website/components/MasjidkuWebFooter";
import WebsiteNavbar from "@/components/common/public/WebsiteNavbar";
/* ====== Utilities layout (samain feel dengan Home) ====== */
const FullBleed = ({ className = "", children }) => (_jsx("div", { className: `relative left-1/2 right-1/2 -mx-[50vw] w-screen ${className}`, children: children }));
const Section = ({ id, className = "", children }) => (_jsx("section", { id: id, className: `px-4 sm:px-6 lg:px-8 ${className}`, children: _jsx("div", { className: "w-full", children: children }) }));
export default function MasjidWebPrivacyPolicy() {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const bgGradient = isDark
        ? `linear-gradient(180deg, ${theme.white1} 0%, ${theme.white2} 100%)`
        : `linear-gradient(180deg, ${theme.white2} 0%, ${theme.white1} 100%)`;
    const updatedAt = useMemo(() => new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }), []);
    const sections = [
        {
            id: "informasi-yang-kami-kumpulkan",
            title: "1. Informasi yang Kami Kumpulkan",
            content: (_jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [_jsxs("li", { children: [_jsx("strong", { children: "Informasi Pribadi" }), ": nama, email, nomor telepon, institusi."] }), _jsxs("li", { children: [_jsx("strong", { children: "Informasi Akun" }), ": username, kata sandi (terenkripsi)."] }), _jsxs("li", { children: [_jsx("strong", { children: "Data Aktivitas" }), ": catatan login, aktivitas belajar, progres akademik."] }), _jsxs("li", { children: [_jsx("strong", { children: "Data Teknis" }), ": IP, perangkat, browser, cookies, log server."] }), _jsxs("li", { children: [_jsx("strong", { children: "Data Pembayaran" }), " (jika ada): metode & status transaksi (tanpa menyimpan detail kartu)."] })] })),
        },
        {
            id: "penggunaan-informasi",
            title: "2. Penggunaan Informasi",
            content: (_jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [_jsx("li", { children: "Menyediakan, mengelola, dan meningkatkan layanan SekolahIslamku." }), _jsx("li", { children: "Autentikasi dan manajemen akun." }), _jsx("li", { children: "Dukungan pelanggan dan notifikasi terkait layanan." }), _jsx("li", { children: "Analitik untuk peningkatan pengalaman pengguna." }), _jsx("li", { children: "Memenuhi kewajiban hukum yang berlaku." })] })),
        },
        {
            id: "penyimpanan-dan-keamanan",
            title: "3. Penyimpanan dan Keamanan Data",
            content: (_jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [_jsx("li", { children: "Penyimpanan pada infrastruktur tepercaya, akses dibatasi berdasarkan otorisasi." }), _jsx("li", { children: "Penggunaan enkripsi dan praktik keamanan yang wajar." }), _jsx("li", { children: "Perlu diingat, transmisi internet tidak pernah 100% aman." })] })),
        },
        {
            id: "berbagi-dengan-pihak-ketiga",
            title: "4. Berbagi Informasi dengan Pihak Ketiga",
            content: (_jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [_jsxs("li", { children: [_jsx("strong", { children: "Tidak menjual/menyewakan" }), " data pribadi."] }), _jsx("li", { children: "Penyedia layanan (hosting, pembayaran, analitik) untuk operasional." }), _jsx("li", { children: "Otoritas hukum jika diwajibkan peraturan." })] })),
        },
        {
            id: "hak-anda",
            title: "5. Hak Anda",
            content: (_jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [_jsx("li", { children: "Mengakses, memperbarui, atau menghapus data pribadi." }), _jsx("li", { children: "Menolak/membatasi pemrosesan tertentu." }), _jsx("li", { children: "Menarik persetujuan (sebagian layanan mungkin terbatas)." }), _jsx("li", { children: "Hubungi kami untuk menjalankan hak-hak ini." })] })),
        },
        {
            id: "cookies",
            title: "6. Cookies",
            content: (_jsx("p", { children: "Kami menggunakan cookies untuk mengingat preferensi dan menganalisis penggunaan. Anda dapat menonaktifkan cookies di pengaturan browser; beberapa fitur mungkin tidak berfungsi optimal." })),
        },
        {
            id: "perubahan-kebijakan",
            title: "7. Perubahan Kebijakan Privasi",
            content: (_jsx("p", { children: "Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan akan dipublikasikan pada halaman ini dengan tanggal \u201CTerakhir diperbarui\u201D." })),
        },
        {
            id: "kontak",
            title: "8. Kontak Kami",
            content: (_jsxs("div", { className: "space-y-1", children: [_jsx("p", { children: "Jika ada pertanyaan/permintaan terkait privasi:" }), _jsxs("p", { children: ["\uD83D\uDCE7", " ", _jsx("a", { href: "mailto:support@sekolahislamku.id", style: { color: theme.primary }, children: "support@sekolahislamku.id" })] }), _jsxs("p", { children: ["\uD83C\uDF10", " ", _jsx("a", { href: "https://www.sekolahislamku.id", target: "_blank", rel: "noreferrer", style: { color: theme.primary }, children: "www.sekolahislamku.id" })] })] })),
        },
    ];
    return (_jsx(FullBleed, { children: _jsxs("div", { className: "min-h-screen overflow-x-hidden w-screen", style: { background: bgGradient, color: theme.black1 }, children: [_jsx(WebsiteNavbar, {}), _jsx("div", { style: { height: "5.5rem" } }), _jsx(Section, { className: "py-12 md:py-16", children: _jsxs("div", { className: "mx-auto max-w-4xl rounded-3xl p-6 sm:p-8 shadow-sm border", style: { backgroundColor: theme.white2, borderColor: theme.white3 }, children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold", style: { color: theme.black1 }, children: "Kebijakan Privasi" }), _jsxs("p", { className: "mt-1 text-sm", style: { color: theme.silver2 }, children: ["Terakhir diperbarui: ", updatedAt] })] }), _jsx(Link, { to: "/website", className: "text-sm underline", style: { color: theme.primary }, children: "Kembali ke Beranda" })] }), _jsx("div", { className: "mt-6 grid gap-2 sm:grid-cols-2", children: sections.map((s) => (_jsx("a", { href: `#${s.id}`, className: "text-sm", style: { color: theme.primary }, children: s.title }, s.id))) }), _jsxs("div", { className: "mt-8 space-y-8", children: [_jsx("p", { style: { color: theme.black1 }, children: "SekolahIslamku (\u201Ckami\u201D) berkomitmen melindungi dan menghormati privasi Anda. Kebijakan ini menjelaskan cara kami mengumpulkan, menggunakan, menyimpan, serta melindungi informasi pribadi saat Anda menggunakan layanan kami (web maupun aplikasi)." }), sections.map((s) => (_jsxs("section", { id: s.id, className: "scroll-mt-24", children: [_jsx("h2", { className: "text-lg font-semibold", style: { color: theme.black1 }, children: s.title }), _jsx("div", { className: "mt-2 text-sm leading-6", style: { color: theme.black1 }, children: s.content })] }, s.id))), _jsx("p", { className: "text-xs", style: { color: theme.silver2 }, children: "Dengan menggunakan layanan kami, Anda menyatakan telah membaca dan memahami Kebijakan Privasi ini." })] })] }) }), _jsx(WebsiteFooter, {})] }) }));
}
