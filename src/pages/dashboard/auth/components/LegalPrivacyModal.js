import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
export default function LegalModal({ open, onClose, initialTab = "tos", lastUpdated = "25 Agustus 2025", showAccept = false, onAccept, termsContent, privacyContent, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const [tab, setTab] = useState(initialTab);
    useEffect(() => setTab(initialTab), [initialTab, open]);
    // close on ESC
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);
    const panelRef = useRef(null);
    const styles = useMemo(() => ({
        overlay: {
            backgroundColor: isDark ? "#00000088" : "#00000066",
        },
        panel: {
            backgroundColor: theme.white1,
            borderColor: theme.white3,
            color: theme.black1,
        },
        muted: { color: theme.silver2 },
        tabBase: "px-3 py-1.5 rounded-full text-sm font-medium transition border",
    }), [theme, isDark]);
    if (!open)
        return null;
    const DefaultTerms = () => (_jsxs("div", { className: "space-y-3 text-sm leading-relaxed", style: { color: theme.black1 }, children: [_jsxs("p", { children: ["Selamat datang di ", _jsx("strong", { children: "SekolahIslamku Suite" }), ". Dengan menggunakan layanan ini, Anda menyetujui Syarat & Ketentuan berikut."] }), _jsxs("ol", { className: "list-decimal pl-5 space-y-2", children: [_jsxs("li", { children: [_jsx("strong", { children: "Akun & Keamanan." }), " Anda bertanggung jawab atas kerahasiaan kredensial dan seluruh aktivitas pada akun Anda."] }), _jsxs("li", { children: [_jsx("strong", { children: "Penggunaan yang Wajar." }), " Layanan digunakan sesuai ketentuan sekolah dan hukum yang berlaku. Larangan penyalahgunaan, spam, atau akses tidak sah."] }), _jsxs("li", { children: [_jsx("strong", { children: "Konten & Data." }), " Data milik institusi tetap menjadi milik institusi; kami mengelolanya sesuai kebijakan privasi."] }), _jsxs("li", { children: [_jsx("strong", { children: "Layanan." }), " Fitur dapat berubah/ditingkatkan dari waktu ke waktu untuk perbaikan layanan."] }), _jsxs("li", { children: [_jsx("strong", { children: "Penutup." }), " Pelanggaran berat dapat berakibat pembatasan atau penghentian akses."] })] }), _jsx("p", { className: "pt-2", style: styles.muted, children: "Versi ringkas. Versi lengkap tersedia atas permintaan institusi Anda." })] }));
    const DefaultPrivacy = () => (_jsxs("div", { className: "space-y-3 text-sm leading-relaxed", style: { color: theme.black1 }, children: [_jsx("p", { children: "Kebijakan Privasi ini menjelaskan bagaimana kami menangani informasi pribadi pengguna platform." }), _jsxs("ul", { className: "list-disc pl-5 space-y-2", children: [_jsxs("li", { children: [_jsx("strong", { children: "Pengumpulan Data:" }), " nama, email/username, peran, aktivitas pembelajaran/administrasi yang relevan."] }), _jsxs("li", { children: [_jsx("strong", { children: "Penggunaan:" }), " operasional platform, dukungan, analitik agregat untuk peningkatan layanan."] }), _jsxs("li", { children: [_jsx("strong", { children: "Berbagi:" }), " tidak dijual; dapat dibagikan dengan mitra pemroses data yang mematuhi perjanjian kerahasiaan."] }), _jsxs("li", { children: [_jsx("strong", { children: "Keamanan:" }), " enkripsi, kontrol akses berbasis peran, audit log."] }), _jsxs("li", { children: [_jsx("strong", { children: "Hak Anda:" }), " akses, koreksi, atau penghapusan sesuai kebijakan institusi dan peraturan yang berlaku."] })] }), _jsx("p", { className: "pt-2", style: styles.muted, children: "Untuk permintaan data, hubungi admin sekolah atau tim dukungan kami." })] }));
    return (_jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", "aria-modal": "true", role: "dialog", "aria-labelledby": "legal-title", style: styles.overlay, onClick: (e) => {
            // close only if clicking backdrop (not panel)
            if (e.target === e.currentTarget)
                onClose();
        }, children: _jsxs("div", { ref: panelRef, className: "w-full max-w-3xl rounded-2xl border shadow-xl overflow-hidden", style: styles.panel, children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b", style: { borderColor: theme.white3 }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ShieldCheck, { className: "h-5 w-5", style: { color: theme.primary } }), _jsx("h2", { id: "legal-title", className: "text-base font-semibold", children: "Kebijakan Layanan" })] }), _jsx("button", { onClick: onClose, "aria-label": "Tutup", className: "p-2 rounded-lg hover:opacity-80", style: { color: theme.silver2 }, children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "px-5 pt-4 flex items-center gap-2", children: [_jsx("button", { className: `${styles.tabBase} ${tab === "tos" ? "border-transparent" : "bg-transparent"}`, onClick: () => setTab("tos"), style: {
                                backgroundColor: tab === "tos" ? theme.primary : "transparent",
                                color: tab === "tos" ? theme.white1 : theme.black1,
                                borderColor: theme.white3,
                            }, children: "Syarat & Ketentuan" }), _jsx("button", { className: `${styles.tabBase} ${tab === "privacy" ? "border-transparent" : "bg-transparent"}`, onClick: () => setTab("privacy"), style: {
                                backgroundColor: tab === "privacy" ? theme.primary : "transparent",
                                color: tab === "privacy" ? theme.white1 : theme.black1,
                                borderColor: theme.white3,
                            }, children: "Kebijakan Privasi" }), _jsxs("span", { className: "ml-auto text-xs", style: styles.muted, children: ["Diperbarui: ", lastUpdated] })] }), _jsx("div", { className: "px-5 pb-5 pt-4 max-h-[70vh] overflow-y-auto space-y-4", style: { scrollbarWidth: "thin" }, children: tab === "tos"
                        ? (termsContent ?? _jsx(DefaultTerms, {}))
                        : (privacyContent ?? _jsx(DefaultPrivacy, {})) }), _jsxs("div", { className: "px-5 py-4 border-t flex items-center justify-end gap-2", style: { borderColor: theme.white3 }, children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 rounded-xl border", style: {
                                backgroundColor: isDark ? theme.white2 : theme.white1,
                                color: theme.black1,
                                borderColor: theme.white3,
                            }, children: "Tutup" }), showAccept && (_jsx("button", { onClick: onAccept, className: "px-4 py-2 rounded-xl font-medium", style: { backgroundColor: theme.primary, color: theme.white1 }, children: "Saya Setuju" }))] })] }) }));
}
