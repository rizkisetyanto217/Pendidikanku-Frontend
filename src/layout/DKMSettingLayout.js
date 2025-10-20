import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import DashboardSidebar from "@/components/common/navigation/SidebarMenu";
import { Outlet, useLocation } from "react-router-dom";
import { UserIcon, MoonIcon, HelpingHandIcon, HandshakeIcon, } from "lucide-react";
export default function DKMSettingLayout() {
    const location = useLocation();
    const menus = [
        { name: "Profil", icon: _jsx(UserIcon, {}), to: "/dkm/profil-saya" },
        { name: "Tampilan", icon: _jsx(MoonIcon, {}), to: "/dkm/tampilan" },
        { name: "Dukung Kami", icon: _jsx(HelpingHandIcon, {}), to: "/dkm/dukung-kami" },
        { name: "Kerjasama", icon: _jsx(HandshakeIcon, {}), to: "/dkm/kerjasama" },
        { name: "Tanya Jawab", icon: _jsx(HelpingHandIcon, {}), to: "/dkm/tanya-jawab" },
    ];
    return (_jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "w-full md:w-64 shrink-0", children: _jsx(DashboardSidebar, { menus: menus, title: "Pengaturan", currentPath: location.pathname }) }), _jsx("div", { className: "flex-1", children: _jsx("div", { className: "rounded-xl shadow-sm", children: _jsx(Outlet, {}) }) })] }));
}
