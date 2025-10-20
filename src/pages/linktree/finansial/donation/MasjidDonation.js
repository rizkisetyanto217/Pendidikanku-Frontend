import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { pickTheme } from "@/constants/thema";
import useHtmlDarkMode from "@/hooks/useHTMLThema";
import PublicNavbar from "@/components/common/public/PublicNavbar";
import BottomNavbar from "@/components/common/public/ButtonNavbar";
import CommonActionButton from "@/components/common/main/CommonActionButton";
// ========================
// Sub-komponen: Card Donasi Masjid
// ========================
function MasjidDonationCard({ value, onChange, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { className: "p-4 rounded-xl shadow space-y-3", style: { backgroundColor: theme.white1 }, children: [_jsx("p", { className: "font-semibold text-sm md:text-base mb-1", style: { color: theme.success1 }, children: "Donasi Masjid" }), _jsx("input", { inputMode: "numeric", value: value, onChange: onChange, className: "w-full px-3 py-2 border rounded text-right text-sm md:text-base", style: {
                    backgroundColor: theme.white3,
                    color: theme.black1,
                    borderColor: theme.silver1,
                } }), _jsx("p", { className: "text-xs md:text-sm mt-1", style: { color: theme.silver2 }, children: "100% dana akan digunakan untuk operasional Masjid." })] }));
}
// ========================
// Sub-komponen: Card Dukungan Masjidku
// ========================
function MasjidkuDonationCard({ value, onChange, }) {
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    return (_jsxs("div", { className: "p-4 rounded-xl shadow space-y-3", style: { backgroundColor: theme.white1 }, children: [_jsx("p", { className: "font-semibold text-sm md:text-base mb-1", style: { color: theme.quaternary }, children: "Dukungan untuk Masjidku (opsional)" }), _jsx("input", { inputMode: "numeric", value: value, onChange: onChange, className: "w-full px-3 py-2 border rounded text-right text-sm md:text-base", style: {
                    backgroundColor: theme.white3,
                    color: theme.black1,
                    borderColor: theme.silver1,
                } }), _jsx("p", { className: "text-xs md:text-sm mt-1", style: { color: theme.silver2 }, children: "Diperuntukkan untuk pengembangan aplikasi Masjidku." }), _jsxs("a", { href: "#", className: "text-xs underline mt-1 inline-flex items-center space-x-1", style: { color: theme.silver2 }, children: [_jsx("span", { children: "\u2192" }), _jsx("span", { children: "Tentang proyek Masjidku" })] })] }));
}
// ========================
// Komponen Utama: Halaman Donasi
// ========================
export default function DonationMasjid() {
    const [masjidDonation, setMasjidDonation] = useState(0);
    const [masjidkuDonation, setMasjidkuDonation] = useState(0);
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isDark, themeName } = useHtmlDarkMode();
    const theme = pickTheme(themeName, isDark);
    const { data: masjidData, isLoading, isError, } = useQuery({
        queryKey: ["masjid-detail", slug],
        queryFn: async () => {
            const res = await axios.get(`/public/masjids/${slug}`);
            return res.data?.data;
        },
        enabled: !!slug,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });
    const formatCurrency = (value) => `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
    const handleCurrencyInput = (setter) => (e) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        setter(Math.max(Number(rawValue), 0));
    };
    const handleSubmit = () => {
        navigate(`/masjid/${masjidData?.masjid_slug}/donasi/konfirmasi?masjid=${masjidDonation}&masjidku=${masjidkuDonation}`);
    };
    if (isLoading || !masjidData)
        return _jsx("div", { children: "Loading..." });
    if (isError)
        return _jsx("div", { className: "text-red-500", children: "Gagal memuat data." });
    return (_jsxs(_Fragment, { children: [_jsx(PublicNavbar, { masjidName: "Donasi Saya" }), _jsx("section", { className: "pt-20", children: _jsxs("div", { className: "max-w-xl mx-auto space-y-4", children: [_jsx(MasjidDonationCard, { value: formatCurrency(masjidDonation), onChange: handleCurrencyInput(setMasjidDonation) }), _jsx(MasjidkuDonationCard, { value: formatCurrency(masjidkuDonation), onChange: handleCurrencyInput(setMasjidkuDonation) })] }) }), _jsxs("div", { className: "left-0 right-0 z-40 py-4 flex flex-col items-center space-y-2", children: [_jsxs("button", { className: "w-full max-w-xl flex justify-between items-center font-medium px-4 py-2 rounded text-sm md:text-base", style: {
                            backgroundColor: theme.quaternary,
                            color: theme.white1,
                        }, children: [_jsx("span", { children: "Lihat riwayat donasi saya" }), _jsx("span", { children: "\u203A" })] }), _jsx(CommonActionButton, { text: "Lanjut", onClick: handleSubmit, className: "w-full max-w-xl py-3 rounded text-sm md:text-base", style: {
                            backgroundColor: theme.primary,
                            color: theme.white1,
                        } })] }), _jsx(BottomNavbar, {})] }));
}
