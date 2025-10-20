import { jsx as _jsx } from "react/jsx-runtime";
import { BeakerIcon, LayoutDashboardIcon, PieChartIcon, } from "lucide-react";
export const treasurerDesktopDataSidebar = [
    { text: "Beranda", icon: _jsx(BeakerIcon, {}), to: "/dkm" },
    { text: "Profil", icon: _jsx(LayoutDashboardIcon, {}), to: "/dkm/profil" },
    { text: "Keuangan", icon: _jsx(PieChartIcon, {}), to: "/dkm/keuangan" },
];
