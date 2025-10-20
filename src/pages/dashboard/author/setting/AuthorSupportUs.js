import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/dkm/setting/DukunganKami.tsx
import SupportCard from '@/components/shared/profile/SupportCard';
import { Button } from '@/components/ui/button';
import useHtmlDarkMode from '@/hooks/userHTMLDarkMode';
import { colors } from '@/constants/colorsThema';
export default function SupportUs() {
    const { isDark } = useHtmlDarkMode();
    const theme = isDark ? colors.dark : colors.light;
    return (_jsx("div", { className: "p-6 rounded-xl shadow-sm", style: {
            backgroundColor: theme.white1,
            color: theme.black1,
        }, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(SupportCard, { title: "\uD83C\uDF31 Donasi", description: "Bantu kami untuk keberlangsungan aplikasi dan layanan.", action: _jsx(Button, { children: "Donasi" }) }), _jsx(SupportCard, { title: "\uD83D\uDCCA Bagikan", description: "Sebarkan informasi ini kepada kaum muslimin, pengurus Masjid dan lembaga agar sama-sama berkembang.", action: _jsx(Button, { variant: "secondary", children: "Bagikan" }) }), _jsx(SupportCard, { title: "\u2B07\uFE0F Unduh Aplikasi Masjidku", description: _jsx("div", { className: "space-y-1 text-sm", children: [
                            'Masjidku untuk Android',
                            'Masjidku untuk iOS',
                            'Website Masjidku',
                        ].map((text, idx) => (_jsx("p", { children: _jsx("a", { href: "#", className: "underline transition-colors", style: {
                                    color: theme.black1,
                                }, onMouseEnter: (e) => (e.currentTarget.style.color = theme.silver2), onMouseLeave: (e) => (e.currentTarget.style.color = theme.black1), children: text }) }, idx))) }) }), _jsx(SupportCard, { title: "\uD83D\uDCAC Beri Masukan dan Saran", description: "Mohon berikan masukan dan saran. Sangat berarti bagi kami dalam meningkatkan layanan kedepannya.", action: _jsx(Button, { variant: "outline", children: "Masukan dan Saran" }) })] }) }));
}
