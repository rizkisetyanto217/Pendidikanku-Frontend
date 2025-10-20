import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { UserIcon, MoonIcon, HelpingHandIcon, HandshakeIcon, MessageCircleIcon, } from "lucide-react";
import PageHeaderUser from "@/components/common/home/PageHeaderUser";
import MasjidSidebarMenu from "@/components/common/navigation/MasjidSidebarMenu";
export default function MasjidSettingLayout() {
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
    return (_jsxs(_Fragment, { children: [_jsx(PageHeaderUser, { title: "Pengaturan", onBackClick: () => window.history.length > 1 && history.back() }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "md:w-48 shrink-0", children: _jsx(MasjidSidebarMenu, { menus: menus, title: "Pengaturan", currentPath: location.pathname }) }), _jsx("div", { className: "flex-1", children: _jsx("div", { className: "", children: _jsx(Outlet, {}) }) })] })] }));
}
