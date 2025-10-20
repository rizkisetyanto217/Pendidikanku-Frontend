import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import SupportCard from '@/components/shared/profile/SupportCard';
import { Button } from '@/components/ui/button';
import useHtmlDarkMode from '@/hooks/userHTMLDarkMode';
import { colors } from '@/constants/colorsThema';
export default function Partnership() {
    const { isDark } = useHtmlDarkMode();
    const theme = isDark ? colors.dark : colors.light;
    return (_jsxs("div", { className: "p-6 rounded-xl shadow-sm space-y-4", style: {
            backgroundColor: theme.white1,
            color: theme.black1,
        }, children: [_jsx("p", { className: "text-sm", style: { color: theme.silver2 }, children: "Masjidku menawarkan kepada seluruh muslimin khususnya Masjid dan Lembaga Islam untuk saling bekerjasama dalam kebaikan dengan Masjidku." }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(SupportCard, { title: "\uD83C\uDF31 Masjidku", description: _jsxs(_Fragment, { children: ["Gabung bersama dalam satu aplikasi untuk management Masjid dan Lembaga.", _jsx("strong", { children: " Insya Allah 100% Gratis." })] }), action: _jsx(Button, { children: "Informasi" }) }), _jsx(SupportCard, { title: "\uD83D\uDCCA Aplikasi & Web Sendiri", description: "Buat khusus untuk Masjid dan Lembaga dengan branding aplikasi dan web sendiri bekerjasama dengan Masjidku.", action: _jsx(Button, { style: {
                                backgroundColor: theme.specialColor,
                                color: '#000000',
                            }, className: "hover:brightness-110 transition-colors", children: "Informasi" }) })] })] }));
}
