import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useLocation, useParams } from "react-router-dom";
import { UserIcon, MoonIcon, HelpingHandIcon, HandshakeIcon, MessageCircleIcon, } from "lucide-react";
export default function MasjidSettingMenu() {
    const location = useLocation();
    const { slug } = useParams();
    const base = `/masjid/${slug}`;
    const menus = [
        {
            name: "Profil",
            icon: _jsx(UserIcon, {}),
            to: `${base}/aktivitas/pengaturan/profil-saya`,
        },
        {
            name: "Tampilan",
            icon: _jsx(MoonIcon, {}),
            to: `${base}/aktivitas/pengaturan/tampilan`,
        },
        {
            name: "Dukung Kami",
            icon: _jsx(HelpingHandIcon, {}),
            to: `${base}/aktivitas/pengaturan/dukung-kami`,
        },
        {
            name: "Kerjasama",
            icon: _jsx(HandshakeIcon, {}),
            to: `${base}/aktivitas/pengaturan/kerjasama`,
        },
        {
            name: "Tanya Jawab",
            icon: _jsx(MessageCircleIcon, {}),
            to: `${base}/aktivitas/pengaturan/tanya-jawab`,
        },
    ];
    return (_jsx(_Fragment, { children: _jsx("div", { className: "flex-1", children: _jsx("div", { className: "md:hidden space-y-2", children: menus.map((menu) => (_jsxs("a", { href: menu.to, className: `flex items-center gap-2 p-3 rounded border ${location.pathname === menu.to
                        ? "bg-gray-100 dark:bg-gray-800"
                        : ""}`, children: [menu.icon, _jsx("span", { children: menu.name })] }, menu.to))) }) }) }));
}
